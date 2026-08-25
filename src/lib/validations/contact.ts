import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo'),
  email: z.string().email('Insira um e-mail corporativo válido'),
  phone: z
    .string()
    .min(10, 'Insira um telefone/WhatsApp válido com DDD')
    .max(20, 'Número inválido'),
  company: z.string().min(2, 'Informe o nome da sua empresa').max(100, 'Nome muito longo'),
  service: z.string().min(1, 'Selecione o tipo de projeto'),
  message: z.string().min(10, 'A mensagem deve ter pelo menos 10 caracteres').max(2000, 'Mensagem muito longa'),
})

export type ContactFormData = z.infer<typeof contactFormSchema>
