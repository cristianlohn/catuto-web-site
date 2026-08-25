'use client'

import * as React from 'react'
import Link from 'next/link'
import { SiteSettings } from '@/types/database'
import { formatWhatsAppUrl } from '@/lib/masks'
import { Button } from '@/components/ui/button'
import { WhatsAppIcon } from '@/components/ui/icons'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Smartphone,
  Search,
  CheckCircle2,
} from 'lucide-react'

interface HeroProps {
  settings: SiteSettings
}

export function Hero({ settings }: HeroProps) {
  const whatsappLink = formatWhatsAppUrl(settings.whatsapp, settings.whatsapp_message)

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] pointer-events-none -z-10">
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[350px] sm:w-[700px] md:w-[850px] h-[320px] bg-gradient-to-tr from-emerald-600/20 via-teal-500/15 to-blue-600/15 blur-[140px] rounded-full" />
      </div>

      {/* Decorative Grid */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Badge de Localização / Foco */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/50 border border-emerald-500/30 shadow-inner backdrop-blur-md mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-emerald-400 tracking-wider uppercase">
                {settings.hero_badge || 'Soluções Web para Pequenos Negócios | Joinville - SC'}
              </span>
            </div>
          </motion.div>

          {/* Headline Clara e Direta */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-6 font-heading"
          >
            {settings.hero_title || 'Sua Estrutura Sólida no Digital para Vender Mais'}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-lg md:text-xl text-zinc-300 max-w-3xl mb-8 sm:mb-10 leading-relaxed font-normal"
          >
            {settings.hero_subtitle ||
              'Criamos websites modernos, rápidos e sob medida para pequenas empresas e empreendedores que querem se destacar da concorrência e receber contatos no WhatsApp todos os dias.'}
          </motion.p>

          {/* Botões de Ação */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto mb-12 sm:mb-16"
          >
            <Button
              size="lg"
              className="w-full sm:w-auto h-12 px-8 text-sm sm:text-base font-semibold shadow-xl shadow-emerald-500/25 bg-emerald-600 hover:bg-emerald-500 text-white"
              asChild
            >
              <Link href={settings.hero_cta_url || '#contato'}>
                {settings.hero_cta_text || 'Solicitar Orçamento Grátis'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>

            {whatsappLink && (
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-12 px-7 text-sm sm:text-base font-semibold border-zinc-700 hover:bg-zinc-800 text-zinc-200 gap-2.5"
                asChild
              >
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="w-5 h-5 fill-[#25D366]" />
                  Conversar no WhatsApp
                </a>
              </Button>
            )}
          </motion.div>

          {/* 4 Benefícios Reais e Claros */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full max-w-4xl"
          >
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm flex flex-col items-center text-center group hover:border-emerald-500/40 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
                <Smartphone className="w-4 h-4" />
              </div>
              <span className="text-sm sm:text-base font-bold text-white tracking-tight font-heading">
                100% no Celular
              </span>
              <span className="text-[11px] text-zinc-400 mt-0.5">Abre rápido e sem travar</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm flex flex-col items-center text-center group hover:border-emerald-500/40 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
                <WhatsAppIcon className="w-4.5 h-4.5 fill-[#25D366]" />
              </div>
              <span className="text-sm sm:text-base font-bold text-white tracking-tight font-heading">
                Foco no WhatsApp
              </span>
              <span className="text-[11px] text-zinc-400 mt-0.5">Mais mensagens de clientes</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm flex flex-col items-center text-center group hover:border-emerald-500/40 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center mb-2">
                <Search className="w-4 h-4" />
              </div>
              <span className="text-sm sm:text-base font-bold text-white tracking-tight font-heading">
                Destaque no Google
              </span>
              <span className="text-[11px] text-zinc-400 mt-0.5">Encontre quem busca por você</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm flex flex-col items-center text-center group hover:border-emerald-500/40 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-2">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-sm sm:text-base font-bold text-white tracking-tight font-heading">
                Zero Dor de Cabeça
              </span>
              <span className="text-[11px] text-zinc-400 mt-0.5">Cuidamos de tudo para você</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
