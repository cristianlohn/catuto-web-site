import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(request: NextRequest) {
  try {
    let body: any = {}

    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ ok: false, error: 'JSON inválido' }, { status: 400, headers: corsHeaders })
    }

    const {
      monitor_id,
      domain,
      path = '/',
      referrer = 'direct',
      device_type = 'desktop',
      browser = 'other',
      session_id,
    } = body

    if (!domain) {
      return NextResponse.json({ ok: false, error: 'Domínio obrigatório' }, { status: 400, headers: corsHeaders })
    }

    const supabase = createAdminClient()
    let resolvedMonitorId = monitor_id

    // Se não veio o monitor_id, tenta localizar pelo domínio cadastrado nos monitores
    if (!resolvedMonitorId) {
      const cleanDomain = domain.replace(/^www\./, '').toLowerCase()
      const { data: found } = await supabase
        .from('client_monitors')
        .select('id')
        .ilike('url', `%${cleanDomain}%`)
        .limit(1)

      if (found && found[0]) {
        resolvedMonitorId = found[0].id
      }
    }

    // Grava a visualização de página na tabela site_pageviews
    const { error: insertError } = await supabase.from('site_pageviews').insert({
      monitor_id: resolvedMonitorId || null,
      domain: domain.toLowerCase(),
      path: path.slice(0, 500),
      referrer: (referrer || 'direct').slice(0, 255),
      device_type: device_type || 'desktop',
      browser: browser || 'other',
      session_id: session_id ? session_id.slice(0, 100) : null,
    })

    if (insertError) {
      // Falha silenciosa para não travar o cliente caso a tabela ainda esteja em migração
      console.warn('[AnalyticsTrack] Erro ao gravar pageview:', insertError.message)
    }

    return NextResponse.json({ ok: true }, { headers: corsHeaders })
  } catch (err: any) {
    console.error('[AnalyticsTrack] Falha crítica:', err)
    return NextResponse.json({ ok: false }, { status: 500, headers: corsHeaders })
  }
}
