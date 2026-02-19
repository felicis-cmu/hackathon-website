'use client'

import Link from 'next/link'
import { Container } from './ui/Container'

export const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center -mt-20 relative overflow-hidden">

      <Container>
        <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-8 sm:space-y-12">
          {/* Date */}
          <p className="text-sm sm:text-base md:text-lg font-light tracking-wide text-stone-500 uppercase">
            March 14, 2026
          </p>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-gray-900 tracking-tight font-serif leading-[0.9]">
            VentureHacks
          </h1>

          {/* Presented By */}
          <p className="text-sm sm:text-base md:text-lg font-light tracking-wide text-stone-500">
            Presented by Felicis@CMU
          </p>

          {/* Apply Button */}
          <Link
            href="/apply"
            className="px-8 sm:px-10 py-3 sm:py-3.5 text-sm font-semibold tracking-wide text-white bg-felicis-orange rounded-full hover:bg-felicis-orange-light transition-all duration-200 mt-4 shadow-sm hover:shadow-md"
          >
            Apply now
          </Link>
        </div>
      </Container>

    </section>
  )
}
