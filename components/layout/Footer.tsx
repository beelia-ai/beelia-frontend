'use client'

import Image from 'next/image'
import LiquidEther from '@/components/ui/liquid-ether'

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative w-full min-h-screen bg-black overflow-hidden">
      {/* Blurred Flames Background */}
      <div className="absolute inset-0" style={{ zIndex: 1, filter: 'blur(40px)' }}>
        <LiquidEther
          colors={['#FFD700', '#EF941F', '#FFD700']}
          mouseForce={5}
          cursorSize={200}
          isViscous={true}
          viscous={100}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.3}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.15}
          autoIntensity={0.8}
          takeoverDuration={0.8}
          autoResumeDelay={0}
          autoRampDuration={2}
        />
      </div>

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" style={{ zIndex: 2 }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen px-8 md:px-16 lg:px-24 py-12">
        
        {/* Scroll to Top Button */}
        <div className="flex justify-center pt-40 pb-16">
          <button
            onClick={scrollToTop}
            className="flex items-center gap-3 text-white/70 hover:text-white transition-colors duration-300 group"
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              className="transform group-hover:-translate-y-1 transition-transform duration-300"
            >
              <path d="M18 15l-6-6-6 6"/>
              <path d="M18 9l-6-6-6 6"/>
            </svg>
            <span 
              className="text-sm tracking-wider"
              style={{ fontFamily: 'var(--font-inria-sans), sans-serif' }}
            >
              scroll to the top
            </span>
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              className="transform group-hover:-translate-y-1 transition-transform duration-300"
            >
              <path d="M18 15l-6-6-6 6"/>
              <path d="M18 9l-6-6-6 6"/>
            </svg>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col justify-center">
          {/* Headline */}
          <h2 
            className="text-white max-w-xl mb-6"
            style={{ 
              fontFamily: 'var(--font-inria-sans), sans-serif',
              fontWeight: 700,
              fontSize: '42px',
              lineHeight: '122%',
              letterSpacing: '-0.02em'
            }}
          >
            The App Store for AI
          </h2>

          {/* Description */}
          <p 
            className="text-white max-w-xl"
            style={{ 
              fontFamily: 'var(--font-inria-sans), sans-serif',
              fontWeight: 400,
              fontSize: '23.1px',
              lineHeight: '130%',
              letterSpacing: '0'
            }}
          >
          giving people a seamless way to find the right tools and start using them instantly, no setup, no friction.
          </p>
        </div>

        {/* Bottom Section */}
        <div className="mt-auto">
          {/* Logo, Tagline and Links Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-8">
            {/* Logo and Tagline */}
            <div className="flex flex-col gap-3">
              <Image
                src="/icons/Beelia.svg"
                alt="Beelia Logo"
                width={150}
                height={40}
                className="h-10 w-auto"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              <p 
                style={{ 
                  fontFamily: 'var(--font-inria-sans), sans-serif',
                  fontWeight: 700,
                  fontSize: '16.8px',
                  lineHeight: '100%',
                  letterSpacing: '0',
                  textTransform: 'uppercase',
                  color: '#FFFFFF'
                }}
              >
                AI FOR EVERYONE, BY EVERYONE
              </p>
            </div>

            {/* Links Columns */}
            <div className="flex gap-16 md:gap-24">
              {/* Connect Column */}
              <div className="flex flex-col gap-4">
                <h3 
                  style={{ 
                    fontFamily: 'var(--font-inria-sans), sans-serif', 
                    fontWeight: 700,
                    fontSize: '18.9px',
                    lineHeight: '25.2px',
                    letterSpacing: '-0.02em',
                    color: '#FFFFFF' 
                  }}
                >
                  Connect
                </h3>
                <div className="flex flex-col gap-2">
                  <a 
                    href="https://instagram.com/beelia.ai" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors duration-300"
                    style={{ 
                      fontFamily: 'var(--font-inria-sans), sans-serif', 
                      fontWeight: 400,
                      fontSize: '15.75px',
                      lineHeight: '120%',
                      letterSpacing: '-0.02em',
                      textTransform: 'uppercase',
                      color: '#FAFAFA' 
                    }}
                  >
                    Instagram
                  </a>
                  <a 
                    href="https://linkedin.com/company/beelia" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors duration-300"
                    style={{ 
                      fontFamily: 'var(--font-inria-sans), sans-serif', 
                      fontWeight: 400,
                      fontSize: '15.75px',
                      lineHeight: '120%',
                      letterSpacing: '-0.02em',
                      textTransform: 'uppercase',
                      color: '#FAFAFA' 
                    }}
                  >
                    LinkedIn
                  </a>
                </div>
              </div>

              {/* Legal Column */}
              <div className="flex flex-col gap-4">
                <h3 
                  style={{ 
                    fontFamily: 'var(--font-inria-sans), sans-serif', 
                    fontWeight: 700,
                    fontSize: '18.9px',
                    lineHeight: '25.2px',
                    letterSpacing: '-0.02em',
                    color: '#FFFFFF' 
                  }}
                >
                  Legal
                </h3>
                <div className="flex flex-col gap-2">
                  <a 
                    href="/privacy-policy" 
                    className="hover:text-white transition-colors duration-300"
                    style={{ 
                      fontFamily: 'var(--font-inria-sans), sans-serif', 
                      fontWeight: 400,
                      fontSize: '15.75px',
                      lineHeight: '120%',
                      letterSpacing: '-0.02em',
                      textTransform: 'uppercase',
                      color: '#FAFAFA' 
                    }}
                  >
                    Privacy Policy
                  </a>
                  <a 
                    href="/terms-and-conditions" 
                    className="hover:text-white transition-colors duration-300"
                    style={{ 
                      fontFamily: 'var(--font-inria-sans), sans-serif', 
                      fontWeight: 400,
                      fontSize: '15.75px',
                      lineHeight: '120%',
                      letterSpacing: '-0.02em',
                      textTransform: 'uppercase',
                      color: '#FAFAFA' 
                    }}
                  >
                    Terms & Conditions
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-white/10 mb-6" />

          {/* Copyright */}
          <div className="flex justify-center">
            <p 
              style={{ 
                fontFamily: 'var(--font-inria-sans), sans-serif',
                fontWeight: 400,
                fontSize: '15.75px',
                lineHeight: '130%',
                letterSpacing: '0.02em',
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.6)'
              }}
            >
              © 2025 BEELIA. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
