'use client'

import * as React from 'react'
import { getAnalyticsSummaryAction, AnalyticsSummary } from '@/app/actions/analytics'
import { ClientMonitor } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  X,
  BarChart3,
  Users,
  Eye,
  Smartphone,
  Copy,
  Check,
  Globe,
  Loader2,
  Calendar,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Compass,
} from 'lucide-react'

interface AnalyticsModalProps {
  isOpen: boolean
  onClose: () => void
  monitor?: ClientMonitor | null
}

export function AnalyticsModal({ isOpen, onClose, monitor }: AnalyticsModalProps) {
  const [data, setData] = React.useState<AnalyticsSummary | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
      getAnalyticsSummaryAction(monitor?.id || null, 30)
        .then((res) => {
          if (res.success) {
            setData(res.data)
          }
        })
        .finally(() => setIsLoading(false))
    }
  }, [isOpen, monitor])

  if (!isOpen) return null

  const domain = monitor?.url ? monitor.url.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'catuto.com.br'
  const scriptCode = `<script defer src="https://catuto.com.br/catuto-pixel.js"${
    monitor ? ` data-site="${monitor.id}"` : ''
  }></script>`

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#0b101d] border border-zinc-800 p-6 sm:p-8 shadow-2xl shadow-black/90 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-base sm:text-xl font-bold text-white tracking-tight">
                {monitor ? `Analytics de Tráfego: ${monitor.name}` : 'Métricas Globais de Acessos'}
              </h3>
              <Badge variant="accent" className="text-[10px]">
                Catuto Pixel
              </Badge>
            </div>
            <p className="text-xs text-zinc-400">
              Métricas de visualizações, visitantes únicos, dispositivos e canais de aquisição nos últimos 30 dias.
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pt-4 space-y-6 pr-1 scrollbar-thin">
          {/* Pixel Script Box */}
          <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                Script de Instalação no Website do Cliente (1 Linha)
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copiar Script
                  </>
                )}
              </button>
            </div>

            <pre className="p-2.5 rounded-lg bg-[#070a12] border border-zinc-800/80 text-[11px] text-zinc-300 font-mono overflow-x-auto whitespace-pre-wrap select-all">
              {scriptCode}
            </pre>
            <span className="text-[10px] text-zinc-400 block">
              Basta colar antes da tag &lt;/head&gt; do website. O script pesa menos de 1KB e não usa cookies invasivos.
            </span>
          </div>

          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-2 text-blue-400">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-xs text-zinc-400">Carregando métricas de tráfego...</span>
            </div>
          ) : data && data.total_pageviews > 0 ? (
            <>
              {/* 4 KPIs de Impacto */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2">
                    <Eye className="w-4 h-4" />
                  </div>
                  <span className="text-2xl font-extrabold text-white">
                    {data.total_pageviews}
                  </span>
                  <span className="text-[11px] text-zinc-400 block mt-0.5">
                    Visualizações Totais
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-2xl font-extrabold text-emerald-400">
                    {data.unique_visitors}
                  </span>
                  <span className="text-[11px] text-zinc-400 block mt-0.5">
                    Visitantes Únicos
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="text-2xl font-extrabold text-indigo-400">
                    {data.today_pageviews}
                  </span>
                  <span className="text-[11px] text-zinc-400 block mt-0.5">
                    Acessos Hoje
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <span className="text-2xl font-extrabold text-purple-400">
                    {data.mobile_percentage}%
                  </span>
                  <span className="text-[11px] text-zinc-400 block mt-0.5">
                    Tráfego Mobile
                  </span>
                </div>
              </div>

              {/* Gráfico de Acessos Diários */}
              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                    Volume Diário de Acessos (Últimas 2 Semanas)
                  </h4>
                  <span className="text-[10px] text-zinc-400">Barras azuis = Pageviews</span>
                </div>

                <div className="flex items-end gap-1.5 h-36 pt-4 px-2 border-b border-zinc-800/80 pb-2">
                  {data.daily_chart.map((day, idx) => {
                    const max = Math.max(...data.daily_chart.map((d) => d.pageviews), 1)
                    const heightPercent = Math.max(Math.round((day.pageviews / max) * 100), 6)

                    return (
                      <div
                        key={idx}
                        className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end"
                      >
                        {/* Tooltip */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 px-2 py-1 rounded bg-zinc-800 text-[10px] text-white whitespace-nowrap z-10 pointer-events-none shadow-lg">
                          {day.date}: {day.pageviews} visualizações ({day.visitors} visitantes)
                        </div>

                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-full rounded-t-md bg-gradient-to-t from-blue-600 to-sky-400 group-hover:brightness-125 transition-all"
                        />
                        <span className="text-[9px] text-zinc-400 mt-1 block truncate w-full text-center">
                          {day.date.split('/')[0]}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Páginas & Origens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Top Páginas */}
                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
                  <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-400" />
                    Páginas Mais Acessadas
                  </h4>

                  <div className="space-y-2">
                    {data.top_pages.map((p, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-200 font-mono truncate max-w-[200px]">
                            {p.path}
                          </span>
                          <span className="font-bold text-blue-400">
                            {p.views} ({p.percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                          <div
                            style={{ width: `${p.percentage}%` }}
                            className="h-full bg-blue-500 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Origem do Tráfego */}
                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
                  <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-emerald-400" />
                    Origem do Tráfego (Canais)
                  </h4>

                  <div className="space-y-2">
                    {data.top_referrers.map((r, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-200 truncate max-w-[200px]">
                            {r.referrer}
                          </span>
                          <span className="font-bold text-emerald-400">
                            {r.count} ({r.percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                          <div
                            style={{ width: `${r.percentage}%` }}
                            className="h-full bg-emerald-500 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-14 text-center rounded-2xl bg-zinc-950/40 border border-zinc-800/60 p-6">
              <BarChart3 className="w-10 h-10 text-zinc-400 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-white mb-1">
                Aguardando os Primeiros Acessos
              </h4>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Copie o script de 1 linha acima e cole no site do cliente para começar a receber as visualizações e visitantes em tempo real.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
