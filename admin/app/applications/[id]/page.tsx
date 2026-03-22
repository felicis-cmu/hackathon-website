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
  referral_other?: string | null
  resume_url?: string
  resume_filename?: string
  status: string
  created_at: string
}

/** Labels and option lists match `frontend/app/apply/page.tsx` MCQ_QUESTIONS */
const MCQ_SECTIONS: { id: string; title: string; options: string[] }[] = [
  {
    id: 'experience',
    title: 'What is your hackathon experience level?',
    options: ['First time', '1-2 hackathons', '3-5 hackathons', '6+ hackathons'],
  },
  {
    id: 'team',
    title: 'Do you have a team, or are you looking for one?',
    options: ['I have a team', 'Looking for a team', 'Solo participant'],
  },
  {
    id: 'focus',
    title: 'What area interests you most?',
    options: ['AI/ML', 'Web3', 'DevTools', 'Consumer apps', 'Other'],
  },
  {
    id: 'referral',
    title: 'How did you hear about VentureHacks?',
    options: ['ScottyLabs', 'LinkedIn', 'IS Advisor', 'CS Advisor', 'SEP', 'Friend', 'Other'],
  },
]

const MCQ_KNOWN_IDS = new Set(MCQ_SECTIONS.map((s) => s.id))
const MCQ_OPTIONS_BY_ID = Object.fromEntries(MCQ_SECTIONS.map((s) => [s.id, s.options])) as Record<
  string,
  string[]
>

/** Unwrap JSON blobs, nested { value }, arrays, and numeric indices into a display string. */
function unwrapMcqRaw(raw: unknown, depth = 0): string {
  if (raw === null || raw === undefined) return ''
  if (depth > 8) return ''

  if (typeof raw === 'string') {
    const t = raw.trim()
    if (t === '') return ''
    if (
      (t.startsWith('{') && t.endsWith('}')) ||
      (t.startsWith('[') && t.endsWith(']'))
    ) {
      try {
        return unwrapMcqRaw(JSON.parse(t), depth + 1)
      } catch {
        return t
      }
    }
    return t
  }

  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return String(raw)
  }
  if (typeof raw === 'boolean') {
    return raw ? 'Yes' : 'No'
  }

  if (Array.isArray(raw)) {
    return raw
      .map((x) => unwrapMcqRaw(x, depth + 1))
      .filter(Boolean)
      .join(', ')
  }

  if (typeof raw === 'object') {
    const o = raw as Record<string, unknown>
    if (Object.keys(o).length === 0) return ''
    const picked =
      o.answer ??
      o.value ??
      o.label ??
      o.text ??
      o.selected ??
      o.choice ??
      o.option ??
      (typeof o.id === 'string' || typeof o.id === 'number' ? o.id : undefined)
    if (picked !== undefined) return unwrapMcqRaw(picked, depth + 1)
    try {
      return JSON.stringify(raw)
    } catch {
      return String(raw)
    }
  }

  return String(raw)
}

/** Map unwrapped text to a canonical option label when possible. */
function resolveToOptionLabel(questionId: string, unwrapped: string): string {
  const options = MCQ_OPTIONS_BY_ID[questionId]
  if (!options?.length || !unwrapped) return unwrapped

  if (options.includes(unwrapped)) return unwrapped

  const lower = unwrapped.toLowerCase()
  const byLower = options.find((o) => o.toLowerCase() === lower)
  if (byLower) return byLower

  if (/^\d+$/.test(unwrapped)) {
    const idx = parseInt(unwrapped, 10)
    if (idx >= 0 && idx < options.length) return options[idx]
  }

  const compact = unwrapped.replace(/\s+/g, '')
  const byCompact = options.find((o) => o.replace(/\s+/g, '').toLowerCase() === compact.toLowerCase())
  if (byCompact) return byCompact

  return unwrapped
}

function parseMcqAnswer(questionId: string, raw: unknown): string {
  const options = MCQ_OPTIONS_BY_ID[questionId]

  if (typeof raw === 'number' && Number.isInteger(raw) && options && raw >= 0 && raw < options.length) {
    return options[raw]
  }

  const unwrapped = unwrapMcqRaw(raw)
  if (!unwrapped) return '—'

  return resolveToOptionLabel(questionId, unwrapped)
}

function parseMcqResponsesRoot(raw: unknown): Record<string, unknown> | null {
  if (raw === null || raw === undefined) return null
  if (typeof raw === 'string') {
    const t = raw.trim()
    if (!t) return null
    try {
      const p = JSON.parse(t) as unknown
      if (typeof p === 'object' && p !== null && !Array.isArray(p)) return p as Record<string, unknown>
    } catch {
      return null
    }
    return null
  }
  if (typeof raw === 'object' && !Array.isArray(raw)) return raw as Record<string, unknown>
  return null
}

function formatUnknownMcqValue(raw: unknown): string {
  const u = unwrapMcqRaw(raw)
  return u || '—'
}

function McqResponsesBlock({
  value,
  referralOther,
}: {
  value: unknown
  referralOther?: string | null
}) {
  if (value === null || value === undefined) return null

  const obj = parseMcqResponsesRoot(value)
  if (!obj) {
    return (
      <p className="text-gray-900 mt-1 whitespace-pre-wrap">{formatUnknownMcqValue(value)}</p>
    )
  }

  const unknownKeys = Object.keys(obj).filter((k) => !MCQ_KNOWN_IDS.has(k))
  const hasKnown = MCQ_SECTIONS.some(({ id }) => {
    const v = obj[id]
    if (v == null || v === '') return false
    return parseMcqAnswer(id, v) !== '—'
  })
  const hasContent = hasKnown || unknownKeys.length > 0

  if (!hasContent) {
    return <p className="text-sm text-gray-500 mt-1">No responses recorded.</p>
  }

  return (
    <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50/80 overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {MCQ_SECTIONS.map(({ id, title }) => {
          const raw = obj[id]
          if (raw == null || raw === '') return null
          const text = parseMcqAnswer(id, raw)
          if (text === '—') return null
          const isReferralOther =
            id === 'referral' &&
            text.toLowerCase() === 'other' &&
            Boolean(referralOther?.trim())
          return (
            <li key={id} className="px-4 py-3">
              <p className="text-xs font-medium text-gray-500 leading-snug">{title}</p>
              <p className="text-sm text-gray-900 mt-1.5 font-medium">{text}</p>
              {isReferralOther && (
                <p className="text-sm text-gray-700 mt-2 pl-3 border-l-2 border-indigo-200">
                  <span className="text-gray-500 font-normal">Specified: </span>
                  {(referralOther ?? '').trim()}
                </p>
              )}
            </li>
          )
        })}
        {unknownKeys.map((key) => (
          <li key={key} className="px-4 py-3 bg-white/60">
            <p className="text-xs font-medium text-gray-500">{key}</p>
            <p className="text-sm text-gray-900 mt-1.5 whitespace-pre-wrap">{formatUnknownMcqValue(obj[key])}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

type EmailDelivery = {
  sent: boolean
  skipped: boolean
  reason?: string
  error?: string
}

type ApplicationUpdateSuccess = Application & {
  emailDelivery?: EmailDelivery
}

export default function ApplicationDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [app, setApp] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [updateMessage, setUpdateMessage] = useState<string | null>(null)
  const [resumeUrl, setResumeUrl] = useState<string | null>(null)
  const [resumeFilename, setResumeFilename] = useState<string | null>(null)
  const [resumeLoading, setResumeLoading] = useState(true)
  const [resumeError, setResumeError] = useState<string | null>(null)

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

  useEffect(() => {
    setResumeLoading(true)
    setResumeError(null)

    fetch(`/api/proxy/applications/${id}/resume`)
      .then(async (r) => {
        if (!r.ok) {
          const data = await r.json().catch(() => null)
          throw new Error(data?.error || 'Failed to load resume')
        }
        return r.json()
      })
      .then((data) => {
        setResumeUrl(typeof data?.url === 'string' ? data.url : null)
        setResumeFilename(typeof data?.filename === 'string' ? data.filename : null)
      })
      .catch((error) => {
        setResumeUrl(null)
        setResumeFilename(null)
        setResumeError(error instanceof Error ? error.message : 'Failed to load resume')
      })
      .finally(() => setResumeLoading(false))
  }, [id])

  const updateStatus = async (status: 'accepted' | 'rejected') => {
    setUpdating(true)
    setUpdateMessage(null)
    try {
      const res = await fetch(`/api/proxy/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const data = await res.json().catch(() => null)

      if (!res.ok) {
        const message = typeof data?.error === 'string' ? data.error : 'Update failed'
        alert(message)
        return
      }

      const application = data as ApplicationUpdateSuccess | null
      if (application) {
        setApp(application)

        if (application.emailDelivery?.sent) {
          setUpdateMessage(`Status updated and the ${status} decision email was sent to ${application.email}.`)
        } else if (application.emailDelivery?.error) {
          setUpdateMessage(`Status updated, but the ${status} decision email was not sent: ${application.emailDelivery.error}`)
        } else if (application.emailDelivery?.reason) {
          setUpdateMessage(`Status updated. Decision email not sent: ${application.emailDelivery.reason}`)
        } else {
          setUpdateMessage('Status updated.')
        }
      }
    } catch {
      alert('Update failed')
    } finally {
      setUpdating(false)
    }
  }

  const openResume = () => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank', 'noopener,noreferrer')
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
                <McqResponsesBlock value={app.mcq_responses} referralOther={app.referral_other} />
              </div>
            )}

            <div className="pt-4 flex flex-wrap gap-3">
              {resumeUrl && (
                <button
                  onClick={openResume}
                  disabled={resumeLoading}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-900 font-medium hover:bg-gray-200 disabled:opacity-50"
                >
                  Open resume in new tab
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

            {updateMessage && (
              <p className="text-sm text-gray-600">{updateMessage}</p>
            )}
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Resume</h2>
            {resumeFilename && (
              <p className="mt-1 text-sm text-gray-500">{resumeFilename}</p>
            )}
          </div>

          {resumeLoading ? (
            <div className="px-6 py-12 text-sm text-gray-500">Loading resume...</div>
          ) : resumeUrl ? (
            <div className="h-[900px] bg-gray-100">
              <iframe
                src={resumeUrl}
                title={`${app.full_name} resume`}
                className="h-full w-full"
              />
            </div>
          ) : (
            <div className="px-6 py-12 text-sm text-gray-500">
              {resumeError || 'No resume available for this application.'}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
