"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export interface HorizontalBeamAnimatedProps {
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
  /** Scroll progress (0-1) for retraction animation */
  scrollProgress?: number;
  /** Whether retraction is active */
  isRetracting?: boolean;
  /** Opacity of the beam (0-1), defaults to 1 */
  beamOpacity?: number;
}

export function HorizontalBeamAnimated({
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
  isRetracting = false,
  beamOpacity = 1,
}: Readonly<HorizontalBeamAnimatedProps>) {
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

  // Parse paths to get coordinates
  const rightHorizontal = {
    startX: 610.227,
    endX: 992.05,
    y: 185.289,
    length: 992.05 - 610.227,
  };

  const leftHorizontal = {
    startX: 110.001,
    endX: 494.824,
    y: 185.289,
    length: 494.824 - 110.001,
  };

  // Convert SVG coordinates to percentage for CSS positioning
  const svgWidth = 1102;
  const svgHeight = 364;

  const rightStartPercent = (rightHorizontal.startX / svgWidth) * 100;
  const rightEndPercent = (rightHorizontal.endX / svgWidth) * 100;
  const rightWidthPercent = rightEndPercent - rightStartPercent;
  const rightYPercent = (rightHorizontal.y / svgHeight) * 100;

  const leftStartPercent = (leftHorizontal.startX / svgWidth) * 100;
  const leftEndPercent = (leftHorizontal.endX / svgWidth) * 100;
  const leftWidthPercent = leftEndPercent - leftStartPercent;
  const leftYPercent = (leftHorizontal.y / svgHeight) * 100;

  // Create CSS animation keyframes dynamically
  const animationDuration = `${duration}s`;
  const animationDelay = `${delay}s`;

  return (
    <div
      className={cn("absolute inset-0 w-full h-full", className)}
      style={style}
    >
      {/* CSS-based animated beams */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes beam-slide-right-${stableId} {
          0% {
            left: -30%;
          }
          100% {
            left: 100%;
          }
        }

        @keyframes beam-slide-left-${stableId} {
          0% {
            right: -30%;
          }
          100% {
            right: 100%;
          }
        }

        .beam-container-right-${stableId} {
          position: absolute;
          right: ${100 - rightEndPercent}%;
          top: ${rightYPercent}%;
          width: ${
            isRetracting
              ? `${rightWidthPercent * (1 - scrollProgress)}%`
              : `${rightWidthPercent}%`
          };
          height: ${Math.min(beamWidth * 3, 90)}px;
          margin-top: -${Math.min(beamWidth * 3, 90) / 2}px;
          overflow: hidden;
          pointer-events: none;
          transition: width 0.1s linear, opacity 0.1s linear;
          opacity: ${isRetracting ? 1 - scrollProgress : 1};
        }

        .beam-container-right-${stableId} hr {
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

        .beam-right-${stableId} {
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
          animation: ${
            isRetracting
              ? "none"
              : `beam-slide-right-${stableId} ${animationDuration} ease-in-out infinite`
          };
          animation-delay: ${animationDelay};
          filter: drop-shadow(0 0 ${
            Math.min(beamWidth, 30) / 2
          }px ${beamColor}) blur(0.5px);
          opacity: ${beamOpacity};
        }

        .beam-container-left-${stableId} {
          position: absolute;
          left: ${leftStartPercent}%;
          top: ${leftYPercent}%;
          width: ${
            isRetracting
              ? `${leftWidthPercent * (1 - scrollProgress)}%`
              : `${leftWidthPercent}%`
          };
          height: ${Math.min(beamWidth * 3, 90)}px;
          margin-top: -${Math.min(beamWidth * 3, 90) / 2}px;
          overflow: hidden;
          pointer-events: none;
          transition: width 0.1s linear, opacity 0.1s linear;
          opacity: ${isRetracting ? 1 - scrollProgress : 1};
        }

        .beam-container-left-${stableId} hr {
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

        .beam-left-${stableId} {
          position: absolute;
          top: 50%;
          right: 0;
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
          animation: ${
            isRetracting
              ? "none"
              : `beam-slide-left-${stableId} ${animationDuration} ease-in-out infinite`
          };
          animation-delay: ${parseFloat(animationDelay) + 0.15}s;
          filter: drop-shadow(0 0 ${
            Math.min(beamWidth, 30) / 2
          }px ${beamColor}) blur(0.5px);
          opacity: ${beamOpacity};
        }

        ${
          isRetracting
            ? `
          .beam-right-${stableId},
          .beam-left-${stableId} {
            animation-play-state: paused;
          }
        `
            : ""
        }
      `,
        }}
      />

      {/* Right horizontal beam container */}
      <div className={`beam-container-right-${stableId}`}>
        <hr />
        <div className={`beam-right-${stableId}`} />
      </div>

      {/* Left horizontal beam container */}
      <div className={`beam-container-left-${stableId}`}>
        <hr />
        <div className={`beam-left-${stableId}`} />
      </div>
    </div>
  );
}

export default HorizontalBeamAnimated;
