"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { createWebGLRenderer, disposeRenderer } from "@/lib/webgl-context";

interface WebGLVideoProps {
  /** WebM source for browsers that support alpha (Chrome, Firefox) */
  webmSrc: string;
  /** MP4/MOV source with stacked alpha (top: color, bottom: alpha) for iOS fallback */
  stackedAlphaSrc?: string;
  /** HEVC with alpha (.mov) for iOS - best quality if available */
  hevcAlphaSrc?: string;
  className?: string;
  style?: React.CSSProperties;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  /** Optional ref to access the internal video element */
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  /** Preload behavior for the video */
  preload?: "auto" | "none" | "metadata";
}

// Three.js vertex shader - simple passthrough
const vertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader for stacked alpha (top half = color, bottom half = alpha)
const fragmentShaderStackedAlpha = `
  precision mediump float;
  varying vec2 vUv;
  uniform sampler2D uVideo;
  
  void main() {
    // Sample color from top half
    vec2 colorCoord = vec2(vUv.x, vUv.y * 0.5);
    vec4 color = texture2D(uVideo, colorCoord);
    
    // Sample alpha from bottom half (use red channel as alpha)
    vec2 alphaCoord = vec2(vUv.x, 0.5 + vUv.y * 0.5);
    float alpha = texture2D(uVideo, alphaCoord).r;
    
    gl_FragColor = vec4(color.rgb, alpha);
  }
`;

// Fragment shader for regular video (passthrough)
const fragmentShaderRegular = `
  precision mediump float;
  varying vec2 vUv;
  uniform sampler2D uVideo;
  
  void main() {
    gl_FragColor = texture2D(uVideo, vUv);
  }
`;

function isIOS(): boolean {
  if (typeof window === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function supportsWebMAlpha(): boolean {
  if (typeof document === "undefined") return true;
  const video = document.createElement("video");
  // Check for VP9 with alpha support
  return video.canPlayType('video/webm; codecs="vp9"') === "probably";
}

export function WebGLVideo({
  webmSrc,
  stackedAlphaSrc,
  hevcAlphaSrc,
  className = "",
  style = {},
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  videoRef: externalVideoRef,
  preload = "auto",
}: WebGLVideoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const internalVideoRef = useRef<HTMLVideoElement>(null);
  // Use external ref if provided, otherwise use internal ref
  const videoRef = externalVideoRef || internalVideoRef;
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const videoTextureRef = useRef<THREE.VideoTexture | null>(null);
  const rafRef = useRef<number>(0);
  const [useStackedAlpha, setUseStackedAlpha] = useState(false);
  const [useNativeVideo, setUseNativeVideo] = useState(false);
  const [videoSrc, setVideoSrc] = useState(webmSrc);
  const [userInteracted, setUserInteracted] = useState(false);

  // Handle user interaction to enable video playback on mobile browsers (iOS and Android)
  useEffect(() => {
    const handleUserInteraction = () => {
      setUserInteracted(true);
    };

    // Listen for first user interaction (needed for iOS and some Android browsers)
    document.addEventListener("touchstart", handleUserInteraction, { once: true });
    document.addEventListener("click", handleUserInteraction, { once: true });
    document.addEventListener("scroll", handleUserInteraction, { once: true, passive: true });

    return () => {
      document.removeEventListener("touchstart", handleUserInteraction);
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("scroll", handleUserInteraction);
    };
  }, []);

  // Play videos when user interacts (mobile browser requirement)
  useEffect(() => {
    if (!userInteracted) return;

    const video = videoRef.current;
    if (video && autoPlay && video.paused && video.readyState >= 2) {
      video.play().catch((err) => {
        console.warn("Video play after interaction failed:", err);
      });
    }
  }, [userInteracted, autoPlay]);

  // Determine which source and method to use
  useEffect(() => {
    const ios = isIOS();
    const webmSupported = supportsWebMAlpha();

    if (ios) {
      // iOS: prefer HEVC alpha, fallback to stacked alpha via WebGL
      if (hevcAlphaSrc) {
        setVideoSrc(hevcAlphaSrc);
        setUseNativeVideo(true);
        setUseStackedAlpha(false);
      } else if (stackedAlphaSrc) {
        setVideoSrc(stackedAlphaSrc);
        setUseNativeVideo(false);
        setUseStackedAlpha(true);
      } else {
        // No iOS-compatible source, use webm anyway (won't have transparency)
        setVideoSrc(webmSrc);
        setUseNativeVideo(true);
        setUseStackedAlpha(false);
      }
    } else if (!webmSupported && stackedAlphaSrc) {
      // Browser doesn't support WebM alpha, use stacked alpha
      setVideoSrc(stackedAlphaSrc);
      setUseNativeVideo(false);
      setUseStackedAlpha(true);
    } else {
      // Modern browser with WebM alpha support - use native video
      setVideoSrc(webmSrc);
      setUseNativeVideo(true);
      setUseStackedAlpha(false);
    }
  }, [webmSrc, stackedAlphaSrc, hevcAlphaSrc]);

  // Initialize Three.js WebGL
  const initWebGL = useCallback(() => {
    if (!canvasRef.current || !videoRef.current || useNativeVideo) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    // Create Three.js renderer using shared utility
    const renderer = createWebGLRenderer(canvas);
    rendererRef.current = renderer;

    // Create scene and camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    cameraRef.current = camera;

    // Create video texture
    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBAFormat;
    videoTextureRef.current = videoTexture;

    // Create shader material
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: useStackedAlpha ? fragmentShaderStackedAlpha : fragmentShaderRegular,
      uniforms: {
        uVideo: { value: videoTexture },
      },
      transparent: true,
      depthWrite: false,
    });
    materialRef.current = material;

    // Create full-screen quad
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    meshRef.current = mesh;
    scene.add(mesh);
  }, [useStackedAlpha, useNativeVideo]);

  // Render loop
  const render = useCallback(() => {
    const renderer = rendererRef.current;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const videoTexture = videoTextureRef.current;

    if (!renderer || !video || !canvas || !scene || !camera) {
      rafRef.current = requestAnimationFrame(render);
      return;
    }

    // Wait for video to have dimensions
    if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
      rafRef.current = requestAnimationFrame(render);
      return;
    }

    // Update canvas size to match video
    const displayWidth = video.videoWidth;
    // For stacked alpha, the display height is half the video height
    const displayHeight = useStackedAlpha
      ? video.videoHeight / 2
      : video.videoHeight;

    if (displayWidth > 0 && displayHeight > 0) {
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        renderer.setSize(displayWidth, displayHeight);
      }
    } else {
      rafRef.current = requestAnimationFrame(render);
      return;
    }

    // Update video texture if needed
    if (videoTexture && video.readyState >= 2) {
      videoTexture.needsUpdate = true;
    }

    // Render scene
    renderer.render(scene, camera);

    rafRef.current = requestAnimationFrame(render);
  }, [useStackedAlpha]);

  // Start rendering when video is ready
  useEffect(() => {
    if (useNativeVideo) return;

    const video = videoRef.current;
    if (!video) return;

    const isMobileDevice = typeof window !== "undefined" && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const handleCanPlay = () => {
      initWebGL();
      rafRef.current = requestAnimationFrame(render);
      
      // Explicitly play video (after user interaction on mobile browsers)
      if (autoPlay && video.paused && (!isMobileDevice || userInteracted)) {
        video.play().catch((err) => {
          console.warn("Video autoplay failed:", err);
        });
      }
    };

    const handleLoadedData = () => {
      // Try to play when data is loaded (after user interaction on mobile browsers)
      if (autoPlay && video.paused && (!isMobileDevice || userInteracted)) {
        video.play().catch((err) => {
          console.warn("Video autoplay failed:", err);
        });
      }
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("loadeddata", handleLoadedData);

    // Try to play immediately if video is already ready
    if (video.readyState >= 2) {
      handleCanPlay();
    }

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("loadeddata", handleLoadedData);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      // Cleanup Three.js resources
      if (videoTextureRef.current) {
        videoTextureRef.current.dispose();
        videoTextureRef.current = null;
      }

      if (materialRef.current) {
        materialRef.current.dispose();
        materialRef.current = null;
      }

      if (meshRef.current) {
        if (meshRef.current.geometry) {
          meshRef.current.geometry.dispose();
        }
        if (sceneRef.current) {
          sceneRef.current.remove(meshRef.current);
        }
        meshRef.current = null;
      }

      disposeRenderer(rendererRef.current);
      rendererRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
    };
  }, [initWebGL, render, useNativeVideo, autoPlay, userInteracted]);

  // Handle video playback for native video (iOS)
  useEffect(() => {
    if (!useNativeVideo || !videoRef.current) return;

    const video = videoRef.current;

    const isMobileDevice = typeof window !== "undefined" && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const handleLoadedData = () => {
      if (autoPlay && video.paused && (!isMobileDevice || userInteracted)) {
        video.play().catch((err) => {
          console.warn("Video autoplay failed:", err);
        });
      }
    };

    const handleCanPlay = () => {
      if (autoPlay && video.paused && (!isMobileDevice || userInteracted)) {
        video.play().catch((err) => {
          console.warn("Video autoplay failed:", err);
        });
      }
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("canplay", handleCanPlay);

    // Try to play if already loaded (after user interaction on mobile browsers)
    if (video.readyState >= 2 && autoPlay && video.paused) {
      if (!isMobileDevice || userInteracted) {
        video.play().catch((err) => {
          console.warn("Video autoplay failed:", err);
        });
      }
    }

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, [useNativeVideo, autoPlay, videoSrc, userInteracted]);

  // Native video fallback (for HEVC alpha or when WebGL not needed)
  if (useNativeVideo) {
    return (
      <video
        ref={videoRef}
        src={videoSrc}
        className={className}
        style={style}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        preload={preload}
      />
    );
  }

  // WebGL canvas with hidden video source
  return (
    <div 
      className={className} 
      style={{ 
        position: "relative", 
        width: "100%",
        minHeight: style?.minHeight || "200px",
        ...style 
      }}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        preload={preload}
        style={{
          position: "absolute",
          opacity: 0,
          pointerEvents: "none",
          width: 0,
          height: 0,
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "auto",
          minHeight: style?.minHeight || "200px",
          display: "block",
          objectFit: style?.objectFit || "contain",
          backgroundColor: "transparent",
          ...(style?.objectPosition && { objectPosition: style.objectPosition }),
        }}
      />
    </div>
  );
}

export default WebGLVideo;

