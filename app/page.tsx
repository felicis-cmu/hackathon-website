import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Prizes } from '@/components/Prizes'
import { Schedule } from '@/components/Schedule'
import { Speakers } from '@/components/Speakers'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-20">
        <Hero />
        <Prizes />
        <Schedule />
        <Speakers />
      </div>
      <Footer />
    </main>
  )
}
