'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import LightRays from '@/components/LightRays'
import { ParticleSpritesBackground } from '@/components/ui'
import Image from 'next/image'
import GlassSurface from '@/components/GlassSurface'

export function NewHero() {
  const [isHovered, setIsHovered] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])
  // Glossy white and silver colors in HSL format (normalized 0-1)
  const beeliaColors = [
    [0, 0, 1],      // Pure white - glossy white
    [0, 0, 0.9],    // Off-white - bright silver
    [0, 0, 0.75],   // Silver - medium silver
    [0, 0, 0.85],   // Light silver - bright silver
    [0, 0, 0.95]    // Near white - glossy white
  ]

  return (
    <>
      {/* Hover fill styles for waitlist button */}
      <style>{`
        .waitlist-btn-wrapper {
          position: relative;
          overflow: hidden;
          border-radius: 50px;
        }
        .waitlist-btn-wrapper::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #FF8C32 0%, #FEDA24 50%, #FF8C32 100%);
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateX(-100%);
          z-index: 1;
          border-radius: 50px;
          pointer-events: none;
          box-shadow: 0 0 20px rgba(254, 218, 36, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        .waitlist-btn-wrapper:hover::after {
          transform: translateX(0);
        }
        .waitlist-btn-wrapper > * {
          position: relative;
          z-index: 2;
        }
        .waitlist-btn-text {
          color: #FFFFFF;
          transition: color 0.3s ease;
        }
        .waitlist-btn-wrapper:hover .waitlist-btn-text {
          color: #000000;
          font-weight: 600;
        }
      `}</style>
      <section className="h-screen bg-black relative overflow-hidden">
      {/* Particle Sprites Background */}
      <ParticleSpritesBackground 
        className="absolute inset-0"
        particleCount={100}
        followMouse={true}
        mouseSensitivity={0.05}
        colors={beeliaColors}
        cycleColors={false}
      />
      
      {/* Light Rays */}
      <LightRays 
       raysOrigin="top-center"
       raysColor="#4699F8"
       raysSpeed={1}
       lightSpread={0.5}
       rayLength={3}
       fadeDistance={1}
       saturation={1}
       followMouse={true}
       mouseInfluence={0.1}
       noiseAmount={0}
       distortion={0}
       className="absolute inset-0"
      />

      {/* AIFOR Image - positioned with specific dimensions, centered */}
      <div 
        className="absolute z-10 left-1/2 -translate-x-1/2"
        style={{
          width: '675px',
          height: '80px',
          top: '607.99px',
          opacity: 1
        }}
      >
        <Image
          src="/images/AIFOR.png"
          alt="AI For Everyone, by Everyone"
          width={675}
          height={80}
          className="w-full h-full object-contain"
          priority
        />
      </div>

      {/* Tagline Text - positioned below AIFOR image */}
      <p 
        className="absolute z-10 left-1/2 -translate-x-1/2 uppercase text-center"
        style={{
          fontFamily: 'var(--font-inria-sans), Inria Sans, sans-serif',
          fontWeight: 400,
          fontStyle: 'normal',
          fontSize: '17px',
          lineHeight: '26px',
          letterSpacing: '0.04em',
          textAlign: 'center',
          textTransform: 'uppercase',
          width: '605.4130859375px',
          height: '52px',
          top: '707.33px',
          opacity: 0.8,
          color: '#FFFFFF'
        }}
      >
        A curated AI marketplace where anyone can discover, trust, and use the right tools instantly, no technical skills required
      </p>

      {/* Join Waitlist Button - positioned below tagline text */}
      <div className="absolute z-10 left-1/2 -translate-x-1/2" style={{ top: '780px' }}>
        <Link 
          href="/waitlist"
          className="group cursor-pointer block"
          style={{
            perspective: '1000px',
            transformStyle: 'preserve-3d',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="waitlist-btn-wrapper">
            {isMounted ? (
              <GlassSurface
                width={200}
                height={55}
                borderRadius={50}
                chromaticAberration={0.15}
                redOffset={0}
                greenOffset={10}
                blueOffset={20}
                distortionScale={-180}
                blur={16}
                brightness={60}
                opacity={0.95}
                className="group-hover:scale-105"
                style={{
                  transform: isHovered 
                    ? 'translateZ(20px) rotateX(-1deg) rotateY(1deg) scale(1.03)' 
                    : 'translateZ(10px) rotateX(0deg) rotateY(0deg) scale(1)',
                  boxShadow: isHovered
                    ? '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.15) inset'
                    : '0 10px 30px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <div className="w-full flex items-center justify-center gap-2 relative z-10">
                  <span 
                    className="waitlist-btn-text uppercase"
                    style={{
                      fontFamily: 'var(--font-inria-sans), sans-serif',
                      fontSize: '14px',
                      lineHeight: '100%',
                      letterSpacing: '0.06em',
                    }}
                  >
                    join waitlist
                  </span>
                  <Image
                    src="/icons/Vector.svg"
                    alt="arrow"
                    width={16}
                    height={16}
                    className="transition-transform duration-500 ease-in-out"
                    style={{
                      transform: isHovered ? 'rotate(45deg)' : 'rotate(0deg)',
                    }}
                  />
                </div>
              </GlassSurface>
            ) : null}
          </div>
        </Link>
      </div>
      </section>
    </>
  )
}
