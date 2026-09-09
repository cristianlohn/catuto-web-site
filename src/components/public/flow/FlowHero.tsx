'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink, ShieldCheck, Sparkles, Zap, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WhatsAppIcon } from '@/components/ui/icons'
import { FLOW_APP_URL } from '@/config/flow'

interface FlowHeroProps {
  whatsappUrl?: string | null
}

export function FlowHero({ whatsappUrl }: FlowHeroProps) {
  return (
    <section className="relative pt-28 pb-14 md:pt-36 md:pb-20 overflow-hidden">
      {/* Luz ambiente de fundo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] pointer-events-none -z-10">
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[350px] sm:w-[700px] md:w-[850px] h-[340px] bg-gradient-to-tr from-emerald-600/25 via-teal-500/20 to-blue-600/15 blur-[140px] rounded-full" />
      </div>

      {/* Grid sutil decorativo */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Badge de Autoridade */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 shadow-inner backdrop-blur-md mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-emerald-400 tracking-wider uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Case de Engenharia • Catuto Flow
              </span>
            </div>
          </motion.div>

          {/* Headline Principal */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.12] mb-6 font-heading"
          >
            Transparência radical, sprints previsíveis e{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
              acompanhamento em tempo real
            </span>
            .
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-zinc-300 max-w-3xl mb-8 leading-relaxed font-sans"
          >
            Eliminamos reuniões intermináveis e caixas pretas no desenvolvimento de software. O{' '}
            <strong className="text-white font-semibold">Catuto Flow</strong> é nossa plataforma proprietária
            onde você acompanha cada linha de código, sprint e entrega com visibilidade absoluta e sem ruídos.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto"
          >
            {whatsappUrl && (
              <Button
                size="lg"
                className="w-full sm:w-auto shadow-lg shadow-emerald-600/25 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm sm:text-base px-7 py-6 rounded-xl transition-all duration-200 gap-2 cursor-pointer"
                asChild
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="w-5 h-5 fill-white" />
                  Falar com um Especialista
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </Button>
            )}

            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white font-medium text-sm sm:text-base px-6 py-6 rounded-xl transition-all duration-200 gap-2 cursor-pointer"
              asChild
            >
              <a href={FLOW_APP_URL} target="_blank" rel="noopener noreferrer">
                <span>Acessar Plataforma</span>
                <ExternalLink className="w-4 h-4 text-emerald-400" />
              </a>
            </Button>
          </motion.div>

          {/* Micro Pilares no Hero */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-12 mt-8 border-t border-zinc-800/60 w-full max-w-3xl text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Sprints Semanais</span>
                <span className="text-[11px] text-zinc-400">Entregas contínuas em produção</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Trava de Retrabalho</span>
                <span className="text-[11px] text-zinc-400">Zero desvios ou custos ocultos</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Engenharia Nativa</span>
                <span className="text-[11px] text-zinc-400">Arquitetura própria de alto desempenho</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
