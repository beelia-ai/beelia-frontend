'use client'

import React, { useRef, useEffect, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, MeshStandardMaterial, Color, Group } from 'three'
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
  readonly frameWidth?: number // Width of the frame border
  readonly hollowWidth?: number // Width of the hollow center area
  readonly hollowHeight?: number // Height of the hollow center area
}

export function Card3D({ 
  text = 'discover',
  width = 3.2, 
  height = 4.5, 
  depth = 0.05, 
  radius = 0.25,
  position = [0, 0, 0],
  frameWidth = 0.12, // Default frame border thickness
  hollowWidth = 1.8, // Default hollow center width
  hollowHeight = 2.5 // Default hollow center height
}: Card3DProps) {
  const frameGroupRef = useRef<Group>(null)
  const textRef = useRef<Mesh>(null)
  
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
  const frameMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: new Color('#FFB84D'), // Beelia yellow-orange blend (matching CoinModel)
        metalness: 1, // Fully metallic (matching marching cubes)
        roughness: 0.1, // Very smooth/shiny surface (matching marching cubes)
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

    // Apply subtle tilt to frame based on mouse position
    if (frameGroupRef.current) {
      frameGroupRef.current.rotation.x = currentRotX.current
      frameGroupRef.current.rotation.y = currentRotY.current
    }
    // Text rotates with the card
    if (textRef.current) {
      textRef.current.rotation.x = currentRotX.current
      textRef.current.rotation.y = currentRotY.current
    }
  })

  // Calculate frame dimensions - make borders thin
  const borderThickness = frameWidth
  const outerTopY = height / 2
  const outerBottomY = -height / 2
  const outerLeftX = -width / 2
  const outerRightX = width / 2

  return (
    <group position={position}>
      {/* Frame Group - creates 3D borders with hollow center */}
      <group ref={frameGroupRef}>
        {/* Top border - full width */}
        <group position={[0, outerTopY - borderThickness / 2, 0]}>
          <RoundedBox
            args={[width, borderThickness, depth]}
            radius={Math.min(radius, borderThickness * 0.4)}
            smoothness={4}
            material={frameMaterial}
          />
        </group>

        {/* Bottom border - full width */}
        <group position={[0, outerBottomY + borderThickness / 2, 0]}>
          <RoundedBox
            args={[width, borderThickness, depth]}
            radius={Math.min(radius, borderThickness * 0.4)}
            smoothness={4}
            material={frameMaterial}
          />
        </group>

        {/* Left border - full height, positioned at outer edge */}
        <group position={[outerLeftX + borderThickness / 2, 0, 0]}>
          <RoundedBox
            args={[borderThickness, height - borderThickness * 2, depth]}
            radius={Math.min(radius, borderThickness * 0.4)}
            smoothness={4}
            material={frameMaterial}
          />
        </group>

        {/* Right border - full height, positioned at outer edge */}
        <group position={[outerRightX - borderThickness / 2, 0, 0]}>
          <RoundedBox
            args={[borderThickness, height - borderThickness * 2, depth]}
            radius={Math.min(radius, borderThickness * 0.4)}
            smoothness={4}
            material={frameMaterial}
          />
        </group>
      </group>

      {/* 3D Text in the center of the hollow area */}
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

