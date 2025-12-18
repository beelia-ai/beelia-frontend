'use client'

import React, { useRef, useEffect, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, MeshStandardMaterial, Color } from 'three'
import { RoundedBox } from '@react-three/drei'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'

interface Card3DProps {
  readonly text?: string
  readonly width?: number
  readonly height?: number
  readonly depth?: number
  readonly radius?: number
  readonly position?: [number, number, number]
}

export function Card3D({ 
  text = 'discover',
  width = 2.5, 
  height = 3.5, 
  depth = 0.05, 
  radius = 0.25,
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

  // Text material matching the card material
  const textMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: new Color('#FFFFFF'), // White text
        metalness: 1, // Fully metallic
        roughness: 0.1, // Very smooth/shiny surface
        // envMap will be set by Environment component
      }),
    []
  )

  // Load font and create text geometry
  const [font, setFont] = useState<any>(null)
  const textRef = useRef<Mesh>(null)

  useEffect(() => {
    const loader = new FontLoader()
    // Load font from three.js examples
    loader.load(
      'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json',
      (loadedFont) => {
        setFont(loadedFont)
      }
    )
  }, [])

  // Create text geometry when font is loaded
  const textGeometry = useMemo(() => {
    if (!font || !text) return null
    const geometry = new TextGeometry(text.toLowerCase(), {
      font: font,
      size: 0.3,
      depth: 0.05,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.015,
      bevelSegments: 4,
    })
    geometry.computeBoundingBox()
    // Center the text
    const centerOffset = -0.5 * ((geometry.boundingBox?.max.x || 0) - (geometry.boundingBox?.min.x || 0))
    geometry.translate(centerOffset, 0, 0)
    return geometry
  }, [font, text])

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
    // Text rotates with the card
    if (textRef.current) {
      textRef.current.rotation.x = currentRotX.current
      textRef.current.rotation.y = currentRotY.current
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

      {/* 3D Text "discover" inside the card */}
      {textGeometry && (
        <mesh
          ref={textRef}
          position={[0, 0, depth / 2 + 0.02]}
          geometry={textGeometry}
          material={textMaterial}
        />
      )}
    </group>
  )
}

