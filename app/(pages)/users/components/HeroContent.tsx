"use client";

import Link from "next/link";
import Image from "next/image";
import GlassSurface from "@/components/GlassSurface";
import { ReactNode, useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface HeroContentProps {
  isAnimating: boolean;
  isHovered: boolean;
  setIsHovered: (hovered: boolean) => void;
  isMounted: boolean;
  title?: ReactNode;
  description?: string;
}

export function HeroContent({
  isAnimating,
  isHovered,
  setIsHovered,
  isMounted,
  title = (
    <>
      <span className="text-white">AI</span>{" "}
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8C32] to-[#FF6B00]">
        for Everyone,
      </span>{" "}
      <span className="text-white">by Everyone</span>
    </>
  ),
  description = "A curated AI marketplace where anyone can discover, trust, and use the right tools instantly, no technical skills required",
}: HeroContentProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div 
      className="w-full flex flex-col items-center pt-24 md:pt-0"
      style={{
        paddingBottom: isMobile ? "120px" : "0px",
      }}
    >
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
        /* Mobile: show hovered state by default */
        @media (max-width: 767px) {
          .waitlist-btn-wrapper.mobile-hover::after {
            transform: translateX(0) !important;
          }
          .waitlist-btn-wrapper.mobile-hover .waitlist-btn-text {
            color: #000000 !important;
            font-weight: 600 !important;
          }
          .waitlist-btn-wrapper.mobile-hover .waitlist-btn-arrow {
            filter: brightness(0) invert(0) !important;
          }
        }
        /* Ensure mobile text is bold even without mobile-hover class */
        @media (max-width: 767px) {
          .waitlist-btn-text {
            font-weight: 600 !important;
          }
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

      {/* AIFOR Text - below trace lines */}
      <div
        className="flex justify-center px-2 md:px-0 w-full"
        style={{
          marginTop: isMobile ? "0px" : "0px",
        }}
      >
        <h1
          className="text-center font-editors-note-italic text-3xl md:text-6xl lg:text-7xl leading-tight"
          style={{
            fontSize: isMobile ? "52px" : "70px",
            maxWidth: isMobile ? "90vw" : "680px",
            whiteSpace: isMobile ? "normal" : "nowrap",
            width: "100%",
          }}
        >
          {title}
        </h1>
      </div>

      {/* Tagline Text - below AIFOR text */}
      <div className="flex justify-center w-full px-2 md:px-0">
        <p
          className={`text-center text-white/60 ${
            isMobile ? "mt-2 md:mt-4" : "mt-4"
          }`}
          style={{
            fontFamily: "var(--font-outfit), sans-serif",
            opacity: 0.7,
            fontWeight: 300,
            fontSize: isMobile ? "18px" : "22px",
            maxWidth: "680px",
            width: "100%",
          }}
        >
          {description}
        </p>
      </div>

      {/* Join Waitlist Button - below tagline text */}
      {(() => {
        const buttonContent = (
          <Link
            href="/waitlist"
            className={`group block [perspective:1000px] [transform-style:preserve-3d] ${
              isAnimating ? "pointer-events-none" : "cursor-pointer"
            }`}
            onMouseEnter={() => !isAnimating && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              className={`waitlist-btn-wrapper ${
                isAnimating ? "no-hover" : ""
              } ${isMobile && !isAnimating ? "mobile-hover" : ""}`}
            >
              {isMounted ? (
                <GlassSurface
                  width={isMobile ? 200 : 270}
                  height={isMobile ? 60 : 80}
                  borderRadius={50}
                  chromaticAberration={0.15}
                  redOffset={0}
                  greenOffset={10}
                  blueOffset={20}
                  distortionScale={-180}
                  blur={16}
                  brightness={60}
                  opacity={0.95}
                  className={`${
                    isAnimating ? "" : "group-hover:scale-105"
                  } transition-all duration-500 ease-out ${
                    isHovered && !isAnimating
                      ? "[transform:translateZ(20px)_rotateX(-1deg)_rotateY(1deg)_scale(1.03)] [box-shadow:0_20px_40px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.15)_inset]"
                      : "[transform:translateZ(10px)_rotateX(0deg)_rotateY(0deg)_scale(1)] [box-shadow:0_10px_30px_rgba(0,0,0,0.2),0_0_0_1px_rgba(255,255,255,0.1)_inset]"
                  }`}
                >
                  <div
                    className="w-full flex items-center justify-center gap-3 relative z-10"
                    style={{
                      padding: isMobile ? "0 20px" : "0 20px",
                    }}
                  >
                    <span
                      className={`waitlist-btn-text uppercase text-sm md:text-[20px] leading-[100%] tracking-[0.06em] font-outfit ${
                        isMobile ? "font-semibold" : "font-medium"
                      }`}
                      style={{
                        fontFamily: isMobile
                          ? "sans-serif"
                          : "var(--font-outfit), sans-serif",
                        fontSize: isMobile ? "16px" : "20px",
                        fontWeight: isMobile ? 800 : 500,
                        whiteSpace: "nowrap",
                      }}
                    >
                      join waitlist
                    </span>
                    <Image
                      src="/icons/Vector.svg"
                      alt="arrow"
                      width={20}
                      height={20}
                      className={`waitlist-btn-arrow transition-transform duration-500 ease-in-out ${
                        isHovered || (isMobile && !isAnimating)
                          ? "rotate-45"
                          : "rotate-0"
                      }`}
                    />
                  </div>
                </GlassSurface>
              ) : null}
            </div>
          </Link>
        );

        // Only render mobile portal after mount to prevent hydration mismatch
        if (isMobile && mounted && isMounted) {
          // Create dedicated mobile button
          const mobileButton = (
            <Link
              href="/waitlist"
              className="group block [perspective:1000px] [transform-style:preserve-3d] cursor-pointer"
              style={{ pointerEvents: "auto" }}
            >
              <div className="mobile-waitlist-btn-wrapper">
                {isMounted ? (
                  <GlassSurface
                    width={200}
                    height={60}
                    borderRadius={50}
                    chromaticAberration={0.15}
                    redOffset={0}
                    greenOffset={10}
                    blueOffset={20}
                    distortionScale={-180}
                    blur={16}
                    brightness={60}
                    opacity={0.95}
                    className="transition-all duration-500 ease-out [transform:translateZ(10px)_rotateX(0deg)_rotateY(0deg)_scale(1)] [box-shadow:0_10px_30px_rgba(0,0,0,0.2),0_0_0_1px_rgba(255,255,255,0.1)_inset]"
                  >
                    <div
                      className="w-full flex items-center justify-center gap-3 relative z-10"
                      style={{
                        padding: "0 20px",
                      }}
                    >
                      <span
                        className="mobile-waitlist-btn-text uppercase text-sm leading-[100%] tracking-[0.06em] font-outfit font-semibold"
                        style={{
                          fontFamily: "sans-serif",
                          fontSize: "16px",
                          fontWeight: 800,
                          whiteSpace: "nowrap",
                          color: "#000000",
                        }}
                      >
                        join waitlist
                      </span>
                      <Image
                        src="/icons/Vector.svg"
                        alt="arrow"
                        width={20}
                        height={20}
                        className="mobile-waitlist-btn-arrow rotate-45"
                        style={{ filter: "brightness(0) invert(0)" }}
                      />
                    </div>
                  </GlassSurface>
                ) : null}
              </div>
            </Link>
          );

          // Render button in portal at body level to escape transformed parent
          return (
            <>
              {/* Placeholder div for layout on mobile */}
              <div style={{ marginTop: "24px", height: "80px" }} />
              {typeof document !== "undefined" &&
                createPortal(
                  <>
                    {/* Include styles for portal since it's outside the main component DOM */}
                    <style>{`
                      .mobile-waitlist-btn-wrapper {
                        position: relative;
                        overflow: hidden;
                        border-radius: 50px;
                      }
                      .mobile-waitlist-btn-wrapper::after {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(135deg, #FFB830 0%, #FFA500 50%, #FFB830 100%);
                        transform: translateX(0);
                        z-index: 1;
                        border-radius: 50px;
                        pointer-events: none;
                        box-shadow: 0 0 20px rgba(255, 184, 48, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
                      }
                      .mobile-waitlist-btn-wrapper > * {
                        position: relative;
                        z-index: 2;
                      }
                      .mobile-waitlist-btn-text {
                        color: #000000 !important;
                        font-weight: 800 !important;
                      }
                      .mobile-waitlist-btn-arrow {
                        filter: brightness(0) invert(0) !important;
                      }
                    `}</style>
                    <div
                      style={{
                        position: "fixed",
                        bottom: "calc(env(safe-area-inset-bottom, 0px) + 20px)",
                        left: 0,
                        right: 0,
                        display: "flex",
                        justifyContent: "center",
                        zIndex: 50,
                        pointerEvents: "none",
                      }}
                    >
                      <div style={{ pointerEvents: "auto" }}>
                        {mobileButton}
                      </div>
                    </div>
                  </>,
                  document.body
                )}
            </>
          );
        }

        // Desktop: render normally in flow (also used for initial render to match server)
        return (
          <div
            style={{
              marginTop: "24px",
              position: "relative",
            }}
          >
            {buttonContent}
          </div>
        );
      })()}
    </div>
  );
}
