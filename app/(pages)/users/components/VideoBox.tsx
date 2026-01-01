"use client";

import React from "react";
import { WebGLVideo } from "@/components/ui";

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

  // Always use WebGLVideo with stacked alpha to get proper transparency on black background
  return (
    <div className="box-video-float pointer-events-none" style={containerStyle}>
      <WebGLVideo
        webmSrc={src}
        stackedAlphaSrc={stackedSrc}
        className="w-full h-full"
        autoPlay={isHeroVisible && traceLinesScrollProgress < 0.9}
        loop
        muted
      />
    </div>
  );
}

export default VideoBox;
