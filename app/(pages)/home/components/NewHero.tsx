'use client'

import LightRays from '@/components/LightRays'
import { ParticleSpritesBackground } from '@/components/ui'

export function NewHero() {
  return (
    <section className="h-screen bg-black relative overflow-hidden">
      {/* Particle Sprites Background */}
      <ParticleSpritesBackground 
        className="absolute inset-0"
        particleCount={10000}
        followMouse={true}
        mouseSensitivity={0.05}
      />
      
      {/* Light Rays */}
      <LightRays 
       raysOrigin="top-center"
       raysColor="#4699F8"
       raysSpeed={1}
       lightSpread={0.5}
       rayLength={3}
       fadeDistance={1}
       saturation={1}
       followMouse={true}
       mouseInfluence={0.1}
       noiseAmount={0}
       distortion={0}
       className="absolute inset-0"
      />
    </section>
  )
}
