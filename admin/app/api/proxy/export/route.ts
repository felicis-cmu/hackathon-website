import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { getBackendUrl, getAdminHeaders } from '@/lib/backend'

export async function GET(request: NextRequest) {
  const ok = await getAdminSession()
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const res = await fetch(`${getBackendUrl()}/api/admin/export`, {
    headers: getAdminHeaders(),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return NextResponse.json(err, { status: res.status })
  }
  const csv = await res.text()
  const date = new Date().toISOString().slice(0, 10)
  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="venturehacks-applications-${date}.csv"`,
    },
  })
}
