'use client'

import { useEffect, useRef } from 'react'

/* Deep burnt orange palette — no yellow push */
const ORANGE_PRIMARY = { r: 185, g: 60, b: 5 }  // #B93C05 deep burnt orange
const ORANGE_WARM   = { r: 210, g: 75, b: 10 }  // #D24B0A warm rust

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

/** 3D Simplex noise — returns value in ~[-1, 1] for organic swirl direction */
function createSimplex(seed = Math.random) {
  const p = new Uint8Array(512)
  for (let i = 0; i < 256; i++) p[i] = i
  for (let i = 255; i > 0; i--) {
    const j = ~~(seed() * (i + 1))
    ;[p[i], p[j]] = [p[j], p[i]]
  }
  for (let i = 256; i < 512; i++) p[i] = p[i - 256]

  const grad3 = [
    [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
    [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
    [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1],
  ]

  return (x: number, y: number, z: number): number => {
    const F3 = 1 / 3
    const s = (x + y + z) * F3
    const i = floor(x + s)
    const j = floor(y + s)
    const k = floor(z + s)
    const G3 = 1 / 6
    const t = (i + j + k) * G3
    const X0 = x - i + t
    const Y0 = y - j + t
    const Z0 = z - k + t

    let i1: number, j1: number, k1
    let i2: number, j2: number, k2
    if (X0 >= Y0) {
      if (Y0 >= Z0) {
        i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0
      } else if (X0 >= Z0) {
        i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1
      } else {
        i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1
      }
    } else {
      if (Y0 < Z0) {
        i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1
      } else if (X0 < Z0) {
        i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1
      } else {
        i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0
      }
    }

    const ii = i & 255
    const jj = j & 255
    const kk = k & 255

    const dot = (g: number[], x: number, y: number, z: number) => g[0] * x + g[1] * y + g[2] * z

    const contrib = (x: number, y: number, z: number, gi: number): number => {
      const t = 0.6 - x * x - y * y - z * z
      if (t < 0) return 0
      const t2 = t * t
      return t2 * t2 * dot(grad3[gi], x, y, z)
    }

    const gi0 = p[ii + p[jj + p[kk]]] % 12
    const gi1 = p[ii + i1 + p[jj + j1 + p[kk + k1]]] % 12
    const gi2 = p[ii + i2 + p[jj + j2 + p[kk + k2]]] % 12
    const gi3 = p[ii + 1 + p[jj + 1 + p[kk + 1]]] % 12

    const x1 = X0 - i1 + G3
    const y1 = Y0 - j1 + G3
    const z1 = Z0 - k1 + G3
    const x2 = X0 - i2 + 2 * G3
    const y2 = Y0 - j2 + 2 * G3
    const z2 = Z0 - k2 + 2 * G3
    const x3 = X0 - 1 + 3 * G3
    const y3 = Y0 - 1 + 3 * G3
    const z3 = Z0 - 1 + 3 * G3

    return 32 * (
      contrib(X0, Y0, Z0, gi0) +
      contrib(x1, y1, z1, gi1) +
      contrib(x2, y2, z2, gi2) +
      contrib(x3, y3, z3, gi3)
    )
  }
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

    // Orange palette: Felicis orange with warm variations
    const r = Math.floor(ORANGE_PRIMARY.r + (ORANGE_WARM.r - ORANGE_PRIMARY.r) * dist + rand(25))
    const g = Math.floor(ORANGE_PRIMARY.g + (ORANGE_WARM.g - ORANGE_PRIMARY.g) * dist + rand(20))
    const b = Math.floor(ORANGE_PRIMARY.b + (ORANGE_WARM.b - ORANGE_PRIMARY.b) * dist + rand(15))

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
          // Minimal brightness boost — keep orange, not yellow
          const extra = 8 * Math.sin(lifeRatio * Math.PI)
          const R = Math.min(255, Math.max(0, Math.floor(r * (1 + 0.3 * blend) + extra + 18 * speedFactor)))
          const G = Math.min(255, Math.max(0, Math.floor(g * (1 + 0.15 * blend) + extra +  6 * speedFactor)))
          const B = Math.min(255, Math.max(0, Math.floor(b * (1 + 0.1  * blend)            +  3 * speedFactor)))
          const A = Math.min(255, Math.floor(alpha * 1.1))
          const i = 4 * (ix + iy * width)
          o.data[i] = R
          o.data[i + 1] = G
          o.data[i + 2] = B
          o.data[i + 3] = A
        }
      })

      offCtx!.putImageData(o, 0, 0)

      // Fade trails by reducing pixel alpha → transparent (reveals gradient behind)
      ctx.save()
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = 'rgba(0, 0, 0, 0.16)'
      ctx.fillRect(0, 0, width, height)
      ctx.restore()

      // Draw particles with soft glow
      ctx.save()
      ctx.filter = 'blur(2px) brightness(115%)'
      ctx.globalAlpha = 0.9
      ctx.drawImage(offCtx!.canvas, 0, 0)
      ctx.restore()

      // Additive glow pass for ember effect
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      ctx.filter = 'saturate(140%) blur(1px)'
      ctx.globalAlpha = 0.45
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
      className="fixed inset-0 w-full h-full pointer-events-none -z-10"
      style={{ background: 'transparent' }}
      aria-hidden
    />
  )
}
