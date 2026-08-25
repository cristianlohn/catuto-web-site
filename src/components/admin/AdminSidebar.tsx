'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAction } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import {
  Sliders,
  Activity,
  Globe,
  LogOut,
  ChevronRight,
} from 'lucide-react'

interface AdminSidebarProps {
  userEmail?: string | null
}

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname()

  const navItems = [
    {
      title: 'Configurações do CMS',
      href: '/admin/configuracoes',
      icon: Sliders,
      description: 'Logotipo, textos, contatos e serviços',
    },
    {
      title: 'Status & Uptime',
      href: '/admin/clientes-status',
      icon: Activity,
      description: 'Monitoramento 24/7 e analytics',
    },
  ]

  return (
    <aside className="w-64 sm:w-72 bg-[#080c15] border-r border-zinc-800/80 flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none z-30">
      {/* Top Header */}
      <div>
        <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
          <Link href="/admin/configuracoes" className="flex items-center group">
            <img
              src="/brand/catuto-horizontal.webp"
              alt="Catuto Digital Solutions"
              className="h-9 w-auto object-contain group-hover:brightness-110 transition-all"
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-3 mb-2 block">
            Gestão & Plataforma
          </span>

          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-600/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-zinc-400 group-hover:text-emerald-400'
                  }`}
                />
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="truncate">{item.title}</span>
                  <span
                    className={`text-[10px] truncate ${
                      isActive ? 'text-emerald-100' : 'text-zinc-400'
                    }`}
                  >
                    {item.description}
                  </span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-200" />}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer / Account / Ver Site */}
      <div className="p-4 border-t border-zinc-800/80 space-y-3 bg-[#060910]">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start text-xs border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800"
          asChild
        >
          <Link href="/" target="_blank">
            <Globe className="w-3.5 h-3.5 mr-2 text-emerald-400" />
            Visualizar Site Público
          </Link>
        </Button>

        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col min-w-0 pr-2">
            <span className="text-[11px] font-semibold text-zinc-200 truncate">
              {userEmail || 'Administrador'}
            </span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Sessão Ativa
            </span>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              title="Sair do painel"
              className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-red-500/10 hover:text-red-400 text-zinc-400 flex items-center justify-center transition-colors border border-zinc-800 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}
