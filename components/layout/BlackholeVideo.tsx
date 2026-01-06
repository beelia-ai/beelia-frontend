"use client";

import { useEffect, useState } from "react";
import { WebGLVideo } from "@/components/ui";
import { FOOTER_VIDEO_LOAD_START } from "@/lib/constants";

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

export function BlackholeVideo() {
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 768;
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    setIsIOSDevice(isIOS());
  }, []);

  // Track scroll position and load video when threshold is reached
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY >= FOOTER_VIDEO_LOAD_START && !shouldLoadVideo) {
        setShouldLoadVideo(true);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, [shouldLoadVideo]);

  if (!shouldLoadVideo) return null;

  // Desktop version
  if (!isMobile) {
    return (
      <div
        className="absolute left-0 right-0 w-full pointer-events-none"
        style={{
          bottom: "-300px",
          maxHeight: "150vh",
          overflow: "clip",
        }}
      >
        <div
          style={{
            transform: "rotate(-8deg) scale(1)",
            transformOrigin: "center center",
          }}
        >
          {isIOSDevice ? (
            <WebGLVideo
              webmSrc="/videos/black-hole.mp4"
              stackedAlphaSrc="/videos/black-hole.mp4"
              className="w-full h-auto object-cover"
              style={{ objectPosition: "bottom" }}
              autoPlay
              loop
              muted
              preload="auto"
            />
          ) : (
            <video
              src="/videos/black-hole.mp4"
              autoPlay
              loop
              muted
              playsInline
              controls={false}
              disablePictureInPicture
              disableRemotePlayback
              preload="auto"
              className="w-full h-auto object-cover"
              style={{
                objectPosition: "bottom",
                WebkitAppearance: "none",
                WebkitTapHighlightColor: "transparent",
                pointerEvents: "none",
                marginBottom: "-300px",
                marginLeft: "-50px",
              }}
            />
          )}
        </div>
      </div>
    );
  }

  // Mobile version - positioned after footer content
  return (
    <div
      className="w-full pointer-events-none"
      style={{
        minHeight: "200px",
        marginTop: "0px", // No negative margin - appears after footer content
        marginBottom: "-20px",
        maxHeight: "150vh",
        overflow: "clip",
      }}
    >
      <div
        style={{
          transform: "rotate(-8deg) scale(1.3)",
          transformOrigin: "center center",
        }}
      >
        <video
          src="/videos/black-hole.mp4"
          className="w-full h-auto"
          style={{
            objectPosition: "bottom",
            width: "100%",
            height: "auto",
            minHeight: "200px",
            display: "block",
            WebkitAppearance: "none",
            WebkitTapHighlightColor: "transparent",
            background: "transparent",
            pointerEvents: "none",
          }}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          onLoadedData={(e) => {
            const video = e.currentTarget;
            if (video.paused) {
              video.play().catch(() => {});
            }
          }}
        />
      </div>
    </div>
  );
}
