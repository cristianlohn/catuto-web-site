'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Compass,
  Eye,
  ShieldCheck,
  CheckCircle2,
  Users,
  Award,
} from 'lucide-react'

export function AboutSection() {
  const values = [
    {
      title: 'Transparência Total',
      desc: 'Comunicação clara e direta em todas as etapas, com prazos reais e sem letras miúdas.',
    },
    {
      title: 'Agilidade na Entrega',
      desc: 'Processos dinâmicos para colocar o seu site no ar rápido e começar a atrair clientes.',
    },
    {
      title: 'Excelência & Velocidade',
      desc: 'Tecnologia de ponta para que seu site carregue no celular em menos de 1 segundo.',
    },
    {
      title: 'Parceria com o Cliente',
      desc: 'Não entregamos apenas um site; acompanhamos o crescimento do seu negócio no digital.',
    },
  ]

  return (
    <section id="sobre" className="py-20 sm:py-28 bg-[#060910] relative overflow-hidden border-t border-zinc-800/80 scroll-mt-24 sm:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-16 sm:mb-20">
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>Quem Somos</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight font-heading">
              CATUTO Soluções Digitais: Sua Base no Digital
            </h2>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
              A <strong className="text-emerald-400 font-bold">CATUTO</strong> é uma empresa focada em transformar a presença digital de empreendedores e pequenas empresas. Nós criamos websites profissionais, modernos e de alta performance que servem como a base sólida para o crescimento do seu negócio online, permitindo que você navegue com segurança e destaque no mercado.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Projetos Sob Medida</h4>
                  <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                    Feitos especialmente para a realidade e necessidade do seu negócio.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Atendimento Humano</h4>
                  <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                    Fale direto com a equipe que desenvolve o seu site, sem robôs chatos.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card Visual / Estatística */}
          <div className="lg:col-span-5 relative">
            <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -z-10" />

              <div className="flex items-center gap-3 mb-6">
                <img
                  src="/brand/catuto-symbol.webp"
                  alt="Catuto"
                  className="w-12 h-12 rounded-xl object-contain border border-emerald-500/30 bg-black p-1 shadow-lg shadow-emerald-500/20"
                />
                <div>
                  <h4 className="text-base font-bold text-white font-heading">
                    Compromisso com o seu Negócio
                  </h4>
                  <span className="text-xs text-emerald-400 font-semibold">
                    Atendimento Online para Todo o Brasil
                  </span>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/80 pt-5">
                <p>
                  Acreditamos que todo pequeno empresário merece um site tão profissional e bonito quanto o das grandes marcas, com custo acessível e retorno real sobre o investimento.
                </p>
                <p className="text-zinc-400">
                  Nosso objetivo é tirar toda a complicação técnica do seu caminho para que você possa focar no que faz de melhor: cuidar dos seus clientes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Missão, Visão e Valores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-zinc-800/80">
          {/* Missão */}
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between group hover:border-emerald-500/30 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 border border-emerald-500/20">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-heading">Nossa Missão</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Criar websites profissionais e funcionais que funcionem como ativos de crescimento e autoridade para nossos clientes no digital.
              </p>
            </div>
          </div>

          {/* Visão */}
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between group hover:border-emerald-500/30 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-5 border border-teal-500/20">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-heading">Nossa Visão</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Ser reconhecida como a principal referência em agilidade e design na criação de presença digital para empreendedores no Brasil.
              </p>
            </div>
          </div>

          {/* Nossos Valores */}
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between group hover:border-emerald-500/30 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 border border-emerald-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3 font-heading">Nossos Princípios</h3>
              <div className="space-y-2">
                {values.map((val, idx) => (
                  <div key={idx} className="text-xs">
                    <span className="font-bold text-emerald-400">• {val.title}: </span>
                    <span className="text-zinc-400">{val.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
