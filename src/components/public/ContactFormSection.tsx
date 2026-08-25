'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactFormSchema, ContactFormData } from '@/lib/validations/contact'
import { submitContactForm } from '@/app/actions/contact'
import { SiteSettings } from '@/types/database'
import { maskPhone, formatWhatsAppUrl } from '@/lib/masks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { WhatsAppIcon } from '@/components/ui/icons'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Mail,
  MapPin,
  Loader2,
} from 'lucide-react'

interface ContactFormSectionProps {
  settings: SiteSettings
}

const serviceOptions = [
  'Website Institucional',
  'Landing Page para WhatsApp',
  'Otimização de Velocidade',
  'Outro Projeto / Consultoria',
]

export function ContactFormSection({ settings }: ContactFormSectionProps) {
  const [selectedService, setSelectedService] = React.useState(serviceOptions[0])
  const [status, setStatus] = React.useState<{
    success?: boolean
    message?: string
    error?: string
  } | null>(null)
  const [isPending, setIsPending] = React.useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      service: serviceOptions[0],
      name: '',
      email: '',
      phone: '',
      company: '',
      message: '',
    },
  })

  const phoneValue = watch('phone')

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = maskPhone(e.target.value)
    setValue('phone', formatted, { shouldValidate: true })
  }

  const handleServiceSelect = (svc: string) => {
    setSelectedService(svc)
    setValue('service', svc, { shouldValidate: true })
  }

  const onSubmit = async (data: ContactFormData) => {
    setIsPending(true)
    setStatus(null)

    try {
      const res = await submitContactForm(data)
      if (res.success) {
        setStatus({
          success: true,
          message: res.message || 'Sua solicitação foi enviada com sucesso! Entraremos em contato em breve.',
        })
        reset()
      } else {
        setStatus({
          success: false,
          error: res.error || 'Ocorreu um erro ao enviar. Tente novamente ou nos chame no WhatsApp.',
        })
      }
    } catch (err) {
      setStatus({
        success: false,
        error: 'Erro de conexão. Por favor, tente novamente.',
      })
    } finally {
      setIsPending(false)
    }
  }

  const whatsappLink = formatWhatsAppUrl(settings.whatsapp, settings.whatsapp_message)

  const hasContactInfo = Boolean(
    settings.email?.trim() ||
    settings.phone?.trim() ||
    settings.address?.trim() ||
    settings.cnpj?.trim()
  )

  return (
    <section id="contato" className="py-20 sm:py-28 relative scroll-mt-24 sm:scroll-mt-28 overflow-hidden bg-[#060910] border-t border-zinc-800/80">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[400px] bg-emerald-600/10 blur-[140px] -z-10 rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Fale Conosco</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3 font-heading">
            Solicite um Orçamento Sem Compromisso
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Conte um pouco sobre a sua empresa e o que você precisa. Retornamos rapidamente com a melhor proposta para o seu negócio.
          </p>
        </div>

        <div className={`grid grid-cols-1 ${hasContactInfo ? 'lg:grid-cols-12' : 'max-w-3xl mx-auto'} gap-6 sm:gap-8`}>
          {/* Informações da Empresa */}
          {hasContactInfo && (
            <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 font-heading">
                  Atendimento Direto & Rápido
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8">
                  Tire dúvidas ou solicite um atendimento personalizado diretamente com a nossa equipe.
                </p>

                <div className="space-y-4 mb-6 sm:mb-8">
                  {settings.phone?.trim() && (
                    <div className="flex items-center gap-3 text-xs sm:text-sm">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                        <WhatsAppIcon className="w-5 h-5 fill-[#25D366]" />
                      </div>
                      <div>
                        <span className="text-[11px] text-zinc-400 block">WhatsApp Comercial</span>
                        <span className="font-semibold text-white">{settings.phone}</span>
                      </div>
                    </div>
                  )}

                  {settings.email?.trim() && (
                    <div className="flex items-center gap-3 text-xs sm:text-sm">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] text-zinc-400 block">E-mail Direto</span>
                        <a
                          href={`mailto:${settings.email}`}
                          className="font-semibold text-white hover:text-emerald-400 transition-colors truncate block"
                        >
                          {settings.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {settings.address?.trim() && (
                    <div className="flex items-center gap-3 text-xs sm:text-sm">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] text-zinc-400 block">Localização / Atendimento</span>
                        <span className="font-semibold text-white">{settings.address}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  Horário: Segunda a Sexta das 08h às 18h
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Atendimento online para todo o Brasil.
                </p>
              </div>
            </div>
          )}

          {/* Formulário Principal */}
          <div className={`${hasContactInfo ? 'lg:col-span-7' : 'w-full'} p-6 sm:p-9 rounded-3xl bg-zinc-900/70 border border-zinc-800/80 backdrop-blur-xl shadow-2xl relative`}>
            <AnimatePresence mode="wait">
              {status?.success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-10 sm:py-14 flex flex-col items-center text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white font-heading">
                    Solicitação Recebida com Sucesso!
                  </h3>
                  <p className="text-zinc-400 max-w-md text-xs sm:text-sm leading-relaxed">
                    {status.message}
                  </p>
                  <div className="pt-4 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      onClick={() => setStatus(null)}
                    >
                      Enviar Outra Mensagem
                    </Button>
                    {whatsappLink && (
                      <Button
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold gap-2"
                        asChild
                      >
                        <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                          <WhatsAppIcon className="w-4 h-4 fill-white" />
                          Acelerar no WhatsApp
                        </a>
                      </Button>
                    )}
                  </div>
                </motion.div>
              ) : (
                <form key="form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* Seletor de Tipo de Projeto */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                      Qual serviço você tem interesse?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {serviceOptions.map((svc) => (
                        <button
                          key={svc}
                          type="button"
                          onClick={() => handleServiceSelect(svc)}
                          className={`text-xs px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                            selectedService === svc
                              ? 'bg-emerald-600 text-white border-emerald-500 font-semibold shadow-md shadow-emerald-600/20'
                              : 'bg-zinc-950/60 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                          }`}
                        >
                          {svc}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Nome e E-mail */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        Seu Nome ou da Empresa *
                      </label>
                      <Input
                        placeholder="Ex: João Silva / Loja da Esquina"
                        {...register('name')}
                        aria-invalid={!!errors.name}
                      />
                      {errors.name && (
                        <span className="text-xs text-red-400 mt-1 block">
                          {errors.name.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        Seu E-mail *
                      </label>
                      <Input
                        type="email"
                        placeholder="joao@gmail.com"
                        {...register('email')}
                        aria-invalid={!!errors.email}
                      />
                      {errors.email && (
                        <span className="text-xs text-red-400 mt-1 block">
                          {errors.email.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Telefone / WhatsApp e Empresa */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        WhatsApp / Celular com DDD *
                      </label>
                      <Input
                        placeholder="(47) 99634-8698"
                        value={phoneValue || ''}
                        onChange={handlePhoneChange}
                        aria-invalid={!!errors.phone}
                      />
                      {errors.phone && (
                        <span className="text-xs text-red-400 mt-1 block">
                          {errors.phone.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        Cidade / Bairro
                      </label>
                      <Input
                        placeholder="Ex: Joinville - SC"
                        {...register('company')}
                        aria-invalid={!!errors.company}
                      />
                    </div>
                  </div>

                  {/* Mensagem / Detalhes */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Conte-nos brevemente o que você precisa ou como podemos ajudar
                    </label>
                    <Textarea
                      rows={3}
                      placeholder="Ex: Quero um site para minha clínica/loja para colocar no perfil do Instagram e receber contatos no WhatsApp..."
                      {...register('message')}
                      aria-invalid={!!errors.message}
                    />
                    {errors.message && (
                      <span className="text-xs text-red-400 mt-1 block">
                        {errors.message.message}
                      </span>
                    )}
                  </div>

                  {/* Alerta de Erro */}
                  {status?.error && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {status.error}
                    </div>
                  )}

                  {/* Botão de Envio */}
                  <Button
                    type="submit"
                    disabled={isPending}
                    size="lg"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-600/25"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enviando mensagem...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Enviar Mensagem / Solicitar Orçamento
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    Seus dados estão 100% protegidos. Não enviamos spam.
                  </div>
                </form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
