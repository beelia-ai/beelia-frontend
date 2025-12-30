"use client";

import { useEffect, useState, useId } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Preloader() {
  const [isComplete, setIsComplete] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const pathname = usePathname();
  const stableId = useId().replace(/:/g, "-");

  // Convert hex color to rgba
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const beamColor = "#FEDA24";
  const beamColorSecondary = "#FF8C32";
  const pathColor = "#444444";
  const beamWidth = 2;
  const pathWidth = 1;
  const duration = 1; // Same speed as hero section

  const beamColorRgba = {
    transparent: hexToRgba(beamColor, 0),
    low: hexToRgba(beamColor, 0.2),
    medium: hexToRgba(beamColor, 0.5),
    high: hexToRgba(beamColor, 0.8),
    full: beamColor,
  };

  // Initial page load - check for completion
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    // Check for actual page load completion
    const checkLoadComplete = () => {
      if (document.readyState === "complete") {
        setIsComplete(true);
      }
    };

    // Start checking for load completion after a delay
    // This ensures the loader is always visible initially
    timeoutId = setTimeout(() => {
      checkLoadComplete();
      document.addEventListener("readystatechange", checkLoadComplete);
    }, 100);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      document.removeEventListener("readystatechange", checkLoadComplete);
    };
  }, []);

  // Handle route changes
  useEffect(() => {
    // Reset states for navigation
    setIsComplete(false);
    setFadeOut(false);

    let timeoutId: ReturnType<typeof setTimeout>;

    // Check for actual page load completion
    const checkLoadComplete = () => {
      if (document.readyState === "complete") {
        setIsComplete(true);
      }
    };

    // Start checking for load completion after a delay
    timeoutId = setTimeout(() => {
      checkLoadComplete();
      document.addEventListener("readystatechange", checkLoadComplete);
    }, 100);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      document.removeEventListener("readystatechange", checkLoadComplete);
    };
  }, [pathname]);

  // Fade out when complete
  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => setFadeOut(true), 400);
      return () => clearTimeout(timer);
    }
  }, [isComplete]);

  // Don't render if faded out
  if (fadeOut) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: isComplete ? 0 : 1,
        transition: "opacity 0.4s ease-out",
        pointerEvents: isComplete ? "none" : "auto",
      }}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.02); opacity: 0.9; }
        }

        @keyframes beam-slide-${stableId} {
          0% {
            left: -30%;
          }
          100% {
            left: 100%;
          }
        }

        .preloader-beam-container-${stableId} {
          position: relative;
          width: 160px;
          height: ${Math.min(beamWidth * 3, 90)}px;
          overflow: hidden;
          pointer-events: none;
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 15%,
            black 85%,
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 15%,
            black 85%,
            transparent 100%
          );
        }

        .preloader-beam-container-${stableId} hr {
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          height: ${pathWidth}px;
          margin: 0;
          border: none;
          background-color: ${pathColor};
          transform: translateY(-50%);
        }

        .preloader-beam-${stableId} {
          position: absolute;
          top: 50%;
          left: 0;
          width: 30%;
          height: ${Math.min(beamWidth, 30)}px;
          margin-top: -${Math.min(beamWidth, 30) / 2}px;
          background: linear-gradient(
            90deg,
            ${beamColorRgba.transparent} 0%,
            ${beamColorRgba.low} 10%,
            ${beamColorRgba.medium} 20%,
            ${beamColorRgba.high} 35%,
            ${beamColorRgba.full} 45%,
            rgba(255, 255, 255, 0.9) 48%,
            rgba(255, 255, 255, 1) 50%,
            rgba(255, 255, 255, 0.9) 52%,
            ${beamColorRgba.full} 55%,
            ${beamColorRgba.high} 65%,
            ${beamColorRgba.medium} 80%,
            ${beamColorRgba.low} 90%,
            ${beamColorRgba.transparent} 100%
          );
          animation: beam-slide-${stableId} ${duration}s ease-in-out infinite;
          filter: drop-shadow(0 0 ${
            Math.min(beamWidth, 30) / 2
          }px ${beamColor}) blur(0.5px);
        }
      `}</style>

      {/* Beelia Logo */}
      <div
        style={{
          marginBottom: "1.5rem",
          animation: "pulse 2s ease-in-out infinite",
        }}
      >
        <Image
          src="/icons/beelia-logo.png"
          alt="Beelia Logo"
          width={150}
          height={40}
          className="h-10 w-auto"
          priority
        />
      </div>

      {/* Horizontal beam - looping animation */}
      <div className={`preloader-beam-container-${stableId}`}>
        <hr />
        <div className={`preloader-beam-${stableId}`} />
      </div>
    </div>
  );
}
