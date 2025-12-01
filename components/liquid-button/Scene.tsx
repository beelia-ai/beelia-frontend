"use client";

import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import Model from './Model';

interface LiquidButtonProps {
  onClick?: () => void;
  className?: string;
  width?: number;
  height?: number;
}

export default function LiquidButton({ 
  onClick, 
  className,
  width = 245,
  height = 65 
}: LiquidButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={`overflow-visible cursor-pointer border-0 p-0 bg-transparent ${className ?? ''}`}
      style={{ width, height }}
    >
      <Canvas
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0, 2], fov: 50 }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <Model />
        <directionalLight intensity={3} position={[0, 2, 3]} />
        <directionalLight intensity={2} position={[-2, -2, -2]} />
        <ambientLight intensity={1.5} />
        <Environment preset="city" />
      </Canvas>
    </button>
  );
}