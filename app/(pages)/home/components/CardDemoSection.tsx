'use client'

import { Canvas } from '@react-three/fiber'
import { Card3D } from '@/components/3d/Card3D'

export function CardDemoSection() {
  return (
    <section className="min-h-screen relative overflow-hidden py-20" style={{ backgroundColor: '#050505' }}>
      <div className="container mx-auto px-4 h-full flex items-center justify-center">
        <div className="w-full h-[600px] relative">
          <Canvas camera={{ position: [0, 0, 10], fov: 50 }} gl={{ alpha: false }} dpr={[1, 2]}>
            {/* Environment map for reflections (matching marching cubes) */}
            {/* <Environment preset="sunset" /> */}
            
            {/* Enhanced lighting setup for better visibility */}
            {/* 1. Main Directional Light - Front-top illumination */}
            <directionalLight
              position={[0, 2, 5]}
              intensity={5}
              color="#ffffff"
            />

            {/* 2. Secondary Directional Light - Top-right */}
            <directionalLight
              position={[3, 3, 2]}
              intensity={4}
              color="#ffffff"
            />

            {/* 3. Fill Directional Light - Left side */}
            <directionalLight
              position={[-3, 1, 3]}
              intensity={3}
              color="#ffffff"
            />

            {/* 4. Back Directional Light - Rim lighting */}
            <directionalLight
              position={[0, -1, -5]}
              intensity={2}
              color="#ff7c00"
            />

            {/* 5. Point Light - Orange accent (matching marching cubes 0xff7c00) */}
            <pointLight
              position={[0, 2, 6]}
              intensity={4}
              color="#ff7c00"
              distance={15}
              decay={1}
            />

            {/* 6. Additional Point Lights for each card */}
            <pointLight
              position={[-3.5, 1, 3]}
              intensity={3}
              color="#ffffff"
              distance={10}
              decay={1}
            />
            <pointLight
              position={[0, 1, 3]}
              intensity={3}
              color="#ffffff"
              distance={10}
              decay={1}
            />
            <pointLight
              position={[3.5, 1, 3]}
              intensity={3}
              color="#ffffff"
              distance={10}
              decay={1}
            />

            {/* 7. Ambient Light - Increased for better base visibility */}
            <ambientLight intensity={4} color="#404040" />

            {/* Three Card3D Components */}
            <Card3D text="discover" position={[-3.5, 0, 0]} />
            <Card3D text="subscribe" position={[0, 0, 0]} />
            <Card3D text="safety" position={[3.5, 0, 0]} />
          </Canvas>
        </div>
      </div>
    </section>
  )
}

