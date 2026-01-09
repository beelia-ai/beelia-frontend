"use client";

import React, { RefObject, useState, useEffect } from "react";
import { motion, MotionValue } from "framer-motion";
import { WebGLVideo } from "@/components/ui";
import {
  SHOW_HERO_VIDEOS,
  FUTURE_GLOBE_SIZE_MOBILE,
  FUTURE_GLOBE_SIZE_DESKTOP,
  PAST_VIDEO_SIZE_MOBILE,
  PAST_VIDEO_SIZE_DESKTOP,
} from "@/lib/constants";

// Safari detection - Safari doesn't support WebM with alpha
function isSafari(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent;
  return /Safari/.test(ua) && !/Chrome/.test(ua) && !/Chromium/.test(ua);
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
  // Detect Safari at runtime - Safari needs WebGLVideo for alpha transparency
  const [needsWebGLVideo, setNeedsWebGLVideo] = useState(false);
  
  useEffect(() => {
    setNeedsWebGLVideo(isSafari());
  }, []);

  // Use WebGLVideo for mobile OR Safari (Safari doesn't support WebM with alpha)
  const useWebGLVideo = isMobile || needsWebGLVideo;

  return (
    <motion.div
      className="fixed left-1/2 pointer-events-none"
      style={{
        width: `${globeSize}px`,
        height: `${globeSize}px`,
        top: globeTop,
        zIndex: 51,
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
        {/* Past Video */}
        {SHOW_HERO_VIDEOS &&
          !hidePastVideo &&
          (useWebGLVideo ? (
            <motion.div
              className="mr-0.5 absolute"
              style={{
                width: isMobile
                  ? `${PAST_VIDEO_SIZE_MOBILE}px`
                  : `${PAST_VIDEO_SIZE_DESKTOP}px`,
                height: isMobile
                  ? `${PAST_VIDEO_SIZE_MOBILE}px`
                  : `${PAST_VIDEO_SIZE_DESKTOP}px`,
                opacity: beeliaOpacity,
                willChange: "opacity",
              }}
            >
              <WebGLVideo
                webmSrc="/videos/past.webm"
                stackedAlphaSrc="/videos/past-stacked.mp4"
                className="w-full h-full object-contain"
                autoPlay={isHeroVisible}
                loop
                muted
                preload="auto"
              />
            </motion.div>
          ) : (
            <motion.video
              ref={beeliaVideoRef}
              autoPlay={isHeroVisible}
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
              <source src="/videos/past.webm" type="video/webm" />
            </motion.video>
          ))}

        {/* Present Video - Phase 2 */}
        {SHOW_HERO_VIDEOS && useWebGLVideo ? (
          <motion.div
            className={`${
              isMobile ? "w-[280px] h-[280px]" : "w-[420px] h-[420px]"
            } mr-0.5 absolute`}
            style={{
              opacity: presentVideoOpacity,
              willChange: "opacity",
            }}
          >
            <WebGLVideo
              webmSrc="/videos/present.webm"
              stackedAlphaSrc="/videos/present-stacked.mp4"
              className="w-full h-full object-contain"
              autoPlay={isHeroVisible}
              loop
              muted
              preload="auto"
            />
          </motion.div>
        ) : SHOW_HERO_VIDEOS ? (
          <motion.video
            ref={phase2VideoRef}
            loop
            muted
            playsInline
            webkit-playsinline="true"
            x-webkit-airplay="deny"
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
            <source src="/videos/present.webm" type="video/webm" />
          </motion.video>
        ) : null}

        {/* Future Transition Video - Always rendered for preloading, hidden until scroll */}
        {SHOW_HERO_VIDEOS && useWebGLVideo ? (
          <motion.div
            className="absolute"
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
            }}
          >
            <WebGLVideo
              webmSrc="/videos/future-transition.webm"
              stackedAlphaSrc="/videos/future-transition-stacked.mp4"
              className="w-full h-full object-contain"
              autoPlay={isHeroVisible}
              loop={false}
              muted
              videoRef={futureTransitionVideoRef}
              preload="auto"
            />
          </motion.div>
        ) : SHOW_HERO_VIDEOS ? (
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
            <source
              src="/videos/future-transition.webm"
              type="video/webm"
            />
          </motion.video>
        ) : null}

        {/* Future Main Video */}
        {SHOW_HERO_VIDEOS &&
          showFutureMain &&
          (useWebGLVideo ? (
            <motion.div
              className="absolute"
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
              }}
            >
              <WebGLVideo
                webmSrc="/videos/future-main.webm"
                stackedAlphaSrc="/videos/future-main-stacked.mp4"
                className="w-full h-full object-contain"
                autoPlay
                loop
                muted
                preload="auto"
              />
            </motion.div>
          ) : (
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
              <source src="/videos/future-main.webm" type="video/webm" />
            </motion.video>
          ))}
      </div>
    </motion.div>
  );
}

