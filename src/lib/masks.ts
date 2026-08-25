/**
 * Utilitários de Máscaras e Formatações para Formulários e Exibição
 */

export function maskPhone(value: string): string {
  if (!value) return ''
  // Permite até 13 dígitos (ex: 55 + DDD 47 + 9 dígitos = 13 dígitos)
  let digits = value.replace(/\D/g, '').slice(0, 13)

  if (!digits) return ''

  // Caso 1: Usuário digitou com DDI 55 (12 ou 13 dígitos, ou começou com 55 e tem mais de 10 dígitos)
  if (digits.startsWith('55') && digits.length > 2) {
    const ddi = '55'
    const rest = digits.slice(2)

    if (rest.length <= 2) {
      return `+${ddi} (${rest}`
    }
    if (rest.length <= 6) {
      return `+${ddi} (${rest.slice(0, 2)}) ${rest.slice(2)}`
    }
    if (rest.length <= 10) {
      return `+${ddi} (${rest.slice(0, 2)}) ${rest.slice(2, 6)}-${rest.slice(6)}`
    }
    return `+${ddi} (${rest.slice(0, 2)}) ${rest.slice(2, 7)}-${rest.slice(7, 11)}`
  }

  // Caso 2: Padrão nacional (DDD + 8 ou 9 dígitos)
  if (digits.length <= 2) {
    return `(${digits}`
  }
  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  }
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
}

export function maskCnpj(value: string): string {
  if (!value) return ''
  const digits = value.replace(/\D/g, '').slice(0, 14)

  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

export function cleanDigits(value: string | null | undefined): string {
  if (!value) return ''
  return value.replace(/\D/g, '')
}

/**
 * Normaliza o número para o link do WhatsApp (wa.me)
 * Garante o DDI 55 do Brasil caso não esteja presente
 */
export function formatWhatsAppUrl(number: string | null | undefined, customMessage?: string | null): string | null {
  if (!number) return null
  let digits = cleanDigits(number)
  if (!digits) return null

  // Se tem 10 ou 11 dígitos (apenas DDD + número), adiciona DDI 55
  if (digits.length === 10 || digits.length === 11) {
    digits = `55${digits}`
  }

  const messageParam = customMessage
    ? `?text=${encodeURIComponent(customMessage)}`
    : ''

  return `https://wa.me/${digits}${messageParam}`
}
