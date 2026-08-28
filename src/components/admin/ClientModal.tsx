'use client'

import * as React from 'react'
import { Client } from '@/types/database'
import { createClientAction, updateClientAction } from '@/app/actions/clients'
import { ImageUploadField } from '@/components/admin/ImageUploadField'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  X,
  Loader2,
  Building2,
  Globe,
  Tag,
  AlignLeft,
  Eye,
  Save,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

interface ClientModalProps {
  isOpen: boolean
  onClose: () => void
  clientToEdit?: Client | null
  onSuccess: () => void
}

export function ClientModal({
  isOpen,
  onClose,
  clientToEdit,
  onSuccess,
}: ClientModalProps) {
  const isEditing = Boolean(clientToEdit)

  const [formData, setFormData] = React.useState({
    name: '',
    website_url: '',
    logo_url: '',
    category: '',
    description: '',
    tagsString: '',
    is_active: true,
    display_order: 0,
  })

  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (clientToEdit) {
      setFormData({
        name: clientToEdit.name || '',
        website_url: clientToEdit.website_url || '',
        logo_url: clientToEdit.logo_url || '',
        category: clientToEdit.category || '',
        description: clientToEdit.description || '',
        tagsString: Array.isArray(clientToEdit.tags) ? clientToEdit.tags.join(', ') : '',
        is_active: clientToEdit.is_active ?? true,
        display_order: clientToEdit.display_order ?? 0,
      })
    } else {
      setFormData({
        name: '',
        website_url: '',
        logo_url: '',
        category: 'Website Institucional',
        description: '',
        tagsString: 'Website Profissional, Alta Performance, Mobile First',
        is_active: true,
        display_order: 0,
      })
    }
    setError(null)
  }, [clientToEdit, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const payload = {
        name: formData.name,
        website_url: formData.website_url,
        logo_url: formData.logo_url || null,
        category: formData.category,
        description: formData.description,
        tags: formData.tagsString
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        is_active: formData.is_active,
        display_order: Number(formData.display_order) || 0,
      }

      let res
      if (isEditing && clientToEdit) {
        res = await updateClientAction(clientToEdit.id, payload)
      } else {
        res = await createClientAction(payload)
      }

      if (res.success) {
        onSuccess()
        onClose()
      } else {
        setError(res.error || 'Falha ao salvar cliente.')
      }
    } catch (err: any) {
      setError(err.message || 'Erro de conexão com o servidor.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0b101b] border border-zinc-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {isEditing ? 'Editar Dados do Cliente' : 'Adicionar Novo Cliente'}
              </h3>
              <p className="text-xs text-zinc-400">
                {isEditing
                  ? 'Atualize as informações que aparecem na vitrine do seu site'
                  : 'Cadastre a marca, link e projeto para exibir na prova social'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Nome e Segmento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                Nome da Empresa / Cliente *
              </label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: TF Store Importados"
                className="text-sm bg-zinc-900/80"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-400" />
                Segmento / Categoria
              </label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Ex: E-commerce & Importados"
                className="text-sm bg-zinc-900/80"
              />
            </div>
          </div>

          {/* Website URL */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              Link do Website Oficial (URL) *
            </label>
            <Input
              required
              value={formData.website_url}
              onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
              placeholder="https://exemplo.com.br"
              className="text-sm bg-zinc-900/80 font-mono text-xs"
            />
            <span className="text-[10px] text-zinc-400 mt-1 block">
              Seus visitantes poderão clicar no card para visitar o site real do seu cliente.
            </span>
          </div>

          {/* Upload do Logotipo */}
          <div>
            <ImageUploadField
              label="Logotipo da Marca (Opcional)"
              description="Faça upload do logo do cliente (fundo transparente PNG/SVG recomendado). Se não tiver, será exibido um monograma moderno."
              value={formData.logo_url}
              onChange={(url) => setFormData({ ...formData, logo_url: url })}
              folder="clients"
            />
          </div>

          {/* Descrição do Projeto */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-emerald-400" />
              Resumo do Projeto / Solução Entregue
            </label>
            <Textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ex: Website institucional com alta velocidade, design corporativo e integração de orçamentos via WhatsApp."
              className="text-xs bg-zinc-900/80"
            />
          </div>

          {/* Tags / Badges */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Tags / Diferenciais (Separados por vírgula)
            </label>
            <Input
              value={formData.tagsString}
              onChange={(e) => setFormData({ ...formData, tagsString: e.target.value })}
              placeholder="Next.js, E-commerce, SEO Google, WhatsApp Direto"
              className="text-xs bg-zinc-900/80"
            />
          </div>

          {/* Status & Ordem */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-800/80">
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-zinc-200">
                    Visível no Site Público
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    {formData.is_active ? 'Exibindo na Landing Page' : 'Oculto temporariamente'}
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded bg-zinc-950 border-zinc-700 focus:ring-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Ordem de Posição (Menor aparece primeiro)
              </label>
              <Input
                type="number"
                value={formData.display_order}
                onChange={(e) =>
                  setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })
                }
                className="text-xs bg-zinc-900/80 h-10"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/60 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-xs text-zinc-400 hover:text-white"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-600/20"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 mr-1.5" />
                {isEditing ? 'Atualizar Cliente' : 'Cadastrar Cliente'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
