'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FLOW_APP_URL } from '@/config/flow'

interface FlowCtaProps {
  whatsappUrl?: string | null
}

export function FlowCta({ whatsappUrl }: FlowCtaProps) {
  const loginUrl = `${FLOW_APP_URL}/login`
  const demoUrl = FLOW_APP_URL

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl bg-gradient-to-b from-[#0e1626] to-[#080c15] border border-emerald-500/30 p-8 sm:p-12 md:p-16 text-center overflow-hidden shadow-2xl shadow-emerald-950/20"
        >
          {/* Luz de fundo interna */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] sm:w-[600px] h-[250px] bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none -z-10" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-semibold tracking-wider mb-6">
            <span>✦ COMECE HOJE MESMO ✦</span>
          </div>

          {/* Headline */}
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white font-heading tracking-tight mb-5 leading-tight">
            Pronto para levar previsibilidade e controle radical para o seu squad?
          </h2>

          <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Elimine o retrabalho invisível, acompanhe sprints semanais com precisão matemática e dê adeus às reuniões intermináveis de status.
          </p>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Button
              size="lg"
              className="w-full sm:w-auto shadow-lg shadow-emerald-500/30 bg-[#10b981] hover:bg-[#059669] text-zinc-950 font-bold text-sm sm:text-base px-8 py-6 rounded-xl transition-all duration-200 gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              asChild
            >
              <a href={loginUrl} target="_blank" rel="noopener noreferrer">
                <span>Começar Gratuitamente</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 hover:border-emerald-500/40 text-zinc-200 hover:text-white font-medium text-sm sm:text-base px-6 py-6 rounded-xl transition-all duration-200 gap-2 cursor-pointer"
              asChild
            >
              <a href={demoUrl} target="_blank" rel="noopener noreferrer">
                <span>Explorar Demonstração ao Vivo</span>
                <ExternalLink className="w-4 h-4 text-emerald-400" />
              </a>
            </Button>
          </div>

          {/* Micro-copy de rodapé */}
          <div className="mt-8 pt-6 border-t border-zinc-800/60 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <span className="text-emerald-400 font-bold">✓</span>
              Sem necessidade de cartão de crédito
            </span>
            <span className="hidden sm:inline-block text-zinc-700">•</span>
            <span className="flex items-center gap-1.5 text-zinc-300">
              <span className="text-emerald-400 font-bold">✓</span>
              Setup instantâneo com Google ou GitHub
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
