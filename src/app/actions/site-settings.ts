'use server'

import { siteSettingsSchema } from '@/lib/validations/site-settings'
import { createAdminClient, createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateSiteSettingsAction(formData: unknown) {
  try {
    // 1. Validar autenticação do usuário
    const authClient = await createClient()
    const {
      data: { user },
    } = await authClient.auth.getUser()

    if (!user) {
      return {
        success: false,
        error: 'Sessão expirada. Faça login novamente para salvar.',
      }
    }

    // 2. Validar payload com Zod
    const parseResult = siteSettingsSchema.safeParse(formData)

    if (!parseResult.success) {
      return {
        success: false,
        error: 'Dados inválidos. Por favor, revise os campos do formulário.',
        fieldErrors: parseResult.error.flatten().fieldErrors,
      }
    }

    const payload = parseResult.data
    const supabase = createAdminClient()

    // 3. Localizar registro existente ou pegar o ID
    const { data: existingRows } = await supabase
      .from('site_settings')
      .select('id')
      .limit(1)

    const recordId =
      existingRows && existingRows[0]?.id
        ? existingRows[0].id
        : payload.id || 'de5c5de0-024f-49db-8f41-4b5a43d4e919'

    // 4. Mapear e atualizar estritamente as colunas existentes no banco do Supabase
    const dbUpdateData = {
      id: recordId,
      company_name: payload.company_name,
      cnpj: payload.cnpj || '',
      primary_phone: payload.phone || '',
      whatsapp_number: payload.whatsapp || '',
      contact_email: payload.email || '',
      address: payload.address || '',
      instagram_url: payload.instagram_url || '',
      linkedin_url: payload.linkedin_url || '',
      logo_url: payload.logo_url || '',
      favicon_url: payload.favicon_url || '',
      hero_title: payload.hero_title || '',
      hero_subtitle: payload.hero_subtitle || '',
      updated_at: new Date().toISOString(),
    }

    const { error: dbError } = await supabase
      .from('site_settings')
      .upsert(dbUpdateData, { onConflict: 'id' })

    if (dbError) {
      console.error('[updateSiteSettingsAction] Erro no banco de dados:', dbError)
      return {
        success: false,
        error: `Erro ao salvar configurações no banco: ${dbError.message}`,
      }
    }

    // 5. Revalidação instantânea do cache da Home pública e do painel
    revalidatePath('/')
    revalidatePath('/admin/configuracoes')

    return {
      success: true,
      message: 'Configurações atualizadas com sucesso! O logotipo e os dados foram salvos no Supabase e já estão ao vivo.',
    }
  } catch (err: any) {
    console.error('[updateSiteSettingsAction] Falha inesperada:', err)
    return {
      success: false,
      error: err.message || 'Erro inesperado ao salvar configurações.',
    }
  }
}
