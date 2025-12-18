'use client'

import { Canvas } from '@react-three/fiber'
import { Card3D } from '@/components/3d/Card3D'

export function CardDemoSection() {
  return (
    <section className="min-h-screen relative overflow-hidden py-20" style={{ backgroundColor: '#050505' }}>
      <div className="container mx-auto px-4 h-full flex items-center justify-center">
        <div className="w-full h-[600px] relative">
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }} gl={{ alpha: false }} dpr={[1, 2]}>
            {/* Environment map for reflections (matching marching cubes) */}
            {/* <Environment preset="sunset" /> */}
            
            {/* Lighting setup matching marching cubes exactly */}
            {/* 1. Directional Light - Main illumination */}
            <directionalLight
              position={[0.5, 0.5, 1]}
              intensity={3}
              color="#ffffff"
            />

            {/* 2. Point Light - Orange light (matching marching cubes 0xff7c00) */}
            <pointLight
              position={[0, 0, 5]}
              intensity={3}
              color="#ff7c00"
              distance={0}
              decay={0}
            />

            {/* 3. Ambient Light (matching marching cubes 0x323232, intensity 3) */}
            <ambientLight intensity={3} color="#323232" />

            {/* Three Card3D Components */}
            <Card3D text="discover" position={[-4, 0, 0]} />
            <Card3D text="subscribe" position={[0, 0, 0]} />
            <Card3D text="safety" position={[4, 0, 0]} />
          </Canvas>
        </div>
      </div>
    </section>
  )
}

