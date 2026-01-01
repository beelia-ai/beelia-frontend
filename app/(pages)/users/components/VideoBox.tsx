"use client";

import React, { useRef, useEffect } from "react";

interface VideoBoxProps {
  src: string;
  stackedSrc: string;
  left: string;
  top: string;
  width: string;
  height: string;
  isHeroVisible: boolean;
  traceLinesScrollProgress: number;
  animationDelay?: string;
}

// iOS detection helper
function isIOS(): boolean {
  if (typeof window === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

export function VideoBox({
  src,
  stackedSrc,
  left,
  top,
  width,
  height,
  isHeroVisible,
  traceLinesScrollProgress,
  animationDelay,
}: VideoBoxProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const opacity =
    traceLinesScrollProgress > 0 ? 1 - traceLinesScrollProgress : 1;

  const containerStyle: React.CSSProperties = {
    position: "absolute",
    left,
    top,
    width,
    height,
    backgroundColor: "#000000",
    borderRadius: "31.5px",
    zIndex: 10,
    opacity,
    overflow: "hidden",
    ...(animationDelay && { animationDelay }),
  };

  // Use normal .mp4 files for iOS, WebGLVideo for others (if webm available)
  const isIOSDevice = typeof window !== "undefined" && isIOS();
  const shouldPlay = isHeroVisible && traceLinesScrollProgress < 0.9;

  useEffect(() => {
    if (videoRef.current && shouldPlay) {
      const video = videoRef.current;
      if (video.paused && video.readyState >= 2) {
        video.play().catch(() => {});
      }
    }
  }, [shouldPlay]);

  // For iOS, use normal .mp4 file directly
  if (isIOSDevice) {
    return (
      <div className="box-video-float pointer-events-none" style={containerStyle}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay={shouldPlay}
          loop
          muted
          playsInline
          preload="auto"
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          style={{ pointerEvents: "none" }}
        >
          <source src={stackedSrc} type="video/mp4" />
        </video>
      </div>
    );
  }

  // For non-iOS, use webm if available, otherwise fallback to mp4
  return (
    <div className="box-video-float pointer-events-none" style={containerStyle}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay={shouldPlay}
        loop
        muted
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        style={{ pointerEvents: "none" }}
      >
        {src.endsWith('.webm') ? (
          <>
            <source src={src} type="video/webm" />
            <source src={stackedSrc} type="video/mp4" />
          </>
        ) : (
          <source src={stackedSrc} type="video/mp4" />
        )}
      </video>
    </div>
  );
}

export default VideoBox;
