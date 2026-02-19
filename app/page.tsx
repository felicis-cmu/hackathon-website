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
        {/* Hero → content divider */}
        <div className="flex items-center gap-4 px-8 sm:px-16 md:px-24">
          <div className="flex-1 border-t border-stone-200" />
          <div className="w-1.5 h-1.5 rounded-full bg-felicis-orange/50" />
          <div className="flex-1 border-t border-stone-200" />
        </div>
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
