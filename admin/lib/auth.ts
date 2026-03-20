import { cookies } from 'next/headers'
import { createHmac, timingSafeEqual } from 'crypto'

const COOKIE_NAME = 'admin_session'
const EXPIRY_HOURS = 12

function getSecret(): string {
  const secret = process.env.ADMIN_SECRET
  if (!secret) throw new Error('ADMIN_SECRET required')
  return secret
}

function sign(value: string): string {
  const secret = getSecret()
  return createHmac('sha256', secret).update(value).digest('base64url')
}

export function createSessionCookie(): { name: string; value: string; options: Record<string, unknown> } {
  const exp = Math.floor(Date.now() / 1000) + EXPIRY_HOURS * 3600
  const payload = JSON.stringify({ admin: true, exp })
  const encoded = Buffer.from(payload, 'utf8').toString('base64url')
  const signature = sign(encoded)
  const value = `${encoded}.${signature}`

  return {
    name: COOKIE_NAME,
    value,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: EXPIRY_HOURS * 3600,
    },
  }
}

export function verifySessionCookie(cookieValue: string | undefined): boolean {
  if (!cookieValue || !cookieValue.includes('.')) return false
  const [encoded, sig] = cookieValue.split('.')
  if (!encoded || !sig) return false
  try {
    const expectedSig = sign(encoded)
    const a = Buffer.from(expectedSig, 'utf8')
    const b = Buffer.from(sig, 'utf8')
    if (a.length !== b.length) return false
    if (!timingSafeEqual(a, b)) return false
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'))
    if (!payload || payload.admin !== true || typeof payload.exp !== 'number') return false
    if (payload.exp < Math.floor(Date.now() / 1000)) return false
    return true
  } catch {
    return false
  }
}

export async function getAdminSession(): Promise<boolean> {
  const store = await cookies()
  const cookie = store.get(COOKIE_NAME)
  return verifySessionCookie(cookie?.value)
}

export function getCookieName(): string {
  return COOKIE_NAME
}
