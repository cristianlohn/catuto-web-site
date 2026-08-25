'use client'

import * as React from 'react'

interface CatutoBadgeProps {
  className?: string
}

export function CatutoBadge({ className = '' }: CatutoBadgeProps) {
  return (
    <a
      href="https://catuto.com.br?utm_source=footer_badge&utm_medium=referral"
      target="_blank"
      rel="noopener noreferrer"
      title="Catuto Soluções Digitais - Criação de Websites e Performance"
      className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs transition-all duration-300 group border bg-zinc-900/90 hover:bg-zinc-800/90 border-zinc-800 hover:border-emerald-500/50 shadow-md hover:shadow-lg hover:shadow-emerald-500/10 ${className}`}
    >
      <span className="text-zinc-400 group-hover:text-zinc-200 transition-colors text-[11px] sm:text-xs font-medium">
        Desenvolvido por
      </span>

      <div className="flex items-center gap-1.5">
        <img
          src="/brand/catuto-horizontal.webp"
          alt="Catuto Soluções Digitais"
          className="h-4 sm:h-4.5 w-auto object-contain group-hover:brightness-110 transition-all"
        />
      </div>
    </a>
  )
}
