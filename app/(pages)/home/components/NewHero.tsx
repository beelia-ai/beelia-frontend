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

// #region agent log
let heroMountCount = 0;
// #endregion

export function NewHero() {
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPhase2, setShowPhase2] = useState(false);
  const [traceLinesScrollProgress, setTraceLinesScrollProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [heroScrollProgressValue, setHeroScrollProgressValue] = useState(0);
  const [beamOpacity, setBeamOpacity] = useState(1);
  const heroRef = useRef<HTMLElement>(null);
  const beeliaVideoRef = useRef<HTMLVideoElement>(null);
  const phase2VideoRef = useRef<HTMLVideoElement>(null);

  // Track scroll progress for this section
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Track absolute scroll Y position as motion value for video transition
  const { scrollY: scrollYMotion } = useScroll();

  // Globe scale animation from 1 to 1.1 based on scroll Y position (0px to 900px)
  const globeScale = useTransform(scrollYMotion, (latest) => {
    if (latest < 0) return 1;
    if (latest >= 900) return 1.3;
    return 1 + (latest / 900) * 0.3; // Linear interpolation from 1 to 1.1
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
        // #region agent log
        if (scrollY >= 700 && scrollY <= 850) {
          fetch(
            "http://127.0.0.1:7242/ingest/7c2475d1-1cfb-476d-abc6-b2f25a9952ed",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                location: "NewHero.tsx:videoSwitch",
                message: "Switching to Phase2",
                data: { scrollY, showPhase2 },
                timestamp: Date.now(),
                sessionId: "debug-session",
                hypothesisId: "G",
              }),
            }
          ).catch(() => {});
        }
        // #endregion
        // Start showing Phase 2 video - preload and play
        setShowPhase2(true);
        if (phase2VideoRef.current) {
          phase2VideoRef.current.load();
          phase2VideoRef.current.play().catch(() => {});
        }
      }

      if (scrollY < transitionStart && showPhase2) {
        // #region agent log
        if (scrollY >= 700 && scrollY <= 850) {
          fetch(
            "http://127.0.0.1:7242/ingest/7c2475d1-1cfb-476d-abc6-b2f25a9952ed",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                location: "NewHero.tsx:videoSwitch",
                message: "Switching back to Beelia",
                data: { scrollY, showPhase2 },
                timestamp: Date.now(),
                sessionId: "debug-session",
                hypothesisId: "G",
              }),
            }
          ).catch(() => {});
        }
        // #endregion
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

  useEffect(() => {
    setIsMounted(true);
    // #region agent log
    heroMountCount++;
    fetch("http://127.0.0.1:7242/ingest/7c2475d1-1cfb-476d-abc6-b2f25a9952ed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "NewHero.tsx:mount",
        message: "NewHero mounted",
        data: { mountCount: heroMountCount, scrollY: window.scrollY },
        timestamp: Date.now(),
        sessionId: "debug-session",
        hypothesisId: "F",
      }),
    }).catch(() => {});
    return () => {
      fetch(
        "http://127.0.0.1:7242/ingest/7c2475d1-1cfb-476d-abc6-b2f25a9952ed",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: "NewHero.tsx:unmount",
            message: "NewHero unmounting",
            data: { mountCount: heroMountCount, scrollY: window.scrollY },
            timestamp: Date.now(),
            sessionId: "debug-session",
            hypothesisId: "F",
          }),
        }
      ).catch(() => {});
    };
    // #endregion
  }, []);

  return (
    <>
      <section
        id="hero-section"
        ref={heroRef}
        className="h-screen bg-transparent relative overflow-visible"
      >
        {/* Video Globe Container - Fixed positioning, always maintains distance from top */}
        {/* Aligned with trace lines position: pt-32 (128px) + trace lines height/2 (182px) = ~310px from top */}
        <motion.div
          className="fixed left-1/2 pointer-events-none"
          style={{
            width: "420px",
            height: "420px",
            top: "calc(128px + 182px - 210px)", // pt-32 + trace lines center - half globe height
            zIndex: 50,
            x: "-50%",
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
              className="w-[420px] h-[420px] object-contain mr-0.5 absolute"
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
              className="w-[420px] h-[420px] object-contain mr-0.5 absolute"
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
          rayLength={1.6}
          fadeDistance={1}
          saturation={1}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0}
          distortion={0}
          className="absolute inset-0"
        />

        {/* Content container with proper spacing - flex column layout */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-start pt-32">
          {/* Trace Lines Animated SVG - positioned at top with scroll animation */}
          <motion.div
            className="relative w-[1102px] h-[364px] mb-12"
            style={{
              scale: traceLinesScale,
              willChange: "transform",
              marginTop: "-5px",
            }}
          >
            {/* Horizontal beams - separate component - render first so it's behind */}
            <HorizontalBeamAnimated
              className="absolute inset-0 w-full h-full object-contain"
              style={{ zIndex: 0 }}
              duration={4}
              delay={0}
              beamColor="#FEDA24"
              beamColorSecondary="#FF8C32"
              pathColor="#444444"
              beamWidth={2}
              pathWidth={1}
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
              beamWidth={2}
              pathWidth={1}
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
