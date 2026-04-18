import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const hasAuthCookie = req.cookies.getAll().some(
    (c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
  )

  if (pathname === '/english/login' && hasAuthCookie) {
    return NextResponse.redirect(new URL('/english/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/english/login'],
}
