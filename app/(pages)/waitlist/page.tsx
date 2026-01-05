"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ParticleSpritesBackground } from "@/components/ui";
import { Footer } from "@/components/layout/Footer";

const GlassSurface = dynamic(() => import("@/components/GlassSurface"), {
  ssr: false,
  loading: () => (
    <div
      className="flex items-center justify-center"
      style={{
        width: "100%",
        height: "60px",
        borderRadius: "50px",
        background: "rgba(255, 255, 255, 0.1)",
      }}
    >
      <span className="text-white/50">Loading...</span>
    </div>
  ),
});

// Card wrapper component for consistent styling
function CardSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Content */}
      <div className="relative z-0">{children}</div>
    </div>
  );
}

// Waitlist Hero Content
function WaitlistHero() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [platformLink, setPlatformLink] = useState("");
  const [userType, setUserType] = useState<"user" | "creator">("user");
  const [step, setStep] = useState<"email" | "details" | "complete">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [buttonHeight, setButtonHeight] = useState(60);

  useEffect(() => {
    setIsMounted(true);
    const updateHeight = () => {
      setButtonHeight(window.innerWidth < 640 ? 50 : 60);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  // Step 1: Submit email
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to join waitlist");
      }

      // Move to step 2 - details form with user type selection
      setStep("details");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to join waitlist. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Handle user type selection (just updates state, doesn't change step)
  const handleUserTypeSelect = (type: "user" | "creator") => {
    setUserType(type);
  };

  // Step 2: Submit additional details
  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const payload: Record<string, string> = {
        email,
        name,
        userType: userType,
        action: "update",
      };

      // Add creator-specific field
      if (userType === "creator") {
        payload.platformLink = platformLink;
      }

      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update details");
      }

      // Move to complete state
      setStep("complete");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to submit details. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      {/* Hover fill styles */}
      <style>{`
        .glass-btn-wrapper {
          position: relative;
          overflow: hidden;
          border-radius: 50px;
          display: block;
          width: 100% !important;
          max-width: 100% !important;
        }
        .glass-btn-wrapper::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #FEDA24 0%, #EF941F 50%, #FEDA24 100%);
          transition: clip-path 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          clip-path: inset(0 100% 0 0);
          z-index: 1;
          border-radius: 50px;
          pointer-events: none;
        }
        .glass-btn-wrapper:hover::after {
          clip-path: inset(0 0 0 0);
        }
        .glass-btn-wrapper > * {
          position: relative;
          z-index: 2;
          width: 100% !important;
          max-width: 100% !important;
        }
        form.space-y-4 {
          width: 100% !important;
          max-width: 100% !important;
        }
        form.space-y-4 button {
          width: 100% !important;
          max-width: 100% !important;
        }
      `}</style>

      {/* Main Content */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center px-4 sm:px-6">
        {step === "complete" ? (
          /* Complete State */
          <div className="text-center max-w-lg">
            <div
              className="w-16 h-16 mx-auto mb-10 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(254, 218, 36, 0.1)",
                border: "1px solid rgba(254, 218, 36, 0.2)",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FEDA24"
                strokeWidth="1.5"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>

            <h1
              className="text-white mb-4"
              style={{
                fontFamily: "var(--font-outfit), sans-serif",
                fontWeight: 400,
                fontSize: "32px",
                letterSpacing: "-0.02em",
              }}
            >
              You&apos;re all set!
            </h1>

            <p
              className="text-white/40 mb-12"
              style={{
                fontFamily: "var(--font-outfit), sans-serif",
                fontSize: "15px",
                lineHeight: "170%",
              }}
            >
              Thanks for joining, {name || "friend"}! <br />
              We&apos;ll notify you when Beelia launches.
            </p>

            <Link
              href="/users"
              className="group inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-300"
              style={{
                fontFamily: "var(--font-outfit), sans-serif",
                fontSize: "14px",
              }}
            >
              Back Home
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="transition-transform duration-500 ease-in-out rotate-45 group-hover:rotate-0"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        ) : step === "details" ? (
          /* Step 2: Details Form with User Type Selection */
          <div className="w-full max-w-md text-center">
            {/* Success indicator */}
            <div
              className="w-12 h-12 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(254, 218, 36, 0.1)",
                border: "1px solid rgba(254, 218, 36, 0.2)",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FEDA24"
                strokeWidth="1.5"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>

            {/* Heading */}
            <h1
              className="text-white mb-3"
              style={{
                fontFamily: "var(--font-outfit), sans-serif",
                fontWeight: 400,
                fontSize: "clamp(28px, 5vw, 40px)",
                lineHeight: "115%",
                letterSpacing: "-0.03em",
              }}
            >
              Almost there!
            </h1>

            {/* Description */}
            <p
              className="text-white/40 mb-8 max-w-sm mx-auto"
              style={{
                fontFamily: "var(--font-outfit), sans-serif",
                fontWeight: 400,
                fontSize: "15px",
                lineHeight: "170%",
              }}
            >
              Tell us a bit more about yourself (optional)
            </p>

            {/* User Type Toggle Pills */}
            <div className="w-full mb-6">
              <div className="flex gap-3">
                {isMounted ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleUserTypeSelect("user")}
                      className={`flex-1 group cursor-pointer transition-all duration-300 ${
                        userType === "user" ? "opacity-100" : "opacity-50"
                      }`}
                      style={{
                        perspective: "1000px",
                        transformStyle: "preserve-3d",
                      }}
                      onMouseEnter={() => setIsButtonHovered(true)}
                      onMouseLeave={() => setIsButtonHovered(false)}
                    >
                      <div
                        className="glass-btn-wrapper"
                        style={{ width: "100%", display: "block" }}
                      >
                        <GlassSurface
                          width="100%"
                          height={buttonHeight}
                          borderRadius={50}
                          chromaticAberration={
                            userType === "user" && isButtonHovered ? 0.3 : 0.15
                          }
                          style={{
                            transform:
                              userType === "user" && isButtonHovered
                                ? "translateZ(20px) rotateX(-1deg) rotateY(1deg) scale(1.02)"
                                : "translateZ(10px) rotateX(0deg) rotateY(0deg) scale(1)",
                            boxShadow:
                              userType === "user" && isButtonHovered
                                ? "0 20px 40px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.15) inset, 0 0 50px rgba(147, 51, 234, 0.4)"
                                : "0 15px 30px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, 0 0 40px rgba(147, 51, 234, 0.2)",
                            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                            border:
                              userType === "user"
                                ? "1px solid rgba(254, 218, 36, 0.5)"
                                : "none",
                          }}
                        >
                          <div className="w-full flex items-center justify-center gap-2 sm:gap-3 relative z-10 px-4 sm:px-0">
                            <span
                              className="text-white uppercase"
                              style={{
                                fontFamily: "var(--font-outfit), sans-serif",
                                fontSize: "clamp(14px, 3.5vw, 18px)",
                                lineHeight: "100%",
                                letterSpacing: "0.06em",
                              }}
                            >
                              User
                            </span>
                          </div>
                        </GlassSurface>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUserTypeSelect("creator")}
                      className={`flex-1 group cursor-pointer transition-all duration-300 ${
                        userType === "creator" ? "opacity-100" : "opacity-50"
                      }`}
                      style={{
                        perspective: "1000px",
                        transformStyle: "preserve-3d",
                      }}
                      onMouseEnter={() => setIsButtonHovered(true)}
                      onMouseLeave={() => setIsButtonHovered(false)}
                    >
                      <div
                        className="glass-btn-wrapper"
                        style={{ width: "100%", display: "block" }}
                      >
                        <GlassSurface
                          width="100%"
                          height={buttonHeight}
                          borderRadius={50}
                          chromaticAberration={
                            userType === "creator" && isButtonHovered
                              ? 0.3
                              : 0.15
                          }
                          style={{
                            transform:
                              userType === "creator" && isButtonHovered
                                ? "translateZ(20px) rotateX(-1deg) rotateY(1deg) scale(1.02)"
                                : "translateZ(10px) rotateX(0deg) rotateY(0deg) scale(1)",
                            boxShadow:
                              userType === "creator" && isButtonHovered
                                ? "0 20px 40px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.15) inset, 0 0 50px rgba(147, 51, 234, 0.4)"
                                : "0 15px 30px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, 0 0 40px rgba(147, 51, 234, 0.2)",
                            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                            border:
                              userType === "creator"
                                ? "1px solid rgba(254, 218, 36, 0.5)"
                                : "none",
                          }}
                        >
                          <div className="w-full flex items-center justify-center gap-2 sm:gap-3 relative z-10 px-4 sm:px-0">
                            <span
                              className="text-white uppercase"
                              style={{
                                fontFamily: "var(--font-outfit), sans-serif",
                                fontSize: "clamp(14px, 3.5vw, 18px)",
                                lineHeight: "100%",
                                letterSpacing: "0.06em",
                              }}
                            >
                              Creator
                            </span>
                          </div>
                        </GlassSurface>
                      </div>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleUserTypeSelect("user")}
                      className={`flex-1 h-[50px] sm:h-[60px] rounded-full flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300 ${
                        userType === "user" ? "opacity-100" : "opacity-50"
                      }`}
                      style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        border:
                          userType === "user"
                            ? "1px solid rgba(254, 218, 36, 0.5)"
                            : "1px solid rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <span
                        className="text-white uppercase"
                        style={{
                          fontFamily: "var(--font-outfit), sans-serif",
                          fontSize: "clamp(14px, 3.5vw, 18px)",
                          lineHeight: "100%",
                          letterSpacing: "0.06em",
                        }}
                      >
                        User
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUserTypeSelect("creator")}
                      className={`flex-1 h-[50px] sm:h-[60px] rounded-full flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300 ${
                        userType === "creator" ? "opacity-100" : "opacity-50"
                      }`}
                      style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        border:
                          userType === "creator"
                            ? "1px solid rgba(254, 218, 36, 0.5)"
                            : "1px solid rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <span
                        className="text-white uppercase"
                        style={{
                          fontFamily: "var(--font-outfit), sans-serif",
                          fontSize: "clamp(14px, 3.5vw, 18px)",
                          lineHeight: "100%",
                          letterSpacing: "0.06em",
                        }}
                      >
                        Creator
                      </span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleDetailsSubmit} className="w-full space-y-4">
              <div className="relative w-full">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full h-[50px] sm:h-[60px] px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-[15px] bg-white/[0.03] text-white placeholder-white/30 outline-none transition-all duration-300 focus:bg-white/[0.05] rounded-[50px]"
                  style={{
                    width: "100%",
                    fontFamily: "var(--font-outfit), sans-serif",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                />
              </div>

              {userType === "creator" && (
                <div className="relative w-full">
                  <input
                    type="url"
                    value={platformLink}
                    onChange={(e) => setPlatformLink(e.target.value)}
                    placeholder="Link to your platform"
                    className="w-full h-[50px] sm:h-[60px] px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-[15px] bg-white/[0.03] text-white placeholder-white/30 outline-none transition-all duration-300 focus:bg-white/[0.05] rounded-[50px]"
                    style={{
                      width: "100%",
                      fontFamily: "var(--font-outfit), sans-serif",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                    }}
                  />
                </div>
              )}

              {isMounted ? (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full group cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    width: "100%",
                    perspective: "1000px",
                    transformStyle: "preserve-3d",
                  }}
                  onMouseEnter={() => setIsButtonHovered(true)}
                  onMouseLeave={() => setIsButtonHovered(false)}
                >
                  <div
                    className="glass-btn-wrapper"
                    style={{ width: "100%", display: "block" }}
                  >
                    <GlassSurface
                      width="100%"
                      height={buttonHeight}
                      borderRadius={50}
                      chromaticAberration={isButtonHovered ? 0.3 : 0.15}
                      style={{
                        transform: isButtonHovered
                          ? "translateZ(20px) rotateX(-1deg) rotateY(1deg) scale(1.02)"
                          : "translateZ(10px) rotateX(0deg) rotateY(0deg) scale(1)",
                        boxShadow: isButtonHovered
                          ? "0 20px 40px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.15) inset, 0 0 50px rgba(147, 51, 234, 0.4)"
                          : "0 15px 30px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, 0 0 40px rgba(147, 51, 234, 0.2)",
                        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    >
                      <div className="w-full flex items-center justify-center gap-2 sm:gap-3 relative z-10 px-4 sm:px-0">
                        {isLoading ? (
                          <span className="flex items-center gap-2 text-white">
                            <svg
                              className="animate-spin w-4 h-4 sm:w-5 sm:h-5"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="none"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            <span
                              style={{
                                fontFamily: "var(--font-outfit), sans-serif",
                                fontSize: "clamp(14px, 3.5vw, 18px)",
                                lineHeight: "100%",
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                              }}
                            >
                              Submitting...
                            </span>
                          </span>
                        ) : (
                          <>
                            <span
                              className="text-white uppercase"
                              style={{
                                fontFamily: "var(--font-outfit), sans-serif",
                                fontSize: "clamp(14px, 3.5vw, 18px)",
                                lineHeight: "100%",
                                letterSpacing: "0.06em",
                              }}
                            >
                              Submit
                            </span>
                            <Image
                              src="/icons/Vector.svg"
                              alt="arrow"
                              width={18}
                              height={18}
                              className="w-4 h-4 sm:w-[18px] sm:h-[18px] transition-transform duration-500 ease-in-out group-hover:rotate-45"
                            />
                          </>
                        )}
                      </div>
                    </GlassSurface>
                  </div>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 sm:py-4 rounded-full flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300"
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    height: "clamp(50px, 12vw, 60px)",
                  }}
                >
                  <span
                    className="text-white uppercase"
                    style={{
                      fontFamily: "var(--font-outfit), sans-serif",
                      fontSize: "clamp(14px, 3.5vw, 18px)",
                      lineHeight: "100%",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Submit
                  </span>
                </button>
              )}
            </form>

            {/* Skip link */}
            <button
              onClick={() => setStep("complete")}
              className="mt-6 text-white/30 hover:text-white/50 transition-colors duration-300"
              style={{
                fontFamily: "var(--font-outfit), sans-serif",
                fontSize: "13px",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Skip for now
            </button>
          </div>
        ) : (
          /* Step 1: Email Form */
          <div className="w-full max-w-md text-center">
            {/* Heading */}
            <h1
              className="text-white mb-2"
              style={{
                fontFamily: "var(--font-outfit), sans-serif",
                fontWeight: 400,
                fontSize: "clamp(36px, 6vw, 52px)",
                lineHeight: "115%",
                letterSpacing: "-0.03em",
              }}
            >
              Get{" "}
              <span
                className="bg-gradient-to-r from-[#FEDA24] via-[#FFE55C] to-[#EF941F] bg-clip-text text-transparent"
                style={{
                  fontFamily: "var(--font-instrument-serif), serif",
                  fontStyle: "italic",
                }}
              >
                Early Access
              </span>
            </h1>

            {/* Description */}
            <p
              className="text-white/40 mb-12 max-w-sm mx-auto"
              style={{
                fontFamily: "var(--font-outfit), sans-serif",
                fontWeight: 300,
                fontSize: "17px",
                lineHeight: "170%",
              }}
            >
              Being early is rare. This is one of those moments.
            </p>

            {/* Form */}
            <form onSubmit={handleEmailSubmit} className="w-full space-y-4">
              <div className="relative w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full h-[50px] sm:h-[60px] px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-[15px] bg-white/[0.03] text-white placeholder-white/30 outline-none transition-all duration-300 focus:bg-white/[0.05] rounded-[50px]"
                  style={{
                    width: "100%",
                    fontFamily: "var(--font-outfit), sans-serif",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                />
              </div>

              {isMounted ? (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full group cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    width: "100%",
                    perspective: "1000px",
                    transformStyle: "preserve-3d",
                  }}
                  onMouseEnter={() => setIsButtonHovered(true)}
                  onMouseLeave={() => setIsButtonHovered(false)}
                >
                  <div
                    className="glass-btn-wrapper"
                    style={{ width: "100%", display: "block" }}
                  >
                    <GlassSurface
                      width="100%"
                      height={buttonHeight}
                      borderRadius={50}
                      chromaticAberration={isButtonHovered ? 0.3 : 0.15}
                      style={{
                        transform: isButtonHovered
                          ? "translateZ(20px) rotateX(-1deg) rotateY(1deg) scale(1.02)"
                          : "translateZ(10px) rotateX(0deg) rotateY(0deg) scale(1)",
                        boxShadow: isButtonHovered
                          ? "0 20px 40px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.15) inset, 0 0 50px rgba(147, 51, 234, 0.4)"
                          : "0 15px 30px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, 0 0 40px rgba(147, 51, 234, 0.2)",
                        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    >
                      <div className="w-full flex items-center justify-center gap-2 sm:gap-3 relative z-10 px-4 sm:px-0">
                        {isLoading ? (
                          <span className="flex items-center gap-2 text-white">
                            <svg
                              className="animate-spin w-4 h-4 sm:w-5 sm:h-5"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="none"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            <span
                              style={{
                                fontFamily: "var(--font-outfit), sans-serif",
                                fontSize: "clamp(14px, 3.5vw, 18px)",
                                lineHeight: "100%",
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                              }}
                            >
                              Joining...
                            </span>
                          </span>
                        ) : (
                          <>
                            <span
                              className="text-white uppercase"
                              style={{
                                fontFamily: "var(--font-outfit), sans-serif",
                                fontSize: "clamp(14px, 3.5vw, 18px)",
                                lineHeight: "100%",
                                letterSpacing: "0.06em",
                              }}
                            >
                              Join Waitlist
                            </span>
                            <Image
                              src="/icons/Vector.svg"
                              alt="arrow"
                              width={18}
                              height={18}
                              className="w-4 h-4 sm:w-[18px] sm:h-[18px] transition-transform duration-500 ease-in-out group-hover:rotate-45"
                            />
                          </>
                        )}
                      </div>
                    </GlassSurface>
                  </div>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 sm:py-4 rounded-full flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300"
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    height: "clamp(50px, 12vw, 60px)",
                  }}
                >
                  <span
                    className="text-white uppercase"
                    style={{
                      fontFamily: "var(--font-outfit), sans-serif",
                      fontSize: "clamp(14px, 3.5vw, 18px)",
                      lineHeight: "100%",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Join Waitlist
                  </span>
                </button>
              )}
            </form>

            {/* Privacy Note */}
            <p
              className="text-white/25 mt-6"
              style={{
                fontFamily: "var(--font-outfit), sans-serif",
                fontSize: "12px",
              }}
            >
              No spam. Unsubscribe anytime.
            </p>

            {/* Social Proof */}
            <div className="mt-16 pt-8 border-t border-white/[0.06]">
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <p
                    className="text-white mb-1"
                    style={{
                      fontFamily: "var(--font-outfit), sans-serif",
                      fontWeight: 500,
                      fontSize: "20px",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    500+
                  </p>
                  <p
                    className="text-white/30"
                    style={{
                      fontFamily: "var(--font-outfit), sans-serif",
                      fontSize: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Waitlist
                  </p>
                </div>

                <div className="w-px h-8 bg-white/[0.06]" />

                <div className="text-center">
                  <p
                    className="text-white mb-1"
                    style={{
                      fontFamily: "var(--font-outfit), sans-serif",
                      fontWeight: 500,
                      fontSize: "20px",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Q2 &apos;26
                  </p>
                  <p
                    className="text-white/30"
                    style={{
                      fontFamily: "var(--font-outfit), sans-serif",
                      fontSize: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Launch
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function WaitlistPage() {
  // Glossy white and silver colors in HSL format (normalized 0-1)
  const beeliaColors = [
    [0, 0, 1], // Pure white - glossy white
    [0, 0, 0.9], // Off-white - bright silver
    [0, 0, 0.75], // Silver - medium silver
    [0, 0, 0.85], // Light silver - bright silver
    [0, 0, 0.95], // Near white - glossy white
  ];

  return (
    <main className="relative min-h-screen bg-black overflow-x-hidden">
      {/* First Section with Grid - Behind particles */}
      <div className="relative min-h-screen">
        {/* Square Grid - Absolute, stays in first section only */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 1,
            opacity: 0.15,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
            `,
            backgroundSize: `60px 60px`,
          }}
        />

        {/* Mask overlay to hide grid in content area */}
        <div
          className="absolute pointer-events-none"
          style={{
            zIndex: 2,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(90vw, 600px)",
            height: "min(85vh, 800px)",
            background:
              "linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 1) 5%, rgba(0, 0, 0, 1) 95%, transparent 100%)",
          }}
        />

        {/* Fade-off effect at bottom 10% of grid */}
        <div
          className="absolute pointer-events-none"
          style={{
            zIndex: 3,
            bottom: 0,
            left: 0,
            right: 0,
            height: "10%",
            background:
              "linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%)",
          }}
        />
      </div>

      {/* Particles Background - Fixed, above grid but below content */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 5 }}>
        <ParticleSpritesBackground
          className="fixed inset-0"
          particleCount={150}
          followMouse={true}
          mouseSensitivity={0.05}
          colors={beeliaColors}
          cycleColors={false}
          sizes={[5, 5, 5, 5, 5]}
          speed={0.3}
        />
      </div>

      {/* Content - Above particles */}
      <div className="absolute inset-0" style={{ zIndex: 10 }}>
        {/* Waitlist Hero Content */}
        <WaitlistHero />
      </div>

      {/* Footer - Above particles */}
      <div className="relative" style={{ zIndex: 10 }}>
        <Footer />
      </div>
    </main>
  );
}
