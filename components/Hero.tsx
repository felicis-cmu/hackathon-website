'use client'

import Link from 'next/link'
import { Container } from './ui/Container'

export const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center -mt-20 relative overflow-hidden">

      <Container>
        <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-8 sm:space-y-12">
          {/* Date */}
          <p className="text-sm sm:text-base md:text-lg font-light tracking-wide text-gray-600 uppercase">
            March 14, 2026
          </p>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 tracking-tight font-dancing leading-none">
            VentureHacks
          </h1>

          {/* Presented By */}
          <p className="text-sm sm:text-base md:text-lg font-light tracking-wide text-gray-600">
            Presented by Felicis and Skild AI
          </p>

          {/* Apply Button */}
          <Link
            href="/apply"
            className="px-8 sm:px-12 py-3 sm:py-4 text-sm sm:text-base font-medium tracking-wide text-gray-900 border border-gray-300 rounded-full hover:border-felicis-orange hover:text-felicis-orange transition-all duration-200 mt-4 uppercase"
          >
            Apply now
          </Link>
        </div>
      </Container>

      {/* Location - bottom left */}
      <div className="absolute bottom-8 left-8 sm:bottom-10 sm:left-10 flex items-center gap-3 text-left z-10">
        <svg className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-lg sm:text-xl font-medium text-gray-700">Carnegie Mellon University</span>
      </div>
    </section>
  )
}
