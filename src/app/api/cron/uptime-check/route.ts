import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { notifyUptimeEvent } from '@/lib/notifications'

export const dynamic = 'force-dynamic'
export const maxDuration = 60 // Até 60 segundos no edge/serverless

export async function GET(request: NextRequest) {
  return handleUptimeCheck(request)
}

export async function POST(request: NextRequest) {
  return handleUptimeCheck(request)
}

async function handleUptimeCheck(request: NextRequest) {
  try {
    // 1. Validação de Segurança via CRON_SECRET
    const cronSecret = process.env.CRON_SECRET || 'catuto_secret_monitor_token_2026'
    const authHeader = request.headers.get('authorization')
    const querySecret = request.nextUrl.searchParams.get('secret') || request.nextUrl.searchParams.get('key')

    const providedSecret = authHeader?.startsWith('Bearer ')
      ? authHeader.replace('Bearer ', '').trim()
      : querySecret

    if (!providedSecret || providedSecret !== cronSecret) {
      return NextResponse.json(
        {
          success: false,
          error: 'Acesso não autorizado. Informe o cabeçalho Authorization: Bearer CRON_SECRET válido.',
        },
        { status: 401 }
      )
    }

    const supabase = createAdminClient()

    // 2. Busca todos os monitores ativos
    const { data: monitors, error: monError } = await supabase
      .from('client_monitors')
      .select('*')
      .eq('is_active', true)

    if (monError) {
      console.error('[UptimeCheckCron] Erro ao buscar monitores:', monError)
      return NextResponse.json({ success: false, error: monError.message }, { status: 500 })
    }

    if (!monitors || monitors.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Nenhum monitor ativo encontrado para verificação.',
        total_checked: 0,
      })
    }

    const results = []
    const now = new Date().toISOString()
    const timestampFormatted = new Date().toLocaleString('pt-BR')

    // 3. Executa a varredura paralela com timeout de 8 segundos por requisição
    for (const monitor of monitors) {
      const startTime = performance.now()
      let statusCode: number | null = null
      let isUp = false
      let errorMessage: string | null = null
      let responseTimeMs = 0

      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000)

        const response = await fetch(monitor.url, {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'User-Agent': 'Catuto-UptimeBot/1.0 (+https://catuto.com.br)',
          },
          cache: 'no-store',
        })

        clearTimeout(timeoutId)
        const endTime = performance.now()
        responseTimeMs = Math.round(endTime - startTime)
        statusCode = response.status
        isUp = statusCode === (monitor.expected_status || 200) || (statusCode >= 200 && statusCode < 300)
      } catch (fetchErr: any) {
        const endTime = performance.now()
        responseTimeMs = Math.round(endTime - startTime)
        isUp = false
        errorMessage = fetchErr.name === 'AbortError' ? 'Timeout após 8 segundos' : fetchErr.message
      }

      const previousFailures = monitor.consecutive_failures || 0
      const newFailures = isUp ? 0 : previousFailures + 1

      // 4. Registra log na tabela uptime_logs
      await supabase.from('uptime_logs').insert({
        monitor_id: monitor.id,
        status_code: statusCode,
        response_time_ms: responseTimeMs,
        is_up: isUp,
        error_message: errorMessage,
        checked_at: now,
      })

      // 5. Atualiza o status do monitor
      await supabase
        .from('client_monitors')
        .update({
          last_status: statusCode || (errorMessage ? 504 : 500),
          last_checked_at: now,
          consecutive_failures: newFailures,
        })
        .eq('id', monitor.id)

      // 6. Disparo de Alerta após 2 falhas consecutivas ou status de erro crítico
      if (newFailures === 2) {
        await notifyUptimeEvent({
          monitorName: monitor.name,
          url: monitor.url,
          status: responseTimeMs > 3500 ? 'degraded' : 'offline',
          statusCode,
          latencyMs: responseTimeMs,
          errorMessage,
          timestamp: timestampFormatted,
        })
      }

      // 7. Disparo de Recuperação (Site voltou a responder 200 OK após queda)
      if (isUp && previousFailures >= 2) {
        await notifyUptimeEvent({
          monitorName: monitor.name,
          url: monitor.url,
          status: 'recovered',
          statusCode,
          latencyMs: responseTimeMs,
          timestamp: timestampFormatted,
        })
      }

      results.push({
        id: monitor.id,
        name: monitor.name,
        url: monitor.url,
        status_code: statusCode,
        latency_ms: responseTimeMs,
        is_up: isUp,
        consecutive_failures: newFailures,
        error: errorMessage,
      })
    }

    const totalUp = results.filter((r) => r.is_up).length
    const totalDown = results.filter((r) => !r.is_up).length

    return NextResponse.json({
      success: true,
      timestamp: now,
      summary: {
        total_checked: results.length,
        online: totalUp,
        offline: totalDown,
      },
      results,
    })
  } catch (err: any) {
    console.error('[UptimeCheckCron] Falha crítica:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
