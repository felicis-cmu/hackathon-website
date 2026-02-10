'use client'

import { Container } from './ui/Container'
import { Button } from './ui/Button'

export const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="py-16 sm:py-20 md:py-32">
      <Container>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12">
          <div className="flex-1 space-y-6 sm:space-y-8 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight">
              <span className="text-gradient-purple">VentureHack</span>
            </h1>
            
            <div className="space-y-3 sm:space-y-4">
              <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800">
                March 14
              </p>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0">
                Build iconic companies. Meet venture capital partners. 
                Compete for amazing prizes and opportunities.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Button onClick={() => scrollToSection('prizes')}>
                View Prizes
              </Button>
              <Button onClick={() => scrollToSection('schedule')} variant="primary">
                See Schedule
              </Button>
            </div>
          </div>

          <div className="flex-1 relative w-full max-w-md lg:max-w-none">
            <div className="aspect-square rounded-full bg-gradient-purple opacity-20 blur-3xl"></div>
          </div>
        </div>
      </Container>
    </section>
  )
}
