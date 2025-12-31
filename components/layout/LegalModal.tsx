"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

interface LegalModalProps {
  readonly label: string;
  readonly title: string;
  readonly content: string;
}

export function LegalModal({ label, title, content }: LegalModalProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Disable scroll when expanded, hide navbar, and handle escape key
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden";
      // Add class to hide navbar
      document.body.classList.add("modal-open");
      
      // Handle escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsExpanded(false);
        }
      };
      
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.body.style.overflow = "unset";
        document.body.classList.remove("modal-open");
        document.removeEventListener("keydown", handleEscape);
      };
    } else {
      document.body.style.overflow = "unset";
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.classList.remove("modal-open");
    };
  }, [isExpanded]);

  // Unique ID for layout animation - use label for consistency
  const layoutId = `legal-${label.replace(/\s+/g, "-").toLowerCase()}`;

  const expandedContent = (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          layoutId={layoutId}
          className="fixed inset-0 z-[100] bg-black overflow-hidden"
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
          <div className="relative z-[1] h-full w-full flex flex-col max-w-4xl mx-auto">
            {/* Fixed Header - Title and Close Button */}
            <div className="flex-shrink-0 relative px-8 md:px-16 lg:px-24 pt-8 md:pt-12 pb-6">
              {/* Close Button - Fixed position */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
                className="absolute top-8 right-8 md:top-12 md:right-16 w-12 h-12 flex items-center justify-center rounded-full border border-white/20 text-white/80 hover:bg-white/10 transition-all z-[110]"
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

              {/* Title - Fixed position */}
              <motion.h2
                layoutId={`${layoutId}-title`}
                className="text-white pr-16"
                style={{
                  fontFamily: "var(--font-outfit), Outfit, sans-serif",
                  fontWeight: 600,
                  fontSize: "clamp(28px, 4vw, 48px)",
                  letterSpacing: "-0.02em",
                  lineHeight: "1.2",
                }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              >
                {title}
              </motion.h2>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-8 md:px-16 lg:px-24 pb-8 md:pb-12">
              <motion.div
                className="text-white/60"
                style={{
                  fontFamily: "var(--font-outfit), Outfit, sans-serif",
                  fontWeight: 300,
                  fontSize: "16px",
                  lineHeight: "1.6",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: content }}
                  style={{
                    fontFamily: "var(--font-outfit), Outfit, sans-serif",
                  }}
                  className="[&>p]:mb-4 [&>h1]:text-white [&>h1]:text-2xl [&>h1]:font-semibold [&>h1]:mb-4 [&>h1]:mt-8 [&>h2]:text-white [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:mb-3 [&>h2]:mt-6 [&>h3]:text-white [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:mb-2 [&>h3]:mt-4 [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-4 [&>ul>li]:mb-2 [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:mb-4 [&>ol>li]:mb-2"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Trigger Element - matches ProfileCard pattern exactly */}
      <motion.div
        layoutId={layoutId}
        onClick={() => setIsExpanded(true)}
        className="group cursor-pointer inline-block"
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      >
        <motion.span
          layoutId={`${layoutId}-title`}
          className="footer-link text-right hover:text-white/80 transition-all duration-300 inline-block"
          style={{
            fontFamily: "var(--font-outfit), sans-serif",
            fontWeight: 400,
            fontSize: "0.9rem",
            lineHeight: "120%",
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            color: "#FFFFFF",
            position: "relative",
            display: "inline-block",
          }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        >
          {label}
        </motion.span>
      </motion.div>

      {/* Portal for expanded content - same as ProfileCard */}
      {typeof window !== "undefined" &&
        createPortal(expandedContent, document.body)}
    </>
  );
}
