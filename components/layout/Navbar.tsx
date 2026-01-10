"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import GlassSurface from "@/components/GlassSurface";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

interface NavbarProps {
  forceShow?: boolean;
}

export function Navbar({ forceShow = false }: NavbarProps = {}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const scrollThresholdRef = useRef(0);
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('Navbar');
  
  const isWaitlistPage = pathname === "/waitlist" || pathname === `/${locale}/waitlist`; 
  const isUsersPage = pathname === "/users" || pathname === `/${locale}/users`;
  const isCreatorsPage = pathname === "/creators" || pathname === `/${locale}/creators`;

  // Track window size for responsive button sizing
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Track scroll progress for navbar fade animation
  const { scrollYProgress } = useScroll();

  // Track scroll direction and show/hide navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Scrolling down - hide navbar
      if (currentScrollY > lastScrollY && currentScrollY > 0) {
        setIsVisible(false);
        scrollThresholdRef.current = currentScrollY;
      }
      // Scrolling up - show navbar if scrolled up by 20px from threshold
      else if (currentScrollY < lastScrollY) {
        if (
          currentScrollY <= scrollThresholdRef.current - 20 ||
          currentScrollY === 0
        ) {
          setIsVisible(true);
        }
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Navbar content opacity based on visibility state
  const navbarContentOpacity = isVisible ? 1 : 0;
  const navbarContentY = isVisible ? 0 : -20;

  // Hide navbar on users page and creators page unless forced to show
  if ((isUsersPage || isCreatorsPage) && !forceShow) {
    return null;
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
          height: 100%;
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
          background: white;
          transition: all 0.3s ease;
        }
        /* Horizontal underline for desktop */
        @media (min-width: 768px) {
          .nav-link::after {
            bottom: -2px;
            left: 0;
            width: 0;
            height: 1.4px;
          }
          .nav-link:hover::after,
          .nav-link.active::after {
            width: 100%;
          }
        }
        /* Vertical indicator for mobile */
        @media (max-width: 767px) {
          .nav-link::after {
            right: -8px;
            top: 50%;
            transform: translateY(-50%);
            width: 1.4px;
            height: 0;
          }
          .nav-link:hover::after,
          .nav-link.active::after {
            height: 100%;
          }
        }
      `}</style>

      {/* Full width navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[9999] px-4 sm:px-6 md:px-8 lg:px-16 py-3 md:py-6">
        <div
          className="flex items-center justify-between w-full relative"
          style={{ padding: "6px 12px" }}
        >
          {/* Logo on the left - hides on scroll down, shows on scroll up */}
          <motion.div
            className="flex items-center justify-start flex-shrink-0 z-10"
            animate={{
              opacity: navbarContentOpacity,
              y: navbarContentY,
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            style={{
              willChange: "opacity, transform",
            }}
          >
            <Link href="/users" className="flex items-center gap-2">
              <Image
                src="/icons/beelia-logo.png"
                alt="Beelia Logo"
                width={150}
                height={40}
                className="h-6 sm:h-7 md:h-10 w-auto"
                priority
              />
            </Link>
          </motion.div>

          {/* Navigation links - centered on desktop, top-right column on mobile */}
          <motion.div
            className={`absolute pointer-events-none ${
              isMobile
                ? "top-0 right-0 flex items-start justify-end"
                : "inset-0 flex items-center justify-center"
            }`}
            animate={{
              opacity: navbarContentOpacity,
              y: navbarContentY,
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            style={{
              willChange: "opacity, transform",
            }}
          >
            {!isWaitlistPage && (
              <div
                className={`pointer-events-auto ${
                  isMobile
                    ? "flex flex-col items-end gap-2 sm:gap-3"
                    : "flex items-center gap-8 lg:gap-12"
                }`}
                style={{
                  zIndex: 10000,
                  touchAction: "manipulation",
                }}
              >
                <Link
                  href="/users"
                  className={`nav-link cursor-pointer ${
                    isUsersPage ? "active" : ""
                  }`}
                  onClick={(e) => {
                    // Ensure navigation works on mobile
                    e.stopPropagation();
                  }}
                  style={{
                    fontFamily: "var(--font-outfit), sans-serif",
                    fontSize: isMobile ? "16px" : "16px",
                    fontWeight: isUsersPage ? 600 : 400,
                    background: "none",
                    border: "none",
                    textDecoration: "none",
                    color: isUsersPage ? "#FFFFFF" : "rgba(255, 255, 255, 0.7)",
                    pointerEvents: "auto",
                    position: "relative",
                    zIndex: 10001,
                    touchAction: "manipulation",
                    WebkitTapHighlightColor: "transparent",
                    cursor: "pointer",
                    display: "block",
                  }}
                >
                  {t('users')}
                </Link>
                <Link
                  href="/creators"
                  className={`nav-link cursor-pointer ${
                    isCreatorsPage ? "active" : ""
                  }`}
                  onClick={(e) => {
                    // Ensure navigation works on mobile
                    e.stopPropagation();
                  }}
                  style={{
                    fontFamily: "var(--font-outfit), sans-serif",
                    fontSize: isMobile ? "16px" : "16px",
                    fontWeight: isCreatorsPage ? 600 : 400,
                    background: "none",
                    border: "none",
                    textDecoration: "none",
                    color: isCreatorsPage
                      ? "#FFFFFF"
                      : "rgba(255, 255, 255, 0.7)",
                    pointerEvents: "auto",
                    position: "relative",
                    zIndex: 10001,
                    touchAction: "manipulation",
                    WebkitTapHighlightColor: "transparent",
                    cursor: "pointer",
                    display: "block",
                  }}
                >
                  {t('creators')}
                </Link>
                <a
                  href="mailto:juancarloscalvofresno@cesno.eu?subject=Inquiry - Beelia.ai&body=Hello Juan,%0D%0A%0D%0AI'd like to get in touch regarding Beelia.%0D%0APlease see my details below:%0D%0A%0D%0AName:%0D%0ACompany:%0D%0AType of Inquiry (Investment, Partnership, Collaboration, Press, Other):%0D%0AMessage:%0D%0A%0D%0AI confirm that any shared information will remain confidential unless otherwise agreed.%0D%0AI am aware that Beelia is a small early-stage startup, and I understand that responses may take some time.%0D%0A%0D%0AThank you,"
                  className="nav-link cursor-pointer"
                  style={{
                    fontFamily: "var(--font-outfit), sans-serif",
                    fontSize: isMobile ? "16px" : "16px",
                    fontWeight: 400,
                    background: "none",
                    border: "none",
                    textDecoration: "none",
                    pointerEvents: "auto",
                    position: "relative",
                    zIndex: 10001,
                  }}
                >
                  {t('contact')}
                </a>
                <button
                  onClick={() => {
                    let currentPath = window.location.pathname;
                    
                    // Clean localized prefixes first to get "raw" path
                    currentPath = currentPath.replace(/^\/(es|en)(\/|$)/, '/');

                    if (locale === 'es') {
                      // Switch to English (default) - use cleaned path (which is effectively /en hidden)
                      window.location.href = currentPath;
                    } else {
                      // Switch to Spanish
                      const newPath = `/es${currentPath === '/' ? '' : currentPath}`;
                      window.location.href = newPath;
                    }
                  }}
                  className="nav-link cursor-pointer"
                  style={{
                    fontFamily: "var(--font-outfit), sans-serif",
                    fontSize: isMobile ? "16px" : "16px",
                    fontWeight: 400,
                    background: "none",
                    border: "none",
                    textDecoration: "none",
                    pointerEvents: "auto",
                    position: "relative",
                    zIndex: 10001,
                    marginLeft: "8px", 
                  }}
                >
                  <span id="lang-toggle-text">{locale === 'en' ? t('spanish') : t('english')}</span>
                </button>
              </div>
            )}
          </motion.div>

          {/* JOIN WAITLIST button on the right */}
          <div className="hidden md:flex items-center justify-end flex-shrink-0 z-10">
            <Link
              href={isWaitlistPage ? "/users" : "/waitlist"}
              className="group cursor-pointer block"
              style={{
                perspective: "1000px",
                transformStyle: "preserve-3d",
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="waitlist-btn-wrapper">
                <GlassSurface
                  width={isMobile ? 90 : 200}
                  height={isMobile ? 28 : 55}
                  borderRadius={50}
                  chromaticAberration={isHovered ? 0.4 : 0.25}
                  className="group-hover:scale-105"
                  style={{
                    transform: isHovered
                      ? "translateZ(20px) rotateX(-1deg) rotateY(1deg) scale(1.03)"
                      : "translateZ(10px) rotateX(0deg) rotateY(0deg) scale(1)",
                    boxShadow: isHovered
                      ? "0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.15) inset"
                      : "0 10px 30px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
                    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <div className="w-full flex items-center justify-center gap-1 sm:gap-2 md:gap-3 relative z-10 px-1 sm:px-2 md:px-0">
                    {isWaitlistPage && (
                      <Image
                        src="/icons/Vector.svg"
                        alt="arrow"
                        width={16}
                        height={16}
                        className="waitlist-btn-arrow transition-transform duration-500 ease-in-out rotate-[270deg] group-hover:rotate-[225deg] w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4"
                      />
                    )}
                    <span
                      className="waitlist-btn-text uppercase"
                      style={{
                        fontFamily: "var(--font-outfit), sans-serif",
                        fontSize: isMobile ? "7px" : "14px",
                        lineHeight: "100%",
                        letterSpacing: isMobile ? "0.04em" : "0.06em",
                      }}
                    >
                      {isWaitlistPage ? t('backToUsers') : t('joinWaitlist')}
                    </span>
                    {!isWaitlistPage && (
                      <Image
                        src="/icons/Vector.svg"
                        alt="arrow"
                        width={16}
                        height={16}
                        className="waitlist-btn-arrow transition-transform duration-500 ease-in-out group-hover:rotate-45 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4"
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
  );
}
