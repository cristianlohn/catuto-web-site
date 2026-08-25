'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Globe,
  Zap,
  Activity,
  Sliders,
  Search,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'

export function BentoServices() {
  const services = [
    {
      id: 'sites-institucionais',
      title: 'Websites Institucionais Profissionais',
      tagline: 'Credibilidade Imediata',
      description:
        'Apresente sua empresa com elegância e autoridade. Sites completos com apresentação de serviços, fotos, mapa de localização e e-mails profissionais com seu domínio.',
      features: ['Múltiplas páginas explicativas', '100% adaptado para celular', 'E-mails corporativos (@suaempresa.com.br)'],
      icon: Globe,
      span: 'md:col-span-2',
      badge: 'Mais Procurado',
    },
    {
      id: 'landing-pages',
      title: 'Landing Pages de Alta Conversão',
      tagline: 'Foco em Vendas',
      description:
        'Páginas diretas ao ponto criadas para transformar visitantes em mensagens no seu WhatsApp. Ideais para anúncios no Google e Instagram.',
      features: ['Design persuasivo', 'Botões de WhatsApp em destaque', 'Carregamento instantâneo'],
      icon: Zap,
      span: 'md:col-span-1',
      badge: 'Gera Leads',
    },
    {
      id: 'otimizacao-velocidade',
      title: 'Otimização de Velocidade & Performance',
      tagline: 'Site Ultrarrápido',
      description:
        'Sites lentos perdem até 60% dos clientes antes mesmo da página abrir. Nós deixamos o seu site abrindo em menos de 1 segundo.',
      features: ['Compressão inteligente de imagens', 'Sem travamentos no celular', 'Nota máxima no Google'],
      icon: Activity,
      span: 'md:col-span-1',
      badge: 'Velocidade',
    },
    {
      id: 'painel-facil',
      title: 'Painel de Controle Intuitivo & Fácil',
      tagline: 'Autonomia Total',
      description:
        'Você mesmo atualiza textos, fotos, telefones e informações da sua empresa de maneira simples, sem depender de ninguém.',
      features: ['Fácil de usar até no celular', 'Sem mexer em códigos', 'Suporte sempre disponível'],
      icon: Sliders,
      span: 'md:col-span-1',
      badge: 'Praticidade',
    },
    {
      id: 'google-seo',
      title: 'Destaque no Google (SEO Local)',
      tagline: 'Seja Encontrado',
      description:
        'Estruturação para que pessoas da sua cidade e região encontrem seu negócio quando procurarem pelo que você faz no Google.',
      features: ['Cadastro no Google Meu Negócio', 'Palavras-chave da sua região', 'Carregamento veloz'],
      icon: Search,
      span: 'md:col-span-1',
      badge: 'Visibilidade',
    },
    {
      id: 'monitoramento-suporte',
      title: 'Monitoramento 24/7 & Suporte Próximo',
      tagline: 'Paz de Espírito',
      description:
        'Seu site sob vigia contínua 24 horas por dia para garantir que nunca saia do ar. Quando precisar de qualquer ajuste, nosso suporte atende direto no WhatsApp.',
      features: ['Checagem contínua de status', 'Avisos em tempo real', 'Atendimento direto com especialistas'],
      icon: CheckCircle2,
      span: 'md:col-span-2',
      badge: 'Garantia & SLA',
    },
  ]

  return (
    <section id="servicos" className="py-20 sm:py-28 bg-[#080c15] relative overflow-hidden border-t border-zinc-800/80 scroll-mt-24 sm:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <span>O que Fazemos</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight font-heading">
            Soluções Feitas para o Seu Negócio Crescer
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 mt-3 leading-relaxed">
            Desenvolvemos a estrutura digital que sua empresa precisa para passar confiança, atrair novos clientes e vender todos os dias.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {services.map((service, idx) => {
            const Icon = service.icon

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className={`p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 hover:border-emerald-500/40 transition-all group flex flex-col justify-between ${service.span}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>

                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-zinc-800 text-emerald-300 border border-zinc-700/60">
                      {service.badge}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                    {service.tagline}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3 font-heading">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-800/80 space-y-3">
                  <div className="space-y-1.5">
                    {service.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs text-zinc-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <Link
                      href="#contato"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors group/link"
                    >
                      <span>Quero um orçamento desse serviço</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
