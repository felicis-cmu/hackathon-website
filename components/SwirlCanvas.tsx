'use client'

import { useEffect, useRef } from 'react'

/* Soft Warm Champagne palette */
const CHAMPAGNE_PRIMARY = { r: 232, g: 222, b: 211 } // #E8DED3
const CHAMPAGNE_SECONDARY = { r: 220, g: 207, b: 195 } // #DCCFC3
const CHAMPAGNE_BLUR = 'rgba(222, 210, 196, 0.4)' // blur layers

const S = 1 / 3
const I = 1 / 6
const GRADIENTS = new Float64Array([
  1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0,
  1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1,
  0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1,
])

function floor(x: number) {
  return x | 0
}

class ParticleStore {
  itemCount: number
  propCount: number
  data: Float32Array

  constructor(itemCount: number, propCount: number) {
    this.itemCount = itemCount
    this.propCount = propCount
    this.data = new Float32Array(itemCount * propCount)
  }

  set(arr: number[], idx: number) {
    const off = idx * this.propCount
    for (let i = 0; i < arr.length; i++) this.data[off + i] = arr[i]
  }

  get(idx: number): number[] {
    const off = idx * this.propCount
    return Array.from(this.data.slice(off, off + this.propCount))
  }

  forEach(fn: (particle: number[], idx: number) => void) {
    for (let i = 0; i < this.itemCount; i++) fn(this.get(i), i)
  }

  map(fn: (_: undefined, idx: number) => number[]) {
    for (let i = 0; i < this.itemCount; i++) this.set(fn(undefined!, i), i)
  }
}

function simplex3D(perm: Uint8Array, gradR: Float64Array, gradG: Float64Array, gradB: Float64Array) {
  return (x: number, y: number, z: number): number => {
    const skew = (x + y + z) * S
    const i = floor(x + skew)
    const j = floor(y + skew)
    const k = floor(z + skew)
    const unskew = (i + j + k) * I
    const X = x - (i - unskew)
    const Y = y - (j - unskew)
    const Z = z - (k - unskew)

    const i1 = X >= Y ? (Y >= Z ? [1, 0, 0] : X >= Z ? [1, 0, 0] : [0, 0, 1]) : Y < Z ? [0, 0, 1] : X < Z ? [0, 1, 0] : [0, 1, 0]
    const j1 = X >= Y ? (Y >= Z ? [1, 1, 0] : X >= Z ? [1, 0, 1] : [0, 1, 1]) : Y < Z ? [0, 1, 1] : X < Z ? [0, 1, 1] : [1, 1, 0]
    const k1 = X >= Y ? (Y >= Z ? [1, 1, 1] : X >= Z ? [1, 1, 1] : [0, 1, 1]) : Y < Z ? [0, 1, 1] : X < Z ? [1, 1, 1] : [1, 1, 1]

    const ii = i & 255
    const jj = j & 255
    const kk = k & 255

    const contrib = (dx: number, dy: number, dz: number): number => {
      const t = 0.6 - dx * dx - dy * dy - dz * dz
      if (t < 0) return 0
      const gi = perm[ii + dx + perm[jj + dy + perm[kk + dz]]] % 12
      const t2 = t * t
      return t2 * t2 * (GRADIENTS[gi * 3] * dx + GRADIENTS[gi * 3 + 1] * dy + GRADIENTS[gi * 3 + 2] * dz)
    }

    return 32 * (
      contrib(X, Y, Z) +
      contrib(X - i1[0] + I, Y - i1[1] + I, Z - i1[2] + I) +
      contrib(X - j1[0] + 2 * I, Y - j1[1] + 2 * I, Z - j1[2] + 2 * I) +
      contrib(X - 1 + 3 * I, Y - 1 + 3 * I, Z - 1 + 3 * I)
    )
  }
}

function createSimplex(seed = Math.random) {
  const perm = new Uint8Array(512)
  for (let i = 0; i < 256; i++) perm[i] = i
  for (let i = 0; i < 255; i++) {
    const j = i + ~~(seed() * (256 - i))
    ;[perm[i], perm[j]] = [perm[j], perm[i]]
  }
  for (let i = 256; i < 512; i++) perm[i] = perm[i - 256]

  const gradR = new Float64Array(perm).map((_, i) => GRADIENTS[(perm[i] % 12) * 3])
  const gradG = new Float64Array(perm).map((_, i) => GRADIENTS[(perm[i] % 12) * 3 + 1])
  const gradB = new Float64Array(perm).map((_, i) => GRADIENTS[(perm[i] % 12) * 3 + 2])

  return simplex3D(perm, gradR, gradG, gradB)
}

function triangleWave(age: number, ttl: number): number {
  const half = ttl * 0.5
  return Math.abs((age + half) % ttl - half) / half
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const rand = (max: number) => Math.random() * max
const TAU = 2 * Math.PI

export function SwirlCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)
  const offscreenRef = useRef<CanvasRenderingContext2D | null>(null)
  const imageDataRef = useRef<ImageData | null>(null)
  const particlesRef = useRef<ParticleStore | null>(null)
  const noiseRef = useRef<((x: number, y: number, z: number) => number) | null>(null)
  const timeRef = useRef(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const boundsRef = useRef({ width: 0, height: 0, centerx: 0, centery: 0 })

  const PROPS = ['x', 'y', 'vx', 'vy', 'a', 'l', 'ttl', 'vc', 'r', 'g', 'b']

  const spawn = (): number[] => {
    const { width, height, centerx, centery } = boundsRef.current
    const edge = Math.floor(rand(4))
    let x: number, y: number

    switch (edge) {
      case 0:
        x = rand(width)
        y = -50
        break
      case 1:
        x = width + 50
        y = rand(height)
        break
      case 2:
        x = rand(width)
        y = height + 50
        break
      default:
        x = -50
        y = rand(height)
    }

    const ttl = 150 + rand(300)
    const vc = rand(17) + 3
    const dist = Math.min(
      Math.sqrt((x - centerx) ** 2 + (y - centery) ** 2) / (0.5 * Math.sqrt(width * width + height * height)),
      1
    )

    // Champagne palette: subtle variations between #E8DED3 and #DCCFC3
    const r = Math.floor(CHAMPAGNE_PRIMARY.r - 20 * dist + rand(15))
    const g = Math.floor(CHAMPAGNE_PRIMARY.g - 15 * dist + rand(12))
    const b = Math.floor(CHAMPAGNE_SECONDARY.b - 10 * dist + rand(10))

    return [x, y, 0, 0, 0, 0, ttl, vc, r, g, b]
  }

  const advect = (
    x: number,
    y: number,
    vx: number,
    vy: number,
    vc: number
  ): [number, number, number, number] => {
    const { centerx, centery } = boundsRef.current
    const noise = noiseRef.current
    if (!noise) return [x, y, vx, vy]

    const dx = x - centerx
    const dy = y - centery
    const c = Math.sqrt(dx * dx + dy * dy)
    const u = Math.atan2(dy, dx)
    const m = 8e-4 * c
    const p = u + 0.01 * timeRef.current + 0.005 * c
    const targetVx = 0.8 * Math.cos(p) + Math.cos(u) * m
    const targetVy = 0.8 * Math.sin(p) + Math.sin(u) * m

    const j = noise(0.002 * x, 0.002 * y, 5e-4 * timeRef.current) * TAU * 8
    const kx = Math.cos(j) * vc * 0.3
    const ky = Math.sin(j) * vc * 0.3

    const { x: mx, y: my } = mouseRef.current
    const sx = mx - x
    const sy = my - y
    const R = Math.sqrt(sx * sx + sy * sy)
    let I = 0,
      F = 0
    if (R < 200) {
      const angle = Math.atan2(sy, sx) + 0.5 * Math.PI
      const t = ((200 - R) / 200) * 2
      I = Math.cos(angle) * t
      F = Math.sin(angle) * t
    }

    const newVx = lerp(vx, targetVx + kx + I, 0.04)
    const newVy = lerp(vy, targetVy + ky + F, 0.04)
    return [x + newVx, y + newVy, newVx, newVy]
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w
      canvas.height = h
      boundsRef.current = { width: w, height: h, centerx: w * 0.5, centery: h * 0.5 }
      if (offscreenRef.current) {
        offscreenRef.current.canvas.width = w
        offscreenRef.current.canvas.height = h
        imageDataRef.current = offscreenRef.current.createImageData(w, h)
      }
    }

    offscreenRef.current = document.createElement('canvas').getContext('2d')
    noiseRef.current = createSimplex()
    resize()
    particlesRef.current = new ParticleStore(18000, PROPS.length)
    particlesRef.current.map(() => spawn())

    const ctx = canvas.getContext('2d')!
    const offCtx = offscreenRef.current
    const particles = particlesRef.current
    const imageData = offCtx!.createImageData(canvas.width, canvas.height)
    imageDataRef.current = imageData

    const loop = () => {
      timeRef.current++
      const { width, height } = boundsRef.current
      const o = imageDataRef.current!
      o.data.fill(0)

      particles.forEach((p, idx) => {
        let [x, y, vx, vy, age, , ttl, vc, r, g, b] = p
        age++
        const alpha = 255 * triangleWave(age, ttl)

        if (age >= ttl || y < -100 || y > height + 100 || x < -100 || x > width + 100) {
          particles.set(spawn(), idx)
          return
        }

        const [nx, ny, nvx, nvy] = advect(x, y, vx, vy, vc)
        particles.set([nx, ny, nvx, nvy, age, 0, ttl, vc, r, g, b], idx)

        const ix = x | 0
        const iy = y | 0
        if (ix >= 0 && ix < width && iy >= 0 && iy < height) {
          const lifeRatio = age / ttl
          const speedFactor = Math.min(0.08 * Math.sqrt(nvx * nvx + nvy * nvy), 1)
          const blend = 0.4 * lifeRatio + 0.6 * speedFactor
          const extra = 30 * Math.sin(lifeRatio * Math.PI)
          const R = Math.min(255, Math.max(0, Math.floor(r * (1 + 0.3 * blend) + extra + 25 * speedFactor)))
          const G = Math.min(255, Math.max(0, Math.floor(g * (1 + 0.2 * blend) + extra + 20 * speedFactor)))
          const B = Math.min(255, Math.max(0, Math.floor(b * (1 + 0.4 * blend) + extra + 30 * speedFactor)))
          const A = alpha
          const i = 4 * (ix + iy * width)
          o.data[i] = R
          o.data[i + 1] = G
          o.data[i + 2] = B
          o.data[i + 3] = A
        }
      })

      offCtx!.putImageData(o, 0, 0)

      // Fade for trails — use champagne-tinted fade instead of black
      ctx.fillStyle = CHAMPAGNE_BLUR
      ctx.fillRect(0, 0, width, height)

      // Glow compositing — softer for premium champagne look
      ctx.save()
      ctx.filter = 'blur(4px) brightness(110%)'
      ctx.globalAlpha = 0.6
      ctx.drawImage(offCtx!.canvas, 0, 0)
      ctx.globalCompositeOperation = 'lighter'
      ctx.filter = 'saturate(120%)'
      ctx.globalAlpha = 0.4
      ctx.drawImage(offCtx!.canvas, 0, 0)
      ctx.restore()

      frameRef.current = requestAnimationFrame(loop)
    }

    loop()

    const onResize = () => {
      resize()
    }
    const onMouseMove = (e: MouseEvent) => {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMouseMove)

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ background: 'transparent' }}
      aria-hidden
    />
  )
}
