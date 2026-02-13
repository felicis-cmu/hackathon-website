import type { Metadata } from 'next'
import { IBM_Plex_Mono, Geist } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'

const ibmPlexMono = IBM_Plex_Mono({ 
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  weight: ['300', '400', '500', '600', '700']
})

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})

export const metadata: Metadata = {
  title: 'VentureHacks - March 14',
  description: 'Join us for VentureHacks on March 14. Build, compete, and meet VCs. Top prizes include $2,500, Meta Ray Bans, and Nintendo Switches.',
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
      <body className={`${ibmPlexMono.variable} ${geist.variable} font-mono antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
