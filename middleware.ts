import { createServerClient, type CookieOptions } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = req.nextUrl

  // 1. PUBLIC ROUTES
  if (pathname.startsWith('/login') || pathname === '/') {
    if (session) return NextResponse.redirect(new URL('/dashboard', req.url))
    return res
  }

  // 2. PROTECTED ROUTES
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // 3. FETCH COMPLEMENTARY DATA (Role, Status, Permissions)
  // Note: For high traffic, consider moving these to JWT claims via Supabase Custom Claims
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, status, permissions')
    .eq('id', session.user.id)
    .single()

  // 4. STATUS GUARD: Approval Flow
  if (profile?.status === 'pending' && pathname !== '/aguardando') {
    return NextResponse.redirect(new URL('/aguardando', req.url))
  }

  // 5. ROLE REDIRECTS
  // Students ONLY go to /aluno
  if (profile?.role === 'student' && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/aluno', req.url))
  }

  // Dashboard context guards
  if (pathname.startsWith('/dashboard')) {
    const perms = (profile?.permissions as any) || {}
    
    // Master is god
    if (profile?.role === 'master') return res

    // Finance Access
    if (pathname.includes('/financeiro') && !perms.finance && !perms.admin) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Student MGMT Access
    if (pathname.includes('/alunos') && !perms.students && !perms.admin) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Training MGMT Access
    if (pathname.includes('/treinos') && !perms.training && !perms.admin) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/leads).*)'],
}
