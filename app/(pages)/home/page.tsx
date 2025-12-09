"use client";

import { AboutCompany, ScrollSection, ScrollContainer } from './components'
import { HeroBackground } from '@/components/ui'
import { Footer } from '@/components/layout/Footer'
import { useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// Card wrapper component for consistent styling
function CardSection({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <div 
      className={`relative overflow-hidden min-h-screen ${className}`}
    >
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
    <main className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
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
