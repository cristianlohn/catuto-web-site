'use server'

import { createAdminClient, createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { notifyUptimeEvent } from '@/lib/notifications'
import { ClientMonitor, UptimeLog } from '@/types/database'

export interface MonitorWithStats extends ClientMonitor {
  last_latency_ms?: number | null
  recent_logs?: UptimeLog[]
}

// 1. Obter todos os monitores com estatísticas recentes
export async function getClientMonitorsAction(): Promise<{
  success: boolean
  data: MonitorWithStats[]
  error?: string
}> {
  try {
    const supabase = createAdminClient()

    const { data: monitors, error } = await supabase
      .from('client_monitors')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return { success: false, data: [], error: error.message }
    }

    // Busca os últimos 5 logs de cada monitor para montar mini-gráficos/sparklines
    const monitorsWithStats: MonitorWithStats[] = await Promise.all(
      (monitors || []).map(async (m) => {
        const { data: logs } = await supabase
          .from('uptime_logs')
          .select('*')
          .eq('monitor_id', m.id)
          .order('checked_at', { ascending: false })
          .limit(10)

        const latestLog = logs && logs[0] ? logs[0] : null

        return {
          ...m,
          last_latency_ms: latestLog?.response_time_ms || null,
          recent_logs: (logs || []).reverse(),
        }
      })
    )

    return { success: true, data: monitorsWithStats }
  } catch (err: any) {
    return { success: false, data: [], error: err.message }
  }
}

// 2. Criar novo monitor
export async function createMonitorAction(formData: {
  name: string
  url: string
  expected_status?: number
}) {
  try {
    const authClient = await createClient()
    const {
      data: { user },
    } = await authClient.auth.getUser()

    if (!user) {
      return { success: false, error: 'Sessão expirada. Faça login novamente.' }
    }

    let cleanUrl = formData.url.trim()
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`
    }

    try {
      new URL(cleanUrl)
    } catch {
      return { success: false, error: 'URL inválida. Verifique o formato informado.' }
    }

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('client_monitors')
      .insert({
        name: formData.name.trim(),
        url: cleanUrl,
        expected_status: formData.expected_status || 200,
        is_active: true,
        last_status: null,
        consecutive_failures: 0,
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    // Executa uma primeira checagem imediata em background
    if (data) {
      await triggerSingleCheckAction(data.id)
    }

    revalidatePath('/admin/clientes-status')
    return { success: true, data, message: 'Monitor cadastrado com sucesso!' }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

// 3. Atualizar monitor
export async function updateMonitorAction(
  id: string,
  formData: {
    name: string
    url: string
    expected_status?: number
    is_active?: boolean
  }
) {
  try {
    const authClient = await createClient()
    const {
      data: { user },
    } = await authClient.auth.getUser()

    if (!user) {
      return { success: false, error: 'Sessão expirada. Faça login novamente.' }
    }

    let cleanUrl = formData.url.trim()
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`
    }

    const supabase = createAdminClient()
    const { error } = await supabase
      .from('client_monitors')
      .update({
        name: formData.name.trim(),
        url: cleanUrl,
        expected_status: formData.expected_status || 200,
        is_active: formData.is_active !== undefined ? formData.is_active : true,
      })
      .eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/clientes-status')
    return { success: true, message: 'Monitor atualizado com sucesso!' }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

// 4. Excluir monitor
export async function deleteMonitorAction(id: string) {
  try {
    const authClient = await createClient()
    const {
      data: { user },
    } = await authClient.auth.getUser()

    if (!user) {
      return { success: false, error: 'Sessão expirada. Faça login novamente.' }
    }

    const supabase = createAdminClient()

    // Exclui os logs associados primeiro para integridade
    await supabase.from('uptime_logs').delete().eq('monitor_id', id)

    const { error } = await supabase.from('client_monitors').delete().eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/clientes-status')
    return { success: true, message: 'Monitor e histórico removidos com sucesso!' }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

// 5. Alternar status ativo/pausado
export async function toggleMonitorStatusAction(id: string, isActive: boolean) {
  try {
    const supabase = createAdminClient()
    const { error } = await supabase
      .from('client_monitors')
      .update({ is_active: isActive })
      .eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/clientes-status')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

// 6. Ping Manual Imediato (Testar Agora)
export async function triggerSingleCheckAction(id: string) {
  try {
    const supabase = createAdminClient()

    const { data: monitor, error: monError } = await supabase
      .from('client_monitors')
      .select('*')
      .eq('id', id)
      .single()

    if (monError || !monitor) {
      return { success: false, error: 'Monitor não encontrado.' }
    }

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

    const now = new Date().toISOString()
    const previousFailures = monitor.consecutive_failures || 0
    const newFailures = isUp ? 0 : previousFailures + 1

    // Grava log
    await supabase.from('uptime_logs').insert({
      monitor_id: monitor.id,
      status_code: statusCode,
      response_time_ms: responseTimeMs,
      is_up: isUp,
      error_message: errorMessage,
      checked_at: now,
    })

    // Atualiza monitor
    await supabase
      .from('client_monitors')
      .update({
        last_status: statusCode || (errorMessage ? 504 : 500),
        last_checked_at: now,
        consecutive_failures: newFailures,
      })
      .eq('id', monitor.id)

    // Se 2 falhas consecutivas, dispara notificação de queda
    if (newFailures === 2) {
      await notifyUptimeEvent({
        monitorName: monitor.name,
        url: monitor.url,
        status: responseTimeMs > 3000 ? 'degraded' : 'offline',
        statusCode,
        latencyMs: responseTimeMs,
        errorMessage,
        timestamp: new Date().toLocaleString('pt-BR'),
      })
    }

    // Se recuperado após falha anterior
    if (isUp && previousFailures >= 2) {
      await notifyUptimeEvent({
        monitorName: monitor.name,
        url: monitor.url,
        status: 'recovered',
        statusCode,
        latencyMs: responseTimeMs,
        timestamp: new Date().toLocaleString('pt-BR'),
      })
    }

    revalidatePath('/admin/clientes-status')

    return {
      success: true,
      isUp,
      statusCode,
      latencyMs: responseTimeMs,
      errorMessage,
    }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

// 7. Obter Histórico de Logs de um Monitor
export async function getMonitorLogsAction(monitorId: string): Promise<{
  success: boolean
  logs: UptimeLog[]
  error?: string
}> {
  try {
    const supabase = createAdminClient()
    const { data: logs, error } = await supabase
      .from('uptime_logs')
      .select('*')
      .eq('monitor_id', monitorId)
      .order('checked_at', { ascending: false })
      .limit(50)

    if (error) {
      return { success: false, logs: [], error: error.message }
    }

    return { success: true, logs: logs || [] }
  } catch (err: any) {
    return { success: false, logs: [], error: err.message }
  }
}
