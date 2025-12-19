'use client'

import Image from 'next/image'
import { BottomLinesAnimated } from '@/components/ui/bottom-lines-animated'
import { GlowCard } from '@/components/ui/glow-card'

const CARD_DATA = [
  {
    title: 'Wherever you go,<br/>the cursor follows',
    subtitle: 'Pro',
    description: '',
    iconPath: 'M17.303 5.197A7.5 7.5 0 0 0 6.697 15.803a.75.75 0 0 1-1.061 1.061A9 9 0 1 1 21 10.5a.75.75 0 0 1-1.5 0c0-1.92-.732-3.839-2.197-5.303Zm-2.121 2.121a4.5 4.5 0 0 0-6.364 6.364.75.75 0 1 1-1.06 1.06A6 6 0 1 1 18 10.5a.75.75 0 0 1-1.5 0c0-1.153-.44-2.303-1.318-3.182Zm-3.634 1.314a.75.75 0 0 1 .82.311l5.228 7.917a.75.75 0 0 1-.777 1.148l-2.097-.43 1.045 3.9a.75.75 0 0 1-1.45.388l-1.044-3.899-1.601 1.42a.75.75 0 0 1-1.247-.606l.569-9.47a.75.75 0 0 1 .554-.68Z',
  },
  {
    title: 'One event listener<br/>powers it all',
    subtitle: 'Pro',
    description: '',
    iconPath: 'M14.447 3.026a.75.75 0 0 1 .527.921l-4.5 16.5a.75.75 0 0 1-1.448-.394l4.5-16.5a.75.75 0 0 1 .921-.527ZM16.72 6.22a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 1 1-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 0 1 0-1.06Zm-9.44 0a.75.75 0 0 1 0 1.06L2.56 12l4.72 4.72a.75.75 0 0 1-1.06 1.06L.97 12.53a.75.75 0 0 1 0-1.06l5.25-5.25a.75.75 0 0 1 1.06 0Z',
  },
  {
    title: 'Lean into CSS<br/>and the cascade',
    subtitle: 'Pro',
    description: '',
    iconPath: 'M11.25 5.337c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.036 1.007-1.875 2.25-1.875S15 2.34 15 3.375c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959 0 .332.278.598.61.578 1.91-.114 3.79-.342 5.632-.676a.75.75 0 0 1 .878.645 49.17 49.17 0 0 1 .376 5.452.657.657 0 0 1-.66.664c-.354 0-.675-.186-.958-.401a1.647 1.647 0 0 0-1.003-.349c-1.035 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401.31 0 .557.262.534.571a48.774 48.774 0 0 1-.595 4.845.75.75 0 0 1-.61.61c-1.82.317-3.673.533-5.555.642a.58.58 0 0 1-.611-.581c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.035-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959a.641.641 0 0 1-.658.643 49.118 49.118 0 0 1-4.708-.36.75.75 0 0 1-.645-.878c.293-1.614.504-3.257.629-4.924A.53.53 0 0 0 5.337 15c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.036 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.369 0 .713.128 1.003.349.283.215.604.401.959.401a.656.656 0 0 0 .659-.663 47.703 47.703 0 0 0-.31-4.82.75.75 0 0 1 .83-.832c1.343.155 2.703.254 4.077.294a.64.64 0 0 0 .657-.642Z',
  },
]

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

        {/* Cards - attached to bottom lines with spacing */}
        <div className="w-full flex justify-center items-start -mt-[150px] relative z-20">
          <div className="flex gap-8 items-start">
            {CARD_DATA.map((card) => (
              <GlowCard
                key={card.title}
                title={card.title}
                subtitle={card.subtitle}
                description={card.description}
                iconPath={card.iconPath}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

