"use client";

import Image from "next/image";

export function Footer() {
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
        className="relative w-full min-h-screen overflow-hidden"
      >
        {/* Noise Names Image - Overlay right above blackhole */}
        <div className="absolute bottom-0 left-0 right-0 w-full z-20 pointer-events-none opacity-30">
          <Image
            src="/images/noise-overlay-image.png"
            alt="Noise names overlay"
            width={1920}
            height={400}
            className="w-full h-auto object-cover"
            style={{ objectPosition: "bottom" }}
            priority
          />
        </div>

        {/* Blackhole Image - Absolute positioned at bottom, full width */}
        <div className="absolute bottom-0 left-0 right-0 w-full z-10">
          <Image
            src="/images/footer-blackhole-image.png"
            alt="Footer blackhole"
            width={1920}
            height={400}
            className="w-full h-auto object-cover"
            style={{ objectPosition: "bottom" }}
            priority
          />
        </div>

        {/* Content - BEELIA and sections in same flex column */}
        <div
          className="relative z-10 flex flex-col min-h-screen px-8 md:px-16 lg:px-24 py-12"
          style={{ paddingBottom: "300px" }}
        >
          {/* Large BEELIA Text - Width matches content container */}
          <h1
            className="w-full font-bold select-none pointer-events-none -ml-4 md:-ml-2 lg:-ml-7"
            style={{
              fontFamily: "var(--font-outfit), sans-serif",
              color: "rgba(255,255,255, 0.07)",
              fontWeight: 800,
              fontSize: "calc((100vw - 4rem) * 0.262)",
              lineHeight: "1",
            }}
          >
            BEELIA
          </h1>

          {/* Main Content Area - Top Aligned with Links */}
          <div
            className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-16"
            style={{ padding: "0 18px 0 12px" }}
          >
            {/* Left Side - The App Store for AI Section */}
            <div className="flex flex-col">
              {/* Headline */}
              <h2
                className="text-white max-w-l mb-6"
                style={{
                  fontFamily: "var(--font-outfit), sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(32px, 4vw, 42px)",
                  lineHeight: "122%",
                  letterSpacing: "-0.02em",
                }}
              >
                The App Store for AI
              </h2>

              {/* Description */}
              <p
                className="text-white mb-8"
                style={{
                  fontFamily: "var(--font-outfit), sans-serif",
                  fontWeight: 400,
                  fontSize: "clamp(14px, 2vw, 16px)",
                  lineHeight: "130%",
                  letterSpacing: "0",
                  opacity: 0.5,
                  maxWidth: "450px",
                }}
              >
                Giving people a seamless way to find the right tools and start
                using them instantly, no setup, no friction.
              </p>

              {/* Powered By */}
              <p
                className="text-white uppercase"
                style={{
                  fontFamily: "var(--font-outfit), sans-serif",
                  fontWeight: 100,
                  fontSize: "clamp(12px, 1.5vw, 16px)",
                  lineHeight: "100%",
                  letterSpacing: "0.05em",
                  opacity: 0.5,
                }}
              >
                POWERED BY—CESNO
              </p>
            </div>

            {/* Right Side - Links */}
            <div className="flex flex-col md:flex-row gap-16 md:gap-32">
              {/* Connect Column */}
              <div className="flex flex-col items-end gap-6">
                <h3
                  className="text-right"
                  style={{
                    fontFamily: "var(--font-outfit), sans-serif",
                    fontWeight: 700,
                    fontSize: "clamp(16px, 2vw, 18.9px)",
                    lineHeight: "25.2px",
                    letterSpacing: "-0.02em",
                    color: "#FFFFFF",
                  }}
                >
                  Connect
                </h3>
                <div className="flex flex-col items-end gap-4">
                  <a
                    href="https://instagram.com/beelia.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link text-right hover:text-white/80 transition-all duration-300"
                    style={{
                      fontFamily: "var(--font-outfit), sans-serif",
                      fontWeight: 400,
                      fontSize: "clamp(14px, 1.8vw, 15.75px)",
                      lineHeight: "120%",
                      letterSpacing: "-0.02em",
                      textTransform: "uppercase",
                      color: "#FFFFFF",
                    }}
                  >
                    Instagram
                  </a>
                  <a
                    href="https://linkedin.com/company/beelia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link text-right hover:text-white/80 transition-all duration-300"
                    style={{
                      fontFamily: "var(--font-outfit), sans-serif",
                      fontWeight: 400,
                      fontSize: "clamp(14px, 1.8vw, 15.75px)",
                      lineHeight: "120%",
                      letterSpacing: "-0.02em",
                      textTransform: "uppercase",
                      color: "#FFFFFF",
                    }}
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://twitter.com/beelia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link text-right hover:text-white/80 transition-all duration-300"
                    style={{
                      fontFamily: "var(--font-outfit), sans-serif",
                      fontWeight: 400,
                      fontSize: "clamp(14px, 1.8vw, 15.75px)",
                      lineHeight: "120%",
                      letterSpacing: "-0.02em",
                      textTransform: "uppercase",
                      color: "#FFFFFF",
                    }}
                  >
                    Twitter
                  </a>
                </div>
              </div>

              {/* Legal Column */}
              <div className="flex flex-col items-end gap-6">
                <h3
                  className="text-right"
                  style={{
                    fontFamily: "var(--font-outfit), sans-serif",
                    fontWeight: 700,
                    fontSize: "clamp(16px, 2vw, 18.9px)",
                    lineHeight: "25.2px",
                    letterSpacing: "-0.02em",
                    color: "#FFFFFF",
                  }}
                >
                  Legal
                </h3>
                <div className="flex flex-col items-end gap-4">
                  <a
                    href="/privacy-policy"
                    className="footer-link text-right hover:text-white/80 transition-all duration-300"
                    style={{
                      fontFamily: "var(--font-outfit), sans-serif",
                      fontWeight: 400,
                      fontSize: "clamp(14px, 1.8vw, 15.75px)",
                      lineHeight: "120%",
                      letterSpacing: "-0.02em",
                      textTransform: "uppercase",
                      color: "#FFFFFF",
                    }}
                  >
                    Policies
                  </a>
                  <a
                    href="/terms-and-conditions"
                    className="footer-link text-right hover:text-white/80 transition-all duration-300"
                    style={{
                      fontFamily: "var(--font-outfit), sans-serif",
                      fontWeight: 400,
                      fontSize: "clamp(14px, 1.8vw, 15.75px)",
                      lineHeight: "120%",
                      letterSpacing: "-0.02em",
                      textTransform: "uppercase",
                      color: "#FFFFFF",
                    }}
                  >
                    Terms
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
