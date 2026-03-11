const BACKEND_URL = (process.env.BACKEND_URL || 'http://localhost:3001').replace(/\/+$/, '')
const ADMIN_SECRET = process.env.ADMIN_SECRET || ''

export function getBackendUrl(): string {
  return BACKEND_URL
}

export function getAdminHeaders(): Record<string, string> {
  return { 'x-admin-key': ADMIN_SECRET, 'Content-Type': 'application/json' }
}
