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
      <body className={`${plusJakartaSans.variable} ${dancingScript.variable} font-sans antialiased relative`}>
        {/* App-wide gradient: stronger at edges, weaker at center */}
        <div
          className="fixed inset-0 -z-30 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(250,247,242,0.35) 0%, rgba(245,237,224,0.65) 25%, rgba(254,215,170,0.75) 50%, rgba(251,146,60,0.7) 75%, rgba(201,104,36,0.8) 100%)',
          }}
        />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
