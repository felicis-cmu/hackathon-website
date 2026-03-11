import { NextRequest, NextResponse } from 'next/server'
import { createSessionCookie } from '@/lib/auth'
import { timingSafeEqual } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const password = typeof body?.password === 'string' ? body.password : ''
    const expected = process.env.ADMIN_PASSWORD ?? ''

    if (expected.length === 0) {
      return NextResponse.redirect(new URL('/login?error=config', request.url))
    }

    const a = Buffer.from(password, 'utf8')
    const b = Buffer.from(expected, 'utf8')
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return NextResponse.redirect(new URL('/login?error=1', request.url))
    }

    const { name, value, options } = createSessionCookie()
    const res = NextResponse.redirect(new URL('/dashboard', request.url))
    res.cookies.set(name, value, options)
    return res
  } catch {
    return NextResponse.redirect(new URL('/login?error=1', request.url))
  }
}
