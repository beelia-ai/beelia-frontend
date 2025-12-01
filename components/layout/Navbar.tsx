'use client'

import { useState } from 'react'
import Image from 'next/image'
import GlassSurface from '@/components/GlassSurface'
import BubbleMenu from '@/components/BubbleMenu'

export function Navbar() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <>
      {/* BubbleMenu hamburger on the left */}
      <BubbleMenu
        logo=""
        useFixedPosition={true}
        menuBg="#fff"
        menuContentColor="#111"
      />

      {/* Glass Button on the right */}
      <nav className="fixed top-0 right-0 z-[9999] p-6">
        <div 
          className="group cursor-pointer"
          style={{
            perspective: '1000px',
            transformStyle: 'preserve-3d',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <GlassSurface
            width={245}
            height={65}
            borderRadius={50}
            chromaticAberration={isHovered ? 0.4 : 0.25}
            className="group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-purple-500/50"
            style={{
              transform: isHovered 
                ? 'translateZ(30px) rotateX(-2deg) rotateY(2deg) scale(1.05)' 
                : 'translateZ(20px) rotateX(0deg) rotateY(0deg) scale(1)',
              boxShadow: isHovered
                ? '0 30px 60px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2) inset, 0 0 80px rgba(147, 51, 234, 0.5)'
                : '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, 0 0 60px rgba(147, 51, 234, 0.3)',
              transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1), filter 0.7s ease-out, box-shadow 0.7s ease-out',
              willChange: 'transform, filter, box-shadow',
            }}
          >
            <div className="w-full flex items-center justify-center gap-3">
              <span 
                className="font-inria-sans font-normal uppercase text-white"
                style={{
                  fontSize: '21px',
                  lineHeight: '100%',
                  letterSpacing: '6%',
                }}
              >
                join waitlist
              </span>
              <Image
                src="/icons/Vector.svg"
                alt="arrow"
                width={20}
                height={20}
                className="transition-transform duration-500 ease-in-out group-hover:rotate-45"
              />
            </div>
          </GlassSurface>
        </div>
      </nav>
    </>
  )
}
