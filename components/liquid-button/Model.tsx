"use client";

import { useGLTF, MeshTransmissionMaterial } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useControls } from 'leva'

export default function Model() {
    const { nodes } = useGLTF('/assets/3d/pill.glb') as any
    const { viewport } = useThree()

    const materialProps = useControls({
        thickness: { value: 0.2, min: 0, max: 3, step: 0.05 },
        roughness: { value: 0, min: 0, max: 1, step: 0.1 },
        transmission: { value: 1, min: 0, max: 1, step: 0.1 },
        ior: { value: 1.2, min: 0, max: 3, step: 0.1 },
        chromaticAberration: { value: 0.02, min: 0, max: 1 },
        backside: { value: true },
    })
    
    if (!nodes?.Cube) {
        return null
    }
    
    return (
        <group scale={viewport.width / 1.8}>
            <mesh {...nodes.Cube}>
                <MeshTransmissionMaterial {...materialProps} />
            </mesh>
        </group>
    )
}