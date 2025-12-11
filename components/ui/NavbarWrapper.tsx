"use client";

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarLogo,
  NavbarButton,
} from "@/components/ui/resizable-navbar";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import GlassSurface from "@/components/GlassSurface";

const navItems = [
  { name: "Users", link: "#users" },
  { name: "Creators", link: "#creators" },
  { name: "Investors", link: "#investors" },
];

export function NavbarWrapper() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const isWaitlistPage = pathname === "/waitlist";

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <Link 
              href={isWaitlistPage ? "/" : "/waitlist"}
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
                    chromaticAberration={0}
                    redOffset={0}
                    greenOffset={0}
                    blueOffset={0}
                    distortionScale={0}
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
                      {isWaitlistPage && (
                        <Image
                          src="/icons/Vector.svg"
                          alt="arrow"
                          width={16}
                          height={16}
                          className="transition-transform duration-500 ease-in-out"
                          style={{
                            transform: isHovered ? 'rotate(-90deg)' : 'rotate(225deg)',
                          }}
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
                        {isWaitlistPage ? "back home" : "join waitlist"}
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
                ) : (
                  <div 
                    className="group-hover:scale-105 flex items-center justify-center gap-2 relative z-10"
                    style={{
                      width: '200px',
                      height: '55px',
                      borderRadius: '50px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {isWaitlistPage && (
                      <Image
                        src="/icons/Vector.svg"
                        alt="arrow"
                        width={16}
                        height={16}
                        className="transition-transform duration-500 ease-in-out"
                        style={{
                          transform: isHovered ? 'rotate(-45deg)' : 'rotate(180deg)',
                        }}
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
                      {isWaitlistPage ? "back home" : "join waitlist"}
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
                )}
              </div>
            </Link>
          </div>
        </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
        </MobileNavHeader>
        <MobileNavMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <a
              key={`mobile-link-${idx}`}
              href={item.link}
              className="w-full text-neutral-300 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </a>
          ))}
          <div className="flex w-full flex-col gap-4">
            <Link 
              href={isWaitlistPage ? "/" : "/waitlist"}
              className="group cursor-pointer block w-full"
              onClick={() => setMobileMenuOpen(false)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="waitlist-btn-wrapper">
                {isMounted ? (
                  <GlassSurface
                    width="100%"
                    height={55}
                    borderRadius={50}
                    chromaticAberration={0}
                    redOffset={0}
                    greenOffset={0}
                    blueOffset={0}
                    distortionScale={0}
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
                      {isWaitlistPage && (
                        <Image
                          src="/icons/Vector.svg"
                          alt="arrow"
                          width={16}
                          height={16}
                          className="transition-transform duration-500 ease-in-out"
                          style={{
                            transform: isHovered ? 'rotate(-90deg)' : 'rotate(225deg)',
                          }}
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
                        {isWaitlistPage ? "back home" : "join waitlist"}
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
                ) : (
                  <div 
                    className="group-hover:scale-105 flex items-center justify-center gap-2 relative z-10 w-full"
                    style={{
                      height: '55px',
                      borderRadius: '50px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {isWaitlistPage && (
                      <Image
                        src="/icons/Vector.svg"
                        alt="arrow"
                        width={16}
                        height={16}
                        className="transition-transform duration-500 ease-in-out"
                        style={{
                          transform: isHovered ? 'rotate(-45deg)' : 'rotate(180deg)',
                        }}
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
                      {isWaitlistPage ? "back home" : "join waitlist"}
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
                )}
              </div>
            </Link>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
    </>
  );
}
