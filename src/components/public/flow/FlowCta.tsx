'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink, ShieldCheck, Sparkles, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WhatsAppIcon } from '@/components/ui/icons'
import { FLOW_APP_URL } from '@/config/flow'

interface FlowCtaProps {
  whatsappUrl?: string | null
}

export function FlowCta({ whatsappUrl }: FlowCtaProps) {
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Software Sob Medida de Alta Fidelidade
          </div>

          {/* Headline */}
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white font-heading tracking-tight mb-5 leading-tight">
            Pronto para transformar sua ideia em um software com gestão profissional?
          </h2>

          <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Seja um sistema web interno, um SaaS ou uma plataforma para seus clientes:
            desenvolvemos com esteira ágil, código moderno e transparência de ponta a ponta.
          </p>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            {whatsappUrl ? (
              <Button
                size="lg"
                className="w-full sm:w-auto shadow-lg shadow-emerald-600/30 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm sm:text-base px-8 py-6 rounded-xl transition-all duration-200 gap-2 cursor-pointer"
                asChild
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="w-5 h-5 fill-white" />
                  Iniciar Projeto via WhatsApp
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </Button>
            ) : (
              <Button
                size="lg"
                className="w-full sm:w-auto shadow-lg shadow-emerald-600/30 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm sm:text-base px-8 py-6 rounded-xl transition-all duration-200 gap-2 cursor-pointer"
                asChild
              >
                <Link href="/#contato">
                  <MessageSquare className="w-5 h-5" />
                  Solicitar Avaliação Técnica
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            )}

            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white font-medium text-sm sm:text-base px-6 py-6 rounded-xl transition-all duration-200 gap-2 cursor-pointer"
              asChild
            >
              <a href={FLOW_APP_URL} target="_blank" rel="noopener noreferrer">
                <span>Conhecer a Ferramenta Catuto Flow</span>
                <ExternalLink className="w-4 h-4 text-emerald-400" />
              </a>
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-800/60 flex items-center justify-center gap-6 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Garantia de Entrega por Sprint
            </span>
            <span className="hidden sm:inline-block text-zinc-700">•</span>
            <span className="hidden sm:inline-flex items-center gap-1.5">
              Código 100% de Sua Propriedade
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
