'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Globe, Menu, X, Sparkles } from 'lucide-react'

interface AdminHeaderProps {
  title: string
  subtitle?: string
}

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  return (
    <header className="h-16 border-b border-zinc-800/80 bg-[#090d16]/80 backdrop-blur-md px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-zinc-400 hidden sm:block">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Badge
          variant="outline"
          className="bg-emerald-950/30 border-emerald-500/30 text-emerald-400 text-[11px] gap-1.5"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Produção Sincronizada
        </Badge>

        <Button
          variant="outline"
          size="sm"
          className="text-xs border-zinc-800 text-zinc-300 hover:text-white"
          asChild
        >
          <Link href="/" target="_blank">
            <Globe className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
            Ver Site
          </Link>
        </Button>
      </div>
    </header>
  )
}
