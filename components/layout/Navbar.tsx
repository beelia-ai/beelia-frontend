'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import GlassSurface from '@/components/GlassSurface'

interface NavbarProps {
  forceShow?: boolean
}

export function Navbar({ forceShow = false }: NavbarProps = {}) {
  const [isHovered, setIsHovered] = useState(false)
  const pathname = usePathname()
  const isWaitlistPage = pathname === '/waitlist'
  const isHomePage = pathname === '/home'

  // Hide navbar on home page unless forced to show
  if (isHomePage && !forceShow) {
    return null
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Hover fill styles */}
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
          height: 65px;
          background: linear-gradient(135deg, #FEDA24 0%, #EF941F 50%, #FEDA24 100%);
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateX(-100%);
          z-index: 1;
          border-radius: 50px;
          pointer-events: none;
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
        }
        .nav-link {
          position: relative;
          color: rgba(255, 255, 255, 0.7);
          transition: color 0.3s ease;
        }
        .nav-link:hover {
          color: #FFFFFF;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 1px;
          background: #FEDA24;
          transition: width 0.3s ease;
        }
        .nav-link:hover::after {
          width: 100%;
        }
      `}</style>

      {/* Full width navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[9999] px-8 md:px-16 lg:px-24 py-6">
        <div className="grid grid-cols-3 items-center w-full">
          {/* Logo on the left */}
          <div className="flex items-center justify-start">
            <Link href="/home" className="flex items-center gap-2">
              <Image
                src="/icons/Beelia.svg"
                alt="Beelia Logo"
                width={150}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Navigation links in the center - hidden on waitlist page */}
          <div className="flex items-center justify-center">
            {!isWaitlistPage && (
              <div className="hidden md:flex items-center gap-12">
                <button
                  onClick={() => {}}
                  className="nav-link cursor-pointer"
                  style={{
                    fontFamily: 'var(--font-inria-sans), sans-serif',
                    fontSize: '16px',
                    fontWeight: 400,
                    background: 'none',
                    border: 'none',
                  }}
                >
                  Users
                </button>
                <button
                  onClick={() => scrollToSection('about-company')}
                  className="nav-link cursor-pointer"
                  style={{
                    fontFamily: 'var(--font-inria-sans), sans-serif',
                    fontSize: '16px',
                    fontWeight: 400,
                    background: 'none',
                    border: 'none',
                  }}
                >
                  Creators
                </button>
                <button
                  onClick={() => scrollToSection('footer')}
                  className="nav-link cursor-pointer"
                  style={{
                    fontFamily: 'var(--font-inria-sans), sans-serif',
                    fontSize: '16px',
                    fontWeight: 400,
                    background: 'none',
                    border: 'none',
                  }}
                >
                  Investors
                </button>
              </div>
            )}
          </div>

          {/* JOIN WAITLIST button on the right */}
          <div className="flex items-center justify-end">
            <Link 
              href={isWaitlistPage ? "/home" : "/waitlist"}
              className="group cursor-pointer block"
              style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d',
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
            <div className="waitlist-btn-wrapper">
              <GlassSurface
                width={200}
                height={55}
                borderRadius={50}
                chromaticAberration={isHovered ? 0.4 : 0.25}
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
                  {isWaitlistPage && (
                    <Image
                      src="/icons/Vector.svg"
                      alt="arrow"
                      width={16}
                      height={16}
                      className="transition-transform duration-500 ease-in-out rotate-[225deg] group-hover:rotate-[270deg]"
                    />
                  )}
                  <span 
                    className="waitlist-btn-text uppercase"
                    style={{
                      fontFamily: 'var(--font-inria-sans), sans-serif',
                      fontSize: '14px',
                      lineHeight: '100%',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {isWaitlistPage ? 'back home' : 'join waitlist'}
                  </span>
                  {!isWaitlistPage && (
                    <Image
                      src="/icons/Vector.svg"
                      alt="arrow"
                      width={16}
                      height={16}
                      className="transition-transform duration-500 ease-in-out group-hover:rotate-45"
                    />
                  )}
                </div>
              </GlassSurface>
            </div>
          </Link>
          </div>
        </div>
      </nav>
    </>
  )
}
