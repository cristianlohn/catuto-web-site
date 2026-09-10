'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  ExternalLink,
  Kanban,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Code2,
  Maximize2,
  Layers,
  ChevronDown,
  Filter,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FLOW_APP_URL } from '@/config/flow'

interface MockTask {
  id: string
  key: string
  title: string
  category: string
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  points: number
  assignee: string
  isBlocked?: boolean
  blockReason?: string
}

interface MockColumn {
  id: string
  title: string
  category: string
  count: number
  color: string
  tasks: MockTask[]
}

export function FlowShowcase() {
  const columns: MockColumn[] = [
    {
      id: 'backlog',
      title: 'Backlog',
      category: 'BACKLOG',
      count: 3,
      color: 'border-zinc-700/60 bg-zinc-800/40 text-zinc-300',
      tasks: [
        {
          id: '1',
          key: 'FLOW-104',
          title: 'Integração com Gateway de Pagamento PIX e Webhooks',
          category: 'BACKEND',
          priority: 'HIGH',
          points: 5,
          assignee: 'CL',
        },
        {
          id: '2',
          key: 'FLOW-105',
          title: 'Configuração de CDN e cache estático de alta velocidade',
          category: 'INFRA',
          priority: 'MEDIUM',
          points: 3,
          assignee: 'FS',
        },
      ],
    },
    {
      id: 'analise',
      title: 'Em Análise',
      category: 'IN_PROGRESS',
      count: 2,
      color: 'border-blue-500/40 bg-blue-500/10 text-blue-400',
      tasks: [
        {
          id: '3',
          key: 'FLOW-102',
          title: 'Modelagem de Schema Prisma com relacionamentos atômicos',
          category: 'DATABASE',
          priority: 'CRITICAL',
          points: 8,
          assignee: 'CL',
        },
      ],
    },
    {
      id: 'desenvolvimento',
      title: 'Em Desenvolvimento',
      category: 'IN_PROGRESS',
      count: 3,
      color: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
      tasks: [
        {
          id: '4',
          key: 'FLOW-99',
          title: 'Componente interativo de Kanban com drag-and-drop',
          category: 'FRONTEND',
          priority: 'HIGH',
          points: 5,
          assignee: 'CL',
        },
        {
          id: '5',
          key: 'FLOW-100',
          title: 'API Routes para provisionamento assíncrono de projetos',
          category: 'BACKEND',
          priority: 'HIGH',
          points: 5,
          assignee: 'AD',
        },
      ],
    },
    {
      id: 'testes',
      title: 'Em Testes',
      category: 'IN_PROGRESS',
      count: 2,
      color: 'border-purple-500/40 bg-purple-500/10 text-purple-400',
      tasks: [
        {
          id: '6',
          key: 'FLOW-97',
          title: 'Bateria de testes automatizados E2E e cobertura de rotas',
          category: 'QA',
          priority: 'MEDIUM',
          points: 3,
          assignee: 'FS',
        },
      ],
    },
    {
      id: 'retrabalho',
      title: 'Retrabalho',
      category: 'BLOCKED',
      count: 1,
      color: 'border-rose-500/50 bg-rose-500/10 text-rose-400',
      tasks: [
        {
          id: '7',
          key: 'FLOW-95',
          title: 'Validação de contrato de API com serviço externo de terceiros',
          category: 'INTEGRAÇÃO',
          priority: 'CRITICAL',
          points: 5,
          assignee: 'CL',
          isBlocked: true,
          blockReason: 'Trava Ativa: Divergência de payload registrada para correção imediata',
        },
      ],
    },
    {
      id: 'concluido',
      title: 'Concluído',
      category: 'DONE',
      count: 14,
      color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
      tasks: [
        {
          id: '8',
          key: 'FLOW-91',
          title: 'Setup do Next.js 16 com Server Actions e TypeScript estrito',
          category: 'ARQUITETURA',
          priority: 'HIGH',
          points: 8,
          assignee: 'CL',
        },
        {
          id: '9',
          key: 'FLOW-92',
          title: 'Design System Dark Mode com paleta esmeralda refinada',
          category: 'UI/UX',
          priority: 'MEDIUM',
          points: 5,
          assignee: 'AD',
        },
      ],
    },
  ]

  const priorityLabels = {
    CRITICAL: { label: 'Crítica', color: 'bg-rose-950/80 text-rose-300 border-rose-800/60' },
    HIGH: { label: 'Alta', color: 'bg-amber-950/80 text-amber-300 border-amber-800/60' },
    MEDIUM: { label: 'Média', color: 'bg-blue-950/80 text-blue-300 border-blue-800/60' },
    LOW: { label: 'Baixa', color: 'bg-zinc-800 text-zinc-300 border-zinc-700' },
  }

  return (
    <section className="relative py-12 md:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho da Seção */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-semibold mb-3">
            <Kanban className="w-3.5 h-3.5 text-emerald-400" />
            Visão Geral do Produto
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
            Interface desenhada para velocidade, foco e zero ambiguidade
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400">
            Veja como funciona a esteira canônica de engenharia onde cada entrega é rastreável, com trava de
            retrabalho para proteger seu prazo e orçamento.
          </p>
        </div>

        {/* Container do Mockup da Aplicação */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7 }}
          className="relative rounded-2xl border border-zinc-800/90 bg-[#080c15] shadow-2xl shadow-black/80 overflow-hidden ring-1 ring-white/5"
        >
          {/* Top Bar da Janela do App */}
          <div className="px-4 py-3 bg-[#060910] border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 select-none">
            {/* Controles de Janela e Seletor de Projeto */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>

              <div className="h-4 w-px bg-zinc-800 ml-1" />

              <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs font-medium text-zinc-200">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold text-white">Catuto Flow</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-mono">
                  FLOW
                </span>
                <ChevronDown className="w-3 h-3 text-zinc-500" />
              </div>

              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-[11px] font-semibold text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Sprint 04 (Ativa)
              </div>
            </div>

            {/* Ações Rápidas do Header do Mockup */}
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-1 text-xs text-zinc-400 bg-zinc-900/60 px-2.5 py-1 rounded-lg border border-zinc-800/80">
                <Filter className="w-3 h-3 text-zinc-500 mr-1" />
                <span>Todas as tarefas</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs border-zinc-700/80 bg-zinc-900/90 text-zinc-200 hover:text-white hover:bg-zinc-800 gap-1.5 font-medium"
                asChild
              >
                <a href={FLOW_APP_URL} target="_blank" rel="noopener noreferrer">
                  <span>Abrir em Tela Cheia</span>
                  <Maximize2 className="w-3 h-3 text-emerald-400" />
                </a>
              </Button>
            </div>
          </div>

          {/* Subheader com métricas da Sprint */}
          <div className="px-5 py-2.5 bg-[#090d18] border-b border-zinc-800/60 flex flex-wrap items-center justify-between text-xs text-zinc-400 gap-4">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Entrega estimada: <strong>14 de Setembro</strong>
              </span>
              <span className="hidden sm:inline-block text-zinc-600">•</span>
              <span className="hidden sm:inline-flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-zinc-500" />
                Repositório conectado via CI/CD
              </span>
            </div>

            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="text-zinc-400">
                Progresso: <strong className="text-emerald-400">85%</strong>
              </span>
              <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div className="w-[85%] h-full bg-emerald-500 rounded-full" />
              </div>
            </div>
          </div>

          {/* Board Kanban em Scroll Horizontal Fluido */}
          <div className="p-4 sm:p-5 overflow-x-auto">
            <div className="flex gap-4 min-w-[1100px] pb-2">
              {columns.map((col) => (
                <div
                  key={col.id}
                  className={`w-72 shrink-0 rounded-xl p-3 flex flex-col gap-3 transition-all ${
                    col.id === 'retrabalho'
                      ? 'bg-rose-950/20 border-2 border-rose-500/40 shadow-lg shadow-rose-950/30'
                      : 'bg-zinc-950/70 border border-zinc-800/70'
                  }`}
                >
                  {/* Cabeçalho da Coluna */}
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          col.id === 'retrabalho'
                            ? 'bg-rose-500 animate-pulse ring-2 ring-rose-500/40'
                            : 'bg-zinc-600'
                        }`}
                      />
                      <span
                        className={`text-xs font-bold tracking-wide ${
                          col.id === 'retrabalho' ? 'text-rose-200' : 'text-zinc-200'
                        }`}
                      >
                        {col.title}
                      </span>
                      {col.id === 'retrabalho' && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-rose-500/25 text-rose-300 border border-rose-500/50 uppercase tracking-wider flex items-center gap-1">
                          <AlertTriangle className="w-2.5 h-2.5 text-rose-400" />
                          Alerta
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-mono font-bold ${col.color}`}>
                      {col.count}
                    </span>
                  </div>

                  {/* Cards da Coluna */}
                  <div className="space-y-2.5">
                    {col.tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-3 rounded-lg bg-[#0b101c] border transition-all duration-200 hover:border-zinc-700/90 group ${
                          task.isBlocked
                            ? 'border-rose-500/50 bg-rose-950/10'
                            : 'border-zinc-800/80 hover:bg-[#0e1424]'
                        }`}
                      >
                        {/* Topo do Card: Chave e Prioridade */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-mono font-bold text-zinc-400 tracking-wider">
                            {task.key}
                          </span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded border font-semibold ${
                              priorityLabels[task.priority].color
                            }`}
                          >
                            {priorityLabels[task.priority].label}
                          </span>
                        </div>

                        {/* Título da Tarefa */}
                        <p className="text-xs text-zinc-200 font-medium leading-snug mb-2.5">
                          {task.title}
                        </p>

                        {/* Alerta de Trava de Retrabalho (quando aplicável) */}
                        {task.isBlocked && (
                          <div className="mb-2.5 p-2 rounded bg-rose-950/40 border border-rose-500/30 flex items-start gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                            <span className="text-[10px] text-rose-200 font-medium leading-tight">
                              {task.blockReason}
                            </span>
                          </div>
                        )}

                        {/* Rodapé do Card: Categoria, Pontos e Responsável */}
                        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-[10px]">
                          <span className="text-zinc-500 font-mono uppercase tracking-wider text-[9px]">
                            {task.category}
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono text-[9px]">
                              {task.points} pts
                            </span>
                            <div className="w-5 h-5 rounded-full bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center text-[9px]">
                              {task.assignee}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Adicionar Rápido sutil */}
                  <div className="mt-1 pt-2 border-t border-zinc-900 flex items-center justify-center">
                    <span className="text-[10px] text-zinc-500 hover:text-zinc-400 flex items-center gap-1 cursor-pointer">
                      <Plus className="w-3 h-3" /> Adicionar Demanda
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Banner de Rodapé do Mockup com Ação Direta */}
          <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-950/30 via-zinc-900/60 to-[#060910] border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-zinc-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Ambiente ativo conectado a múltiplos projetos e repositórios em produção.
              </span>
            </div>

            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs gap-1.5 shrink-0 shadow-md shadow-emerald-600/20"
              asChild
            >
              <a href={FLOW_APP_URL} target="_blank" rel="noopener noreferrer">
                <span>Acessar o Catuto Flow Real</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
