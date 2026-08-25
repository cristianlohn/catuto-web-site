'use client'

import * as React from 'react'
import {
  getClientMonitorsAction,
  triggerSingleCheckAction,
  toggleMonitorStatusAction,
  deleteMonitorAction,
  MonitorWithStats,
} from '@/app/actions/monitors'
import { MonitorModal } from '@/components/admin/MonitorModal'
import { LogsDrawer } from '@/components/admin/LogsDrawer'
import { AnalyticsModal } from '@/components/admin/AnalyticsModal'
import { ClientMonitor } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Activity,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ExternalLink,
  Zap,
  BarChart2,
  TrendingUp,
  Edit2,
  Trash2,
  Play,
  Pause,
  Loader2,
} from 'lucide-react'

interface MonitorsDashboardProps {
  initialMonitors: MonitorWithStats[]
}

export function MonitorsDashboard({ initialMonitors }: MonitorsDashboardProps) {
  const [monitors, setMonitors] = React.useState<MonitorWithStats[]>(initialMonitors)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'online' | 'degraded' | 'offline' | 'paused'>('all')

  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [monitorToEdit, setMonitorToEdit] = React.useState<ClientMonitor | null>(null)

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
  const [selectedMonitorForLogs, setSelectedMonitorForLogs] = React.useState<ClientMonitor | null>(null)

  const [isAnalyticsOpen, setIsAnalyticsOpen] = React.useState(false)
  const [selectedMonitorForAnalytics, setSelectedMonitorForAnalytics] = React.useState<ClientMonitor | null>(null)

  const [testingId, setTestingId] = React.useState<string | null>(null)
  const [isTestingAll, setIsTestingAll] = React.useState(false)
  const [feedback, setFeedback] = React.useState<string | null>(null)

  const refreshMonitors = async () => {
    const res = await getClientMonitorsAction()
    if (res.success) {
      setMonitors(res.data)
    }
  }

  // Ping em um monitor individual
  const handleSinglePing = async (monitor: ClientMonitor) => {
    setTestingId(monitor.id)
    setFeedback(null)

    try {
      const res = await triggerSingleCheckAction(monitor.id)
      if (res.success) {
        setFeedback(
          `Ping em ${monitor.name}: ${res.isUp ? '✅ Online (HTTP ' + res.statusCode + ')' : '🚨 Offline'} em ${res.latencyMs}ms`
        )
        await refreshMonitors()
      } else {
        setFeedback(`Erro ao testar ${monitor.name}: ${res.error}`)
      }
    } finally {
      setTestingId(null)
    }
  }

  // Ping em todos os monitores ativos
  const handlePingAll = async () => {
    setIsTestingAll(true)
    setFeedback('Iniciando varredura geral de todos os clientes...')

    try {
      const activeMonitors = monitors.filter((m) => m.is_active)
      for (const m of activeMonitors) {
        await triggerSingleCheckAction(m.id)
      }
      await refreshMonitors()
      setFeedback(`Varredura concluída! ${activeMonitors.length} sites verificados.`)
    } catch (err: any) {
      setFeedback('Erro durante a varredura geral.')
    } finally {
      setIsTestingAll(false)
    }
  }

  // Alternar Ativar / Pausar
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    await toggleMonitorStatusAction(id, !currentStatus)
    await refreshMonitors()
  }

  // Excluir monitor
  const handleDelete = async (monitor: ClientMonitor) => {
    if (confirm(`Deseja realmente remover o monitor "${monitor.name}" e todo o histórico de logs?`)) {
      await deleteMonitorAction(monitor.id)
      await refreshMonitors()
    }
  }

  // Métricas Globais
  const totalMonitors = monitors.length
  const activeMonitors = monitors.filter((m) => m.is_active)
  const onlineMonitors = activeMonitors.filter(
    (m) => m.last_status && Number(m.last_status) >= 200 && Number(m.last_status) < 300 && (m.consecutive_failures || 0) === 0
  )
  const offlineMonitors = activeMonitors.filter((m) => (m.consecutive_failures || 0) > 0)
  const degradedMonitors = activeMonitors.filter(
    (m) => (m.last_latency_ms || 0) > 2500 && (m.consecutive_failures || 0) === 0
  )

  const latencies = activeMonitors.map((m) => m.last_latency_ms).filter((l): l is number => Boolean(l && l > 0))
  const avgGlobalLatency =
    latencies.length > 0
      ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length)
      : 0

  // Filtragem de tabela
  const filteredMonitors = monitors.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.url.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false

    if (statusFilter === 'all') return true
    if (statusFilter === 'paused') return !m.is_active
    if (statusFilter === 'offline') return m.is_active && (m.consecutive_failures || 0) > 0
    if (statusFilter === 'degraded') return m.is_active && (m.last_latency_ms || 0) > 2500
    if (statusFilter === 'online')
      return (
        m.is_active &&
        (m.consecutive_failures || 0) === 0 &&
        (!m.last_latency_ms || m.last_latency_ms <= 2500)
      )

    return true
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Central de Monitoramento & Analytics
            </h2>
            <Badge variant="outline" className="bg-emerald-950/40 text-emerald-400 border-emerald-500/30 text-[10px]">
              SLA 24/7 + Pixel
            </Badge>
          </div>
          <p className="text-xs text-zinc-400">
            Acompanhe a disponibilidade, tempo de resposta, acessos e visitantes únicos dos clientes em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedMonitorForAnalytics(null)
              setIsAnalyticsOpen(true)
            }}
            className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Analytics Global
          </Button>

          <Button
            variant="outline"
            onClick={handlePingAll}
            disabled={isTestingAll || activeMonitors.length === 0}
          >
            {isTestingAll ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin text-blue-400" />
                Verificando...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Verificar Todos
              </>
            )}
          </Button>

          <Button
            onClick={() => {
              setMonitorToEdit(null)
              setIsModalOpen(true)
            }}
            className="shadow-lg shadow-blue-600/25"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Monitor
          </Button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs sm:text-sm flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400 shrink-0" />
            <span>{feedback}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs text-blue-400 hover:text-white ml-3"
          >
            Fechar
          </button>
        </div>
      )}

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
          <span className="text-[11px] font-semibold text-zinc-400 block mb-1">
            Total de Clientes
          </span>
          <div className="text-2xl font-extrabold text-white">
            {totalMonitors}
          </div>
          <span className="text-[10px] text-zinc-400">
            {activeMonitors.length} ativos • {totalMonitors - activeMonitors.length} pausados
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
          <span className="text-[11px] font-semibold text-zinc-400 block mb-1">
            Sites 100% Online
          </span>
          <div className="text-2xl font-extrabold text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-5 h-5" />
            {onlineMonitors.length}
          </div>
          <span className="text-[10px] text-emerald-400/80">
            Operando dentro do SLA
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
          <span className="text-[11px] font-semibold text-zinc-400 block mb-1">
            Sites Degradados (Lentos)
          </span>
          <div className="text-2xl font-extrabold text-amber-400 flex items-center gap-1.5">
            <AlertTriangle className="w-5 h-5" />
            {degradedMonitors.length}
          </div>
          <span className="text-[10px] text-amber-400/80">
            Latência acima de 2.5s
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
          <span className="text-[11px] font-semibold text-zinc-400 block mb-1">
            Sites Fora do Ar (Offline)
          </span>
          <div className="text-2xl font-extrabold text-red-400 flex items-center gap-1.5">
            <XCircle className="w-5 h-5" />
            {offlineMonitors.length}
          </div>
          <span className="text-[10px] text-red-400/80">
            Falhas registradas
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 col-span-2 md:col-span-1">
          <span className="text-[11px] font-semibold text-zinc-400 block mb-1">
            Latência Média Global
          </span>
          <div className="text-2xl font-extrabold text-blue-400">
            {avgGlobalLatency > 0 ? `${avgGlobalLatency} ms` : '—'}
          </div>
          <span className="text-[10px] text-blue-400/80">
            Tempo de resposta médio
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Buscar por nome do cliente ou URL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9.5 text-xs h-10"
          />
        </div>

        <div className="flex overflow-x-auto gap-1.5 pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            Todos ({totalMonitors})
          </button>
          <button
            onClick={() => setStatusFilter('online')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              statusFilter === 'online'
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-900 text-zinc-400 hover:text-emerald-400'
            }`}
          >
            Online ({onlineMonitors.length})
          </button>
          <button
            onClick={() => setStatusFilter('degraded')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              statusFilter === 'degraded'
                ? 'bg-amber-600 text-white'
                : 'bg-zinc-900 text-zinc-400 hover:text-amber-400'
            }`}
          >
            Degradados ({degradedMonitors.length})
          </button>
          <button
            onClick={() => setStatusFilter('offline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              statusFilter === 'offline'
                ? 'bg-red-600 text-white'
                : 'bg-zinc-900 text-zinc-400 hover:text-red-400'
            }`}
          >
            Offline ({offlineMonitors.length})
          </button>
          <button
            onClick={() => setStatusFilter('paused')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              statusFilter === 'paused'
                ? 'bg-zinc-700 text-white'
                : 'bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            Pausados ({totalMonitors - activeMonitors.length})
          </button>
        </div>
      </div>

      {/* Monitors List / Table */}
      {filteredMonitors.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800/80 p-8">
          <Activity className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">
            Nenhum monitor encontrado
          </h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-5">
            {searchTerm
              ? 'Nenhum cliente corresponde aos critérios de busca informados.'
              : 'Cadastre o primeiro website de cliente para ativar a monitoria e o pixel de analytics.'}
          </p>
          <Button
            onClick={() => {
              setMonitorToEdit(null)
              setIsModalOpen(true)
            }}
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Cadastrar Primeiro Monitor
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5">
          {filteredMonitors.map((monitor) => {
            const isPaused = !monitor.is_active
            const isOffline = monitor.is_active && (monitor.consecutive_failures || 0) > 0
            const isDegraded =
              monitor.is_active &&
              (monitor.last_latency_ms || 0) > 2500 &&
              (monitor.consecutive_failures || 0) === 0
            const isOnline = monitor.is_active && !isOffline && !isDegraded

            const isCurrentlyTesting = testingId === monitor.id
            const lastCheckTime = monitor.last_checked_at
              ? new Date(monitor.last_checked_at).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })
              : 'Nunca checado'

            return (
              <div
                key={monitor.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isOffline
                    ? 'bg-red-950/20 border-red-500/40 hover:border-red-500/60'
                    : isDegraded
                    ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-500/60'
                    : isPaused
                    ? 'bg-zinc-950/30 border-zinc-800/40 opacity-60'
                    : 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  {/* Info Principal */}
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                    {/* Status Dot / Icon */}
                    <div className="mt-1 sm:mt-0 shrink-0">
                      {isPaused ? (
                        <div className="w-8 h-8 rounded-xl bg-zinc-800 text-zinc-400 flex items-center justify-center">
                          <Pause className="w-4 h-4" />
                        </div>
                      ) : isOffline ? (
                        <div className="w-8 h-8 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center animate-pulse">
                          <XCircle className="w-4 h-4" />
                        </div>
                      ) : isDegraded ? (
                        <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm sm:text-base text-white tracking-tight">
                          {monitor.name}
                        </h4>

                        {isPaused && (
                          <Badge variant="secondary" className="text-[10px]">
                            Pausado
                          </Badge>
                        )}
                        {isOffline && (
                          <Badge variant="destructive" className="text-[10px]">
                            Offline ({monitor.consecutive_failures} falhas)
                          </Badge>
                        )}
                        {isDegraded && (
                          <Badge variant="outline" className="bg-amber-950/40 text-amber-400 border-amber-500/30 text-[10px]">
                            Degradado (Lento)
                          </Badge>
                        )}
                        {isOnline && (
                          <Badge variant="success" className="text-[10px]">
                            Online (HTTP {monitor.last_status || 200})
                          </Badge>
                        )}
                      </div>

                      <a
                        href={monitor.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-zinc-400 hover:text-blue-400 transition-colors flex items-center gap-1 mt-0.5 truncate max-w-sm sm:max-w-md"
                      >
                        {monitor.url}
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  </div>

                  {/* Telemetria & Ações */}
                  <div className="flex items-center gap-5 self-stretch lg:self-auto justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-zinc-800/60 flex-wrap">
                    {/* Sparkline de Últimos Pings */}
                    <div className="hidden sm:flex flex-col items-center gap-1.5">
                      <div className="flex items-center gap-1">
                        {(monitor.recent_logs || []).slice(-8).map((log, idx) => (
                          <div
                            key={idx}
                            title={`${log.is_up ? 'Online' : 'Falha'}: ${log.response_time_ms}ms`}
                            className={`w-2 h-6 rounded-sm transition-all ${
                              !log.is_up
                                ? 'bg-red-500'
                                : (log.response_time_ms || 0) > 2500
                                ? 'bg-amber-400'
                                : 'bg-emerald-500'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[9px] text-zinc-400 uppercase tracking-wider">
                        Últimos pings
                      </span>
                    </div>

                    {/* Latência */}
                    <div className="text-left sm:text-right">
                      <div className="text-sm sm:text-base font-bold text-white">
                        {monitor.last_latency_ms ? (
                          <span
                            className={
                              monitor.last_latency_ms < 600
                                ? 'text-emerald-400'
                                : monitor.last_latency_ms < 2000
                                ? 'text-amber-400'
                                : 'text-red-400'
                            }
                          >
                            {monitor.last_latency_ms} ms
                          </span>
                        ) : (
                          <span className="text-zinc-400">—</span>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {lastCheckTime}
                      </span>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex items-center gap-1.5">
                      {/* Analytics Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMonitorForAnalytics(monitor)
                          setIsAnalyticsOpen(true)
                        }}
                        title="Ver Analytics & Script do Pixel"
                        className="p-2 rounded-xl bg-blue-500/10 hover:bg-blue-600 hover:text-white text-blue-400 transition-colors cursor-pointer border border-blue-500/20"
                      >
                        <TrendingUp className="w-4 h-4" />
                      </button>

                      {/* Ping Manual */}
                      <button
                        type="button"
                        onClick={() => handleSinglePing(monitor)}
                        disabled={isCurrentlyTesting}
                        title="Executar Ping Imediato"
                        className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {isCurrentlyTesting ? (
                          <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                        ) : (
                          <Zap className="w-4 h-4" />
                        )}
                      </button>

                      {/* Logs Drawer */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMonitorForLogs(monitor)
                          setIsDrawerOpen(true)
                        }}
                        title="Ver Histórico de Logs HTTP"
                        className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
                      >
                        <BarChart2 className="w-4 h-4" />
                      </button>

                      {/* Pausar / Ativar */}
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(monitor.id, Boolean(monitor.is_active))}
                        title={monitor.is_active ? 'Pausar Monitoramento' : 'Ativar Monitoramento'}
                        className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
                      >
                        {monitor.is_active ? (
                          <Pause className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Play className="w-4 h-4 text-emerald-400" />
                        )}
                      </button>

                      {/* Editar */}
                      <button
                        type="button"
                        onClick={() => {
                          setMonitorToEdit(monitor)
                          setIsModalOpen(true)
                        }}
                        title="Editar Monitor"
                        className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Excluir */}
                      <button
                        type="button"
                        onClick={() => handleDelete(monitor)}
                        title="Excluir Monitor"
                        className="p-2 rounded-xl bg-zinc-800/80 hover:bg-red-500/20 hover:text-red-400 text-zinc-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal Criar/Editar */}
      <MonitorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refreshMonitors}
        monitorToEdit={monitorToEdit}
      />

      {/* Drawer de Logs */}
      <LogsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        monitor={selectedMonitorForLogs}
      />

      {/* Modal de Analytics */}
      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        monitor={selectedMonitorForAnalytics}
      />
    </div>
  )
}
