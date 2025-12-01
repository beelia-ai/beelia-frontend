"use client";

import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import Model from './Model';

export default function Scene() {
  return (
    <div className="w-full h-screen bg-white">
      <Canvas>
        <color attach="background" args={['#ffffff']} />
        <Model />
        <directionalLight intensity={3} position={[0, 2, 3]} />
        <directionalLight intensity={2} position={[-2, -2, -2]} />
        <ambientLight intensity={1} />
        <Environment preset="city"/>
      </Canvas>
    </div>
  );
}