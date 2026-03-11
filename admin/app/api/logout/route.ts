import { NextRequest, NextResponse } from 'next/server'
import { getCookieName } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const res = NextResponse.redirect(new URL('/login', request.url))
  res.cookies.set(getCookieName(), '', { path: '/', maxAge: 0 })
  return res
}
