'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Container } from './ui/Container'
import { useState, useEffect } from 'react'

export const Header = () => {
  const [activeSection, setActiveSection] = useState('home')

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: 'auto' })
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'prizes', 'schedule', 'faq']
      const scrollPosition = window.scrollY + 100

      if (scrollPosition < 100) {
        setActiveSection('home')
        return
      }

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            return
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-toolbar mx-auto mt-4 w-fit px-2 py-2">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}
            className="flex items-center gap-2 px-3 py-1 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/logos/felicis.png"
              alt="Felicis Logo"
              width={32}
              height={32}
              className="w-6 h-6 sm:w-8 sm:h-8"
              priority
            />
            <div className="text-sm sm:text-base font-medium text-gray-900 tracking-wide">
              VentureHacks
            </div>
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={() => scrollToSection('about')}
              className={`glass-tab hidden sm:inline-flex ${activeSection === 'about' ? 'glass-tab-active' : ''}`}
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('prizes')}
              className={`glass-tab ${activeSection === 'prizes' ? 'glass-tab-active' : ''}`}
            >
              Prizes
            </button>
            <button
              onClick={() => scrollToSection('schedule')}
              className={`glass-tab hidden sm:inline-flex ${activeSection === 'schedule' ? 'glass-tab-active' : ''}`}
            >
              Schedule
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className={`glass-tab hidden sm:inline-flex ${activeSection === 'faq' ? 'glass-tab-active' : ''}`}
            >
              FAQ
            </button>
            <Link
              href="/apply/dashboard"
              className="glass-tab hidden sm:inline-flex"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
