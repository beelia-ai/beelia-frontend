'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { cn } from '@/lib/utils'

export interface ParticleSpritesBackgroundProps {
  readonly className?: string
  readonly particleCount?: number
  readonly fogDensity?: number
  readonly colors?: number[][] // Array of HSL color arrays [[h, s, l], ...]
  readonly sizes?: number[] // Array of particle sizes
  readonly followMouse?: boolean
  readonly mouseSensitivity?: number
  readonly cycleColors?: boolean // Whether to cycle through colors over time
  readonly speed?: number // Animation speed multiplier (default: 1.0, lower = slower)
}

export function ParticleSpritesBackground({
  className,
  particleCount = 100,
  fogDensity = 0.0008,
  colors = [
    [1, 0.2, 0.5],
    [0.95, 0.1, 0.5],
    [0.9, 0.05, 0.5],
    [0.85, 0, 0.5],
    [0.8, 0, 0.5]
  ],
  sizes = [20, 15, 10, 8, 5],
  followMouse = true,
  mouseSensitivity = 0.05,
  cycleColors = true,
  speed = 1.0
}: ParticleSpritesBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const materialsRef = useRef<THREE.PointsMaterial[]>([])
  const particlesRef = useRef<THREE.Points[]>([])
  const animationFrameRef = useRef<number | null>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const windowHalfRef = useRef({ x: 0, y: 0 })

  // Create sprite textures programmatically
  const createSpriteTexture = (size: number, opacity: number = 1): THREE.Texture => {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const context = canvas.getContext('2d')!
    
    // Create a radial gradient for the sprite
    const gradient = context.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    )
    gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`)
    gradient.addColorStop(0.5, `rgba(255, 255, 255, ${opacity * 0.5})`)
    gradient.addColorStop(1, `rgba(255, 255, 255, 0)`)
    
    context.fillStyle = gradient
    context.fillRect(0, 0, size, size)
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  }

  useEffect(() => {
    if (!containerRef.current) return

    let isMounted = true

    // Initialize window half dimensions
    windowHalfRef.current = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    }

    // Scene setup
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x000000, fogDensity)
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      2000
    )
    camera.position.z = 1000
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Create geometry with vertices
    const geometry = new THREE.BufferGeometry()
    const vertices: number[] = []

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * 2000 - 1000
      const y = Math.random() * 2000 - 1000
      const z = Math.random() * 2000 - 1000
      vertices.push(x, y, z)
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))

    // Create sprite textures
    const spriteTextures = sizes.map((size, index) => {
      const opacity = 1 - index * 0.15 // Decreasing opacity for smaller sprites
      return createSpriteTexture(size * 2, opacity)
    })

    // Create materials and particles
    const materials: THREE.PointsMaterial[] = []
    const particles: THREE.Points[] = []

    for (let i = 0; i < colors.length && i < sizes.length; i++) {
      const color = colors[i]
      const sprite = spriteTextures[i]
      const size = sizes[i]

      const material = new THREE.PointsMaterial({
        size: size,
        map: sprite,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true
      })
      material.color.setHSL(color[0], color[1], color[2], THREE.SRGBColorSpace)
      materials.push(material)

      const particleSystem = new THREE.Points(geometry, material)
      particleSystem.rotation.x = Math.random() * 6
      particleSystem.rotation.y = Math.random() * 6
      particleSystem.rotation.z = Math.random() * 6
      particles.push(particleSystem)

      scene.add(particleSystem)
    }

    materialsRef.current = materials
    particlesRef.current = particles

    // Mouse move handler
    const handlePointerMove = (event: PointerEvent) => {
      if (event.isPrimary === false) return
      mouseRef.current = {
        x: event.clientX - windowHalfRef.current.x,
        y: event.clientY - windowHalfRef.current.y
      }
    }

    // Window resize handler
    const handleResize = () => {
      if (!isMounted || !camera || !renderer) return

      windowHalfRef.current = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      }

      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)

      // Update touch-action based on screen size
      if (followMouse) {
        const isMobile = window.innerWidth < 768
        document.body.style.touchAction = isMobile ? '' : 'none'
      }
    }

    if (followMouse) {
      // Only disable touch-action on desktop, allow scrolling on mobile
      const isMobile = window.innerWidth < 768
      if (!isMobile) {
        document.body.style.touchAction = 'none'
      }
      document.body.addEventListener('pointermove', handlePointerMove)
    }

    window.addEventListener('resize', handleResize)

    // Animation loop with frame rate limiting to reduce CPU/GPU usage
    const targetFPS = 60 // Cap at 60 FPS for background effect - sufficient for smooth visuals
    const frameInterval = 1000 / targetFPS
    let lastFrameTime = 0

    const animate = (currentTime: number = 0) => {
      if (!isMounted) return

      animationFrameRef.current = requestAnimationFrame(animate)

      // Frame rate limiting - skip frames to maintain target FPS
      const elapsed = currentTime - lastFrameTime
      if (elapsed < frameInterval) return
      lastFrameTime = currentTime - (elapsed % frameInterval)

      const time = Date.now() * 0.00005 * speed

      // Update camera position based on mouse
      if (followMouse && camera) {
        camera.position.x += (mouseRef.current.x - camera.position.x) * mouseSensitivity
        camera.position.y += (-mouseRef.current.y - camera.position.y) * mouseSensitivity
        camera.lookAt(scene.position)
      }

      // Rotate particle systems
      particles.forEach((object, i) => {
        if (object instanceof THREE.Points) {
          object.rotation.y = time * (i < 4 ? i + 1 : -(i + 1))
        }
      })

      // Update material colors (cycling through hues only if enabled)
      if (cycleColors) {
        materials.forEach((material, i) => {
          const color = colors[i]
          if (color) {
            const h = ((360 * (color[0] + time)) % 360) / 360
            material.color.setHSL(h, color[1], color[2], THREE.SRGBColorSpace)
          }
        })
      } else {
        // Keep colors static - set them once if not already set
        materials.forEach((material, i) => {
          const color = colors[i]
          if (color && !material.userData.colorSet) {
            material.color.setHSL(color[0], color[1], color[2], THREE.SRGBColorSpace)
            material.userData.colorSet = true
          }
        })
      }

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup
    return () => {
      isMounted = false

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      if (followMouse) {
        document.body.removeEventListener('pointermove', handlePointerMove)
        // Reset touch-action on cleanup
        document.body.style.touchAction = ''
      }

      window.removeEventListener('resize', handleResize)

      // Dispose of materials and textures
      materials.forEach((material) => {
        if (material.map) {
          material.map.dispose()
        }
        material.dispose()
      })

      // Remove particles from scene
      particles.forEach((particle) => {
        scene.remove(particle)
        particle.geometry.dispose()
      })

      // Dispose of renderer
      if (rendererRef.current) {
        rendererRef.current.dispose()
        rendererRef.current.domElement.remove()
      }
    }
  }, [particleCount, fogDensity, colors, sizes, followMouse, mouseSensitivity, cycleColors, speed])

  return (
    <div
      ref={containerRef}
      className={cn('inset-0 w-full h-full', className)}
      style={{ width: '100%', height: '100%' }}
    />
  )
}
