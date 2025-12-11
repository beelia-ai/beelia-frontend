'use client'

import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'

// Types
interface Preset {
  sphereCount: number
  ambientIntensity: number
  diffuseIntensity: number
  specularIntensity: number
  specularPower: number
  fresnelPower: number
  backgroundColor: THREE.Color
  sphereColor: THREE.Color
  lightColor: THREE.Color
  lightPosition: THREE.Vector3
  smoothness: number
  contrast: number
  fogDensity: number
  cursorGlowIntensity: number
  cursorGlowRadius: number
  cursorGlowColor: THREE.Color
}

interface Settings extends Preset {
  preset: string
  fixedTopLeftRadius: number
  fixedBottomRightRadius: number
  smallTopLeftRadius: number
  smallBottomRightRadius: number
  cursorRadiusMin: number
  cursorRadiusMax: number
  animationSpeed: number
  movementScale: number
  mouseSmoothness: number
  mergeDistance: number
  mouseProximityEffect: boolean
  minMovementScale: number
  maxMovementScale: number
}

export function SuperHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const storyTextRef = useRef<HTMLHeadingElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)
  const clockRef = useRef<THREE.Clock | null>(null)
  const animationIdRef = useRef<number | null>(null)
  const particleCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const particlesRef = useRef<Array<{x: number, y: number, vx: number, vy: number, size: number, opacity: number, color: string}>>([])
  const particleAnimationRef = useRef<number | null>(null)
  
  // State refs for animation
  const cursorSphere3DRef = useRef(new THREE.Vector3(0, 0, 0))
  const activeMergesRef = useRef(0)
  const targetMousePositionRef = useRef(new THREE.Vector2(0.5, 0.5))
  const mousePositionRef = useRef(new THREE.Vector2(0.5, 0.5))
  const lastTimeRef = useRef(performance.now())
  const frameCountRef = useRef(0)
  const fpsRef = useRef(0)

  // Device detection
  const isMobile = typeof navigator !== 'undefined' 
    ? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    : false
  const isSafari = typeof navigator !== 'undefined'
    ? /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    : false
  const isLowPowerDevice = isMobile || (typeof navigator !== 'undefined' && navigator.hardwareConcurrency <= 4)
  const devicePixelRatio = typeof window !== 'undefined' 
    ? Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2)
    : 1

  const getPresets = useCallback((): Record<string, Preset> => ({
    beelia: {
      sphereCount: isMobile ? 4 : 6,
      ambientIntensity: 0.15,
      diffuseIntensity: 1.4,
      specularIntensity: 2.8,
      specularPower: 3,
      fresnelPower: 0.6,
      backgroundColor: new THREE.Color(0x050200),
      sphereColor: new THREE.Color(0xFF8C00),
      lightColor: new THREE.Color(0xFFD700),
      lightPosition: new THREE.Vector3(0.8, 1.2, 1.0),
      smoothness: 0.8,
      contrast: 1.4,
      fogDensity: 0.03,
      cursorGlowIntensity: 1.4,
      cursorGlowRadius: 2.2,
      cursorGlowColor: new THREE.Color(0xFFE55C)
    },
    moody: {
      sphereCount: isMobile ? 4 : 6,
      ambientIntensity: 0.02,
      diffuseIntensity: 0.6,
      specularIntensity: 1.8,
      specularPower: 8,
      fresnelPower: 1.2,
      backgroundColor: new THREE.Color(0x050505),
      sphereColor: new THREE.Color(0x000000),
      lightColor: new THREE.Color(0xffffff),
      lightPosition: new THREE.Vector3(1, 1, 1),
      smoothness: 0.3,
      contrast: 2.0,
      fogDensity: 0.12,
      cursorGlowIntensity: 0.4,
      cursorGlowRadius: 1.2,
      cursorGlowColor: new THREE.Color(0xffffff)
    },
    holographic: {
      sphereCount: isMobile ? 4 : 6,
      ambientIntensity: 0.12,
      diffuseIntensity: 1.2,
      specularIntensity: 2.5,
      specularPower: 3,
      fresnelPower: 0.8,
      backgroundColor: new THREE.Color(0x0a0a15),
      sphereColor: new THREE.Color(0x050510),
      lightColor: new THREE.Color(0xccaaff),
      lightPosition: new THREE.Vector3(0.9, 0.9, 1.2),
      smoothness: 0.8,
      contrast: 1.6,
      fogDensity: 0.06,
      cursorGlowIntensity: 1.2,
      cursorGlowRadius: 2.2,
      cursorGlowColor: new THREE.Color(0xaa77ff)
    },
    minimal: {
      sphereCount: isMobile ? 2 : 3,
      ambientIntensity: 0.0,
      diffuseIntensity: 0.25,
      specularIntensity: 1.3,
      specularPower: 11,
      fresnelPower: 1.7,
      backgroundColor: new THREE.Color(0x0a0a0a),
      sphereColor: new THREE.Color(0x000000),
      lightColor: new THREE.Color(0xffffff),
      lightPosition: new THREE.Vector3(1, 0.5, 0.8),
      smoothness: 0.25,
      contrast: 2.0,
      fogDensity: 0.1,
      cursorGlowIntensity: 0.3,
      cursorGlowRadius: 1.0,
      cursorGlowColor: new THREE.Color(0xffffff)
    },
  }), [isMobile])

  const settingsRef = useRef<Settings | null>(null)

  const getStoryText = useCallback((x: string, y: string, radius: string, merges: number, fps: number) => {
    if (isMobile) {
      return `vessel: (${x}, ${y})<br>field: ${radius}u<br>merges: ${merges}<br>flux: ${fps}hz`
    }
    return `our vessel drifts at coordinates (${x}, ${y})<br>gravitational field extends ${radius} units into quantum foam<br>currently merging with ${merges} other entities<br>temporal flux: ${fps} cycles per second`
  }, [isMobile])

  const screenToWorldJS = useCallback((normalizedX: number, normalizedY: number) => {
    if (typeof window === 'undefined') return new THREE.Vector3(0, 0, 0)
    const uv_x = normalizedX * 2.0 - 1.0
    const uv_y = normalizedY * 2.0 - 1.0
    const aspect = window.innerWidth / window.innerHeight
    return new THREE.Vector3(uv_x * aspect * 2.0, uv_y * 2.0, 0.0)
  }, [])

  const updateStory = useCallback((x: number, y: number, radius: number, merges: number, fps: number) => {
    if (storyTextRef.current) {
      const newText = getStoryText(
        x.toFixed(2),
        y.toFixed(2),
        radius.toFixed(2),
        merges,
        fps || 0
      )
      storyTextRef.current.innerHTML = newText
    }
  }, [getStoryText])

  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return

    const presets = getPresets()
    const settings: Settings = {
      preset: 'beelia',
      ...presets.beelia,
      fixedTopLeftRadius: 0.8,
      fixedBottomRightRadius: 0.9,
      smallTopLeftRadius: 0.3,
      smallBottomRightRadius: 0.35,
      cursorRadiusMin: 0.08,
      cursorRadiusMax: 0.15,
      animationSpeed: 0.6,
      movementScale: 1.2,
      mouseSmoothness: 0.1,
      mergeDistance: 1.5,
      mouseProximityEffect: true,
      minMovementScale: 0.3,
      maxMovementScale: 1.0
    }
    settingsRef.current = settings

    // Setup Three.js
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
    camera.position.z = 1
    const clock = new THREE.Clock()
    clockRef.current = clock

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile && !isLowPowerDevice,
      alpha: true,
      powerPreference: isMobile ? 'default' : 'high-performance',
      preserveDrawingBuffer: false,
      premultipliedAlpha: false
    })
    rendererRef.current = renderer

    const pixelRatio = Math.min(devicePixelRatio, isMobile ? 1.5 : 2)
    renderer.setPixelRatio(pixelRatio)

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    renderer.setSize(viewportWidth, viewportHeight)
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace

    const canvas = renderer.domElement
    canvas.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      z-index: 0 !important;
      display: block !important;
    `
    containerRef.current.appendChild(canvas)

    // Setup 2D particle canvas overlay
    const particleCanvas = document.createElement('canvas')
    particleCanvas.width = viewportWidth
    particleCanvas.height = viewportHeight
    particleCanvas.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      z-index: 1 !important;
      pointer-events: none !important;
    `
    containerRef.current.appendChild(particleCanvas)
    particleCanvasRef.current = particleCanvas
    
    // Initialize particles with Beelia gradient colors
    const particleCount = isMobile ? 40 : 80
    const colors = ['#FEDA24', '#FFE55C', '#FF8C32', '#EF941F']
    const particles: typeof particlesRef.current = []
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * viewportWidth,
        y: Math.random() * viewportHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: 2 + Math.random() * 4,
        opacity: 0.1 + Math.random() * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }
    particlesRef.current = particles
    
    // Particle animation loop
    const animateParticles = () => {
      particleAnimationRef.current = requestAnimationFrame(animateParticles)
      
      const ctx = particleCanvas.getContext('2d')
      if (!ctx) return
      
      ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height)
      
      particlesRef.current.forEach(particle => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy
        
        // Wrap around screen
        if (particle.x < 0) particle.x = particleCanvas.width
        if (particle.x > particleCanvas.width) particle.x = 0
        if (particle.y < 0) particle.y = particleCanvas.height
        if (particle.y > particleCanvas.height) particle.y = 0
        
        // Convert hex to rgb values
        const hex = particle.color.replace('#', '')
        const r = parseInt(hex.substring(0, 2), 16)
        const g = parseInt(hex.substring(2, 4), 16)
        const b = parseInt(hex.substring(4, 6), 16)
        
        // Draw particle with glow
        ctx.beginPath()
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        )
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${particle.opacity})`)
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${particle.opacity * 0.3})`)
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
        
        ctx.fillStyle = gradient
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2)
        ctx.fill()
      })
    }
    
    animateParticles()

    // Create shader material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(viewportWidth, viewportHeight) },
        uActualResolution: {
          value: new THREE.Vector2(
            viewportWidth * pixelRatio,
            viewportHeight * pixelRatio
          )
        },
        uPixelRatio: { value: pixelRatio },
        uMousePosition: { value: new THREE.Vector2(0.5, 0.5) },
        uCursorSphere: { value: new THREE.Vector3(0, 0, 0) },
        uCursorRadius: { value: settings.cursorRadiusMin },
        uSphereCount: { value: settings.sphereCount },
        uFixedTopLeftRadius: { value: settings.fixedTopLeftRadius },
        uFixedBottomRightRadius: { value: settings.fixedBottomRightRadius },
        uSmallTopLeftRadius: { value: settings.smallTopLeftRadius },
        uSmallBottomRightRadius: { value: settings.smallBottomRightRadius },
        uMergeDistance: { value: settings.mergeDistance },
        uSmoothness: { value: settings.smoothness },
        uAmbientIntensity: { value: settings.ambientIntensity },
        uDiffuseIntensity: { value: settings.diffuseIntensity },
        uSpecularIntensity: { value: settings.specularIntensity },
        uSpecularPower: { value: settings.specularPower },
        uFresnelPower: { value: settings.fresnelPower },
        uBackgroundColor: { value: settings.backgroundColor },
        uSphereColor: { value: settings.sphereColor },
        uLightColor: { value: settings.lightColor },
        uLightPosition: { value: settings.lightPosition },
        uContrast: { value: settings.contrast },
        uFogDensity: { value: settings.fogDensity },
        uAnimationSpeed: { value: settings.animationSpeed },
        uMovementScale: { value: settings.movementScale },
        uMouseProximityEffect: { value: settings.mouseProximityEffect },
        uMinMovementScale: { value: settings.minMovementScale },
        uMaxMovementScale: { value: settings.maxMovementScale },
        uCursorGlowIntensity: { value: settings.cursorGlowIntensity },
        uCursorGlowRadius: { value: settings.cursorGlowRadius },
        uCursorGlowColor: { value: settings.cursorGlowColor },
        uIsSafari: { value: isSafari ? 1.0 : 0.0 },
        uIsMobile: { value: isMobile ? 1.0 : 0.0 },
        uIsLowPower: { value: isLowPowerDevice ? 1.0 : 0.0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        ${isMobile || isSafari || isLowPowerDevice ? 'precision mediump float;' : 'precision highp float;'}
        
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec2 uActualResolution;
        uniform float uPixelRatio;
        uniform vec2 uMousePosition;
        uniform vec3 uCursorSphere;
        uniform float uCursorRadius;
        uniform int uSphereCount;
        uniform float uFixedTopLeftRadius;
        uniform float uFixedBottomRightRadius;
        uniform float uSmallTopLeftRadius;
        uniform float uSmallBottomRightRadius;
        uniform float uMergeDistance;
        uniform float uSmoothness;
        uniform float uAmbientIntensity;
        uniform float uDiffuseIntensity;
        uniform float uSpecularIntensity;
        uniform float uSpecularPower;
        uniform float uFresnelPower;
        uniform vec3 uBackgroundColor;
        uniform vec3 uSphereColor;
        uniform vec3 uLightColor;
        uniform vec3 uLightPosition;
        uniform float uContrast;
        uniform float uFogDensity;
        uniform float uAnimationSpeed;
        uniform float uMovementScale;
        uniform bool uMouseProximityEffect;
        uniform float uMinMovementScale;
        uniform float uMaxMovementScale;
        uniform float uCursorGlowIntensity;
        uniform float uCursorGlowRadius;
        uniform vec3 uCursorGlowColor;
        uniform float uIsSafari;
        uniform float uIsMobile;
        uniform float uIsLowPower;
        
        varying vec2 vUv;
        
        const float PI = 3.14159265359;
        const float EPSILON = 0.001;
        const float MAX_DIST = 100.0;
        
        float smin(float a, float b, float k) {
          float h = max(k - abs(a - b), 0.0) / k;
          return min(a, b) - h * h * k * 0.25;
        }
        
        float sdSphere(vec3 p, float r) {
          return length(p) - r;
        }
        
        vec3 screenToWorld(vec2 normalizedPos) {
          vec2 uv = normalizedPos * 2.0 - 1.0;
          uv.x *= uResolution.x / uResolution.y;
          return vec3(uv * 2.0, 0.0);
        }
        
        float getDistanceToCenter(vec2 pos) {
          float dist = length(pos - vec2(0.5, 0.5)) * 2.0;
          return smoothstep(0.0, 1.0, dist);
        }
        
        float sceneSDF(vec3 pos) {
          float result = MAX_DIST;
          
          vec3 topLeftPos = screenToWorld(vec2(0.08, 0.92));
          float topLeft = sdSphere(pos - topLeftPos, uFixedTopLeftRadius);
          
          vec3 smallTopLeftPos = screenToWorld(vec2(0.25, 0.72));
          float smallTopLeft = sdSphere(pos - smallTopLeftPos, uSmallTopLeftRadius);
          
          vec3 bottomRightPos = screenToWorld(vec2(0.92, 0.08));
          float bottomRight = sdSphere(pos - bottomRightPos, uFixedBottomRightRadius);
          
          vec3 smallBottomRightPos = screenToWorld(vec2(0.72, 0.25));
          float smallBottomRight = sdSphere(pos - smallBottomRightPos, uSmallBottomRightRadius);
          
          float t = uTime * uAnimationSpeed;
          
          float dynamicMovementScale = uMovementScale;
          if (uMouseProximityEffect) {
            float distToCenter = getDistanceToCenter(uMousePosition);
            float mixFactor = smoothstep(0.0, 1.0, distToCenter);
            dynamicMovementScale = mix(uMinMovementScale, uMaxMovementScale, mixFactor);
          }
          
          int maxIter = uIsMobile > 0.5 ? 4 : (uIsLowPower > 0.5 ? 6 : min(uSphereCount, 10));
          for (int i = 0; i < 10; i++) {
            if (i >= uSphereCount || i >= maxIter) break;
            
            float fi = float(i);
            float speed = 0.4 + fi * 0.12;
            float radius = 0.12 + mod(fi, 3.0) * 0.06;
            float orbitRadius = (0.3 + mod(fi, 3.0) * 0.15) * dynamicMovementScale;
            float phaseOffset = fi * PI * 0.35;
            
            float distToCursor = length(vec3(0.0) - uCursorSphere);
            float proximityScale = 1.0 + (1.0 - smoothstep(0.0, 1.0, distToCursor)) * 0.5;
            orbitRadius *= proximityScale;
            
            vec3 offset;
            if (i == 0) {
              offset = vec3(
                sin(t * speed) * orbitRadius * 0.7,
                sin(t * 0.5) * orbitRadius,
                cos(t * speed * 0.7) * orbitRadius * 0.5
              );
            } else if (i == 1) {
              offset = vec3(
                sin(t * speed + PI) * orbitRadius * 0.5,
                -sin(t * 0.5) * orbitRadius,
                cos(t * speed * 0.7 + PI) * orbitRadius * 0.5
              );
            } else {
              offset = vec3(
                sin(t * speed + phaseOffset) * orbitRadius * 0.8,
                cos(t * speed * 0.85 + phaseOffset * 1.3) * orbitRadius * 0.6,
                sin(t * speed * 0.5 + phaseOffset) * 0.3
              );
            }
            
            vec3 toCursor = uCursorSphere - offset;
            float cursorDist = length(toCursor);
            if (cursorDist < uMergeDistance && cursorDist > 0.0) {
              float attraction = (1.0 - cursorDist / uMergeDistance) * 0.3;
              offset += normalize(toCursor) * attraction;
            }
            
            float movingSphere = sdSphere(pos - offset, radius);
            
            float blend = 0.05;
            if (cursorDist < uMergeDistance) {
              float influence = 1.0 - (cursorDist / uMergeDistance);
              blend = mix(0.05, uSmoothness, influence * influence * influence);
            }
            
            result = smin(result, movingSphere, blend);
          }
          
          float cursorBall = sdSphere(pos - uCursorSphere, uCursorRadius);
          
          float topLeftGroup = smin(topLeft, smallTopLeft, 0.4);
          float bottomRightGroup = smin(bottomRight, smallBottomRight, 0.4);
          
          result = smin(result, topLeftGroup, 0.3);
          result = smin(result, bottomRightGroup, 0.3);
          result = smin(result, cursorBall, uSmoothness);
          
          return result;
        }
        
        vec3 calcNormal(vec3 p) {
          float eps = uIsLowPower > 0.5 ? 0.002 : 0.001;
          return normalize(vec3(
            sceneSDF(p + vec3(eps, 0, 0)) - sceneSDF(p - vec3(eps, 0, 0)),
            sceneSDF(p + vec3(0, eps, 0)) - sceneSDF(p - vec3(0, eps, 0)),
            sceneSDF(p + vec3(0, 0, eps)) - sceneSDF(p - vec3(0, 0, eps))
          ));
        }
        
        float ambientOcclusion(vec3 p, vec3 n) {
          if (uIsLowPower > 0.5) {
            float h1 = sceneSDF(p + n * 0.03);
            float h2 = sceneSDF(p + n * 0.06);
            float occ = (0.03 - h1) + (0.06 - h2) * 0.5;
            return clamp(1.0 - occ * 2.0, 0.0, 1.0);
          } else {
            float occ = 0.0;
            float weight = 1.0;
            for (int i = 0; i < 6; i++) {
              float dist = 0.01 + 0.015 * float(i * i);
              float h = sceneSDF(p + n * dist);
              occ += (dist - h) * weight;
              weight *= 0.85;
            }
            return clamp(1.0 - occ, 0.0, 1.0);
          }
        }
        
        float softShadow(vec3 ro, vec3 rd, float mint, float maxt, float k) {
          if (uIsLowPower > 0.5) {
            float result = 1.0;
            float t = mint;
            for (int i = 0; i < 3; i++) {
              t += 0.3;
              if (t >= maxt) break;
              float h = sceneSDF(ro + rd * t);
              if (h < EPSILON) return 0.0;
              result = min(result, k * h / t);
            }
            return result;
          } else {
            float result = 1.0;
            float t = mint;
            for (int i = 0; i < 20; i++) {
              if (t >= maxt) break;
              float h = sceneSDF(ro + rd * t);
              if (h < EPSILON) return 0.0;
              result = min(result, k * h / t);
              t += h;
            }
            return result;
          }
        }
        
        float rayMarch(vec3 ro, vec3 rd) {
          float t = 0.0;
          int maxSteps = uIsMobile > 0.5 ? 16 : (uIsSafari > 0.5 ? 16 : 48);
          
          for (int i = 0; i < 48; i++) {
            if (i >= maxSteps) break;
            
            vec3 p = ro + rd * t;
            float d = sceneSDF(p);
            
            if (d < EPSILON) {
              return t;
            }
            
            if (t > 5.0) {
              break;
            }
            
            t += d * (uIsLowPower > 0.5 ? 1.2 : 0.9);
          }
          
          return -1.0;
        }
        
        vec3 lighting(vec3 p, vec3 rd, float t) {
          if (t < 0.0) {
            return vec3(0.0);
          }
          
          vec3 normal = calcNormal(p);
          vec3 viewDir = -rd;
          
          vec3 baseColor = uSphereColor;
          
          float ao = ambientOcclusion(p, normal);
          
          vec3 ambient = uLightColor * uAmbientIntensity * ao;
          
          vec3 lightDir = normalize(uLightPosition);
          float diff = max(dot(normal, lightDir), 0.0);
          
          float shadow = softShadow(p, lightDir, 0.01, 10.0, 20.0);
          
          vec3 diffuse = uLightColor * diff * uDiffuseIntensity * shadow;
          
          vec3 reflectDir = reflect(-lightDir, normal);
          float spec = pow(max(dot(viewDir, reflectDir), 0.0), uSpecularPower);
          float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), uFresnelPower);
          
          vec3 specular = uLightColor * spec * uSpecularIntensity * fresnel;
          
          vec3 fresnelRim = uLightColor * fresnel * 0.4;
          
          float distToCursor = length(p - uCursorSphere);
          if (distToCursor < uCursorRadius + 0.4) {
            float highlight = 1.0 - smoothstep(0.0, uCursorRadius + 0.4, distToCursor);
            specular += uLightColor * highlight * 0.2;
            
            float glow = exp(-distToCursor * 3.0) * 0.15;
            ambient += uLightColor * glow * 0.5;
          }
          
          vec3 color = (baseColor + ambient + diffuse + specular + fresnelRim) * ao;
          
          color = pow(color, vec3(uContrast * 0.9));
          color = color / (color + vec3(0.8));
          
          return color;
        }
        
        float calculateCursorGlow(vec3 worldPos) {
          float dist = length(worldPos.xy - uCursorSphere.xy);
          float glow = 1.0 - smoothstep(0.0, uCursorGlowRadius, dist);
          glow = pow(glow, 2.0);
          return glow * uCursorGlowIntensity;
        }
        
        void main() {
          vec2 uv = (gl_FragCoord.xy * 2.0 - uActualResolution.xy) / uActualResolution.xy;
          uv.x *= uResolution.x / uResolution.y;
          
          vec3 ro = vec3(uv * 2.0, -1.0);
          vec3 rd = vec3(0.0, 0.0, 1.0);
          
          float t = rayMarch(ro, rd);
          
          vec3 p = ro + rd * t;
          
          vec3 color = lighting(p, rd, t);
          
          float cursorGlow = calculateCursorGlow(ro);
          vec3 glowContribution = uCursorGlowColor * cursorGlow;
          
          if (t > 0.0) {
            float fogAmount = 1.0 - exp(-t * uFogDensity);
            color = mix(color, uBackgroundColor.rgb, fogAmount * 0.3);
            
            color += glowContribution * 0.3;
            
            gl_FragColor = vec4(color, 1.0);
          } else {
            if (cursorGlow > 0.01) {
              gl_FragColor = vec4(glowContribution, cursorGlow * 0.8);
            } else {
              gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
            }
          }
        }
      `,
      transparent: true
    })
    materialRef.current = material

    const geometry = new THREE.PlaneGeometry(2, 2)
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Event handlers
    const onPointerMove = (event: { clientX: number; clientY: number }) => {
      targetMousePositionRef.current.x = event.clientX / window.innerWidth
      targetMousePositionRef.current.y = 1.0 - event.clientY / window.innerHeight

      const normalizedX = targetMousePositionRef.current.x
      const normalizedY = targetMousePositionRef.current.y
      const worldPos = screenToWorldJS(normalizedX, normalizedY)
      cursorSphere3DRef.current.copy(worldPos)

      let closestDistance = 1000.0
      activeMergesRef.current = 0

      const fixedPositions = [
        screenToWorldJS(0.08, 0.92),
        screenToWorldJS(0.25, 0.72),
        screenToWorldJS(0.92, 0.08),
        screenToWorldJS(0.72, 0.25)
      ]

      fixedPositions.forEach((pos) => {
        const dist = cursorSphere3DRef.current.distanceTo(pos)
        closestDistance = Math.min(closestDistance, dist)
        if (dist < settings.mergeDistance) activeMergesRef.current++
      })

      const proximityFactor = Math.max(0, 1.0 - closestDistance / settings.mergeDistance)
      const smoothFactor = proximityFactor * proximityFactor * (3.0 - 2.0 * proximityFactor)
      const dynamicRadius = settings.cursorRadiusMin + (settings.cursorRadiusMax - settings.cursorRadiusMin) * smoothFactor

      material.uniforms.uCursorSphere.value.copy(cursorSphere3DRef.current)
      material.uniforms.uCursorRadius.value = dynamicRadius

      updateStory(
        cursorSphere3DRef.current.x,
        cursorSphere3DRef.current.y,
        dynamicRadius,
        activeMergesRef.current,
        fpsRef.current
      )
    }

    const onTouchMove = (event: TouchEvent) => {
      event.preventDefault()
      if (event.touches.length > 0) {
        const touch = event.touches[0]
        onPointerMove({ clientX: touch.clientX, clientY: touch.clientY })
      }
    }

    const onWindowResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const currentPixelRatio = Math.min(devicePixelRatio, isMobile ? 1.5 : 2)

      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      renderer.setPixelRatio(currentPixelRatio)

      // Update particle canvas on resize
      if (particleCanvasRef.current) {
        particleCanvasRef.current.width = width
        particleCanvasRef.current.height = height
      }

      material.uniforms.uResolution.value.set(width, height)
      material.uniforms.uActualResolution.value.set(
        width * currentPixelRatio,
        height * currentPixelRatio
      )
      material.uniforms.uPixelRatio.value = currentPixelRatio

      const canvas = renderer.domElement
      canvas.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        z-index: 0 !important;
        display: block !important;
      `
    }

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)

      const currentTime = performance.now()
      frameCountRef.current++

      if (currentTime - lastTimeRef.current >= 1000) {
        fpsRef.current = Math.round((frameCountRef.current * 1000) / (currentTime - lastTimeRef.current))
        updateStory(
          cursorSphere3DRef.current.x,
          cursorSphere3DRef.current.y,
          material.uniforms.uCursorRadius.value,
          activeMergesRef.current,
          fpsRef.current
        )
        frameCountRef.current = 0
        lastTimeRef.current = currentTime
      }

      mousePositionRef.current.x += (targetMousePositionRef.current.x - mousePositionRef.current.x) * settings.mouseSmoothness
      mousePositionRef.current.y += (targetMousePositionRef.current.y - mousePositionRef.current.y) * settings.mouseSmoothness

      material.uniforms.uTime.value = clock.getElapsedTime()
      material.uniforms.uMousePosition.value = mousePositionRef.current

      renderer.render(scene, camera)
    }

    // Add event listeners
    window.addEventListener('mousemove', onPointerMove, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('resize', onWindowResize, { passive: true })

    // Initialize cursor position
    onPointerMove({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 })

    // Start animation
    animate()

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      window.removeEventListener('mousemove', onPointerMove)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('resize', onWindowResize)
      
      if (rendererRef.current) {
        rendererRef.current.dispose()
        if (containerRef.current && rendererRef.current.domElement) {
          containerRef.current.removeChild(rendererRef.current.domElement)
        }
      }
      geometry.dispose()
      material.dispose()
      
      // Cleanup particle animation and canvas
      if (particleAnimationRef.current) {
        cancelAnimationFrame(particleAnimationRef.current)
      }
      if (particleCanvasRef.current && containerRef.current) {
        containerRef.current.removeChild(particleCanvasRef.current)
      }
    }
  }, [devicePixelRatio, getPresets, isMobile, isLowPowerDevice, isSafari, screenToWorldJS, updateStory])

  return (
    <>
      <style jsx>{`
        @import url("https://fonts.cdnfonts.com/css/pp-neue-montreal");
        
        .hero-section {
          width: 100vw;
          height: 100vh;
          position: relative;
          padding: 2rem;
        }
        
        #container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: #0f0f0f;
          z-index: 0;
          pointer-events: none;
        }
        
        .header-area {
          position: fixed;
          top: 2rem;
          left: 0;
          width: 100%;
          padding: 0 2rem;
          display: flex;
          justify-content: center;
          z-index: 10;
        }
        
        .logo-container {
          position: absolute;
          left: 2rem;
          top: 0;
          display: flex;
          align-items: center;
          height: 2rem;
          z-index: 10;
          cursor: pointer;
        }
        
        .logo-circles {
          position: relative;
          width: 100%;
          height: 100%;
        }
        
        .circle {
          position: absolute;
          border-radius: 50%;
          transition: transform 0.5s cubic-bezier(0.445, 0.05, 0.55, 0.95);
          width: 1.4rem;
          height: 1.4rem;
          background-color: #ffffff;
          top: 50%;
        }
        
        .circle-1 {
          left: 0;
          transform: translate(0, -50%);
        }
        
        .circle-2 {
          left: 0.8rem;
          transform: translate(0, -50%);
          mix-blend-mode: exclusion;
        }
        
        .logo-container:hover .circle-1 {
          transform: translate(-0.5rem, -50%);
        }
        
        .logo-container:hover .circle-2 {
          transform: translate(0.5rem, -50%);
        }
        
        .center-logo {
          text-align: center;
          z-index: 10;
          height: 2rem;
        }
        
        .logo-text {
          font-family: "PP Neue Montreal", sans-serif;
          font-weight: 400;
          font-size: 1.5rem;
          line-height: 1;
          margin: 0;
          color: #ffffff;
          text-transform: none;
        }
        
        .hero {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          z-index: 10;
          color: #ffffff;
          width: 90%;
          max-width: 900px;
        }
        
        .hero h1 {
          font-family: "PP Neue Montreal", sans-serif;
          font-weight: 400;
          font-size: 6rem;
          line-height: 0.95;
          letter-spacing: -0.02em;
          color: #ffffff;
          text-transform: none;
          margin: 0 0 2rem 0;
        }
        
        .hero h2 {
          font-family: "PP Neue Montreal", sans-serif;
          font-size: 1.25rem;
          color: #cccccc;
          text-transform: none;
          letter-spacing: 0.01em;
          line-height: 1.5;
          opacity: 0.8;
          transition: opacity 0.3s ease;
          font-weight: 400;
          margin: 0;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .hero:hover h2 {
          opacity: 1;
        }
        
        .contact-info {
          position: fixed;
          top: 50%;
          left: 2rem;
          transform: translateY(-50%);
          z-index: 10;
          font-family: "PPSupplyMono", monospace;
          letter-spacing: 0.05em;
          font-size: 10px;
          color: #ffffff;
          text-transform: uppercase;
        }
        
        .contact-heading {
          font-size: 10px;
          color: #cccccc;
          margin-bottom: 0.5rem;
        }
        
        .contact-email {
          display: block;
          color: #ffffff;
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .contact-email:hover {
          color: #cccccc;
        }
        
        .footer-links {
          position: fixed;
          bottom: 2rem;
          left: 2rem;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.25rem;
          font-family: "PP Neue Montreal", sans-serif;
          font-weight: 400;
          font-size: 1rem;
        }
        
        .footer-link {
          color: #cccccc;
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
          padding-left: 0;
          text-transform: none;
          font-size: 1rem;
        }
        
        .footer-link::before {
          content: "";
          position: absolute;
          left: 0;
          top: 50%;
          width: 0;
          height: 1px;
          background-color: #ffffff;
          transform: translateY(-50%);
          transition: width 0.3s ease, opacity 0.3s ease;
          opacity: 0;
        }
        
        .footer-link:hover {
          color: #ffffff;
          padding-left: 1.2rem;
        }
        
        .footer-link:hover::before {
          width: 0.8rem;
          opacity: 1;
        }
        
        .coordinates {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          text-align: right;
          z-index: 10;
          font-family: "PPSupplyMono", monospace;
          font-size: 10px;
          color: #cccccc;
        }
        
        .coordinates p {
          margin: 0;
        }
        
        @media (max-width: 768px) {
          .hero h1 {
            font-size: 4rem;
          }
          
          .hero h2 {
            font-size: 1rem;
          }
          
          .footer-links {
            gap: 0.4rem;
          }
          
          .coordinates {
            font-size: 10px;
          }
        }
        
        @media (max-width: 480px) {
          .hero-section {
            padding: 1rem;
          }
          
          .header-area,
          .contact-info,
          .footer-links,
          .coordinates {
            padding: 0 1rem;
          }
          
          .logo-container,
          .contact-info,
          .footer-links {
            left: 1rem;
          }
          
          .coordinates {
            right: 1rem;
          }
          
          .hero h1 {
            font-size: 2.5rem;
          }
          
          .hero h2 {
            font-size: 0.9rem;
          }
          
          .circle {
            width: 1.2rem;
            height: 1.2rem;
          }
          
          .circle-2 {
            left: 0.7rem;
          }
          
          .logo-text {
            font-size: 1.3rem;
          }
          
          .contact-heading,
          .contact-email {
            font-size: 10px;
          }
        }
      `}</style>
      
      <section className="hero-section">
        <div id="container" ref={containerRef}></div>
        
        <div className="hero">
          <h1>AI for Everyone<br/>by Everyone</h1>
          <h2>
            A curated AI marketplace where anyone can discover, trust, and use the right tools instantly, no technical skills required.
          </h2>
        </div>
        
        <div className="contact-info">
          <p className="contact-heading">+Get in touch</p>
          <span className="contact-email">juancarloscalvofresno@cesno.eu</span>
        </div>
        
        <div className="footer-links">
          <a href="#" className="footer-link">Product Overview</a>
          <a href="#" className="footer-link">Features</a>
          <a href="#" className="footer-link">About Team</a>
          <a href="#" className="footer-link">Contact</a>
        </div>
        
        <div className="coordinates">
          <p>Beelia.AI</p>
          <p>A Cesno Company</p>
        </div>
      </section>
    </>
  )
}

export default SuperHero

