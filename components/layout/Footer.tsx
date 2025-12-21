'use client'

import Image from 'next/image'

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer id="footer" className="relative w-full min-h-screen overflow-hidden">
      {/* Flame Background Container */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {/* Static Bottom Layer */}
        <Image
          src="/images/image 365.png"
          alt="Footer background"
          width={2000}
          height={1400}
          className="absolute w-auto h-auto max-w-none animate-oscillate-clockwise"
          style={{
            zIndex: 1,
            width: '2800px',
            height: '1700px',
            bottom: '-550px',
            left: '-400px',
            transform: 'rotate(10deg)',
            transformOrigin: 'center center',
            opacity: 0.9,
          }}
          priority
        />
        {/* Top Layer */}
        <Image
          src="/images/image 366.png"
          alt="Footer flame effect"
          width={2000}
          height={1400}
          className="absolute w-auto h-auto max-w-none animate-oscillate-counterclockwise"
          style={{
            zIndex: 3,
            width: '1400px',
            height: '2000px',
            bottom: '-800px',
            left: '-200px',
            transform: 'rotate(0deg)',
            transformOrigin: 'center center',
            opacity: 1,
            mixBlendMode: 'screen',
          }}
          priority
        />
      </div>

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
              style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
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
              fontFamily: 'var(--font-outfit), sans-serif',
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
              fontFamily: 'var(--font-outfit), sans-serif',
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
            <div className="flex flex-col items-start gap-3">
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
                  fontFamily: 'var(--font-outfit), sans-serif',
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
                    fontFamily: 'var(--font-outfit), sans-serif', 
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
                      fontFamily: 'var(--font-outfit), sans-serif', 
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
                      fontFamily: 'var(--font-outfit), sans-serif', 
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
                    fontFamily: 'var(--font-outfit), sans-serif', 
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
                      fontFamily: 'var(--font-outfit), sans-serif', 
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
                      fontFamily: 'var(--font-outfit), sans-serif', 
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
                fontFamily: 'var(--font-outfit), sans-serif',
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
