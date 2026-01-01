"use client";

import { useEffect, useState } from "react";
import { FooterLink } from "./FooterLink";
import { LegalModal } from "./LegalModal";
import { WebGLVideo } from "@/components/ui";
import legalContent from "./legal-content.json";

// iOS detection helper
function isIOS(): boolean {
  if (typeof window === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

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

export function Footer() {
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 768;
  const [isIOSDevice, setIsIOSDevice] = useState(false);

  // Load content from JSON file
  const termsContent = legalContent.terms.content;
  const privacyContent = legalContent.policies.content;

  useEffect(() => {
    setIsIOSDevice(isIOS());
  }, []);

  return (
    <>
      {/* Animated underline styles */}
      <style>{`
        .footer-link {
          position: relative;
        }
        .footer-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1.4px;
          background: white;
          transition: width 0.3s ease;
        }
        .footer-link:hover::after {
          width: 100%;
        }
      `}</style>
      <footer
        id="footer"
        className="relative w-full"
        style={{ overflowX: "clip", overflowY: isMobile ? "visible" : "clip" }}
      >
        {/* Noise Names Image - Overlay right above blackhole */}
        {/* <div className="absolute bottom-0 left-0 right-0 w-full z-20 pointer-events-none opacity-30">
          <Image
            src="/images/noise-overlay-image.png"
            alt="Noise names overlay"
            width={1920}
            height={400}
            className="w-full h-auto object-cover"
            style={{ objectPosition: "bottom" }}
            priority
          />
        </div> */}

        {/* Blackhole Video - Absolute positioned at bottom for desktop */}
        {!isMobile && (
          <div
            className="absolute left-0 right-0 w-full z-10"
            style={{
              bottom: "-240px",
              transform: "rotate(-8deg) scale(1)",
              transformOrigin: "center center",
            }}
          >
            {isIOSDevice ? (
              <WebGLVideo
                webmSrc="/videos/black-hole.webm"
                stackedAlphaSrc="/videos/black-hole-stacked.mp4"
                className="w-full h-auto object-cover"
                style={{ objectPosition: "bottom" }}
                autoPlay
                loop
                muted
              />
            ) : (
              <video
                src="/videos/black-hole.webm"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto object-cover"
                style={{ objectPosition: "bottom" }}
              />
            )}
          </div>
        )}

        {/* Content - BEELIA and sections in same flex column */}
        <div
          className="relative z-10 flex flex-col px-4 sm:px-6 md:px-16 lg:px-24 pb-8 md:pb-12"
          style={{
            paddingTop: isMobile
              ? "clamp(40px, 5vw, 80px)"
              : "clamp(60px, 6vw, 120px)",
            paddingBottom: isMobile ? "0px" : "300px",
          }}
        >
          {/* Large BEELIA Text - Width matches content container */}
          <h1
            className="w-full font-bold select-none pointer-events-none -ml-2 sm:-ml-3 md:-ml-2 lg:-ml-7"
            style={{
              fontFamily: "var(--font-outfit), sans-serif",
              color: "rgba(255,255,255, 0.07)",
              fontWeight: 800,
              fontSize: "calc((100vw - 2rem) * 0.262)",
              lineHeight: "1",
              marginTop: "0",
              marginBottom: "clamp(20px, 2vw, 40px)",
              paddingTop: "0",
            }}
          >
            BEELIA
          </h1>

          {/* Main Content Area - Top Aligned with Links */}
          <div
            className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-16"
            style={{ padding: "0 4px 0 4px" }}
          >
            {/* Left Side - The App Store for AI Section */}
            <div
              className="flex flex-col"
              style={{
                marginTop: isMobile ? "clamp(40px, 4vw, 80px)" : "0",
              }}
            >
              {/* Headline */}
              <h2
                className="text-white max-w-l mb-4 md:mb-6"
                style={{
                  fontFamily: "var(--font-outfit), sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(29px, 6vw, 43px)",
                  lineHeight: "122%",
                  letterSpacing: "-0.02em",
                }}
              >
                The AI Marketplace
              </h2>

              {/* Description */}
              <p
                className="text-white mb-6 md:mb-8 max-w-full md:max-w-[500px]"
                style={{
                  fontFamily: "var(--font-outfit), sans-serif",
                  fontWeight: 300,
                  fontSize: "clamp(15px, 2vw, 17px)",
                  lineHeight: "130%",
                  letterSpacing: "0",
                  opacity: 0.5,
                }}
              >
                Where AI tools meet the people who need them.
              </p>

              {/* Powered By */}
              <p
                style={{
                  fontFamily: "var(--font-outfit), sans-serif",
                  fontWeight: 100,
                  fontSize: "clamp(13px, 1.5vw, 17px)",
                  lineHeight: "100%",
                  letterSpacing: "0.05em",
                  background:
                    "linear-gradient(90deg, #F80 0%, #F5A83B 25.48%, #F57238 92.31%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Powered by <b>CESNO</b>
              </p>
            </div>

            {/* Right Side - Links */}
            <div
              className="flex flex-row w-full md:w-auto"
              style={{
                gap: "80px",
                marginTop: isMobile ? "clamp(40px, 4vw, 80px)" : "0",
                flexDirection: isMobile ? "row" : "row-reverse",
              }}
            >
              {/* Connect Column */}
              <div className="flex flex-col items-start sm:items-end gap-4 md:gap-6">
                <h3
                  className="text-left sm:text-right"
                  style={{
                    fontFamily: "var(--font-outfit), sans-serif",
                    fontWeight: 400,
                    fontSize: "clamp(17px, 2vw, 19.9px)",
                    lineHeight: "25.2px",
                    letterSpacing: "-0.02em",
                    color: "#FFFFFF",
                    opacity: 0.5,
                  }}
                >
                  Connect
                </h3>
                <div
                  className="flex flex-col items-start sm:items-end"
                  style={{ gap: "20px" }}
                >
                  <FooterLink href="https://discord.gg/EkxXyy6RAj" external>
                    Discord
                  </FooterLink>
                  <FooterLink
                    href="https://www.tiktok.com/@beeliaai?_r=1&_t=ZN-92fzBRa4SVa"
                    external
                  >
                    TikTok
                  </FooterLink>
                  <FooterLink
                    href="https://www.linkedin.com/company/beelia-ai/"
                    external
                  >
                    LinkedIn
                  </FooterLink>
                  <FooterLink href="https://x.com/beelia_ai" external>
                    Twitter
                  </FooterLink>
                </div>
              </div>

              {/* Legal Column */}
              <div className="flex flex-col items-start sm:items-end gap-3 md:gap-6">
                <h3
                  className="text-left sm:text-right"
                  style={{
                    fontFamily: "var(--font-outfit), sans-serif",
                    fontWeight: 400,
                    fontSize: "clamp(17px, 2vw, 19.9px)",
                    lineHeight: "25.2px",
                    letterSpacing: "-0.02em",
                    color: "#FFFFFF",
                    opacity: 0.5,
                  }}
                >
                  Legal
                </h3>
                <div
                  className="flex flex-col items-start sm:items-end"
                  style={{ gap: "14px" }}
                >
                  {/* LegalModal components with built-in trigger and modal */}
                  <LegalModal
                    label="Policies"
                    title="Policies"
                    content={privacyContent}
                  />
                  <LegalModal
                    label="Terms"
                    title="Terms"
                    content={termsContent}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Blackhole Video - Mobile: Right below Connect & Legal links */}
          {isMobile && (
            <div
              className="w-full mt-12 -mb-20"
              style={{
                transform: "rotate(-8deg) scale(1.3)",
                transformOrigin: "center center",
              }}
            >
              {isIOSDevice ? (
                <WebGLVideo
                  webmSrc="/videos/black-hole.webm"
                  stackedAlphaSrc="/videos/black-hole-stacked.mp4"
                  className="w-full h-auto object-cover"
                  style={{ objectPosition: "bottom" }}
                  autoPlay
                  loop
                  muted
                />
              ) : (
                <video
                  src="/videos/black-hole.webm"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto object-cover"
                  style={{ objectPosition: "bottom" }}
                />
              )}
            </div>
          )}
        </div>
      </footer>
    </>
  );
}
