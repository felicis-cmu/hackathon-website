'use client'

import Link from 'next/link'
import { Container } from './ui/Container'
import { SwirlCanvas } from './SwirlCanvas'
import { useState, useEffect, useRef, CSSProperties } from 'react'

/** Eastern (EDT, -04:00) — March 28, 2026 */
const HACKING_END = new Date('2026-03-28T18:30:00-04:00')
const JUDGING_END = new Date('2026-03-28T19:30:00-04:00')
const AWARDS_END = new Date('2026-03-28T20:30:00-04:00')

type CountdownPhase = 'hacking' | 'judging' | 'awards' | 'done'

const PHASE_TITLE: Record<CountdownPhase, string> = {
  hacking: 'Hacking',
  judging: 'Judging',
  awards: 'Awards',
  done: 'Thanks',
}

const W = 50;   const H = 68;   const FS = 40   // desktop
const WS = 36;  const HS = 50;  const FSS = 28  // mobile small

function useCountdown() {
  const [t, setT] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    phase: 'hacking' as CountdownPhase,
  })

  useEffect(() => {
    const tick = () => {
      const now = Date.now()
      let target: Date
      let phase: CountdownPhase

      if (now < HACKING_END.getTime()) {
        phase = 'hacking'
        target = HACKING_END
      } else if (now < JUDGING_END.getTime()) {
        phase = 'judging'
        target = JUDGING_END
      } else if (now < AWARDS_END.getTime()) {
        phase = 'awards'
        target = AWARDS_END
      } else {
        setT({ days: 0, hours: 0, minutes: 0, seconds: 0, phase: 'done' })
        return
      }

      const diff = target.getTime() - now
      if (diff <= 0) {
        setT({ days: 0, hours: 0, minutes: 0, seconds: 0, phase })
        return
      }

      setT({
        phase,
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return t
}

function FlipDigit({ value, small }: { value: string; small?: boolean }) {
  const [current, setCurrent] = useState(value)
  const [prev, setPrev]       = useState(value)
  const [phase, setPhase]     = useState<'idle' | 'away' | 'in'>('idle')
  const t1 = useRef<ReturnType<typeof setTimeout>>()
  const t2 = useRef<ReturnType<typeof setTimeout>>()

  const w = small ? WS : W
  const h = small ? HS : H
  const fs = small ? FSS : FS

  useEffect(() => {
    if (value === current) return
    clearTimeout(t1.current); clearTimeout(t2.current)
    setPrev(current)
    setPhase('away')
    t1.current = setTimeout(() => { setCurrent(value); setPhase('in')  }, 270)
    t2.current = setTimeout(() => { setPhase('idle') }, 540)
    return () => { clearTimeout(t1.current); clearTimeout(t2.current) }
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  const halfTop: CSSProperties = {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: '50%', overflow: 'hidden',
    borderRadius: '6px 6px 0 0',
    background: '#FFFEFB',
    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
  }
  const halfBot: CSSProperties = {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: '50%', overflow: 'hidden',
    borderRadius: '0 0 6px 6px',
    background: '#F5F3EF',
    display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
  }
  const digit: CSSProperties = {
    fontSize: fs, fontWeight: 500,
    lineHeight: `${h}px`,
    color: '#1C1917',
    fontFamily: 'var(--font-dm-mono), monospace',
    fontVariantNumeric: 'tabular-nums',
    userSelect: 'none',
  }

  return (
    <div style={{ position: 'relative', width: w, height: h, perspective: '400px' }}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 6,
        border: '1px solid #DDD9D4',
        boxShadow: '0 6px 18px rgba(15,25,35,0.12), 0 1px 4px rgba(15,25,35,0.06)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={halfBot}>
        <span style={{ ...digit, marginTop: `${-h / 2}px` }}>{current}</span>
      </div>
      <div style={halfTop}>
        <span style={{ ...digit, marginBottom: `${-h / 2}px` }}>{current}</span>
      </div>
      {(phase === 'away') && (
        <div style={{ ...halfTop, transformOrigin: 'center bottom', animation: 'flipTopAway 0.27s ease-in forwards', zIndex: 8 }}>
          <span style={{ ...digit, marginBottom: `${-h / 2}px` }}>{prev}</span>
        </div>
      )}
      {(phase === 'in') && (
        <div style={{ ...halfBot, transformOrigin: 'center top', animation: 'flipBottomIn 0.27s ease-out forwards', zIndex: 8 }}>
          <span style={{ ...digit, marginTop: `${-h / 2}px` }}>{current}</span>
        </div>
      )}
      <div style={{
        position: 'absolute', top: '50%', left: 0, right: 0,
        height: '1px', background: 'rgba(15,25,35,0.09)',
        transform: 'translateY(-0.5px)', zIndex: 9,
      }} />
    </div>
  )
}

function FlipUnit({ value, label, small }: { value: number; label: string; small?: boolean }) {
  const s = String(value).padStart(2, '0')
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1">
        <FlipDigit value={s[0]} small={small} />
        <FlipDigit value={s[1]} small={small} />
      </div>
      <span className="text-[9px] sm:text-xs font-semibold uppercase tracking-widest text-stone-400">
        {label}
      </span>
    </div>
  )
}

export const Hero = () => {
  const { days, hours, minutes, seconds, phase } = useCountdown()

  return (
    <section className="min-h-screen flex items-center justify-center -mt-20 relative overflow-hidden">
      <SwirlCanvas />
      <Container>
        <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-8 sm:space-y-10">

          {/* Event badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-stone-200 bg-white/70 text-sm sm:text-base font-semibold text-stone-600 tracking-wide shadow-sm">
            <span>Applications due March 21</span>
            <span className="w-2 h-2 rounded-full animate-pulse shrink-0" style={{ backgroundColor: '#ED843D' }} />
            <span>Hackathon on March 28</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold text-gray-900 tracking-tight font-sans leading-[0.9]">
            {PHASE_TITLE[phase]}
          </h1>


          {/* Flip clock — mobile: 2×2 grid, desktop: single row */}
          <div className="sm:hidden grid grid-cols-2 gap-x-6 gap-y-4 justify-items-center">
            <FlipUnit value={days}    label="Days"  small />
            <FlipUnit value={hours}   label="Hours" small />
            <FlipUnit value={minutes} label="Min"   small />
            <FlipUnit value={seconds} label="Sec"   small />
          </div>
          <div className="hidden sm:flex items-end gap-5">
            <FlipUnit value={days}    label="Days" />
            <span className="text-3xl text-stone-200 font-light pb-6 select-none">:</span>
            <FlipUnit value={hours}   label="Hours" />
            <span className="text-3xl text-stone-200 font-light pb-6 select-none">:</span>
            <FlipUnit value={minutes} label="Min" />
            <span className="text-3xl text-stone-200 font-light pb-6 select-none">:</span>
            <FlipUnit value={seconds} label="Sec" />
          </div>
          

          {/* CTA */}
          <div className="flex flex-col items-center gap-3">
            <Link
              href="/apply"
              className="px-8 sm:px-10 py-3 sm:py-3.5 text-sm font-semibold tracking-wide text-white rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
              style={{ backgroundColor: '#ED843D' }}
            >
              Apply now
            </Link>
            <p className="text-sm sm:text-base text-stone-600 font-medium tracking-wide">
              Presented by Felicis@CMU
            </p>
          </div>

        </div>
      </Container>
    </section>
  )
}
