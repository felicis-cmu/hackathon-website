'use client'

import { useState } from 'react'
import Link from 'next/link'

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001').replace(/\/+$/, '')

export default function AdminPage() {
  const [key, setKey] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    if (!key.trim()) {
      setError('Enter admin key')
      return
    }
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/export`, {
        headers: { 'x-admin-key': key },
      })
      if (!res.ok) {
        setError(res.status === 401 ? 'Invalid key' : 'Export failed')
        return
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `venturehacks-applications-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setError('Export failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Link href="/" className="text-sm text-purple-600 hover:underline mb-6 block">
          ← Back to home
        </Link>

        <div className="glass-shot-card rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Export</h1>
          <p className="text-gray-600 text-sm mb-6">
            Export all VentureHacks applications to CSV for review in Sheets or Excel.
          </p>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Admin Key
          </label>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Enter admin key"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none mb-4"
          />
          <button
            onClick={handleExport}
            disabled={loading || !key.trim()}
            className="w-full px-6 py-3 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Exporting...' : 'Download CSV'}
          </button>

          {error && (
            <p className="mt-4 text-sm text-red-600">{error}</p>
          )}
        </div>

        <p className="mt-6 text-xs text-gray-500">
          Required: ADMIN_SECRET, SUPABASE_SERVICE_ROLE_KEY in backend/.env
        </p>
      </div>
    </div>
  )
}
