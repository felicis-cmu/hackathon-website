import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { getBackendUrl, getAdminHeaders } from '@/lib/backend'

export async function GET(request: NextRequest) {
  const ok = await getAdminSession()
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const url = `${getBackendUrl()}/api/admin/applications?${searchParams.toString()}`
  const res = await fetch(url, { headers: getAdminHeaders() })
  const data = await res.json().catch(() => ({}))
  return NextResponse.json(data, { status: res.status })
}
