'use client'

import Image from 'next/image'
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
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 tracking-tight font-geist leading-none">
            VentureHacks
          </h1>

          {/* Presented By */}
          <div className="flex items-center justify-center gap-6 sm:gap-8">
            <Image
              src="/logos/felicis.png"
              alt="Felicis"
              width={80}
              height={80}
              className="h-12 w-auto sm:h-16"
            />
            <Image
              src="/logos/skild.webp"
              alt="Skild AI"
              width={120}
              height={48}
              className="h-8 w-auto sm:h-10"
            />
          </div>

          {/* Apply Button */}
          <Link 
            href="/apply"
            className="glass-context px-8 sm:px-12 py-3 sm:py-4 text-sm sm:text-base font-medium tracking-wide text-gray-900 hover:scale-105 transition-all ease-liquid duration-300 mt-4 uppercase"
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
