'use client'

import Image from 'next/image'
import GlassSurface from '@/components/GlassSurface'

export function Navbar() {
  return (
    <nav className="fixed top-0 right-0 z-[9999] p-6">
      <GlassSurface
        width={245}
        height={65}
        borderRadius={50}
        className="group cursor-pointer hover:scale-45 transition-transform"
      >
        <div className="w-full flex items-center justify-end gap-3 pr-6">
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
    </nav>
  )
}
