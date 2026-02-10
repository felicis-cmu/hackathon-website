'use client'

import { useState, useEffect, useCallback } from 'react'

const VAR_DEFS: {
  key: string
  label: string
  min: number
  max: number
  step: number
  unit?: string
}[] = [
  { key: 'glass-frost-blur', label: 'Frost blur', min: 0, max: 30, step: 1, unit: 'px' },
  { key: 'glass-tint-opacity', label: 'Tint opacity', min: 0, max: 1, step: 0.01 },
  { key: 'glass-inner-shadow-blur', label: 'Inner shadow blur', min: 0, max: 30, step: 1, unit: 'px' },
  { key: 'glass-inner-shadow-spread', label: 'Inner shadow spread', min: -20, max: 10, step: 1, unit: 'px' },
  { key: 'glass-inner-shadow-opacity', label: 'Inner shadow opacity', min: 0, max: 0.5, step: 0.01 },
  { key: 'glass-border-opacity', label: 'Border opacity', min: 0, max: 0.5, step: 0.01 },
  { key: 'glass-specular-opacity', label: 'Specular opacity', min: 0, max: 0.5, step: 0.01 },
  { key: 'glass-shimmer-opacity', label: 'Shimmer opacity', min: 0, max: 0.3, step: 0.01 },
  { key: 'glass-toolbar-blur', label: 'Toolbar blur', min: 5, max: 40, step: 1, unit: 'px' },
  { key: 'glass-pill-frost-blur', label: 'Pill frost blur', min: 0, max: 15, step: 0.5, unit: 'px' },
  { key: 'glass-pill-tint-opacity', label: 'Pill tint opacity', min: 0, max: 0.3, step: 0.01 },
  { key: 'glass-pill-inner-shadow-blur', label: 'Pill inner shadow blur', min: 0, max: 30, step: 1, unit: 'px' },
  { key: 'glass-pill-inner-shadow-spread', label: 'Pill inner shadow spread', min: -15, max: 5, step: 1, unit: 'px' },
]

const DEFAULTS: Record<string, number> = {
  'glass-frost-blur': 14,
  'glass-tint-opacity': 0.65,
  'glass-inner-shadow-blur': 12,
  'glass-inner-shadow-spread': -6,
  'glass-inner-shadow-opacity': 0.1,
  'glass-border-opacity': 0.18,
  'glass-specular-opacity': 0.2,
  'glass-shimmer-opacity': 0.08,
  'glass-toolbar-blur': 20,
  'glass-pill-frost-blur': 2,
  'glass-pill-tint-opacity': 0.08,
  'glass-pill-inner-shadow-blur': 20,
  'glass-pill-inner-shadow-spread': -5,
}

function getInitialValues(): Record<string, number> {
  if (typeof document === 'undefined') return { ...DEFAULTS }
  const root = document.documentElement
  const style = getComputedStyle(root)
  const out: Record<string, number> = {}
  for (const def of VAR_DEFS) {
    const raw = style.getPropertyValue(`--${def.key}`).trim()
    if (raw !== '') {
      const n = parseFloat(raw)
      if (!Number.isNaN(n)) out[def.key] = n
    }
    if (out[def.key] === undefined) out[def.key] = DEFAULTS[def.key]
  }
  return out
}

function setRootVar(key: string, value: number) {
  if (typeof document === 'undefined') return
  document.documentElement.style.setProperty(`--${key}`, String(value))
}

export function LiquidGlassTuner() {
  const [values, setValues] = useState<Record<string, number>>(DEFAULTS)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setValues(getInitialValues())
    setMounted(true)
  }, [])

  const handleChange = useCallback((key: string, value: number) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setRootVar(key, value)
  }, [])

  const resetToDefaults = useCallback(() => {
    setValues({ ...DEFAULTS })
    Object.entries(DEFAULTS).forEach(([k, v]) => setRootVar(k, v))
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed top-4 right-4 z-[100] w-[280px] max-h-[85vh] overflow-y-auto rounded-2xl border border-gray-200/50 bg-white/90 backdrop-blur-md shadow-xl p-4">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">Liquid glass</h3>
        <button
          type="button"
          onClick={resetToDefaults}
          className="text-xs text-gray-500 hover:text-gray-900"
        >
          Reset
        </button>
      </div>
      <div className="space-y-3">
        {VAR_DEFS.map((def) => {
          const value = values[def.key] ?? DEFAULTS[def.key]
          const display =
            def.unit === 'px'
              ? value.toFixed(value % 1 === 0 ? 0 : 1)
              : value.toFixed(2)
          return (
            <div key={def.key} className="space-y-1">
              <div className="flex justify-between items-baseline gap-2">
                <label className="text-xs text-gray-600 truncate" htmlFor={def.key}>
                  {def.label}
                </label>
                <span className="text-xs font-mono text-gray-800 tabular-nums shrink-0">
                  {display}
                  {def.unit ?? ''}
                </span>
              </div>
              <input
                id={def.key}
                type="range"
                min={def.min}
                max={def.max}
                step={def.step}
                value={value}
                onChange={(e) => handleChange(def.key, parseFloat(e.target.value))}
                className="w-full h-1.5 accent-gray-700"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
