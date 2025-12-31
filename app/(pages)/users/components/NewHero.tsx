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
  useMotionValue,
  animate,
} from "framer-motion";
import { ReactNode } from "react";

interface NewHeroProps {
  title?: ReactNode;
  description?: string;
}

export function NewHero({ title, description }: NewHeroProps = {}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPhase2, setShowPhase2] = useState(false);
  const [traceLinesScrollProgress, setTraceLinesScrollProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [heroScrollProgressValue, setHeroScrollProgressValue] = useState(0);
  const [beamOpacity, setBeamOpacity] = useState(1);
  const [hidePastVideo, setHidePastVideo] = useState(false);
  const [showFutureTransition, setShowFutureTransition] = useState(false);
  const [showFutureMain, setShowFutureMain] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1920
  );
  const heroRef = useRef<HTMLElement>(null);
  const beeliaVideoRef = useRef<HTMLVideoElement>(null);
  const phase2VideoRef = useRef<HTMLVideoElement>(null);
  const futureTransitionVideoRef = useRef<HTMLVideoElement>(null);
  const futureMainVideoRef = useRef<HTMLVideoElement>(null);
  const globeStopThresholdRef = useRef(Infinity);
  // Refs for box videos to enable pausing when not visible
  const boxVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  // Track if hero section is visible for video optimization
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [futureTransitionDuration, setFutureTransitionDuration] = useState<
    number | null
  >(null);

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
  // Keep globe fixed until third section ends
  // Globe becomes scrollable around 3450px scroll position
  const thirdSectionThreshold = 3450;
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
      const transitionStart = 200; // Start transition at 200px

      if (scrollY >= transitionStart && !showPhase2) {
        // Start showing Phase 2 video - preload and play
        setShowPhase2(true);
        if (phase2VideoRef.current) {
          phase2VideoRef.current.load();
          phase2VideoRef.current.play().catch(() => {});
        }
      }

      if (scrollY < transitionStart && showPhase2) {
        // Switch back to past video if scrolling back up
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
  // Transition starts at 200px and completes at 600px (400px duration)
  // past.webm fades out while present.webm fades in simultaneously
  const phase2Opacity = useTransform(scrollYMotion, (latest) => {
    const transitionStart = 200;
    const transitionEnd = 600; // 400px duration for fade transition

    if (latest < transitionStart) return 0;
    if (latest >= transitionEnd) return 1;

    // Smooth fade between transitionStart and transitionEnd
    const progress =
      (latest - transitionStart) / (transitionEnd - transitionStart);
    return Math.min(1, Math.max(0, progress));
  });

  const beeliaOpacity = useTransform(phase2Opacity, (opacity) => 1 - opacity);

  // Track when present video has fully taken over to hide past video
  useMotionValueEvent(phase2Opacity, "change", (latest) => {
    if (latest >= 1 && !hidePastVideo) {
      setHidePastVideo(true);
    } else if (latest < 1 && hidePastVideo) {
      setHidePastVideo(false);
    }
  });

  // Calculate opacity for future-transition video transition at 2700px
  // Transition duration: 1 second fade-out & fade-in (approximately 100px scroll range)
  const futureTransitionOpacity = useTransform(scrollYMotion, (latest) => {
    const transitionStart = 2700;
    const transitionEnd = 2800; // 100px range for ~1 second transition

    if (latest < transitionStart) return 0;
    if (latest >= transitionEnd) return 1;

    // Smooth fade between transitionStart and transitionEnd
    const progress =
      (latest - transitionStart) / (transitionEnd - transitionStart);
    return Math.min(1, Math.max(0, progress));
  });

  // Opacity for future-transition video fade-out (based on video time, not scroll)
  // Fades out 1 second before video ends
  const futureTransitionVideoOpacity = useMotionValue(1);

  // Opacity for future-main video fade-in (based on video time, not scroll)
  // Fades in as future-transition fades out
  const futureMainVideoOpacity = useMotionValue(0);

  // Combined opacity for future-transition: scroll-based fade-in AND time-based fade-out
  const futureTransitionCombinedOpacity = useMotionValue(0);

  // Update combined opacity when either value changes
  useMotionValueEvent(futureTransitionOpacity, "change", (scrollOpacity) => {
    const timeOpacity = futureTransitionVideoOpacity.get();
    futureTransitionCombinedOpacity.set(scrollOpacity * timeOpacity);
  });

  useMotionValueEvent(futureTransitionVideoOpacity, "change", (timeOpacity) => {
    const scrollOpacity = futureTransitionOpacity.get();
    futureTransitionCombinedOpacity.set(scrollOpacity * timeOpacity);
  });

  // Initialize combined opacity when future-transition becomes visible
  useMotionValueEvent(futureTransitionOpacity, "change", (scrollOpacity) => {
    if (scrollOpacity >= 1 && futureTransitionCombinedOpacity.get() === 0) {
      futureTransitionCombinedOpacity.set(1);
    }
  });

  // Combined opacity for present video: fades in from 200px-600px, visible until 2700px, then fades out
  // Present video fades in simultaneously as past.webm fades out (200px-600px)
  // Then stays fully visible until future-transition starts (2700px)
  const presentVideoOpacity = useTransform(scrollYMotion, (latest) => {
    const fadeInStart = 200; // Start fading in here (same as past.webm fade out)
    const fadeInEnd = 600; // Fully visible after this
    const futureTransitionStart = 2700; // Start fading out here
    const futureTransitionEnd = 2800; // Fully faded out here

    // During fade-in phase (200px-600px), use phase2Opacity
    if (latest >= fadeInStart && latest < fadeInEnd) {
      const progress = (latest - fadeInStart) / (fadeInEnd - fadeInStart);
      return Math.min(1, Math.max(0, progress));
    }

    // Before fade-in starts, opacity is 0
    if (latest < fadeInStart) return 0;

    // Between fade-in complete and future transition start, fully visible
    if (latest >= fadeInEnd && latest < futureTransitionStart) return 1;

    // During future transition, fade out
    if (latest >= futureTransitionStart && latest < futureTransitionEnd) {
      const progress =
        (latest - futureTransitionStart) /
        (futureTransitionEnd - futureTransitionStart);
      return 1 - progress;
    }

    // After future transition completes, fully hidden
    return 0;
  });

  // Track future-transition video duration when it loads
  useEffect(() => {
    const video = futureTransitionVideoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setFutureTransitionDuration(video.duration);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    // If video is already loaded, get duration immediately
    if (video.readyState >= 1) {
      setFutureTransitionDuration(video.duration);
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [showFutureTransition]);

  // Track future-transition video playback to fade out 1 second before it ends
  useEffect(() => {
    if (!showFutureTransition || !futureTransitionDuration) return;

    const video = futureTransitionVideoRef.current;
    if (!video) return;

    let fadeStarted = false;

    const checkVideoTime = () => {
      // Once future-main has taken over, stop monitoring future-transition
      // future-main will loop infinitely on its own
      if (showFutureMain) return;

      const fadeStartTime = futureTransitionDuration - 1; // 1 second before end

      if (video.currentTime >= fadeStartTime && !fadeStarted) {
        fadeStarted = true;
        setShowFutureMain(true);

        // Start fade animations: future-transition fades out, future-main fades in
        animate(futureTransitionVideoOpacity, 0, {
          duration: 1,
          ease: "linear",
        });
        animate(futureMainVideoOpacity, 1, { duration: 1, ease: "linear" });

        if (futureMainVideoRef.current) {
          futureMainVideoRef.current.load();
          futureMainVideoRef.current.play().catch(() => {});
        }

        // Pause future-transition video once future-main takes over
        // future-main will loop infinitely, future-transition stays hidden
        if (video) {
          video.pause();
        }
      }
    };

    const interval = setInterval(checkVideoTime, 50); // Check every 50ms for smoother tracking

    return () => {
      clearInterval(interval);
    };
  }, [
    showFutureTransition,
    futureTransitionDuration,
    futureTransitionVideoOpacity,
    futureMainVideoOpacity,
    showFutureMain,
  ]);

  // Track when future-transition video should start playing
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const transitionStart = 2700;

      if (scrollY >= transitionStart && !showFutureTransition) {
        // Start showing future-transition video - preload and play
        setShowFutureTransition(true);
        if (futureTransitionVideoRef.current) {
          futureTransitionVideoRef.current.load();
          futureTransitionVideoRef.current.play().catch(() => {});
        }
      }

      if (scrollY < transitionStart && showFutureTransition) {
        // Switch back to present video if scrolling back up
        setShowFutureTransition(false);
        setShowFutureMain(false);
        futureTransitionVideoOpacity.set(1);
        futureMainVideoOpacity.set(0);
        futureTransitionCombinedOpacity.set(0);
        if (phase2VideoRef.current) {
          phase2VideoRef.current.play().catch(() => {});
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showFutureTransition]);

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

  // Intersection Observer to pause ALL videos when hero is not visible
  // This is the KEY performance optimization - videos only play when user can see them
  useEffect(() => {
    if (!heroRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries[0]?.isIntersecting ?? false;
        setIsHeroVisible(isVisible);

        // Pause/play globe videos based on visibility
        const globeVideos = [
          beeliaVideoRef.current,
          phase2VideoRef.current,
          futureTransitionVideoRef.current,
          futureMainVideoRef.current,
        ];
        const boxVideos = boxVideoRefs.current.filter(Boolean);
        const allVideos = [...globeVideos, ...boxVideos].filter(
          Boolean
        ) as HTMLVideoElement[];

        allVideos.forEach((video) => {
          if (isVisible) {
            // Only play if it should be playing (not hidden by other logic)
            if (video.paused && video.readyState >= 2) {
              video.play().catch(() => {});
            }
          } else {
            // Pause when not visible to save CPU
            if (!video.paused) {
              video.pause();
            }
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of hero is visible
    );

    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  // Pause/play box videos based on visibility (scroll progress)
  // This significantly reduces CPU/GPU usage when videos are faded out
  useEffect(() => {
    const boxVideos = boxVideoRefs.current.filter(Boolean);
    if (traceLinesScrollProgress >= 0.9) {
      // Videos are fully faded out, pause them to save resources
      boxVideos.forEach((video) => {
        if (video && !video.paused) {
          video.pause();
        }
      });
    } else if (traceLinesScrollProgress < 0.9) {
      // Videos are visible, ensure they're playing
      boxVideos.forEach((video) => {
        if (video && video.paused) {
          video.play().catch(() => {});
        }
      });
    }
  }, [traceLinesScrollProgress]);

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
        {/* Video Globe Container - RESTORED with lazy loading */}
        <motion.div
          className="fixed left-1/2 pointer-events-none"
          style={{
            width: `${globeSize}px`,
            height: `${globeSize}px`,
            top: globeTop,
            zIndex: 51,
            x: "-50%",
            y: globeY,
            scale: globeScale,
            transformOrigin: "center center",
            willChange: "transform",
          }}
        >
          {/* Video Globe */}
          <div className="w-full h-full flex items-center justify-center relative">
            {/* Past Video */}
            {!hidePastVideo && (
              <motion.video
                ref={beeliaVideoRef}
                autoPlay={isHeroVisible}
                loop
                muted
                playsInline
                preload="none"
                className={`${
                  isMobile ? "w-[140px] h-[140px]" : "w-[420px] h-[420px]"
                } object-contain mr-0.5 absolute`}
                style={{
                  opacity: beeliaOpacity,
                  willChange: "opacity",
                }}
              >
                <source src="/videos/past.webm" type="video/webm" />
              </motion.video>
            )}

            {/* Present Video - Phase 2 */}
            <motion.video
              ref={phase2VideoRef}
              loop
              muted
              playsInline
              preload="none"
              className={`${
                isMobile ? "w-[140px] h-[140px]" : "w-[420px] h-[420px]"
              } object-contain mr-0.5 absolute`}
              style={{
                opacity: presentVideoOpacity,
                willChange: "opacity",
              }}
            >
              <source src="/videos/present.webm" type="video/webm" />
            </motion.video>

            {/* Future Transition Video */}
            <motion.video
              ref={futureTransitionVideoRef}
              loop
              muted
              playsInline
              preload="none"
              className={`${
                isMobile ? "w-[140px] h-[140px]" : "w-[420px] h-[420px]"
              } object-contain mr-0.5 absolute`}
              style={{
                opacity: futureTransitionCombinedOpacity,
                willChange: "opacity",
              }}
            >
              <source src="/videos/future-transition.webm" type="video/webm" />
            </motion.video>

            {/* Future Main Video */}
            {showFutureMain && (
              <motion.video
                ref={futureMainVideoRef}
                autoPlay
                loop
                muted
                playsInline
                preload="none"
                className={`${
                  isMobile ? "w-[140px] h-[140px]" : "w-[420px] h-[420px]"
                } object-contain mr-0.5 absolute`}
                style={{
                  opacity: futureMainVideoOpacity,
                  willChange: "opacity",
                }}
              >
                <source src="/videos/future-main.webm" type="video/webm" />
              </motion.video>
            )}
          </div>
        </motion.div>

        {/* Light Rays - RESTORED */}
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
            {/* BOX VIDEOS - RESTORED with optimizations: preload="none", no infinite framer-motion animations */}
            {/* Using CSS animation instead of framer-motion for better GPU performance */}
            <style>{`
              @keyframes float-box-video {
                0%, 100% { transform: translateY(-3px); }
                50% { transform: translateY(3px); }
              }
              .box-video-float {
                animation: float-box-video 2s ease-in-out infinite;
              }
            `}</style>
            {/* Left top box */}
            <video
              ref={(el) => {
                boxVideoRefs.current[0] = el;
              }}
              autoPlay={isHeroVisible && traceLinesScrollProgress < 0.9}
              loop
              muted
              playsInline
              preload="none"
              className={`absolute box-video-float ${
                isMobile ? "object-contain" : "object-cover"
              } rounded-[31.5px] pointer-events-none`}
              style={{
                left: "197.278px",
                top: "0.5px",
                width: "109.32px",
                height: "109.32px",
                zIndex: 10,
                opacity:
                  traceLinesScrollProgress > 0
                    ? 1 - traceLinesScrollProgress
                    : 1,
              }}
            >
              <source src="/videos/magnify.webm" type="video/webm" />
            </video>
            {/* Left center box */}
            <video
              ref={(el) => {
                boxVideoRefs.current[1] = el;
              }}
              autoPlay={isHeroVisible && traceLinesScrollProgress < 0.9}
              loop
              muted
              playsInline
              preload="none"
              className={`absolute box-video-float ${
                isMobile ? "object-contain" : "object-cover"
              } rounded-[31.5px] pointer-events-none`}
              style={{
                left: "0.18px",
                top: "129.481px",
                width: "109.32px",
                height: "109.32px",
                zIndex: 10,
                opacity:
                  traceLinesScrollProgress > 0
                    ? 1 - traceLinesScrollProgress
                    : 1,
                animationDelay: "0.3s",
              }}
            >
              <source src="/videos/shield.webm" type="video/webm" />
            </video>
            {/* Left bottom box */}
            <video
              ref={(el) => {
                boxVideoRefs.current[2] = el;
              }}
              autoPlay={isHeroVisible && traceLinesScrollProgress < 0.9}
              loop
              muted
              playsInline
              preload="none"
              className={`absolute box-video-float ${
                isMobile ? "object-contain" : "object-cover"
              } rounded-[31.5px] pointer-events-none`}
              style={{
                left: "146.17px",
                top: "252.641px",
                width: "109.32px",
                height: "109.32px",
                zIndex: 10,
                opacity:
                  traceLinesScrollProgress > 0
                    ? 1 - traceLinesScrollProgress
                    : 1,
                animationDelay: "0.6s",
              }}
            >
              <source src="/videos/bell.webm" type="video/webm" />
            </video>
            {/* Right top box */}
            <video
              ref={(el) => {
                boxVideoRefs.current[3] = el;
              }}
              autoPlay={isHeroVisible && traceLinesScrollProgress < 0.9}
              loop
              muted
              playsInline
              preload="none"
              className={`absolute box-video-float ${
                isMobile ? "object-contain" : "object-cover"
              } rounded-[31.5px] pointer-events-none`}
              style={{
                left: "792.23px",
                top: "0.5px",
                width: "109.32px",
                height: "109.32px",
                zIndex: 10,
                opacity:
                  traceLinesScrollProgress > 0
                    ? 1 - traceLinesScrollProgress
                    : 1,
                animationDelay: "0.15s",
              }}
            >
              <source src="/videos/upload.webm" type="video/webm" />
            </video>
            {/* Right center box */}
            <video
              ref={(el) => {
                boxVideoRefs.current[4] = el;
              }}
              autoPlay={isHeroVisible && traceLinesScrollProgress < 0.9}
              loop
              muted
              playsInline
              preload="none"
              className={`absolute box-video-float ${
                isMobile ? "object-contain" : "object-cover"
              } rounded-[31.5px] pointer-events-none`}
              style={{
                left: "992.16px",
                top: "129.481px",
                width: "109.32px",
                height: "109.32px",
                zIndex: 10,
                opacity:
                  traceLinesScrollProgress > 0
                    ? 1 - traceLinesScrollProgress
                    : 1,
                animationDelay: "0.45s",
              }}
            >
              <source src="/videos/dollar.webm" type="video/webm" />
            </video>
            {/* Right bottom box */}
            <video
              ref={(el) => {
                boxVideoRefs.current[5] = el;
              }}
              autoPlay={isHeroVisible && traceLinesScrollProgress < 0.9}
              loop
              muted
              playsInline
              preload="none"
              className={`absolute box-video-float ${
                isMobile ? "object-contain" : "object-cover"
              } rounded-[31.5px] pointer-events-none`}
              style={{
                left: "838.17px",
                top: "254.15px",
                width: "109.32px",
                height: "109.32px",
                zIndex: 10,
                opacity:
                  traceLinesScrollProgress > 0
                    ? 1 - traceLinesScrollProgress
                    : 1,
                animationDelay: "0.75s",
              }}
            >
              <source src="/videos/graph.webm" type="video/webm" />
            </video>

            {/* TRACE LINES - RESTORED */}
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
              title={title}
              description={description}
            />
          </motion.div>
        </div>
      </section>
    </>
  );
}
