'use client'

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

interface BlackHoleProps {
  className?: string
}

export function BlackHole({ className = '' }: BlackHoleProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const modelRef = useRef<THREE.Group | null>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera - positioned to zoom out and show from a different angle
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000)
    // Position camera further back and at an angle (matching the reference images)
    camera.position.set(0, 1.5, 10)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    // Renderer with better settings for emissive materials
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    rendererRef.current = renderer

    // Lighting setup - darker ambient for space, with accent lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
    scene.add(ambientLight)

    // Main light from above to highlight the accretion disk
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
    directionalLight.position.set(0, 3, 5)
    scene.add(directionalLight)

    // Warm accent light for the disk glow
    const warmLight = new THREE.DirectionalLight(0xFFA500, 0.8)
    warmLight.position.set(2, 1, 3)
    scene.add(warmLight)

    // Load BlackHole.glb model
    const loader = new GLTFLoader()
    
    loader.load(
      '/assets/3d/BlackHole.glb',
      (gltf) => {
        const model = gltf.scene
        
        // Ensure the model is visible
        model.visible = true

        // Center and scale the model
        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())

        // Scale to fit nicely (zoomed out) - adjust scale to match reference
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 4.5 / maxDim // Larger scale value = more zoomed out
        model.scale.setScalar(scale)

        // Center the model
        model.position.x = -center.x * scale
        model.position.y = -center.y * scale
        model.position.z = -center.z * scale

        // Set initial rotation angle to match reference images
        // Slight tilt to show the disk from above
        model.rotation.x = Math.PI * 0.05 // Very slight tilt
        model.rotation.y = Math.PI * 0.15 // Rotated about 27 degrees

        // Preserve and enhance original materials from GLB
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh
            const originalMaterial = mesh.material
            
            if (originalMaterial) {
              // Handle both single materials and material arrays
              const materials = Array.isArray(originalMaterial) 
                ? originalMaterial 
                : [originalMaterial]
              
              const clonedMaterials = materials.map((mat) => {
                const material = mat.clone()
                
                // Enhance emissive materials for the accretion disk glow
                if (material instanceof THREE.MeshStandardMaterial || 
                    material instanceof THREE.MeshPhysicalMaterial ||
                    material instanceof THREE.MeshBasicMaterial ||
                    material instanceof THREE.MeshLambertMaterial) {
                  // Ensure emissive properties are preserved and enhanced
                  if (material.emissive) {
                    material.emissiveIntensity = material.emissiveIntensity || 1.0
                  }
                  // Make sure the material is visible
                  material.transparent = material.transparent || false
                  material.opacity = material.opacity || 1.0
                  // Ensure proper rendering
                  material.needsUpdate = true
                }
                
                return material
              })
              
              mesh.material = Array.isArray(originalMaterial) 
                ? clonedMaterials 
                : clonedMaterials[0]
            }
            
            mesh.castShadow = false
            mesh.receiveShadow = false
          }
        })

        modelRef.current = model
        scene.add(model)
        
        // Force initial render after model loads
        if (rendererRef.current && cameraRef.current) {
          rendererRef.current.render(scene, cameraRef.current)
        }
      },
      (progress) => {
        // Optional: log loading progress
        if (progress.lengthComputable) {
          const percentComplete = (progress.loaded / progress.total) * 100
          console.log('BlackHole model loading:', percentComplete.toFixed(2) + '%')
        }
      },
      (error) => {
        console.error('Error loading BlackHole.glb:', error)
      }
    )

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return
      
      const newWidth = containerRef.current.clientWidth
      const newHeight = containerRef.current.clientHeight
      
      cameraRef.current.aspect = newWidth / newHeight
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(newWidth, newHeight)
    }

    window.addEventListener('resize', handleResize)

    // Animation loop - very slow or no rotation (no auto-start animation)
    let time = 0
    const animate = () => {
      time += 16
      animationRef.current = requestAnimationFrame(animate)

      // Very slow rotation (almost static) - no auto-start animation
      if (modelRef.current) {
        // Minimal rotation, almost static
        modelRef.current.rotation.y += 0.0001
      }

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
    </div>
  )
}

