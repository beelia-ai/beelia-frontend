'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import LightRays from '@/components/LightRays'
import { ParticleSpritesBackground } from '@/components/ui'
import Image from 'next/image'
import GlassSurface from '@/components/GlassSurface'
import TraceLinesAnimated from '@/components/ui/trace-lines-animated'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { CoinModel } from '@/components/3d/CoinModel'

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
        .waitlist-btn-arrow {
          filter: brightness(0) invert(1);
          transition: filter 0.3s ease, transform 0.5s ease-in-out;
        }
        .waitlist-btn-wrapper:hover .waitlist-btn-arrow {
          filter: brightness(0) invert(0);
        }
      `}</style>
      <section className="h-screen bg-black relative overflow-hidden">
        {/* Particle Sprites Background */}
        <ParticleSpritesBackground
          className="absolute inset-0"
          particleCount={150}
          followMouse={true}
          mouseSensitivity={0.05}
          colors={beeliaColors}
          cycleColors={false}
          sizes={[5, 5, 5, 5, 5]}
          speed={0.3}
        />

        {/* Light Rays */}
        <LightRays
          raysOrigin="top-center"
          raysColor="#F5A83B"
          raysSpeed={0.6}
          lightSpread={0.7}
          rayLength={1.6}
          fadeDistance={1}
          saturation={1}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0}
          distortion={0}
          className="absolute inset-0"
        />

        {/* Vertically centered content container */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
          {/* Trace Lines + Video Globe Container */}
          <div className="mb-8 relative w-[1102px] h-[364px]">
            {/* Trace Lines Animated SVG - background */}
            <TraceLinesAnimated
              className="absolute inset-0 w-full h-full object-contain"
              duration={4}
              delay={0}
              beamColor="#FEDA24"
              beamColorSecondary="#FF8C32"
              pathColor="#444444"
              beamWidth={2}
              pathWidth={1}
            />

            {/* Video Globe - centered on top of trace lines */}
            <div className="absolute inset-0 flex items-center justify-center">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-[420px] h-[420px] object-contain mr-0.5"
              >
                <source src="/videos/Beelia ani.webm" type="video/webm" />
              </video>
            </div>

            {/* 3D Coin Overlay - Right Box */}
            <div
              className="absolute z-20 pointer-events-none"
              style={{
                left: '992px',
                top: '129px',
                width: '109px',
                height: '109px',
              }}
            >
              <Canvas camera={{ position: [0, 0, 4], fov: 45 }} gl={{ alpha: true }} dpr={[1, 2]}>
                <ambientLight intensity={0.8} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <Environment preset="city" />
                <CoinModel />
              </Canvas>
            </div>
          </div>

          {/* AIFOR Image */}
          <div className="w-[675px] h-[80px]">
            <Image
              src="/images/AIFOR.png"
              alt="AI For Everyone, by Everyone"
              width={675}
              height={80}
              className="w-full h-full object-contain"
              priority
            />
          </div>

          {/* Tagline Text - below AIFOR image */}
          <p className="mt-6 text-center uppercase text-white/80 text-[17px] leading-[32px] tracking-[0.04em] font-normal max-w-[605px]"
            style={{ fontFamily: 'var(--font-inria-sans), Inria Sans, sans-serif' }}
          >
            A curated AI marketplace where anyone can discover, trust, and use the right tools instantly, no technical skills required
          </p>

          {/* Join Waitlist Button - below tagline text */}
          <div className="mt-8">
            <Link
              href="/waitlist"
              className="group cursor-pointer block [perspective:1000px] [transform-style:preserve-3d]"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="waitlist-btn-wrapper">
                {isMounted ? (
                  <GlassSurface
                    width={270}
                    height={80}
                    borderRadius={50}
                    chromaticAberration={0.15}
                    redOffset={0}
                    greenOffset={10}
                    blueOffset={20}
                    distortionScale={-180}
                    blur={16}
                    brightness={60}
                    opacity={0.95}
                    className="group-hover:scale-105 transition-all duration-500 ease-out"
                    style={{
                      transform: isHovered
                        ? 'translateZ(20px) rotateX(-1deg) rotateY(1deg) scale(1.03)'
                        : 'translateZ(10px) rotateX(0deg) rotateY(0deg) scale(1)',
                      boxShadow: isHovered
                        ? '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.15) inset'
                        : '0 10px 30px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
                    }}
                  >
                    <div className="w-full flex items-center justify-center gap-3 relative z-10">
                      <span
                        className="waitlist-btn-text uppercase text-[20px] font-extrabold leading-[100%] tracking-[0.06em]"
                        style={{ fontFamily: 'var(--font-inria-sans), sans-serif' }}
                      >
                        join waitlist
                      </span>
                      <Image
                        src="/icons/Vector.svg"
                        alt="arrow"
                        width={20}
                        height={20}
                        className="waitlist-btn-arrow transition-transform duration-500 ease-in-out"
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
        </div>
      </section>
    </>
  )
}
