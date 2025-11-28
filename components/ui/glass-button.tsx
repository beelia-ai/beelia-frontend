'use client'

import React, { useEffect, useRef, useState, useId, forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
  borderRadius?: number
  borderWidth?: number
  brightness?: number
  blur?: number
  isLoading?: boolean
}

const useDarkMode = () => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDark(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return isDark
}

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    {
      children,
      className,
      size = 'md',
      borderRadius = 12,
      borderWidth = 0.07,
      brightness = 50,
      blur = 11,
      isLoading,
      disabled,
      ...props
    },
    ref
  ) => {
    const uniqueId = useId().replace(/:/g, '-')
    const filterId = `glass-btn-filter-${uniqueId}`
    const redGradId = `glass-btn-red-${uniqueId}`
    const blueGradId = `glass-btn-blue-${uniqueId}`

    const containerRef = useRef<HTMLDivElement>(null)
    const feImageRef = useRef<SVGFEImageElement>(null)
    const redChannelRef = useRef<SVGFEDisplacementMapElement>(null)
    const greenChannelRef = useRef<SVGFEDisplacementMapElement>(null)
    const blueChannelRef = useRef<SVGFEDisplacementMapElement>(null)

    const isDarkMode = useDarkMode()

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    }

    const generateDisplacementMap = () => {
      const rect = containerRef.current?.getBoundingClientRect()
      const actualWidth = rect?.width || 120
      const actualHeight = rect?.height || 40
      const edgeSize = Math.min(actualWidth, actualHeight) * (borderWidth * 0.5)

      const svgContent = `
        <svg viewBox="0 0 ${actualWidth} ${actualHeight}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stop-color="#0000"/>
              <stop offset="100%" stop-color="red"/>
            </linearGradient>
            <linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#0000"/>
              <stop offset="100%" stop-color="blue"/>
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" fill="black"></rect>
          <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${borderRadius}" fill="url(#${redGradId})" />
          <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${borderRadius}" fill="url(#${blueGradId})" style="mix-blend-mode: difference" />
          <rect x="${edgeSize}" y="${edgeSize}" width="${actualWidth - edgeSize * 2}" height="${actualHeight - edgeSize * 2}" rx="${borderRadius}" fill="hsl(0 0% ${brightness}% / 0.93)" style="filter:blur(${blur}px)" />
        </svg>
      `

      return `data:image/svg+xml,${encodeURIComponent(svgContent)}`
    }

    const updateDisplacementMap = () => {
      feImageRef.current?.setAttribute('href', generateDisplacementMap())
    }

    useEffect(() => {
      updateDisplacementMap()
      ;[
        { ref: redChannelRef, offset: 0 },
        { ref: greenChannelRef, offset: 10 },
        { ref: blueChannelRef, offset: 20 },
      ].forEach(({ ref, offset }) => {
        if (ref.current) {
          ref.current.setAttribute('scale', (-180 + offset).toString())
          ref.current.setAttribute('xChannelSelector', 'R')
          ref.current.setAttribute('yChannelSelector', 'G')
        }
      })
    }, [borderRadius, borderWidth, brightness, blur])

    useEffect(() => {
      if (!containerRef.current) return

      const resizeObserver = new ResizeObserver(() => {
        setTimeout(updateDisplacementMap, 0)
      })

      resizeObserver.observe(containerRef.current)
      return () => resizeObserver.disconnect()
    }, [])

    const supportsSVGFilters = () => {
      if (typeof window === 'undefined') return false
      const isWebkit = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
      const isFirefox = /Firefox/.test(navigator.userAgent)
      return !(isWebkit || isFirefox)
    }

    const getButtonStyles = (): React.CSSProperties => {
      const baseStyles: React.CSSProperties = {
        borderRadius: `${borderRadius}px`,
      }

      if (supportsSVGFilters()) {
        return {
          ...baseStyles,
          background: isDarkMode ? 'hsl(0 0% 0% / 0)' : 'hsl(0 0% 100% / 0)',
          backdropFilter: `url(#${filterId}) saturate(1)`,
          boxShadow: isDarkMode
            ? `0 0 2px 1px color-mix(in oklch, white, transparent 65%) inset,
               0 0 10px 4px color-mix(in oklch, white, transparent 85%) inset`
            : `0 0 2px 1px color-mix(in oklch, black, transparent 85%) inset,
               0 0 10px 4px color-mix(in oklch, black, transparent 90%) inset`,
        }
      }

      // Fallback for Safari/Firefox
      return {
        ...baseStyles,
        background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(12px) saturate(1.8) brightness(1.1)',
        WebkitBackdropFilter: 'blur(12px) saturate(1.8) brightness(1.1)',
        border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: isDarkMode
          ? `inset 0 1px 0 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 0 rgba(255, 255, 255, 0.1)`
          : `0 8px 32px 0 rgba(31, 38, 135, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.4)`,
      }
    }

    return (
      <div ref={containerRef} className="inline-block">
        <motion.button
          ref={ref}
          className={cn(
            'group relative inline-flex items-center justify-center font-medium',
            'text-white transition-colors duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
            'disabled:pointer-events-none disabled:opacity-50',
            'hover:bg-white/10',
            sizes[size],
            className
          )}
          style={getButtonStyles()}
          disabled={disabled || isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          {...(props as any)}
        >
          {/* SVG Filter Definition */}
          <svg
            className="w-0 h-0 absolute pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id={filterId} colorInterpolationFilters="sRGB" x="0%" y="0%" width="100%" height="100%">
                <feImage ref={feImageRef} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />
                <feDisplacementMap ref={redChannelRef} in="SourceGraphic" in2="map" result="dispRed" />
                <feColorMatrix
                  in="dispRed"
                  type="matrix"
                  values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                  result="red"
                />
                <feDisplacementMap ref={greenChannelRef} in="SourceGraphic" in2="map" result="dispGreen" />
                <feColorMatrix
                  in="dispGreen"
                  type="matrix"
                  values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
                  result="green"
                />
                <feDisplacementMap ref={blueChannelRef} in="SourceGraphic" in2="map" result="dispBlue" />
                <feColorMatrix
                  in="dispBlue"
                  type="matrix"
                  values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
                  result="blue"
                />
                <feBlend in="red" in2="green" mode="screen" result="rg" />
                <feBlend in="rg" in2="blue" mode="screen" result="output" />
                <feGaussianBlur in="output" stdDeviation="0.7" />
              </filter>
            </defs>
          </svg>

          {/* Button Content */}
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
        </motion.button>
      </div>
    )
  }
)

GlassButton.displayName = 'GlassButton'

