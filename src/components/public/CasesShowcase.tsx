'use client'

import * as React from 'react'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

export function CasesShowcase() {
  const cases = [
    {
      company: 'Logix Supply B2B',
      sector: 'Logística & Cadeia de Suprimentos',
      title: 'Redesenho Institucional & Portal de Cotações com Next.js',
      results: [
        { label: 'Tempo de Carga', value: '0.38s' },
        { label: 'Cotações', value: '+310%' },
        { label: 'Score Google', value: '100/100' },
      ],
      description:
        'Substituição de portal legado lento por arquitetura moderna integrada ao Supabase, resultando em triplicação de leads qualificados.',
      tags: ['Next.js App Router', 'Supabase Auth', 'Tailwind', 'Resend'],
    },
    {
      company: 'OmniCloud SaaS Enterprise',
      sector: 'Tecnologia & B2B Software',
      title: 'Landing Pages de Hiperconversão para Campanhas Globais',
      results: [
        { label: 'Conversão', value: '14.2%' },
        { label: 'Custo por Lead', value: '-42%' },
        { label: 'Uptime SLA', value: '99.98%' },
      ],
      description:
        'Ecossistema de landing pages dinâmicas com testes contínuos e integração direta de webhooks ao CRM corporativo.',
      tags: ['Edge Rendering', 'Webhook Automations', 'Framer Motion', 'Zod'],
    },
    {
      company: 'Apex Industrial Soluções',
      sector: 'Indústria & Manufatura',
      title: 'Website Institucional Multilíngue com SEO Técnico de Alto Impacto',
      results: [
        { label: 'Tráfego Orgânico', value: '+185%' },
        { label: 'Páginas Top 1', value: '100%' },
        { label: 'Latência Global', value: '82ms' },
      ],
      description:
        'Otimização completa de Core Web Vitals e dados estruturados Schema.org, conquistando o topo do ranking orgânico.',
      tags: ['JSON-LD Schema', 'ISR Caching', 'PostgreSQL', 'CDN Edge'],
    },
  ]

  return (
    <section id="cases" className="py-20 sm:py-28 relative scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <Badge variant="accent" className="mb-4">
            PROVA SOCIAL & RESULTADOS
          </Badge>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Cases Reais que Geram Impacto Financeiro
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Conheça projetos desenvolvidos pela Catuto e o retorno tangível gerado para nossos parceiros B2B.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {cases.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <div className="h-full rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-blue-500/40 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 backdrop-blur-sm">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="text-[11px] bg-zinc-800/60 text-zinc-300">
                      {item.sector}
                    </Badge>
                    <span className="text-xs font-semibold text-blue-400">
                      {item.company}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-zinc-400 text-xs sm:text-sm mb-6 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 mb-6 text-center">
                    {item.results.map((res, rIdx) => (
                      <div key={rIdx} className="flex flex-col">
                        <span className="text-sm sm:text-base font-bold text-emerald-400">
                          {res.value}
                        </span>
                        <span className="text-[10px] text-zinc-400 leading-tight mt-0.5">
                          {res.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-zinc-800/60">
                  {item.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
