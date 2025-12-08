'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
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

export default function WaitlistPage() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isButtonHovered, setIsButtonHovered] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
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
      
      setIsSubmitted(true)
    } catch (error) {
      console.error('Waitlist submission error:', error)
      // You can add error handling UI here if needed
      alert(error instanceof Error ? error.message : 'Failed to join waitlist. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen bg-black overflow-hidden">
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

      {/* Background elements for glass refraction - randomly spawned orbs */}
      <GradientOrbs className="fixed" count={15} />

      {/* Noise texture overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />


      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-6">
        {isSubmitted ? (
          /* Success State */
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
              You&apos;re on the list
            </h1>

            <p 
              className="text-white/40 mb-12"
              style={{ 
                fontFamily: 'var(--font-inria-sans), sans-serif',
                fontSize: '15px',
                lineHeight: '170%'
              }}
            >
              We&apos;ll notify you when Beelia launches. <br />
              Check your inbox for a confirmation email.
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
        ) : (
          /* Form State */
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
            <form onSubmit={handleSubmit} className="space-y-4">
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
                      chromaticAberration={isButtonHovered ? 0.4 : 0.25}
                      style={{
                        width: '100%',
                        maxWidth: '100%',
                        transform: isButtonHovered 
                          ? 'translateZ(30px) rotateX(-2deg) rotateY(2deg) scale(1.02)' 
                          : 'translateZ(20px) rotateX(0deg) rotateY(0deg) scale(1)',
                        boxShadow: isButtonHovered
                          ? '0 30px 60px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2) inset, 0 0 80px rgba(147, 51, 234, 0.5)'
                          : '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, 0 0 60px rgba(147, 51, 234, 0.3)',
                        transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1), filter 0.7s ease-out, box-shadow 0.7s ease-out',
                        willChange: 'transform, filter, box-shadow',
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

    </main>
  )
}
