'use client'

import * as React from 'react'
import { Client } from '@/types/database'
import {
  getClientsAction,
  deleteClientAction,
  toggleClientActiveAction,
  importFromMonitorsAction,
} from '@/app/actions/clients'
import { ClientModal } from '@/components/admin/ClientModal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Building2,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  Power,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Layers,
  Globe,
  Loader2,
} from 'lucide-react'

interface ClientsManagerProps {
  initialClients: Client[]
}

export function ClientsManager({ initialClients }: ClientsManagerProps) {
  const [clients, setClients] = React.useState<Client[]>(initialClients)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [clientToEdit, setClientToEdit] = React.useState<Client | null>(null)
  const [isImporting, setIsImporting] = React.useState(false)
  const [isDeletingId, setIsDeletingId] = React.useState<string | null>(null)
  const [feedback, setFeedback] = React.useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  const reloadClients = async () => {
    const res = await getClientsAction(false)
    if (res.success && res.data) {
      setClients(res.data)
    }
  }

  const handleOpenCreate = () => {
    setClientToEdit(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (client: Client) => {
    setClientToEdit(client)
    setIsModalOpen(true)
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    // Atualização otimista na UI
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_active: !currentStatus } : c))
    )

    const res = await toggleClientActiveAction(id, !currentStatus)
    if (!res.success) {
      // Reverte se falhar
      reloadClients()
      setFeedback({ type: 'error', message: res.error || 'Erro ao alterar visibilidade.' })
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Deseja realmente remover o cliente "${name}"? Esta ação não pode ser desfeita.`)) {
      return
    }

    setIsDeletingId(id)
    const res = await deleteClientAction(id)
    setIsDeletingId(null)

    if (res.success) {
      setFeedback({ type: 'success', message: `Cliente "${name}" removido com sucesso.` })
      reloadClients()
    } else {
      setFeedback({ type: 'error', message: res.error || 'Erro ao remover cliente.' })
    }
  }

  const handleImportMonitors = async () => {
    setIsImporting(true)
    setFeedback(null)
    try {
      const res = await importFromMonitorsAction()
      if (res.success) {
        setFeedback({ type: 'success', message: res.message || 'Importação concluída!' })
        reloadClients()
      } else {
        setFeedback({ type: 'error', message: res.error || 'Falha ao importar.' })
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Erro inesperado.' })
    } finally {
      setIsImporting(false)
    }
  }

  const filteredClients = clients.filter((c) => {
    const q = searchQuery.toLowerCase()
    return (
      c.name.toLowerCase().includes(q) ||
      (c.category && c.category.toLowerCase().includes(q)) ||
      c.website_url.toLowerCase().includes(q)
    )
  })

  const totalClients = clients.length
  const activeClients = clients.filter((c) => c.is_active).length
  const clientsWithLogo = clients.filter((c) => Boolean(c.logo_url)).length

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-emerald-400" />
            Nossos Clientes & Portfólio
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Gerencie os clientes e marcas exibidos na seção de prova social do seu site público.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleImportMonitors}
            disabled={isImporting}
            className="text-xs border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 gap-1.5"
            title="Importa automaticamente os sites cadastrados no monitoramento de uptime"
          >
            {isImporting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            )}
            Importar dos Monitores
          </Button>

          <Button
            size="sm"
            onClick={handleOpenCreate}
            className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-600/25 gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Novo Cliente
          </Button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm flex items-start gap-3 animate-in fade-in duration-200 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border border-red-500/30 text-red-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <strong>{feedback.type === 'success' ? 'Sucesso!' : 'Atenção:'}</strong>{' '}
            {feedback.message}
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-white">{totalClients}</div>
            <div className="text-[11px] text-zinc-400 font-medium">Total de Clientes</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-white">{activeClients}</div>
            <div className="text-[11px] text-zinc-400 font-medium">Ativos no Site Público</div>
          </div>
        </div>

        <div className="col-span-2 lg:col-span-1 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-white">{clientsWithLogo}</div>
            <div className="text-[11px] text-zinc-400 font-medium">Com Logotipo Oficial</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome do cliente, segmento ou URL..."
            className="pl-9 text-xs bg-zinc-900/70 border-zinc-800 h-10"
          />
        </div>
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchQuery('')}
            className="text-xs text-zinc-400"
          >
            Limpar
          </Button>
        )}
      </div>

      {/* Client Cards Grid */}
      {filteredClients.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800/80">
          <Building2 className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-zinc-300 mb-1">
            Nenhum cliente encontrado
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-5">
            {searchQuery
              ? 'Tente buscar com outro termo ou limpe a pesquisa.'
              : 'Cadastre seu primeiro cliente ou importe dos monitores existentes.'}
          </p>
          <Button
            size="sm"
            onClick={handleOpenCreate}
            className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Cadastrar Cliente
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {filteredClients.map((client) => {
            const isActive = client.is_active !== false
            const isDeleting = isDeletingId === client.id

            return (
              <div
                key={client.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 shadow-md'
                    : 'bg-zinc-950/40 border-zinc-800/50 opacity-60'
                }`}
              >
                <div>
                  {/* Top Row: Logo / Monogram + Actions */}
                  <div className="flex items-start justify-between gap-3 mb-3.5">
                    <div className="flex items-center gap-3">
                      {client.logo_url ? (
                        <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 p-1.5 flex items-center justify-center shrink-0">
                          <img
                            src={client.logo_url}
                            alt={client.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600/20 to-teal-700/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-extrabold text-base shrink-0">
                          {client.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}

                      <div className="flex flex-col min-w-0">
                        <h4 className="text-sm font-bold text-white truncate flex items-center gap-1.5">
                          {client.name}
                        </h4>
                        <span className="text-[11px] text-zinc-400 truncate">
                          {client.category || 'Website Institucional'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant={isActive ? 'success' : 'secondary'}
                        className="text-[10px] py-0.5"
                      >
                        {isActive ? 'No Ar' : 'Oculto'}
                      </Badge>
                    </div>
                  </div>

                  {/* Description */}
                  {client.description && (
                    <p className="text-xs text-zinc-400 mb-3.5 line-clamp-2 leading-relaxed">
                      {client.description}
                    </p>
                  )}

                  {/* Tags */}
                  {Array.isArray(client.tags) && client.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {client.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Bar: Website Link + Buttons */}
                <div className="pt-3.5 border-t border-zinc-800/60 flex items-center justify-between gap-2">
                  <a
                    href={client.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 truncate max-w-[200px]"
                    title={client.website_url}
                  >
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{client.website_url.replace(/^https?:\/\//, '')}</span>
                  </a>

                  <div className="flex items-center gap-1.5">
                    {/* Toggle Active */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(client.id, isActive)}
                      title={isActive ? 'Ocultar do site público' : 'Exibir no site público'}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isActive
                          ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                          : 'border-zinc-700 text-zinc-500 hover:bg-zinc-800'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(client)}
                      title="Editar cliente"
                      className="p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDelete(client.id, client.name)}
                      disabled={isDeleting}
                      title="Remover cliente"
                      className="p-1.5 rounded-lg border border-zinc-800 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-colors cursor-pointer"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal de Criação / Edição */}
      <ClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        clientToEdit={clientToEdit}
        onSuccess={() => {
          setFeedback({
            type: 'success',
            message: clientToEdit
              ? 'Cliente atualizado com sucesso!'
              : 'Novo cliente cadastrado e publicado com sucesso!',
          })
          reloadClients()
        }}
      />
    </div>
  )
}
