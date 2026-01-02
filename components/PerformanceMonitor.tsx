"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface PerformanceMetrics {
  fps: number;
  memory: {
    used: number;
    total: number;
    limit: number;
  } | null;
  domNodes: number;
  gpuRenderer: string;
  frameTime: number;
  cpuEstimate: number; // Estimated based on frame timing
  scrollPosition: { x: number; y: number };
}

export function PerformanceMonitor() {
  const [isLocalhost, setIsLocalhost] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memory: null,
    domNodes: 0,
    gpuRenderer: "Unknown",
    frameTime: 0,
    cpuEstimate: 0,
    scrollPosition: { x: 0, y: 0 },
  });
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if we're on localhost
  useEffect(() => {
    setIsLocalhost(window.location.hostname === "localhost");
  }, []);

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const frameTimesRef = useRef<number[]>([]);
  const rafIdRef = useRef<number | undefined>(undefined);

  // Get GPU info via WebGL
  const getGPUInfo = useCallback(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (gl && gl instanceof WebGLRenderingContext) {
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          return renderer || "WebGL Supported";
        }
        return "WebGL (no debug info)";
      }
      return "No WebGL";
    } catch {
      return "Unavailable";
    }
  }, []);

  // Get memory info (Chrome only)
  const getMemoryInfo = useCallback(() => {
    const perf = performance as Performance & {
      memory?: {
        usedJSHeapSize: number;
        totalJSHeapSize: number;
        jsHeapSizeLimit: number;
      };
    };

    if (perf.memory) {
      return {
        used: perf.memory.usedJSHeapSize,
        total: perf.memory.totalJSHeapSize,
        limit: perf.memory.jsHeapSizeLimit,
      };
    }
    return null;
  }, []);

  useEffect(() => {
    // Only run performance monitoring on localhost
    if (!isLocalhost) return;

    // Get GPU info once
    const gpuRenderer = getGPUInfo();
    setMetrics((prev) => ({ ...prev, gpuRenderer }));

    let lastFrameTime = performance.now();

    const measureFrame = () => {
      const now = performance.now();
      const delta = now - lastFrameTime;
      lastFrameTime = now;

      frameCountRef.current++;
      frameTimesRef.current.push(delta);

      // Keep last 60 frame times for averaging
      if (frameTimesRef.current.length > 60) {
        frameTimesRef.current.shift();
      }

      // Update metrics every 500ms
      if (now - lastTimeRef.current >= 500) {
        const elapsed = now - lastTimeRef.current;
        const fps = Math.round((frameCountRef.current * 1000) / elapsed);

        // Calculate average frame time
        const avgFrameTime =
          frameTimesRef.current.reduce((a, b) => a + b, 0) /
          frameTimesRef.current.length;

        // Estimate CPU stress: 16.67ms = 60fps target
        // Higher frame times indicate higher CPU usage
        const targetFrameTime = 16.67;
        const cpuEstimate = Math.min(
          100,
          Math.round((avgFrameTime / targetFrameTime) * 50)
        );

        setMetrics((prev) => ({
          ...prev,
          fps,
          memory: getMemoryInfo(),
          domNodes: document.querySelectorAll("*").length,
          frameTime: Math.round(avgFrameTime * 100) / 100,
          cpuEstimate,
        }));

        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      rafIdRef.current = requestAnimationFrame(measureFrame);
    };

    rafIdRef.current = requestAnimationFrame(measureFrame);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isLocalhost, getGPUInfo, getMemoryInfo]);

  // Track scroll position
  useEffect(() => {
    // Only run performance monitoring on localhost
    if (!isLocalhost) return;

    const updateScrollPosition = () => {
      setMetrics((prev) => ({
        ...prev,
        scrollPosition: {
          x: Math.round(window.scrollX),
          y: Math.round(window.scrollY),
        },
      }));
    };

    // Set initial position
    updateScrollPosition();

    // Add scroll event listener
    window.addEventListener("scroll", updateScrollPosition);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", updateScrollPosition);
    };
  }, [isLocalhost]);

  const formatBytes = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)}MB`;
  };

  const getFPSColor = (fps: number) => {
    if (fps >= 55) return "#4ade80"; // green
    if (fps >= 30) return "#fbbf24"; // yellow
    return "#ef4444"; // red
  };

  const getCPUColor = (estimate: number) => {
    if (estimate <= 40) return "#4ade80"; // green
    if (estimate <= 70) return "#fbbf24"; // yellow
    return "#ef4444"; // red
  };

  // Don't render if not on localhost
  if (!isLocalhost) {
    return null;
  }

  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        fontSize: "10px",
        zIndex: 1000001,
        color: "#ffffff",
        fontFamily: "monospace",
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        padding: "6px 10px",
        borderRadius: "6px",
        cursor: "pointer",
        backdropFilter: "blur(4px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        userSelect: "none",
        minWidth: isExpanded ? "200px" : "auto",
        transition: "all 0.2s ease",
      }}
    >
      {/* Compact View */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span style={{ color: getFPSColor(metrics.fps) }}>
          {metrics.fps} FPS
        </span>
        <span style={{ color: "rgba(255,255,255,0.4)" }}>|</span>
        <span style={{ color: getCPUColor(metrics.cpuEstimate) }}>
          ~{metrics.cpuEstimate}% CPU
        </span>
        <span
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "8px",
          }}
        >
          {isExpanded ? "▲" : "▼"}
        </span>
      </div>

      {/* Expanded View */}
      {isExpanded && (
        <div
          style={{
            marginTop: "8px",
            paddingTop: "8px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <div
            style={{ display: "flex", justifyContent: "space-between", gap: 8 }}
          >
            <span style={{ color: "rgba(255,255,255,0.6)" }}>Frame Time:</span>
            <span>{metrics.frameTime}ms</span>
          </div>

          {metrics.memory && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <span style={{ color: "rgba(255,255,255,0.6)" }}>JS Memory:</span>
              <span>
                {formatBytes(metrics.memory.used)} /{" "}
                {formatBytes(metrics.memory.total)}
              </span>
            </div>
          )}

          <div
            style={{ display: "flex", justifyContent: "space-between", gap: 8 }}
          >
            <span style={{ color: "rgba(255,255,255,0.6)" }}>DOM Nodes:</span>
            <span>{metrics.domNodes.toLocaleString()}</span>
          </div>

          <div
            style={{ display: "flex", justifyContent: "space-between", gap: 8 }}
          >
            <span style={{ color: "rgba(255,255,255,0.6)" }}>Scroll:</span>
            <span>
              X: {metrics.scrollPosition.x} | Y: {metrics.scrollPosition.y}
            </span>
          </div>

          <div style={{ marginTop: "4px" }}>
            <span style={{ color: "rgba(255,255,255,0.6)" }}>GPU:</span>
            <div
              style={{
                fontSize: "8px",
                color: "rgba(255,255,255,0.8)",
                marginTop: "2px",
                wordBreak: "break-word",
              }}
            >
              {metrics.gpuRenderer}
            </div>
          </div>

          <div
            style={{
              marginTop: "6px",
              fontSize: "8px",
              color: "rgba(255,255,255,0.4)",
              textAlign: "center",
            }}
          >
            * CPU estimate based on frame timing
          </div>
        </div>
      )}
    </div>
  );
}

