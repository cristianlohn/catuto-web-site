'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  Zap,
  Clock,
  ShieldCheck,
} from 'lucide-react'

export function Metrics() {
  const metrics = [
    {
      value: '+300%',
      label: 'Mais Mensagens no WhatsApp',
      desc: 'Botões e chamadas estratégicas para fechar negócios',
      icon: TrendingUp,
    },
    {
      value: '< 1s',
      label: 'Abertura no Celular',
      desc: 'Seu cliente não desiste por demora no carregamento',
      icon: Zap,
    },
    {
      value: '7 a 15d',
      label: 'Prazo Médio de Entrega',
      desc: 'Processo ágil para seu site começar a render rápido',
      icon: Clock,
    },
    {
      value: '99.9%',
      label: 'Uptime & Estabilidade',
      desc: 'Monitoramento 24h para seu site nunca sair do ar',
      icon: ShieldCheck,
    },
  ]

  return (
    <section className="py-16 bg-[#080c15] border-y border-zinc-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {metrics.map((item, idx) => {
            const Icon = item.icon

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-5 sm:p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800/80 flex flex-col justify-between group hover:border-emerald-500/30 transition-colors"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight mb-1">
                    {item.value}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-emerald-400 mb-1">
                    {item.label}
                  </h4>
                </div>
                <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed mt-2">
                  {item.desc}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
