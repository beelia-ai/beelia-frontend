'use client'

import Image from 'next/image'
import { GradientOrbs } from '@/components/ui'

interface TeamMember {
  name: string
  role: string
  image: string
  description?: string
  quote?: string
}

const teamMembers: TeamMember[] = [
  {
    name: 'Juan Carlos Calvo Fresno',
    role: 'Co-founder & CEO',
    image: '/images/JUAN.png',
    description: 'Based in Barcelona. My global perspective has been shaped by six years of life in the United States, fueling a deep passion for technology, innovation, and entrepreneurship.',
    quote: '"Driven by curiosity and ambition, I\'m continuously working to grow my expertise in the tech space. I aim to leverage my international background to spark meaningful innovation and contribute to impactful, forward-thinking solutions."'
  },
  {
    name: 'Emmanuel',
    role: 'Co-founder & CTO',
    image: '/images/EMMANUEL.png'
  },
  {
    name: 'Sanzhar',
    role: 'Co-founder & founding engineer',
    image: '/images/SANZHAR.png'
  },
  {
    name: '--',
    role: '--',
    image: ''
  },
  {
    name: 'Arshdeep Singh',
    role: 'Product Lead',
    image: '/images/ARSHDEEP.png'
  }
]

export function AboutCompany() {
  return (
    <section className="relative w-full bg-black py-24 px-8 md:px-16 lg:px-24 overflow-hidden">
      {/* Background gradient orbs - randomly generated */}
      <GradientOrbs 
        count={12}
        showGrid={false}
      />

      {/* Video Section */}
      <div className="flex justify-center mb-16">
        <div className="relative w-full max-w-4xl">
          {/* A short-intro text - positioned adjacent to video */}
          <div 
            className="absolute flex items-center gap-2"
            style={{ 
              left: '-180px',
              top: '180px'
            }}
          >
            <Image 
              src="/icons/A short-intro!.svg"
              alt="A short-intro!"
              width={120}
              height={30}
              className="h-auto"
            />
            <Image 
              src="/icons/Curved-arrow.svg"
              alt="Arrow"
              width={50}
              height={30}
              className="h-auto"
            />
          </div>

          {/* Video */}
          <div 
            className="relative w-full aspect-video rounded-2xl overflow-hidden"
            style={{ 
              background: 'linear-gradient(135deg, rgba(50, 50, 50, 0.8) 0%, rgba(30, 30, 30, 0.9) 100%)'
            }}
          >
            <video 
              className="w-full h-full object-cover"
              controls
              playsInline
              preload="auto"
            >
              <source src="/videos/beelia-intro.mov" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-6xl mx-auto relative rounded-lg" style={{ background: 'transparent' }}>
        {/* Left vertical line - extended with fade */}
        <div 
          className="absolute left-0 pointer-events-none"
          style={{
            width: '0.5px',
            top: '-40px',
            bottom: '-40px',
            background: 'linear-gradient(180deg, transparent 0%, #FEDA24 15%, #EF941F 50%, #FEDA24 85%, transparent 100%)',
          }}
        />
        {/* Right vertical line - extended with fade */}
        <div 
          className="absolute right-0 pointer-events-none"
          style={{
            width: '0.5px',
            top: '-40px',
            bottom: '-40px',
            background: 'linear-gradient(180deg, transparent 0%, #FEDA24 15%, #EF941F 50%, #FEDA24 85%, transparent 100%)',
          }}
        />
        {/* Center vertical line - extended with fade */}
        <div 
          className="hidden md:block absolute left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: '0.5px',
            top: '-40px',
            bottom: '-40px',
            background: 'linear-gradient(180deg, transparent 0%, #FEDA24 15%, #EF941F 50%, #FEDA24 85%, transparent 100%)',
          }}
        />

        {/* Intersection dots container - will be populated per row */}

        {/* CEO Section - First Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 relative">
          {/* Left - Profile */}
          <div className="p-8 relative">
            <div className="flex items-start gap-4 mb-6">
              {/* Profile Image */}
              <div className="w-16 h-16 rounded-lg bg-gray-700 overflow-hidden flex-shrink-0">
                <Image 
                  src={teamMembers[0].image} 
                  alt={teamMembers[0].name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 
                  className="text-white mb-1"
                  style={{ 
                    fontFamily: 'var(--font-inria-sans), sans-serif',
                    fontWeight: 700,
                    fontSize: '18px'
                  }}
                >
                  {teamMembers[0].name}
                </h3>
                <p 
                  className="text-[#FEDA24]"
                  style={{ 
                    fontFamily: 'var(--font-inria-sans), sans-serif',
                    fontWeight: 400,
                    fontSize: '14px'
                  }}
                >
                  {teamMembers[0].role}
                </p>
              </div>
            </div>
            <p 
              className="text-white/70"
              style={{ 
                fontFamily: 'var(--font-inria-sans), sans-serif',
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '160%'
              }}
            >
              {teamMembers[0].description}
            </p>
          </div>

          {/* Right - Quote */}
          <div className="p-8 flex items-center">
            <p 
              className="text-white"
              style={{ 
                fontFamily: 'var(--font-inria-sans), sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '170%'
              }}
            >
              {teamMembers[0].quote}
            </p>
          </div>

          {/* Horizontal divider - extended with fade */}
          <div 
            className="absolute bottom-0 pointer-events-none"
            style={{ 
              height: '0.5px',
              left: '-200px',
              right: '-200px',
              background: 'linear-gradient(90deg, transparent 0%, #FEDA24 10%, #EF941F 50%, #FEDA24 90%, transparent 100%)',
            }}
          />
          {/* Intersection dots */}
          <div className="absolute bottom-0 left-0 w-2 h-2 rounded-full bg-[#FEDA24] -translate-x-1/2 translate-y-1/2 z-10" />
          <div className="hidden md:block absolute bottom-0 left-1/2 w-2 h-2 rounded-full bg-[#FEDA24] -translate-x-1/2 translate-y-1/2 z-10" />
          <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#FEDA24] translate-x-1/2 translate-y-1/2 z-10" />
        </div>

        {/* Separator Row 1 */}
        <div 
          className="w-full relative"
          style={{ height: '56px' }}
        >
          <div className="absolute inset-0" style={{ opacity: 0.01 }} />
          {/* Horizontal divider - extended with fade */}
          <div 
            className="absolute bottom-0 pointer-events-none"
            style={{ 
              height: '0.5px',
              left: '-200px',
              right: '-200px',
              background: 'linear-gradient(90deg, transparent 0%, #FEDA24 10%, #EF941F 50%, #FEDA24 90%, transparent 100%)',
            }}
          />
          {/* Intersection dots */}
          <div className="absolute bottom-0 left-0 w-2 h-2 rounded-full bg-[#FEDA24] -translate-x-1/2 translate-y-1/2 z-10" />
          <div className="hidden md:block absolute bottom-0 left-1/2 w-2 h-2 rounded-full bg-[#FEDA24] -translate-x-1/2 translate-y-1/2 z-10" />
          <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#FEDA24] translate-x-1/2 translate-y-1/2 z-10" />
        </div>

        {/* Second Row - Emmanuel & Sanzhar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 relative">
          {/* Emmanuel */}
          <div className="p-8 relative">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-gray-700 overflow-hidden flex-shrink-0">
                <Image 
                  src={teamMembers[1].image} 
                  alt={teamMembers[1].name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 
                  className="text-white mb-1"
                  style={{ 
                    fontFamily: 'var(--font-inria-sans), sans-serif',
                    fontWeight: 700,
                    fontSize: '18px'
                  }}
                >
                  {teamMembers[1].name}
                </h3>
                <p 
                  className="text-[#FEDA24]"
                  style={{ 
                    fontFamily: 'var(--font-inria-sans), sans-serif',
                    fontWeight: 400,
                    fontSize: '14px'
                  }}
                >
                  {teamMembers[1].role}
                </p>
              </div>
            </div>
          </div>

          {/* Sanzhar */}
          <div className="p-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-gray-700 overflow-hidden flex-shrink-0">
                <Image 
                  src={teamMembers[2].image} 
                  alt={teamMembers[2].name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 
                  className="text-white mb-1"
                  style={{ 
                    fontFamily: 'var(--font-inria-sans), sans-serif',
                    fontWeight: 700,
                    fontSize: '18px'
                  }}
                >
                  {teamMembers[2].name}
                </h3>
                <p 
                  className="text-[#FEDA24]"
                  style={{ 
                    fontFamily: 'var(--font-inria-sans), sans-serif',
                    fontWeight: 400,
                    fontSize: '14px'
                  }}
                >
                  {teamMembers[2].role}
                </p>
              </div>
            </div>
          </div>

          {/* Horizontal divider - extended with fade */}
          <div 
            className="absolute bottom-0 pointer-events-none"
            style={{ 
              height: '0.5px',
              left: '-200px',
              right: '-200px',
              background: 'linear-gradient(90deg, transparent 0%, #FEDA24 10%, #EF941F 50%, #FEDA24 90%, transparent 100%)',
            }}
          />
          {/* Intersection dots */}
          <div className="absolute bottom-0 left-0 w-2 h-2 rounded-full bg-[#FEDA24] -translate-x-1/2 translate-y-1/2 z-10" />
          <div className="hidden md:block absolute bottom-0 left-1/2 w-2 h-2 rounded-full bg-[#FEDA24] -translate-x-1/2 translate-y-1/2 z-10" />
          <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#FEDA24] translate-x-1/2 translate-y-1/2 z-10" />
        </div>

        {/* Separator Row 2 */}
        <div 
          className="w-full relative"
          style={{ height: '56px' }}
        >
          <div className="absolute inset-0" style={{ opacity: 0.01 }} />
          {/* Horizontal divider - extended with fade */}
          <div 
            className="absolute bottom-0 pointer-events-none"
            style={{ 
              height: '0.5px',
              left: '-200px',
              right: '-200px',
              background: 'linear-gradient(90deg, transparent 0%, #FEDA24 10%, #EF941F 50%, #FEDA24 90%, transparent 100%)',
            }}
          />
          {/* Intersection dots */}
          <div className="absolute bottom-0 left-0 w-2 h-2 rounded-full bg-[#FEDA24] -translate-x-1/2 translate-y-1/2 z-10" />
          <div className="hidden md:block absolute bottom-0 left-1/2 w-2 h-2 rounded-full bg-[#FEDA24] -translate-x-1/2 translate-y-1/2 z-10" />
          <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#FEDA24] translate-x-1/2 translate-y-1/2 z-10" />
        </div>

        {/* Third Row - Placeholder & Arshdeep */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 relative">
          {/* Placeholder */}
          <div className="p-8 relative">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-gray-700 overflow-hidden flex-shrink-0">
                <div className="w-full h-full bg-gradient-to-br from-gray-500 to-gray-700" />
              </div>
              <div>
                <h3 
                  className="text-white mb-1"
                  style={{ 
                    fontFamily: 'var(--font-inria-sans), sans-serif',
                    fontWeight: 700,
                    fontSize: '18px'
                  }}
                >
                  {teamMembers[3].name}
                </h3>
                <p 
                  className="text-white/50"
                  style={{ 
                    fontFamily: 'var(--font-inria-sans), sans-serif',
                    fontWeight: 400,
                    fontSize: '14px'
                  }}
                >
                  {teamMembers[3].role}
                </p>
              </div>
            </div>
          </div>

          {/* Arshdeep */}
          <div className="p-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-gray-700 overflow-hidden flex-shrink-0">
                <Image 
                  src={teamMembers[4].image} 
                  alt={teamMembers[4].name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 
                  className="text-white mb-1"
                  style={{ 
                    fontFamily: 'var(--font-inria-sans), sans-serif',
                    fontWeight: 700,
                    fontSize: '18px'
                  }}
                >
                  {teamMembers[4].name}
                </h3>
                <p 
                  className="text-[#FEDA24]"
                  style={{ 
                    fontFamily: 'var(--font-inria-sans), sans-serif',
                    fontWeight: 400,
                    fontSize: '14px'
                  }}
                >
                  {teamMembers[4].role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

