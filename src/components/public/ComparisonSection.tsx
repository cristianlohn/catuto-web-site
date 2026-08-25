'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Check, X, Sparkles, AlertTriangle } from 'lucide-react'

export function ComparisonSection() {
  const comparisonData = [
    {
      feature: 'Velocidade no Celular',
      traditional: 'Lento (leva de 5 a 10s para abrir)',
      catuto: 'Instantâneo (abre em menos de 1s)',
    },
    {
      feature: 'Design & Visual',
      traditional: 'Modelos prontos que parecem cópia de outros sites',
      catuto: 'Visual exclusivo que transmite autoridade e valor',
    },
    {
      feature: 'Foco em Vendas & WhatsApp',
      traditional: 'Contato escondido e formulários que ninguém preenche',
      catuto: 'Botões estratégicos de WhatsApp que facilitam o fechamento',
    },
    {
      feature: 'Posicionamento no Google',
      traditional: 'Não é encontrado quando pesquisam na sua cidade',
      catuto: 'Estruturado para aparecer nos primeiros resultados locais',
    },
    {
      feature: 'Painel para Atualizações',
      traditional: 'Complicado de mexer ou você depende de terceiros',
      catuto: 'Painel fácil para você mudar fotos e textos quando quiser',
    },
    {
      feature: 'Suporte & Acompanhamento',
      traditional: 'Sem suporte quando o site sai do ar',
      catuto: 'Monitoramento 24h e suporte humano direto no WhatsApp',
    },
  ]

  return (
    <section id="comparativo" className="py-20 sm:py-28 bg-[#060910] relative overflow-hidden border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Por que a Catuto</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight font-heading">
            A Diferença Entre um Site Comum e um Site Catuto
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 mt-3 leading-relaxed">
            Veja por que investir em uma estrutura profissional traz muito mais retorno para a sua empresa.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-zinc-800/80 bg-zinc-950/80">
            <div className="p-5 sm:p-6 md:col-span-4 font-bold text-xs sm:text-sm text-zinc-400 uppercase tracking-wider">
              Recurso & Benefício
            </div>
            <div className="p-5 sm:p-6 md:col-span-4 font-bold text-xs sm:text-sm text-zinc-400 uppercase tracking-wider flex items-center gap-2 border-t md:border-t-0 md:border-l border-zinc-800/80">
              <AlertTriangle className="w-4 h-4 text-zinc-400" />
              Sites Amadores / Plataformas Prontas
            </div>
            <div className="p-5 sm:p-6 md:col-span-4 font-bold text-xs sm:text-sm text-emerald-400 uppercase tracking-wider flex items-center gap-2 border-t md:border-t-0 md:border-l border-zinc-800/80 bg-emerald-950/20">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Estrutura Profissional Catuto
            </div>
          </div>

          <div className="divide-y divide-zinc-800/60">
            {comparisonData.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 hover:bg-zinc-800/30 transition-colors"
              >
                <div className="p-4 sm:p-5 md:col-span-4 font-bold text-sm text-white flex items-center font-heading">
                  {item.feature}
                </div>

                <div className="p-4 sm:p-5 md:col-span-4 text-xs sm:text-sm text-zinc-400 flex items-center gap-2.5 border-t md:border-t-0 md:border-l border-zinc-800/60">
                  <div className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center shrink-0">
                    <X className="w-3.5 h-3.5" />
                  </div>
                  <span>{item.traditional}</span>
                </div>

                <div className="p-4 sm:p-5 md:col-span-4 text-xs sm:text-sm text-white font-medium flex items-center gap-2.5 border-t md:border-t-0 md:border-l border-zinc-800/60 bg-emerald-950/10">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{item.catuto}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
