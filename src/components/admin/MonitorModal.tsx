'use client'

import * as React from 'react'
import { createMonitorAction, updateMonitorAction } from '@/app/actions/monitors'
import { ClientMonitor } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  X,
  Globe,
  Loader2,
  AlertCircle,
  Activity,
} from 'lucide-react'

interface MonitorModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  monitorToEdit?: ClientMonitor | null
}

export function MonitorModal({
  isOpen,
  onClose,
  onSuccess,
  monitorToEdit,
}: MonitorModalProps) {
  const [name, setName] = React.useState('')
  const [url, setUrl] = React.useState('')
  const [expectedStatus, setExpectedStatus] = React.useState(200)
  const [isPending, setIsPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (monitorToEdit) {
      setName(monitorToEdit.name)
      setUrl(monitorToEdit.url)
      setExpectedStatus(monitorToEdit.expected_status || 200)
    } else {
      setName('')
      setUrl('')
      setExpectedStatus(200)
    }
    setError(null)
  }, [monitorToEdit, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)

    try {
      if (monitorToEdit) {
        const res = await updateMonitorAction(monitorToEdit.id, {
          name,
          url,
          expected_status: Number(expectedStatus),
        })
        if (res.success) {
          onSuccess()
          onClose()
        } else {
          setError(res.error || 'Erro ao atualizar monitor.')
        }
      } else {
        const res = await createMonitorAction({
          name,
          url,
          expected_status: Number(expectedStatus),
        })
        if (res.success) {
          onSuccess()
          onClose()
        } else {
          setError(res.error || 'Erro ao cadastrar monitor.')
        }
      }
    } catch (err: any) {
      setError('Erro de conexão ao salvar monitor.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0d1322] border border-zinc-800 p-6 sm:p-7 shadow-2xl shadow-black/80">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {monitorToEdit ? 'Editar Monitor de Uptime' : 'Novo Monitor de Cliente'}
              </h3>
              <p className="text-xs text-zinc-400">
                Acompanhamento automático de disponibilidade e latência 24/7.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Nome do Cliente / Projeto *
            </label>
            <Input
              required
              placeholder="Ex: Grupo Hospitalar Paulista"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              URL do Website (com https://) *
            </label>
            <div className="relative">
              <Input
                required
                type="text"
                placeholder="https://cliente.com.br"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-9 text-sm"
              />
              <Globe className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <span className="text-[10px] text-zinc-400 block mt-1">
              Caso você digite sem https://, o sistema adicionará automaticamente.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Código de Status HTTP Esperado
            </label>
            <Input
              type="number"
              value={expectedStatus}
              onChange={(e) => setExpectedStatus(Number(e.target.value))}
              placeholder="200"
            />
            <span className="text-[10px] text-zinc-400 block mt-1">
              Geralmente 200 (OK). Códigos entre 200 e 299 são considerados disponíveis.
            </span>
          </div>

          <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : monitorToEdit ? (
                'Salvar Alterações'
              ) : (
                'Cadastrar e Testar Agora'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
