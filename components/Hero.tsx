'use client'

import Link from 'next/link'
import { Container } from './ui/Container'

export const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center py-16 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gray-200 opacity-30 blur-3xl rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-300 opacity-20 blur-3xl rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gray-100 opacity-40 blur-3xl rounded-full"></div>
      </div>

      <Container>
        <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-8 sm:space-y-12">
          {/* Date */}
          <p className="text-sm sm:text-base md:text-lg font-light tracking-wide text-gray-600 uppercase">
            March 14, 2026
          </p>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 tracking-tight font-dancing leading-none">
            VentureHack
          </h1>

          {/* Presented By */}
          <p className="text-sm sm:text-base md:text-lg font-light tracking-wide text-gray-600">
            Presented by <span className="font-medium">Felicis</span>
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
    </section>
  )
}
