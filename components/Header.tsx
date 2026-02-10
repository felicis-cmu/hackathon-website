'use client'

import Image from 'next/image'
import { Container } from './ui/Container'

export const Header = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-200 shadow-sm">
      <Container>
        <nav className="flex items-center justify-between py-3 sm:py-4">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Image 
              src="/logos/felicis.png"
              alt="Felicis Logo"
              width={40}
              height={40}
              className="w-8 h-8 sm:w-10 sm:h-10"
              priority
            />
            <div className="text-lg sm:text-2xl font-bold">
              <span className="text-gray-900">Felicis</span>
              <span className="text-gradient-purple"> Hackathon</span>
            </div>
          </button>

          <div className="flex items-center gap-4 sm:gap-8">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-gray-700 hover:text-purple-600 transition-colors font-medium text-sm sm:text-base"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('prizes')}
              className="text-gray-700 hover:text-purple-600 transition-colors font-medium text-sm sm:text-base"
            >
              Prizes
            </button>
            <button 
              onClick={() => scrollToSection('schedule')}
              className="text-gray-700 hover:text-purple-600 transition-colors font-medium text-sm sm:text-base hidden sm:block"
            >
              Schedule
            </button>
          </div>
        </nav>
      </Container>
    </header>
  )
}
