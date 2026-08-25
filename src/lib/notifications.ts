import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey && resendApiKey !== 're_xxxxxxxxxxxxxxxx' ? new Resend(resendApiKey) : null
const adminEmail = process.env.ADMIN_ALERT_EMAIL || 'contato@catuto.com.br'

interface LeadNotificationParams {
  name: string
  email: string
  phone: string
  company: string
  service: string
  message: string
}

interface UptimeAlertParams {
  monitorName: string
  url: string
  status: 'offline' | 'degraded' | 'recovered'
  statusCode?: number | null
  latencyMs?: number | null
  errorMessage?: string | null
  timestamp: string
}

/**
 * Envia notificação por E-mail via Resend
 */
export async function sendEmailAlert({
  subject,
  html,
  to,
}: {
  subject: string
  html: string
  to?: string
}) {
  if (!resend) {
    console.warn('[Notifications] Resend API Key não configurada ou inválida. E-mail simulado:', {
      subject,
      to: to || adminEmail,
    })
    return { success: false, error: 'Resend API Key não configurada' }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Catuto Alerts <onboarding@resend.dev>', // Ou domínio personalizado verificado
      to: to || adminEmail,
      subject,
      html,
    })

    if (error) {
      console.error('[Notifications] Erro ao enviar e-mail:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (err) {
    console.error('[Notifications] Falha crítica no envio de e-mail:', err)
    return { success: false, error: err }
  }
}

/**
 * Envia notificação para WhatsApp (preparado para Evolution API / Z-API / Webhooks)
 */
export async function sendWhatsAppMessage({ message }: { message: string }) {
  const endpoint = process.env.WHATSAPP_API_ENDPOINT
  const apiKey = process.env.WHATSAPP_API_KEY
  const number = process.env.ADMIN_WHATSAPP_NUMBER

  if (!endpoint || !apiKey || !number) {
    // Modo silencioso caso ainda não esteja configurado no .env
    return { success: false, error: 'Credenciais de WhatsApp não preenchidas' }
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        apikey: apiKey,
      },
      body: JSON.stringify({
        number,
        message,
        text: message,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[Notifications] Erro na API do WhatsApp:', errorText)
      return { success: false, error: errorText }
    }

    return { success: true }
  } catch (err) {
    console.error('[Notifications] Erro ao disparar WhatsApp:', err)
    return { success: false, error: err }
  }
}

/**
 * Notifica sobre novo lead recebido no formulário de contato
 */
export async function notifyNewLead(lead: LeadNotificationParams) {
  const emailSubject = `🚀 Novo Lead B2B: ${lead.company} (${lead.name})`
  const emailHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0b0f19; color: #f3f4f6; border-radius: 12px; padding: 24px; border: 1px solid #1f293d;">
      <h2 style="color: #60a5fa; margin-top: 0;">Novo Contato Comercial Recebido - Catuto</h2>
      <p style="font-size: 15px; color: #9ca3af;">Um novo potencial cliente enviou uma solicitação de proposta no website:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #1e293b; color: #94a3b8; width: 35%;"><strong>Nome:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #1e293b; color: #f8fafc;">${lead.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #1e293b; color: #94a3b8;"><strong>Empresa:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #1e293b; color: #f8fafc;"><strong>${lead.company}</strong></td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #1e293b; color: #94a3b8;"><strong>E-mail:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #1e293b; color: #38bdf8;"><a href="mailto:${lead.email}" style="color: #38bdf8;">${lead.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #1e293b; color: #94a3b8;"><strong>WhatsApp / Tel:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #1e293b; color: #4ade80;">${lead.phone}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #1e293b; color: #94a3b8;"><strong>Interesse:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #1e293b; color: #f8fafc;">${lead.service}</td>
        </tr>
      </table>

      <div style="background: #111827; padding: 16px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-top: 16px;">
        <strong style="color: #93c5fd; display: block; margin-bottom: 6px;">Mensagem do Cliente:</strong>
        <p style="margin: 0; color: #e2e8f0; line-height: 1.5; white-space: pre-wrap;">${lead.message}</p>
      </div>

      <p style="font-size: 12px; color: #64748b; margin-top: 24px; text-align: center;">
        Catuto Platform • Sistema Integrado de Notificações B2B
      </p>
    </div>
  `

  const whatsappMessage = `*🚀 NOVO LEAD RECEBIDO - CATUTO*\n\n` +
    `*Empresa:* ${lead.company}\n` +
    `*Nome:* ${lead.name}\n` +
    `*E-mail:* ${lead.email}\n` +
    `*WhatsApp:* ${lead.phone}\n` +
    `*Interesse:* ${lead.service}\n\n` +
    `*Mensagem:* ${lead.message}`

  await Promise.allSettled([
    sendEmailAlert({ subject: emailSubject, html: emailHtml }),
    sendWhatsAppMessage({ message: whatsappMessage }),
  ])
}

/**
 * Notifica sobre evento de monitoramento / Uptime
 */
export async function notifyUptimeEvent(alert: UptimeAlertParams) {
  const isRecovered = alert.status === 'recovered'
  const statusEmoji = isRecovered ? '✅' : '🚨'
  const statusTitle = isRecovered
    ? `Site Recuperado: ${alert.monitorName}`
    : `ALERTA DE QUEDA: ${alert.monitorName} está ${alert.status.toUpperCase()}`

  const emailSubject = `${statusEmoji} [Uptime Catuto] ${statusTitle}`
  const statusBg = isRecovered ? '#052e16' : '#450a0a'
  const statusColor = isRecovered ? '#4ade80' : '#f87171'

  const emailHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0e17; color: #f3f4f6; border-radius: 12px; padding: 24px; border: 1px solid #1e293b;">
      <div style="background: ${statusBg}; color: ${statusColor}; padding: 12px 16px; border-radius: 8px; font-weight: bold; margin-bottom: 20px; font-size: 16px;">
        ${statusEmoji} ${statusTitle}
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 8px 0; color: #94a3b8;"><strong>URL Monitorada:</strong></td>
          <td style="padding: 8px 0; color: #38bdf8;"><a href="${alert.url}" target="_blank" style="color: #38bdf8;">${alert.url}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #94a3b8;"><strong>Status HTTP:</strong></td>
          <td style="padding: 8px 0; color: #f8fafc;">${alert.statusCode || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #94a3b8;"><strong>Latência:</strong></td>
          <td style="padding: 8px 0; color: #f8fafc;">${alert.latencyMs ? `${alert.latencyMs} ms` : 'Timeout'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #94a3b8;"><strong>Horário:</strong></td>
          <td style="padding: 8px 0; color: #f8fafc;">${alert.timestamp}</td>
        </tr>
        ${
          alert.errorMessage
            ? `<tr>
                <td style="padding: 8px 0; color: #94a3b8;"><strong>Detalhes do Erro:</strong></td>
                <td style="padding: 8px 0; color: #f87171;">${alert.errorMessage}</td>
              </tr>`
            : ''
        }
      </table>

      <p style="font-size: 12px; color: #64748b; text-align: center; margin-top: 24px;">
        Catuto Uptime Monitor • Notificação Automatizada
      </p>
    </div>
  `

  const whatsappMessage = `${statusEmoji} *ALERTA UPTIME CATUTO*\n\n` +
    `*Monitor:* ${alert.monitorName}\n` +
    `*URL:* ${alert.url}\n` +
    `*Status:* ${alert.status.toUpperCase()}\n` +
    `*Código HTTP:* ${alert.statusCode || 'Timeout'}\n` +
    `*Latência:* ${alert.latencyMs ? `${alert.latencyMs}ms` : 'N/A'}\n` +
    `*Horário:* ${alert.timestamp}`

  await Promise.allSettled([
    sendEmailAlert({ subject: emailSubject, html: emailHtml }),
    sendWhatsAppMessage({ message: whatsappMessage }),
  ])
}
