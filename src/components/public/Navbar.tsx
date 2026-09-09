'use client'

import * as React from 'react'
import Link from 'next/link'
import { SiteSettings } from '@/types/database'
import { formatWhatsAppUrl } from '@/lib/masks'
import { Button } from '@/components/ui/button'
import { WhatsAppIcon } from '@/components/ui/icons'
import {
  Menu,
  X,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'
import { FLOW_APP_URL } from '@/config/flow'

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
        scrolled ? 'py-2.5 sm:py-3' : 'py-3 sm:py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Logotipo Oficial Horizontal */}
        <div className="flex items-center shrink-0">
          <Link href="/" className="flex items-center group">
            <img
              src="/brand/catuto-horizontal.webp"
              alt="Catuto Digital Solutions"
              className="h-8 sm:h-9 w-auto object-contain group-hover:brightness-110 transition-all"
            />
          </Link>
        </div>

        {/* Desktop Navigation - Imune a quebra de linha */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
          <Link
            href="/#clientes"
            className="text-sm text-zinc-300 hover:text-emerald-400 transition-colors font-medium whitespace-nowrap"
          >
            Clientes
          </Link>
          <Link
            href="/#servicos"
            className="text-sm text-zinc-300 hover:text-emerald-400 transition-colors font-medium whitespace-nowrap"
          >
            Serviços
          </Link>
          <Link
            href="/#comparativo"
            className="text-sm text-zinc-300 hover:text-emerald-400 transition-colors font-medium whitespace-nowrap"
          >
            Diferenciais
          </Link>
          <Link
            href="/flow"
            className="text-sm text-zinc-300 hover:text-emerald-400 transition-colors font-medium whitespace-nowrap flex items-center gap-1.5 group"
          >
            <span>Catuto Flow</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold group-hover:bg-emerald-500/20 transition-colors">
              App
            </span>
          </Link>
          <Link
            href="/#sobre"
            className="text-sm text-zinc-300 hover:text-emerald-400 transition-colors font-medium whitespace-nowrap"
          >
            Sobre
          </Link>
          <Link
            href="/#faq"
            className="text-sm text-zinc-300 hover:text-emerald-400 transition-colors font-medium whitespace-nowrap"
          >
            Dúvidas
          </Link>
          <Link
            href="/#contato"
            className="text-sm text-zinc-300 hover:text-emerald-400 transition-colors font-medium whitespace-nowrap"
          >
            Contato
          </Link>
        </nav>

        {/* Action Buttons - Equilibrados e sem aperto */}
        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-medium gap-1.5 whitespace-nowrap shrink-0 transition-colors"
            asChild
          >
            <a href={FLOW_APP_URL} target="_blank" rel="noopener noreferrer">
              <span>Entrar no Flow</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            </a>
          </Button>

          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl text-zinc-400 hover:text-[#25D366] hover:bg-[#25D366]/10 border border-zinc-800/80 hover:border-[#25D366]/30 transition-all shrink-0"
              title="Chamar no WhatsApp"
              aria-label="Chamar no WhatsApp"
            >
              <WhatsAppIcon className="w-4 h-4 fill-[#25D366]" />
            </a>
          )}

          <Button
            size="sm"
            className="shadow-md shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm px-4 whitespace-nowrap shrink-0 cursor-pointer"
            asChild
          >
            <Link href="/#contato">
              Pedir Orçamento
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </Button>
        </div>

        {/* Mobile / Tablet Menu Button */}
        <div className="flex lg:hidden items-center gap-2">
          <Button
            size="sm"
            className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3 py-1 sm:inline-flex"
            asChild
          >
            <Link href="/#contato">Orçamento</Link>
          </Button>

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
        <div className="lg:hidden bg-[#080c15] border-b border-zinc-800 px-4 pt-3 pb-6 animate-in slide-in-from-top-3 duration-200">
          <div className="flex flex-col gap-2">
            <Link
              href="/#clientes"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium py-2.5 border-b border-zinc-800/60 text-zinc-200 hover:text-emerald-400"
            >
              Nossos Clientes
            </Link>
            <Link
              href="/#servicos"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium py-2.5 border-b border-zinc-800/60 text-zinc-200 hover:text-emerald-400"
            >
              Serviços
            </Link>
            <Link
              href="/#comparativo"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium py-2.5 border-b border-zinc-800/60 text-zinc-200 hover:text-emerald-400"
            >
              Diferenciais
            </Link>
            <Link
              href="/flow"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium py-2.5 border-b border-zinc-800/60 text-emerald-400 flex items-center justify-between"
            >
              <span>Catuto Flow (Gestão Ágil)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
                App
              </span>
            </Link>
            <Link
              href="/#sobre"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium py-2.5 border-b border-zinc-800/60 text-zinc-200 hover:text-emerald-400"
            >
              Sobre
            </Link>
            <Link
              href="/#faq"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium py-2.5 border-b border-zinc-800/60 text-zinc-200 hover:text-emerald-400"
            >
              Dúvidas Frequentes
            </Link>
            <Link
              href="/#contato"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium py-2.5 border-b border-zinc-800/60 text-zinc-200 hover:text-emerald-400"
            >
              Fale Conosco
            </Link>

            <div className="pt-3 flex flex-col gap-2.5">
              <Button
                variant="outline"
                className="w-full border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 gap-2 text-xs font-medium"
                asChild
              >
                <a href={FLOW_APP_URL} target="_blank" rel="noopener noreferrer">
                  <span>Entrar no Flow</span>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                </a>
              </Button>
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                asChild
                onClick={() => setIsOpen(false)}
              >
                <Link href="/#contato">Solicitar Orçamento Grátis</Link>
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
