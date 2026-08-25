'use server'

import { contactFormSchema } from '@/lib/validations/contact'
import { createAdminClient } from '@/lib/supabase/server'
import { notifyNewLead } from '@/lib/notifications'

export async function submitContactForm(formData: unknown) {
  try {
    const parseResult = contactFormSchema.safeParse(formData)

    if (!parseResult.success) {
      const errorFormatted = parseResult.error.flatten().fieldErrors
      return {
        success: false,
        error: 'Dados do formulário inválidos. Por favor, revise os campos.',
        fieldErrors: errorFormatted,
      }
    }

    const { name, email, phone, company, service, message } = parseResult.data

    // Salva no banco de dados Supabase via Admin Client para segurança
    const supabase = createAdminClient()
    const { error: dbError } = await supabase.from('contact_messages').insert({
      name,
      email,
      phone,
      company,
      service,
      message,
      status: 'new',
    })

    if (dbError) {
      console.error('[submitContactForm] Erro ao salvar mensagem no banco:', dbError)
      // Não trava caso o banco tenha alguma restrição passageira, tenta enviar as notificações
    }

    // Dispara notificações instantâneas por e-mail e WhatsApp
    await notifyNewLead({
      name,
      email,
      phone,
      company,
      service,
      message,
    })

    return {
      success: true,
      message: 'Solicitação recebida com sucesso! Nossa equipe entrará em contato em até 2 horas úteis.',
    }
  } catch (error) {
    console.error('[submitContactForm] Erro inesperado:', error)
    return {
      success: false,
      error: 'Ocorreu um erro ao enviar sua solicitação. Tente novamente ou chame no WhatsApp.',
    }
  }
}
