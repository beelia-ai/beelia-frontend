'use client'

import { ReactNode, createContext, useContext, useMemo, useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, MotionValue, useInView } from 'framer-motion'

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

// Hero Section Component
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

// Card Section Component - uses simpler viewport-based animations
function CardSection({ 
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
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { 
    once: false, 
    margin: "-10% 0px -10% 0px" 
  })
  
  return (
    <motion.section
      ref={sectionRef}
      className={`relative ${className}`}
      initial={{ y: 100, opacity: 0, scale: 0.95 }}
      animate={isInView ? { 
        y: 0, 
        opacity: 1, 
        scale: 1,
        rotateX: 0
      } : { 
        y: 100, 
        opacity: 0, 
        scale: 0.95,
        rotateX: 8
      }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      style={{ 
        zIndex: index + 10,
        minHeight: height === 'auto' ? 'auto' : height,
        transformPerspective: 1200,
        transformOrigin: 'center top',
      }}
    >
      {/* Top shadow for depth */}
      <motion.div 
        className="absolute inset-x-0 -top-32 h-32 pointer-events-none z-50"
        initial={{ opacity: 0.5 }}
        animate={isInView ? { opacity: 0.2 } : { opacity: 0.5 }}
        transition={{ duration: 0.8 }}
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.9) 100%)',
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
}

export function ScrollSection({ 
  children, 
  index, 
  className = '',
  height = '100vh'
}: ScrollSectionProps) {
  if (index === 0) {
    return <HeroSection className={className}>{children}</HeroSection>
  }
  
  return (
    <CardSection index={index} className={className} height={height}>
      {children}
    </CardSection>
  )
}
