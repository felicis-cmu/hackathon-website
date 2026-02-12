'use client'

import { useState } from 'react'
import { Container } from './ui/Container'

const faqs = [
  {
    q: 'Who can participate?',
    a: 'All CMU undergrads, grad students, and PhDs are welcome to apply.',
  },
  {
    q: 'Do I need a team to apply?',
    a: "No — if you don't have a team we'll help match you with one.",
  },
  {
    q: 'What should I build?',
    a: 'The full specifications will be released on hackathon day.',
  },
  {
    q: 'How are projects judged?',
    a: 'Judging details will be announced on hackathon day.',
  },
  {
    q: 'Can I use AI tools?',
    a: 'Yes — AI tools are encouraged.',
  },
]

export const FAQ = () => {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="max-w-2xl mx-auto">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-felicis-orange mb-3">
              FAQ
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Common questions
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left gap-4 group"
                >
                  <span className="text-base font-medium text-gray-900 group-hover:text-felicis-orange transition-colors">
                    {faq.q}
                  </span>
                  <span className="text-felicis-orange text-lg shrink-0 transition-transform duration-200" style={{ transform: open === i ? 'rotate(45deg)' : 'none' }}>
                    +
                  </span>
                </button>
                {open === i && (
                  <p className="pb-5 text-sm text-gray-500 font-light leading-relaxed">
                    {faq.a || 'Answer coming soon.'}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
