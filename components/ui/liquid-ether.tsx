"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export interface LiquidEtherProps {
  mouseForce?: number;
  cursorSize?: number;
  isViscous?: boolean;
  viscous?: number;
  iterationsViscous?: number;
  iterationsPoisson?: number;
  dt?: number;
  BFECC?: boolean;
  resolution?: number;
  isBounce?: boolean;
  colors?: string[];
  style?: React.CSSProperties;
  className?: string;
  autoDemo?: boolean;
  autoSpeed?: number;
  autoIntensity?: number;
  takeoverDuration?: number;
  autoResumeDelay?: number;
  autoRampDuration?: number;
}

interface SimOptions {
  iterations_poisson: number;
  iterations_viscous: number;
  mouse_force: number;
  resolution: number;
  cursor_size: number;
  viscous: number;
  isBounce: boolean;
  dt: number;
  isViscous: boolean;
  BFECC: boolean;
}

const defaultColors = ['#FFD700', '#FFE55C', '#FFD700'];

// Check if device is low-powered
function isLowPowerDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check for mobile/tablet
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  
  // Check hardware concurrency (CPU cores)
  const lowCores = navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 4 : false;
  
  // Check device memory if available
  const navWithMemory = navigator as Navigator & { deviceMemory?: number };
  const lowMemory = navWithMemory.deviceMemory ? navWithMemory.deviceMemory <= 4 : false;
  
  return isMobile || lowCores || lowMemory;
}

// Simplified CSS-based fallback for very low-end devices
function SimpleFallback({ colors, className, style }: { colors: string[]; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`w-full h-full relative overflow-hidden ${className || ''}`}
      style={style}
    >
      <div
        className="absolute inset-0 animate-pulse"
        style={{
          background: `radial-gradient(ellipse at 30% 40%, ${colors[0]}22 0%, transparent 50%),
                       radial-gradient(ellipse at 70% 60%, ${colors[1] || colors[0]}22 0%, transparent 50%)`,
          animation: 'pulse 4s ease-in-out infinite',
        }}
      />
    </div>
  );
}

export default function LiquidEther({
  mouseForce = 10,
  cursorSize = 50,
  isViscous = false,
  viscous = 30,
  iterationsViscous = 8,
  iterationsPoisson = 8,
  dt = 0.014,
  BFECC = true,
  resolution = 0.25,
  isBounce = false,
  colors = defaultColors,
  style = {},
  className = '',
  autoDemo = true,
  autoSpeed = 0.5,
  autoIntensity = 2,
  takeoverDuration = 0.25,
  autoResumeDelay = 1000,
  autoRampDuration = 0.6
}: LiquidEtherProps): React.ReactElement {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const webglRef = useRef<unknown>(null);
  const rafRef = useRef<number | null>(null);
  const isVisibleRef = useRef<boolean>(true);
  const lastFrameTimeRef = useRef<number>(0);
  const [useFallback, setUseFallback] = useState(false);

  // Check for WebGL support and device capability
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl || isLowPowerDevice()) {
      setUseFallback(true);
    }
  }, []);

  useEffect(() => {
    if (useFallback || !mountRef.current) return;

    // Target 30fps instead of 60fps for better performance
    const targetFPS = 30;
    const frameInterval = 1000 / targetFPS;

    function makePaletteTexture(stops: string[]): THREE.DataTexture {
      let arr: string[];
      if (Array.isArray(stops) && stops.length > 0) {
        arr = stops.length === 1 ? [stops[0], stops[0]] : stops;
      } else {
        arr = ['#ffffff', '#ffffff'];
      }
      const w = arr.length;
      const data = new Uint8Array(w * 4);
      for (let i = 0; i < w; i++) {
        const c = new THREE.Color(arr[i]);
        data[i * 4 + 0] = Math.round(c.r * 255);
        data[i * 4 + 1] = Math.round(c.g * 255);
        data[i * 4 + 2] = Math.round(c.b * 255);
        data[i * 4 + 3] = 255;
      }
      const tex = new THREE.DataTexture(data, w, 1, THREE.RGBAFormat);
      tex.magFilter = THREE.LinearFilter;
      tex.minFilter = THREE.LinearFilter;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.generateMipmaps = false;
      tex.needsUpdate = true;
      return tex;
    }

    const paletteTex = makePaletteTexture(colors);
    const bgVec4 = new THREE.Vector4(0, 0, 0, 0);

    // Optimized simulation options - cap values for performance
    const simOptions: SimOptions = {
      iterations_poisson: Math.min(iterationsPoisson, 12),
      iterations_viscous: Math.min(iterationsViscous, 12),
      mouse_force: mouseForce,
      resolution: Math.min(resolution, 0.35),
      cursor_size: cursorSize,
      viscous: viscous,
      isBounce: isBounce,
      dt: dt,
      isViscous: isViscous,
      BFECC: BFECC,
    };

    class CommonClass {
      width = 0;
      height = 0;
      aspect = 1;
      pixelRatio = 1;
      fboWidth: number | null = null;
      fboHeight: number | null = null;
      time = 0;
      delta = 0;
      container: HTMLElement | null = null;
      renderer: THREE.WebGLRenderer | null = null;
      clock: THREE.Clock | null = null;

      init(container: HTMLElement) {
        this.container = container;
        // Cap pixel ratio at 1.5 for performance
        this.pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
        this.resize();
        this.renderer = new THREE.WebGLRenderer({ 
          antialias: false, // Disable antialiasing for performance
          alpha: true,
          powerPreference: 'low-power' // Request low-power GPU
        });
        this.renderer.autoClear = false;
        this.renderer.setClearColor(new THREE.Color(0x000000), 0);
        this.renderer.setPixelRatio(this.pixelRatio);
        this.renderer.setSize(this.width, this.height);
        const el = this.renderer.domElement;
        el.style.width = '100%';
        el.style.height = '100%';
        el.style.display = 'block';
        this.clock = new THREE.Clock();
        this.clock.start();
      }

      resize() {
        if (!this.container) return;
        const rect = this.container.getBoundingClientRect();
        this.width = Math.max(1, Math.floor(rect.width));
        this.height = Math.max(1, Math.floor(rect.height));
        this.aspect = this.width / this.height;
        if (this.renderer) this.renderer.setSize(this.width, this.height, false);
      }

      update() {
        if (!this.clock) return;
        this.delta = this.clock.getDelta();
        this.time += this.delta;
      }
    }

    const Common = new CommonClass();

    class MouseClass {
      mouseMoved = false;
      coords = new THREE.Vector2();
      coords_old = new THREE.Vector2();
      diff = new THREE.Vector2();
      timer: number | null = null;
      container: HTMLElement | null = null;
      isHoverInside = false;
      hasUserControl = false;
      isAutoActive = false;
      autoIntensity = 2.0;
      takeoverActive = false;
      takeoverStartTime = 0;
      takeoverDuration = 0.25;
      takeoverFrom = new THREE.Vector2();
      takeoverTo = new THREE.Vector2();
      onInteract: (() => void) | null = null;
      private boundHandlers: { type: string; handler: EventListener; target: EventTarget }[] = [];

      init(container: HTMLElement) {
        this.container = container;
        const win = window;
        
        const onMouseMove = ((event: MouseEvent) => {
          if (!this.isPointInside(event.clientX, event.clientY)) return;
          this.isHoverInside = true;
          if (this.onInteract) this.onInteract();
          if (this.isAutoActive && !this.hasUserControl && !this.takeoverActive) {
            const rect = this.container!.getBoundingClientRect();
            const nx = (event.clientX - rect.left) / rect.width;
            const ny = (event.clientY - rect.top) / rect.height;
            this.takeoverFrom.copy(this.coords);
            this.takeoverTo.set(nx * 2 - 1, -(ny * 2 - 1));
            this.takeoverStartTime = performance.now();
            this.takeoverActive = true;
            this.hasUserControl = true;
            this.isAutoActive = false;
            return;
          }
          this.setCoords(event.clientX, event.clientY);
          this.hasUserControl = true;
        }) as EventListener;

        const onTouchMove = ((event: TouchEvent) => {
          if (event.touches.length !== 1) return;
          const t = event.touches[0];
          if (!this.isPointInside(t.clientX, t.clientY)) return;
          this.isHoverInside = true;
          if (this.onInteract) this.onInteract();
          this.setCoords(t.clientX, t.clientY);
          this.hasUserControl = true;
        }) as EventListener;

        const onLeave = (() => { this.isHoverInside = false; }) as EventListener;

        // Use passive listeners for better scroll performance
        win.addEventListener('mousemove', onMouseMove, { passive: true });
        win.addEventListener('touchmove', onTouchMove, { passive: true });
        win.addEventListener('touchend', onLeave, { passive: true });
        document.addEventListener('mouseleave', onLeave, { passive: true });
        
        this.boundHandlers = [
          { type: 'mousemove', handler: onMouseMove, target: win },
          { type: 'touchmove', handler: onTouchMove, target: win },
          { type: 'touchend', handler: onLeave, target: win },
          { type: 'mouseleave', handler: onLeave, target: document },
        ];
      }

      dispose() {
        this.boundHandlers.forEach(({ type, handler, target }) => {
          target.removeEventListener(type, handler);
        });
        this.boundHandlers = [];
      }

      private isPointInside(clientX: number, clientY: number) {
        if (!this.container) return false;
        const rect = this.container.getBoundingClientRect();
        return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
      }

      setCoords(x: number, y: number) {
        if (!this.container) return;
        if (this.timer) window.clearTimeout(this.timer);
        const rect = this.container.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const nx = (x - rect.left) / rect.width;
        const ny = (y - rect.top) / rect.height;
        this.coords.set(nx * 2 - 1, -(ny * 2 - 1));
        this.mouseMoved = true;
        this.timer = window.setTimeout(() => { this.mouseMoved = false; }, 100);
      }

      setNormalized(nx: number, ny: number) {
        this.coords.set(nx, ny);
        this.mouseMoved = true;
      }

      update() {
        if (this.takeoverActive) {
          const t = (performance.now() - this.takeoverStartTime) / (this.takeoverDuration * 1000);
          if (t >= 1) {
            this.takeoverActive = false;
            this.coords.copy(this.takeoverTo);
            this.coords_old.copy(this.coords);
            this.diff.set(0, 0);
          } else {
            const k = t * t * (3 - 2 * t);
            this.coords.copy(this.takeoverFrom).lerp(this.takeoverTo, k);
          }
        }
        this.diff.subVectors(this.coords, this.coords_old);
        this.coords_old.copy(this.coords);
        if (this.coords_old.x === 0 && this.coords_old.y === 0) this.diff.set(0, 0);
        if (this.isAutoActive && !this.takeoverActive) this.diff.multiplyScalar(this.autoIntensity);
      }
    }

    const Mouse = new MouseClass();

    class AutoDriver {
      mouse: MouseClass;
      enabled: boolean;
      speed: number;
      resumeDelay: number;
      rampDurationMs: number;
      active = false;
      current = new THREE.Vector2(0, 0);
      target = new THREE.Vector2();
      lastTime = performance.now();
      activationTime = 0;
      lastUserInteraction = performance.now();
      margin = 0.2;

      constructor(mouse: MouseClass, opts: { enabled: boolean; speed: number; resumeDelay: number; rampDuration: number }) {
        this.mouse = mouse;
        this.enabled = opts.enabled;
        this.speed = opts.speed;
        this.resumeDelay = opts.resumeDelay || 3000;
        this.rampDurationMs = (opts.rampDuration || 0) * 1000;
        this.pickNewTarget();
      }

      pickNewTarget() {
        const r = Math.random;
        this.target.set((r() * 2 - 1) * (1 - this.margin), (r() * 2 - 1) * (1 - this.margin));
      }

      forceStop() {
        this.active = false;
        this.mouse.isAutoActive = false;
      }

      update() {
        if (!this.enabled) return;
        const now = performance.now();
        const idle = now - this.lastUserInteraction;
        if (idle < this.resumeDelay) {
          if (this.active) this.forceStop();
          return;
        }
        if (this.mouse.isHoverInside) {
          if (this.active) this.forceStop();
          return;
        }
        if (!this.active) {
          this.active = true;
          this.current.copy(this.mouse.coords);
          this.lastTime = now;
          this.activationTime = now;
        }
        this.mouse.isAutoActive = true;
        let dtSec = (now - this.lastTime) / 1000;
        this.lastTime = now;
        if (dtSec > 0.2) dtSec = 0.016;
        const dir = new THREE.Vector2().subVectors(this.target, this.current);
        const dist = dir.length();
        if (dist < 0.01) {
          this.pickNewTarget();
          return;
        }
        dir.normalize();
        let ramp = 1;
        if (this.rampDurationMs > 0) {
          const t = Math.min(1, (now - this.activationTime) / this.rampDurationMs);
          ramp = t * t * (3 - 2 * t);
        }
        const step = this.speed * dtSec * ramp;
        const move = Math.min(step, dist);
        this.current.addScaledVector(dir, move);
        this.mouse.setNormalized(this.current.x, this.current.y);
      }
    }

    // Simplified shaders
    const face_vert = `
      attribute vec3 position;
      uniform vec2 px;
      uniform vec2 boundarySpace;
      varying vec2 uv;
      precision highp float;
      void main(){
        vec3 pos = position;
        vec2 scale = 1.0 - boundarySpace * 2.0;
        pos.xy = pos.xy * scale;
        uv = vec2(0.5)+(pos.xy)*0.5;
        gl_Position = vec4(pos, 1.0);
      }
    `;

    const mouse_vert = `
      precision highp float;
      attribute vec3 position;
      attribute vec2 uv;
      uniform vec2 center;
      uniform vec2 scale;
      uniform vec2 px;
      varying vec2 vUv;
      void main(){
        vec2 pos = position.xy * scale * 2.0 * px + center;
        vUv = uv;
        gl_Position = vec4(pos, 0.0, 1.0);
      }
    `;

    // Simplified advection without BFECC for better performance
    const advection_frag = `
      precision highp float;
      uniform sampler2D velocity;
      uniform float dt;
      uniform vec2 fboSize;
      uniform vec2 px;
      varying vec2 uv;
      void main(){
        vec2 ratio = max(fboSize.x, fboSize.y) / fboSize;
        vec2 vel = texture2D(velocity, uv).xy;
        vec2 uv2 = uv - vel * dt * ratio;
        vec2 newVel = texture2D(velocity, uv2).xy;
        gl_FragColor = vec4(newVel, 0.0, 0.0);
      }
    `;

    const color_frag = `
      precision highp float;
      uniform sampler2D velocity;
      uniform sampler2D palette;
      uniform vec4 bgColor;
      varying vec2 uv;
      void main(){
        vec2 vel = texture2D(velocity, uv).xy;
        float lenv = clamp(length(vel), 0.0, 1.0);
        vec3 c = texture2D(palette, vec2(lenv, 0.5)).rgb;
        vec3 outRGB = mix(bgColor.rgb, c, lenv);
        float outA = mix(bgColor.a, 1.0, lenv);
        gl_FragColor = vec4(outRGB, outA);
      }
    `;

    const divergence_frag = `
      precision highp float;
      uniform sampler2D velocity;
      uniform float dt;
      uniform vec2 px;
      varying vec2 uv;
      void main(){
        float x0 = texture2D(velocity, uv-vec2(px.x, 0.0)).x;
        float x1 = texture2D(velocity, uv+vec2(px.x, 0.0)).x;
        float y0 = texture2D(velocity, uv-vec2(0.0, px.y)).y;
        float y1 = texture2D(velocity, uv+vec2(0.0, px.y)).y;
        float divergence = (x1 - x0 + y1 - y0) / 2.0;
        gl_FragColor = vec4(divergence / dt);
      }
    `;

    const externalForce_frag = `
      precision highp float;
      uniform vec2 force;
      uniform vec2 center;
      uniform vec2 scale;
      uniform vec2 px;
      varying vec2 vUv;
      void main(){
        vec2 circle = (vUv - 0.5) * 2.0;
        float d = 1.0 - min(length(circle), 1.0);
        d *= d;
        gl_FragColor = vec4(force * d, 0.0, 1.0);
      }
    `;

    const poisson_frag = `
      precision highp float;
      uniform sampler2D pressure;
      uniform sampler2D divergence;
      uniform vec2 px;
      varying vec2 uv;
      void main(){
        float p0 = texture2D(pressure, uv + vec2(px.x * 2.0, 0.0)).r;
        float p1 = texture2D(pressure, uv - vec2(px.x * 2.0, 0.0)).r;
        float p2 = texture2D(pressure, uv + vec2(0.0, px.y * 2.0)).r;
        float p3 = texture2D(pressure, uv - vec2(0.0, px.y * 2.0)).r;
        float div = texture2D(divergence, uv).r;
        float newP = (p0 + p1 + p2 + p3) / 4.0 - div;
        gl_FragColor = vec4(newP);
      }
    `;

    const pressure_frag = `
      precision highp float;
      uniform sampler2D pressure;
      uniform sampler2D velocity;
      uniform vec2 px;
      uniform float dt;
      varying vec2 uv;
      void main(){
        float step = 1.0;
        float p0 = texture2D(pressure, uv + vec2(px.x * step, 0.0)).r;
        float p1 = texture2D(pressure, uv - vec2(px.x * step, 0.0)).r;
        float p2 = texture2D(pressure, uv + vec2(0.0, px.y * step)).r;
        float p3 = texture2D(pressure, uv - vec2(0.0, px.y * step)).r;
        vec2 v = texture2D(velocity, uv).xy;
        vec2 gradP = vec2(p0 - p1, p2 - p3) * 0.5;
        v = v - gradP * dt;
        gl_FragColor = vec4(v, 0.0, 1.0);
      }
    `;

    type Uniforms = Record<string, { value: unknown }>;

    class ShaderPass {
      props: {
        material?: { uniforms: Uniforms };
        output?: THREE.WebGLRenderTarget | null;
        output0?: THREE.WebGLRenderTarget | null;
        output1?: THREE.WebGLRenderTarget | null;
      };
      uniforms?: Uniforms;
      scene: THREE.Scene | null = null;
      camera: THREE.Camera | null = null;
      material: THREE.RawShaderMaterial | null = null;
      geometry: THREE.BufferGeometry | null = null;
      plane: THREE.Mesh | null = null;

      constructor(props: ShaderPass['props']) {
        this.props = props || {};
        this.uniforms = this.props.material?.uniforms;
      }

      init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.Camera();
        if (this.uniforms && this.props.material) {
          this.material = new THREE.RawShaderMaterial(this.props.material as THREE.ShaderMaterialParameters);
          this.geometry = new THREE.PlaneGeometry(2, 2);
          this.plane = new THREE.Mesh(this.geometry, this.material);
          this.scene.add(this.plane);
        }
      }

      update(_props?: unknown) {
        if (!Common.renderer || !this.scene || !this.camera) return;
        Common.renderer.setRenderTarget(this.props.output || null);
        Common.renderer.render(this.scene, this.camera);
        Common.renderer.setRenderTarget(null);
      }
    }

    class Advection extends ShaderPass {
      constructor(simProps: { cellScale: THREE.Vector2; fboSize: THREE.Vector2; dt: number; src: THREE.WebGLRenderTarget | null; dst: THREE.WebGLRenderTarget | null }) {
        super({
          material: {
            vertexShader: face_vert,
            fragmentShader: advection_frag,
            uniforms: {
              boundarySpace: { value: simProps.cellScale },
              px: { value: simProps.cellScale },
              fboSize: { value: simProps.fboSize },
              velocity: { value: simProps.src?.texture },
              dt: { value: simProps.dt },
            }
          } as unknown as { uniforms: Uniforms },
          output: simProps.dst
        });
        this.uniforms = (this.props.material as { uniforms: Uniforms })?.uniforms;
        this.init();
      }

      update(props: { dt?: number }) {
        if (!this.uniforms) return;
        if (typeof props.dt === 'number') this.uniforms.dt.value = props.dt;
        super.update();
      }
    }

    class ExternalForce extends ShaderPass {
      mouse!: THREE.Mesh;

      constructor(simProps: { cellScale: THREE.Vector2; cursor_size: number; dst: THREE.WebGLRenderTarget | null }) {
        super({ output: simProps.dst });
        this.initMouse(simProps);
      }

      initMouse(simProps: { cellScale: THREE.Vector2; cursor_size: number }) {
        super.init();
        const mouseG = new THREE.PlaneGeometry(1, 1);
        const mouseM = new THREE.RawShaderMaterial({
          vertexShader: mouse_vert,
          fragmentShader: externalForce_frag,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          uniforms: {
            px: { value: simProps.cellScale },
            force: { value: new THREE.Vector2(0, 0) },
            center: { value: new THREE.Vector2(0, 0) },
            scale: { value: new THREE.Vector2(simProps.cursor_size, simProps.cursor_size) }
          }
        });
        this.mouse = new THREE.Mesh(mouseG, mouseM);
        this.scene!.add(this.mouse);
      }

      update(props: { cursor_size?: number; mouse_force?: number; cellScale?: THREE.Vector2 }) {
        const forceX = (Mouse.diff.x / 2) * (props.mouse_force || 0);
        const forceY = (Mouse.diff.y / 2) * (props.mouse_force || 0);
        const cellScale = props.cellScale || new THREE.Vector2(1, 1);
        const cursorSize = props.cursor_size || 0;
        const cursorSizeX = cursorSize * cellScale.x;
        const cursorSizeY = cursorSize * cellScale.y;
        const centerX = Math.min(Math.max(Mouse.coords.x, -1 + cursorSizeX + cellScale.x * 2), 1 - cursorSizeX - cellScale.x * 2);
        const centerY = Math.min(Math.max(Mouse.coords.y, -1 + cursorSizeY + cellScale.y * 2), 1 - cursorSizeY - cellScale.y * 2);
        const uniforms = (this.mouse.material as THREE.RawShaderMaterial).uniforms;
        uniforms.force.value.set(forceX, forceY);
        uniforms.center.value.set(centerX, centerY);
        uniforms.scale.value.set(cursorSize, cursorSize);
        super.update();
      }
    }

    class Divergence extends ShaderPass {
      constructor(simProps: { cellScale: THREE.Vector2; boundarySpace: THREE.Vector2; src: THREE.WebGLRenderTarget | null; dst: THREE.WebGLRenderTarget | null; dt: number }) {
        super({
          material: {
            vertexShader: face_vert,
            fragmentShader: divergence_frag,
            uniforms: {
              boundarySpace: { value: simProps.boundarySpace },
              velocity: { value: simProps.src?.texture },
              px: { value: simProps.cellScale },
              dt: { value: simProps.dt }
            }
          } as unknown as { uniforms: Uniforms },
          output: simProps.dst
        });
        this.init();
      }

      update(props: { vel?: THREE.WebGLRenderTarget | null }) {
        if (this.uniforms && props.vel) {
          this.uniforms.velocity.value = props.vel.texture;
        }
        super.update();
      }
    }

    class Poisson extends ShaderPass {
      constructor(simProps: { cellScale: THREE.Vector2; boundarySpace: THREE.Vector2; src: THREE.WebGLRenderTarget | null; dst: THREE.WebGLRenderTarget | null; dst_: THREE.WebGLRenderTarget | null }) {
        super({
          material: {
            vertexShader: face_vert,
            fragmentShader: poisson_frag,
            uniforms: {
              boundarySpace: { value: simProps.boundarySpace },
              pressure: { value: simProps.dst_?.texture },
              divergence: { value: simProps.src?.texture },
              px: { value: simProps.cellScale }
            }
          } as unknown as { uniforms: Uniforms },
          output: simProps.dst,
          output0: simProps.dst_,
          output1: simProps.dst
        });
        this.init();
      }

      update(props: { iterations?: number }): THREE.WebGLRenderTarget | null {
        let p_in: THREE.WebGLRenderTarget | null | undefined;
        let p_out: THREE.WebGLRenderTarget | null | undefined;
        const iter = props.iterations ?? 0;
        for (let i = 0; i < iter; i++) {
          if (i % 2 === 0) {
            p_in = this.props.output0;
            p_out = this.props.output1;
          } else {
            p_in = this.props.output1;
            p_out = this.props.output0;
          }
          if (this.uniforms && p_in) this.uniforms.pressure.value = p_in.texture;
          this.props.output = p_out;
          super.update();
        }
        return p_out || null;
      }
    }

    class Pressure extends ShaderPass {
      constructor(simProps: { cellScale: THREE.Vector2; boundarySpace: THREE.Vector2; src_p: THREE.WebGLRenderTarget | null; src_v: THREE.WebGLRenderTarget | null; dst: THREE.WebGLRenderTarget | null; dt: number }) {
        super({
          material: {
            vertexShader: face_vert,
            fragmentShader: pressure_frag,
            uniforms: {
              boundarySpace: { value: simProps.boundarySpace },
              pressure: { value: simProps.src_p?.texture },
              velocity: { value: simProps.src_v?.texture },
              px: { value: simProps.cellScale },
              dt: { value: simProps.dt }
            }
          } as unknown as { uniforms: Uniforms },
          output: simProps.dst
        });
        this.init();
      }

      update(props: { vel?: THREE.WebGLRenderTarget | null; pressure?: THREE.WebGLRenderTarget | null }) {
        if (this.uniforms && props.vel && props.pressure) {
          this.uniforms.velocity.value = props.vel.texture;
          this.uniforms.pressure.value = props.pressure.texture;
        }
        super.update();
      }
    }

    class Simulation {
      options = simOptions;
      fbos: Record<string, THREE.WebGLRenderTarget | null> = {
        vel_0: null, vel_1: null, div: null, pressure_0: null, pressure_1: null
      };
      fboSize = new THREE.Vector2();
      cellScale = new THREE.Vector2();
      boundarySpace = new THREE.Vector2();
      advection!: Advection;
      externalForce!: ExternalForce;
      divergence!: Divergence;
      poisson!: Poisson;
      pressure!: Pressure;

      constructor() {
        this.init();
      }

      init() {
        this.calcSize();
        this.createAllFBO();
        this.createShaderPass();
      }

      getFloatType() {
        const isIOS = /(iPad|iPhone|iPod)/i.test(navigator.userAgent);
        return isIOS ? THREE.HalfFloatType : THREE.FloatType;
      }

      createAllFBO() {
        const type = this.getFloatType();
        const opts = {
          type, depthBuffer: false, stencilBuffer: false,
          minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
          wrapS: THREE.ClampToEdgeWrapping, wrapT: THREE.ClampToEdgeWrapping
        } as const;
        for (const key in this.fbos) {
          this.fbos[key] = new THREE.WebGLRenderTarget(this.fboSize.x, this.fboSize.y, opts);
        }
      }

      createShaderPass() {
        this.advection = new Advection({
          cellScale: this.cellScale, fboSize: this.fboSize, dt: this.options.dt,
          src: this.fbos.vel_0, dst: this.fbos.vel_1
        });
        this.externalForce = new ExternalForce({
          cellScale: this.cellScale, cursor_size: this.options.cursor_size, dst: this.fbos.vel_1
        });
        this.divergence = new Divergence({
          cellScale: this.cellScale, boundarySpace: this.boundarySpace,
          src: this.fbos.vel_1, dst: this.fbos.div, dt: this.options.dt
        });
        this.poisson = new Poisson({
          cellScale: this.cellScale, boundarySpace: this.boundarySpace,
          src: this.fbos.div, dst: this.fbos.pressure_1, dst_: this.fbos.pressure_0
        });
        this.pressure = new Pressure({
          cellScale: this.cellScale, boundarySpace: this.boundarySpace,
          src_p: this.fbos.pressure_0, src_v: this.fbos.vel_1, dst: this.fbos.vel_0, dt: this.options.dt
        });
      }

      calcSize() {
        const width = Math.max(1, Math.round(this.options.resolution * Common.width));
        const height = Math.max(1, Math.round(this.options.resolution * Common.height));
        this.cellScale.set(1 / width, 1 / height);
        this.fboSize.set(width, height);
      }

      resize() {
        this.calcSize();
        for (const key in this.fbos) {
          this.fbos[key]!.setSize(this.fboSize.x, this.fboSize.y);
        }
      }

      update() {
        this.boundarySpace.copy(this.cellScale);
        this.advection.update({ dt: this.options.dt });
        this.externalForce.update({
          cursor_size: this.options.cursor_size,
          mouse_force: this.options.mouse_force,
          cellScale: this.cellScale
        });
        this.divergence.update({ vel: this.fbos.vel_1 });
        const pressure = this.poisson.update({ iterations: this.options.iterations_poisson });
        this.pressure.update({ vel: this.fbos.vel_1, pressure });
      }
    }

    class Output {
      simulation: Simulation;
      scene: THREE.Scene;
      camera: THREE.Camera;
      output: THREE.Mesh;

      constructor() {
        this.simulation = new Simulation();
        this.scene = new THREE.Scene();
        this.camera = new THREE.Camera();
        this.output = new THREE.Mesh(
          new THREE.PlaneGeometry(2, 2),
          new THREE.RawShaderMaterial({
            vertexShader: face_vert,
            fragmentShader: color_frag,
            transparent: true,
            depthWrite: false,
            uniforms: {
              velocity: { value: this.simulation.fbos.vel_0!.texture },
              boundarySpace: { value: new THREE.Vector2() },
              palette: { value: paletteTex },
              bgColor: { value: bgVec4 }
            }
          })
        );
        this.scene.add(this.output);
      }

      resize() { this.simulation.resize(); }
      render() {
        if (!Common.renderer) return;
        Common.renderer.setRenderTarget(null);
        Common.renderer.render(this.scene, this.camera);
      }
      update() {
        this.simulation.update();
        this.render();
      }
    }

    class WebGLManager {
      output: Output;
      Common: CommonClass;
      Mouse: MouseClass;
      autoDriver: AutoDriver;
      running = true;

      constructor(output: Output, common: CommonClass, mouse: MouseClass, autoDriver: AutoDriver) {
        this.output = output;
        this.Common = common;
        this.Mouse = mouse;
        this.autoDriver = autoDriver;
      }

      resize() {
        this.Common.resize();
        this.output.resize();
      }

      dispose() {
        this.running = false;
        this.Mouse.dispose();
        if (this.Common.renderer) {
          const canvas = this.Common.renderer.domElement;
          if (canvas?.parentNode) canvas.parentNode.removeChild(canvas);
          this.Common.renderer.dispose();
        }
      }
    }

    // Initialize
    const container = mountRef.current!;
    container.style.position = container.style.position || 'relative';
    container.style.overflow = container.style.overflow || 'hidden';

    Common.init(container);
    Mouse.init(container);
    Mouse.autoIntensity = autoIntensity;
    Mouse.takeoverDuration = takeoverDuration;

    const output = new Output();
    container.prepend(Common.renderer!.domElement);

    const autoDriver = new AutoDriver(Mouse, {
      enabled: autoDemo,
      speed: autoSpeed,
      resumeDelay: autoResumeDelay,
      rampDuration: autoRampDuration
    });

    Mouse.onInteract = () => {
      autoDriver.lastUserInteraction = performance.now();
      autoDriver.forceStop();
    };

    const webgl = new WebGLManager(output, Common, Mouse, autoDriver);
    webglRef.current = webgl;

    const loop = (timestamp: number) => {
      if (!webgl.running || !isVisibleRef.current) return;
      
      // Throttle to target FPS
      const elapsed = timestamp - lastFrameTimeRef.current;
      if (elapsed < frameInterval) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
      lastFrameTimeRef.current = timestamp - (elapsed % frameInterval);
      
      autoDriver.update();
      Mouse.update();
      Common.update();
      output.update();
      
      rafRef.current = requestAnimationFrame(loop);
    };

    // Start the loop
    rafRef.current = requestAnimationFrame(loop);

    // Intersection observer to pause when not visible
    const io = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && webgl.running) {
          rafRef.current = requestAnimationFrame(loop);
        }
      },
      { threshold: [0, 0.1] }
    );
    io.observe(container);

    // Resize observer with debounce
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        webgl.resize();
      }, 150);
    });
    ro.observe(container);

    // Visibility change handler
    const onVisibility = () => {
      if (document.hidden) {
        webgl.running = false;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      } else if (isVisibleRef.current) {
        webgl.running = true;
        rafRef.current = requestAnimationFrame(loop);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      webgl.running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (resizeTimeout) clearTimeout(resizeTimeout);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      webgl.dispose();
      webglRef.current = null;
    };
  }, [useFallback, colors, autoDemo, autoSpeed, autoIntensity, takeoverDuration, autoResumeDelay, autoRampDuration, mouseForce, cursorSize, isViscous, viscous, iterationsViscous, iterationsPoisson, dt, BFECC, resolution, isBounce]);

  // Use fallback for low-power devices
  if (useFallback) {
    return <SimpleFallback colors={colors} className={className} style={style} />;
  }

  return (
    <div
      ref={mountRef}
      className={`w-full h-full relative overflow-hidden pointer-events-none touch-none ${className || ''}`}
      style={style}
    />
  );
}
