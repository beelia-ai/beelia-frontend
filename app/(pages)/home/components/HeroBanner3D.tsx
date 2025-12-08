'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Link from 'next/link'

// Particle system for magical effect - smooth floating stars
class ParticleSystem {
  particles: THREE.Points
  geometry: THREE.BufferGeometry
  originalPositions: Float32Array
  offsets: Float32Array // Random offsets for each particle's animation phase
  speeds: Float32Array // Random speeds for each particle
  
  constructor(count: number = 400) {
    this.geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    this.originalPositions = new Float32Array(count * 3)
    this.offsets = new Float32Array(count)
    this.speeds = new Float32Array(count)
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      // Spread particles in a sphere around the model
      const radius = 3 + Math.random() * 5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = radius * Math.cos(phi)
      
      this.originalPositions[i3] = positions[i3]
      this.originalPositions[i3 + 1] = positions[i3 + 1]
      this.originalPositions[i3 + 2] = positions[i3 + 2]
      
      // Random phase offset and speed for smooth varied animation
      this.offsets[i] = Math.random() * Math.PI * 2
      this.speeds[i] = 0.3 + Math.random() * 0.4 // Speed between 0.3 and 0.7
    }
    
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    
    // Create gradient texture for particles
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')!
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(254, 218, 36, 1)')
    gradient.addColorStop(0.4, 'rgba(254, 218, 36, 0.6)')
    gradient.addColorStop(0.7, 'rgba(239, 148, 31, 0.2)')
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 64, 64)
    
    const texture = new THREE.CanvasTexture(canvas)
    
    const material = new THREE.PointsMaterial({
      size: 0.06,
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: false,
    })
    
    this.particles = new THREE.Points(this.geometry, material)
  }
  
  update(time: number) {
    const positions = this.geometry.attributes.position.array as Float32Array
    const timeInSeconds = time * 0.001
    
    for (let i = 0; i < this.offsets.length; i++) {
      const i3 = i * 3
      const offset = this.offsets[i]
      const speed = this.speeds[i]
      
      // Smooth sine-based floating animation - no accumulation, just offset from original
      const floatX = Math.sin(timeInSeconds * speed + offset) * 0.15
      const floatY = Math.cos(timeInSeconds * speed * 0.8 + offset * 1.3) * 0.15
      const floatZ = Math.sin(timeInSeconds * speed * 0.6 + offset * 0.7) * 0.1
      
      positions[i3] = this.originalPositions[i3] + floatX
      positions[i3 + 1] = this.originalPositions[i3 + 1] + floatY
      positions[i3 + 2] = this.originalPositions[i3 + 2] + floatZ
    }
    
    this.geometry.attributes.position.needsUpdate = true
  }
  
  getMesh() {
    return this.particles
  }
}

export function HeroBanner3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const modelRef = useRef<THREE.Group | null>(null)
  const particleSystemRef = useRef<ParticleSystem | null>(null)
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)
  const animationRef = useRef<number | null>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const targetRotationRef = useRef({ x: Math.PI / 2, y: 0 }) // X = PI/2 to keep model upright
  
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  
  // Smooth mouse tracking with springs
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 })
  
  // Transform for text parallax
  const textX = useTransform(smoothMouseX, [-0.5, 0.5], [10, -10])
  const textY = useTransform(smoothMouseY, [-0.5, 0.5], [10, -10])
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    
    mouseRef.current = { x, y }
    mouseX.set(x)
    mouseY.set(y)
    
    // Update target rotation for model - both axes follow mouse exactly
    targetRotationRef.current = {
      x: Math.PI / 2 + y * 0.5, // Vertical tilt based on mouse Y
      y: x * 0.8 // Horizontal rotation based on mouse X
    }
  }, [mouseX, mouseY])
  
  useEffect(() => {
    if (!canvasRef.current || !canvasContainerRef.current) return
    
    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene
    
    // Camera - use canvas container (left half) dimensions
    const camera = new THREE.PerspectiveCamera(
      45,
      canvasContainerRef.current.clientWidth / canvasContainerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 0, 8)
    cameraRef.current = camera
    
    // Renderer with high quality settings
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(canvasContainerRef.current.clientWidth, canvasContainerRef.current.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    rendererRef.current = renderer
    
    // ============ LIGHTING SETUP ============
    
    // 1. Ambient Light - soft fill light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
    scene.add(ambientLight)
    
    // 2. Main Key Light - warm golden directional
    const keyLight = new THREE.DirectionalLight(0xFEDA24, 2)
    keyLight.position.set(5, 5, 5)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.width = 2048
    keyLight.shadow.mapSize.height = 2048
    keyLight.shadow.camera.near = 0.5
    keyLight.shadow.camera.far = 50
    scene.add(keyLight)
    
    // 3. Fill Light - cooler tone from opposite side
    const fillLight = new THREE.DirectionalLight(0x88CCFF, 0.8)
    fillLight.position.set(-5, 2, -3)
    scene.add(fillLight)
    
    // 4. Rim Light - creates edge highlights
    const rimLight = new THREE.DirectionalLight(0xFFFFFF, 1.5)
    rimLight.position.set(0, -3, -5)
    scene.add(rimLight)
    
    // 5. Point Lights for dramatic effect
    const pointLight1 = new THREE.PointLight(0xFEDA24, 3, 10)
    pointLight1.position.set(2, 2, 3)
    scene.add(pointLight1)
    
    const pointLight2 = new THREE.PointLight(0xEF941F, 2, 8)
    pointLight2.position.set(-3, -1, 2)
    scene.add(pointLight2)
    
    // 6. Spot Light for focused highlights
    const spotLight = new THREE.SpotLight(0xFFFFFF, 2)
    spotLight.position.set(0, 8, 4)
    spotLight.angle = Math.PI / 6
    spotLight.penumbra = 0.5
    spotLight.decay = 2
    spotLight.distance = 30
    spotLight.castShadow = true
    scene.add(spotLight)
    
    // 7. Hemisphere Light for natural sky/ground lighting
    const hemiLight = new THREE.HemisphereLight(0xFEDA24, 0x1a1a1a, 0.6)
    scene.add(hemiLight)
    
    // ============ PARTICLE SYSTEM ============
    const particleSystem = new ParticleSystem(150)
    particleSystemRef.current = particleSystem
    scene.add(particleSystem.getMesh())
    
    // ============ LOAD 3D MODEL ============
    const loader = new GLTFLoader()
    
    loader.load(
      '/assets/3d/Beelia.glb',
      (gltf) => {
        const model = gltf.scene
        
        // Center and scale the model
        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 4 / maxDim
        model.scale.setScalar(scale)
        
        model.position.x = -center.x * scale
        model.position.y = -center.y * scale
        model.position.z = -center.z * scale
        
        // Rotate model to stand upright (vertical)
        model.rotation.x = Math.PI / 2
        
        // Apply enhanced holographic Beelia material
        const holographicMaterial = new THREE.ShaderMaterial({
          uniforms: {
            uTime: { value: 0 },
            color1: { value: new THREE.Color(0xFEDA24) }, // Golden yellow
            color2: { value: new THREE.Color(0xEF941F) }, // Orange
            color3: { value: new THREE.Color(0xFFE55C) }, // Light yellow
            lightPosition: { value: new THREE.Vector3(5, 5, 5) },
            viewPosition: { value: camera.position },
          },
          vertexShader: `
            uniform float uTime;
            
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying vec2 vUv;
            varying vec3 vWorldPosition;
            varying vec3 vViewDir;
            
            void main() {
              vNormal = normalize(normalMatrix * normal);
              vPosition = position;
              vUv = uv;
              vec4 worldPosition = modelMatrix * vec4(position, 1.0);
              vWorldPosition = worldPosition.xyz;
              vViewDir = normalize(cameraPosition - worldPosition.xyz);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform float uTime;
            uniform vec3 color1;
            uniform vec3 color2;
            uniform vec3 color3;
            uniform vec3 lightPosition;
            uniform vec3 viewPosition;
            
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying vec2 vUv;
            varying vec3 vWorldPosition;
            varying vec3 vViewDir;
            
            // HSV to RGB conversion for holographic effect
            vec3 hsv2rgb(vec3 c) {
              vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
              vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
              return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
            }
            
            void main() {
              // Base gradient based on position
              float gradientFactor = (vPosition.y + 1.0) * 0.5;
              vec3 baseColor = mix(color2, color1, gradientFactor);
              baseColor = mix(baseColor, color3, smoothstep(0.6, 1.0, gradientFactor) * 0.4);
              
              // Lighting calculations
              vec3 lightDir = normalize(lightPosition - vWorldPosition);
              vec3 viewDir = normalize(vViewDir);
              vec3 halfDir = normalize(lightDir + viewDir);
              vec3 reflectDir = reflect(-lightDir, vNormal);
              
              // Fresnel effect (view-dependent)
              float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.5);
              
              // Holographic/iridescent effect on edges
              float hue = fract(fresnel * 2.0 + uTime * 0.1 + vPosition.x * 0.5 + vPosition.y * 0.3);
              vec3 holoColor = hsv2rgb(vec3(hue, 0.6, 1.0));
              
              // Energy pulse wave
              float pulse = sin(vPosition.y * 8.0 - uTime * 3.0) * 0.5 + 0.5;
              pulse = smoothstep(0.3, 0.7, pulse);
              
              // Diffuse lighting
              float diff = max(dot(vNormal, lightDir), 0.0);
              
              // Specular highlights (Blinn-Phong)
              float spec = pow(max(dot(vNormal, halfDir), 0.0), 128.0);
              
              // Secondary specular for extra shine
              float spec2 = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
              
              // Animated rim glow
              float rimPulse = sin(uTime * 2.0) * 0.15 + 0.85;
              float rimGlow = fresnel * rimPulse;
              
              // Combine everything
              vec3 ambient = baseColor * 0.25;
              vec3 diffuse = baseColor * diff * 0.7;
              vec3 specular = vec3(1.0, 0.95, 0.8) * (spec * 0.8 + spec2 * 0.3);
              
              // Holographic rim
              vec3 holoRim = holoColor * rimGlow * 0.5;
              
              // Energy pulse glow
              vec3 pulseGlow = color1 * pulse * fresnel * 0.3;
              
              // Golden rim light
              vec3 rimLight = color1 * rimGlow * 0.4;
              
              vec3 finalColor = ambient + diffuse + specular + holoRim + pulseGlow + rimLight;
              
              // Add subtle bloom on bright areas
              float brightness = dot(finalColor, vec3(0.299, 0.587, 0.114));
              finalColor += finalColor * smoothstep(0.8, 1.2, brightness) * 0.2;
              
              gl_FragColor = vec4(finalColor, 1.0);
            }
          `,
          side: THREE.DoubleSide,
        })
        
        materialRef.current = holographicMaterial
        
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh
            mesh.castShadow = true
            mesh.receiveShadow = true
            mesh.material = holographicMaterial
          }
        })
        
        // Create environment map for reflections
        // Generate simple reflection environment
        const pmremGenerator = new THREE.PMREMGenerator(renderer)
        pmremGenerator.compileEquirectangularShader()
        
        // Create a simple gradient environment
        const envScene = new THREE.Scene()
        const envGeo = new THREE.SphereGeometry(500, 64, 64)
        const envMat = new THREE.ShaderMaterial({
          side: THREE.BackSide,
          uniforms: {
            topColor: { value: new THREE.Color(0xFEDA24) },
            bottomColor: { value: new THREE.Color(0x000000) },
          },
          vertexShader: `
            varying vec3 vWorldPosition;
            void main() {
              vec4 worldPosition = modelMatrix * vec4(position, 1.0);
              vWorldPosition = worldPosition.xyz;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform vec3 topColor;
            uniform vec3 bottomColor;
            varying vec3 vWorldPosition;
            void main() {
              float h = normalize(vWorldPosition).y;
              gl_FragColor = vec4(mix(bottomColor, topColor, max(h, 0.0)), 1.0);
            }
          `,
        })
        envScene.add(new THREE.Mesh(envGeo, envMat))
        
        const envTexture = pmremGenerator.fromScene(envScene).texture
        scene.environment = envTexture
        
        modelRef.current = model
        scene.add(model)
        setIsLoaded(true)
      },
      (progress) => {
        const percent = (progress.loaded / progress.total) * 100
        setLoadingProgress(percent)
      },
      (error) => {
        console.error('Error loading model:', error)
      }
    )
    
    // ============ ANIMATION LOOP ============
    let time = 0
    const animate = () => {
      time += 16
      animationRef.current = requestAnimationFrame(animate)
      
      // Update model rotation with smooth interpolation - follows mouse on both axes
      if (modelRef.current) {
        const rotationSpeed = 0.08 // Faster for more responsive feel
        // Smooth interpolation on both X and Y axes
        modelRef.current.rotation.x += (targetRotationRef.current.x - modelRef.current.rotation.x) * rotationSpeed
        modelRef.current.rotation.y += (targetRotationRef.current.y - modelRef.current.rotation.y) * rotationSpeed
        
        // Gentle floating animation
        modelRef.current.position.y = Math.sin(time * 0.001) * 0.08
      }
      
      // Update particle system
      if (particleSystemRef.current) {
        particleSystemRef.current.update(time)
      }
      
      // Update holographic shader time
      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value = time * 0.001
      }
      
      // Animate point lights
      pointLight1.position.x = Math.sin(time * 0.001) * 3
      pointLight1.position.z = Math.cos(time * 0.001) * 3
      
      pointLight2.position.x = Math.cos(time * 0.0015) * 3
      pointLight2.position.y = Math.sin(time * 0.0015) * 2
      
      renderer.render(scene, camera)
    }
    
    animate()
    
    // Event listeners
    globalThis.addEventListener('mousemove', handleMouseMove)
    
    // Resize handler - use canvas container (left half) dimensions
    const handleResize = () => {
      if (!canvasContainerRef.current || !cameraRef.current || !rendererRef.current) return
      
      const width = canvasContainerRef.current.clientWidth
      const height = canvasContainerRef.current.clientHeight
      
      cameraRef.current.aspect = width / height
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(width, height)
    }
    
    globalThis.addEventListener('resize', handleResize)
    
    // Cleanup
    return () => {
      globalThis.removeEventListener('mousemove', handleMouseMove)
      globalThis.removeEventListener('resize', handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      renderer.dispose()
    }
  }, [handleMouseMove])
  
  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden"
    >
      {/* Subtle radial gradient overlay for depth - lets global orbs show through */}
      <div 
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 0%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.4) 100%)',
        }}
      />
      
      {/* Main content container */}
      <div className="relative z-10 flex h-full">
        {/* Left side - 3D Scene */}
        <div ref={canvasContainerRef} className="w-1/2 h-full relative">
          {/* Loading indicator */}
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="text-center">
                <div className="w-24 h-24 relative">
                  <svg className="animate-spin" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="rgba(254, 218, 36, 0.2)"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#FEDA24"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${loadingProgress * 2.51} 251`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[#FEDA24] font-bold">
                    {Math.round(loadingProgress)}%
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {/* Three.js Canvas */}
          <canvas 
            ref={canvasRef}
            className={`w-full h-full transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
          
          {/* Glow effect behind model */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(254, 218, 36, 0.15) 0%, rgba(239, 148, 31, 0.05) 40%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />
        </div>
        
        {/* Right side - Text content */}
        <div className="w-1/2 h-full flex items-center justify-center px-12 lg:px-20">
          <motion.div 
            className="max-w-xl"
            style={{ x: textX, y: textY }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#FEDA24]/30 bg-[#FEDA24]/5 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-[#FEDA24] animate-pulse" />
              <span className="text-[#FEDA24] text-sm font-medium tracking-wide uppercase">
                AI Marketplace
              </span>
            </motion.div>
            
            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-6"
              style={{ fontFamily: 'var(--font-inria-sans), sans-serif' }}
            >
              The AI Marketplace{' '}
              <span 
                className="bg-gradient-to-r from-[#FEDA24] via-[#FFE55C] to-[#EF941F] bg-clip-text text-transparent"
                style={{ fontFamily: 'var(--font-instrument-serif), serif', fontStyle: 'italic' }}
              >
                for Everyone
              </span>
            </motion.h1>
            
            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="text-lg lg:text-xl text-white/70 leading-relaxed mb-10"
              style={{ fontFamily: 'var(--font-inria-sans), sans-serif' }}
            >
              A curated AI marketplace where anyone can discover, trust, and use 
              the right tools instantly — no technical skills required.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="flex items-center gap-4"
            >
              <Link href="/waitlist">
                <motion.button
                  className="group relative px-8 py-4 rounded-full font-semibold text-black overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #FEDA24 0%, #EF941F 100%)',
                    fontFamily: 'var(--font-inria-sans), sans-serif',
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Join Waitlist
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      className="transition-transform group-hover:translate-x-1"
                    >
                      <path 
                        d="M5 12H19M19 12L12 5M19 12L12 19" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(135deg, #FFE55C 0%, #FEDA24 100%)',
                    }}
                  />
                </motion.button>
              </Link>
              
              <motion.button
                className="px-8 py-4 rounded-full font-semibold text-white border border-white/20 backdrop-blur-sm hover:border-[#FEDA24]/50 hover:bg-white/5 transition-all duration-300"
                style={{ fontFamily: 'var(--font-inria-sans), sans-serif' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </motion.div>
            
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              className="flex items-center gap-8 mt-12 pt-8 border-t border-white/10"
            >
              {[
                { value: '100+', label: 'AI Tools', id: 'tools' },
                { value: '50K+', label: 'Users', id: 'users' },
                { value: '99%', label: 'Uptime', id: 'uptime' },
              ].map((stat) => (
                <div key={stat.id} className="text-center">
                  <div 
                    className="text-2xl lg:text-3xl font-bold text-[#FEDA24]"
                    style={{ fontFamily: 'var(--font-inria-sans), sans-serif' }}
                  >
                    {stat.value}
                  </div>
                  <div 
                    className="text-sm text-white/50 mt-1"
                    style={{ fontFamily: 'var(--font-inria-sans), sans-serif' }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      
      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2 }}
      >
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-2.5 rounded-full bg-[#FEDA24]"
            animate={{ y: [0, 8, 0], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
      
      {/* Cursor glow effect */}
      <motion.div
        className="fixed w-64 h-64 rounded-full pointer-events-none z-50 mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(254, 218, 36, 0.1) 0%, transparent 70%)',
          x: useTransform(smoothMouseX, (v) => v * (containerRef.current?.clientWidth ?? 0) - 128),
          y: useTransform(smoothMouseY, (v) => v * (containerRef.current?.clientHeight ?? 0) - 128),
        }}
      />
    </div>
  )
}
