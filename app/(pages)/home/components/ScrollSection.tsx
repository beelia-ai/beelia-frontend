'use client'

import { ReactNode, createContext, useContext, useMemo, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'

// Context to share scroll progress
interface ScrollContextType {
  scrollYProgress: MotionValue<number>
  isMounted: boolean
}

const ScrollContext = createContext<ScrollContextType | null>(null)

// Simple scroll container
interface ScrollContainerProps {
  children: ReactNode
}

export function ScrollContainer({ children }: ScrollContainerProps) {
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  // Direct scroll progress - no spring for better performance
  const { scrollYProgress } = useScroll()
  
  const contextValue = useMemo(() => ({ 
    scrollYProgress, 
    isMounted
  }), [scrollYProgress, isMounted])
  
  return (
    <ScrollContext.Provider value={contextValue}>
      <div className="relative">
        {children}
      </div>
    </ScrollContext.Provider>
  )
}

// Hero Section - Fixed, fades out as you scroll
function HeroSection({ children, className }: { children: ReactNode, className: string }) {
  const context = useContext(ScrollContext)
  const scrollYProgress = context?.scrollYProgress
  
  const heroScale = useTransform(
    scrollYProgress ?? new MotionValue(0), 
    [0, 0.2, 0.35], 
    [1, 0.98, 0.92]
  )
  const heroOpacity = useTransform(
    scrollYProgress ?? new MotionValue(0), 
    [0, 0.15, 0.3], 
    [1, 0.7, 0]
  )
  const heroY = useTransform(
    scrollYProgress ?? new MotionValue(0),
    [0, 0.35],
    ['0%', '-8%']
  )
  const heroBlur = useTransform(
    scrollYProgress ?? new MotionValue(0),
    [0.15, 0.3],
    [0, 6]
  )
  const heroFilter = useTransform(heroBlur, (v) => `blur(${v}px)`)
  
  return (
    <>
      {/* Spacer - pushes content down */}
      <div style={{ height: '100vh' }} />
      
      {/* Fixed hero */}
      <motion.div
        className={`fixed top-0 left-0 right-0 h-screen overflow-hidden ${className}`}
        style={{ 
          scale: heroScale,
          opacity: heroOpacity,
          y: heroY,
          filter: heroFilter,
          zIndex: 1,
          transformPerspective: 1000,
          transformOrigin: 'center top',
          willChange: 'transform, opacity, filter',
        }}
      >
        {children}
      </motion.div>
    </>
  )
}

// Regular Section - Just scrolls naturally with the page
function RegularSection({ 
  children, 
  index, 
  className, 
  height 
}: { 
  children: ReactNode
  index: number
  className: string
  height: string
}) {
  return (
    <section
      className={`relative ${className}`}
      style={{ 
        zIndex: index + 10,
        minHeight: height === 'auto' ? 'auto' : height,
      }}
    >
      {children}
    </section>
  )
}

// Individual scroll section
interface ScrollSectionProps {
  children: ReactNode
  index: number
  className?: string
  height?: string
}

export function ScrollSection({ 
  children, 
  index, 
  className = '',
  height = '100vh'
}: ScrollSectionProps) {
  // Hero (index 0) - fixed with effects
  if (index === 0) {
    return <HeroSection className={className}>{children}</HeroSection>
  }
  
  // All other sections - just scroll naturally
  return (
    <RegularSection index={index} className={className} height={height}>
      {children}
    </RegularSection>
  )
}
