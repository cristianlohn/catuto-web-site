'use client'

import * as React from 'react'
import Link from 'next/link'
import { SiteSettings } from '@/types/database'
import { formatWhatsAppUrl } from '@/lib/masks'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { WhatsAppIcon } from '@/components/ui/icons'
import {
  Menu,
  X,
  ArrowRight,
} from 'lucide-react'

interface NavbarProps {
  settings: SiteSettings
}

export function Navbar({ settings }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const whatsappLink = formatWhatsAppUrl(settings.whatsapp, settings.whatsapp_message)

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 bg-[#080c15]/95 backdrop-blur-xl border-b border-zinc-800/80 shadow-lg shadow-black/40 ${
        scrolled ? 'py-2.5 sm:py-3' : 'py-3.5 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logotipo Oficial Horizontal */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/" className="flex items-center group">
            <img
              src="/brand/catuto-horizontal.webp"
              alt="Catuto Digital Solutions"
              className="h-8 sm:h-10 w-auto object-contain group-hover:brightness-110 transition-all"
            />
          </Link>

          <div className="hidden xl:flex items-center ml-1">
            <Badge
              variant="outline"
              className="gap-1.5 py-0.5 px-2.5 bg-emerald-950/40 border-emerald-500/30 text-emerald-400 text-[11px]"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Especialistas em Pequenos Negócios
            </Badge>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-7">
          <Link
            href="#clientes"
            className="text-sm text-zinc-300 hover:text-emerald-400 transition-colors font-medium"
          >
            Clientes
          </Link>
          <Link
            href="#servicos"
            className="text-sm text-zinc-300 hover:text-emerald-400 transition-colors font-medium"
          >
            Serviços
          </Link>
          <Link
            href="#sobre"
            className="text-sm text-zinc-300 hover:text-emerald-400 transition-colors font-medium"
          >
            Sobre Nós
          </Link>
          <Link
            href="#comparativo"
            className="text-sm text-zinc-300 hover:text-emerald-400 transition-colors font-medium"
          >
            Por que Nós
          </Link>
          <Link
            href="#faq"
            className="text-sm text-zinc-300 hover:text-emerald-400 transition-colors font-medium"
          >
            Dúvidas
          </Link>
          <Link
            href="#contato"
            className="text-sm text-zinc-300 hover:text-emerald-400 transition-colors font-medium"
          >
            Contato
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {whatsappLink && (
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-300 hover:text-emerald-400 hover:bg-emerald-500/10 gap-1.5"
              asChild
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="w-4 h-4 fill-[#25D366]" />
                WhatsApp
              </a>
            </Button>
          )}

          <Button
            size="sm"
            className="shadow-md shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm"
            asChild
          >
            <Link href="#contato">
              Pedir Orçamento
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Abrir menu"
            className="text-zinc-300 hover:text-white"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-[#080c15] border-b border-zinc-800 px-4 pt-3 pb-6 animate-in slide-in-from-top-3 duration-200">
          <div className="flex flex-col gap-3">
            <Link
              href="#clientes"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium py-2.5 border-b border-zinc-800/60 text-zinc-200 hover:text-emerald-400"
            >
              Nossos Clientes
            </Link>
            <Link
              href="#servicos"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium py-2.5 border-b border-zinc-800/60 text-zinc-200 hover:text-emerald-400"
            >
              Serviços
            </Link>
            <Link
              href="#sobre"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium py-2.5 border-b border-zinc-800/60 text-zinc-200 hover:text-emerald-400"
            >
              Sobre Nós
            </Link>
            <Link
              href="#comparativo"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium py-2.5 border-b border-zinc-800/60 text-zinc-200 hover:text-emerald-400"
            >
              Por que Nós (Comparativo)
            </Link>
            <Link
              href="#faq"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium py-2.5 border-b border-zinc-800/60 text-zinc-200 hover:text-emerald-400"
            >
              Perguntas Frequentes (Dúvidas)
            </Link>
            <Link
              href="#contato"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium py-2.5 border-b border-zinc-800/60 text-zinc-200 hover:text-emerald-400"
            >
              Fale Conosco
            </Link>

            <div className="pt-3 flex flex-col gap-2.5">
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                asChild
                onClick={() => setIsOpen(false)}
              >
                <Link href="#contato">Solicitar Orçamento Grátis</Link>
              </Button>
              {whatsappLink && (
                <Button
                  variant="outline"
                  className="w-full border-emerald-500/30 text-emerald-400 gap-2"
                  asChild
                >
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon className="w-4 h-4 fill-[#25D366]" />
                    Chamar no WhatsApp
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
