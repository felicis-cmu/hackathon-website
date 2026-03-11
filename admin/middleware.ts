import { NextResponse, type NextRequest } from 'next/server'

const COOKIE_NAME = 'admin_session'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  if (path === '/login' || path.startsWith('/api/login')) {
    return NextResponse.next()
  }
  if (path.startsWith('/_next') || path.startsWith('/favicon')) {
    return NextResponse.next()
  }

  const cookie = request.cookies.get(COOKIE_NAME)?.value
  if (!cookie || !cookie.includes('.')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
