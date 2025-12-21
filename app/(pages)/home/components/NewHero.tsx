'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import LightRays from '@/components/LightRays'
import Image from 'next/image'
import GlassSurface from '@/components/GlassSurface'
import TraceLinesAnimated from '@/components/ui/trace-lines-animated'
import HorizontalBeamAnimated from '@/components/ui/horizontal-beam-animated'
import { Canvas } from '@react-three/fiber'
import { CoinModel } from '@/components/3d/CoinModel'
import { Environment } from '@react-three/drei'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'

export function NewHero() {
  const [isHovered, setIsHovered] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showPhase2, setShowPhase2] = useState(false)
  const [traceLinesScrollProgress, setTraceLinesScrollProgress] = useState(0)
  const heroRef = useRef<HTMLElement>(null)
  const beeliaVideoRef = useRef<HTMLVideoElement>(null)
  const phase2VideoRef = useRef<HTMLVideoElement>(null)

  // Track scroll progress for this section
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  })

  // Track when globe should stop moving independently and scroll normally
  const [globeShouldScroll, setGlobeShouldScroll] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return
      
      const scrollY = window.scrollY
      const heroHeight = heroRef.current.offsetHeight
      
      // When hero section ends (scroll reaches bottom of hero), enable normal scrolling
      // Use a small threshold to ensure smooth transition
      if (scrollY >= heroHeight - 50) {
        setGlobeShouldScroll(true)
      } else {
        setGlobeShouldScroll(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Transform scroll progress to opacity and scale values
  // Everything starts animating immediately on first scroll
  // Content zooms IN first, then gets blurry, stays fixed, then fades out
  // Scale: starts at 1.0 (normal), zooms in to 1.2 at 30%, stays at 1.2 while fading
  const contentOpacity = useTransform(scrollYProgress, [0, 0.3, 0.5], [1, 1, 0])
  const contentScale = useTransform(scrollYProgress, [0, 0.3, 0.5], [1, 1.2, 1.2])
  // Blur starts AFTER zoom completes - no blur during zoom (0-30%), then blur increases (30-50%)
  const contentBlur = useTransform(scrollYProgress, [0, 0.3, 0.5], [0, 0, 10])
  const contentBlurFilter = useTransform(contentBlur, (blur) => `blur(${blur}px)`)

  // Trace lines scale animation only - no fade out, no clip-path
  const traceLinesScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9])

  // Track when animation starts to disable hover effects and update trace lines retraction
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest > 0 && !isAnimating) {
      setIsAnimating(true)
      setIsHovered(false) // Disable hover when animation starts
    } else if (latest === 0 && isAnimating) {
      setIsAnimating(false)
    }
    
    // Update trace lines retraction progress - increased strength: complete retraction at 0.3 scroll progress
    const retractionProgress = latest <= 0.3 ? latest / 0.3 : 1
    setTraceLinesScrollProgress(retractionProgress)
  })

  // Track scroll to detect when globe reaches AboutProduct section with smooth transition
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return
      
      const scrollY = window.scrollY
      const heroHeight = heroRef.current.offsetHeight
      
      // Smooth transition zone: start fading Phase 2 in at 80% of hero height
      const transitionStart = heroHeight * 0.8
      
      if (scrollY >= transitionStart && !showPhase2) {
        // Start showing Phase 2 video - preload and play
        setShowPhase2(true)
        if (phase2VideoRef.current) {
          phase2VideoRef.current.load()
          phase2VideoRef.current.play().catch(() => {})
        }
      }
      
      if (scrollY < transitionStart && showPhase2) {
        // Switch back to Beelia Ani 2 if scrolling back up
        setShowPhase2(false)
        if (beeliaVideoRef.current) {
          beeliaVideoRef.current.play().catch(() => {})
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [showPhase2])

  // Calculate opacity for smooth cross-fade transition based on scroll
  const phase2Opacity = useTransform(
    scrollYProgress,
    (latest) => {
      if (!heroRef.current) return 0
      // Start transition at 80% scroll progress, complete at 100%
      const transitionStart = 0.8
      if (latest < transitionStart) return 0
      if (latest >= 1) return 1
      // Smooth fade between transitionStart and 1
      const progress = (latest - transitionStart) / (1 - transitionStart)
      return Math.min(1, Math.max(0, progress))
    }
  )
  
  const beeliaOpacity = useTransform(phase2Opacity, (opacity) => 1 - opacity)

  useEffect(() => {
    setIsMounted(true)
  }, [])

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
        .waitlist-btn-wrapper.no-hover::after {
          transform: translateX(-100%) !important;
        }
        .waitlist-btn-wrapper.no-hover:hover::after {
          transform: translateX(-100%) !important;
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
        .waitlist-btn-wrapper.no-hover:hover .waitlist-btn-text {
          color: #FFFFFF !important;
          font-weight: normal !important;
        }
        .waitlist-btn-arrow {
          filter: brightness(0) invert(1);
          transition: filter 0.3s ease, transform 0.5s ease-in-out;
        }
        .waitlist-btn-wrapper:hover .waitlist-btn-arrow {
          filter: brightness(0) invert(0);
        }
        .waitlist-btn-wrapper.no-hover:hover .waitlist-btn-arrow {
          filter: brightness(0) invert(1) !important;
          transform: rotate(0deg) !important;
        }
      `}</style>

      <section ref={heroRef} className="h-screen bg-transparent relative overflow-visible">
        {/* Video Globe Container - Fixed positioning, stops moving when reaching AboutProduct */}
        {/* Aligned with trace lines position: pt-32 (128px) + trace lines height/2 (182px) = ~310px from top */}
        {/* Single container that changes positioning - keeps videos playing */}
        <div 
          className={`${globeShouldScroll ? 'absolute' : 'fixed'} left-1/2 -translate-x-1/2 pointer-events-none`}
          style={{
            width: '420px',
            height: '420px',
            ...(globeShouldScroll 
              ? { bottom: '-520px', zIndex: 50 } // Move down further into AboutProduct section when scrolling pauses
              : { top: 'calc(128px + 182px - 210px)', zIndex: 50 } // pt-32 + trace lines center - half globe height
            )
          }}
        >
          {/* Video Globe */}
          <div className="w-full h-full flex items-center justify-center relative">
            {/* Beelia Ani 2 Video */}
            <motion.video
              ref={beeliaVideoRef}
              autoPlay
              loop
              muted
              playsInline
              className="w-[420px] h-[420px] object-contain mr-0.5 absolute"
              style={{
                opacity: beeliaOpacity,
                willChange: 'opacity'
              }}
            >
              <source src="/videos/Beelia ani 2.webm" type="video/webm" />
            </motion.video>

            {/* Phase 2 Video */}
            <motion.video
              ref={phase2VideoRef}
              loop
              muted
              playsInline
              className="w-[420px] h-[420px] object-contain mr-0.5 absolute"
              style={{
                opacity: phase2Opacity,
                willChange: 'opacity'
              }}
            >
              <source src="/videos/Phase 2.webm" type="video/webm" />
            </motion.video>
          </div>
        </div>

        {/* Light Rays */}
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

        {/* Content container with proper spacing - flex column layout */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-start pt-32">
          {/* Trace Lines Animated SVG - positioned at top with scroll animation */}
          <motion.div 
            className="relative w-[1102px] h-[364px] mb-12"
            style={{
              scale: traceLinesScale,
              willChange: 'transform'
            }}
          >
            {/* Horizontal beams - separate component - render first so it's behind */}
            <HorizontalBeamAnimated
              className="absolute inset-0 w-full h-full object-contain"
              style={{ zIndex: 0 }}
              duration={4}
              delay={0}
              beamColor="#FEDA24"
              beamColorSecondary="#FF8C32"
              pathColor="#444444"
              beamWidth={2}
              pathWidth={1}
              scrollProgress={traceLinesScrollProgress}
              isRetracting={traceLinesScrollProgress > 0}
            />
            
            {/* Top and bottom beams - render after so dots appear on top */}
            <TraceLinesAnimated
              className="absolute inset-0 w-full h-full object-contain"
              style={{ zIndex: 1 }}
              duration={4}
              delay={0}
              beamColor="#FEDA24"
              beamColorSecondary="#FF8C32"
              pathColor="#444444"
              beamWidth={2}
              pathWidth={1}
              scrollProgress={traceLinesScrollProgress}
              isRetracting={traceLinesScrollProgress > 0}
            />
            
            {/* 3D DollarBill Overlay - Right Box */}
            <div className="absolute z-20 pointer-events-none left-[990.16px] top-[129.481px] w-[109.32px] h-[109.32px]">
              <Canvas camera={{ position: [0, 0, 4.5], fov: 40 }} gl={{ alpha: true }} dpr={[1, 2]}>
                <ambientLight intensity={0.8} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <Environment preset="sunset" />
                <CoinModel />
              </Canvas>
            </div>
          </motion.div>

          {/* Content wrapper with scroll animations */}
          <motion.div
            className="flex flex-col items-center"
            style={{
              opacity: contentOpacity,
              scale: contentScale,
              filter: contentBlurFilter,
              transformStyle: 'preserve-3d',
              willChange: 'opacity, transform, filter'
            }}
          >
            {/* AIFOR Image - below trace lines */}
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
            <p className="mt-6 text-center uppercase text-white/80 text-[17px] leading-[32px] tracking-[0.04em] font-normal max-w-[605px] font-inria-sans">
              A curated AI marketplace where anyone can discover, trust, and use the right tools instantly, no technical skills required
            </p>

            {/* Join Waitlist Button - below tagline text */}
            <div className="mt-8">
            <Link
              href="/waitlist"
              className={`group block [perspective:1000px] [transform-style:preserve-3d] ${isAnimating ? 'pointer-events-none' : 'cursor-pointer'}`}
              onMouseEnter={() => !isAnimating && setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className={`waitlist-btn-wrapper ${isAnimating ? 'no-hover' : ''}`}>
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
                    className={`${isAnimating ? '' : 'group-hover:scale-105'} transition-all duration-500 ease-out ${
                      isHovered && !isAnimating
                        ? '[transform:translateZ(20px)_rotateX(-1deg)_rotateY(1deg)_scale(1.03)] [box-shadow:0_20px_40px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.15)_inset]'
                        : '[transform:translateZ(10px)_rotateX(0deg)_rotateY(0deg)_scale(1)] [box-shadow:0_10px_30px_rgba(0,0,0,0.2),0_0_0_1px_rgba(255,255,255,0.1)_inset]'
                    }`}
                  >
                    <div className="w-full flex items-center justify-center gap-3 relative z-10">
                      <span className="waitlist-btn-text uppercase text-[20px] font-extrabold leading-[100%] tracking-[0.06em] font-inria-sans">
                        join waitlist
                      </span>
                      <Image
                        src="/icons/Vector.svg"
                        alt="arrow"
                        width={20}
                        height={20}
                        className={`waitlist-btn-arrow transition-transform duration-500 ease-in-out ${isHovered ? 'rotate-45' : 'rotate-0'}`}
                      />
                    </div>
                  </GlassSurface>
                ) : null}
              </div>
            </Link>
          </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
