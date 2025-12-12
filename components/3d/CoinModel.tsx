'use client'

import React, { useRef, useMemo, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Group, PointLight, Mesh, MeshStandardMaterial, Color, Box3, Vector3 } from 'three'

export function CoinModel() {
    const { scene } = useGLTF('/assets/3d/DollarBill.glb')
    const spinRef = useRef<Group>(null)
    const pointLight1Ref = useRef<PointLight>(null)
    const pointLight2Ref = useRef<PointLight>(null)
    
    // Global mouse tracking for subtle tilt
    const mouseX = useRef(0)
    const mouseY = useRef(0)
    const targetRotX = useRef(0)
    const targetRotY = useRef(0)
    const currentRotX = useRef(0)
    const currentRotY = useRef(0)

    // Clone the scene to avoid modifying the cached version
    const clonedScene = useMemo(() => scene.clone(), [scene])
    
    // Global mouse tracking - works even outside Canvas
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Normalize mouse position to -1 to 1 based on window dimensions
            mouseX.current = (e.clientX / globalThis.innerWidth) * 2 - 1
            mouseY.current = (e.clientY / globalThis.innerHeight) * 2 - 1
            
            // Calculate target rotation (subtle tilt)
            targetRotX.current = mouseY.current * 0.2
            targetRotY.current = mouseX.current * 0.2
        }

        globalThis.addEventListener('mousemove', handleMouseMove)
        return () => globalThis.removeEventListener('mousemove', handleMouseMove)
    }, [])
    
    // Set the coin to stand upright once and flip vertically, and center it
    useEffect(() => {
        // First rotate the model
        clonedScene.rotation.set(Math.PI / 2, Math.PI, Math.PI) // Rotated 180 degrees clockwise on Y-axis
        
        // Then center the model (after rotation to get correct bounding box)
        const box = new Box3().setFromObject(clonedScene)
        const center = box.getCenter(new Vector3())
        clonedScene.position.set(-center.x, -center.y, -center.z)
        
        // Apply shiny metallic material to all meshes (marching cubes style)
        clonedScene.traverse((child) => {
            if (child instanceof Mesh) {
                // Create shiny metallic material with Beelia gradient colors
                child.material = new MeshStandardMaterial({
                    color: new Color('#FFB84D'), // Beelia yellow-orange blend
                    metalness: 1, // Fully metallic like the marching cubes 'shiny' material
                    roughness: 0.1, // Very smooth/shiny surface
                    emissive: new Color('#FF8C32'), // Beelia orange glow
                    emissiveIntensity: 0.3,
                    envMapIntensity: 1.5, // Enhanced environment reflections
                })
            }
        })
    }, [clonedScene])

    // Beelia gradient colors (from marching cubes palette)
    const beeliaYellow = '#FEDA24'
    const beeliaOrange = '#ff7c00' // Matching the marching cubes orange point light

    // Animations: light movements and subtle mouse tilt (marching cubes inspired)
    useFrame((state, delta) => {
        const time = state.clock.getElapsedTime()

        // Smooth interpolation for mouse-based rotation
        const smoothFactor = 0.1
        currentRotX.current += (targetRotX.current - currentRotX.current) * smoothFactor
        currentRotY.current += (targetRotY.current - currentRotY.current) * smoothFactor

        // Apply subtle tilt to coin based on mouse position (coin stays fixed in place)
        if (spinRef.current) {
            spinRef.current.rotation.x = currentRotX.current
            spinRef.current.rotation.y = currentRotY.current
        }

        // Orbit point light 1 around the coin (like marching cubes)
        if (pointLight1Ref.current) {
            pointLight1Ref.current.position.x = Math.cos(time * 2) * 1.5
            pointLight1Ref.current.position.z = Math.sin(time * 2) * 1.5
            pointLight1Ref.current.position.y = 0.5
            // Pulse intensity
            pointLight1Ref.current.intensity = 3 + Math.sin(time * 1.5) * 0.5
        }

        // Counter-orbit point light 2 for dynamic lighting
        if (pointLight2Ref.current) {
            pointLight2Ref.current.position.x = Math.sin(time * 2.5) * 1.8
            pointLight2Ref.current.position.z = Math.cos(time * 2.5) * 1.8
            pointLight2Ref.current.position.y = -0.3
        }
    })

    return (
        <group>
            {/* DollarBill group with shiny metallic material */}
            <group ref={spinRef} position={[0.08, 0, 0]}>
                <primitive object={clonedScene} scale={0.94} />
            </group>

            {/* Lighting setup matching marching cubes example */}
            
            {/* 1. Directional Light - Main illumination (intensity 3 like marching cubes) */}
            <directionalLight
                position={[0.5, 0.5, 1]}
                intensity={3}
                color="#ffffff"
            />

            {/* 2. Point Light - Orbiting orange light (matching marching cubes 0xff7c00) */}
            <pointLight
                ref={pointLight1Ref}
                position={[1.5, 0.5, 0]}
                intensity={3}
                color={beeliaOrange}
                distance={0}
                decay={0}
            />

            {/* 3. Second Point Light - Counter-orbiting yellow light */}
            <pointLight
                ref={pointLight2Ref}
                position={[-1.5, -0.3, 0]}
                intensity={2.5}
                color={beeliaYellow}
                distance={0}
                decay={0}
            />

            {/* 4. Ambient light (matching marching cubes 0x323232, intensity 3) */}
            <ambientLight intensity={3} color="#323232" />

            {/* 5. Additional accent lights for metallic highlights */}
            <pointLight
                position={[0, 2, 1]}
                intensity={1.5}
                color={beeliaYellow}
            />
            
            <pointLight
                position={[0, -1, -1]}
                intensity={1}
                color={beeliaOrange}
            />
        </group>
    )
}

useGLTF.preload('/assets/3d/DollarBill.glb')
