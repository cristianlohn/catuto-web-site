'use client'

import * as React from 'react'
import { SiteSettings } from '@/types/database'
import { updateSiteSettingsAction } from '@/app/actions/site-settings'
import { ImageUploadField } from '@/components/admin/ImageUploadField'
import { maskPhone, maskCnpj, cleanDigits } from '@/lib/masks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Save,
  Sparkles,
  Layers,
  Phone,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Power,
  BarChart3,
  Globe,
  Eye,
  EyeOff,
} from 'lucide-react'

interface SettingsFormProps {
  initialSettings: SiteSettings
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [activeTab, setActiveTab] = React.useState<
    'brand' | 'hero' | 'contact' | 'services' | 'metrics' | 'seo'
  >('brand')

  const [formData, setFormData] = React.useState<SiteSettings>(initialSettings)
  const [isSaving, setIsSaving] = React.useState(false)
  const [feedback, setFeedback] = React.useState<{
    success?: boolean
    message?: string
    error?: string
  } | null>(null)

  // Manipulador genérico de campos
  const handleChange = (field: keyof SiteSettings, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Manipuladores de Serviços (Cards)
  const servicesList = Array.isArray(formData.services_data)
    ? (formData.services_data as any[])
    : []

  const handleServiceChange = (index: number, field: string, value: any) => {
    const updated = [...servicesList]
    updated[index] = { ...updated[index], [field]: value }
    handleChange('services_data', updated)
  }

  const toggleServiceActive = (index: number) => {
    const updated = [...servicesList]
    const current = updated[index]?.active !== false
    updated[index] = { ...updated[index], active: !current }
    handleChange('services_data', updated)
  }

  // Manipuladores de Métricas
  const metricsList = Array.isArray(formData.metrics_data)
    ? (formData.metrics_data as any[])
    : []

  const handleMetricChange = (index: number, field: string, value: any) => {
    const updated = [...metricsList]
    updated[index] = { ...updated[index], [field]: value }
    handleChange('metrics_data', updated)
  }

  // Submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setFeedback(null)

    try {
      const res = await updateSiteSettingsAction(formData)
      if (res.success) {
        setFeedback({
          success: true,
          message: res.message || 'Configurações atualizadas com sucesso! As alterações já estão ao vivo no site.',
        })
      } else {
        setFeedback({
          success: false,
          error: res.error || 'Erro ao salvar alterações.',
        })
      }
    } catch (err: any) {
      setFeedback({
        success: false,
        error: 'Falha de conexão com o servidor.',
      })
    } finally {
      setIsSaving(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const tabs = [
    { id: 'brand', label: 'Marca & Logotipo', icon: Sparkles },
    { id: 'hero', label: 'Landing Page & Hero', icon: Globe },
    { id: 'contact', label: 'Contato & Fiscal', icon: Phone },
    { id: 'services', label: 'Cards de Serviços', icon: Layers },
    { id: 'metrics', label: 'Métricas de Impacto', icon: BarChart3 },
    { id: 'seo', label: 'Redes Sociais & SEO', icon: Search },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto p-4 sm:p-8">
      {/* Top Bar com Ação Salvar e Notificação */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Gerenciamento do Website (CMS)
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Atualize dados, artes, textos e cards. Campos deixados em branco são ocultados automaticamente no site.
          </p>
        </div>

        <Button
          type="submit"
          disabled={isSaving}
          size="lg"
          className="w-full sm:w-auto shadow-lg shadow-emerald-600/25 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shrink-0"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Salvando no Supabase...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </>
          )}
        </Button>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm flex items-start gap-3 animate-in fade-in duration-200 ${
            feedback.success
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border border-red-500/30 text-red-300'
          }`}
        >
          {feedback.success ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <strong>{feedback.success ? 'Sucesso!' : 'Atenção:'}</strong>{' '}
            {feedback.message || feedback.error}
          </div>
        </div>
      )}

      {/* Navegação por Abas com Flex-Wrap para exibir TODOS os 6 botões com clareza */}
      <div className="flex flex-wrap gap-2 pb-3 border-b border-zinc-800">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-zinc-900/70 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* CONTEÚDO DAS ABAS */}

      {/* ABA 1: MARCA & LOGOTIPO */}
      {activeTab === 'brand' && (
        <div className="space-y-6 p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="border-b border-zinc-800 pb-4">
            <h3 className="text-base font-bold text-white">Identidade Visual & Marca</h3>
            <p className="text-xs text-zinc-400">
              Faça upload do seu logotipo e configure o nome oficial da empresa.
            </p>
          </div>

          <ImageUploadField
            label="Logotipo da Marca (Upload Direto no Supabase Storage)"
            description="Arraste o arquivo do seu logo em alta resolução (PNG transparente ou SVG recomendado)."
            value={formData.logo_url}
            onChange={(url) => handleChange('logo_url', url)}
            folder="brand"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Nome Comercial da Empresa *
              </label>
              <Input
                value={formData.company_name || ''}
                onChange={(e) => handleChange('company_name', e.target.value)}
                placeholder="Ex: Catuto"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Razão Social / Nome Fantasia (Opcional)
              </label>
              <Input
                value={formData.trade_name || ''}
                onChange={(e) => handleChange('trade_name', e.target.value)}
                placeholder="Ex: Catuto Soluções Digitais"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Slogan / Tagline Institucional (Opcional)
            </label>
            <Input
              value={formData.tagline || ''}
              onChange={(e) => handleChange('tagline', e.target.value)}
              placeholder="Ex: Sua estrutura sólida no digital"
            />
          </div>
        </div>
      )}

      {/* ABA 2: LANDING PAGE & HERO */}
      {activeTab === 'hero' && (
        <div className="space-y-6 p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="border-b border-zinc-800 pb-4">
            <h3 className="text-base font-bold text-white">Textos do Hero & Chamadas de Ação</h3>
            <p className="text-xs text-zinc-400">
              Ajuste as frases principais da Landing Page para maximizar a atração de clientes.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Badge do Topo (Destaque do Hero)
            </label>
            <Input
              value={formData.hero_badge || ''}
              onChange={(e) => handleChange('hero_badge', e.target.value)}
              placeholder="Ex: ⭐ Soluções Web para Pequenos Negócios | Joinville - SC"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Título Principal do Hero (H1) *
            </label>
            <Input
              value={formData.hero_title || ''}
              onChange={(e) => handleChange('hero_title', e.target.value)}
              placeholder="Ex: Sua Estrutura Sólida no Digital para Vender Mais"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Subtítulo Descritivo
            </label>
            <Textarea
              rows={3}
              value={formData.hero_subtitle || ''}
              onChange={(e) => handleChange('hero_subtitle', e.target.value)}
              placeholder="Texto explicativo logo abaixo do título..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Texto do Botão Principal (CTA)
              </label>
              <Input
                value={formData.hero_cta_text || ''}
                onChange={(e) => handleChange('hero_cta_text', e.target.value)}
                placeholder="Ex: Solicitar Orçamento Grátis"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Link de Destino do Botão (CTA URL)
              </label>
              <Input
                value={formData.hero_cta_url || ''}
                onChange={(e) => handleChange('hero_cta_url', e.target.value)}
                placeholder="Ex: #contato ou link externo"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Texto Sobre Nós (Rodapé / Institucional)
            </label>
            <Textarea
              rows={3}
              value={formData.about_text || ''}
              onChange={(e) => handleChange('about_text', e.target.value)}
              placeholder="Breve descrição da empresa exibida no rodapé..."
            />
          </div>
        </div>
      )}

      {/* ABA 3: CONTATO & FISCAL COM MÁSCARAS E CONTROLE VISUAL */}
      {activeTab === 'contact' && (
        <div className="space-y-6 p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="border-b border-zinc-800 pb-4">
            <h3 className="text-base font-bold text-white">Dados de Atendimento & Fiscais</h3>
            <p className="text-xs text-zinc-400">
              Campos com máscaras automáticas. Caso não queira exibir algum item no site, basta deixá-lo em branco.
            </p>
          </div>

          {/* WhatsApp e Telefone com Máscaras */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-zinc-300">
                  WhatsApp de Atendimento (com DDD)
                </label>
                {formData.whatsapp ? (
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Exibido no Site
                  </span>
                ) : (
                  <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                    <EyeOff className="w-3 h-3" /> Oculto (Vazio)
                  </span>
                )}
              </div>
              <Input
                value={maskPhone(formData.whatsapp || '')}
                onChange={(e) => handleChange('whatsapp', maskPhone(e.target.value))}
                placeholder="(47) 99634-8698"
              />
              <span className="text-[10px] text-zinc-400 block mt-1">
                Formatação automática. O link wa.me adicionará o DDI 55 automaticamente.
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-zinc-300">
                  Telefone Exibido (Fixo ou Celular)
                </label>
                {formData.phone ? (
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Exibido no Site
                  </span>
                ) : (
                  <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                    <EyeOff className="w-3 h-3" /> Oculto (Vazio)
                  </span>
                )}
              </div>
              <Input
                value={maskPhone(formData.phone || '')}
                onChange={(e) => handleChange('phone', maskPhone(e.target.value))}
                placeholder="(47) 3333-4444 ou (47) 99634-8698"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Mensagem Pré-definida de Abertura do WhatsApp
            </label>
            <Input
              value={formData.whatsapp_message || ''}
              onChange={(e) => handleChange('whatsapp_message', e.target.value)}
              placeholder="Ex: Olá! Vim pelo site da Catuto e gostaria de solicitar um orçamento para o meu negócio."
            />
          </div>

          {/* E-mail e CNPJ com Máscara */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-zinc-300">
                  E-mail Corporativo de Contato
                </label>
                {formData.email ? (
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Exibido no Site
                  </span>
                ) : (
                  <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                    <EyeOff className="w-3 h-3" /> Oculto (Vazio)
                  </span>
                )}
              </div>
              <Input
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="cristian@catuto.com.br"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-zinc-300">
                  CNPJ da Empresa (Opcional)
                </label>
                {formData.cnpj ? (
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Exibido no Rodapé
                  </span>
                ) : (
                  <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                    <EyeOff className="w-3 h-3" /> Oculto (Vazio)
                  </span>
                )}
              </div>
              <Input
                value={maskCnpj(formData.cnpj || '')}
                onChange={(e) => handleChange('cnpj', maskCnpj(e.target.value))}
                placeholder="00.000.000/0001-00"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-zinc-300">
                Endereço Comercial Completo (Opcional)
              </label>
              {formData.address ? (
                <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <Eye className="w-3 h-3" /> Exibido no Rodapé
                </span>
              ) : (
                <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                  <EyeOff className="w-3 h-3" /> Oculto (Vazio)
                </span>
              )}
            </div>
            <Input
              value={formData.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Ex: Rua dos Caruaras, 479 - Comasa, Joinville - SC (Deixe vazio se não quiser exibir)"
            />
          </div>
        </div>
      )}

      {/* ABA 4: CARDS DE SERVIÇOS (COM ATIVAR/DESATIVAR) */}
      {activeTab === 'services' && (
        <div className="space-y-6 p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="border-b border-zinc-800 pb-4">
            <h3 className="text-base font-bold text-white">Cards de Serviços (Bento Grid)</h3>
            <p className="text-xs text-zinc-400">
              Personalize o título, descrição, categoria e ative ou desative qualquer card na tela pública.
            </p>
          </div>

          <div className="space-y-4">
            {servicesList.map((service: any, index: number) => {
              const isActive = service.active !== false

              return (
                <div
                  key={index}
                  className={`p-4 rounded-xl border transition-all ${
                    isActive
                      ? 'bg-zinc-950/60 border-zinc-800'
                      : 'bg-zinc-950/20 border-zinc-800/40 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-400">
                        Card #{index + 1}
                      </span>
                      <Badge
                        variant={isActive ? 'success' : 'secondary'}
                        className="text-[10px]"
                      >
                        {isActive ? 'Exibindo no Site' : 'Desativado / Oculto'}
                      </Badge>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleServiceActive(index)}
                      className={`text-xs font-semibold px-3 py-1 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isActive
                          ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                          : 'border-zinc-700 text-zinc-400 hover:bg-zinc-800'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      {isActive ? 'Desativar Card' : 'Ativar Card'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                        Título do Serviço
                      </label>
                      <Input
                        value={service.title || ''}
                        onChange={(e) => handleServiceChange(index, 'title', e.target.value)}
                        placeholder="Nome do serviço"
                        className="text-xs h-9"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                        Badge / Categoria
                      </label>
                      <Input
                        value={service.badge || ''}
                        onChange={(e) => handleServiceChange(index, 'badge', e.target.value)}
                        placeholder="Ex: Mais Procurado"
                        className="text-xs h-9"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                      Descrição Detalhada
                    </label>
                    <Textarea
                      rows={2}
                      value={service.description || ''}
                      onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                      placeholder="Texto do card..."
                      className="text-xs"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ABA 5: MÉTRICAS DE IMPACTO */}
      {activeTab === 'metrics' && (
        <div className="space-y-6 p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="border-b border-zinc-800 pb-4">
            <h3 className="text-base font-bold text-white">Métricas & Destaques Numéricos</h3>
            <p className="text-xs text-zinc-400">
              Edite os 4 contadores de impacto. Se deixar o valor em branco, o item será omitido.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {metricsList.map((metric: any, index: number) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2.5"
              >
                <span className="text-xs font-bold text-emerald-400 block">
                  Métrica #{index + 1}
                </span>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Número / Destaque
                  </label>
                  <Input
                    value={metric.value || ''}
                    onChange={(e) => handleMetricChange(index, 'value', e.target.value)}
                    placeholder="Ex: +300% ou < 1s"
                    className="text-xs h-9 font-bold text-emerald-300"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Rótulo Principal
                  </label>
                  <Input
                    value={metric.label || ''}
                    onChange={(e) => handleMetricChange(index, 'label', e.target.value)}
                    placeholder="Ex: Mais Mensagens no WhatsApp"
                    className="text-xs h-9"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Detalhe / Subtítulo
                  </label>
                  <Input
                    value={metric.detail || ''}
                    onChange={(e) => handleMetricChange(index, 'detail', e.target.value)}
                    placeholder="Ex: com chamadas estratégicas"
                    className="text-xs h-9"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA 6: REDES SOCIAIS & SEO */}
      {activeTab === 'seo' && (
        <div className="space-y-6 p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="border-b border-zinc-800 pb-4">
            <h3 className="text-base font-bold text-white">Redes Sociais & Otimização para o Google</h3>
            <p className="text-xs text-zinc-400">
              Links de redes sociais vazios não aparecerão no rodapé do site público.
            </p>
          </div>

          <div className="space-y-3.5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-zinc-300">
                  Instagram URL
                </label>
                {formData.instagram_url ? (
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Ícone Ativo no Rodapé
                  </span>
                ) : (
                  <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                    <EyeOff className="w-3 h-3" /> Oculto (Vazio)
                  </span>
                )}
              </div>
              <Input
                value={formData.instagram_url || ''}
                onChange={(e) => handleChange('instagram_url', e.target.value)}
                placeholder="https://instagram.com/catuto.solucoes"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-zinc-300">
                  LinkedIn URL
                </label>
                {formData.linkedin_url ? (
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Ícone Ativo no Rodapé
                  </span>
                ) : (
                  <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                    <EyeOff className="w-3 h-3" /> Oculto (Vazio)
                  </span>
                )}
              </div>
              <Input
                value={formData.linkedin_url || ''}
                onChange={(e) => handleChange('linkedin_url', e.target.value)}
                placeholder="https://linkedin.com/company/catuto"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-zinc-300">
                  GitHub URL (Opcional)
                </label>
                {formData.github_url ? (
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Ícone Ativo no Rodapé
                  </span>
                ) : (
                  <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                    <EyeOff className="w-3 h-3" /> Oculto (Vazio)
                  </span>
                )}
              </div>
              <Input
                value={formData.github_url || ''}
                onChange={(e) => handleChange('github_url', e.target.value)}
                placeholder="https://github.com/catuto"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 space-y-4">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
              SEO & Metatags de Compartilhamento
            </span>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Meta Title (Título da Aba e Google)
              </label>
              <Input
                value={formData.meta_title || ''}
                onChange={(e) => handleChange('meta_title', e.target.value)}
                placeholder="Catuto Soluções Digitais | Websites Profissionais e Performance"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Meta Description (Resumo exibido nos buscadores)
              </label>
              <Textarea
                rows={3}
                value={formData.meta_description || ''}
                onChange={(e) => handleChange('meta_description', e.target.value)}
                placeholder="Descrição de até 160 caracteres com palavras-chave estratégicas..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Barra Inferior com Botão de Salvar Fixo */}
      <div className="sticky bottom-4 z-20 p-4 rounded-2xl bg-[#080c15]/95 border border-zinc-800 shadow-2xl backdrop-blur-xl flex items-center justify-between">
        <span className="text-xs text-zinc-400 hidden sm:block">
          Ao salvar, a Landing Page é revalidada instantaneamente no cache.
        </span>
        <Button
          type="submit"
          disabled={isSaving}
          size="lg"
          className="w-full sm:w-auto shadow-lg shadow-emerald-600/25 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold ml-auto"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Salvando no Supabase...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
