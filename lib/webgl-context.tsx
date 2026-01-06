"use client";

/**
 * Shared WebGL Renderer Manager
 *
 * While we can't truly share WebGL contexts between different canvases,
 * we can optimize by:
 * 1. Using Three.js consistently across all components (instead of mixing OGL, native WebGL, Three.js)
 * 2. Providing a utility to get renderer instances with consistent settings
 * 3. Ensuring proper cleanup to avoid context leaks
 */

import * as THREE from "three";

/**
 * Creates a Three.js WebGL renderer with optimized settings
 * All components should use this function to ensure consistent configuration
 */
export function createWebGLRenderer(
  canvas: HTMLCanvasElement
): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
    preserveDrawingBuffer: false,
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  return renderer;
}

/**
 * Helper to properly dispose of a renderer and its resources
 */
export function disposeRenderer(renderer: THREE.WebGLRenderer | null) {
  if (!renderer) return;

  renderer.dispose();

  const canvas = renderer.domElement;
  if (canvas && canvas.parentNode) {
    canvas.parentNode.removeChild(canvas);
  }
}
