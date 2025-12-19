'use client'

import Image from 'next/image'
import { BottomLinesAnimated } from '@/components/ui/bottom-lines-animated'

export function AboutProduct() {
  return (
    <div className="relative min-h-screen w-full bg-transparent">
      {/* Section content */}
      <div className="relative z-10 flex flex-col items-center justify-start pt-32">
        {/* OneStop Image - positioned at top where globe stops */}
        <div className="w-full flex justify-center mb-6">
          <Image
            src="/images/Onestop.png"
            alt="OneStop"
            width={1000}
            height={300}
            className="w-auto h-auto object-contain"
            priority
          />
        </div>

        {/* Description text under OneStop Image */}
        <p
          className="text-center mb-12"
          style={{
            width: '457.771484375px',
            height: '44px',
            fontFamily: 'var(--font-outfit), Outfit, sans-serif',
            fontWeight: 400,
            fontStyle: 'normal',
            fontSize: '16px',
            lineHeight: '140%',
            letterSpacing: '2%',
            textAlign: 'center',
            color: '#FFFFFF'
          }}
        >
          —giving people a seamless way to find the right tools and start using them instantly, no setup, no friction.
        </p>

        {/* Bottom Lines SVG - under the globe with animated beams */}
        <div className="w-full flex justify-center -mt-7">
          <BottomLinesAnimated
            duration={4}
            delay={0}
            beamColor="#FEDA24"
            beamColorSecondary="#FF8C32"
            pathColor="#444444"
            beamWidth={2}
            pathWidth={1}
            className="w-auto h-auto"
          />
        </div>
      </div>
    </div>
  )
}

