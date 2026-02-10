import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Felicis Hackathon - March 14',
  description: 'Join us for the Felicis Hackathon on March 14. Build, compete, and meet VCs. Top prizes include $2,500, Meta Ray Bans, and Nintendo Switches.',
  keywords: ['hackathon', 'felicis', 'venture capital', 'technology', 'competition'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
