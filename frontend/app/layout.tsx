import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Cormorant_Garamond, DM_Mono, Instrument_Serif } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-dm-mono',
  weight: ['300', '400', '500'],
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-instrument',
  weight: '400',
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: 'VentureHacks - March 28',
  description: 'Join us for VentureHacks on March 28. Build, compete, and meet VCs. Top prizes include $2,500, Meta Ray Bans, and Nintendo Switches.',
  keywords: ['hackathon', 'venturehacks', 'venture capital', 'technology', 'competition', 'felicis'],
  icons: {
    icon: '/logos/felicis.png',
    apple: '/logos/felicis.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${plusJakartaSans.variable} ${cormorantGaramond.variable} ${dmMono.variable} ${instrumentSerif.variable} font-sans antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
