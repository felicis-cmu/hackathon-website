import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { getBackendUrl, getAdminHeaders } from '@/lib/backend'
import { parseAdminExportCsv } from '@/lib/admin-export'

export async function GET(request: NextRequest) {
  const ok = await getAdminSession()
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const url = `${getBackendUrl()}/api/admin/applications?${searchParams.toString()}`
  const res = await fetch(url, { headers: getAdminHeaders() })
  if (res.ok) {
    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data, { status: res.status })
  }

  if (res.status !== 404) {
    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data, { status: res.status })
  }

  console.warn('[admin/api/proxy/applications] backend is missing /api/admin/applications, falling back to CSV export')

  const exportRes = await fetch(`${getBackendUrl()}/api/admin/export`, {
    headers: getAdminHeaders(),
  })
  if (!exportRes.ok) {
    const error = await exportRes.json().catch(() => ({}))
    return NextResponse.json(error, { status: exportRes.status })
  }

  const csv = await exportRes.text()
  const allRows = parseAdminExportCsv(csv)
  const statusFilter = searchParams.get('status')?.trim()
  const limitParam = Number.parseInt(searchParams.get('limit') ?? '', 10)
  const filteredRows = statusFilter
    ? allRows.filter((row) => row.status === statusFilter)
    : allRows
  const limitedRows = Number.isFinite(limitParam) && limitParam > 0
    ? filteredRows.slice(0, limitParam)
    : filteredRows

  return NextResponse.json({
    data: limitedRows.map((row) => ({
      id: row.id ?? '',
      full_name: row.full_name ?? '',
      email: row.email ?? '',
      status: row.status ?? '',
      created_at: row.created_at ?? '',
    })),
    total: filteredRows.length,
    source: 'export-fallback',
  })
}
