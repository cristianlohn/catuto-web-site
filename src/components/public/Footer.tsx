'use client'

import * as React from 'react'
import Link from 'next/link'
import { SiteSettings } from '@/types/database'
import {
  ShieldCheck,
  Lock,
  ArrowUp,
} from 'lucide-react'
import {
  InstagramIcon,
  LinkedInIcon,
  GitHubIcon,
  WhatsAppIcon,
} from '@/components/ui/icons'
import { formatWhatsAppUrl } from '@/lib/masks'
import { CatutoBadge } from '@/components/public/CatutoBadge'

interface FooterProps {
  settings: SiteSettings
}

export function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear()

  const hasSocials = Boolean(
    settings.instagram_url?.trim() ||
    settings.linkedin_url?.trim() ||
    settings.github_url?.trim() ||
    settings.whatsapp?.trim()
  )

  const hasCompanyData = Boolean(
    settings.cnpj?.trim() ||
    settings.address?.trim() ||
    settings.email?.trim() ||
    settings.phone?.trim()
  )

  const whatsappLink = formatWhatsAppUrl(settings.whatsapp, settings.whatsapp_message)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-[#050811] border-t border-zinc-800/80 pt-14 pb-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 pb-10 border-b border-zinc-800/60">
          {/* Coluna 1 & 2: Branding Oficial e Propósito */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center group">
              <img
                src="/brand/catuto-horizontal.webp"
                alt="Catuto Digital Solutions"
                className="h-9 sm:h-10 w-auto object-contain group-hover:brightness-110 transition-all"
              />
            </Link>

            {settings.about_text?.trim() && (
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm">
                {settings.about_text}
              </p>
            )}

            {hasSocials && (
              <div className="flex items-center gap-2.5 pt-2">
                {settings.instagram_url?.trim() && (
                  <a
                    href={settings.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-zinc-900/90 hover:bg-gradient-to-tr hover:from-amber-500/20 hover:via-rose-500/20 hover:to-purple-500/20 hover:border-rose-500/40 text-zinc-400 hover:text-white flex items-center justify-center transition-all border border-zinc-800 shadow-sm"
                    aria-label="Instagram Oficial"
                  >
                    <InstagramIcon className="w-4.5 h-4.5" />
                  </a>
                )}

                {settings.linkedin_url?.trim() && (
                  <a
                    href={settings.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-zinc-900/90 hover:bg-[#0077b5]/20 hover:border-[#0077b5]/50 text-zinc-400 hover:text-[#0077b5] flex items-center justify-center transition-all border border-zinc-800 shadow-sm"
                    aria-label="LinkedIn Oficial"
                  >
                    <LinkedInIcon className="w-4.5 h-4.5" />
                  </a>
                )}

                {whatsappLink && (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-zinc-900/90 hover:bg-[#25D366]/20 hover:border-[#25D366]/50 text-zinc-400 hover:text-[#25D366] flex items-center justify-center transition-all border border-zinc-800 shadow-sm"
                    aria-label="WhatsApp Comercial"
                  >
                    <WhatsAppIcon className="w-4.5 h-4.5" />
                  </a>
                )}

                {settings.github_url?.trim() && (
                  <a
                    href={settings.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-all border border-zinc-800 shadow-sm"
                    aria-label="GitHub"
                  >
                    <GitHubIcon className="w-4.5 h-4.5" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Coluna 3: Nossos Serviços */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-white mb-3 sm:mb-4 font-heading">
              Nossos Serviços
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-400">
              <li>
                <Link href="#servicos" className="hover:text-emerald-400 transition-colors">
                  Websites Institucionais
                </Link>
              </li>
              <li>
                <Link href="#servicos" className="hover:text-emerald-400 transition-colors">
                  Landing Pages para Vendas
                </Link>
              </li>
              <li>
                <Link href="#servicos" className="hover:text-emerald-400 transition-colors">
                  Otimização de Velocidade
                </Link>
              </li>
              <li>
                <Link href="#servicos" className="hover:text-emerald-400 transition-colors">
                  Destaque no Google (SEO)
                </Link>
              </li>
              <li>
                <Link href="#servicos" className="hover:text-emerald-400 transition-colors">
                  Monitoramento 24/7
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Institucional & Atalhos */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-white mb-3 sm:mb-4 font-heading">
              Institucional
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-400">
              <li>
                <Link href="#clientes" className="hover:text-emerald-400 transition-colors">
                  Nossos Clientes & Cases
                </Link>
              </li>
              <li>
                <Link href="#sobre" className="hover:text-emerald-400 transition-colors">
                  Quem Somos & Valores
                </Link>
              </li>
              <li>
                <Link href="#comparativo" className="hover:text-emerald-400 transition-colors">
                  Por que a Catuto
                </Link>
              </li>
              <li>
                <Link href="#faq" className="hover:text-emerald-400 transition-colors">
                  Dúvidas Frequentes
                </Link>
              </li>
              <li>
                <Link href="#contato" className="hover:text-emerald-400 transition-colors">
                  Pedir Orçamento Grátis
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 5: Dados de Contato */}
          {hasCompanyData ? (
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-white mb-3 sm:mb-4 font-heading">
                Atendimento
              </h4>
              <div className="space-y-2.5 text-xs text-zinc-400 leading-relaxed">
                {settings.email?.trim() && (
                  <p>
                    <span className="block text-[11px] text-zinc-400">E-mail:</span>
                    <a href={`mailto:${settings.email}`} className="text-zinc-200 hover:text-emerald-400 font-medium transition-colors">
                      {settings.email}
                    </a>
                  </p>
                )}
                {settings.phone?.trim() && (
                  <p>
                    <span className="block text-[11px] text-zinc-400">Telefone / WhatsApp:</span>
                    <span className="text-zinc-200 font-medium">{settings.phone}</span>
                  </p>
                )}
                {settings.address?.trim() && (
                  <p>
                    <span className="block text-[11px] text-zinc-400">Endereço:</span>
                    <span className="text-zinc-200">{settings.address}</span>
                  </p>
                )}
                {settings.cnpj?.trim() && (
                  <p>
                    <span className="block text-[11px] text-zinc-400">CNPJ:</span>
                    <span className="text-zinc-200">{settings.cnpj}</span>
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-white mb-3 sm:mb-4 font-heading">
                Compromisso & SLA
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Estrutura de alta velocidade com 99.9% de disponibilidade e atendimento direto para pequenas empresas.
              </p>
            </div>
          )}
        </div>

        {/* Linha Inferior com Selo Oficial e Botão de Voltar ao Topo */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p className="text-center md:text-left">
            © {currentYear} {settings.company_name} Soluções Digitais. Todos os direitos reservados.
          </p>

          {/* Selo Oficial "Desenvolvido por Catuto" */}
          <div className="flex items-center gap-3">
            <CatutoBadge />
          </div>

          {/* Ações / Voltar ao Topo */}
          <div className="flex items-center gap-4">
            <span className="hidden sm:flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              SLA 99.9% Uptime
            </span>

            <Link
              href="/login"
              className="flex items-center gap-1 hover:text-white transition-colors opacity-60 hover:opacity-100"
            >
              <Lock className="w-3 h-3" />
              Painel
            </Link>

            {/* Botão Voltar ao Topo */}
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Voltar ao topo da página"
              className="w-8 h-8 rounded-lg bg-zinc-900/90 border border-zinc-800 hover:border-emerald-500/40 hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 flex items-center justify-center transition-all cursor-pointer shadow-sm"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
