import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Database } from '@/types/database'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Atualiza ou recupera a sessão do usuário de forma segura
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isAuthRoute = pathname === '/login' || pathname.startsWith('/login/')
  const isAdminRoute = pathname.startsWith('/admin')

  // Redirecionamento de segurança: se tentar acessar /admin sem estar logado -> vai para /login
  if (!user && isAdminRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(url)
  }

  // Se já estiver logado e tentar acessar /login -> vai para /admin/configuracoes
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/configuracoes'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
