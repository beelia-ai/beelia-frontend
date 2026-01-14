"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface ExpandedProfileCardProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  role: string;
  image: string;
  description: string;
  background?: string;
  responsibilities?: string[];
  coreStrengths?: string[];
  socials?: {
    linkedin?: string;
  };
  layoutId: string;
}

export function ExpandedProfileCard({
  isOpen,
  onClose,
  name,
  role,
  image,
  description,
  background,
  responsibilities,
  coreStrengths,
  socials,
  layoutId,
}: ExpandedProfileCardProps) {
  const t = useTranslations('Team');
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      // Prevent iOS rubber-banding on html element
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.touchAction = "auto";
      document.documentElement.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.touchAction = "auto";
      document.documentElement.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed z-[10000] bg-black"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: "calc(-300px)", // Offset bottom to cover gap
            zIndex: 10000,
            paddingBottom: "300px",
            touchAction: "pan-y",
            overscrollBehavior: "contain",
          }}
          onTouchMove={(e) => e.stopPropagation()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Close Button - Fixed Position */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute flex items-center justify-center rounded-full border border-white/20 text-white/80 hover:bg-white/10 transition-all z-[110]"
            style={{
              position: "absolute",
              top: isMobile ? "20px" : "80px",
              right: isMobile ? "20px" : "80px",
              width: isMobile ? "52px" : "72px",
              height: isMobile ? "52px" : "72px",
            }}
          >
            <svg
              width={isMobile ? "28" : "36"}
              height={isMobile ? "28" : "36"}
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

          <div 
            className="w-full h-full overflow-y-auto overflow-x-hidden"
            style={{
              overscrollBehavior: "contain",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <div className="relative z-[1] min-h-screen w-full flex flex-col md:flex-row px-8 md:px-16 lg:px-24 py-24 md:py-32 gap-6 md:gap-12 lg:gap-20 max-w-7xl mx-auto" style={{ paddingTop: isMobile ? "28px" : "80px" }}>
              {/* Left Side: Profile Image & Socials */}
              <div className="flex flex-col items-center md:items-center gap-4 flex-shrink-0">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  style={{ width: "200px", height: "200px"}}
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
                  </div>
                )}
              </div>

              {/* Right Side: Info Content */}
              <div className="flex flex-col flex-1 relative">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="text-white mb-2"
                  style={{
                    fontFamily: "var(--font-outfit), Outfit, sans-serif",
                    fontWeight: 600,
                    fontSize: "36px",
                    letterSpacing: "-0.02em",
                    lineHeight: "1.2",
                  }}
                >
                  {name}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
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
                >
                  {role}
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="text-white/60 mb-10 max-w-2xl"
                  style={{
                    fontFamily: "var(--font-outfit), Outfit, sans-serif",
                    fontWeight: 300,
                    fontSize: "16px",
                    lineHeight: "1.5",
                  }}
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
                        {t('background')}
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
                        {t('responsibilities')}
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
                        {t('coreStrengths')}
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
