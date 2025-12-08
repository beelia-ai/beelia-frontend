'use client'

import { GradientOrbs } from '@/components/ui'

export function GlobalBackground() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {/* Base black background */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Global gradient orbs - spans entire viewport */}
      <GradientOrbs 
        count={15}
        showGrid={false}
        animate={true}
        className="!fixed"
      />
    </div>
  )
}

export default GlobalBackground

