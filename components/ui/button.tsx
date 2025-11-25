'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, isLoading, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group'
    
    const variants = {
      primary: 'bg-black text-white border-2 border-black focus-visible:ring-gray-500',
      secondary: 'bg-white text-black border-2 border-white focus-visible:ring-gray-500',
      outline: 'border-2 border-white text-white focus-visible:ring-gray-500',
      ghost: 'text-white border-2 border-transparent focus-visible:ring-gray-500',
      danger: 'bg-red-600 text-white border-2 border-red-600 focus-visible:ring-red-500',
    }
    
    const fillColors = {
      primary: 'white',
      secondary: 'black',
      outline: 'white',
      ghost: 'rgba(255, 255, 255, 0.1)',
      danger: 'transparent',
    }
    
    const textColors = {
      primary: 'group-hover:text-black',
      secondary: 'group-hover:text-white',
      outline: 'group-hover:text-black',
      ghost: 'group-hover:text-white',
      danger: 'group-hover:text-red-600',
    }
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    }
    
    return (
      <motion.button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        {...(props as any)}
      >
        {/* Animated fill background - scales from center */}
        <span 
          className="absolute inset-0 z-0 scale-0 group-hover:scale-100 transition-transform duration-300 ease-out origin-center"
          style={{ background: fillColors[variant] }}
        />
        
        {/* Content */}
        <span className={cn("relative z-10 flex items-center justify-center transition-colors duration-300", textColors[variant])}>
          {isLoading ? (
            <>
              <motion.svg 
                className="mr-2 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </motion.svg>
              Loading...
            </>
          ) : (
            children
          )}
        </span>
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
