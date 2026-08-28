'use client'

import * as React from 'react'
import { Client } from '@/types/database'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import {
  ExternalLink,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Building2,
  Sparkles,
} from 'lucide-react'

interface ClientsShowcaseProps {
  clients: Client[]
}

export function ClientsShowcase({ clients }: ClientsShowcaseProps) {
  // Se não houver nenhum cliente ativo, não renderiza a seção
  if (!clients || clients.length === 0) {
    return null
  }

  const isSmallCount = clients.length <= 2

  return (
    <section id="clientes" className="py-20 sm:py-28 relative scroll-mt-20 overflow-hidden">
      {/* Luz ambiente de fundo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-[450px] pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] sm:w-[650px] h-[300px] bg-gradient-to-tr from-emerald-600/10 via-teal-500/10 to-blue-600/10 blur-[130px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho da Seção */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <Badge
              variant="outline"
              className="mb-4 gap-1.5 py-1 px-3 bg-emerald-950/40 border-emerald-500/30 text-emerald-400 text-xs tracking-wider uppercase font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Projetos Reais & Prova Social
            </Badge>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 font-heading"
          >
            Empresas que Confiam na Nossa Estrutura
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-zinc-400 text-sm sm:text-base leading-relaxed"
          >
            Conheça alguns dos negócios que contam com a engenharia, velocidade e design da Catuto para acelerar suas vendas e transmitir máxima credibilidade no digital.
          </motion.p>
        </div>

        {/* Grid de Cards de Clientes */}
        <div
          className={`grid gap-6 sm:gap-8 mx-auto ${
            isSmallCount
              ? 'grid-cols-1 md:grid-cols-2 max-w-4xl'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl'
          }`}
        >
          {clients.map((client, idx) => (
            <motion.div
              key={client.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.12 }}
              className="flex"
            >
              <div className="w-full rounded-3xl bg-zinc-900/60 border border-zinc-800/80 hover:border-emerald-500/40 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 backdrop-blur-md group hover:shadow-2xl hover:shadow-emerald-500/5 relative overflow-hidden">
                {/* Linha decorativa sutil no topo do card ao passar o mouse */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/0 to-transparent group-hover:via-emerald-500/60 transition-all duration-500" />

                <div>
                  {/* Topo: Logo/Monograma + Status Online */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3.5">
                      {client.logo_url ? (
                        <div className="w-14 h-14 rounded-2xl bg-zinc-950/80 border border-zinc-800 p-2 flex items-center justify-center shrink-0 group-hover:border-zinc-700 transition-colors shadow-inner">
                          <img
                            src={client.logo_url}
                            alt={`Logotipo da empresa ${client.name}`}
                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-900/40 via-teal-900/30 to-zinc-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-extrabold text-lg shrink-0 shadow-inner group-hover:border-emerald-500/60 transition-colors">
                          {client.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}

                      <div className="flex flex-col min-w-0">
                        <span className="text-[11px] font-semibold text-emerald-400 tracking-wide uppercase">
                          {client.category || 'Website Institucional'}
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate group-hover:text-emerald-300 transition-colors">
                          {client.name}
                        </h3>
                      </div>
                    </div>

                    {/* Status Online Pulse */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-[11px] font-medium text-emerald-400 shrink-0">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="hidden sm:inline">Online</span>
                    </div>
                  </div>

                  {/* Resumo do Projeto */}
                  {client.description && (
                    <p className="text-zinc-300 text-xs sm:text-sm mb-6 leading-relaxed">
                      {client.description}
                    </p>
                  )}

                  {/* Badges / Tags do Projeto */}
                  {Array.isArray(client.tags) && client.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {client.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-950/80 border border-zinc-800/80 text-zinc-400 font-medium group-hover:border-zinc-700 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Rodapé do Card: Link Oficial de Visita */}
                <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                  <span className="text-xs text-zinc-500 font-mono truncate max-w-[170px] sm:max-w-[200px]">
                    {client.website_url.replace(/^https?:\/\//, '')}
                  </span>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs font-semibold text-emerald-400 hover:text-white hover:bg-emerald-600/20 group/btn gap-1.5 p-0 sm:px-3 h-8"
                    asChild
                  >
                    <a
                      href={client.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Acessar site oficial da ${client.name}`}
                    >
                      Visitar Site
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
