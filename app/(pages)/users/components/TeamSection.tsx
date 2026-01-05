"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

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

export function TeamSection() {
  const windowWidth = useWindowWidth();
  const { scrollY: scrollYMotion } = useScroll();

  // Animation values - starting at 2400px scroll position
  const teamSectionOpacity = useTransform(scrollYMotion, (latest) => {
    // Entry phase: opacity increases from 0 to 1 (2400px to 2800px)
    if (latest < 2400) return 0;
    if (latest >= 2800) return 1;
    return (latest - 2400) / 400; // Fade in from 0 to 1 between 2400px and 2800px
  });

  const teamSectionScale = useTransform(scrollYMotion, (latest) => {
    // Entry phase: scale increases from 0.5 to 1 (2400px to 2800px)
    if (latest < 2400) return 0.5;
    if (latest >= 2800) return 1;
    return 0.5 + ((latest - 2400) / 400) * 0.5; // Scale from 0.5 to 1 between 2400px and 2800px
  });

  // Team section blur animation: instant blur at 2400px, stays at max until 2500px, then unblur from 2500px to 2600px
  const teamSectionBlur = useTransform(scrollYMotion, (latest) => {
    // Entry phase: blur decreases from 10px to 0 (2400px to 2600px)
    if (latest < 2400) return 0;
    if (latest >= 2400 && latest <= 2500) {
      // Instant blur at 2400px, stay at max (10px) throughout this range
      return 10;
    }
    if (latest > 2500 && latest < 2600) {
      // Blur decreases from 10px to 0
      const progress = (latest - 2500) / 100;
      return 10 - progress * 10; // 10px to 0
    }
    return 0; // No blur after 2600px
  });

  const teamSectionBlurFilter = useTransform(
    teamSectionBlur,
    (blurValue) => `blur(${blurValue}px)`
  );

  return (
    <motion.div
      className="fixed left-1/2 pointer-events-none"
      style={{
        top:
          windowWidth < 768
            ? "clamp(60px, 15vh, 100px)"
            : "calc(128px + 182px - 210px)",
        zIndex: 50,
        x: "-50%",
        scale: teamSectionScale,
        opacity: teamSectionOpacity,
        filter: teamSectionBlurFilter,
        transformOrigin: "center center",
        willChange: "transform, opacity, filter",
        width: windowWidth < 768 ? "90vw" : "auto",
        maxWidth: "1000px",
      }}
    >
      <div className="flex flex-col items-center px-4 md:px-0">
        {/* Team Title */}
        <div className="flex justify-center w-full">
          <h2
            className="text-center"
            style={{
              fontFamily: "var(--font-outfit), Outfit, sans-serif",
            }}
          >
            <span
              style={{
                fontStyle: "italic",
                color: "#FEDA24",
                fontWeight: 400,
                fontSize: windowWidth < 768 ? "32px" : "48px",
                lineHeight: "1.2",
              }}
            >
              team&nbsp;
            </span>
            <span
              style={{
                fontWeight: 700,
                color: "#FFFFFF",
                fontSize: windowWidth < 768 ? "32px" : "48px",
                textTransform: "uppercase",
                lineHeight: "1.2",
                letterSpacing: "0.02em",
              }}
            >
              FROM THE FUTURE
            </span>
          </h2>
        </div>

        {/* Description text under Team Title */}
        <p
          className="text-center mb-8 md:mb-12 px-4"
          style={{
            width: windowWidth < 768 ? "100%" : "auto",
            height: windowWidth < 768 ? "auto" : "auto",
            fontFamily: "var(--font-outfit), Outfit, sans-serif",
            fontWeight: 300,
            opacity: 0.7,
            fontStyle: "normal",
            fontSize: windowWidth < 768 ? "14px" : "16px",
            lineHeight: "140%",
            letterSpacing: "2%",
            textAlign: "center",
            color: "#FFFFFF",
            maxWidth: windowWidth < 768 ? "90vw" : "600px",
          }}
        >
          The team behind Beelia has spent years building, scaling, and supporting successful technology products, and brings that experience into every part of the platform.
        </p>
      </div>
    </motion.div>
  );
}

