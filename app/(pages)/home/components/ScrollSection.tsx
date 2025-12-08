'use client'

import { ReactNode, createContext, useContext, useRef, useMemo } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'

// Context to share scroll progress between sections
interface ScrollContextType {
  scrollYProgress: MotionValue<number>
  totalSections: number
}

const ScrollContext = createContext<ScrollContextType | null>(null)

// Wrapper for all scroll sections - provides scroll tracking
interface ScrollContainerProps {
  children: ReactNode
  totalSections: number
}

export function ScrollContainer({ children, totalSections }: ScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })
  
  const contextValue = useMemo(() => ({ 
    scrollYProgress, 
    totalSections 
  }), [scrollYProgress, totalSections])
  
  return (
    <ScrollContext.Provider value={contextValue}>
      <div 
        ref={containerRef}
        className="relative"
        style={{ height: `${totalSections * 100}vh` }}
      >
        {children}
      </div>
    </ScrollContext.Provider>
  )
}

// Individual scroll section
interface ScrollSectionProps {
  children: ReactNode
  index: number
  className?: string
}

export function ScrollSection({ 
  children, 
  index, 
  className = '' 
}: ScrollSectionProps) {
  const context = useContext(ScrollContext)
  
  if (!context) {
    throw new Error('ScrollSection must be used within ScrollContainer')
  }
  
  const { scrollYProgress, totalSections } = context
  
  // Hero section (index 0) - scales down and fades
  const heroScale = useTransform(
    scrollYProgress, 
    [0, 0.2, 0.4], 
    [1, 1, 0.88]
  )
  const heroOpacity = useTransform(
    scrollYProgress, 
    [0, 0.2, 0.35], 
    [1, 1, 0]
  )
  
  // Card sections (index > 0) - slide up
  const cardStart = (index - 1) / totalSections
  const cardMid = (index - 0.3) / totalSections
  
  const cardY = useTransform(
    scrollYProgress, 
    [cardStart, cardMid], 
    ['100vh', '0vh']
  )
  const cardOpacity = useTransform(
    scrollYProgress, 
    [cardStart, cardStart + 0.1], 
    [0, 1]
  )
  
  // First section (hero)
  if (index === 0) {
    return (
      <motion.div
        className={`fixed top-0 left-0 right-0 h-screen overflow-hidden ${className}`}
        style={{ 
          scale: heroScale,
          opacity: heroOpacity,
          zIndex: 1,
        }}
      >
        {children}
      </motion.div>
    )
  }
  
  // Subsequent sections - slide up as cards
  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-screen overflow-auto ${className}`}
      style={{ 
        y: cardY,
        opacity: cardOpacity,
        zIndex: index + 10,
      }}
    >
      <div className="relative w-full min-h-screen">
        {children}
      </div>
    </motion.div>
  )
}
