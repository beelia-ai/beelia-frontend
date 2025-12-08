"use client";

import { HeroBanner3D, AboutCompany } from './components'
import { GradientOrbs } from '@/components/ui'

export default function HomePage() {
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
      
      {/* Content */}
      <div className="relative z-10">
        <HeroBanner3D />
        <AboutCompany />
      </div>
    </main>
  )
}
