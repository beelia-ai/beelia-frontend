'use client'

import { ReactNode, createContext, useContext, useMemo, useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion'

// Context to share scroll progress between sections
interface ScrollContextType {
  scrollYProgress: MotionValue<number>
  totalSections: number
  isMounted: boolean
}

const ScrollContext = createContext<ScrollContextType | null>(null)

// Wrapper for all scroll sections
interface ScrollContainerProps {
  children: ReactNode
  totalSections: number
}

export function ScrollContainer({ children, totalSections }: ScrollContainerProps) {
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  // Use window scroll
  const { scrollYProgress } = useScroll()
  
  // Smooth spring physics for buttery animations
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })
  
  const contextValue = useMemo(() => ({ 
    scrollYProgress: smoothProgress, 
    totalSections,
    isMounted
  }), [smoothProgress, totalSections, isMounted])
  
  return (
    <ScrollContext.Provider value={contextValue}>
      <div className="relative">
        {children}
      </div>
    </ScrollContext.Provider>
  )
}

// Hero Section Component - Fixed, fades out
function HeroSection({ children, className }: { children: ReactNode, className: string }) {
  const context = useContext(ScrollContext)
  const scrollYProgress = context?.scrollYProgress
  
  const heroScale = useTransform(
    scrollYProgress ?? new MotionValue(0), 
    [0, 0.15, 0.35], 
    [1, 0.98, 0.85]
  )
  const heroOpacity = useTransform(
    scrollYProgress ?? new MotionValue(0), 
    [0, 0.2, 0.35], 
    [1, 0.8, 0]
  )
  const heroY = useTransform(
    scrollYProgress ?? new MotionValue(0),
    [0, 0.35],
    ['0%', '-10%']
  )
  const heroBlur = useTransform(
    scrollYProgress ?? new MotionValue(0),
    [0.15, 0.35],
    [0, 8]
  )
  const heroRotateX = useTransform(
    scrollYProgress ?? new MotionValue(0),
    [0, 0.35],
    [0, 5]
  )
  const heroFilter = useTransform(heroBlur, (v) => `blur(${v}px)`)
  
  return (
    <>
      {/* Spacer for scroll height */}
      <div style={{ height: '100vh' }} />
      
      {/* Fixed hero */}
      <motion.div
        className={`fixed top-0 left-0 right-0 h-screen overflow-hidden ${className}`}
        style={{ 
          scale: heroScale,
          opacity: heroOpacity,
          y: heroY,
          rotateX: heroRotateX,
          filter: heroFilter,
          zIndex: 1,
          transformPerspective: 1200,
          transformOrigin: 'center top',
        }}
      >
        {children}
      </motion.div>
    </>
  )
}

// Card Section Component - Slides up and covers previous section
function CardSection({ 
  children, 
  index, 
  className, 
  height,
  isLast
}: { 
  children: ReactNode
  index: number
  className: string
  height: string
  isLast: boolean
}) {
  const sectionRef = useRef<HTMLDivElement>(null)
  
  // Track this section's scroll progress
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: isLast ? ["start end", "start 20%"] : ["start end", "start start"]
  })
  
  // Smooth the progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  })
  
  // Card slides up from bottom
  const cardY = useTransform(
    smoothProgress, 
    [0, 1], 
    ['100%', '0%']
  )
  
  // Scale animation
  const cardScale = useTransform(
    smoothProgress,
    [0, 1],
    [0.95, 1]
  )
  
  // 3D rotation
  const cardRotateX = useTransform(
    smoothProgress,
    [0, 1],
    [8, 0]
  )
  
  // Shadow opacity
  const shadowOpacity = useTransform(
    smoothProgress,
    [0, 1],
    [0.8, 0.3]
  )
  
  // For the last section (footer), make it sticky to cover the previous section
  if (isLast) {
    return (
      <div 
        ref={sectionRef}
        className="relative"
      >
        <motion.section
          className={`sticky top-0 ${className}`}
          style={{ 
            y: cardY,
            scale: cardScale,
            rotateX: cardRotateX,
            zIndex: index + 10,
            transformPerspective: 1200,
            transformOrigin: 'center top',
            minHeight: height === 'auto' ? 'auto' : height,
          }}
        >
          {/* Top shadow for depth */}
          <motion.div 
            className="absolute inset-x-0 -top-32 h-32 pointer-events-none z-50"
            style={{
              opacity: shadowOpacity,
              background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.9) 100%)',
            }}
          />
          
          {/* Content wrapper */}
          <div className="relative w-full">
            {children}
          </div>
        </motion.section>
      </div>
    )
  }
  
  // Regular card section
  return (
    <motion.section
      ref={sectionRef}
      className={`relative ${className}`}
      style={{ 
        zIndex: index + 10,
        minHeight: height === 'auto' ? 'auto' : height,
      }}
    >
      {/* Top shadow for depth */}
      <div 
        className="absolute inset-x-0 -top-20 h-20 pointer-events-none z-50"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 100%)',
        }}
      />
      
      {/* Content wrapper */}
      <div className="relative w-full">
        {children}
      </div>
    </motion.section>
  )
}

// Individual scroll section - routes to Hero or Card
interface ScrollSectionProps {
  children: ReactNode
  index: number
  className?: string
  height?: string
  isLast?: boolean
}

export function ScrollSection({ 
  children, 
  index, 
  className = '',
  height = '100vh',
  isLast = false
}: ScrollSectionProps) {
  if (index === 0) {
    return <HeroSection className={className}>{children}</HeroSection>
  }
  
  return (
    <CardSection index={index} className={className} height={height} isLast={isLast}>
      {children}
    </CardSection>
  )
}
