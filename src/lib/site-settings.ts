import { createAdminClient } from '@/lib/supabase/server'
import { SiteSettings } from '@/types/database'

export const defaultSiteSettings: SiteSettings = {
  id: 'default-settings',
  company_name: 'Catuto',
  trade_name: 'Catuto Soluções Digitais',
  tagline: 'Sua estrutura sólida no digital',
  hero_badge: 'Soluções Web para Pequenos Negócios | Joinville - SC',
  hero_title: 'Sua Estrutura Sólida no Digital para Vender Mais',
  hero_subtitle:
    'Criamos websites profissionais, modernos e rápidos sob medida para pequenas empresas e empreendedores que querem se destacar da concorrência e receber contatos no WhatsApp todos os dias.',
  hero_cta_text: 'Solicitar Orçamento Grátis',
  hero_cta_url: '#contato',
  phone: '(47) 99634-8698',
  whatsapp: '5547996348698',
  whatsapp_message: 'Olá! Vim pelo site da Catuto e gostaria de solicitar um orçamento para o meu negócio.',
  email: 'cristianlohn@hotmail.com',
  cnpj: '',
  address: '',
  instagram_url: 'https://instagram.com/catuto.solucoes',
  linkedin_url: 'https://linkedin.com/company/catuto',
  github_url: '',
  logo_url: '/brand/catuto-horizontal.webp',
  favicon_url: '/brand/catuto-symbol.webp',
  meta_title: 'Catuto Soluções Digitais | Websites Profissionais e Performance',
  meta_description:
    'Criação de websites profissionais, landing pages de alta conversão e otimização de velocidade para pequenos empreendedores em Joinville e todo o Brasil.',
  about_text:
    'A CATUTO é focada em transformar a presença digital de empreendedores e pequenas empresas. Criamos websites modernos, rápidos e de alta performance que servem como a base sólida para o crescimento do seu negócio online.',
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase.from('site_settings').select('*').limit(1).single()

    if (error || !data) {
      return defaultSiteSettings
    }

    const row = data as any

    return {
      id: row.id || defaultSiteSettings.id,
      company_name: row.company_name || defaultSiteSettings.company_name,
      trade_name: defaultSiteSettings.trade_name,
      tagline: defaultSiteSettings.tagline,
      hero_badge: row.hero_badge !== undefined && row.hero_badge !== null ? row.hero_badge : defaultSiteSettings.hero_badge,
      hero_title: row.hero_title !== undefined && row.hero_title !== null ? row.hero_title : defaultSiteSettings.hero_title,
      hero_subtitle: row.hero_subtitle !== undefined && row.hero_subtitle !== null ? row.hero_subtitle : defaultSiteSettings.hero_subtitle,
      hero_cta_text: defaultSiteSettings.hero_cta_text,
      hero_cta_url: defaultSiteSettings.hero_cta_url,
      // Campos opcionais: se o usuário salvou vazio ("" ou null), respeita como vazio!
      phone: row.primary_phone ?? '',
      whatsapp: row.whatsapp_number ?? '',
      whatsapp_message: defaultSiteSettings.whatsapp_message,
      email: row.contact_email ?? '',
      cnpj: row.cnpj ?? '',
      address: row.address ?? '',
      instagram_url: row.instagram_url ?? '',
      linkedin_url: row.linkedin_url ?? '',
      github_url: row.github_url ?? '',
      logo_url: row.logo_url || defaultSiteSettings.logo_url,
      favicon_url: row.favicon_url || defaultSiteSettings.favicon_url,
      meta_title: defaultSiteSettings.meta_title,
      meta_description: defaultSiteSettings.meta_description,
      about_text: defaultSiteSettings.about_text,
      updated_at: row.updated_at,
    }
  } catch (err) {
    console.error('Erro ao carregar configurações do site:', err)
    return defaultSiteSettings
  }
}
