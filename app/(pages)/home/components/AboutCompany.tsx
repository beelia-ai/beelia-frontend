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
    <section className="relative w-full min-h-screen bg-black py-16 px-8 md:px-16 lg:px-24 overflow-hidden">
      {/* Background gradient orbs */}
      <GradientOrbs 
        orbs={[
          {
            size: 700,
            color1: 'rgba(254, 218, 36, 0.1)',
            color2: 'rgba(239, 148, 31, 0.05)',
            top: '-200px',
            right: '-100px',
          },
          {
            size: 500,
            color1: 'rgba(239, 148, 31, 0.08)',
            color2: 'rgba(254, 218, 36, 0.03)',
            bottom: '10%',
            left: '-100px',
          },
        ]}
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

          {/* Video Placeholder */}
          <div 
            className="relative w-full aspect-video rounded-2xl overflow-hidden cursor-pointer group"
            style={{ 
              background: 'linear-gradient(135deg, rgba(50, 50, 50, 0.8) 0%, rgba(30, 30, 30, 0.9) 100%)'
            }}
          >
            {/* Placeholder blur effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-600/30 to-gray-800/50 backdrop-blur-sm" />
            
            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)' }}
              >
                <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 14L0 28V0L24 14Z" fill="#333" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-6xl mx-auto">
        {/* CEO Section - First Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-dashed border-white/20 rounded-lg overflow-hidden mb-0">
          {/* Left - Profile */}
          <div className="p-8 border-b md:border-b-0 md:border-r border-dashed border-white/20">
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
        </div>

        {/* Second Row - Emmanuel & Sanzhar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-x border-b border-dashed border-white/20">
          {/* Emmanuel */}
          <div className="p-8 border-b md:border-b-0 md:border-r border-dashed border-white/20">
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
        </div>

        {/* Third Row - Placeholder & Arshdeep */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-x border-b border-dashed border-white/20 rounded-b-lg overflow-hidden">
          {/* Placeholder */}
          <div className="p-8 border-b md:border-b-0 md:border-r border-dashed border-white/20">
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

