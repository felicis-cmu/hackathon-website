import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'outline'
  className?: string
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'outline',
  className = '' 
}) => {
  const baseStyles = "glass-tab px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base group focus:outline-none"
  
  const variantStyles = {
    primary: "glass-tab-active",
    outline: ""
  }

  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
      <svg 
        width="20" 
        height="20" 
        viewBox="0 0 20 20" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform group-hover:translate-x-1 flex-shrink-0"
      >
        <path 
          d="M7.5 15L12.5 10L7.5 5" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
