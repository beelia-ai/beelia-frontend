"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { FeaturesGrid, FeatureData } from "./FeaturesGrid";
import { TeamGrid } from "./TeamGrid";
import { WebGLVideo } from "@/components/ui";
import { SHOW_HERO_VIDEOS } from "@/lib/constants";

// iOS detection helper
function isIOS(): boolean {
  if (typeof window === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

// Track window width for responsive scaling
function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState(1920);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowWidth;
}

// Default card data for users
const DEFAULT_CARD_DATA = [
  {
    title: "Discover",
    subtitle: "",
    description:
      "Find the right AI tool without searching endlessly. Tools are clearly organized and presented so users can quickly understand what each one does and whether it fits their needs.",
    // Magnifying glass icon (Heroicons)
    iconPath:
      "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z",
  },
  {
    title: "Subscribe",
    subtitle: "",
    description:
      "Activate AI instantly. One-click subscriptions, unified billing, and immediate access so you can start using tools the moment you subscribe.",
    // Bell icon (Heroicons)
    iconPath:
      "M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0",
  },
  {
    title: "Safety",
    subtitle: "",
    description:
      "Adopt AI with confidence. Every tool and creator goes through a verification process, with clear information on access, usage, and ownership.",
    // Shield check icon (Heroicons)
    iconPath:
      "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
  },
];

// Default box data for users
const DEFAULT_BOX_DATA = [
  {
    video: "/videos/magnify.webm",
    title: "Discover",
    x: 15.055,
    stackedVideo: "/videos/magnify.mp4",
  },
  {
    video: "/videos/shield.webm",
    title: "Safety",
    x: 391.754,
    stackedVideo: "/videos/shield.mp4",
  },
  {
    video: "/videos/bell.webm",
    title: "Subscribe",
    x: 767.027,
    stackedVideo: "/videos/bell.mp4",
  },
];

interface BoxData {
  video: string;
  title: string;
  x: number;
  stackedVideo?: string;
}

interface CardData {
  title: string;
  subtitle: string;
  description: string;
  iconPath: string;
}

interface AboutProductProps {
  boxData?: BoxData[];
  cardData?: CardData[];
  features?: FeatureData[];
}

// Pre-calculated stroke geometry to avoid hydration mismatch
const STROKE_GEOMETRY = {
  // Desktop positions
  desktop: {
    // Left diagonal: from center (391.754, 159) to left (15.055, 208)
    leftDiagonal: {
      length: Math.sqrt(Math.pow(391.754 - 15.055, 2) + Math.pow(208 - 159, 2)),
      angle:
        Math.round(
          Math.atan2(208 - 159, 15.055 - 391.754) * (180 / Math.PI) * 1000
        ) / 1000,
    },
    // Right diagonal: from center (391.754, 159) to right (767.027, 208)
    rightDiagonal: {
      length: Math.sqrt(
        Math.pow(767.027 - 391.754, 2) + Math.pow(208 - 159, 2)
      ),
      angle:
        Math.round(
          Math.atan2(208 - 159, 767.027 - 391.754) * (180 / Math.PI) * 1000
        ) / 1000,
    },
    centerX: 391.754,
    leftX: 15.055,
    rightX: 767.027,
  },
  // Mobile positions - boxes are 120px wide with 5px gaps, centered in 783px container
  mobile: {
    boxWidth: 120,
    gap: 5,
    containerWidth: 783,
    // Calculate positions: total width = 3*120 + 2*5 = 370px, centered = (783-370)/2 = 206.5px
    leftX: 206.5 + 60, // 266.5px (center of left box)
    centerX: 206.5 + 60 + 120 + 5, // 391.5px (center of center box)
    rightX: 206.5 + 60 + 120 + 5 + 120 + 5, // 516.5px (center of right box)
    // Left diagonal: from center to left
    leftDiagonal: {
      length: 0,
      angle: 0,
    },
    // Right diagonal: from center to right
    rightDiagonal: {
      length: 0,
      angle: 0,
    },
  },
};

// Calculate mobile stroke geometry
STROKE_GEOMETRY.mobile.leftDiagonal.length = Math.sqrt(
  Math.pow(STROKE_GEOMETRY.mobile.centerX - STROKE_GEOMETRY.mobile.leftX, 2) +
    Math.pow(208 - 159, 2)
);
STROKE_GEOMETRY.mobile.leftDiagonal.angle =
  Math.round(
    Math.atan2(
      208 - 159,
      STROKE_GEOMETRY.mobile.leftX - STROKE_GEOMETRY.mobile.centerX
    ) *
      (180 / Math.PI) *
      1000
  ) / 1000;

STROKE_GEOMETRY.mobile.rightDiagonal.length = Math.sqrt(
  Math.pow(STROKE_GEOMETRY.mobile.rightX - STROKE_GEOMETRY.mobile.centerX, 2) +
    Math.pow(208 - 159, 2)
);
STROKE_GEOMETRY.mobile.rightDiagonal.angle =
  Math.round(
    Math.atan2(
      208 - 159,
      STROKE_GEOMETRY.mobile.rightX - STROKE_GEOMETRY.mobile.centerX
    ) *
      (180 / Math.PI) *
      1000
  ) / 1000;

export function AboutProduct({
  boxData = DEFAULT_BOX_DATA,
  cardData = DEFAULT_CARD_DATA,
  features,
}: AboutProductProps = {}) {
  const windowWidth = useWindowWidth();
  // Calculate responsive scale factor for mobile bottom lines
  const isMobile = windowWidth < 768;
  const bottomLinesScale = isMobile
    ? Math.min((windowWidth - 32) / 783, 0.4)
    : 1;

  // Track mounted state to avoid hydration mismatch
  const [isMounted, setIsMounted] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    setIsIOSDevice(isIOS());
  }, []);

  // Track hover state for each box
  const [hoveredBox, setHoveredBox] = useState<string | null>(null);

  // Track absolute scroll Y position for scale animation
  const { scrollY: scrollYMotion } = useScroll();

  // Track scroll Y position for vertical beam opening animation
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial value
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scale animation from 0.5 to 1 based on scroll Y position (500px to 900px)
  // Exit animation: scale from 1 to 0 starting at 1400px (1400px to 1800px)
  const scale = useTransform(scrollYMotion, (latest) => {
    // Exit phase: scale down from 1 to 0 (1400px to 1800px)
    if (latest >= 1400 && latest <= 1800) {
      return 1 - (latest - 1400) / 400; // 1 to 0 over 400px
    }
    if (latest > 1800) return 0; // Fully hidden after 1800px

    // Entry phase: scale up from 0.5 to 1 (500px to 900px)
    if (latest < 500) return 0.5;
    if (latest >= 900) return 1;
    return 0.5 + ((latest - 500) / 400) * 0.5; // Linear interpolation from 0.5 to 1 (900 - 500 = 400)
  });

  // Opacity animation from 0 to 1 based on scroll Y position (500px to 900px)
  // Exit animation: opacity from 1 to 0 starting at 1400px (1400px to 1800px)
  const opacity = useTransform(scrollYMotion, (latest) => {
    // Exit phase: opacity decreases from 1 to 0 (1400px to 1800px)
    if (latest >= 1400 && latest <= 1800) {
      return 1 - (latest - 1400) / 400; // 1 to 0 over 400px
    }
    if (latest > 1800) return 0; // Fully hidden after 1800px

    // Entry phase: opacity increases from 0 to 1 (500px to 900px)
    if (latest < 500) return 0;
    if (latest >= 900) return 1;
    return (latest - 500) / 400; // Linear interpolation from 0 to 1 (900 - 500 = 400)
  });

  // Blur animation: instant blur at 500y, stays at max until 600y, then unblur from 600y to 700y
  // Exit animation: blur from 0 to 10px starting at 1400px (1400px to 1500px)
  const blur = useTransform(scrollYMotion, (latest) => {
    // Exit phase: blur increases from 0 to 10px (1400px to 1500px)
    if (latest >= 1400 && latest <= 1500) {
      const progress = (latest - 1400) / 100;
      return progress * 10; // 0 to 10px
    }
    if (latest > 1500) return 10; // Stay blurred after 1500px

    // Entry phase: blur decreases from 10px to 0 (500px to 700px)
    if (latest < 500) return 0;
    if (latest >= 500 && latest <= 600) {
      // Instant blur at 500px, stay at max (10px) throughout this range
      return 10;
    }
    if (latest > 600 && latest < 700) {
      // Blur decreases from 10px to 0
      const progress = (latest - 600) / 100;
      return 10 - progress * 10; // 10px to 0
    }
    return 0; // No blur between 700px and 1400px
  });

  const blurFilter = useTransform(blur, (blurValue) => `blur(${blurValue}px)`);

  // Boxes fade-in animation from Y=1100px to Y=1200px
  // Exit animation: opacity from 1 to 0 starting at 1500px (same as strokes retract)
  const boxesOpacity = useTransform(scrollYMotion, (latest) => {
    // Exit phase: opacity decreases from 1 to 0 (1500px to 1700px) - synced with strokes
    if (latest >= 1500 && latest <= 1700) {
      return 1 - (latest - 1500) / 200; // 1 to 0 over 200px
    }
    if (latest > 1700) return 0; // Fully hidden after 1700px

    // Entry phase: opacity increases from 0 to 1 (1100px to 1200px)
    if (latest < 1100) return 0;
    if (latest >= 1200) return 1;
    return (latest - 1100) / 100; // Fade in from 0 to 1 between 1100px and 1200px
  });

  // Strokes opacity - visible when strokes are drawing or visible
  // Entry: 0 → 1 at 900px (instant), stays at 1 until exit
  // Exit: 1 → 0 from 1500px to 1700px
  const strokesOpacity = useTransform(scrollYMotion, (latest) => {
    // Exit phase: opacity decreases from 1 to 0 (1500px to 1700px)
    if (latest >= 1500 && latest <= 1700) {
      return 1 - (latest - 1500) / 200;
    }
    if (latest > 1700) return 0;

    // Entry phase: instant visibility when strokes start drawing
    if (latest < 900) return 0;
    return 1; // Fully visible from 900px onwards
  });

  // Opening progress for vertical beam:
  // - Before Y=900px: lines are hidden (progress = 0)
  // - From Y=900px to Y=1100px: lines grow from 0 to 1 (same speed as before: 200px range)
  // - After Y=1100px: lines are fully visible (progress = 1)
  // Exit animation: progress from 1 to 0 starting at 1500px (1500px to 1700px)
  const openingProgress = useTransform(scrollYMotion, (latest) => {
    // Exit phase: progress decreases from 1 to 0 (1500px to 1700px)
    if (latest >= 1500 && latest <= 1700) {
      return 1 - (latest - 1500) / 200; // 1 to 0 over 200px
    }
    if (latest > 1700) return 0; // Fully hidden after 1700px

    // Entry phase: progress increases from 0 to 1 (900px to 1100px)
    if (latest < 900) return 0; // Hidden before 900px
    if (latest >= 1100) return 1; // Fully visible after 1100px
    return (latest - 900) / 200; // Grow from 0 to 1 between 900px and 1100px (200px range, same speed)
  });

  // Get opening progress value for passing to component
  const [openingProgressValue, setOpeningProgressValue] = useState(0);
  // Opening animation is active when scrollY is >= 900px
  const isOpening = scrollY >= 900;

  useMotionValueEvent(openingProgress, "change", (latest) => {
    setOpeningProgressValue(latest);
  });

  // Third section animations - appear at 3000px scroll
  const thirdSectionScale = useTransform(scrollYMotion, (latest) => {
    if (latest >= 3000 && latest <= 3400) {
      return 0.5 + ((latest - 3000) / 400) * 0.5; // Scale from 0.5 to 1
    }
    if (latest < 3000) return 0.5;
    if (latest >= 3400) return 1;
    return 1;
  });

  const thirdSectionOpacity = useTransform(scrollYMotion, (latest) => {
    if (latest < 3000) return 0;
    if (latest >= 3400) return 1;
    return (latest - 3000) / 400; // Opacity from 0 to 1
  });

  const thirdSectionBlur = useTransform(scrollYMotion, (latest) => {
    if (latest < 3000) return 0;
    if (latest >= 3000 && latest <= 3100) {
      return 10; // Instant blur at 3000px
    }
    if (latest > 3100 && latest < 3200) {
      const progress = (latest - 3100) / 100;
      return 10 - progress * 10; // Blur decreases from 10px to 0
    }
    return 0; // No blur after 3200px
  });

  const thirdSectionBlurFilter = useTransform(
    thirdSectionBlur,
    (blurValue) => `blur(${blurValue}px)`
  );

  // Third section Y offset - scrolls with page after 3450px (same as globe)
  const thirdSectionY = useTransform(scrollYMotion, (latest) => {
    const threshold = 3450;
    if (latest < threshold) return 0;
    // After threshold, move up with scroll (makes it scroll with page)
    return -(latest - threshold);
  });

  return (
    <div
      className="relative w-full bg-transparent"
      style={{ minHeight: "4000px" }}
    >
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
      {/* Section content */}
      <div className="relative z-10 flex flex-col items-center justify-start pt-20 md:pt-32 w-full max-w-full">
        {/* Second Section Header */}
        {/* OneStop Image and Text Container - maintains same distance from top as globe */}
        <motion.div
          className="fixed left-1/2 pointer-events-none"
          style={{
            top:
              windowWidth < 768
                ? "clamp(60px, 15vh, 100px)"
                : "calc(128px + 182px - 210px)",
            zIndex: 50,
            x: "-50%",
            scale,
            opacity,
            filter: blurFilter,
            transformOrigin: "center center",
            willChange: "transform, opacity, filter",
            width: windowWidth < 768 ? "90vw" : "auto",
            maxWidth: "1000px",
          }}
        >
          <div className="flex flex-col items-center px-4 md:px-0">
            {/* OneStop Text */}
            <div
              className="flex justify-center w-full"
              style={{ marginBottom: "10px" }}
            >
              <h2 className="text-center whitespace-nowrap">
                <span
                  className="font-editors-note-italic text-2xl md:text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#FF8C32] to-[#FEDA24]"
                  style={{
                    fontSize: "clamp(24px, 3vw, 48px)",
                  }}
                >
                  open&nbsp;
                </span>
                <span
                  className="font-outfit text-3xl md:text-5xl lg:text-6xl font-bold text-white uppercase tracking-tight"
                  style={{
                    fontFamily: "var(--font-outfit), sans-serif",
                    fontWeight: 600,
                    fontSize: "clamp(24px, 2.7vw, 48px)",
                    lineHeight: "100%",
                    letterSpacing: "0.05em",
                    opacity: 0.9,
                  }}
                >
                  AI Marketplace
                </span>
              </h2>
            </div>

            {/* Description text under OneStop Image */}
            <p
              className="text-center mb-8 md:mb-12 px-4"
              style={{
                width: windowWidth < 768 ? "100%" : "457.771484375px",
                height: windowWidth < 768 ? "auto" : "44px",
                fontFamily: "var(--font-outfit), Outfit, sans-serif",
                fontWeight: 300,
                fontStyle: "normal",
                fontSize: windowWidth < 768 ? "14px" : "16px",
                lineHeight: "140%",
                letterSpacing: "2%",
                textAlign: "center",
                color: "#FFFFFF",
                maxWidth: windowWidth < 768 ? "90vw" : "457.771484375px",
                opacity: 0.7,
              }}
            >
              A single place to discover, trust, and access AI tools, without
              setup, guesswork, or fragmentation
            </p>
          </div>
        </motion.div>

        {/* Spacer to maintain layout flow (Onestop wrapper is fixed/absolute) */}
        <div
          className="w-full"
          style={{ height: windowWidth < 768 ? "300px" : "416px" }}
        />

        {/* CSS strokes - separate container with stroke-based opacity */}
        <motion.div
          className="fixed left-1/2 pointer-events-none"
          style={{
            top: isMobile
              ? "clamp(280px, 40vh, 400px)"
              : windowWidth < 1024
              ? "clamp(400px, 50vh, 520px)"
              : "520px",
            marginTop: isMobile
              ? "-120px"
              : windowWidth < 1024
              ? "-200px"
              : "-265px",
            zIndex: 47,
            x: "-50%",
            opacity: strokesOpacity,
            willChange: "opacity",
            width: "783px",
            height: "390px",
            transform: isMobile
              ? `scale(${bottomLinesScale})`
              : windowWidth < 1024
              ? "scale(0.8)"
              : "scale(1)",
            transformOrigin: "center center",
          }}
        >
          {/* CSS-based strokes - only render on client to avoid hydration mismatch */}
          {isMounted && (
            <>
              {/* CSS Keyframes for beam animations */}
              <style
                dangerouslySetInnerHTML={{
                  __html: `
                @keyframes beam-down {
                  0% { top: -30%; }
                  100% { top: 130%; }
                }
                @keyframes beam-left {
                  0% { left: 100%; }
                  100% { left: -30%; }
                }
                @keyframes beam-right {
                  0% { left: -30%; }
                  100% { left: 100%; }
                }
              `,
                }}
              />

              {/* Center vertical line (from top to box) */}
              <div
                className="absolute overflow-hidden"
                style={{
                  left: isMobile
                    ? `${STROKE_GEOMETRY.mobile.centerX}px`
                    : `${STROKE_GEOMETRY.desktop.centerX}px`,
                  top: "120px", // Moved down even more from top
                  width: "3px",
                  height: `${(227 - 120) * openingProgressValue}px`, // Decreased height by 120px
                  transform: "translateX(-50%)",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: "#444444",
                    width: "1px",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                />
                {openingProgressValue >= 1 && (
                  <div
                    className="absolute"
                    style={{
                      left: "50%",
                      width: "2px",
                      height: "68px", // Fixed height to match original 30% of 227px (~68px)
                      transform: "translateX(-50%)",
                      background:
                        "linear-gradient(180deg, transparent 0%, rgba(254,218,36,0.2) 10%, rgba(254,218,36,0.5) 30%, #FEDA24 45%, white 50%, #FEDA24 55%, rgba(254,218,36,0.5) 70%, rgba(254,218,36,0.2) 90%, transparent 100%)",
                      filter: "drop-shadow(0 0 3px #FEDA24)",
                      animation: "beam-down 2s ease-in-out infinite",
                    }}
                  />
                )}
              </div>

              {/* Center to left diagonal with beam */}
              <div
                className="absolute overflow-hidden"
                style={{
                  left: isMobile
                    ? `${STROKE_GEOMETRY.mobile.centerX}px`
                    : `${STROKE_GEOMETRY.desktop.centerX}px`,
                  top: "159px",
                  width: `${
                    (isMobile
                      ? STROKE_GEOMETRY.mobile.leftDiagonal.length
                      : STROKE_GEOMETRY.desktop.leftDiagonal.length) *
                    openingProgressValue
                  }px`,
                  height: "3px",
                  transformOrigin: "left center",
                  transform: `rotate(${
                    isMobile
                      ? STROKE_GEOMETRY.mobile.leftDiagonal.angle
                      : STROKE_GEOMETRY.desktop.leftDiagonal.angle
                  }deg)`,
                }}
              >
                <div
                  className="absolute"
                  style={{
                    background: "#444444",
                    height: "1px",
                    top: "50%",
                    left: 0,
                    right: 0,
                    transform: "translateY(-50%)",
                  }}
                />
                {openingProgressValue >= 1 && (
                  <div
                    className="absolute"
                    style={{
                      top: "50%",
                      width: "30%",
                      height: "2px",
                      transform: "translateY(-50%)",
                      background:
                        "linear-gradient(90deg, transparent 0%, rgba(254,218,36,0.2) 10%, rgba(254,218,36,0.5) 30%, #FEDA24 45%, white 50%, #FEDA24 55%, rgba(254,218,36,0.5) 70%, rgba(254,218,36,0.2) 90%, transparent 100%)",
                      filter: "drop-shadow(0 0 3px #FEDA24)",
                      animation: "beam-right 2s ease-in-out infinite",
                      animationDelay: "0s",
                    }}
                  />
                )}
              </div>

              {/* Left vertical line (from diagonal end to box) */}
              <div
                className="absolute overflow-hidden"
                style={{
                  left: isMobile
                    ? `${STROKE_GEOMETRY.mobile.leftX}px`
                    : `${STROKE_GEOMETRY.desktop.leftX}px`,
                  top: "208px",
                  width: "3px",
                  height: `${(227 - 208) * openingProgressValue}px`,
                  transform: "translateX(-50%)",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: "#444444",
                    width: "1px",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                />
              </div>

              {/* Center to right diagonal with beam */}
              <div
                className="absolute overflow-hidden"
                style={{
                  left: isMobile
                    ? `${STROKE_GEOMETRY.mobile.centerX}px`
                    : `${STROKE_GEOMETRY.desktop.centerX}px`,
                  top: "159px",
                  width: `${
                    (isMobile
                      ? STROKE_GEOMETRY.mobile.rightDiagonal.length
                      : STROKE_GEOMETRY.desktop.rightDiagonal.length) *
                    openingProgressValue
                  }px`,
                  height: "3px",
                  transformOrigin: "left center",
                  transform: `rotate(${
                    isMobile
                      ? STROKE_GEOMETRY.mobile.rightDiagonal.angle
                      : STROKE_GEOMETRY.desktop.rightDiagonal.angle
                  }deg)`,
                }}
              >
                <div
                  className="absolute"
                  style={{
                    background: "#444444",
                    height: "1px",
                    top: "50%",
                    left: 0,
                    right: 0,
                    transform: "translateY(-50%)",
                  }}
                />
                {openingProgressValue >= 1 && (
                  <div
                    className="absolute"
                    style={{
                      top: "50%",
                      width: "30%",
                      height: "2px",
                      transform: "translateY(-50%)",
                      background:
                        "linear-gradient(90deg, transparent 0%, rgba(254,218,36,0.2) 10%, rgba(254,218,36,0.5) 30%, #FEDA24 45%, white 50%, #FEDA24 55%, rgba(254,218,36,0.5) 70%, rgba(254,218,36,0.2) 90%, transparent 100%)",
                      filter: "drop-shadow(0 0 3px #FEDA24)",
                      animation: "beam-right 2s ease-in-out infinite",
                      animationDelay: "0s",
                    }}
                  />
                )}
              </div>

              {/* Right vertical line (from diagonal end to box) */}
              <div
                className="absolute overflow-hidden"
                style={{
                  left: isMobile
                    ? `${STROKE_GEOMETRY.mobile.rightX}px`
                    : `${STROKE_GEOMETRY.desktop.rightX}px`,
                  top: "208px",
                  width: "3px",
                  height: `${(227 - 208) * openingProgressValue}px`,
                  transform: "translateX(-50%)",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: "#444444",
                    width: "1px",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                />
              </div>

              {/* Junction dots */}
              <div
                className="absolute rounded-full"
                style={{
                  left: isMobile
                    ? `${STROKE_GEOMETRY.mobile.centerX}px`
                    : `${STROKE_GEOMETRY.desktop.centerX}px`,
                  top: "159px",
                  width: "4px",
                  height: "4px",
                  background: "white",
                  boxShadow: "0 0 6px #FEDA24, 0 0 10px #FEDA24",
                  transform: "translate(-50%, -50%)",
                  opacity: openingProgressValue,
                }}
              />
              <div
                className="absolute rounded-full"
                style={{
                  left: isMobile
                    ? `${STROKE_GEOMETRY.mobile.leftX}px`
                    : `${STROKE_GEOMETRY.desktop.leftX}px`,
                  top: "208px",
                  width: "4px",
                  height: "4px",
                  background: "white",
                  boxShadow: "0 0 6px #FEDA24, 0 0 10px #FEDA24",
                  transform: "translate(-50%, -50%)",
                  opacity: openingProgressValue,
                }}
              />
              <div
                className="absolute rounded-full"
                style={{
                  left: isMobile
                    ? `${STROKE_GEOMETRY.mobile.rightX}px`
                    : `${STROKE_GEOMETRY.desktop.rightX}px`,
                  top: "208px",
                  width: "4px",
                  height: "4px",
                  background: "white",
                  boxShadow: "0 0 6px #FEDA24, 0 0 10px #FEDA24",
                  transform: "translate(-50%, -50%)",
                  opacity: openingProgressValue,
                }}
              />
            </>
          )}
        </motion.div>

        {/* Video boxes - separate container with boxes opacity */}
        <motion.div
          className="fixed left-1/2 pointer-events-none"
          style={{
            top: isMobile
              ? "clamp(280px, 40vh, 400px)"
              : windowWidth < 1024
              ? "clamp(400px, 50vh, 520px)"
              : "520px",
            marginTop: isMobile
              ? "-120px"
              : windowWidth < 1024
              ? "-200px"
              : "-265px",
            zIndex: 48,
            x: "-50%",
            opacity: boxesOpacity,
            willChange: "opacity",
            width: "783px",
            height: "390px",
            transform: isMobile
              ? `scale(${bottomLinesScale})`
              : windowWidth < 1024
              ? "scale(0.8)"
              : "scale(1)",
            transformOrigin: "center center",
          }}
        >
          {/* Video boxes - positioned below each stroke end */}
          {boxData.map((box, index) => {
            // Find matching card data for description
            const matchingCardData = cardData.find(
              (card) => card.title === box.title
            );
            const isHovered = hoveredBox === box.title;

            // Determine x position based on mobile/desktop
            let boxX = box.x;
            if (isMobile) {
              // Map box titles to mobile positions (users page titles)
              if (box.title === "Discover" || box.title === "Publish") {
                boxX = STROKE_GEOMETRY.mobile.leftX;
              } else if (box.title === "Safety" || box.title === "Monetize") {
                boxX = STROKE_GEOMETRY.mobile.centerX;
              } else if (
                box.title === "Subscribe" ||
                box.title === "Distribute"
              ) {
                boxX = STROKE_GEOMETRY.mobile.rightX;
              } else {
                // Fallback: use index to determine position
                if (index === 0) boxX = STROKE_GEOMETRY.mobile.leftX;
                else if (index === 1) boxX = STROKE_GEOMETRY.mobile.centerX;
                else boxX = STROKE_GEOMETRY.mobile.rightX;
              }
            }

            return (
              <motion.div
                key={index}
                className="absolute flex flex-col items-center pointer-events-auto"
                style={{
                  left: `${boxX}px`,
                  top: "227px", // Position at stroke end Y coordinate
                  transform: "translateX(-50%)", // Center box on stroke
                }}
                onMouseEnter={() => setHoveredBox(box.title)}
                onMouseLeave={() => setHoveredBox(null)}
              >
                {/* Video container with text inside */}
                <motion.div
                  className="relative overflow-hidden flex flex-col cursor-pointer"
                  style={{
                    width: isMobile ? "120px" : "220px",
                    borderRadius: "28px",
                    border: "0.743px solid #000",
                    background: "#010101",
                    boxShadow:
                      "-0.743px -0.743px 0.743px 0 rgba(255, 255, 255, 0.35) inset, 0.743px 0.743px 0.743px 0 rgba(255, 255, 255, 0.61) inset",
                    paddingBottom: isMobile ? "16px" : "24px", // Increased vertical padding for desktop
                    paddingTop: isMobile ? "12px" : "20px", // Increased vertical padding for desktop
                    minHeight: isMobile ? "128px" : "148px", // Fixed height: video + title + padding
                  }}
                >
                  {/* Video container - fades out on hover */}
                  {SHOW_HERO_VIDEOS && (
                    <motion.div
                      className="w-full flex items-center justify-center"
                      style={{
                        width: "100%",
                        height: isMobile ? "100px" : "100px",
                        overflow: "hidden",
                      }}
                      animate={{
                        opacity: isHovered ? 0 : 1,
                      }}
                      transition={{
                        duration: 0.3,
                        ease: "easeInOut",
                      }}
                    >
                      {isMobile && box.stackedVideo ? (
                        <WebGLVideo
                          webmSrc={box.video}
                          stackedAlphaSrc={box.stackedVideo}
                          className="w-full h-full object-contain"
                          style={{
                            width: "100px",
                            height: "100px",
                            maxWidth: "100px",
                            maxHeight: "100px",
                            objectFit: "contain",
                            objectPosition: "center center",
                            pointerEvents: "none",
                          }}
                          autoPlay
                          loop
                          muted
                        />
                      ) : (
                        <video
                          src={box.stackedVideo || box.video}
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="none"
                          controls={false}
                          disablePictureInPicture
                          disableRemotePlayback
                          style={{
                            width: isMobile ? "100px" : "90%",
                            height: isMobile ? "100px" : "100px",
                            maxWidth: isMobile ? "100px" : "140px",
                            maxHeight: isMobile ? "100px" : "100px",
                            objectFit: "contain",
                            objectPosition: "center center",
                            pointerEvents: "none",
                            display: "block",
                          }}
                        />
                      )}
                    </motion.div>
                  )}

                  {/* Title - moves to top on hover */}
                  <motion.span
                    className="text-white whitespace-nowrap text-center block relative z-10"
                    style={{
                      fontFamily: "var(--font-outfit), Outfit, sans-serif",
                      fontWeight: 700,
                      fontSize: isMobile ? "20px" : "30px", // Increased by 2px for desktop
                      textTransform: "none",
                      letterSpacing: "-1.6px",
                    }}
                    animate={{
                      y: isHovered ? -(isMobile ? 100 : 100) : 0, // Move up by video height to reach top (at paddingTop: 12px)
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                    }}
                  >
                    {box.title}
                  </motion.span>

                  {/* Description text - appears from bottom on hover */}
                  {matchingCardData && (
                    <motion.div
                      className="absolute w-full px-3"
                      style={{
                        pointerEvents: isHovered ? "auto" : "none",
                        bottom: isMobile ? "16px" : "24px", // Match paddingBottom for desktop
                        left: 0,
                        right: 0,
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: isHovered ? 1 : 0,
                        y: isHovered ? 0 : 20,
                      }}
                      transition={{
                        duration: 0.3,
                        ease: "easeInOut",
                      }}
                    >
                      <p
                        className="text-white text-center"
                        style={{
                          fontFamily: "var(--font-outfit), Outfit, sans-serif",
                          fontWeight: 300,
                          fontSize: isMobile ? "10px" : "12px",
                          lineHeight: "140%",
                          color: "rgba(255, 255, 255, 0.7)",
                        }}
                        dangerouslySetInnerHTML={{
                          __html: matchingCardData.description,
                        }}
                      />
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Features Grid Section - positioned below the fixed elements */}
        {/* Position FeaturesGrid to appear around 800px scroll (600px before exit animations start) */}
        <div
          className="relative w-full"
          style={{
            marginTop: "1000px",
            paddingBottom: "100px",
          }}
        >
          <FeaturesGrid features={features} />
        </div>

        {/* Team Grid - appears at 3400px scroll */}
        <TeamGrid
          scrollStart={3400}
          scrollEnd={3500}
          width={1000}
          height={1000}
          opacity={1}
          marginTop="800px"
        />

        {/* Third Section Header - appears at 3000px scroll */}
        <motion.div
          className="fixed left-1/2 pointer-events-none"
          style={{
            top:
              windowWidth < 768
                ? "clamp(60px, 15vh, 100px)"
                : "calc(128px + 182px - 210px)",
            zIndex: 50,
            x: "-50%",
            y: thirdSectionY,
            scale: thirdSectionScale,
            opacity: thirdSectionOpacity,
            filter: thirdSectionBlurFilter,
            transformOrigin: "center center",
            willChange: "transform, opacity, filter",
            width: windowWidth < 768 ? "90vw" : "auto",
            maxWidth: "1000px",
          }}
        >
          <div className="flex flex-col items-center px-4 md:px-0">
            {/* Team FROM THE FUTURE Text */}
            <div
              className="flex justify-center w-full"
              style={{ marginBottom: "10px" }}
            >
              <h2 className="text-center whitespace-nowrap">
                <span
                  className="font-editors-note-italic text-2xl md:text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#FF8C32] to-[#FEDA24]"
                  style={{
                    fontSize: "clamp(24px, 3vw, 48px)",
                  }}
                >
                  team&nbsp;
                </span>
                <span
                  className="font-outfit text-3xl md:text-5xl lg:text-6xl font-bold text-white uppercase tracking-tight"
                  style={{
                    fontFamily: "var(--font-outfit), sans-serif",
                    fontWeight: 600,
                    fontSize: "clamp(24px, 2.7vw, 48px)",
                    lineHeight: "100%",
                    letterSpacing: "0.05em",
                    opacity: 0.9,
                  }}
                >
                  FROM THE FUTURE
                </span>
              </h2>
            </div>

            {/* Description text under Team FROM THE FUTURE */}
            <p
              className="text-center mb-8 md:mb-12 px-4"
              style={{
                width: windowWidth < 768 ? "100%" : "600px",
                height: windowWidth < 768 ? "auto" : "44px",
                fontFamily: "var(--font-outfit), Outfit, sans-serif",
                fontWeight: 300,
                fontStyle: "normal",
                fontSize: windowWidth < 768 ? "14px" : "16px",
                lineHeight: "140%",
                letterSpacing: "2%",
                textAlign: "center",
                color: "#FFFFFF",
                maxWidth: windowWidth < 768 ? "90vw" : "600px",
                opacity: 0.7,
              }}
            >
              Powerhouse of talent and dedication, we tackle challenges head-on
              and celebrate our collective achievements
            </p>
          </div>
        </motion.div>

        {/* Spacer for third section - creates space for scroll to reach 3000px */}
        <div className="w-full" style={{ height: "40px" }} />
      </div>
    </div>
  );
}
