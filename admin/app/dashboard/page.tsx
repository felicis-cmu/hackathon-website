'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

type Application = {
  id?: string
  full_name: string
  email: string
  status: string
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [total, setTotal] = useState(0)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [dataSource, setDataSource] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams()
    if (statusFilter) params.set('status', statusFilter)
    // Show every row when viewing all statuses; keep a page cap when filtering
    params.set('limit', statusFilter ? '100' : '10000')
    fetch(`/api/proxy/applications?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setApplications(Array.isArray(data.data) ? data.data : [])
        setTotal(typeof data.total === 'number' ? data.total : data.data?.length ?? 0)
        setDataSource(typeof data.source === 'string' ? data.source : null)
      })
      .catch(() => {
        setApplications([])
        setDataSource(null)
      })
      .finally(() => setLoading(false))
  }, [statusFilter])

  const handleExport = async () => {
    setExporting(true)
    try {
      const res = await fetch('/api/proxy/export')
      if (!res.ok) throw new Error('Export failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `venturehacks-applications-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Export failed')
    } finally {
      setExporting(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST', redirect: 'manual' })
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/logos/felicis.png"
            alt="Felicis"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
            priority
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Felicis</p>
            <h1 className="text-xl font-semibold text-gray-900">VentureHacks Admin</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="text-sm text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
          >
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-6">
          <label className="text-sm font-medium text-gray-700">Filter by status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
          <span className="text-sm text-gray-500">{total} total</span>
        </div>
        {dataSource === 'export-fallback' && (
          <p className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            The deployed backend does not expose the admin applications API yet, so this table is being loaded from the CSV export endpoint.
          </p>
        )}

        {loading ? (
          <p className="text-gray-500">Loading applications...</p>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {applications.map((app) => (
                  <tr
                    key={app.id ?? `${app.email}-${app.created_at}`}
                    className={app.id ? 'cursor-pointer hover:bg-gray-50' : 'hover:bg-gray-50'}
                    onClick={() => {
                      if (app.id) router.push(`/applications/${app.id}`)
                    }}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{app.full_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{app.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          app.status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : app.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {app.created_at ? new Date(app.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {app.id ? (
                        <Link
                          href={`/applications/${app.id}`}
                          onClick={(event) => event.stopPropagation()}
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        >
                          View
                        </Link>
                      ) : (
                        <span className="text-sm text-gray-400">Unavailable</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {applications.length === 0 && (
              <p className="px-6 py-8 text-center text-gray-500">No applications found.</p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
