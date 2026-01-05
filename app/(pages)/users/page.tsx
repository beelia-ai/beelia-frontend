"use client";

import { useState, useEffect } from "react";
import { NewHero } from "./components/NewHero";
import { AboutProduct } from "./components/AboutProduct";
import { FAQ } from "./components/FAQ";
import { ParticleSpritesBackground } from "@/components/ui";
import { Footer } from "@/components/layout/Footer";
import { PARTICLE_COUNT_MOBILE, PARTICLE_COUNT_DESKTOP } from "@/lib/constants";

// #region agent log
const debugLog = (msg: string, data: Record<string, unknown>) => {
  console.log(`[DEBUG] ${msg}`, JSON.stringify(data));
};
// #endregion

export default function HomePage() {
  const [isMobile, setIsMobile] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    // #region agent log
    // Detect iOS for WebGL context issue debugging
    const isIOS =
      /iPhone|iPad|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOSDevice(isIOS);
    debugLog("iOS detection", { isIOS, hypothesisId: "F-G" });
    // #endregion

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // #region agent log
  useEffect(() => {
    // Log initial page structure
    const docHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;
    const bodyOverflow = getComputedStyle(document.body).overflow;
    const htmlOverflow = getComputedStyle(document.documentElement).overflow;

    debugLog("Page mounted - checking scroll structure", {
      docHeight,
      viewportHeight,
      bodyOverflow,
      htmlOverflow,
      isIOS: /iPhone|iPad|iPod/.test(navigator.userAgent),
      userAgent: navigator.userAgent.substring(0, 100),
    });

    // Track scroll events
    let lastScrollY = 0;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (Math.abs(scrollY - lastScrollY) > 50) {
        debugLog("Scroll event", {
          scrollY,
          maxScroll: docHeight - viewportHeight,
          hypothesisId: "B",
        });
        lastScrollY = scrollY;
      }
    };

    // Track touch events to see if they're being blocked
    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      debugLog("Touch start", {
        targetTag: target.tagName,
        targetClass: target.className?.substring?.(0, 50) || "",
        targetId: target.id || "",
        touchY: e.touches[0]?.clientY,
        hypothesisId: "A-C",
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Only log occasionally to avoid spam
      if (Math.random() < 0.1) {
        debugLog("Touch move", {
          touchY: e.touches[0]?.clientY,
          scrollY: window.scrollY,
          hypothesisId: "A-D",
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);
  // #endregion

  // Glossy white and silver colors in HSL format (normalized 0-1)
  const beeliaColors = [
    [0, 0, 1], // Pure white - glossy white
    [0, 0, 0.9], // Off-white - bright silver
    [0, 0, 0.75], // Silver - medium silver
    [0, 0, 0.85], // Light silver - bright silver
    [0, 0, 0.95], // Near white - glossy white
  ];

  return (
    <div className="relative w-full bg-transparent">
      {/* Particle Sprites Background - DISABLED on iOS to test WebGL scroll blocking (Hypothesis F-G) */}
      {!isIOSDevice && (
        <ParticleSpritesBackground
          className="fixed inset-0 z-0"
          particleCount={
            isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP
          }
          followMouse={true}
          mouseSensitivity={0.05}
          colors={beeliaColors}
          cycleColors={false}
          sizes={[5, 5, 5, 5, 5]}
          speed={0.3}
        />
      )}

      {/* Page content */}
      <div className="relative z-10">
        <NewHero
          title={
            <>
              <span className="text-white">AI</span>{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8C32] to-[#FF6B00]">
                for Everyone,
              </span>{" "}
              <span className="text-white">by Everyone</span>
            </>
          }
          description="A curated AI marketplace where anyone can discover, trust, and use the right tools instantly, no technical skills required"
        />
        <AboutProduct />
        <FAQ />
        <Footer />
      </div>
    </div>
  );
}
