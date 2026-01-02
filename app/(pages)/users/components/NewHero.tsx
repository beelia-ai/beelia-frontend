"use client";

import React, { useState, useEffect, useRef } from "react";
import LightRays from "@/components/LightRays";
import { TraceLinesAnimated } from "@/components/ui/trace-lines-animated";
import { HorizontalBeamAnimated } from "@/components/ui/horizontal-beam-animated";
import { WebGLVideo } from "@/components/ui";
import { HeroContent } from "./HeroContent";
import { VideoBox } from "./VideoBox";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useMotionValue,
  animate,
} from "framer-motion";
import { ReactNode } from "react";
import { SHOW_HERO_VIDEOS } from "@/lib/constants";

// iOS detection helper
function isIOS(): boolean {
  if (typeof window === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

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
  const [windowWidth, setWindowWidth] = useState(1920);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const beeliaVideoRef = useRef<HTMLVideoElement>(null);
  const phase2VideoRef = useRef<HTMLVideoElement>(null);
  const futureTransitionVideoRef = useRef<HTMLVideoElement>(null);
  const futureMainVideoRef = useRef<HTMLVideoElement>(null);
  const globeStopThresholdRef = useRef(Infinity);
  // Refs for box videos to enable pausing when not visible
  const boxVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  // Refs for mobile circular videos
  const mobileVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
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
    // Transition offset: move globe 30px down during past.webm to present.webm transition (200px-600px)
    // Only apply on mobile (desktop should maintain Y position)
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const transitionStart = 200;
    const transitionEnd = 600;
    let transitionOffset = 0;

    if (isMobile) {
      if (latest >= transitionStart && latest <= transitionEnd) {
        // Smooth interpolation from 0 to 30px during transition
        const progress =
          (latest - transitionStart) / (transitionEnd - transitionStart);
        transitionOffset = progress * 30;
      } else if (latest > transitionEnd) {
        // Keep the 35px offset after transition completes
        transitionOffset = 35;
      }
    }
    // Desktop: transitionOffset remains 0, so globe maintains its Y position

    // Keep globe fixed until third section threshold OR footer threshold (whichever comes first)
    const threshold = Math.min(
      thirdSectionThreshold,
      globeStopThresholdRef.current
    );
    if (latest < threshold) return transitionOffset;
    // After threshold, move globe up with scroll (makes it scroll with page)
    // Add transition offset to maintain the downward movement
    return transitionOffset - (latest - threshold);
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

  // Combined opacity for present video: fades in from 200px-600px, visible until 2700px, then fades out smoothly
  // Present video fades in simultaneously as past.webm fades out (200px-600px)
  // Stays fully visible until 2700px, then fades out smoothly as future-transition fades in (2700px-2800px)
  const presentVideoOpacity = useTransform(scrollYMotion, (latest) => {
    const fadeInStart = 200; // Start fading in here (same as past.webm fade out)
    const fadeInEnd = 600; // Fully visible after this
    const fadeOutStart = 2700; // Start fading out when future-transition starts
    const fadeOutEnd = 2800; // Fully faded out after this (same as future-transition fade in)

    // During fade-in phase (200px-600px)
    if (latest >= fadeInStart && latest < fadeInEnd) {
      const progress = (latest - fadeInStart) / (fadeInEnd - fadeInStart);
      return Math.min(1, Math.max(0, progress));
    }
    
    // During fade-out phase (2700px-2800px) - smooth cross-fade with future-transition
    if (latest >= fadeOutStart && latest < fadeOutEnd) {
      const progress = (latest - fadeOutStart) / (fadeOutEnd - fadeOutStart);
      return 1 - Math.min(1, Math.max(0, progress)); // Fade out from 1 to 0
    }
    
    // Before fade-in: invisible
    if (latest < fadeInStart) return 0;
    
    // After fade-out: invisible
    if (latest >= fadeOutEnd) return 0;
    
    // Between fade-in and fade-out: fully visible
    return 1;
  });

  // Track future-transition video duration when it loads
  useEffect(() => {
    const video = futureTransitionVideoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      if (video.duration && isFinite(video.duration)) {
        setFutureTransitionDuration(video.duration);
      }
    };

    const handleLoadedData = () => {
      if (video.duration && isFinite(video.duration)) {
        setFutureTransitionDuration(video.duration);
      }
    };

    const handleCanPlay = () => {
      if (video.duration && isFinite(video.duration)) {
        setFutureTransitionDuration(video.duration);
      }
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("canplay", handleCanPlay);

    // If video is already loaded, get duration immediately
    if (video.readyState >= 1 && video.duration && isFinite(video.duration)) {
      setFutureTransitionDuration(video.duration);
    }

    // Also check periodically on mobile in case metadata loads late
    const checkDuration = setInterval(() => {
      if (
        video.duration &&
        isFinite(video.duration) &&
        !futureTransitionDuration
      ) {
        setFutureTransitionDuration(video.duration);
        clearInterval(checkDuration);
      }
    }, 100);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("canplay", handleCanPlay);
      clearInterval(checkDuration);
    };
  }, [showFutureTransition, futureTransitionDuration]);

  // Track future-transition video playback to fade out 1 second before it ends
  useEffect(() => {
    if (!showFutureTransition || !futureTransitionDuration) return;

    const video = futureTransitionVideoRef.current;
    if (!video) return;

    // Ensure video is playing on mobile
    const ensureVideoPlaying = () => {
      if (video.paused && video.readyState >= 2) {
        video.play().catch(() => {});
      }
    };

    // Try to play immediately
    ensureVideoPlaying();

    // Also ensure it plays after a short delay (for mobile)
    const playTimeout = setTimeout(ensureVideoPlaying, 100);

    let fadeStarted = false;

    const checkVideoTime = () => {
      // Once future-main has taken over, stop monitoring future-transition
      // future-main will loop infinitely on its own
      if (showFutureMain) return;

      // Ensure video is still playing
      ensureVideoPlaying();

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
      clearTimeout(playTimeout);
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
          const video = futureTransitionVideoRef.current;
          video.load();

          // Ensure video plays on mobile - try multiple times if needed
          const playVideo = () => {
            video.play().catch(() => {
              // Retry after a short delay on mobile
              setTimeout(() => {
                video.play().catch(() => {});
              }, 100);
            });
          };

          // Wait for video to be ready before playing
          if (video.readyState >= 2) {
            playVideo();
          } else {
            video.addEventListener("canplay", playVideo, { once: true });
          }
        }
      }

      if (scrollY < transitionStart && showFutureTransition) {
        // Smoothly switch back to present video if scrolling back up
        // Let the opacity transforms handle the smooth fade (they work bidirectionally)
        
        // Reset future-main state immediately when scrolling back up to allow reverse transition
        if (showFutureMain) {
          setShowFutureMain(false);
          futureMainVideoOpacity.set(0);
          futureTransitionVideoOpacity.set(1);
          // Reset future-transition video to beginning for smooth reverse playback
          if (futureTransitionVideoRef.current) {
            futureTransitionVideoRef.current.currentTime = 0;
          }
        }
        
        // Only fully reset future-transition state when we're back in present video range
        if (scrollY < 2600) {
          // Fully back in present range - reset future video states
          setShowFutureTransition(false);
          futureTransitionCombinedOpacity.set(0);
          if (phase2VideoRef.current) {
            phase2VideoRef.current.play().catch(() => {});
          }
        }
        // Between 2600-2700: let transforms handle smooth fade (present fades in, future-transition fades out)
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [
    showFutureTransition,
    futureTransitionVideoOpacity,
    futureMainVideoOpacity,
    futureTransitionCombinedOpacity,
  ]);

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
    setIsIOSDevice(isIOS());
  }, []);

  // Ensure mobile videos play when mounted
  useEffect(() => {
    if (windowWidth >= 768) return;

    const playMobileVideos = () => {
      const videos = mobileVideoRefs.current.filter(
        Boolean
      ) as HTMLVideoElement[];
      videos.forEach((video) => {
        if (video.paused) {
          video.play().catch(() => {});
        }
      });
    };

    // Try to play immediately
    playMobileVideos();

    // Also try after a short delay to ensure they're ready
    const timeout = setTimeout(playMobileVideos, 500);

    return () => clearTimeout(timeout);
  }, [windowWidth, isMounted]);

  // Intersection Observer to pause box/mobile videos when hero is not visible
  // Globe videos are fixed positioned and should continue playing regardless of hero visibility
  // This is the KEY performance optimization - videos only play when user can see them
  useEffect(() => {
    if (!heroRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries[0]?.isIntersecting ?? false;
        setIsHeroVisible(isVisible);

        // Globe videos are fixed and should always play (they're always visible on screen)
        // Only pause/play box and mobile videos based on hero visibility
        const boxVideos = boxVideoRefs.current.filter(Boolean);
        const mobileVideos = mobileVideoRefs.current.filter(Boolean);
        const nonGlobeVideos = [...boxVideos, ...mobileVideos].filter(
          Boolean
        ) as HTMLVideoElement[];

        nonGlobeVideos.forEach((video) => {
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

  // Ensure present video plays when visible (opacity > 0)
  useMotionValueEvent(presentVideoOpacity, "change", (opacity) => {
    if (phase2VideoRef.current) {
      if (opacity > 0 && phase2VideoRef.current.paused) {
        phase2VideoRef.current.play().catch(() => {});
      } else if (opacity === 0 && !phase2VideoRef.current.paused) {
        phase2VideoRef.current.pause();
      }
    }
  });

  // Ensure past video plays when visible (opacity > 0)
  useMotionValueEvent(beeliaOpacity, "change", (opacity) => {
    if (beeliaVideoRef.current) {
      if (opacity > 0 && beeliaVideoRef.current.paused) {
        beeliaVideoRef.current.play().catch(() => {});
      } else if (opacity === 0 && !beeliaVideoRef.current.paused) {
        beeliaVideoRef.current.pause();
      }
    }
  });

  // Ensure future transition video plays when visible (opacity > 0)
  useMotionValueEvent(futureTransitionCombinedOpacity, "change", (opacity) => {
    if (futureTransitionVideoRef.current) {
      if (opacity > 0 && futureTransitionVideoRef.current.paused) {
        futureTransitionVideoRef.current.play().catch(() => {});
      } else if (opacity === 0 && !futureTransitionVideoRef.current.paused) {
        futureTransitionVideoRef.current.pause();
      }
    }
  });

  // Ensure future main video plays when visible (opacity > 0)
  useMotionValueEvent(futureMainVideoOpacity, "change", (opacity) => {
    if (futureMainVideoRef.current) {
      if (opacity > 0 && futureMainVideoRef.current.paused) {
        futureMainVideoRef.current.play().catch(() => {});
      } else if (opacity === 0 && !futureMainVideoRef.current.paused) {
        futureMainVideoRef.current.pause();
      }
    }
  });

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
  const globeSize = isMobile ? 280 : 420;

  // Globe top position calculation
  // Desktop: calc(128px + 182px - 210px) = 100px
  // Mobile: reduced spacing from top (simplified since trace lines are hidden)
  const globeTop = isMobile
    ? "80px" // Moved higher
    : "calc(128px + 182px - 210px)";

  // Circular arrangement for mobile videos
  // 6 videos positioned equidistantly around the globe
  const videoRadius = isMobile ? 115 : 0; // Distance from globe center (closer)
  const videoSize = isMobile ? 81 : 0; // Size of each video on mobile (0.9x of 90px)
  const videoAngles = [0, 60, 120, 180, 240, 300]; // Degrees for 6 videos
  const mobileVideos = [
    { src: "/videos/magnify.mp4" },
    { src: "/videos/shield.mp4" },
    { src: "/videos/bellsm.mp4" },
    { src: "/videos/upload.mp4" },
    { src: "/videos/dollar.mp4" },
    { src: "/videos/graph.mp4" },
  ];

  // Desktop video box configuration
  const desktopVideoBoxes = [
    {
      src: "/videos/magnify.mp4",
      left: "201.278px",
      top: "4.5px",
      width: "101.32px",
      height: "101.32px",
    },
    {
      src: "/videos/shield.mp4",
      left: "11.11px",
      top: "140.411px",
      width: "87.46px",
      height: "87.46px",
      animationDelay: "0.3s",
    },
    {
      src: "/videos/bell.mp4",
      left: "157.10px",
      top: "263.571px",
      width: "87.46px",
      height: "87.46px",
      animationDelay: "0.6s",
    },
    {
      src: "/videos/upload.mp4",
      left: "803.16px",
      top: "11.43px",
      width: "87.46px",
      height: "87.46px",
      animationDelay: "0.15s",
    },
    {
      src: "/videos/dollar.mp4",
      left: "1003.09px",
      top: "140.411px",
      width: "87.46px",
      height: "87.46px",
      animationDelay: "0.45s",
    },
    {
      src: "/videos/graph.mp4",
      left: "849.10px",
      top: "265.08px",
      width: "87.46px",
      height: "87.46px",
      animationDelay: "0.75s",
    },
  ];

  return (
    <>
      {/* CSS to hide default video play button on mobile */}
      <style dangerouslySetInnerHTML={{
        __html: `
          video::-webkit-media-controls {
            display: none !important;
          }
          video::-webkit-media-controls-enclosure {
            display: none !important;
          }
          video::-webkit-media-controls-play-button {
            display: none !important;
          }
          video::-webkit-media-controls-start-playback-button {
            display: none !important;
          }
          video::--webkit-media-controls-overlay-play-button {
            display: none !important;
          }
        `
      }} />
      <section
        id="hero-section"
        ref={heroRef}
        className="h-screen bg-transparent relative overflow-visible"
        style={{ touchAction: "pan-y" }}
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
          <div className="w-full h-full flex items-center justify-center relative" style={{ background: "transparent" }}>
            {/* Past Video */}
            {SHOW_HERO_VIDEOS &&
              !hidePastVideo &&
              (isMobile ? (
                <motion.div
                  className={`${
                    isMobile ? "w-[280px] h-[280px]" : "w-[444px] h-[444px]"
                  } mr-0.5 absolute`}
                  style={{
                    opacity: beeliaOpacity,
                    willChange: "opacity",
                  }}
                >
                  <WebGLVideo
                    webmSrc="/videos/past.webm"
                    stackedAlphaSrc="/videos/past-stacked.mp4"
                    className="w-full h-full object-contain"
                    autoPlay={isHeroVisible}
                    loop
                    muted
                  />
                </motion.div>
              ) : (
                <motion.video
                  ref={beeliaVideoRef}
                  autoPlay={isHeroVisible}
                  loop
                  muted
                  playsInline
                  preload="none"
                  className={`${
                    isMobile ? "w-[280px] h-[280px]" : "w-[444px] h-[444px]"
                  } object-contain mr-0.5 absolute`}
                  style={{
                    opacity: beeliaOpacity,
                    willChange: "opacity",
                    background: "transparent",
                  }}
                >
                  <source src="/videos/past.webm" type="video/webm" />
                </motion.video>
              ))}

            {/* Present Video - Phase 2 */}
            {SHOW_HERO_VIDEOS && isMobile ? (
              <motion.div
                className={`${
                  isMobile ? "w-[280px] h-[280px]" : "w-[420px] h-[420px]"
                } mr-0.5 absolute`}
                style={{
                  opacity: presentVideoOpacity,
                  willChange: "opacity",
                }}
              >
                <WebGLVideo
                  webmSrc="/videos/present.webm"
                  stackedAlphaSrc="/videos/present-stacked.mp4"
                  className="w-full h-full object-contain"
                  autoPlay={isHeroVisible}
                  loop
                  muted
                />
              </motion.div>
            ) : SHOW_HERO_VIDEOS ? (
              <motion.video
                ref={phase2VideoRef}
                loop
                muted
                playsInline
                preload="none"
                className={`${
                  isMobile ? "w-[280px] h-[280px]" : "w-[420px] h-[420px]"
                } object-contain mr-0.5 absolute`}
                style={{
                  opacity: presentVideoOpacity,
                  willChange: "opacity",
                  background: "transparent",
                }}
              >
                <source src="/videos/present.webm" type="video/webm" />
              </motion.video>
            ) : null}

            {/* Future Transition Video */}
            {SHOW_HERO_VIDEOS && isMobile ? (
              <motion.div
                className={`${
                  isMobile ? "w-[280px] h-[280px]" : "w-[400px] h-[400px]"
                } absolute`}
                style={{
                  opacity: futureTransitionCombinedOpacity,
                  willChange: "opacity",
                  marginLeft: "4px",
                }}
              >
                <WebGLVideo
                  webmSrc="/videos/future-transition.webm"
                  stackedAlphaSrc="/videos/future-transition-stacked.mp4"
                  className="w-full h-full object-contain"
                  autoPlay={isHeroVisible}
                  loop={false}
                  muted
                  videoRef={futureTransitionVideoRef}
                />
              </motion.div>
            ) : SHOW_HERO_VIDEOS ? (
              <motion.video
                ref={futureTransitionVideoRef}
                loop={false}
                muted
                playsInline
                preload="none"
                className={`${
                  isMobile ? "w-[280px] h-[280px]" : "w-[400px] h-[400px]"
                } object-contain absolute`}
                style={{
                  opacity: futureTransitionCombinedOpacity,
                  willChange: "opacity",
                  marginLeft: "4px",
                  background: "transparent",
                }}
              >
                <source
                  src="/videos/future-transition.webm"
                  type="video/webm"
                />
              </motion.video>
            ) : null}

            {/* Future Main Video */}
            {SHOW_HERO_VIDEOS &&
              showFutureMain &&
              (isMobile ? (
                <motion.div
                  className={`${
                    isMobile ? "w-[280px] h-[280px]" : "w-[400px] h-[400px]"
                  } absolute`}
                  style={{
                    opacity: futureMainVideoOpacity,
                    willChange: "opacity",
                    marginLeft: "4px",
                  }}
                >
                  <WebGLVideo
                    webmSrc="/videos/future-main.webm"
                    stackedAlphaSrc="/videos/future-main-stacked.mp4"
                    className="w-full h-full object-contain"
                    autoPlay
                    loop
                    muted
                  />
                </motion.div>
              ) : (
                <motion.video
                  ref={futureMainVideoRef}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="none"
                  className={`${
                    isMobile ? "w-[280px] h-[280px]" : "w-[400px] h-[400px]"
                  } object-contain absolute`}
                  style={{
                    opacity: futureMainVideoOpacity,
                    willChange: "opacity",
                    marginLeft: "4px",
                    background: "transparent",
                  }}
                >
                  <source src="/videos/future-main.webm" type="video/webm" />
                </motion.video>
              ))}
          </div>
        </motion.div>

        {/* Mobile: Circular video arrangement around globe */}
        {SHOW_HERO_VIDEOS && isMobile && (
          <motion.div
            className="fixed left-1/2 pointer-events-none"
            style={{
              top: `calc(${globeTop} + ${globeSize / 2}px)`,
              zIndex: 50,
              x: "-50%",
              y: "-50%",
              width: `${globeSize + videoRadius * 2}px`,
              height: `${globeSize + videoRadius * 2}px`,
              opacity:
                traceLinesScrollProgress > 0 ? 1 - traceLinesScrollProgress : 1,
            }}
          >
            {mobileVideos.map((video, index) => {
              const angle = (videoAngles[index] * Math.PI) / 180;
              const x = Math.cos(angle) * videoRadius;
              const y = Math.sin(angle) * videoRadius;

              return (
                <video
                  key={index}
                  ref={(el) => {
                    mobileVideoRefs.current[index] = el;
                  }}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  controls={false}
                  disablePictureInPicture
                  disableRemotePlayback
                  className="absolute rounded-[18px] object-cover"
                  style={{
                    width: `${videoSize}px`,
                    height: `${videoSize}px`,
                    left: `calc(50% + ${x}px - ${videoSize / 2}px)`,
                    top: `calc(50% + ${y}px - ${videoSize / 2}px)`,
                    pointerEvents: "none",
                  }}
                  onLoadedData={(e) => {
                    const vid = e.currentTarget;
                    if (vid.paused) {
                      vid.play().catch(() => {});
                    }
                  }}
                >
                  <source src={video.src} type="video/mp4" />
                </video>
              );
            })}
          </motion.div>
        )}

        {/* Light Rays - RESTORED - Desktop only */}
        {!isMobile && (
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
        )}

        {/* Content container with proper spacing - flex column layout */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-start pt-20 md:pt-32 overflow-visible">
          {/* Trace Lines Animated SVG - positioned at top with scroll animation - Desktop only */}
          {!isMobile && (
            <motion.div
              className="relative w-[1102px] h-[364px] mb-12"
              style={{
                scale: traceLinesScale,
                willChange: "transform",
                marginTop: "-5px",
                transformOrigin: "center center",
              }}
            >
              {/* BOX VIDEOS - RESTORED with optimizations: preload="none", no infinite framer-motion animations */}
              {/* Using CSS animation instead of framer-motion for better GPU performance */}
              {SHOW_HERO_VIDEOS && (
                <>
                  <style>{`
              @keyframes float-box-video {
                0%, 100% { transform: translateY(-3px); }
                50% { transform: translateY(3px); }
              }
              .box-video-float {
                animation: float-box-video 2s ease-in-out infinite;
              }
            `}</style>
                  {desktopVideoBoxes.map((video, index) => (
                    <VideoBox
                      key={index}
                      src={video.src}
                      stackedSrc={video.src}
                      left={video.left}
                      top={video.top}
                      width={video.width}
                      height={video.height}
                      isHeroVisible={isHeroVisible}
                      traceLinesScrollProgress={traceLinesScrollProgress}
                      animationDelay={video.animationDelay}
                    />
                  ))}
                </>
              )}

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
          )}

          {/* Mobile spacer to maintain content position (replaces trace lines height) */}
          <div className="h-[450px] md:h-0" />

          {/* Content wrapper with scroll animations */}
          {/* Content wrapper with scroll animations */}
          <motion.div
            className="flex flex-col items-center w-full mt-16 md:mt-0"
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
