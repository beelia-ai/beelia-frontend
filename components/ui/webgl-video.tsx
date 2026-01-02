"use client";

import { useEffect, useRef, useState, useCallback } from "react";

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
}

// Vertex shader - simple passthrough
const vertexShaderSource = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`;

// Fragment shader for stacked alpha (top half = color, bottom half = alpha)
const fragmentShaderStackedAlpha = `
  precision mediump float;
  varying vec2 v_texCoord;
  uniform sampler2D u_video;
  
  void main() {
    // Sample color from top half
    vec2 colorCoord = vec2(v_texCoord.x, v_texCoord.y * 0.5);
    vec4 color = texture2D(u_video, colorCoord);
    
    // Sample alpha from bottom half (use red channel as alpha)
    vec2 alphaCoord = vec2(v_texCoord.x, 0.5 + v_texCoord.y * 0.5);
    float alpha = texture2D(u_video, alphaCoord).r;
    
    gl_FragColor = vec4(color.rgb, alpha);
  }
`;

// Fragment shader for regular video (passthrough)
const fragmentShaderRegular = `
  precision mediump float;
  varying vec2 v_texCoord;
  uniform sampler2D u_video;
  
  void main() {
    gl_FragColor = texture2D(u_video, v_texCoord);
  }
`;

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

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
}: WebGLVideoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const internalVideoRef = useRef<HTMLVideoElement>(null);
  // Use external ref if provided, otherwise use internal ref
  const videoRef = externalVideoRef || internalVideoRef;
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const textureRef = useRef<WebGLTexture | null>(null);
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

  // Initialize WebGL
  const initWebGL = useCallback(() => {
    if (!canvasRef.current || !videoRef.current || useNativeVideo) return;

    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
    });

    if (!gl) {
      console.error("WebGL not supported");
      setUseNativeVideo(true);
      return;
    }

    glRef.current = gl;

    // Create shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      useStackedAlpha ? fragmentShaderStackedAlpha : fragmentShaderRegular
    );

    if (!vertexShader || !fragmentShader) return;

    // Create program
    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;

    programRef.current = program;
    gl.useProgram(program);

    // Set up geometry (full-screen quad)
    const positions = new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]);

    const texCoords = new Float32Array([0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0]);

    // Position buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // TexCoord buffer
    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);

    const texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    // Create texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    textureRef.current = texture;

    // Enable alpha blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }, [useStackedAlpha, useNativeVideo]);

  // Render loop
  const render = useCallback(() => {
    const gl = glRef.current;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!gl || !video || !canvas || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(render);
      return;
    }

    // Update canvas size to match video
    const displayWidth = video.videoWidth;
    // For stacked alpha, the display height is half the video height
    const displayHeight = useStackedAlpha
      ? video.videoHeight / 2
      : video.videoHeight;

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      gl.viewport(0, 0, displayWidth, displayHeight);
    }

    // Update texture with video frame
    gl.bindTexture(gl.TEXTURE_2D, textureRef.current);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);

    // Clear and draw
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

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
        preload="auto"
      />
    );
  }

  // WebGL canvas with hidden video source
  return (
    <div className={className} style={{ position: "relative", ...style }}>
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        preload="auto"
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
          height: "100%",
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

