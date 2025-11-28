'use client'

import React, { useRef, useState, useId, forwardRef, useEffect } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface LiquidGlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  borderRadius?: number
  isLoading?: boolean
  /** Refraction strength (displacement amount) */
  refraction?: number
  /** Chromatic aberration amount */
  chromaticAberration?: number
  /** Animation speed */
  animationSpeed?: number
}

export const LiquidGlassButton = forwardRef<HTMLButtonElement, LiquidGlassButtonProps>(
  (
    {
      children,
      className,
      borderRadius = 50,
      isLoading,
      disabled,
      refraction = 20,
      chromaticAberration = 3,
      animationSpeed = 4,
      ...props
    },
    ref
  ) => {
    const uniqueId = useId().replaceAll(':', '-')
    const buttonRef = useRef<HTMLButtonElement>(null)
    const [isHovered, setIsHovered] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    // Mouse tracking for dynamic refraction
    const mouseX = useMotionValue(0.5)
    const mouseY = useMotionValue(0.5)
    const springConfig = { damping: 20, stiffness: 200 }
    const smoothX = useSpring(mouseX, springConfig)
    const smoothY = useSpring(mouseY, springConfig)

    // Filter IDs
    const refractionFilterId = `refraction-${uniqueId}`
    const chromaticFilterId = `chromatic-${uniqueId}`
    const combinedFilterId = `combined-${uniqueId}`

    useEffect(() => {
      setIsMounted(true)
    }, [])

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!buttonRef.current) return
      const rect = buttonRef.current.getBoundingClientRect()
      mouseX.set((e.clientX - rect.left) / rect.width)
      mouseY.set((e.clientY - rect.top) / rect.height)
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
      mouseX.set(0.5)
      mouseY.set(0.5)
    }

    // Dynamic displacement based on hover
    const currentRefraction = isHovered ? refraction * 1.5 : refraction

    return (
      <>
        {/* Global SVG Filters - must be in DOM */}
        <svg 
          className="absolute w-0 h-0 overflow-hidden" 
          aria-hidden="true"
          style={{ position: 'absolute', width: 0, height: 0 }}
        >
          <defs>
            {/* Main refraction filter with animated turbulence */}
            <filter 
              id={refractionFilterId} 
              x="-50%" 
              y="-50%" 
              width="200%" 
              height="200%"
              colorInterpolationFilters="sRGB"
            >
              {/* Animated noise for liquid effect */}
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.015"
                numOctaves="3"
                seed="1"
                result="noise"
              >
                {isMounted && (
                  <animate
                    attributeName="baseFrequency"
                    values="0.01;0.02;0.015;0.01"
                    dur={`${animationSpeed}s`}
                    repeatCount="indefinite"
                  />
                )}
              </feTurbulence>
              
              {/* Displacement for refraction */}
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale={currentRefraction}
                xChannelSelector="R"
                yChannelSelector="G"
                result="displaced"
              />
            </filter>

            {/* Chromatic aberration filter */}
            <filter 
              id={chromaticFilterId}
              x="-10%" 
              y="-10%" 
              width="120%" 
              height="120%"
              colorInterpolationFilters="sRGB"
            >
              {/* Red channel - shifted left */}
              <feOffset in="SourceGraphic" dx={-chromaticAberration} dy="0" result="red-shift" />
              <feColorMatrix
                in="red-shift"
                type="matrix"
                values="1 0 0 0 0
                        0 0 0 0 0
                        0 0 0 0 0
                        0 0 0 1 0"
                result="red"
              />
              
              {/* Green channel - center */}
              <feColorMatrix
                in="SourceGraphic"
                type="matrix"
                values="0 0 0 0 0
                        0 1 0 0 0
                        0 0 0 0 0
                        0 0 0 1 0"
                result="green"
              />
              
              {/* Blue channel - shifted right */}
              <feOffset in="SourceGraphic" dx={chromaticAberration} dy="0" result="blue-shift" />
              <feColorMatrix
                in="blue-shift"
                type="matrix"
                values="0 0 0 0 0
                        0 0 0 0 0
                        0 0 1 0 0
                        0 0 0 1 0"
                result="blue"
              />
              
              {/* Combine RGB channels */}
              <feBlend in="red" in2="green" mode="screen" result="rg" />
              <feBlend in="rg" in2="blue" mode="screen" result="rgb" />
            </filter>

            {/* Combined filter: refraction + chromatic aberration */}
            <filter 
              id={combinedFilterId}
              x="-50%" 
              y="-50%" 
              width="200%" 
              height="200%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.012"
                numOctaves="4"
                seed="2"
                result="noise"
              >
                {isMounted && (
                  <animate
                    attributeName="seed"
                    values="1;5;10;5;1"
                    dur={`${animationSpeed * 2}s`}
                    repeatCount="indefinite"
                  />
                )}
              </feTurbulence>
              
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale={currentRefraction}
                xChannelSelector="R"
                yChannelSelector="G"
                result="refracted"
              />
              
              {/* Apply subtle chromatic split to refracted image */}
              <feOffset in="refracted" dx={-chromaticAberration * 0.5} result="r-off" />
              <feOffset in="refracted" dx={chromaticAberration * 0.5} result="b-off" />
              
              <feColorMatrix in="r-off" type="matrix"
                values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0" result="r" />
              <feColorMatrix in="refracted" type="matrix"
                values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 0.5 0" result="g" />
              <feColorMatrix in="b-off" type="matrix"
                values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 0.5 0" result="b" />
              
              <feBlend in="r" in2="g" mode="screen" result="rg" />
              <feBlend in="rg" in2="b" mode="screen" />
            </filter>
          </defs>
        </svg>

        <motion.button
          ref={(node) => {
            buttonRef.current = node
            if (typeof ref === 'function') ref(node)
            else if (ref) ref.current = node
          }}
          className={cn(
            'group relative inline-flex items-center justify-center',
            'text-white font-medium cursor-pointer',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2',
            'disabled:pointer-events-none disabled:opacity-50',
            className
          )}
          style={{ borderRadius: `${borderRadius}px` }}
          disabled={disabled || isLoading}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          {...(props as React.ComponentProps<typeof motion.button>)}
        >
          {/* Refraction layer - this is the key! */}
          <div 
            className="absolute inset-0 overflow-hidden"
            style={{
              borderRadius: `${borderRadius}px`,
              backdropFilter: `url(#${combinedFilterId})`,
              WebkitBackdropFilter: `url(#${combinedFilterId})`,
            }}
          />

          {/* Very subtle border for definition */}
          <motion.div 
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: `${borderRadius}px`,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: isHovered 
                ? 'inset 0 0 20px rgba(255, 255, 255, 0.05)'
                : 'none'
            }}
            animate={{
              borderColor: isHovered 
                ? 'rgba(255, 255, 255, 0.2)' 
                : 'rgba(255, 255, 255, 0.1)'
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Highlight reflection */}
          <motion.div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{ borderRadius: `${borderRadius}px` }}
          >
            <motion.div
              className="absolute w-full h-[200%] -top-full"
              style={{
                background: 'linear-gradient(180deg, transparent 40%, rgba(255,255,255,0.03) 50%, transparent 60%)',
                x: useTransform(smoothX, [0, 1], ['-20%', '20%']),
                y: useTransform(smoothY, [0, 1], ['-10%', '10%']),
              }}
            />
          </motion.div>

          {/* Button Content */}
          <span className="relative z-10 flex items-center justify-center">
            {isLoading ? (
              <span className="flex items-center">
                <motion.svg
                  className="mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </motion.svg>
                Loading...
              </span>
            ) : (
              children
            )}
          </span>
        </motion.button>
      </>
    )
  }
)

LiquidGlassButton.displayName = 'LiquidGlassButton'
