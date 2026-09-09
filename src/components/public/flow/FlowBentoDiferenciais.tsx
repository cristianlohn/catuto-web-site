'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Eye,
  ShieldAlert,
  Cpu,
  GitPullRequest,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'

export function FlowBentoDiferenciais() {
  const cards = [
    {
      id: 'visibilidade',
      title: 'Visibilidade em Tempo Real',
      tagline: 'Adeus às Reuniões Intermináveis',
      description:
        'Acompanhe o código e as entregas a cada sprint diretamente no seu board. Cada funcionalidade concluída, em análise ou em homologação fica transparente para você sem precisar mandar mensagens no WhatsApp perguntando "como está o status?".',
      badge: 'Transparência Radical',
      icon: Eye,
      span: 'md:col-span-2',
      metrics: [
        'Acesso 24/7 ao progresso real do software',
        'Histórico detalhado de cada funcionalidade entregue',
        'Demonstrações executáveis ao final de cada ciclo',
      ],
    },
    {
      id: 'retrabalho',
      title: 'Zero Retrabalho Oculto',
      tagline: 'Previsibilidade Financeira',
      description:
        'Bloqueios e impedimentos técnicos documentados na hora. Diferente de agências tradicionais que escondem problemas até a data de entrega, nossa coluna canônica de Retrabalho trava o fluxo e sinaliza ajustes na hora.',
      badge: 'Sem Surpresas',
      icon: ShieldAlert,
      span: 'md:col-span-1',
      metrics: [
        'Trava ativa em caso de impedimento técnico',
        'Zero horas extras cobradas por falhas de escopo',
        'Decisões rápidas tomadas com dados reais',
      ],
    },
    {
      id: 'alta-densidade',
      title: 'Engenharia de Alta Densidade',
      tagline: 'Software Rápido e Limpo',
      description:
        'Construímos nossas próprias ferramentas de engenharia. O Catuto Flow foi desenvolvido do zero com Next.js, Server Actions e bancos de alta eficiência para rodar instantaneamente sem depender de plataformas lentas de terceiros.',
      badge: 'Performance Extrema',
      icon: Cpu,
      span: 'md:col-span-1',
      metrics: [
        'Stack moderna sem gargalos técnicos',
        'Arquitetura escalável desenhada para crescer',
        'Código limpo, testado e documentado',
      ],
    },
    {
      id: 'sprints',
      title: 'Sprints Fechadas & Entregas Contínuas',
      tagline: 'Ciclos de 7 a 14 Dias',
      description:
        'Trabalhamos em ciclos ágeis curtos. Cada sprint possui um escopo rígido e acordado previamente: nós desenvolvemos, testamos e colocamos em homologação para você validar sem estresse.',
      badge: 'Metodologia Ágil',
      icon: GitPullRequest,
      span: 'md:col-span-2',
      metrics: [
        'Versionamento semântico de releases',
        'Deploy automatizado com esteira de testes',
        'Entrega de valor palpável semana após semana',
      ],
    },
  ]

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Luz ambiente sutil */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[400px] pointer-events-none -z-10">
        <div className="w-full h-full bg-emerald-600/5 blur-[160px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Por que a Catuto é Diferente
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
            Engenharia séria aplicada ao seu negócio, sem enrolação
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400">
            Enquanto o mercado convencional entrega atrasos e desculpas técnicas, nosso processo foi
            arquitetado para dar controle absoluto a quem investe no projeto.
          </p>
        </div>

        {/* Grid Bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, idx) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`p-6 sm:p-8 rounded-2xl bg-[#080c15] border border-zinc-800/80 hover:border-emerald-500/30 transition-all duration-300 relative group flex flex-col justify-between ${card.span}`}
              >
                <div>
                  {/* Topo do Card */}
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:border-emerald-500/40 transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/20 text-emerald-400">
                      {card.badge}
                    </span>
                  </div>

                  {/* Título & Tagline */}
                  <span className="text-xs font-semibold text-zinc-400 block mb-1">
                    {card.tagline}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3 font-heading">
                    {card.title}
                  </h3>

                  {/* Descrição */}
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                    {card.description}
                  </p>
                </div>

                {/* Métricas / Itens */}
                <div className="pt-4 border-t border-zinc-800/60 space-y-2">
                  {card.metrics.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
