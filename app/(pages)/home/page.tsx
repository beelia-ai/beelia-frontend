"use client";

import { AboutCompany, ScrollSection, ScrollContainer } from './components'
import { GradientOrbs, HeroBackground } from '@/components/ui'
import { Footer } from '@/components/layout/Footer'
import { useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// Card wrapper component for consistent styling
function CardSection({ 
  children, 
  showGlow = true,
  className = '' 
}: { 
  children: React.ReactNode
  showGlow?: boolean
  className?: string 
}) {
  return (
    <div 
      className={`relative overflow-hidden min-h-screen ${className}`}
    >
      {/* Card top edge glow */}
      {showGlow && (
        <div 
          className="absolute top-0 left-0 right-0 h-[2px] z-20"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(254,218,36,0.4) 15%, rgba(254,218,36,0.8) 50%, rgba(254,218,36,0.4) 85%, transparent 100%)',
            boxShadow: '0 0 30px rgba(254,218,36,0.4), 0 0 60px rgba(254,218,36,0.15)',
          }}
        />
      )}
      
      {/* Subtle inner glow at top */}
      <div 
        className="absolute top-0 left-0 right-0 h-40 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(180deg, rgba(254,218,36,0.03) 0%, transparent 100%)',
        }}
      />
      
      {/* Content */}
      <div className="relative z-0">
        {children}
      </div>
    </div>
  )
}

// Scroll indicator component that hides on scroll
function ScrollIndicator() {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 100], [0.5, 0])
  
  return (
    <motion.div 
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
      style={{ opacity }}
    >
      <div className="flex flex-col items-center gap-2 animate-bounce">
        <span className="text-white/50 text-xs tracking-widest uppercase">Scroll</span>
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5"
          className="text-white/50"
        >
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>
    </motion.div>
  )
}

export default function HomePage() {
  // Hide the global footer on home page since we have our own scroll-animated one
  useEffect(() => {
    const globalFooter = document.querySelector('body > div > footer')
    if (globalFooter) {
      (globalFooter as HTMLElement).style.display = 'none'
    }
    return () => {
      if (globalFooter) {
        (globalFooter as HTMLElement).style.display = ''
      }
    }
  }, [])
  
  return (
    <main className="min-h-screen relative bg-black overflow-hidden">
      {/* Global Background - Fixed, covers entire page */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <GradientOrbs 
          count={10}
          animate={true}
          showGrid={true}
          gridOpacity={0.02}
        />
      </div>
      
      {/* Scroll Sections */}
      <div className="relative z-10">
        <ScrollContainer>
          {/* Hero Section */}
          <ScrollSection index={0}>
            <HeroBackground />
          </ScrollSection>
          
          {/* About Company Section - auto height for content */}
          <ScrollSection index={1} height="auto">
            <div id="about-company">
              <CardSection>
                <AboutCompany />
              </CardSection>
            </div>
          </ScrollSection>
          
          {/* Footer Section */}
          <ScrollSection index={2} height="100vh">
            <CardSection>
              <Footer />
            </CardSection>
          </ScrollSection>
        </ScrollContainer>
      </div>
      
      {/* Scroll indicator - hides on scroll */}
      <ScrollIndicator />
    </main>
  )
}
