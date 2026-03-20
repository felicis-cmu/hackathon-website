'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { SwirlCanvas } from '@/components/SwirlCanvas'

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001').replace(/\/+$/, '')

type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | null

export default function DashboardPage() {
  const { user, session, loading: authLoading } = useAuth()
  const [status, setStatus] = useState<ApplicationStatus>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !session) return
    fetch(`${BACKEND_URL}/api/applications/status`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((r) => r.json())
      .then(({ data }) => {
        setStatus(data ? ((data.status as ApplicationStatus) ?? 'pending') : null)
        setConfirmed(data?.confirmed ?? false)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [user?.id, session])

  const handleConfirm = async () => {
    if (!session || confirming) return
    setConfirming(true)
    try {
      const res = await fetch(`${BACKEND_URL}/api/applications/confirm`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (res.ok) {
        setConfirmed(true)
      }
    } finally {
      setConfirming(false)
    }
  }

  if (authLoading || (user && loading)) {
    return (
      <>
        <SwirlCanvas />
        <div className="min-h-screen flex items-center justify-center relative z-10">
          <div className="animate-pulse text-gray-500">Loading...</div>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Application Dashboard</h1>
            <p className="text-gray-600 mb-8">Sign in to view your application status.</p>
            <Link
              href="/apply"
              className="inline-block px-6 py-3 rounded-2xl bg-felicis-orange text-white font-medium hover:opacity-90 transition-colors"
            >
              Go to Apply
            </Link>
          </div>
        </div>
      </>
    )
  }

  if (status === null) {
    return (
      <>
        <SwirlCanvas />
        <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
          <div className="max-w-md w-full text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">No Application Found</h1>
            <p className="text-gray-600 mb-8">You haven&apos;t submitted an application yet.</p>
            <Link
              href="/apply"
              className="inline-block px-6 py-3 rounded-2xl bg-felicis-orange text-white font-medium hover:opacity-90 transition-colors"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </>
    )
  }

  if (status === 'pending') {
    return (
      <>
        <SwirlCanvas />
        <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
          <div className="max-w-md w-full text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Application Pending</h1>
            <p className="text-gray-600 mb-8">
              Your application is under review. We&apos;ll notify you once a decision has been made.
            </p>
            <Link href="/" className="text-felicis-orange hover:underline text-sm">
              ← Back to home
            </Link>
          </div>
        </div>
      </>
    )
  }

  if (status === 'rejected') {
    return (
      <>
        <SwirlCanvas />
        <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
          <div className="max-w-md w-full text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Application Status</h1>
            <p className="text-gray-600 mb-8">
              Unfortunately, we were not able to offer you a spot at this time. We encourage you to apply again next year.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 rounded-2xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
            >
              Back to home
            </Link>
          </div>
        </div>
      </>
    )
  }

  // status === 'accepted'
  return (
    <>
      <SwirlCanvas />
      <div className="min-h-screen py-12 px-4 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Link href="/" className="text-felicis-orange hover:underline text-sm">← Back to home</Link>
            <h1 className="text-3xl font-bold text-gray-900 mt-4">You&apos;re In!</h1>
            <p className="text-gray-600 mt-2">Your application has been accepted. Here&apos;s what you need to know.</p>
          </div>

          <div className="rounded-2xl border border-felicis-border bg-white/90 backdrop-blur-sm p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Event Details</h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex gap-3">
                <span className="text-felicis-orange font-medium shrink-0">•</span>
                <span><strong>Arrival:</strong> Arrive at Tepper by 10:45 AM on March 28</span>
              </li>
              <li className="flex gap-3">
                <span className="text-felicis-orange font-medium shrink-0">•</span>
                <span><strong>Location:</strong> Carnegie Mellon University, Doherty 2315</span>
              </li>
              <li className="flex gap-3">
                <span className="text-felicis-orange font-medium shrink-0">•</span>
                <span><strong>Check-in:</strong> Just bring yourself.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-felicis-orange font-medium shrink-0">•</span>
                <span><strong>What to bring:</strong> Laptop, charger, and your best ideas.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-felicis-orange font-medium shrink-0">•</span>
                <span><strong>Questions?</strong> Reach out to dichung@andrew.cmu.edu or aarusha@andrew.cmu.edu</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 rounded-2xl border border-felicis-border bg-white/90 backdrop-blur-sm p-6 sm:p-8">
            {confirmed ? (
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                <div>
                  <p className="font-semibold text-gray-900">Attendance Confirmed</p>
                  <p className="text-sm text-gray-500">We&apos;ll see you on March 28!</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Confirm Your Attendance</h3>
                  <p className="text-sm text-gray-600 mt-1">Please confirm that you&apos;ll be attending the hackathon so we can plan accordingly.</p>
                </div>
                <button
                  onClick={handleConfirm}
                  disabled={confirming}
                  className="px-6 py-3 rounded-2xl bg-felicis-orange text-white font-medium hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {confirming ? 'Confirming...' : 'Confirm Attendance'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
