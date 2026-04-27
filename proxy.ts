import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED = [
  '/english/dashboard',
  '/english/teacher',
  '/english/admin',
]

const ROLE_GUARD: Record<string, string[]> = {
  '/english/admin':   ['admin'],
  '/english/teacher': ['teacher', 'admin'],
}

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  const isProtected = PROTECTED.some(p => pathname.startsWith(p))
  if (!isProtected) return NextResponse.next()

  let response = NextResponse.next({ request: req })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll:  () => req.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(new URL('/english/login', req.url))
  }

  const { data: englishProfile } = await supabase
    .from('english_user_roles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!englishProfile) {
    return NextResponse.redirect(new URL('/english/register', req.url))
  }

  const role = englishProfile?.role ?? 'student'
  for (const [path, allowedRoles] of Object.entries(ROLE_GUARD)) {
    if (pathname.startsWith(path) && !allowedRoles.includes(role)) {
      return NextResponse.redirect(new URL('/english/dashboard', req.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/english/dashboard/:path*',
    '/english/teacher/:path*',
    '/english/admin/:path*',
  ],
}
