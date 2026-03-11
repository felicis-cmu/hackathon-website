'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'

function LoginForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        redirect: 'manual',
      })
      if (res.status === 302 || res.status === 307) {
        const location = res.headers.get('Location')
        window.location.href = location || '/dashboard'
        return
      }
      if (!res.ok) {
        window.location.href = '/login?error=1'
        return
      }
      window.location.href = '/dashboard'
    } catch {
      window.location.href = '/login?error=1'
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-sm w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">VentureHacks Admin</h1>
        <p className="text-gray-600 text-sm mb-6">Sign in with the admin password.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            autoFocus
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        {error === '1' && (
          <p className="mt-4 text-sm text-red-600">Invalid password.</p>
        )}
        {error === 'config' && (
          <p className="mt-4 text-sm text-amber-600">Admin not configured (ADMIN_PASSWORD missing).</p>
        )}
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <p className="text-gray-500">Loading...</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
