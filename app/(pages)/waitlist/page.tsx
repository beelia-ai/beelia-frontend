'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ScrollSection, ScrollContainer } from '../home/components/ScrollSection'
import { Footer } from '@/components/layout/Footer'
import { GradientOrbs } from '@/components/ui'

const GlassSurface = dynamic(() => import('@/components/GlassSurface'), { 
  ssr: false,
  loading: () => (
    <div 
      className="flex items-center justify-center"
      style={{ 
        width: '100%', 
        height: '60px', 
        borderRadius: '50px',
        background: 'rgba(255, 255, 255, 0.1)',
      }}
    >
      <span className="text-white/50">Loading...</span>
    </div>
  )
})

// Scroll indicator component that hides on scroll
function ScrollIndicator() {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 100], [0.5, 0])
  
  return (
    <motion.div 
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
      style={{ opacity }}
    >
      <div className="flex flex-col items-center gap-2 animate-bounce">
        <span className="text-white/50 text-xs tracking-widest uppercase">Scroll</span>
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5"
          className="text-white/50"
        >
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>
    </motion.div>
  )
}

// Card wrapper component for consistent styling
function CardSection({ 
  children, 
  showGlow = true,
}: { 
  children: React.ReactNode
  showGlow?: boolean
}) {
  return (
    <div 
      className="relative overflow-hidden min-h-screen"
    >
      {/* Card top edge glow */}
      {showGlow && (
        <div 
          className="absolute top-0 left-0 right-0 h-[2px] z-20"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(254,218,36,0.4) 15%, rgba(254,218,36,0.8) 50%, rgba(254,218,36,0.4) 85%, transparent 100%)',
            boxShadow: '0 0 30px rgba(254,218,36,0.4), 0 0 60px rgba(254,218,36,0.15)',
          }}
        />
      )}
      
      {/* Subtle inner glow at top */}
      <div 
        className="absolute top-0 left-0 right-0 h-40 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(180deg, rgba(254,218,36,0.03) 0%, transparent 100%)',
        }}
      />
      
      {/* Content */}
      <div className="relative z-0">
        {children}
      </div>
    </div>
  )
}

// Waitlist Hero Content
function WaitlistHero() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [platform, setPlatform] = useState('')
  const [step, setStep] = useState<'email' | 'details' | 'complete'>('email')
  const [isLoading, setIsLoading] = useState(false)
  const [isButtonHovered, setIsButtonHovered] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Step 1: Submit email
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to join waitlist')
      }
      
      // Move to step 2 - collect more details
      setStep('details')
    } catch (error) {
      console.error('Waitlist submission error:', error)
      alert(error instanceof Error ? error.message : 'Failed to join waitlist. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Step 2: Submit additional details
  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          name, 
          platform,
          action: 'update'
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update details')
      }
      
      // Move to complete state
      setStep('complete')
    } catch (error) {
      console.error('Details submission error:', error)
      alert(error instanceof Error ? error.message : 'Failed to submit details. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      {/* Hover fill styles */}
      <style>{`
        .glass-btn-wrapper {
          position: relative;
          overflow: hidden;
          border-radius: 50px;
          display: block;
        }
        .glass-btn-wrapper::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #FEDA24 0%, #EF941F 50%, #FEDA24 100%);
          transition: clip-path 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          clip-path: inset(0 100% 0 0);
          z-index: 1;
          border-radius: 50px;
          pointer-events: none;
        }
        .glass-btn-wrapper:hover::after {
          clip-path: inset(0 0 0 0);
        }
        .glass-btn-wrapper > * {
          position: relative;
          z-index: 2;
        }
      `}</style>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6">
        {step === 'complete' ? (
          /* Complete State */
          <div className="text-center max-w-lg">
            <div 
              className="w-16 h-16 mx-auto mb-10 rounded-full flex items-center justify-center"
              style={{ 
                background: 'rgba(254, 218, 36, 0.1)',
                border: '1px solid rgba(254, 218, 36, 0.2)'
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FEDA24" strokeWidth="1.5">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>

            <h1 
              className="text-white mb-4"
              style={{ 
                fontFamily: 'var(--font-inria-sans), sans-serif',
                fontWeight: 400,
                fontSize: '32px',
                letterSpacing: '-0.02em'
              }}
            >
              You&apos;re all set!
            </h1>

            <p 
              className="text-white/40 mb-12"
              style={{ 
                fontFamily: 'var(--font-inria-sans), sans-serif',
                fontSize: '15px',
                lineHeight: '170%'
              }}
            >
              Thanks for joining, {name || 'friend'}! <br />
              We&apos;ll notify you when Beelia launches.
            </p>

            <Link
              href="/home"
              className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-300"
              style={{ 
                fontFamily: 'var(--font-inria-sans), sans-serif',
                fontSize: '14px'
              }}
            >
              Return home
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        ) : step === 'details' ? (
          /* Step 2: Additional Details */
          <div className="w-full max-w-md text-center">
            {/* Success indicator */}
            <div 
              className="w-12 h-12 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{ 
                background: 'rgba(254, 218, 36, 0.1)',
                border: '1px solid rgba(254, 218, 36, 0.2)'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FEDA24" strokeWidth="1.5">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>

            {/* Heading */}
            <h1 
              className="text-white mb-3"
              style={{ 
                fontFamily: 'var(--font-inria-sans), sans-serif',
                fontWeight: 400,
                fontSize: 'clamp(28px, 5vw, 40px)',
                lineHeight: '115%',
                letterSpacing: '-0.03em'
              }}
            >
              Almost there!
            </h1>

            {/* Description */}
            <p 
              className="text-white/40 mb-8 max-w-sm mx-auto"
              style={{ 
                fontFamily: 'var(--font-inria-sans), sans-serif',
                fontWeight: 400,
                fontSize: '15px',
                lineHeight: '170%'
              }}
            >
              Tell us a bit more about yourself (optional)
            </p>

            {/* Form */}
            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-6 py-4 bg-white/[0.03] text-white placeholder-white/30 outline-none transition-all duration-300 focus:bg-white/[0.05]"
                  style={{ 
                    fontFamily: 'var(--font-inria-sans), sans-serif',
                    fontSize: '15px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '50px',
                    height: '60px',
                  }}
                />
              </div>

              <div className="relative">
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-6 py-4 bg-white/[0.03] text-white outline-none transition-all duration-300 focus:bg-white/[0.05] appearance-none cursor-pointer"
                  style={{ 
                    fontFamily: 'var(--font-inria-sans), sans-serif',
                    fontSize: '15px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '50px',
                    height: '60px',
                    color: platform ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)',
                  }}
                >
                  <option value="" style={{ background: '#1a1a1a', color: 'rgba(255, 255, 255, 0.3)' }}>How did you hear about us?</option>
                  <option value="twitter" style={{ background: '#1a1a1a', color: '#FFFFFF' }}>Twitter / X</option>
                  <option value="linkedin" style={{ background: '#1a1a1a', color: '#FFFFFF' }}>LinkedIn</option>
                  <option value="instagram" style={{ background: '#1a1a1a', color: '#FFFFFF' }}>Instagram</option>
                  <option value="friend" style={{ background: '#1a1a1a', color: '#FFFFFF' }}>Friend / Referral</option>
                  <option value="search" style={{ background: '#1a1a1a', color: '#FFFFFF' }}>Google Search</option>
                  <option value="other" style={{ background: '#1a1a1a', color: '#FFFFFF' }}>Other</option>
                </select>
                {/* Custom dropdown arrow */}
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>
              </div>

              {isMounted ? (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full group cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    perspective: '1000px',
                    transformStyle: 'preserve-3d',
                  }}
                  onMouseEnter={() => setIsButtonHovered(true)}
                  onMouseLeave={() => setIsButtonHovered(false)}
                >
                  <div className="glass-btn-wrapper" style={{ width: '100%' }}>
                    <GlassSurface
                      width={448}
                      height={60}
                      borderRadius={50}
                      chromaticAberration={isButtonHovered ? 0.3 : 0.15}
                      style={{
                        width: '100%',
                        maxWidth: '100%',
                        transform: isButtonHovered 
                          ? 'translateZ(20px) rotateX(-1deg) rotateY(1deg) scale(1.02)' 
                          : 'translateZ(10px) rotateX(0deg) rotateY(0deg) scale(1)',
                        boxShadow: isButtonHovered
                          ? '0 20px 40px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.15) inset, 0 0 50px rgba(147, 51, 234, 0.4)'
                          : '0 15px 30px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, 0 0 40px rgba(147, 51, 234, 0.2)',
                        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    >
                      <div className="w-full flex items-center justify-center gap-3 relative z-10">
                        {isLoading ? (
                          <span className="flex items-center gap-2 text-white">
                            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                            </svg>
                            <span 
                              style={{
                                fontFamily: 'var(--font-inria-sans), sans-serif',
                                fontSize: '18px',
                                lineHeight: '100%',
                                letterSpacing: '0.06em',
                                textTransform: 'uppercase',
                              }}
                            >
                              Submitting...
                            </span>
                          </span>
                        ) : (
                          <>
                            <span 
                              className="text-white uppercase"
                              style={{
                                fontFamily: 'var(--font-inria-sans), sans-serif',
                                fontSize: '18px',
                                lineHeight: '100%',
                                letterSpacing: '0.06em',
                              }}
                            >
                              Submit
                            </span>
                            <Image
                              src="/icons/Vector.svg"
                              alt="arrow"
                              width={18}
                              height={18}
                              className="transition-transform duration-500 ease-in-out group-hover:rotate-45"
                            />
                          </>
                        )}
                      </div>
                    </GlassSurface>
                  </div>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-full flex items-center justify-center gap-3 transition-all duration-300"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <span 
                    className="text-white uppercase"
                    style={{
                      fontFamily: 'var(--font-inria-sans), sans-serif',
                      fontSize: '18px',
                      lineHeight: '100%',
                      letterSpacing: '0.06em',
                    }}
                  >
                    Submit
                  </span>
                </button>
              )}
            </form>

            {/* Skip link */}
            <button
              onClick={() => setStep('complete')}
              className="mt-6 text-white/30 hover:text-white/50 transition-colors duration-300"
              style={{ 
                fontFamily: 'var(--font-inria-sans), sans-serif',
                fontSize: '13px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Skip for now
            </button>
          </div>
        ) : (
          /* Step 1: Email Form */
          <div className="w-full max-w-md text-center">
            {/* Heading */}
            <h1 
              className="text-white mb-5"
              style={{ 
                fontFamily: 'var(--font-inria-sans), sans-serif',
                fontWeight: 400,
                fontSize: 'clamp(36px, 6vw, 52px)',
                lineHeight: '115%',
                letterSpacing: '-0.03em'
              }}
            >
              Get early access to{' '}
              <span style={{ color: '#FEDA24' }}>Beelia</span>
            </h1>

            {/* Description */}
            <p 
              className="text-white/40 mb-12 max-w-sm mx-auto"
              style={{ 
                fontFamily: 'var(--font-inria-sans), sans-serif',
                fontWeight: 400,
                fontSize: '15px',
                lineHeight: '170%'
              }}
            >
              The App Store for AI. Join the waitlist to be first in line when we launch.
            </p>

            {/* Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-6 py-4 bg-white/[0.03] text-white placeholder-white/30 outline-none transition-all duration-300 focus:bg-white/[0.05]"
                  style={{ 
                    fontFamily: 'var(--font-inria-sans), sans-serif',
                    fontSize: '15px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '50px',
                    height: '60px',
                  }}
                />
              </div>

              {isMounted ? (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full group cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    perspective: '1000px',
                    transformStyle: 'preserve-3d',
                  }}
                  onMouseEnter={() => setIsButtonHovered(true)}
                  onMouseLeave={() => setIsButtonHovered(false)}
                >
                  <div className="glass-btn-wrapper" style={{ width: '100%' }}>
                    <GlassSurface
                      width={448}
                      height={60}
                      borderRadius={50}
                      chromaticAberration={isButtonHovered ? 0.3 : 0.15}
                      style={{
                        width: '100%',
                        maxWidth: '100%',
                        transform: isButtonHovered 
                          ? 'translateZ(20px) rotateX(-1deg) rotateY(1deg) scale(1.02)' 
                          : 'translateZ(10px) rotateX(0deg) rotateY(0deg) scale(1)',
                        boxShadow: isButtonHovered
                          ? '0 20px 40px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.15) inset, 0 0 50px rgba(147, 51, 234, 0.4)'
                          : '0 15px 30px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, 0 0 40px rgba(147, 51, 234, 0.2)',
                        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    >
                      <div className="w-full flex items-center justify-center gap-3 relative z-10">
                        {isLoading ? (
                          <span className="flex items-center gap-2 text-white">
                            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                            </svg>
                            <span 
                              style={{
                                fontFamily: 'var(--font-inria-sans), sans-serif',
                                fontSize: '18px',
                                lineHeight: '100%',
                                letterSpacing: '0.06em',
                                textTransform: 'uppercase',
                              }}
                            >
                              Joining...
                            </span>
                          </span>
                        ) : (
                          <>
                            <span 
                              className="text-white uppercase"
                              style={{
                                fontFamily: 'var(--font-inria-sans), sans-serif',
                                fontSize: '18px',
                                lineHeight: '100%',
                                letterSpacing: '0.06em',
                              }}
                            >
                              Join Waitlist
                            </span>
                            <Image
                              src="/icons/Vector.svg"
                              alt="arrow"
                              width={18}
                              height={18}
                              className="transition-transform duration-500 ease-in-out group-hover:rotate-45"
                            />
                          </>
                        )}
                      </div>
                    </GlassSurface>
                  </div>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-full flex items-center justify-center gap-3 transition-all duration-300"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <span 
                    className="text-white uppercase"
                    style={{
                      fontFamily: 'var(--font-inria-sans), sans-serif',
                      fontSize: '18px',
                      lineHeight: '100%',
                      letterSpacing: '0.06em',
                    }}
                  >
                    Join Waitlist
                  </span>
                </button>
              )}
            </form>

            {/* Privacy Note */}
            <p 
              className="text-white/25 mt-6"
              style={{ 
                fontFamily: 'var(--font-inria-sans), sans-serif',
                fontSize: '12px'
              }}
            >
              No spam. Unsubscribe anytime.
            </p>

            {/* Social Proof */}
            <div className="mt-16 pt-8 border-t border-white/[0.06]">
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <p 
                    className="text-white mb-1"
                    style={{ 
                      fontFamily: 'var(--font-inria-sans), sans-serif',
                      fontWeight: 500,
                      fontSize: '20px',
                      letterSpacing: '-0.02em'
                    }}
                  >
                    500+
                  </p>
                  <p 
                    className="text-white/30"
                    style={{ 
                      fontFamily: 'var(--font-inria-sans), sans-serif',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                  >
                    Waitlist
                  </p>
                </div>
                
                <div className="w-px h-8 bg-white/[0.06]" />
                
                <div className="text-center">
                  <p 
                    className="text-white mb-1"
                    style={{ 
                      fontFamily: 'var(--font-inria-sans), sans-serif',
                      fontWeight: 500,
                      fontSize: '20px',
                      letterSpacing: '-0.02em'
                    }}
                  >
                    Q1 &apos;25
                  </p>
                  <p 
                    className="text-white/30"
                    style={{ 
                      fontFamily: 'var(--font-inria-sans), sans-serif',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                  >
                    Launch
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function WaitlistPage() {
  // Hide the global footer on this page since we have our own scroll-animated one
  useEffect(() => {
    const globalFooter = document.querySelector('body > div > footer')
    if (globalFooter) {
      (globalFooter as HTMLElement).style.display = 'none'
    }
    return () => {
      if (globalFooter) {
        (globalFooter as HTMLElement).style.display = ''
      }
    }
  }, [])

  return (
    <main className="relative min-h-screen bg-black overflow-hidden">
      {/* Global Background - Fixed, covers entire page */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <GradientOrbs 
          count={20}
          animate={true}
          showGrid={true}
          gridOpacity={0.06}
        />
      </div>
      
      {/* Scroll Sections */}
      <div className="relative z-10">
        <ScrollContainer>
          {/* Waitlist Hero Section */}
          <ScrollSection index={0}>
            <WaitlistHero />
          </ScrollSection>
          
          {/* Footer Section */}
          <ScrollSection index={1}>
            <CardSection>
              <Footer />
            </CardSection>
          </ScrollSection>
        </ScrollContainer>
      </div>
      
      {/* Scroll indicator - hides on scroll */}
      <ScrollIndicator />
    </main>
  )
}
