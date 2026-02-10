import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  background?: 'white' | 'orange' | 'purple'
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  background = 'white' 
}) => {
  const backgroundStyles = {
    white: 'bg-white shadow-lg',
    orange: 'bg-gradient-orange',
    purple: 'bg-purple-100'
  }

  return (
    <div className={`rounded-2xl p-8 ${backgroundStyles[background]} ${className}`}>
      {children}
    </div>
  )
}
