"use client";

import Link from "next/link";
import Image from "next/image";
import GlassSurface from "@/components/GlassSurface";

interface HeroContentProps {
  isAnimating: boolean;
  isHovered: boolean;
  setIsHovered: (hovered: boolean) => void;
  isMounted: boolean;
}

export function HeroContent({
  isAnimating,
  isHovered,
  setIsHovered,
  isMounted,
}: HeroContentProps) {
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

      {/* AIFOR Image - below trace lines */}
      <div className="w-full max-w-[90vw] md:w-[675px] h-auto px-4 md:px-0">
        <Image
          src="/images/AIFOR.png"
          alt="AI For Everyone, by Everyone"
          width={675}
          height={80}
          className="w-full h-auto object-contain"
          priority
        />
      </div>

      {/* Tagline Text - below AIFOR image */}
      <p className="mt-4 text-center uppercase text-white/60 text-sm md:text-[17px] leading-[140%] md:leading-[32px] tracking-[0.04em] font-normal max-w-[90vw] md:max-w-[680px] px-4 md:px-0 font-outfit">
        A curated AI marketplace where anyone can discover, trust, and use the
        right tools instantly, no technical skills required
      </p>

      {/* Join Waitlist Button - below tagline text */}
      <div className="mt-8">
        <Link
          href="/waitlist"
          className={`group block [perspective:1000px] [transform-style:preserve-3d] ${
            isAnimating ? "pointer-events-none" : "cursor-pointer"
          }`}
          onMouseEnter={() => !isAnimating && setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className={`waitlist-btn-wrapper ${isAnimating ? "no-hover" : ""}`}
          >
            {isMounted ? (
              <GlassSurface
                width={typeof window !== 'undefined' && window.innerWidth < 768 ? 200 : 270}
                height={typeof window !== 'undefined' && window.innerWidth < 768 ? 60 : 80}
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
                <div className="w-full flex items-center justify-center gap-3 relative z-10">
                  <span className="waitlist-btn-text uppercase text-sm md:text-[20px] font-medium leading-[100%] tracking-[0.06em] font-outfit">
                    join waitlist
                  </span>
                  <Image
                    src="/icons/Vector.svg"
                    alt="arrow"
                    width={20}
                    height={20}
                    className={`waitlist-btn-arrow transition-transform duration-500 ease-in-out ${
                      isHovered ? "rotate-45" : "rotate-0"
                    }`}
                  />
                </div>
              </GlassSurface>
            ) : null}
          </div>
        </Link>
      </div>
    </>
  );
}
