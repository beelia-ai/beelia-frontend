'use client'

import Image from 'next/image'

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative w-full min-h-screen bg-black overflow-hidden">
      {/* Animated Waves CSS */}
      <style>{`
        @keyframes move-forever {
          0% { transform: translate3d(-90px, 0, 0); }
          100% { transform: translate3d(85px, 0, 0); }
        }
        .waves-container {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .waves {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 40vh;
          min-height: 200px;
          max-height: 400px;
        }
        .waves .parallax > use {
          animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
        }
        .waves .parallax > use:nth-child(1) {
          animation-delay: -2s;
          animation-duration: 7s;
        }
        .waves .parallax > use:nth-child(2) {
          animation-delay: -3s;
          animation-duration: 10s;
        }
        .waves .parallax > use:nth-child(3) {
          animation-delay: -4s;
          animation-duration: 13s;
        }
        .waves .parallax > use:nth-child(4) {
          animation-delay: -5s;
          animation-duration: 20s;
        }
        .waves .parallax > use:nth-child(5) {
          animation-delay: -6s;
          animation-duration: 15s;
        }
      `}</style>

      {/* Animated Waves Background - Blurred Flames Effect */}
      <div className="waves-container" style={{ zIndex: 1, filter: 'blur(50px)' }}>
        <svg 
          className="waves" 
          xmlns="http://www.w3.org/2000/svg" 
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28" 
          preserveAspectRatio="none" 
          shapeRendering="auto"
        >
          <defs>
            <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
            <linearGradient id="flame-gradient-1" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#EF941F" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
            <linearGradient id="flame-gradient-2" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#FEDA24" />
              <stop offset="100%" stopColor="#EF941F" />
            </linearGradient>
          </defs>
          <g className="parallax">
            <use xlinkHref="#gentle-wave" x="48" y="-5" fill="url(#flame-gradient-1)" opacity="0.9" />
            <use xlinkHref="#gentle-wave" x="48" y="0" fill="#FFD700" opacity="0.7" />
            <use xlinkHref="#gentle-wave" x="48" y="3" fill="url(#flame-gradient-2)" opacity="0.6" />
            <use xlinkHref="#gentle-wave" x="48" y="5" fill="#FEDA24" opacity="0.5" />
            <use xlinkHref="#gentle-wave" x="48" y="7" fill="#EF941F" opacity="0.8" />
          </g>
        </svg>
      </div>

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/10" style={{ zIndex: 2 }} />

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
