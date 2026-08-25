'use client'

import * as React from 'react'
import { getMonitorLogsAction } from '@/app/actions/monitors'
import { ClientMonitor, UptimeLog } from '@/types/database'
import { Badge } from '@/components/ui/badge'
import {
  X,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Loader2,
  ExternalLink,
} from 'lucide-react'

interface LogsDrawerProps {
  isOpen: boolean
  onClose: () => void
  monitor: ClientMonitor | null
}

export function LogsDrawer({ isOpen, onClose, monitor }: LogsDrawerProps) {
  const [logs, setLogs] = React.useState<UptimeLog[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (isOpen && monitor) {
      setIsLoading(true)
      getMonitorLogsAction(monitor.id)
        .then((res) => {
          if (res.success) {
            setLogs(res.logs)
          }
        })
        .finally(() => setIsLoading(false))
    }
  }, [isOpen, monitor])

  if (!isOpen || !monitor) return null

  const uptimePercentage =
    logs.length > 0
      ? (
          (logs.filter((l) => l.is_up).length / logs.length) *
          100
        ).toFixed(1)
      : '100.0'

  const avgLatency =
    logs.length > 0
      ? Math.round(
          logs.reduce((acc, l) => acc + (l.response_time_ms || 0), 0) /
            logs.length
        )
      : 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0d1322] border border-zinc-800 p-6 sm:p-7 shadow-2xl shadow-black/80 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base sm:text-lg font-bold text-white">
                {monitor.name}
              </h3>
              <a
                href={monitor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                Visitar <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-xs text-zinc-400 truncate max-w-md">
              {monitor.url}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 py-4 border-b border-zinc-800/80">
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col items-center text-center">
            <span className="text-[11px] text-zinc-400">Disponibilidade</span>
            <span className="text-base sm:text-lg font-bold text-emerald-400">
              {uptimePercentage}%
            </span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col items-center text-center">
            <span className="text-[11px] text-zinc-400">Latência Média</span>
            <span className="text-base sm:text-lg font-bold text-blue-400">
              {avgLatency} ms
            </span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col items-center text-center">
            <span className="text-[11px] text-zinc-400">Total de Checagens</span>
            <span className="text-base sm:text-lg font-bold text-white">
              {logs.length}
            </span>
          </div>
        </div>

        {/* Logs Table / List */}
        <div className="flex-1 overflow-y-auto pt-4 space-y-2.5 pr-1 scrollbar-thin">
          <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
            Histórico das Últimas 50 Checagens
          </h4>

          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-blue-400">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs text-zinc-400">Carregando logs de telemetria...</span>
            </div>
          ) : logs.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-400">
              Nenhum log registrado para este monitor ainda.
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => {
                const date = log.checked_at
                  ? new Date(log.checked_at).toLocaleString('pt-BR')
                  : 'N/A'

                return (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/70 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      {log.is_up ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center">
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold ${
                              log.is_up ? 'text-emerald-400' : 'text-red-400'
                            }`}
                          >
                            {log.is_up ? `HTTP ${log.status_code || 200}` : 'FALHA DE CONEXÃO'}
                          </span>
                          {log.error_message && (
                            <span className="text-[10px] text-red-400/80 truncate max-w-xs">
                              ({log.error_message})
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {date}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-bold text-zinc-200 block">
                        {log.response_time_ms ? `${log.response_time_ms} ms` : '-'}
                      </span>
                      <span className="text-[10px] text-zinc-400">tempo de resposta</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
