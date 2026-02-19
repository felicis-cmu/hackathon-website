'use client'

import { useState } from 'react'
import { Container } from './ui/Container'

const faqItems = [
  {
    question: 'How can I register for VentureHacks?',
    answer: 'Apply through our application form on this website. Sign in with Google and complete the short answers, MCQs, and resume upload. We\'ll review applications and send confirmations.',
  },
  {
    question: 'Who can participate in VentureHacks?',
    answer: 'Students, professionals, and builders of all backgrounds are welcome. Whether you\'re a first-time hackathon participant or a seasoned builder, we\'d love to have you.',
  },
  {
    question: 'When and where is the event taking place?',
    answer: 'VentureHacks is on March 14, 2026 at Carnegie Mellon University. Doors open at 12:45 PM and the event runs until approximately 7:15 PM.',
  },
  {
    question: 'Are there networking opportunities at the event?',
    answer: 'Yes! You\'ll meet Felicis partners, Skild experts, and fellow builders. Top teams are invited to dinner and Felicis meetings—opportunities aren\'t limited to hackathon winners.',
  },
  {
    question: 'Are travel reimbursements provided?',
    answer: 'Please reach out to the Felicis team for questions about travel support.',
  },
  {
    question: 'Do participants just ideate, or actually build something?',
    answer: 'You build. VentureHacks is a hands-on hackathon—teams have 7 hours to create a functional prototype and present their work.',
  },
  {
    question: 'How many aims can I participate in?',
    answer: 'You can focus on one or combine multiple—product, AI, or Felicis portfolio integration. Build something that fits your interests.',
  },
]

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="py-16 sm:py-20 border-t border-stone-200">
      <Container>
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase text-felicis-orange mb-3">
            <span className="mr-2" style={{ color: '#ED843D' }}>05</span>FAQ
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light font-serif text-gray-900 mb-4 tracking-tight">
            Questions Answered
          </h2>
          <p className="text-sm sm:text-base text-stone-500 font-light">
            Reach out to the Felicis team with additional questions.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="space-y-2">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="glass-shot-card rounded-xl overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-stone-50/50 transition-colors"
                >
                  <span className={`font-medium text-gray-900 pr-4 transition-all ${
                    openIndex === index ? 'underline decoration-felicis-orange underline-offset-2 decoration-2' : ''
                  }`}>{item.question}</span>
                  <svg
                    className={`w-5 h-5 shrink-0 transition-transform ${
                      openIndex === index ? 'rotate-180 text-felicis-orange' : 'text-stone-400'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-4 pt-0">
                    <p className="text-sm text-stone-500">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
