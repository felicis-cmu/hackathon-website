import Image from 'next/image'
import { Container } from './ui/Container'

export const Footer = () => {
  return (
    <footer className="relative pt-2 pb-16 sm:pt-4 sm:pb-20 overflow-hidden">
      {/* Big VentureHacks watermark - bottom, Dancing Script, black */}
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
        <span className="font-dancing text-[12vw] sm:text-[10vw] font-bold text-black/10 tracking-tighter leading-none pb-4">
          VentureHacks
        </span>
      </div>

      <Container>
        <div className="relative z-10 flex flex-col items-start text-left">
          {/* Logo + Branding - left justified */}
          <div className="flex items-center gap-4 mb-6">
            <Image src="/logos/felicis.png" alt="Felicis" width={48} height={48} className="h-12 w-12" />
          </div>
          <p className="text-gray-800 text-sm sm:text-base mb-6">
            Pittsburgh&apos;s hackathon powered by Felicis & Skild AI
          </p>

          {/* Copyright */}
          <p className="text-sm text-gray-800">
            © 2026 VentureHacks. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  )
}
