'use client'

import * as React from 'react'
import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { loginAction } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Globe,
} from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectedFrom = searchParams.get('redirectedFrom')

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [isPending, setIsPending] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('password', password)

      const result = await loginAction(formData)

      if (result.success) {
        router.push(redirectedFrom || '/admin/configuracoes')
        router.refresh()
      } else {
        setError(result.error || 'Credenciais inválidas.')
      }
    } catch (err: any) {
      setError('Erro de conexão com o servidor de autenticação.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 backdrop-blur-xl shadow-2xl">
      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs flex items-center gap-2.5 mb-5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
            E-mail de Acesso
          </label>
          <div className="relative">
            <Input
              type="email"
              required
              placeholder="cristianlohn@hotmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9.5 text-sm"
            />
            <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
            Senha de Segurança
          </label>
          <div className="relative">
            <Input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-9.5 text-sm"
            />
            <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          size="lg"
          className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-600/25"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Verificando credenciais...
            </>
          ) : (
            <>
              Entrar no Painel
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </form>

      <div className="pt-6 mt-6 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          Sessão Criptografada (RLS)
        </span>
        <Link
          href="/"
          className="hover:text-white transition-colors flex items-center gap-1"
        >
          <Globe className="w-3.5 h-3.5" />
          Voltar ao site
        </Link>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#080c15] flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Glow ambient background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-600/15 blur-[150px] -z-10 rounded-full pointer-events-none" />

      {/* Decorative Grid */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <Link href="/" className="inline-flex items-center justify-center mb-4 group">
            <img
              src="/brand/catuto-horizontal.webp"
              alt="Catuto Digital Solutions"
              className="h-14 sm:h-16 w-auto object-contain group-hover:scale-105 transition-transform"
            />
          </Link>

          <h2 className="text-lg font-bold text-white tracking-tight">
            Acesso ao Painel Administrativo
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Gerencie o CMS, monitores de uptime e relatórios de tráfego
          </p>
        </div>

        <Suspense
          fallback={
            <div className="p-12 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
              <span className="text-xs text-zinc-400">Carregando painel seguro...</span>
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
