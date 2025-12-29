"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { BottomLinesAnimated } from "@/components/ui/bottom-lines-animated";
import { GlowCard } from "@/components/ui/glow-card";
import { FeaturesGrid } from "./FeaturesGrid";

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

const CARD_DATA = [
  {
    title: "DISCOVER",
    subtitle: "",
    description:
      "Browse thousands of curated AI tools instantly. Find exactly what you need without the technical complexity.",
    // Magnifying glass icon (Heroicons)
    iconPath:
      "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z",
  },
  {
    title: "SUBSCRIBE",
    subtitle: "",
    description:
      "One-click access to premium AI tools.<br/>No setup, no configuration. Start using tools instantly.",
    // Bell icon (Heroicons)
    iconPath:
      "M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0",
  },
  {
    title: "SAFETY",
    subtitle: "",
    description:
      "Every tool is verified and trusted.<br/>Built-in security and privacy protection. Use AI tools with confidence.",
    // Shield check icon (Heroicons)
    iconPath:
      "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
  },
];

export function AboutProduct() {
  const windowWidth = useWindowWidth();
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
  // Exit animation: opacity from 1 to 0 starting at 1700px (1700px to 1800px)
  const boxesOpacity = useTransform(scrollYMotion, (latest) => {
    // Exit phase: opacity decreases from 1 to 0 (1700px to 1800px)
    if (latest >= 1700 && latest <= 1800) {
      return 1 - (latest - 1700) / 100; // 1 to 0 over 100px
    }
    if (latest > 1800) return 0; // Fully hidden after 1800px

    // Entry phase: opacity increases from 0 to 1 (1100px to 1200px)
    if (latest < 1100) return 0;
    if (latest >= 1200) return 1;
    return (latest - 1100) / 100; // Fade in from 0 to 1 between 1100px and 1200px
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

  return (
    <div
      className="relative w-full bg-transparent overflow-x-hidden"
      style={{ minHeight: "1600px" }}
    >
      {/* Section content */}
      <div className="relative z-10 flex flex-col items-center justify-start pt-20 md:pt-32 overflow-x-hidden w-full max-w-full">
        {/* OneStop Image and Text Container - maintains same distance from top as globe */}
        <motion.div
          className="fixed left-1/2 pointer-events-none"
          style={{
            top: windowWidth < 768 
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
            {/* OneStop Image */}
            <div className="flex justify-center mb-4 md:mb-6 w-full">
              <Image
                src="/images/Onestop.png"
                alt="OneStop"
                width={1000}
                height={300}
                className="w-full max-w-[90vw] md:max-w-none h-auto object-contain"
                priority
              />
            </div>

            {/* Description text under OneStop Image */}
            <p
              className="text-center mb-8 md:mb-12 px-4"
              style={{
                width: windowWidth < 768 ? "100%" : "457.771484375px",
                height: windowWidth < 768 ? "auto" : "44px",
                fontFamily: "var(--font-outfit), Outfit, sans-serif",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: windowWidth < 768 ? "14px" : "16px",
                lineHeight: "140%",
                letterSpacing: "2%",
                textAlign: "center",
                color: "#FFFFFF",
                maxWidth: windowWidth < 768 ? "90vw" : "457.771484375px",
              }}
            >
              —giving people a seamless way to find the right tools and start
              using them instantly, no setup, no friction.
            </p>
          </div>
        </motion.div>

        {/* Spacer to maintain layout flow (Onestop wrapper is fixed/absolute) */}
        <div className="w-full" style={{ height: windowWidth < 768 ? "300px" : "416px" }} />

        {/* Bottom Lines SVG - fixed positioned directly below the globe */}
        {/* Hidden on mobile, scaled on tablet */}
        {windowWidth >= 768 && (
          <motion.div
            className="fixed left-1/2 pointer-events-none"
            style={{
              top: windowWidth < 1024 ? "clamp(400px, 50vh, 520px)" : "520px",
              marginTop: windowWidth < 1024 ? "-200px" : "-265px",
              zIndex: 49,
              x: "-50%",
              willChange: "transform",
              transform: windowWidth >= 768 && windowWidth < 1024 ? "scale(0.8)" : "scale(1)",
              transformOrigin: "center center",
            }}
          >
            <BottomLinesAnimated
              duration={4}
              delay={0}
              beamColor="#FEDA24"
              beamColorSecondary="#FF8C32"
              pathColor="#444444"
              beamWidth={2}
              pathWidth={1}
              scrollProgress={openingProgressValue}
              isOpening={isOpening}
              scrollY={scrollY}
              className="w-auto h-auto"
            />
          </motion.div>
        )}

        {/* Boxes - fixed positioned below each stroke with fade-in animation */}
        {/* SVG: 783px wide, strokes end at Y=240 in SVG coordinates */}
        {/* Stroke X positions: left=15.055, center=391.754, right=767.027 */}
        {/* SVG center = 783/2 = 391.5px */}
        {/* Hidden on mobile */}
        {windowWidth >= 768 && (
          <motion.div
            className="fixed left-1/2 pointer-events-none"
            style={{
              top: windowWidth < 1024 ? "clamp(380px, 48vh, 482px)" : "482px",
              zIndex: 48,
              x: "-50%",
              opacity: boxesOpacity,
              willChange: "opacity",
              width: windowWidth < 1024 ? "625px" : "783px", // Scale down on tablet
              transform: windowWidth >= 768 && windowWidth < 1024 ? "scale(0.8)" : "scale(1)",
              transformOrigin: "center center",
            }}
          >
            {/* Left box - below left stroke end (X=15.055 in SVG) */}
            <motion.div
              className="absolute w-[100px] h-[100px] rounded-lg border border-white/20 bg-black/20"
              style={{
                left: windowWidth < 1024 ? "12px" : "15.055px",
                marginLeft: "-50px", // Center box on stroke
              }}
            />
            {/* Center box - below center stroke end (X=391.754 in SVG) */}
            <motion.div
              className="absolute w-[100px] h-[100px] rounded-lg border border-white/20 bg-black/20"
              style={{
                left: windowWidth < 1024 ? "312px" : "391.754px",
                marginLeft: "-50px", // Center box on stroke
              }}
            />
            {/* Right box - below right stroke end (X=767.027 in SVG) */}
            <motion.div
              className="absolute w-[100px] h-[100px] rounded-lg border border-white/20 bg-black/20"
              style={{
                left: windowWidth < 1024 ? "613px" : "767.027px",
                marginLeft: "-50px", // Center box on stroke
              }}
            />
          </motion.div>
        )}

        {/* Features Grid Section - positioned below the fixed elements */}
        {/* Position FeaturesGrid to appear around 800px scroll (600px before exit animations start) */}
        <div
          className="relative w-full"
          style={{
            marginTop: "1000px",
            paddingBottom: "100px",
          }}
        >
          <FeaturesGrid />
        </div>
      </div>
    </div>
  );
}
