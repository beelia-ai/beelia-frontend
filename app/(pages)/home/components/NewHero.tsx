"use client";

import { useState, useEffect, useRef } from "react";
import LightRays from "@/components/LightRays";
import TraceLinesAnimated from "@/components/ui/trace-lines-animated";
import HorizontalBeamAnimated from "@/components/ui/horizontal-beam-animated";
import { HeroContent } from "./HeroContent";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";

export function NewHero() {
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPhase2, setShowPhase2] = useState(false);
  const [traceLinesScrollProgress, setTraceLinesScrollProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [heroScrollProgressValue, setHeroScrollProgressValue] = useState(0);
  const [beamOpacity, setBeamOpacity] = useState(1);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1920
  );
  const heroRef = useRef<HTMLElement>(null);
  const beeliaVideoRef = useRef<HTMLVideoElement>(null);
  const phase2VideoRef = useRef<HTMLVideoElement>(null);
  const globeStopThresholdRef = useRef(Infinity);

  // Track scroll progress for this section
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Track absolute scroll Y position as motion value for video transition
  const { scrollY: scrollYMotion } = useScroll();

  // Calculate when globe should stop being fixed (right above footer)
  useEffect(() => {
    const calculateThreshold = () => {
      const footer = document.getElementById("footer");
      if (!footer) return;

      const footerRect = footer.getBoundingClientRect();
      const footerTop = footerRect.top + window.scrollY;
      const viewportHeight = window.innerHeight;

      // Globe is fixed at ~100px from top, height 420px (scaled up to 1.3x = 546px)
      // We want globe to stop when its bottom would hit above the footer
      // Globe visual bottom = 100px + (420px * 1.3) / 2 + (420px * 1.3) / 2 ≈ 100px + 273px = 373px from top
      // Add margin for the footer content area
      const globeBottomFromTop = 100 + 120 * 1.3;
      const marginAboveFooter = 100; // Stop 100px above footer

      // Threshold is when footer top enters the viewport at globeBottomFromTop + margin
      const threshold =
        footerTop - viewportHeight + globeBottomFromTop + marginAboveFooter;
      globeStopThresholdRef.current = threshold;
    };

    calculateThreshold();
    window.addEventListener("resize", calculateThreshold);
    // Recalculate after layout settles
    const timeout = setTimeout(calculateThreshold, 500);

    return () => {
      window.removeEventListener("resize", calculateThreshold);
      clearTimeout(timeout);
    };
  }, []);

  // Globe scale animation from 1 to 1.1 based on scroll Y position (0px to 900px)
  const globeScale = useTransform(scrollYMotion, (latest) => {
    if (latest < 0) return 1;
    if (latest >= 900) return 1.3;
    return 1 + (latest / 900) * 0.3; // Linear interpolation from 1 to 1.1
  });

  // Globe Y offset - moves up with scroll after threshold is reached
  // Keep globe fixed until third section ends (header at 3000px + rectangle ends at ~4400px)
  // Rectangle appears at 3400px and is 1000px tall, so section ends around 4500px
  const thirdSectionThreshold = 4500;
  const globeY = useTransform(scrollYMotion, (latest) => {
    // Keep globe fixed until third section threshold OR footer threshold (whichever comes first)
    const threshold = Math.min(
      thirdSectionThreshold,
      globeStopThresholdRef.current
    );
    if (latest < threshold) return 0;
    // After threshold, move globe up with scroll (makes it scroll with page)
    return -(latest - threshold);
  });

  // Track scroll Y position
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial value
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Transform scroll progress to opacity and scale values
  // Bottom section (text & button): starts small, blurs immediately, fades immediately
  // All animations complete by y position 200 (0.2 scroll progress)
  const contentOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 0.2], [0.9, 0.8]);
  // Blur starts immediately from the start
  const contentBlur = useTransform(scrollYProgress, [0, 0.2], [0, 10]);
  const contentBlurFilter = useTransform(
    contentBlur,
    (blur) => `blur(${blur}px)`
  );

  // Trace lines scale animation only - no fade out, no clip-path
  // Closing animation sped up by 200px (0.2 progress)
  const traceLinesScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);

  // Hide horizontal beam immediately when scrolling starts
  const horizontalBeamOpacity = useTransform(
    scrollYProgress,
    [0, 0.001],
    [1, 0]
  );

  // Track beam opacity value
  useMotionValueEvent(horizontalBeamOpacity, "change", (latest) => {
    setBeamOpacity(latest);
  });

  // Track when animation starts to disable hover effects and update trace lines retraction
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Update hero scroll progress value for dots fade animation
    setHeroScrollProgressValue(latest);

    if (latest > 0 && !isAnimating) {
      setIsAnimating(true);
      setIsHovered(false); // Disable hover when animation starts
    } else if (latest === 0 && isAnimating) {
      setIsAnimating(false);
    }

    // Update trace lines retraction progress - sped up by 200px: complete retraction at 0.1 scroll progress
    const retractionProgress = latest <= 0.1 ? latest / 0.1 : 1;
    setTraceLinesScrollProgress(retractionProgress);
  });

  // Track scroll to detect when to start Phase 2 video playback
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const transitionStart = 100; // Start transition at 100px

      if (scrollY >= transitionStart && !showPhase2) {
        // Start showing Phase 2 video - preload and play
        setShowPhase2(true);
        if (phase2VideoRef.current) {
          phase2VideoRef.current.load();
          phase2VideoRef.current.play().catch(() => {});
        }
      }

      if (scrollY < transitionStart && showPhase2) {
        // Switch back to Beelia Ani 2 if scrolling back up
        setShowPhase2(false);
        if (beeliaVideoRef.current) {
          beeliaVideoRef.current.play().catch(() => {});
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showPhase2]);

  // Calculate opacity for smooth cross-fade transition based on absolute scroll Y position
  // Transition starts at 100px and completes at 600px
  const phase2Opacity = useTransform(scrollYMotion, (latest) => {
    const transitionStart = 100;
    const transitionEnd = 600;

    if (latest < transitionStart) return 0;
    if (latest >= transitionEnd) return 1;

    // Smooth fade between transitionStart and transitionEnd
    const progress =
      (latest - transitionStart) / (transitionEnd - transitionStart);
    return Math.min(1, Math.max(0, progress));
  });

  const beeliaOpacity = useTransform(phase2Opacity, (opacity) => 1 - opacity);

  // Track window width for responsive scaling
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate responsive scale factor for mobile
  const isMobile = windowWidth < 768;
  const mobileScale = isMobile ? Math.min((windowWidth - 32) / 1102, 0.32) : 1;

  // Globe responsive sizing - smaller for mobile
  const globeSize = isMobile ? 140 : 420;

  // Globe top position calculation
  // Desktop: calc(128px + 182px - 210px) = 100px
  // Mobile: needs to align with scaled trace lines visual center
  // Trace lines SVG center is at 182px from top of container (364px / 2)
  // When scaled, visual center = 182 * mobileScale from container top
  // Container padding: pt-20 (80px) on mobile, pt-32 (128px) on desktop
  const traceLinesCenterY = 182; // Center of 364px SVG
  const mobilePaddingTop = 200; // pt-20 on mobile
  const globeTop = isMobile
    ? `${mobilePaddingTop + traceLinesCenterY * mobileScale - globeSize / 2}px`
    : "calc(128px + 182px - 210px)";

  return (
    <>
      <section
        id="hero-section"
        ref={heroRef}
        className="h-screen bg-transparent relative overflow-visible"
      >
        {/* Video Globe Container - Fixed positioning, always maintains distance from top */}
        {/* Aligned with trace lines position: pt-32 (128px) + trace lines height/2 (182px) = ~310px from top */}
        {/* Stops being fixed and scrolls with page when reaching above footer */}
        <motion.div
          className="fixed left-1/2 pointer-events-none"
          style={{
            width: `${globeSize}px`,
            height: `${globeSize}px`,
            top: globeTop,
            zIndex: 51, // Higher than AboutProduct's fixed OneStop (z-50) to prevent z-fighting flicker
            x: "-50%",
            y: globeY,
            scale: globeScale,
            transformOrigin: "center center",
            willChange: "transform",
          }}
        >
          {/* Video Globe */}
          <div className="w-full h-full flex items-center justify-center relative">
            {/* Beelia Ani 2 Video */}
            <motion.video
              ref={beeliaVideoRef}
              autoPlay
              loop
              muted
              playsInline
              className={`${
                isMobile ? "w-[140px] h-[140px]" : "w-[420px] h-[420px]"
              } object-contain mr-0.5 absolute`}
              style={{
                opacity: beeliaOpacity,
                willChange: "opacity",
              }}
            >
              <source src="/videos/Beelia ani 2.webm" type="video/webm" />
            </motion.video>

            {/* Phase 2 Video */}
            <motion.video
              ref={phase2VideoRef}
              loop
              muted
              playsInline
              className={`${
                isMobile ? "w-[140px] h-[140px]" : "w-[420px] h-[420px]"
              } object-contain mr-0.5 absolute`}
              style={{
                opacity: phase2Opacity,
                willChange: "opacity",
              }}
            >
              <source src="/videos/Phase 2.webm" type="video/webm" />
            </motion.video>
          </div>
        </motion.div>

        {/* Light Rays */}
        {/* Light Rays */}
        <LightRays
          raysOrigin="top-center"
          raysColor="#F5A83B"
          raysSpeed={0.6}
          lightSpread={0.7}
          rayLength={2.2}
          fadeDistance={1}
          saturation={1}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0}
          distortion={0}
          className="absolute -top-48 inset-x-0 bottom-0"
        />

        {/* Content container with proper spacing - flex column layout */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-start pt-20 md:pt-32 overflow-hidden">
          {/* Trace Lines Animated SVG - positioned at top with scroll animation */}
          <motion.div
            className="relative w-[1102px] h-[364px] mb-12"
            style={{
              scale: isMobile ? mobileScale : traceLinesScale,
              willChange: "transform",
              marginTop: "-5px",
              transformOrigin: "center center",
            }}
          >
            {/* Videos in all 6 boxes */}
            {/* Left side boxes */}
            {/* Left top box */}
            <motion.video
              autoPlay
              loop
              muted
              playsInline
              className={`absolute ${
                isMobile ? "object-contain" : "object-cover"
              } rounded-[31.5px] pointer-events-none`}
              style={{
                left: "197.278px",
                top: "0.5px",
                width: "109.32px",
                height: "109.32px",
                zIndex: 10,
                willChange: "transform, opacity",
                opacity:
                  traceLinesScrollProgress > 0
                    ? 1 - traceLinesScrollProgress
                    : 1,
              }}
              animate={{
                y: [-3, 3],
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <source src="/videos/magnify.webm" type="video/webm" />
            </motion.video>
            {/* Left center box */}
            <motion.video
              autoPlay
              loop
              muted
              playsInline
              className={`absolute ${
                isMobile ? "object-contain" : "object-cover"
              } rounded-[31.5px] pointer-events-none`}
              style={{
                left: "0.18px",
                top: "129.481px",
                width: "109.32px",
                height: "109.32px",
                zIndex: 10,
                willChange: "transform, opacity",
                opacity:
                  traceLinesScrollProgress > 0
                    ? 1 - traceLinesScrollProgress
                    : 1,
              }}
              animate={{
                y: [-3, 3],
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <source src="/videos/shield.webm" type="video/webm" />
            </motion.video>
            {/* Left bottom box */}
            <motion.video
              autoPlay
              loop
              muted
              playsInline
              className={`absolute ${
                isMobile ? "object-contain" : "object-cover"
              } rounded-[31.5px] pointer-events-none`}
              style={{
                left: "146.17px",
                top: "252.641px",
                width: "109.32px",
                height: "109.32px",
                zIndex: 10,
                willChange: "transform, opacity",
                opacity:
                  traceLinesScrollProgress > 0
                    ? 1 - traceLinesScrollProgress
                    : 1,
              }}
              animate={{
                y: [-3, 3],
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <source src="/videos/bell.webm" type="video/webm" />
            </motion.video>
            {/* Right side boxes */}
            {/* Right top box */}
            <motion.video
              autoPlay
              loop
              muted
              playsInline
              className={`absolute ${
                isMobile ? "object-contain" : "object-cover"
              } rounded-[31.5px] pointer-events-none`}
              style={{
                left: "792.23px",
                top: "0.5px",
                width: "109.32px",
                height: "109.32px",
                zIndex: 10,
                willChange: "transform, opacity",
                opacity:
                  traceLinesScrollProgress > 0
                    ? 1 - traceLinesScrollProgress
                    : 1,
              }}
              animate={{
                y: [-3, 3],
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <source src="/videos/upload.webm" type="video/webm" />
            </motion.video>
            {/* Right center box */}
            <motion.video
              autoPlay
              loop
              muted
              playsInline
              className={`absolute ${
                isMobile ? "object-contain" : "object-cover"
              } rounded-[31.5px] pointer-events-none`}
              style={{
                left: "992.16px",
                top: "129.481px",
                width: "109.32px",
                height: "109.32px",
                zIndex: 10,
                willChange: "transform, opacity",
                opacity:
                  traceLinesScrollProgress > 0
                    ? 1 - traceLinesScrollProgress
                    : 1,
              }}
              animate={{
                y: [-3, 3],
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <source src="/videos/dollar.webm" type="video/webm" />
            </motion.video>
            {/* Right bottom box */}
            <motion.video
              autoPlay
              loop
              muted
              playsInline
              className={`absolute ${
                isMobile ? "object-contain" : "object-cover"
              } rounded-[31.5px] pointer-events-none`}
              style={{
                left: "838.17px",
                top: "254.15px",
                width: "109.32px",
                height: "109.32px",
                zIndex: 10,
                willChange: "transform, opacity",
                opacity:
                  traceLinesScrollProgress > 0
                    ? 1 - traceLinesScrollProgress
                    : 1,
              }}
              animate={{
                y: [-3, 3],
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <source src="/videos/graph.webm" type="video/webm" />
            </motion.video>
            {/* Horizontal beams - separate component - render first so it's behind */}
            <HorizontalBeamAnimated
              className="absolute inset-0 w-full h-full object-contain"
              style={{ zIndex: 0 }}
              duration={4}
              delay={0}
              beamColor="#FEDA24"
              beamColorSecondary="#FF8C32"
              pathColor="#444444"
              beamWidth={0.8}
              pathWidth={0.8}
              scrollProgress={traceLinesScrollProgress}
              isRetracting={traceLinesScrollProgress > 0}
              beamOpacity={beamOpacity}
            />

            {/* Top and bottom beams - render after so dots appear on top */}
            <TraceLinesAnimated
              className="absolute inset-0 w-full h-full object-contain"
              style={{ zIndex: 1 }}
              duration={4}
              delay={0}
              beamColor="#FEDA24"
              beamColorSecondary="#FF8C32"
              pathColor="#444444"
              beamWidth={0.8}
              pathWidth={0.8}
              scrollProgress={traceLinesScrollProgress}
              isRetracting={traceLinesScrollProgress > 0}
              scrollY={scrollY}
              heroScrollProgress={heroScrollProgressValue}
            />
          </motion.div>

          {/* Content wrapper with scroll animations */}
          <motion.div
            className="flex flex-col items-center"
            style={{
              opacity: contentOpacity,
              scale: contentScale,
              filter: contentBlurFilter,
              transformStyle: "preserve-3d",
              willChange: "opacity, transform, filter",
            }}
          >
            <HeroContent
              isAnimating={isAnimating}
              isHovered={isHovered}
              setIsHovered={setIsHovered}
              isMounted={isMounted}
            />
          </motion.div>
        </div>
      </section>
    </>
  );
}
