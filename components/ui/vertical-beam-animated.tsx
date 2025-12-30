"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export interface VerticalBeamAnimatedProps {
  className?: string;
  style?: React.CSSProperties;
  /** Animation duration in seconds */
  duration?: number;
  /** Delay before animation starts (in seconds) */
  delay?: number;
  /** Beam color - supports gradients */
  beamColor?: string;
  /** Secondary beam color for gradient */
  beamColorSecondary?: string;
  /** Path color (the static lines) */
  pathColor?: string;
  /** Width of the beam */
  beamWidth?: number;
  /** Width of the path stroke */
  pathWidth?: number;
  /** Scroll progress (0-1) for opening animation */
  scrollProgress?: number;
  /** Whether opening is active */
  isOpening?: boolean;
}

export function VerticalBeamAnimated({
  className,
  style,
  duration = 1,
  delay = 0,
  beamColor = "#FEDA24",
  beamColorSecondary = "#FF8C32",
  pathColor = "#444444",
  beamWidth = 2,
  pathWidth = 1,
  scrollProgress = 0,
  isOpening = false,
}: Readonly<VerticalBeamAnimatedProps>) {
  const stableId = useId().replace(/:/g, "-");

  // Convert hex color to rgba
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const beamColorRgba = {
    transparent: hexToRgba(beamColor, 0),
    low: hexToRgba(beamColor, 0.2),
    medium: hexToRgba(beamColor, 0.5),
    high: hexToRgba(beamColor, 0.8),
    full: beamColor,
  };

  // Parse center vertical line coordinates from Bottom_Lines.svg
  // Path: M391.754 122.126L391.754 227
  // Stroke endpoint aligned to Y=227 to connect to center-top of video box
  const centerVertical = {
    x: 391.754,
    startY: 122.126,
    endY: 227,
    length: 227 - 122.126,
  };

  // Convert SVG coordinates to percentage for CSS positioning
  const svgWidth = 783;
  const svgHeight = 390;

  const centerXPercent = (centerVertical.x / svgWidth) * 100;
  const startYPercent = (centerVertical.startY / svgHeight) * 100;
  const endYPercent = (centerVertical.endY / svgHeight) * 100;
  const heightPercent = endYPercent - startYPercent;

  // Create CSS animation keyframes dynamically
  const animationDuration = `${duration}s`;
  const animationDelay = `${delay}s`;

  return (
    <div
      className={cn("absolute inset-0 w-full h-full", className)}
      style={style}
    >
      {/* CSS-based animated vertical beam */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes beam-slide-down-${stableId} {
          0% {
            top: -30%;
          }
          50% {
            top: 100%;
          }
          100% {
            top: 100%;
          }
        }

        .beam-container-vertical-${stableId} {
          position: absolute;
          left: ${centerXPercent}%;
          top: ${startYPercent}%;
          width: ${Math.min(beamWidth * 3, 90)}px;
          margin-left: -${Math.min(beamWidth * 3, 90) / 2}px;
          height: ${`${heightPercent * Math.max(scrollProgress, 0)}%`};
          overflow: hidden;
          pointer-events: none;
          opacity: ${Math.max(scrollProgress, 0)};
          transition: height 0.1s linear, opacity 0.1s linear;
        }

        .beam-container-vertical-${stableId} hr {
          position: absolute;
          left: 50%;
          top: 0;
          width: ${pathWidth}px;
          height: 100%;
          margin: 0;
          border: none;
          background-color: ${pathColor};
          transform: translateX(-50%);
        }

        .beam-vertical-${stableId} {
          position: absolute;
          left: 50%;
          top: 0;
          width: ${Math.min(beamWidth, 30)}px;
          height: 30%;
          margin-left: -${Math.min(beamWidth, 30) / 2}px;
          background: linear-gradient(
            180deg,
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
          animation: ${
            scrollProgress < 1
              ? "none"
              : `beam-slide-down-${stableId} ${duration * 2}s ease-in-out infinite`
          };
          filter: drop-shadow(0 0 ${
            Math.min(beamWidth, 30) / 2
          }px ${beamColor}) blur(0.5px);
          animation-delay: ${animationDelay};
        }

        ${
          scrollProgress < 1
            ? `
          .beam-vertical-${stableId} {
            animation-play-state: paused;
          }
        `
            : ""
        }
      `,
        }}
      />

      {/* Vertical beam container */}
      <div className={`beam-container-vertical-${stableId}`}>
        <hr />
        <div className={`beam-vertical-${stableId} beam-vertical-${stableId}-1`} />
      </div>
    </div>
  );
}

export default VerticalBeamAnimated;

