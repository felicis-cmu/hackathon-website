import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Dancing_Script } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing-script',
  weight: ['400', '700'],
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
      <body className={`${plusJakartaSans.variable} ${dancingScript.variable} font-sans antialiased`}>
        {/* App-wide gradient: stronger at edges, weaker at center */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            zIndex: -30,
            background: 'radial-gradient(ellipse 100% 100% at 50% 50%, rgba(250,247,242,0.0) 0%, rgba(248,220,180,0.55) 35%, rgba(240,140,50,0.88) 65%, rgba(210,80,10,0.97) 85%, rgba(160,45,5,1.0) 100%)',
          }}
        />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
