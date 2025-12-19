'use client'

import Image from 'next/image'
import { BottomLinesAnimated } from '@/components/ui/bottom-lines-animated'
import { GlowCard } from '@/components/ui/glow-card'
import { Outfit } from 'next/font/google'

const outfit = Outfit({
  weight: ["600"],
  subsets: ["latin"],
  variable: "--font-outfit",
})

// Intersection dot component - always glowing
function IntersectionDot({ 
  position, 
  dotId 
}: { 
  position: 'left' | 'center' | 'right'
  dotId: string
}) {
  const positionClasses = {
    left: 'left-0 -translate-x-1/2',
    center: 'left-1/2 -translate-x-1/2',
    right: 'right-0 translate-x-1/2'
  }
  
  return (
    <div 
      data-dot-id={dotId}
      className={`absolute bottom-0 translate-y-1/2 z-10 transition-all duration-200 ${positionClasses[position]}`}
    >
      <div 
        className="w-2 h-2 rounded-full transition-all duration-200"
        style={{
          background: '#FEDA24',
          boxShadow: '0 0 10px #FEDA24, 0 0 20px #FEDA24, 0 0 30px #FEDA24',
        }}
      />
    </div>
  )
}

const CARD_DATA = [
  {
    title: 'DISCOVER',
    subtitle: '',
    description: 'Browse thousands of curated AI tools instantly. Find exactly what you need without the technical complexity.',
    // Magnifying glass icon (Heroicons)
    iconPath: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z',
  },
  {
    title: 'SUBSCRIBE',
    subtitle: '',
    description: 'One-click access to premium AI tools.<br/>No setup, no configuration. Start using tools instantly.',
    // Bell icon (Heroicons)
    iconPath: 'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0',
  },
  {
    title: 'SAFETY',
    subtitle: '',
    description: 'Every tool is verified and trusted.<br/>Built-in security and privacy protection. Use AI tools with confidence.',
    // Shield check icon (Heroicons)
    iconPath: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
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
        <div className="w-full flex justify-center items-start -mt-[150px] relative z-20 mb-32">
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

        {/* 2x2 Grid Table */}
        <div className="max-w-4xl mx-auto relative rounded-lg mt-16" style={{ background: 'transparent' }}>
          {/* Left vertical line */}
          <div 
            className="absolute left-0 pointer-events-none"
            style={{
              width: '0.5px',
              top: '-40px',
              bottom: '-40px',
              background: 'linear-gradient(180deg, transparent 0%, rgba(254, 218, 36, 0.4) 15%, rgba(239, 148, 31, 0.4) 50%, rgba(254, 218, 36, 0.4) 85%, transparent 100%)',
            }}
          />
          
          {/* Center vertical line */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              width: '0.5px',
              top: '-40px',
              bottom: '-40px',
              background: 'linear-gradient(180deg, transparent 0%, rgba(254, 218, 36, 0.4) 15%, rgba(239, 148, 31, 0.4) 50%, rgba(254, 218, 36, 0.4) 85%, transparent 100%)',
            }}
          />
          
          {/* Right vertical line */}
          <div 
            className="absolute right-0 pointer-events-none"
            style={{
              width: '0.5px',
              top: '-40px',
              bottom: '-40px',
              background: 'linear-gradient(180deg, transparent 0%, rgba(254, 218, 36, 0.4) 15%, rgba(239, 148, 31, 0.4) 50%, rgba(254, 218, 36, 0.4) 85%, transparent 100%)',
            }}
          />


          {/* First Row */}
          <div className="grid grid-cols-2 gap-0 relative">
            {/* Top Left Cell */}
            <div className="p-8 relative">
              <div className="text-white">
                <h3 
                  className="mb-4 whitespace-nowrap"
                  style={{ 
                    width: '305px',
                    height: '29px',
                    fontFamily: 'var(--font-outfit), Outfit, sans-serif',
                    fontWeight: 600,
                    fontStyle: 'normal',
                    fontSize: '24px',
                    lineHeight: '122%',
                    letterSpacing: '-2%',
                    textAlign: 'left',
                    color: '#FFFFFF'
                  }}
                >
                  Subscribe & Track your Usage
                </h3>
                <p 
                  className="mb-6 text-white/70"
                  style={{ 
                    width: '400px',
                    height: '66px',
                    fontFamily: 'var(--font-outfit), Outfit, sans-serif',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '16px',
                    lineHeight: '140%',
                    letterSpacing: '2%',
                    color: 'rgba(255, 255, 255, 0.7)'
                  }}
                >
                  Monitor realtime usage of tokens used in accessing all your AI tools. You can also monitor your spends on all your subscribed AI Tools.
                </p>
                {/* Placeholder box */}
                <div 
                  className="w-full rounded-lg"
                  style={{
                    height: '200px',
                    backgroundColor: 'rgba(60, 60, 60, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                />
              </div>
            </div>

            {/* Top Right Cell */}
            <div className="p-8 relative">
              <div className="text-white">
                <h3 
                  className="mb-4 whitespace-nowrap"
                  style={{ 
                    width: '305px',
                    height: '29px',
                    fontFamily: 'var(--font-outfit), Outfit, sans-serif',
                    fontWeight: 600,
                    fontStyle: 'normal',
                    fontSize: '24px',
                    lineHeight: '122%',
                    letterSpacing: '-2%',
                    textAlign: 'left',
                    color: '#FFFFFF'
                  }}
                >
                  Don't miss out on trends
                </h3>
                <p 
                  className="mb-6 text-white/70"
                  style={{ 
                    width: '400px',
                    height: '66px',
                    fontFamily: 'var(--font-outfit), Outfit, sans-serif',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '16px',
                    lineHeight: '140%',
                    letterSpacing: '2%',
                    color: 'rgba(255, 255, 255, 0.7)'
                  }}
                >
                  Categorically view which kind of tools are trending in the market. We smartly monitor market trends on all the different platforms.
                </p>
                {/* Placeholder box */}
                <div 
                  className="w-full rounded-lg"
                  style={{
                    height: '200px',
                    backgroundColor: 'rgba(60, 60, 60, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                />
              </div>
            </div>

            {/* Horizontal divider */}
            <div 
              className="absolute bottom-0 pointer-events-none"
              style={{ 
                height: '0.5px',
                left: '-200px',
                right: '-200px',
                background: 'linear-gradient(90deg, transparent 0%, rgba(254, 218, 36, 0.4) 10%, rgba(239, 148, 31, 0.4) 50%, rgba(254, 218, 36, 0.4) 90%, transparent 100%)',
              }}
            />
            {/* Intersection dots */}
            <IntersectionDot position="left" dotId="r1-c0" />
            <IntersectionDot position="center" dotId="r1-c1" />
            <IntersectionDot position="right" dotId="r1-c2" />
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-2 gap-0 relative">
            {/* Bottom Left Cell */}
            <div className="p-8 relative">
              <div className="text-white">
                <h3 
                  className="mb-4 whitespace-nowrap"
                  style={{ 
                    width: '305px',
                    height: '29px',
                    fontFamily: 'var(--font-outfit), Outfit, sans-serif',
                    fontWeight: 600,
                    fontStyle: 'normal',
                    fontSize: '24px',
                    lineHeight: '122%',
                    letterSpacing: '-2%',
                    textAlign: 'left',
                    color: '#FFFFFF'
                  }}
                >
                  Trusted by Beelia Community
                </h3>
                <p 
                  className="text-white/70"
                  style={{ 
                    width: '400px',
                    height: '66px',
                    fontFamily: 'var(--font-outfit), Outfit, sans-serif',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '16px',
                    lineHeight: '140%',
                    letterSpacing: '2%',
                    color: 'rgba(255, 255, 255, 0.7)'
                  }}
                >
                  Our Community test & reviews all the relevant information of any AI Tool listed on our platform.
                </p>
              </div>
            </div>

            {/* Bottom Right Cell */}
            <div className="p-8 relative">
              <div className="text-white">
                <h3 
                  className="mb-4 whitespace-nowrap"
                  style={{ 
                    width: '305px',
                    height: '29px',
                    fontFamily: 'var(--font-outfit), Outfit, sans-serif',
                    fontWeight: 600,
                    fontStyle: 'normal',
                    fontSize: '24px',
                    lineHeight: '122%',
                    letterSpacing: '-2%',
                    textAlign: 'left',
                    color: '#FFFFFF'
                  }}
                >
                  Pattern Analysis
                </h3>
                <p 
                  className="text-white/70"
                  style={{ 
                    width: '400px',
                    height: '66px',
                    fontFamily: 'var(--font-outfit), Outfit, sans-serif',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '16px',
                    lineHeight: '140%',
                    letterSpacing: '2%',
                    color: 'rgba(255, 255, 255, 0.7)'
                  }}
                >
                  Identify trends and optimize token usage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

