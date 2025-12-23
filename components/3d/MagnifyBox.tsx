'use client'

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

interface MagnifyBoxProps {
  width?: number
  height?: number
  className?: string
  rotationAngle?: number // Rotation angle in degrees
  preserveOriginalMaterials?: boolean // If true, keeps original materials from GLB; if false, applies Beelia theme
}

export function MagnifyBox({ 
  width = 100, 
  height = 100, 
  className = '', 
  rotationAngle = 0,
  preserveOriginalMaterials = false 
}: MagnifyBoxProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const modelRef = useRef<THREE.Group | null>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera - perspective camera for small box
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100)
    camera.position.set(0, 0, 3)
    cameraRef.current = camera

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    rendererRef.current = renderer

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xFEDA24, 1.5)
    directionalLight.position.set(2, 2, 2)
    scene.add(directionalLight)

    const fillLight = new THREE.DirectionalLight(0x88CCFF, 0.5)
    fillLight.position.set(-2, 1, -1)
    scene.add(fillLight)

    // Load shield.glb model
    const loader = new GLTFLoader()
    
    loader.load(
      '/assets/3d/shield.glb',
      (gltf) => {
        const model = gltf.scene

        // Center and scale the model to fit nicely in the box
        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())

        // Scale to fit within the box (leaving some padding)
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 1.5 / maxDim // Scale to fit nicely in the view
        model.scale.setScalar(scale)

        // Center the model
        model.position.x = -center.x * scale
        model.position.y = -center.y * scale
        model.position.z = -center.z * scale

        // Apply rotation angle (convert degrees to radians) - rotate around X axis for forward tilt
        if (rotationAngle !== 0) {
          model.rotation.x = (rotationAngle * Math.PI) / 180
        }

        // Handle materials: preserve originals or apply Beelia theme
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh
            const originalMaterial = mesh.material
            
            if (preserveOriginalMaterials) {
              // Keep original materials from GLB, just clone to avoid modifying originals
              if (originalMaterial) {
                mesh.material = originalMaterial.clone()
              }
            } else {
              // Apply Beelia theme - check if GLB has materials and edit them
              if (originalMaterial && originalMaterial instanceof THREE.Material) {
                // Clone the material to avoid modifying the original
                const material = originalMaterial.clone()
                
                // Edit material properties if it's a MeshStandardMaterial or MeshPhysicalMaterial
                if (material instanceof THREE.MeshStandardMaterial || material instanceof THREE.MeshPhysicalMaterial) {
                  // Override with Beelia theme colors while preserving other properties
                  material.color.setHex(0xFEDA24) // Beelia golden yellow
                  material.metalness = 0.7
                  material.roughness = 0.3
                  material.emissive.setHex(0x000000)
                  material.emissiveIntensity = 0
                } else if (material instanceof THREE.MeshBasicMaterial) {
                  // For basic materials, just change color
                  material.color.setHex(0xFEDA24)
                }
                
                mesh.material = material
              } else {
                // No material in GLB, create new one
                const material = new THREE.MeshStandardMaterial({
                  color: 0xFEDA24, // Beelia golden yellow
                  metalness: 0.7,
                  roughness: 0.3,
                  emissive: 0x000000,
                  emissiveIntensity: 0,
                })
                mesh.material = material
              }
            }
            
            mesh.castShadow = false
            mesh.receiveShadow = false
          }
        })

        modelRef.current = model
        scene.add(model)
      },
      undefined,
      (error) => {
        console.error('Error loading shield.glb:', error)
      }
    )

    // Animation loop
    let time = 0
    const animate = () => {
      time += 16
      animationRef.current = requestAnimationFrame(animate)

      // Gentle rotation animation (preserve the base X rotation from rotationAngle)
      if (modelRef.current) {
        const baseXRotation = (rotationAngle * Math.PI) / 180
        modelRef.current.rotation.y = time * 0.0005 // Slow rotation
        modelRef.current.rotation.x = baseXRotation + Math.sin(time * 0.001) * 0.1 // Base 30-degree tilt + gentle bob
      }

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      renderer.dispose()
    }
  }, [width, height, rotationAngle, preserveOriginalMaterials])

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
    </div>
  )
}

