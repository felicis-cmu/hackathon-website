import { NextRequest, NextResponse } from 'next/server'
import { createSessionCookie } from '@/lib/auth'
import { timingSafeEqual } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const rawPassword = typeof body?.password === 'string' ? body.password : ''
    const rawExpected = process.env.ADMIN_PASSWORD ?? ''
    const password = rawPassword.trim()
    const expected = rawExpected.trim()

    if (expected.length === 0) {
      console.warn('[admin/api/login] ADMIN_PASSWORD is missing')
      return NextResponse.json({ ok: false, error: 'config' }, { status: 500 })
    }

    const a = Buffer.from(password, 'utf8')
    const b = Buffer.from(expected, 'utf8')
    const sameLength = a.length === b.length
    const matches = sameLength && timingSafeEqual(a, b)

    if (!matches) {
      console.warn('[admin/api/login] password rejected')
      return NextResponse.json({ ok: false, error: 'invalid_password' }, { status: 401 })
    }

    const { name, value, options } = createSessionCookie()
    const res = NextResponse.json({ ok: true })
    res.cookies.set(name, value, options)
    return res
  } catch (error) {
    console.error('[admin/api/login] unexpected error', error)
    return NextResponse.json({ ok: false, error: 'unexpected' }, { status: 500 })
  }
}
