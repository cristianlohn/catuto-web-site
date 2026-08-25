import { z } from 'zod'

export const siteSettingsSchema = z.object({
  id: z.string().optional(),
  company_name: z.string().min(1, 'Nome da empresa é obrigatório.'),
  trade_name: z.string().nullable().optional(),
  tagline: z.string().nullable().optional(),
  hero_badge: z.string().nullable().optional(),
  hero_title: z.string().min(1, 'Título do Hero é obrigatório.'),
  hero_subtitle: z.string().nullable().optional(),
  hero_cta_text: z.string().nullable().optional(),
  hero_cta_url: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  whatsapp: z.string().nullable().optional(),
  whatsapp_message: z.string().nullable().optional(),
  email: z.string().email('E-mail inválido.').or(z.literal('')).nullable().optional(),
  cnpj: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  instagram_url: z.string().url('URL inválida.').or(z.literal('')).nullable().optional(),
  linkedin_url: z.string().url('URL inválida.').or(z.literal('')).nullable().optional(),
  github_url: z.string().url('URL inválida.').or(z.literal('')).nullable().optional(),
  logo_url: z.string().nullable().optional(),
  favicon_url: z.string().nullable().optional(),
  meta_title: z.string().nullable().optional(),
  meta_description: z.string().nullable().optional(),
  about_text: z.string().nullable().optional(),
  services_data: z.any().optional(),
  metrics_data: z.any().optional(),
})

export type SiteSettingsFormData = z.infer<typeof siteSettingsSchema>
