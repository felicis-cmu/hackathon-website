import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Aims } from '@/components/Aims'
import { Prizes } from '@/components/Prizes'
import { Schedule } from '@/components/Schedule'
import { Speakers } from '@/components/Speakers'
import { FAQ } from '@/components/FAQ'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-20">
        <Hero />
        <Aims />
        <Prizes />
        <Schedule />
        <Speakers />
        <FAQ />
      </div>
      <Footer />
    </main>
  )
}
