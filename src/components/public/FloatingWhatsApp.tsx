'use client'

import * as React from 'react'
import { formatWhatsAppUrl } from '@/lib/masks'
import { WhatsAppIcon } from '@/components/ui/icons'

interface FloatingWhatsAppProps {
  whatsappNumber?: string | null
  defaultMessage?: string | null
}

export function FloatingWhatsApp({ whatsappNumber, defaultMessage }: FloatingWhatsAppProps) {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 80)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const whatsappLink = formatWhatsAppUrl(
    whatsappNumber || '5547996348698',
    defaultMessage || 'Olá! Vim pelo site da Catuto e gostaria de solicitar um orçamento.'
  )

  if (!whatsappLink) return null

  return (
    <aside
      aria-label="Atendimento via WhatsApp"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="hidden sm:block opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity duration-200 rounded-xl bg-zinc-900/95 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-white shadow-xl pointer-events-none whitespace-nowrap border border-zinc-800">
        Fale conosco no WhatsApp
      </div>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-[#20bd5a] active:scale-95 shadow-emerald-500/30 group"
        aria-label="Iniciar conversa no WhatsApp"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-600 border-2 border-white"></span>
        </span>

        <WhatsAppIcon className="w-7 h-7 fill-white" />
      </a>
    </aside>
  )
}
