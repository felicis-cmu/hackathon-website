import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  background?: 'white' | 'orange' | 'purple'
  variant?: 'default' | 'glass-card' | 'glass-panel' | 'glass-context'
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  background = 'white',
  variant = 'default'
}) => {
  const backgroundStyles = {
    white: 'bg-white shadow-lg',
    orange: 'bg-gradient-orange',
    purple: 'bg-purple-100'
  }

  const variantStyles = {
    default: '',
    'glass-card': 'glass-shot-card',
    'glass-panel': 'liquid-panel',
    'glass-context': 'glass-context'
  }

  // Use variant if specified, otherwise use background
  const appliedClass = variant !== 'default' 
    ? variantStyles[variant]
    : backgroundStyles[background]

  return (
    <div className={`rounded-2xl p-8 ${appliedClass} ${className}`}>
      {children}
    </div>
  )
}
