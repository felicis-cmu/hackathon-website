'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface CustomSelectProps {
  id: string
  value: string
  options: string[]
  placeholder?: string
  onChange: (value: string) => void
  hasError?: boolean
  label: string
}

export function CustomSelect({
  id,
  value,
  options,
  placeholder = 'Select...',
  onChange,
  hasError = false,
  label,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownStyle, setDropdownStyle] = useState({ top: 0, left: 0, width: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updatePosition = () => {
      if (triggerRef.current && typeof document !== 'undefined') {
        const rect = triggerRef.current.getBoundingClientRect()
        setDropdownStyle({
          top: rect.bottom + 4,
          left: rect.left,
          width: rect.width,
        })
      }
    }

    if (isOpen) {
      updatePosition()
      window.addEventListener('scroll', updatePosition, true)
      window.addEventListener('resize', updatePosition)
      return () => {
        window.removeEventListener('scroll', updatePosition, true)
        window.removeEventListener('resize', updatePosition)
      }
    }
  }, [isOpen])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        !document.getElementById(`custom-select-dropdown-${id}`)?.contains(target)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [id])

  const dropdownContent = isOpen && (
    <div
      id={`custom-select-dropdown-${id}`}
      className="fixed rounded-xl border border-gray-200 shadow-xl max-h-48 overflow-hidden"
      style={{
        top: dropdownStyle.top,
        left: dropdownStyle.left,
        width: dropdownStyle.width,
        zIndex: 9999,
        backgroundColor: '#ffffff',
      }}
    >
      <div
        className="overflow-y-auto max-h-48 py-1 custom-scrollbar"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#d1d5db #ffffff',
        }}
      >
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => {
              onChange(opt)
              setIsOpen(false)
            }}
            className="w-full px-4 py-3 text-sm text-left transition-colors"
            style={{
              backgroundColor: value === opt ? '#F5EDE0' : '#ffffff',
              color: value === opt ? '#C96824' : '#111827',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = value === opt ? '#F5EDE0' : '#f9fafb'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = value === opt ? '#F5EDE0' : '#ffffff'
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={id}>
        {label}
      </label>
      <button
        ref={triggerRef}
        type="button"
        id={id}
        onClick={() => setIsOpen((o) => !o)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border bg-white text-sm text-left transition-colors ${
          hasError
            ? 'border-red-500 focus:ring-2 focus:ring-red-500'
            : 'border-gray-200 focus:ring-2 focus:ring-felicis-orange focus:border-transparent'
        } outline-none`}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>{value || placeholder}</span>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {typeof document !== 'undefined' && createPortal(dropdownContent, document.body)}
    </div>
  )
}
