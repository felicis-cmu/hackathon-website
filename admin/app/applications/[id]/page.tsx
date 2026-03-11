'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

type Application = {
  id: string
  full_name: string
  email: string
  phone?: string
  linkedin_url?: string
  github_url?: string
  short_answer_1?: string
  short_answer_2?: string
  short_answer_3?: string
  short_answer_4?: string
  mcq_responses?: unknown
  resume_url?: string
  resume_filename?: string
  status: string
  created_at: string
}

export default function ApplicationDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [app, setApp] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [resumeLoading, setResumeLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/proxy/applications/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('Not found')
        return r.json()
      })
      .then(setApp)
      .catch(() => setApp(null))
      .finally(() => setLoading(false))
  }, [id])

  const updateStatus = async (status: 'accepted' | 'rejected') => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/proxy/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok && app) setApp({ ...app, status })
      else alert('Update failed')
    } catch {
      alert('Update failed')
    } finally {
      setUpdating(false)
    }
  }

  const openResume = async () => {
    setResumeLoading(true)
    try {
      const res = await fetch(`/api/proxy/applications/${id}/resume`)
      const data = await res.json()
      if (data?.url) window.open(data.url, '_blank')
      else alert('No resume or failed to load')
    } catch {
      alert('Failed to load resume')
    } finally {
      setResumeLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }
  if (!app) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">Application not found.</p>
        <Link href="/dashboard" className="text-indigo-600 hover:underline">
          Back to dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-sm text-indigo-600 hover:text-indigo-800">
          ← Back to dashboard
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">{app.full_name}</h1>
            <span
              className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                app.status === 'accepted'
                  ? 'bg-green-100 text-green-800'
                  : app.status === 'rejected'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {app.status}
            </span>
          </div>

          <div className="px-6 py-4 space-y-4">
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase">Email</span>
              <p className="text-gray-900">{app.email}</p>
            </div>
            {app.phone && (
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">Phone</span>
                <p className="text-gray-900">{app.phone}</p>
              </div>
            )}
            {app.linkedin_url && (
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">LinkedIn</span>
                <p>
                  <a href={app.linkedin_url} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
                    {app.linkedin_url}
                  </a>
                </p>
              </div>
            )}
            {app.github_url && (
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">GitHub</span>
                <p>
                  <a href={app.github_url} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
                    {app.github_url}
                  </a>
                </p>
              </div>
            )}

            {app.short_answer_1 && (
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">Short answer 1</span>
                <p className="text-gray-900 mt-1 whitespace-pre-wrap">{app.short_answer_1}</p>
              </div>
            )}
            {app.short_answer_2 && (
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">Short answer 2</span>
                <p className="text-gray-900 mt-1 whitespace-pre-wrap">{app.short_answer_2}</p>
              </div>
            )}
            {app.short_answer_3 && (
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">Short answer 3</span>
                <p className="text-gray-900 mt-1 whitespace-pre-wrap">{app.short_answer_3}</p>
              </div>
            )}
            {app.short_answer_4 && (
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">Short answer 4</span>
                <p className="text-gray-900 mt-1 whitespace-pre-wrap">{app.short_answer_4}</p>
              </div>
            )}
            {app.mcq_responses != null && (
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">MCQ responses</span>
                <pre className="mt-1 text-sm text-gray-700 bg-gray-50 p-3 rounded overflow-auto">
                  {JSON.stringify(app.mcq_responses, null, 2)}
                </pre>
              </div>
            )}

            <div className="pt-4 flex flex-wrap gap-3">
              {(app.resume_filename || app.resume_url) && (
                <button
                  onClick={openResume}
                  disabled={resumeLoading}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-900 font-medium hover:bg-gray-200 disabled:opacity-50"
                >
                  {resumeLoading ? 'Loading...' : 'View resume'}
                </button>
              )}
              {app.status !== 'accepted' && (
                <button
                  onClick={() => updateStatus('accepted')}
                  disabled={updating}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50"
                >
                  Accept
                </button>
              )}
              {app.status !== 'rejected' && (
                <button
                  onClick={() => updateStatus('rejected')}
                  disabled={updating}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  Reject
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
