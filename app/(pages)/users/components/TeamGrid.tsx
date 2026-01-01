"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ProfileCard } from "./ProfileCard";
import { QuoteCard } from "./QuoteCard";
import { HorizontalDivider } from "./HorizontalDivider";
import { VerticalDivider } from "./VerticalDivider";
import { IntersectionDot } from "./IntersectionDot";
import { teamGridData } from "./teamGridData";

interface TeamGridProps {
  scrollStart?: number; // Scroll position where animation starts (default: 3400)
  scrollEnd?: number; // Scroll position where animation ends (default: 3800)
  width?: number; // Width in pixels (default: 700)
  height?: number; // Height in pixels (default: 1000)
  opacity?: number; // Final opacity (default: 1)
  marginTop?: string; // Margin top spacing (default: 800px)
}

export function TeamGrid({
  scrollStart = 3400,
  scrollEnd = 3800,
  width = 700,
  height = 1000,
  opacity = 1,
  marginTop = "800px",
}: TeamGridProps) {
  const { scrollY: scrollYMotion } = useScroll();

  // Find the last profile row index
  const lastProfileRowIndex = teamGridData.reduce((lastIndex, row, index) => {
    return row.cards.length > 0 ? index : lastIndex;
  }, -1);

  // Extract quote card and all profile cards for mobile layout
  const quoteCard = teamGridData
    .flatMap((row) => row.cards)
    .find((card) => card.type === "quote");

  const allProfileCards = teamGridData
    .flatMap((row) => row.cards)
    .filter((card) => card.type === "profile");

  // Rectangle opacity animation
  const rectangleOpacity = useTransform(scrollYMotion, (latest) => {
    if (latest < scrollStart) return 0;
    if (latest >= scrollEnd) return opacity;
    return ((latest - scrollStart) / (scrollEnd - scrollStart)) * opacity;
  });

  // Rectangle Y position animation (slides up from below)
  const rectangleY = useTransform(scrollYMotion, (latest) => {
    if (latest < scrollStart) return 100; // Start 100px below
    if (latest >= scrollEnd) return 0; // End at normal position
    const progress = (latest - scrollStart) / (scrollEnd - scrollStart);
    return 100 - progress * 100; // Slide up from 100px to 0
  });

  // Parse marginTop to get numeric value for mobile calculation
  const marginTopValue = marginTop
    ? parseInt(marginTop.replace("px", ""))
    : 800;
  const mobileMarginTop = `${marginTopValue / 2}px`;

  return (
    <>
      <style>{`
        @media (min-width: 768px) {
          .team-grid-container {
            margin-top: ${marginTop} !important;
          }
        }
      `}</style>
      <motion.div
        className="team-grid-container relative w-full flex justify-center"
        style={{
          marginTop: mobileMarginTop,
        }}
      >
        <motion.div
          className="rounded-lg flex flex-col relative w-full md:w-auto"
          style={{
            width: "100%",
            maxWidth: `${width}px`,
            height: "auto",
            minHeight: `${height}px`,
            opacity: rectangleOpacity,
            y: rectangleY,
            willChange: "opacity, transform",
          }}
        >
          {/* Mobile Layout: Vertical stack with quote first, then all profile cards */}
          <div className="flex flex-col md:hidden w-full px-4">
            {/* Quote Card at top */}
            {quoteCard && quoteCard.type === "quote" && (
              <div className="w-full ">
                <QuoteCard {...quoteCard.data} />
              </div>
            )}

            {/* All Profile Cards stacked vertically */}
            <div className="flex flex-col">
              {allProfileCards.map((card, index) => (
                <div key={index} className="w-full">
                  {card.type === "profile" && <ProfileCard {...card.data} />}
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Layout: Original grid with dividers */}
          <div
            className="hidden md:flex flex-col relative w-full"
            style={{ width: `${width}px`, height: `${height}px` }}
          >
            {/* Leftmost Vertical Divider */}
            <div
              className="absolute left-0"
              style={{
                top: "-40px",
                zIndex: 1,
              }}
            >
              <VerticalDivider containerHeight={height} />
            </div>

            {/* Center Vertical Divider */}
            <div
              className="absolute left-1/2"
              style={{
                top: "-40px",
                transform: "translateX(-50%)",
                zIndex: 1,
              }}
            >
              <VerticalDivider containerHeight={height} />
            </div>

            {/* Rightmost Vertical Divider */}
            <div
              className="absolute right-0"
              style={{
                top: "-40px",
                zIndex: 1,
              }}
            >
              <VerticalDivider containerHeight={height} />
            </div>

            {teamGridData.map((row, rowIndex) => (
              <div key={rowIndex} className="flex flex-col relative">
                {/* Profile Row - only render if there are cards */}
                {row.cards.length > 0 && (
                  <>
                    <div
                      className={
                        rowIndex === 0
                          ? "flex flex-wrap items-stretch"
                          : "grid grid-cols-2 items-stretch"
                      }
                    >
                      {row.cards.map((card, cardIndex) => (
                        <div
                          key={cardIndex}
                          className={
                            rowIndex === 0
                              ? "w-full md:w-1/2 h-full"
                              : "w-full h-full"
                          }
                        >
                          {card.type === "profile" ? (
                            <ProfileCard {...card.data} />
                          ) : (
                            <QuoteCard {...card.data} />
                          )}
                        </div>
                      ))}
                    </div>
                    {/* Dots at bottom of Profile Row - only if not the last profile row */}
                    {rowIndex !== lastProfileRowIndex && (
                      <div
                        className="relative w-full"
                        style={{ height: "0px" }}
                      >
                        <IntersectionDot position="left" />
                        <IntersectionDot position="center" />
                        <IntersectionDot position="right" />
                      </div>
                    )}
                    {/* Horizontal Divider after Profile Row - only if not the last row */}
                    {rowIndex < teamGridData.length - 1 && (
                      <HorizontalDivider containerWidth={width} />
                    )}
                  </>
                )}

                {/* Divider Row - only show if not the last row */}
                {rowIndex < teamGridData.length - 1 && (
                  <>
                    <div
                      className="relative"
                      style={{
                        height: "52px",
                      }}
                    >
                      {/* Dots at bottom of Divider Row */}
                      <IntersectionDot position="left" />
                      <IntersectionDot position="center" />
                      <IntersectionDot position="right" />
                    </div>
                    {/* Horizontal Divider after Divider Row */}
                    <HorizontalDivider containerWidth={width} />
                  </>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
