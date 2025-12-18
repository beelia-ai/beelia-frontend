'use client'

import React, { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, MeshStandardMaterial, Color } from 'three'
import { RoundedBox } from '@react-three/drei'

interface Card3DProps {
  readonly width?: number
  readonly height?: number
  readonly depth?: number
  readonly radius?: number
  readonly position?: [number, number, number]
}

export function Card3D({ 
  width = 2, 
  height = 3, 
  depth = 0.05, 
  radius = 0.2,
  position = [0, 0, 0]
}: Card3DProps) {
  const cardRef = useRef<Mesh>(null)
  const borderRef = useRef<Mesh>(null)
  
  // Global mouse tracking for subtle tilt
  const mouseX = useRef(0)
  const mouseY = useRef(0)
  const targetRotX = useRef(0)
  const targetRotY = useRef(0)
  const currentRotX = useRef(0)
  const currentRotY = useRef(0)

  // Global mouse tracking - works even outside Canvas
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position to -1 to 1 based on window dimensions
      mouseX.current = (e.clientX / globalThis.innerWidth) * 2 - 1
      mouseY.current = (e.clientY / globalThis.innerHeight) * 2 - 1
      
      // Calculate target rotation (subtle tilt)
      targetRotX.current = mouseY.current * 0.15
      targetRotY.current = mouseX.current * 0.15
    }

    globalThis.addEventListener('mousemove', handleMouseMove)
    return () => globalThis.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Create material matching marching cubes "shiny" material
  // Using Beelia colors but with same properties as marching cubes
  const cardMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: new Color('#FFB84D'), // Beelia yellow-orange blend (matching CoinModel)
        metalness: 1, // Fully metallic (matching marching cubes)
        roughness: 0.1, // Very smooth/shiny surface (matching marching cubes)
        // envMap will be set by Environment component
      }),
    []
  )

  // Shiny border material (matching marching cubes shiny appearance)
  const borderMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: new Color('#FEDA24'), // Beelia yellow for border
        metalness: 1, // Fully metallic
        roughness: 0.1, // Same as marching cubes shiny material
        // envMap will be set by Environment component
      }),
    []
  )

  // Smooth interpolation for mouse-based rotation
  useFrame(() => {
    const smoothFactor = 0.1
    currentRotX.current += (targetRotX.current - currentRotX.current) * smoothFactor
    currentRotY.current += (targetRotY.current - currentRotY.current) * smoothFactor

    // Apply subtle tilt to card based on mouse position
    if (cardRef.current) {
      cardRef.current.rotation.x = currentRotX.current
      cardRef.current.rotation.y = currentRotY.current
    }
    if (borderRef.current) {
      borderRef.current.rotation.x = currentRotX.current
      borderRef.current.rotation.y = currentRotY.current
    }
  })

  return (
    <group position={position}>
      {/* Main card with curved edges */}
      <RoundedBox
        ref={cardRef}
        args={[width, height, depth]}
        radius={radius}
        smoothness={4}
        material={cardMaterial}
      />

      {/* Shiny border - slightly larger and offset */}
      <group position={[0, 0, -depth / 2 - 0.01]}>
        <RoundedBox
          ref={borderRef}
          args={[width + 0.08, height + 0.08, depth + 0.01]}
          radius={radius + 0.02}
          smoothness={4}
          material={borderMaterial}
        />
      </group>
    </group>
  )
}

