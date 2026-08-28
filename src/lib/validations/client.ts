import { z } from 'zod'

export const clientSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Nome do cliente/empresa é obrigatório.'),
  website_url: z
    .string()
    .min(1, 'Link do website é obrigatório.')
    .refine(
      (val) => {
        const clean = val.startsWith('http://') || val.startsWith('https://') ? val : `https://${val}`
        try {
          new URL(clean)
          return true
        } catch {
          return false
        }
      },
      { message: 'URL do website inválida.' }
    ),
  logo_url: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  tags: z.array(z.string()).or(z.string()).optional(),
  is_active: z.boolean().default(true),
  display_order: z.number().int().default(0),
})

export type ClientFormData = z.infer<typeof clientSchema>
