"use client";

import React, { RefObject, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, MotionValue } from "framer-motion";
import {
  SHOW_HERO_VIDEOS,
  FUTURE_GLOBE_SIZE_MOBILE,
  FUTURE_GLOBE_SIZE_DESKTOP,
  PAST_VIDEO_SIZE_MOBILE,
  PAST_VIDEO_SIZE_DESKTOP,
} from "@/lib/constants";

// Detect Safari/iOS - these don't support WebM with alpha transparency
function needsMp4Fallback(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent;
  // iOS devices
  const isIOS = /iPad|iPhone|iPod/.test(ua) || 
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  // Safari browser (not Chrome/Chromium)
  const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua) && !/Chromium/.test(ua);
  return isIOS || isSafari;
}

interface VideoGlobeProps {
  globeSize: number;
  globeTop: string;
  globeY: MotionValue<number>;
  globeScale: MotionValue<number>;
  beeliaOpacity: MotionValue<number>;
  presentVideoOpacity: MotionValue<number>;
  futureTransitionCombinedOpacity: MotionValue<number>;
  futureMainVideoOpacity: MotionValue<number>;
  hidePastVideo: boolean;
  showFutureMain: boolean;
  isMobile: boolean;
  isHeroVisible: boolean;
  beeliaVideoRef: RefObject<HTMLVideoElement | null>;
  phase2VideoRef: RefObject<HTMLVideoElement | null>;
  futureTransitionVideoRef: RefObject<HTMLVideoElement | null>;
  futureMainVideoRef: RefObject<HTMLVideoElement | null>;
}

export function VideoGlobe({
  globeSize,
  globeTop,
  globeY,
  globeScale,
  beeliaOpacity,
  presentVideoOpacity,
  futureTransitionCombinedOpacity,
  futureMainVideoOpacity,
  hidePastVideo,
  showFutureMain,
  isMobile,
  isHeroVisible,
  beeliaVideoRef,
  phase2VideoRef,
  futureTransitionVideoRef,
  futureMainVideoRef,
}: VideoGlobeProps) {
  // Detect if we need MP4 fallback (Safari/iOS don't support WebM with alpha)
  const [useMp4Only, setUseMp4Only] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUseMp4Only(needsMp4Fallback());
  }, []);

  // Fix seamlessly looping for past.mp4 by seeking before the actual end
  // This prevents the small millisecond gap/flicker that occurs in some browsers
  useEffect(() => {
    if (hidePastVideo || !SHOW_HERO_VIDEOS) return;

    let rafId: number;
    let timer: NodeJS.Timeout;

    const startLoopCheck = () => {
      const video = beeliaVideoRef.current;
      if (!video) return;

      const checkLoop = () => {
        if (!video.paused && video.duration) {
          // If within 50ms of the end, seek to beginning
          if (video.duration - video.currentTime <= 0.05) {
            video.currentTime = 0;
            video.play().catch(() => {});
          }
        }
        rafId = requestAnimationFrame(checkLoop);
      };

      rafId = requestAnimationFrame(checkLoop);
    };

    // Use a small timeout to ensure ref is populated after render
    timer = setTimeout(startLoopCheck, 100);

    return () => {
      clearTimeout(timer);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [hidePastVideo, beeliaVideoRef]);

  // Ensure video plays when visible and respects iOS autoplay policies
  useEffect(() => {
    const video = beeliaVideoRef.current;
    if (!video) return;

    if (isHeroVisible) {
      video.play().catch(() => {
        // Autoplay might be prevented
      });
    } else {
      video.pause();
    }
  }, [isHeroVisible, beeliaVideoRef]);

  if (!mounted) return null;

  return createPortal(
    <motion.div
      className="fixed left-1/2 pointer-events-none"
      style={{
        width: `${globeSize}px`,
        height: `${globeSize}px`,
        top: globeTop,
        zIndex: -1,
        x: "-50%",
        y: globeY,
        scale: globeScale,
        transformOrigin: "center center",
        willChange: "transform",
      }}
    >
      {/* Video Globe */}
      <div
        className="w-full h-full flex items-center justify-center relative"
        style={{ background: "transparent" }}
      >
        {/* Past Video - always MP4 */}
        {SHOW_HERO_VIDEOS &&
          !hidePastVideo &&
            <motion.video
              ref={beeliaVideoRef}
              autoPlay
              onLoadedData={() => {
                if (isHeroVisible && beeliaVideoRef.current) {
                  beeliaVideoRef.current.play().catch(() => {});
                }
              }}
              loop
              muted
              playsInline
              controls={false}
              disablePictureInPicture
              disableRemotePlayback
              preload="auto"
              className="object-contain mr-0.5 absolute"
              style={{
                width: isMobile
                  ? `${PAST_VIDEO_SIZE_MOBILE}px`
                  : `${PAST_VIDEO_SIZE_DESKTOP}px`,
                height: isMobile
                  ? `${PAST_VIDEO_SIZE_MOBILE}px`
                  : `${PAST_VIDEO_SIZE_DESKTOP}px`,
                opacity: beeliaOpacity,
                willChange: "opacity",
                background: "transparent",
                pointerEvents: "none",
                WebkitAppearance: "none",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <source src="/videos/past.mp4" type="video/mp4" />
            </motion.video>
          }

        {/* Present Video - Phase 2 */}
        {SHOW_HERO_VIDEOS && (
          <motion.video
            ref={phase2VideoRef}
            loop
            muted
            playsInline
            controls={false}
            disablePictureInPicture
            disableRemotePlayback
            preload="auto"
            className={`${
              isMobile ? "w-[280px] h-[280px]" : "w-[420px] h-[420px]"
            } object-contain mr-0.5 absolute`}
            style={{
              opacity: presentVideoOpacity,
              willChange: "opacity",
              background: "transparent",
              pointerEvents: "none",
              WebkitAppearance: "none",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {useMp4Only ? (
              <source src="/videos/present.mp4" type="video/mp4" />
            ) : (
              <>
                <source src="/videos/present.webm" type="video/webm" />
                <source src="/videos/present.mp4" type="video/mp4" />
              </>
            )}
          </motion.video>
        )}

        {/* Future Transition Video - Always rendered for preloading, hidden until scroll */}
        {SHOW_HERO_VIDEOS && (
          <motion.video
            ref={futureTransitionVideoRef}
            loop={false}
            muted
            playsInline
            controls={false}
            disablePictureInPicture
            disableRemotePlayback
            preload="auto"
            className="object-contain absolute"
            style={{
              width: isMobile
                ? `${FUTURE_GLOBE_SIZE_MOBILE}px`
                : `${FUTURE_GLOBE_SIZE_DESKTOP}px`,
              height: isMobile
                ? `${FUTURE_GLOBE_SIZE_MOBILE}px`
                : `${FUTURE_GLOBE_SIZE_DESKTOP}px`,
              opacity: futureTransitionCombinedOpacity,
              willChange: "opacity",
              marginLeft: "4px",
              background: "transparent",
              pointerEvents: "none",
              WebkitAppearance: "none",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {useMp4Only ? (
              <source src="/videos/future-transition.mp4" type="video/mp4" />
            ) : (
              <>
                <source src="/videos/future-transition.webm" type="video/webm" />
                <source src="/videos/future-transition.mp4" type="video/mp4" />
              </>
            )}
          </motion.video>
        )}

        {/* Future Main Video */}
        {SHOW_HERO_VIDEOS &&
          showFutureMain && (
            <motion.video
              ref={futureMainVideoRef}
              autoPlay
              loop
              muted
              playsInline
              controls={false}
              disablePictureInPicture
              disableRemotePlayback
              preload="auto"
              className="object-contain absolute"
              style={{
                width: isMobile
                  ? `${FUTURE_GLOBE_SIZE_MOBILE}px`
                  : `${FUTURE_GLOBE_SIZE_DESKTOP}px`,
                height: isMobile
                  ? `${FUTURE_GLOBE_SIZE_MOBILE}px`
                  : `${FUTURE_GLOBE_SIZE_DESKTOP}px`,
                opacity: futureMainVideoOpacity,
                willChange: "opacity",
                marginLeft: "4px",
                background: "transparent",
                pointerEvents: "none",
                WebkitAppearance: "none",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {useMp4Only ? (
                <source src="/videos/future-main.mp4" type="video/mp4" />
              ) : (
                <>
                  <source src="/videos/future-main.webm" type="video/webm" />
                  <source src="/videos/future-main.mp4" type="video/mp4" />
                </>
              )}
            </motion.video>
          )}
      </div>
    </motion.div>,
    document.body
  );
}
