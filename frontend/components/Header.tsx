'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

const navItems = [
  { id: 'about',    label: 'About' },
  { id: 'prizes',   label: 'Prizes' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'faq',      label: 'FAQ' },
]

export const Header = () => {
  const [activeSection, setActiveSection] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: 'auto' })
    setMenuOpen(false)
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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div ref={menuRef} className="mx-auto mt-4 w-fit">
        {/* Main pill */}
        <div className="glass-toolbar px-2 py-2">
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

            {/* Desktop nav */}
            <div className="hidden sm:flex items-center gap-1">
              {navItems.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`glass-tab ${activeSection === id ? 'glass-tab-active' : ''}`}
                >
                  {label}
                </button>
              ))}
              <Link href="/apply/dashboard" className="glass-tab">
                Dashboard
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="sm:hidden flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-black/5 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                /* X icon */
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <line x1="3" y1="3" x2="13" y2="13" />
                  <line x1="13" y1="3" x2="3" y2="13" />
                </svg>
              ) : (
                /* Hamburger icon */
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <line x1="2" y1="5" x2="14" y2="5" />
                  <line x1="2" y1="8.5" x2="14" y2="8.5" />
                  <line x1="2" y1="12" x2="14" y2="12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="sm:hidden mt-1.5 glass-toolbar py-1.5 px-2 flex flex-col gap-0.5" style={{ borderRadius: 14 }}>
            {navItems.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={`glass-tab w-full text-left justify-start ${activeSection === id ? 'glass-tab-active' : ''}`}
              >
                {label}
              </button>
            ))}
            <Link
              href="/apply/dashboard"
              onClick={() => setMenuOpen(false)}
              className="glass-tab w-full text-left justify-start"
            >
              Dashboard
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
