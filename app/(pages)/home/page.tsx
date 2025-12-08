"use client";

import { HeroBanner3D, AboutCompany, ScrollSection, ScrollContainer } from './components'
import { GradientOrbs } from '@/components/ui'
import { Footer } from '@/components/layout/Footer'
import { useEffect } from 'react'

export default function HomePage() {
  const totalSections = 3
  
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
    <main className="min-h-screen relative bg-black">
      {/* Global Background - Fixed, covers entire page */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <GradientOrbs 
          count={18}
          animate={true}
          showGrid={true}
          gridOpacity={0.025}
        />
      </div>
      
      {/* Scroll Sections */}
      <div className="relative z-10">
        <ScrollContainer totalSections={totalSections}>
          <ScrollSection index={0}>
            <HeroBanner3D />
          </ScrollSection>
          
          <ScrollSection index={1}>
            <AboutCompany />
          </ScrollSection>
          
          <ScrollSection index={2}>
            <div className="rounded-t-[48px] overflow-hidden min-h-screen" style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #000000 100%)' }}>
              {/* Card top edge glow */}
              <div 
                className="absolute top-0 left-0 right-0 h-[2px] rounded-t-[48px] z-10"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(254,218,36,0.5) 20%, rgba(254,218,36,0.8) 50%, rgba(254,218,36,0.5) 80%, transparent 100%)',
                  boxShadow: '0 0 20px rgba(254,218,36,0.3), 0 0 40px rgba(254,218,36,0.1)',
                }}
              />
              <Footer />
            </div>
          </ScrollSection>
        </ScrollContainer>
      </div>
    </main>
  )
}
