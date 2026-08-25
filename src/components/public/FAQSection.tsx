'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, ChevronDown } from 'lucide-react'
import { formatWhatsAppUrl } from '@/lib/masks'
import { Button } from '@/components/ui/button'
import { WhatsAppIcon } from '@/components/ui/icons'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'Quanto tempo demora para o meu site ficar pronto?',
    answer:
      'Nosso processo é muito ágil! Landing pages e páginas de vendas são entregues em média entre 5 e 7 dias úteis. Websites institucionais completos costumam levar de 12 a 20 dias, dependendo do número de páginas e do envio dos materiais.',
  },
  {
    question: 'Eu mesmo consigo alterar os textos, fotos e telefones?',
    answer:
      'Com certeza! Entregamos o seu site integrado a um Painel Administrativo simples e fácil de usar até pelo celular. Você mesmo pode atualizar fotos, horários de atendimento, telefones e textos em poucos segundos, sem precisar pagar ninguém para fazer isso.',
  },
  {
    question: 'O site vai funcionar perfeitamente no celular?',
    answer:
      'Sim! Mais de 80% dos acessos na internet hoje vêm de smartphones. Por isso, desenvolvemos cada detalhe com foco prioritário no celular: botões fáceis de tocar, carregamento instantâneo e botão de WhatsApp que abre a conversa com 1 toque.',
  },
  {
    question: 'O que está incluso na criação do site?',
    answer:
      'Tudo o que sua empresa precisa: design moderno e exclusivo, botão flutuante de WhatsApp, formulário de contato no e-mail, certificado de segurança SSL (o cadeado verde), otimização para o Google e monitoramento 24h para garantir que seu site nunca fique fora do ar.',
  },
  {
    question: 'Vocês dão suporte depois que o site for lançado?',
    answer:
      'Sim! Não te deixamos na mão após a entrega. Oferecemos suporte direto via WhatsApp para tirar qualquer dúvida, além de monitoramento contínuo de estabilidade para que sua empresa fique sempre disponível para os clientes.',
  },
  {
    question: 'Como funciona o pagamento?',
    answer:
      'Trabalhamos com condições facilitadas e transparentes para pequenos empreendedores, com parcelamento e desconto para pagamento à vista no Pix. Solicite um orçamento sem compromisso para receber uma proposta sob medida!',
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0)

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  const whatsappLink = formatWhatsAppUrl('5547996348698', 'Olá! Gostaria de tirar algumas dúvidas sobre a criação de sites.')

  return (
    <section id="faq" className="py-20 sm:py-28 bg-[#080c15] relative overflow-hidden border-t border-zinc-800/80 scroll-mt-24 sm:scroll-mt-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Tire Suas Dúvidas</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight font-heading">
            Perguntas Frequentes
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 mt-3 max-w-xl mx-auto">
            Respostas diretas sobre prazos, funcionamento, suporte e como ajudamos sua empresa a crescer.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx

            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isOpen
                    ? 'bg-zinc-900/80 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
                    : 'bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left transition-colors cursor-pointer gap-4"
                >
                  <span className="text-sm sm:text-base font-bold text-white font-heading">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? 'rotate-180 bg-emerald-500/20 text-emerald-400'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-5 pb-6 sm:px-6 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/60 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        {/* Dúvida Adicional / CTA */}
        {whatsappLink && (
          <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h4 className="text-base font-bold text-white font-heading">
                Ainda ficou com alguma dúvida?
              </h4>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Fale direto com a nossa equipe no WhatsApp e tire todas as suas dúvidas na hora.
              </p>
            </div>

            <Button
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-600/20 whitespace-nowrap gap-2"
              asChild
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="w-4.5 h-4.5 fill-white" />
                Chamar no WhatsApp
              </a>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
