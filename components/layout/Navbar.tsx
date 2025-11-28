'use client'

import Image from 'next/image'
import { LiquidGlassButton } from '@/components/ui/liquid-glass-button'

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none">
      <nav className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-end h-24 py-4">
            <div className="pointer-events-auto">
              <LiquidGlassButton 
                borderRadius={50}
                refraction={25}
                chromaticAberration={2}
                animationSpeed={5}
                className="w-[245px] h-[65px] py-5 px-8 gap-2.5 font-inria-sans font-normal text-[21px] leading-none tracking-[0.06em] uppercase"
              >
                Join Waitlist
                <Image 
                  src="/icons/vector.svg" 
                  alt="" 
                  width={14} 
                  height={14}
                  className="ml-2 transition-transform duration-300 ease-out group-hover:rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </LiquidGlassButton>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
