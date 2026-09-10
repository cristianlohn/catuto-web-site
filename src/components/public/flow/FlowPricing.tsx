'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Users,
  HelpCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FLOW_APP_URL } from '@/config/flow'

interface Plan {
  id: string
  name: string
  tag: string
  description: string
  monthlyPrice: string
  annualPrice: string
  periodMonthly: string
  periodAnnual: string
  billingNoteMonthly: string
  billingNoteAnnual: string
  isFeatured?: boolean
  badge?: string
  featuresHeader?: string
  features: string[]
  cta: {
    label: string
    href: string
    variant: 'outline' | 'solid-emerald'
    isExternal?: boolean
  }
}

const PLANS: Plan[] = [
  {
    id: 'community',
    name: 'Community / Free',
    tag: 'Para Devs & Pequenos Times',
    description: 'Experimente a transparência radical e organize seus primeiros projetos sem custo.',
    monthlyPrice: 'R$ 0',
    annualPrice: 'R$ 0',
    periodMonthly: '/ mês',
    periodAnnual: '/ mês',
    billingNoteMonthly: 'Grátis para sempre',
    billingNoteAnnual: 'Grátis para sempre',
    features: [
      'Até 3 membros na organização',
      '1 Projeto ativo (6 colunas canônicas)',
      'Sprint ativa com gestão de backlog',
      'Isolamento de dados multi-tenant anti-IDOR',
    ],
    cta: {
      label: 'Começar Grátis',
      href: `${FLOW_APP_URL}/login`,
      variant: 'outline',
      isExternal: true,
    },
  },
  {
    id: 'pro',
    name: 'Pro / Squad',
    tag: 'Recomendado para Squads',
    description: 'Governança avançada, prevenção de retrabalho e entrega previsível para squads em produção.',
    monthlyPrice: 'R$ 29',
    annualPrice: 'R$ 24',
    periodMonthly: '/ membro / mês',
    periodAnnual: '/ membro / mês',
    billingNoteMonthly: 'Faturado mensalmente',
    billingNoteAnnual: 'Cobrado anualmente (2 meses grátis • R$ 288/ano)',
    isFeatured: true,
    badge: 'RECOMENDADO PARA SQUADS',
    featuresHeader: 'Tudo do Community, mais:',
    features: [
      'Membros e projetos ilimitados',
      'Múltiplas Sprints e Gestão de Versões',
      'Trava de Retrabalho com justificativa obrigatória',
      'Checklists Markdown interativos e comentários técnicos',
      'Suporte prioritário via WhatsApp',
    ],
    cta: {
      label: 'Iniciar Teste Pro',
      href: `${FLOW_APP_URL}/login?plan=pro`,
      variant: 'solid-emerald',
      isExternal: true,
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tag: 'Operações Corporativas',
    description: 'Segurança de nível corporativo, conformidade estrita e apoio de engenharia dedicado.',
    monthlyPrice: 'Sob Consulta',
    annualPrice: 'Sob Consulta',
    periodMonthly: '(Personalizado)',
    periodAnnual: '(Personalizado)',
    billingNoteMonthly: 'Contrato personalizado & SLA dedicado',
    billingNoteAnnual: 'Contrato personalizado & SLA dedicado',
    featuresHeader: 'Tudo do Pro, mais:',
    features: [
      'Ambiente cloud de alta performance',
      'Onboarding técnico assistido pela equipe Catuto',
      'Faturamento corporativo via Nota Fiscal e Contrato (Boleto/PIX anual)',
      'Suporte prioritário via canal exclusivo (WhatsApp / Slack)',
      'SLA de atendimento garantido',
    ],
    cta: {
      label: 'Falar com Consultor',
      href: 'https://wa.me/5547996348698?text=Ol%C3%A1!%20Gostaria%20de%20conversar%20sobre%20o%20plano%20Enterprise%20do%20Catuto%20Flow.',
      variant: 'outline',
      isExternal: true,
    },
  },
]

const FAQ_ITEMS = [
  {
    icon: ShieldCheck,
    question: 'Posso cancelar quando quiser?',
    answer: 'Sim, cancele a qualquer momento sem fidelidade contratual.',
  },
  {
    icon: Users,
    question: 'Como funciona a cobrança por assento?',
    answer: 'Pague apenas pelos membros ativos do seu time no mês.',
  },
  {
    icon: Sparkles,
    question: 'Consigo testar a plataforma antes?',
    answer: 'Sim, acesse a demonstração ao vivo sem necessidade de cadastro.',
  },
]

export function FlowPricing() {
  const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'annual'>('annual')
  const isAnnual = billingCycle === 'annual'

  return (
    <section id="planos" className="py-16 md:py-24 relative overflow-hidden">
      {/* Luz ambiente de fundo */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-[500px] pointer-events-none -z-10">
        <div className="w-full h-full bg-emerald-600/5 blur-[180px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho da Seção */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-semibold tracking-wider mb-4"
          >
            <span>✦ PLANOS &amp; PREÇOS • CATUTO FLOW ✦</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white font-heading tracking-tight leading-tight"
          >
            Previsibilidade para o seu squad,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
              sem custos ocultos
            </span>
            .
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto"
          >
            Comece gratuitamente com seu time ou escale para recursos avançados de governança, sprints fechadas e
            travas de retrabalho.
          </motion.p>
        </div>

        {/* Alternador de Período (Toggle Mensal / Anual) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex items-center justify-center mb-14"
        >
          <div className="inline-flex items-center p-1.5 rounded-full bg-[#080c15] border border-zinc-800 shadow-inner max-w-full overflow-x-auto">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                !isAnnual
                  ? 'bg-zinc-800 text-white shadow-md border border-zinc-700/60'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Mensal
            </button>

            <button
              type="button"
              onClick={() => setBillingCycle('annual')}
              className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                isAnnual
                  ? 'bg-emerald-950/80 text-emerald-300 shadow-md border border-emerald-500/40'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>Anual</span>
              <span
                className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap transition-colors ${
                  isAnnual
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-zinc-800 text-zinc-400 border border-zinc-700/50'
                }`}
              >
                2 meses grátis / 20% OFF
              </span>
            </button>
          </div>
        </motion.div>

        {/* Grade de 3 Planos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch max-w-7xl mx-auto">
          {PLANS.map((plan, idx) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice
            const period = isAnnual ? plan.periodAnnual : plan.periodMonthly
            const billingNote = isAnnual ? plan.billingNoteAnnual : plan.billingNoteMonthly

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`relative rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 group ${
                  plan.isFeatured
                    ? 'bg-gradient-to-b from-[#0c1626] to-[#080c15] border-2 border-emerald-500/50 shadow-2xl shadow-emerald-950/50 hover:border-emerald-400/90 lg:-translate-y-2'
                    : 'bg-[#080c15] border border-zinc-800/80 hover:border-emerald-500/30'
                }`}
              >
                {/* Glow de fundo do Card em Destaque */}
                {plan.isFeatured && (
                  <div className="absolute -inset-0.5 bg-gradient-to-b from-emerald-500/25 via-emerald-500/10 to-transparent rounded-2xl blur-xl -z-10 pointer-events-none opacity-80" />
                )}

                {/* Badge Superior Verde Neon para o Pro */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#10b981] text-zinc-950 text-[10px] sm:text-[11px] font-black tracking-wider uppercase shadow-[0_0_20px_rgba(16,185,129,0.6)] border border-emerald-300/40 flex items-center gap-1.5 whitespace-nowrap z-10">
                    <Sparkles className="w-3.5 h-3.5 fill-zinc-950" />
                    {plan.badge}
                  </div>
                )}

                <div>
                  {/* Topo do Card: Tag e Nome */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold text-emerald-400/90 tracking-wide uppercase">
                      {plan.tag}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-white font-heading mb-2">
                    {plan.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6 min-h-[38px]">
                    {plan.description}
                  </p>

                  {/* Valor do Plano */}
                  <div className="pt-4 pb-6 border-y border-zinc-800/60 mb-6">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
                        {price}
                      </span>
                      {period && (
                        <span className="text-xs sm:text-sm text-zinc-400 font-normal">
                          {period}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 mt-2 min-h-[18px]">
                      {billingNote}
                    </p>
                  </div>

                  {/* Lista de Recursos */}
                  <div className="space-y-3 mb-8">
                    {plan.featuresHeader && (
                      <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                        {plan.featuresHeader}
                      </p>
                    )}
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA do Card */}
                <div className="pt-2">
                  {plan.cta.variant === 'solid-emerald' ? (
                    <Button
                      size="lg"
                      className="w-full shadow-lg shadow-emerald-500/25 bg-[#10b981] hover:bg-[#059669] text-zinc-950 font-bold text-sm sm:text-base py-6 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 gap-2 cursor-pointer"
                      asChild
                    >
                      <a
                        href={plan.cta.href}
                        target={plan.cta.isExternal ? '_blank' : undefined}
                        rel={plan.cta.isExternal ? 'noopener noreferrer' : undefined}
                      >
                        <span>{plan.cta.label}</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 hover:border-emerald-500/40 text-zinc-200 hover:text-white font-semibold text-sm sm:text-base py-6 rounded-xl transition-all duration-200 gap-2 cursor-pointer"
                      asChild
                    >
                      <a
                        href={plan.cta.href}
                        target={plan.cta.isExternal ? '_blank' : undefined}
                        rel={plan.cta.isExternal ? 'noopener noreferrer' : undefined}
                      >
                        <span>{plan.cta.label}</span>
                        {plan.cta.isExternal ? (
                          <ExternalLink className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <ArrowRight className="w-4 h-4" />
                        )}
                      </a>
                    </Button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* FAQ Rápido Embutido */}
        <div className="mt-16 pt-12 border-t border-zinc-800/60 max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
              <HelpCircle className="w-3.5 h-3.5" />
              Perguntas Frequentes
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white font-heading">
              Tudo o que você precisa saber antes de começar
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {FAQ_ITEMS.map((faq, idx) => {
              const Icon = faq.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="p-5 sm:p-6 rounded-2xl bg-[#080c15] border border-zinc-800/80 hover:border-emerald-500/20 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 mb-4">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-white mb-2 font-heading">
                      {faq.question}
                    </h4>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
