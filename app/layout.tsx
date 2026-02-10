import type { Metadata } from 'next'
import { IBM_Plex_Mono, Dancing_Script } from 'next/font/google'
import './globals.css'

const ibmPlexMono = IBM_Plex_Mono({ 
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  weight: ['300', '400', '500', '600', '700']
})

export const dancingScript = Dancing_Script({ 
  subsets: ['latin'],
  variable: '--font-dancing-script',
  weight: ['400', '700']
})

export const metadata: Metadata = {
  title: 'VentureHack - March 14',
  description: 'Join us for VentureHack on March 14. Build, compete, and meet VCs. Top prizes include $2,500, Meta Ray Bans, and Nintendo Switches.',
  keywords: ['hackathon', 'venturehack', 'venture capital', 'technology', 'competition', 'felicis'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${ibmPlexMono.variable} ${dancingScript.variable} font-mono antialiased`}>{children}</body>
    </html>
  )
}
