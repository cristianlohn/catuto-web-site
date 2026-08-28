'use server'

import { createAdminClient, createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { clientSchema } from '@/lib/validations/client'
import type { Client } from '@/types/database'

const fallbackClients: Client[] = [
  {
    id: 'client-tf-store',
    name: 'TF Store Importados',
    logo_url: '',
    website_url: 'https://tfstoreimportados.com.br',
    category: 'E-commerce & Catálogo B2B',
    description: 'Catálogo digital moderno com alta velocidade de carregamento, checkout simplificado e integração direta ao WhatsApp.',
    tags: ['E-commerce', 'Mobile First', 'WhatsApp Direto', 'Alta Performance'],
    is_active: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'client-dall-engenharia',
    name: "D'all Engenharia",
    logo_url: '',
    website_url: 'https://dallengenharia.com.br',
    category: 'Engenharia & Construção Civil',
    description: 'Website institucional com design corporativo de alto padrão, apresentação de portfólio de obras e captação de orçamentos.',
    tags: ['Website Institucional', 'SEO Local', 'Galeria de Obras', 'Credibilidade'],
    is_active: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// 1. Obter todos os clientes (com fallback resiliente)
export async function getClientsAction(onlyActive: boolean = false): Promise<{
  success: boolean
  data: Client[]
  isFallback?: boolean
  error?: string
}> {
  try {
    const supabase = createAdminClient()
    let query = supabase.from('clients').select('*')

    if (onlyActive) {
      query = query.eq('is_active', true)
    }

    query = query.order('display_order', { ascending: true }).order('created_at', { ascending: true })

    const { data, error } = await query

    if (error) {
      // Se a tabela ainda não existir no schema cache, busca dos monitores ou usa fallback
      console.warn('[getClientsAction] Tabela clients não disponível. Carregando dados resilientes:', error.message)
      
      const { data: monitors } = await supabase.from('client_monitors').select('*')
      if (monitors && monitors.length > 0) {
        const mappedMonitors: Client[] = monitors
          .filter((m) => !m.name.toLowerCase().includes('catuto'))
          .map((m, idx) => ({
            id: m.id,
            name: m.name,
            logo_url: null,
            website_url: m.url,
            category: m.name.includes('Engenharia') ? 'Engenharia & Construção' : 'E-commerce & Catálogo B2B',
            description: `Website de alta performance desenvolvido e mantido com 100% de estabilidade pela Catuto.`,
            tags: ['Website Profissional', 'Alta Velocidade', 'Segurança 24h'],
            is_active: m.is_active ?? true,
            display_order: idx + 1,
            created_at: m.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }))
        
        return {
          success: true,
          data: onlyActive ? mappedMonitors.filter((c) => c.is_active) : mappedMonitors,
          isFallback: true,
        }
      }

      return {
        success: true,
        data: onlyActive ? fallbackClients.filter((c) => c.is_active) : fallbackClients,
        isFallback: true,
      }
    }

    return {
      success: true,
      data: data || [],
      isFallback: false,
    }
  } catch (err: any) {
    console.error('[getClientsAction] Erro inesperado:', err)
    return {
      success: true,
      data: onlyActive ? fallbackClients.filter((c) => c.is_active) : fallbackClients,
      isFallback: true,
      error: err.message,
    }
  }
}

// 2. Criar novo cliente
export async function createClientAction(formData: unknown) {
  try {
    const authClient = await createClient()
    const {
      data: { user },
    } = await authClient.auth.getUser()

    if (!user) {
      return { success: false, error: 'Sessão expirada. Faça login novamente.' }
    }

    const parseResult = clientSchema.safeParse(formData)
    if (!parseResult.success) {
      return {
        success: false,
        error: 'Dados inválidos. Por favor, revise os campos do formulário.',
        fieldErrors: parseResult.error.flatten().fieldErrors,
      }
    }

    const payload = parseResult.data
    let cleanUrl = payload.website_url.trim()
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`
    }

    let tagsArray: string[] = []
    if (Array.isArray(payload.tags)) {
      tagsArray = payload.tags.map((t) => t.trim()).filter(Boolean)
    } else if (typeof payload.tags === 'string' && payload.tags.trim()) {
      tagsArray = payload.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    }

    const supabase = createAdminClient()
    const now = new Date().toISOString()

    const { data, error } = await supabase
      .from('clients')
      .insert({
        name: payload.name.trim(),
        website_url: cleanUrl,
        logo_url: payload.logo_url?.trim() || null,
        category: payload.category?.trim() || 'Website Institucional',
        description: payload.description?.trim() || null,
        tags: tagsArray,
        is_active: payload.is_active ?? true,
        display_order: payload.display_order ?? 0,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single()

    if (error) {
      console.error('[createClientAction] Erro ao inserir cliente:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/admin/clientes')

    return {
      success: true,
      data,
      message: 'Cliente cadastrado com sucesso e publicado!',
    }
  } catch (err: any) {
    console.error('[createClientAction] Falha inesperada:', err)
    return { success: false, error: err.message || 'Erro ao cadastrar cliente.' }
  }
}

// 3. Atualizar cliente
export async function updateClientAction(id: string, formData: unknown) {
  try {
    const authClient = await createClient()
    const {
      data: { user },
    } = await authClient.auth.getUser()

    if (!user) {
      return { success: false, error: 'Sessão expirada. Faça login novamente.' }
    }

    const parseResult = clientSchema.safeParse(formData)
    if (!parseResult.success) {
      return {
        success: false,
        error: 'Dados inválidos. Por favor, revise os campos do formulário.',
        fieldErrors: parseResult.error.flatten().fieldErrors,
      }
    }

    const payload = parseResult.data
    let cleanUrl = payload.website_url.trim()
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`
    }

    let tagsArray: string[] = []
    if (Array.isArray(payload.tags)) {
      tagsArray = payload.tags.map((t) => t.trim()).filter(Boolean)
    } else if (typeof payload.tags === 'string' && payload.tags.trim()) {
      tagsArray = payload.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    }

    const supabase = createAdminClient()
    const now = new Date().toISOString()

    const { error } = await supabase
      .from('clients')
      .update({
        name: payload.name.trim(),
        website_url: cleanUrl,
        logo_url: payload.logo_url?.trim() || null,
        category: payload.category?.trim() || 'Website Institucional',
        description: payload.description?.trim() || null,
        tags: tagsArray,
        is_active: payload.is_active ?? true,
        display_order: payload.display_order ?? 0,
        updated_at: now,
      })
      .eq('id', id)

    if (error) {
      console.error('[updateClientAction] Erro ao atualizar cliente:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/admin/clientes')

    return {
      success: true,
      message: 'Dados do cliente atualizados com sucesso!',
    }
  } catch (err: any) {
    console.error('[updateClientAction] Falha inesperada:', err)
    return { success: false, error: err.message || 'Erro ao atualizar cliente.' }
  }
}

// 4. Excluir cliente
export async function deleteClientAction(id: string) {
  try {
    const authClient = await createClient()
    const {
      data: { user },
    } = await authClient.auth.getUser()

    if (!user) {
      return { success: false, error: 'Sessão expirada. Faça login novamente.' }
    }

    const supabase = createAdminClient()
    const { error } = await supabase.from('clients').delete().eq('id', id)

    if (error) {
      console.error('[deleteClientAction] Erro ao remover cliente:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/admin/clientes')

    return {
      success: true,
      message: 'Cliente removido com sucesso.',
    }
  } catch (err: any) {
    console.error('[deleteClientAction] Falha inesperada:', err)
    return { success: false, error: err.message || 'Erro ao excluir cliente.' }
  }
}

// 5. Alternar status ativo/inativo
export async function toggleClientActiveAction(id: string, isActive: boolean) {
  try {
    const authClient = await createClient()
    const {
      data: { user },
    } = await authClient.auth.getUser()

    if (!user) {
      return { success: false, error: 'Sessão expirada.' }
    }

    const supabase = createAdminClient()
    const { error } = await supabase
      .from('clients')
      .update({
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/admin/clientes')

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

// 6. Importar clientes automaticamente a partir dos monitores de uptime cadastrados
export async function importFromMonitorsAction() {
  try {
    const authClient = await createClient()
    const {
      data: { user },
    } = await authClient.auth.getUser()

    if (!user) {
      return { success: false, error: 'Sessão expirada.' }
    }

    const supabase = createAdminClient()

    // 1. Busca todos os monitores
    const { data: monitors } = await supabase.from('client_monitors').select('*')
    if (!monitors || monitors.length === 0) {
      return { success: false, error: 'Nenhum monitor encontrado para importação.' }
    }

    // 2. Busca os clientes já existentes para não duplicar
    const { data: existingClients } = await supabase.from('clients').select('website_url')
    const existingUrls = new Set(
      (existingClients || []).map((c) => c.website_url.replace(/\/$/, '').toLowerCase())
    )

    const now = new Date().toISOString()
    const toInsert = monitors
      .filter((m) => {
        const clean = m.url.replace(/\/$/, '').toLowerCase()
        return !existingUrls.has(clean) && !m.name.toLowerCase().includes('catuto')
      })
      .map((m, idx) => ({
        name: m.name,
        website_url: m.url,
        logo_url: null,
        category: m.name.toLowerCase().includes('engenharia')
          ? 'Engenharia & Construção Civil'
          : 'E-commerce & Catálogo B2B',
        description: `Website institucional desenvolvido com arquitetura moderna, ultra velocidade e estabilidade garantida.`,
        tags: ['Website Profissional', 'Alta Performance', 'Mobile First'],
        is_active: true,
        display_order: (existingClients?.length || 0) + idx + 1,
        created_at: now,
        updated_at: now,
      }))

    if (toInsert.length === 0) {
      return {
        success: true,
        message: 'Todos os websites dos seus monitores já estão cadastrados como clientes!',
      }
    }

    const { error: insertError } = await supabase.from('clients').insert(toInsert)

    if (insertError) {
      return { success: false, error: insertError.message }
    }

    revalidatePath('/')
    revalidatePath('/admin/clientes')

    return {
      success: true,
      message: `${toInsert.length} cliente(s) importado(s) com sucesso a partir dos seus monitores!`,
    }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
