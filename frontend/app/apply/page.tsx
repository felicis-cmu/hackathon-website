'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { CustomSelect } from '@/components/ui/CustomSelect'
import { SwirlCanvas } from '@/components/SwirlCanvas'

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001').replace(/\/+$/, '')

const DRAFT_KEY = (userId: string) => `venturehacks-apply-draft-${userId}`

type DraftForm = Omit<ReturnType<typeof getInitialForm>, 'resume'> & { resume: null }

function getInitialForm() {
  return {
    full_name: '',
    email: '',
    phone: '',
    linkedin_url: '',
    github_url: '',
    short_answer_1: '',
    short_answer_2: '',
    short_answer_3: '',
    short_answer_4: '',
    mcq_responses: {} as Record<string, string>,
    referral_other: '',
    resume: null as File | null,
  }
}

function loadDraft(userId: string): Partial<DraftForm> | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(DRAFT_KEY(userId))
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<DraftForm>
    return parsed
  } catch {
    return null
  }
}

function saveDraft(userId: string, form: Omit<ReturnType<typeof getInitialForm>, 'resume'> & { resume?: File | null }) {
  if (typeof window === 'undefined') return
  try {
    const { resume: _, ...rest } = form
    localStorage.setItem(DRAFT_KEY(userId), JSON.stringify(rest))
  } catch {
    // ignore
  }
}

function clearDraft(userId: string) {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(DRAFT_KEY(userId))
  } catch {
    // ignore
  }
}

const SHORT_ANSWERS_INTRO =
  'Your answers will be reviewed and weighed towards participation in the hackathon and for team matching (if applicable). Please answer in 2-4 sentences.'

const SHORT_QUESTIONS = [
  'Why do you want to attend VentureHacks?',
  'Describe a project you\'ve built or worked on. What was your role?',
  'What do you hope to learn or achieve at the hackathon?',
  'What is the best demonstration of your excellence as a builder?',
]

const MCQ_QUESTIONS = [
  {
    id: 'experience',
    question: 'What is your hackathon experience level?',
    options: ['First time', '1-2 hackathons', '3-5 hackathons', '6+ hackathons'],
  },
  {
    id: 'team',
    question: 'Do you have a team, or are you looking for one?',
    options: ['I have a team', 'Looking for a team', 'Solo participant'],
  },
  {
    id: 'focus',
    question: 'What area interests you most?',
    options: ['AI/ML', 'Web3', 'DevTools', 'Consumer apps', 'Other'],
  },
  {
    id: 'referral',
    question: 'How did you hear about VentureHacks?',
    options: ['ScottyLabs', 'LinkedIn', 'IS Advisor', 'CS Advisor', 'SEP', 'Friend', 'Other'],
  },
]

const FIELD_LABELS: Record<string, string> = {
  full_name: 'Full Name',
  email: 'Email',
  phone: 'Phone',
  linkedin_url: 'LinkedIn URL',
  github_url: 'GitHub URL',
  short_answer_1: 'Question 1',
  short_answer_2: 'Question 2',
  short_answer_3: 'Question 3',
  short_answer_4: 'Question 4',
  mcq_experience: 'Hackathon experience',
  mcq_team: 'Team status',
  mcq_focus: 'Focus area',
  mcq_referral: 'How did you hear about us',
  referral_other: 'Referral source (Other)',
  resume: 'Resume',
}

function getSectionErrors(
  errors: Record<string, string>,
  fields: string[]
): { field: string; label: string; message: string }[] {
  return fields
    .filter((f) => errors[f])
    .map((f) => ({ field: f, label: FIELD_LABELS[f] ?? f, message: errors[f] }))
}

export default function ApplyPage() {
  const { user, session, loading, signInWithGoogle } = useAuth()
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState(getInitialForm)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const formTopRef = useRef<HTMLFormElement>(null)

  // Load draft from localStorage when user is available
  useEffect(() => {
    if (!user) return
    const draft = loadDraft(user.id)
    if (draft) {
      setForm((f) => ({
        ...f,
        ...draft,
        full_name: draft.full_name || (user.user_metadata?.full_name ?? user.user_metadata?.name ?? ''),
        email: draft.email || (user.email ?? ''),
        resume: null,
      }))
    } else {
      setForm((f) => ({
        ...f,
        full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? '',
        email: user.email ?? '',
      }))
    }
  }, [user?.id])

  const persistDraft = useCallback(() => {
    if (!user) return
    saveDraft(user.id, form)
  }, [user?.id, form])

  // Debounced save to localStorage on form change
  useEffect(() => {
    if (!user) return
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(() => {
      persistDraft()
      saveTimeoutRef.current = null
    }, 500)
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    }
  }, [form, user?.id, persistDraft])

  const [hasApplication, setHasApplication] = useState(false)
  const [checkingApplication, setCheckingApplication] = useState(true)

  useEffect(() => {
    if (!user || !session) {
      setCheckingApplication(false)
      return
    }
    setCheckingApplication(true)
    fetch(`${BACKEND_URL}/api/applications/status`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((r) => r.json())
      .then(({ data }) => {
        if (data) setHasApplication(true)
        setCheckingApplication(false)
      })
      .catch(() => {
        setCheckingApplication(false)
      })
  }, [user, session])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (validationErrors[name]) setValidationErrors((e) => ({ ...e, [name]: '' }))
  }

  const handleMcqChange = (key: string, value: string) => {
    setForm((f) => ({
      ...f,
      mcq_responses: { ...f.mcq_responses, [key]: value },
      ...(key === 'referral' && value !== 'Other' ? { referral_other: '' } : {}),
    }))
    if (validationErrors[`mcq_${key}`]) setValidationErrors((e) => ({ ...e, [`mcq_${key}`]: '' }))
    if (key === 'referral' && value !== 'Other' && validationErrors.referral_other) {
      setValidationErrors((e) => ({ ...e, referral_other: '' }))
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    if (!form.full_name?.trim()) errors.full_name = 'Required'
    if (!form.email?.trim()) errors.email = 'Required'
    if (!form.linkedin_url?.trim()) errors.linkedin_url = 'Required'
    if (!form.github_url?.trim()) errors.github_url = 'Required'
    if (!form.short_answer_1?.trim()) errors.short_answer_1 = 'Required'
    if (!form.short_answer_2?.trim()) errors.short_answer_2 = 'Required'
    if (!form.short_answer_3?.trim()) errors.short_answer_3 = 'Required'
    if (!form.short_answer_4?.trim()) errors.short_answer_4 = 'Required'
    MCQ_QUESTIONS.forEach((q) => {
      if (!form.mcq_responses[q.id]?.trim()) errors[`mcq_${q.id}`] = 'Required'
    })
    if (form.mcq_responses.referral === 'Other' && !form.referral_other?.trim()) {
      errors.referral_other = 'Please specify how you heard about us'
    }
    if (!form.resume) errors.resume = 'Required'
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !session) return
    if (!validateForm()) {
      formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    setFormLoading(true)
    setError(null)
    setValidationErrors({})

    try {
      const token = session.access_token
      let resumeUrl: string | null = null
      let resumeFilename: string | null = null

      if (form.resume) {
        // Get a signed upload URL from the backend
        const uploadRes = await fetch(`${BACKEND_URL}/api/upload/resume`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ filename: form.resume.name }),
        })
        if (!uploadRes.ok) {
          const { error: uploadErr } = await uploadRes.json()
          throw new Error(uploadErr || 'Failed to get upload URL')
        }
        const { signedUrl, publicUrl } = await uploadRes.json()

        // Upload directly to Supabase storage via the signed URL
        const putRes = await fetch(signedUrl, {
          method: 'PUT',
          headers: { 'Content-Type': form.resume.type || 'application/octet-stream' },
          body: form.resume,
        })
        if (!putRes.ok) throw new Error('Failed to upload resume')

        resumeUrl = publicUrl
        resumeFilename = form.resume.name
      }

      // Submit application data via backend
      const submitRes = await fetch(`${BACKEND_URL}/api/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          linkedin_url: form.linkedin_url,
          github_url: form.github_url,
          short_answer_1: form.short_answer_1,
          short_answer_2: form.short_answer_2,
          short_answer_3: form.short_answer_3,
          short_answer_4: form.short_answer_4,
          mcq_responses: form.mcq_responses,
          referral_other: form.referral_other,
          resume_url: resumeUrl,
          resume_filename: resumeFilename,
        }),
      })

      if (!submitRes.ok) {
        const { error: submitErr } = await submitRes.json()
        throw new Error(submitErr || 'Failed to submit application')
      }

      clearDraft(user.id)
      window.location.href = '/apply/dashboard'
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setFormLoading(false)
    }
  }

  if (loading || checkingApplication) {
    return (
      <>
        <SwirlCanvas />
        <div className="min-h-screen flex items-center justify-center relative z-10">
          <div className="text-center">
            <div className="animate-pulse text-gray-500">Loading...</div>
          </div>
        </div>
      </>
    )
  }

  if (!user) {
    return (
      <>
        <SwirlCanvas />
        <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
        <div className="max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Apply to VentureHacks</h1>
          <p className="text-gray-600 mb-8">
            Sign in to continue your application. We use your account to save your progress.
          </p>
          <div className="space-y-4">
            <button
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all font-medium text-gray-900"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            <Link href="/" className="text-felicis-orange hover:underline">← Back to home</Link>
          </p>
        </div>
      </div>
      </>
    )
  }

  if (hasApplication) {
    return (
      <>
        <SwirlCanvas />
        <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
          <div className="max-w-md w-full text-center">
            <p className="text-gray-600 mb-6">You&apos;ve already submitted an application.</p>
            <Link
              href="/apply/dashboard"
              className="inline-block px-6 py-3 rounded-2xl bg-felicis-orange text-white font-medium hover:opacity-90 transition-colors"
            >
              View Dashboard
            </Link>
            <p className="mt-6 text-sm text-gray-500">
              <Link href="/" className="text-felicis-orange hover:underline">← Back to home</Link>
            </p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <SwirlCanvas />
      <div className="min-h-screen py-12 px-4 relative z-10">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-felicis-orange hover:underline text-sm">← Back to home</Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Apply to VentureHacks</h1>
          <p className="text-gray-600 mt-2">March 28, 2026</p>
        </div>

        <form ref={formTopRef} onSubmit={handleSubmit} className="space-y-8" noValidate>
          {error && (
            <div className="p-4 rounded-2xl bg-red-50 text-red-700 border border-red-200">
              {error}
            </div>
          )}
          {Object.keys(validationErrors).length > 0 && (
            <div
              role="alert"
              className="p-4 rounded-2xl bg-red-50 text-red-700 border-2 border-red-300"
            >
              <p className="font-semibold mb-1">Please fix the following before submitting:</p>
              <ul className="list-disc list-inside text-sm space-y-0.5">
                {Object.entries(validationErrors).map(([field, msg]) => (
                  <li key={field}>
                    {FIELD_LABELS[field] ?? field}: {msg}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <section className="glass-shot-card rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
            {getSectionErrors(validationErrors, ['full_name', 'email', 'phone', 'linkedin_url', 'github_url']).length > 0 && (
              <p className="text-sm text-red-600">
                {getSectionErrors(validationErrors, ['full_name', 'email', 'phone', 'linkedin_url', 'github_url'])
                  .map((e) => `${e.label}: ${e.message}`)
                  .join(' • ')}
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:ring-2 focus:ring-felicis-orange focus:border-transparent outline-none ${
                    validationErrors.full_name ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {validationErrors.full_name && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.full_name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:ring-2 focus:ring-felicis-orange focus:border-transparent outline-none ${
                    validationErrors.email ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                )}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:ring-2 focus:ring-felicis-orange focus:border-transparent outline-none ${
                    validationErrors.phone ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {validationErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL *</label>
                <input
                  type="url"
                  name="linkedin_url"
                  value={form.linkedin_url}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/..."
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:ring-2 focus:ring-felicis-orange focus:border-transparent outline-none ${
                    validationErrors.linkedin_url ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {validationErrors.linkedin_url && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.linkedin_url}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL *</label>
              <input
                type="url"
                name="github_url"
                value={form.github_url}
                onChange={handleChange}
                placeholder="https://github.com/username"
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:ring-2 focus:ring-felicis-orange focus:border-transparent outline-none ${
                  validationErrors.github_url ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {validationErrors.github_url && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.github_url}</p>
              )}
            </div>
          </section>

          <section className="glass-shot-card rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Short Answers</h2>
            {getSectionErrors(validationErrors, ['short_answer_1', 'short_answer_2', 'short_answer_3', 'short_answer_4']).length > 0 && (
              <p className="text-sm text-red-600">
                {getSectionErrors(validationErrors, ['short_answer_1', 'short_answer_2', 'short_answer_3', 'short_answer_4'])
                  .map((e) => `${e.label}: ${e.message}`)
                  .join(' • ')}
              </p>
            )}
            <p className="text-sm text-gray-600 mb-4">{SHORT_ANSWERS_INTRO}</p>
            {SHORT_QUESTIONS.map((q, i) => {
              const key = `short_answer_${i + 1}` as keyof typeof form
              const value = form[key] as string
              const hasError = !!validationErrors[key]
              return (
                <div key={i}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{q} *</label>
                  <textarea
                    name={key}
                    value={value}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:ring-2 focus:ring-felicis-orange focus:border-transparent outline-none resize-none ${
                      hasError ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {validationErrors[key] && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors[key]}</p>
                  )}
                </div>
              )
            })}
          </section>

          <section className="glass-shot-card rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Multiple Choice</h2>
            {getSectionErrors(validationErrors, ['mcq_experience', 'mcq_team', 'mcq_focus', 'mcq_referral', 'referral_other']).length > 0 && (
              <p className="text-sm text-red-600">
                {getSectionErrors(validationErrors, ['mcq_experience', 'mcq_team', 'mcq_focus', 'mcq_referral', 'referral_other'])
                  .map((e) => `${e.label}: ${e.message}`)
                  .join(' • ')}
              </p>
            )}
            {MCQ_QUESTIONS.map((q) => (
              <div key={q.id}>
                <CustomSelect
                  id={`mcq_${q.id}`}
                  label={`${q.question} *`}
                  value={form.mcq_responses[q.id] ?? ''}
                  options={q.options}
                  onChange={(v) => handleMcqChange(q.id, v)}
                  hasError={!!validationErrors[`mcq_${q.id}`]}
                />
                {validationErrors[`mcq_${q.id}`] && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors[`mcq_${q.id}`]}</p>
                )}
                {q.id === 'referral' && form.mcq_responses.referral === 'Other' && (
                  <div className="mt-3">
                    <input
                      type="text"
                      name="referral_other"
                      value={form.referral_other}
                      onChange={handleChange}
                      placeholder="Please specify..."
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:ring-2 focus:ring-felicis-orange focus:border-transparent outline-none ${
                        validationErrors.referral_other ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {validationErrors.referral_other && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.referral_other}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </section>

          <section className="glass-shot-card rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Resume *</h2>
            {validationErrors.resume && (
              <p className="text-sm text-red-600">Resume: {validationErrors.resume}</p>
            )}
            <p className="text-sm text-gray-600">Upload your resume (PDF, PNG, or JPG, max 5MB)</p>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => {
                setForm((f) => ({ ...f, resume: e.target.files?.[0] ?? null }))
                if (validationErrors.resume) setValidationErrors((err) => ({ ...err, resume: '' }))
              }}
              className={`w-full px-4 py-3 rounded-xl border text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-100 file:font-medium cursor-pointer ${
                validationErrors.resume ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            {validationErrors.resume && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.resume}</p>
            )}
          </section>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={formLoading}
              className="flex-1 px-6 py-4 rounded-2xl bg-felicis-orange text-white font-medium hover:opacity-90 disabled:opacity-50 transition-colors"
            >
              {formLoading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  )
}
