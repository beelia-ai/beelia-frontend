"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

interface ProfileCardProps {
  name: string;
  role: string;
  image: string;
  description: string;
  background?: string;
  responsibilities?: string[];
  coreStrengths?: string[];
  socials?: {
    linkedin?: string;
    instagram?: string;
  };
}

export function ProfileCard({
  name,
  role,
  image,
  description,
  background,
  responsibilities,
  coreStrengths,
  socials,
}: ProfileCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Disable scroll when expanded
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isExpanded]);

  // Unique ID for layout animation
  const layoutId = `profile-${name.replace(/\s+/g, "-").toLowerCase()}`;

  const expandedContent = (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          layoutId={layoutId}
          className="fixed inset-0 z-[100] bg-black overflow-y-auto overflow-x-hidden"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100vw",
            height: "100vh",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="relative z-[1] min-h-screen w-full flex flex-col md:flex-row px-8 md:px-16 lg:px-24 py-24 md:py-32 gap-12 lg:gap-20 max-w-7xl mx-auto">
            {/* Left Side: Profile Image & Socials */}
            <div className="flex flex-col items-center md:items-center gap-8 flex-shrink-0">
              <motion.div
                layoutId={`${layoutId}-image`}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                style={{ width: "200px", height: "200px" }}
              >
                <Image
                  src={image}
                  alt={name}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                  style={{ borderRadius: "50%" }}
                />
              </motion.div>

              {socials && (
                <div className="flex gap-3">
                  {socials.linkedin && (
                    <a
                      href={socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center rounded-full border border-white/15 hover:border-white/40 transition-all group"
                      style={{ width: "60px", height: "60px" }}
                    >
                      <Image
                        src="/icons/linkedin.svg"
                        alt="LinkedIn"
                        width={28}
                        height={28}
                        className="opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                    </a>
                  )}
                  {socials.instagram && (
                    <a
                      href={socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center rounded-full border border-white/15 hover:border-white/40 transition-all group"
                      style={{ width: "60px", height: "60px" }}
                    >
                      <Image
                        src="/icons/instagram.svg"
                        alt="Instagram"
                        width={28}
                        height={28}
                        className="opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Right Side: Info Content */}
            <div className="flex flex-col flex-1 relative">
              {/* Close Button - Top Aligned */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
                className="absolute top-0 right-0 w-12 h-12 flex items-center justify-center rounded-full border border-white/20 text-white/80 hover:bg-white/10 transition-all z-[110]"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <motion.h2
                layoutId={`${layoutId}-name`}
                className="text-white mb-2"
                style={{
                  fontFamily: "var(--font-outfit), Outfit, sans-serif",
                  fontWeight: 600,
                  fontSize: "36px",
                  letterSpacing: "-0.02em",
                }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              >
                {name}
              </motion.h2>

              <motion.p
                layoutId={`${layoutId}-role`}
                className="mb-6"
                style={{
                  fontFamily: "var(--font-outfit), Outfit, sans-serif",
                  fontWeight: 500,
                  fontSize: "20px",
                  background:
                    "linear-gradient(90deg, #F80 0%, #F5A83B 25.48%, #F57238 92.31%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              >
                {role}
              </motion.p>

              <motion.p
                layoutId={`${layoutId}-description`}
                className="text-white/60 mb-10 max-w-2xl"
                style={{
                  fontFamily: "var(--font-outfit), Outfit, sans-serif",
                  fontWeight: 300,
                  fontSize: "16px",
                  lineHeight: "1.5",
                }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              >
                {description}
              </motion.p>

              <div className="space-y-10 max-w-2xl">
                {/* Background Section */}
                {background && (
                  <div>
                    <h4
                      className="text-white font-semibold text-[17px] mb-3"
                      style={{
                        fontFamily: "var(--font-outfit), Outfit, sans-serif",
                      }}
                    >
                      Background
                    </h4>
                    <p
                      className="text-white/60 leading-[1.6] font-light text-[15px]"
                      style={{
                        fontFamily: "var(--font-outfit), Outfit, sans-serif",
                      }}
                    >
                      {background}
                    </p>
                  </div>
                )}

                {/* Responsibilities Section */}
                {responsibilities && responsibilities.length > 0 && (
                  <div>
                    <h4
                      className="text-white font-semibold text-[17px] mb-3"
                      style={{
                        fontFamily: "var(--font-outfit), Outfit, sans-serif",
                      }}
                    >
                      Responsibilities at Beelia
                    </h4>
                    <ul className="space-y-2">
                      {responsibilities.map((item, index) => (
                        <li
                          key={index}
                          className="text-white/60 font-light text-[15px] flex gap-3"
                          style={{
                            fontFamily:
                              "var(--font-outfit), Outfit, sans-serif",
                          }}
                        >
                          <span className="text-white/30 mt-[7px] block w-1 h-1 rounded-full bg-current flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Core Strengths Section */}
                {coreStrengths && coreStrengths.length > 0 && (
                  <div>
                    <h4
                      className="text-white font-semibold text-[17px] mb-3"
                      style={{
                        fontFamily: "var(--font-outfit), Outfit, sans-serif",
                      }}
                    >
                      Core Strengths
                    </h4>
                    <ul className="space-y-2">
                      {coreStrengths.map((item, index) => (
                        <li
                          key={index}
                          className="text-white/60 font-light text-[15px] flex gap-3"
                          style={{
                            fontFamily:
                              "var(--font-outfit), Outfit, sans-serif",
                          }}
                        >
                          <span className="text-white/30 mt-[7px] block w-1 h-1 rounded-full bg-current flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <motion.div
        layoutId={layoutId}
        onClick={() => setIsExpanded(true)}
        className="group w-full h-full relative overflow-hidden cursor-pointer"
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Linear Gradient Effect on Hover */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            zIndex: 0,
            background: `
              linear-gradient(to top, 
                rgba(255, 150, 0, 0.6) 0%,
                rgba(255, 100, 0, 0.4) 16%,
                rgba(255, 50, 0, 0.2) 32%,
                transparent 70%
              )
            `,
          }}
        />

        {/* Card Content */}
        <div
          className="relative h-full flex items-start gap-4 px-5 py-10 md:px-10 md:py-10"
          style={{ zIndex: 1 }}
        >
          {/* Profile Image */}
          <motion.div
            layoutId={`${layoutId}-image`}
            className="w-16 h-16 bg-gray-700 overflow-hidden flex-shrink-0"
            style={{ borderRadius: "16px" }}
          >
            <Image
              src={image}
              alt={name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </motion.div>
          {/* Profile Info */}
          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-2">
              <motion.h3
                layoutId={`${layoutId}-name`}
                className="text-white"
                style={{
                  fontFamily: "var(--font-outfit), Outfit, sans-serif",
                  fontWeight: 600,
                  fontSize: "22px",
                }}
              >
                {name}
              </motion.h3>
              <Image
                src="/icons/Vector.svg"
                alt="arrow"
                width={14}
                height={14}
                className="w-3.5 h-3.5 transition-opacity duration-300 opacity-[0.1] group-hover:opacity-100"
                style={{
                  filter: "brightness(0) invert(1)",
                  marginBottom: "-4px",
                  marginLeft: "4px",
                }}
              />
            </div>
            <motion.p
              layoutId={`${layoutId}-role`}
              className="mb-2"
              style={{
                fontFamily: "var(--font-outfit), Outfit, sans-serif",
                fontWeight: 400,
                fontSize: "18px",
                background:
                  "linear-gradient(90deg, #F80 0%, #F5A83B 25.48%, #F57238 92.31%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {role}
            </motion.p>
            <motion.p
              layoutId={`${layoutId}-description`}
              className="text-white"
              style={{
                fontFamily: "var(--font-outfit), Outfit, sans-serif",
                fontWeight: 300,
                fontSize: "16px",
                lineHeight: "160%",
                opacity: 0.7,
              }}
            >
              {description}
            </motion.p>
          </div>
        </div>
      </motion.div>

      {typeof window !== "undefined" &&
        createPortal(expandedContent, document.body)}
    </>
  );
}
