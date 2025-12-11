'use client'

import LightRays from '@/components/LightRays'
import { ParticleSpritesBackground } from '@/components/ui'

export function NewHero() {
  // Beelia gradient colors in HSL format (normalized 0-1)
  // #FEDA24 (gold), #EF941F (orange), #FF8C32 (bright orange)
  const beeliaColors = [
    [0.133, 0.99, 0.57], // #FEDA24 - bright gold
    [0.089, 0.87, 0.53], // #EF941F - orange
    [0.067, 1, 0.6],  // #FF8C32 - bright orange
    [0.089, 0.87, 0.53], // #EF941F - orange (repeat for gradient)
    [0.133, 0.99, 0.57]  // #FEDA24 - bright gold (repeat for gradient)
  ]

  return (
    <section className="h-screen bg-black relative overflow-hidden">
      {/* Particle Sprites Background */}
      <ParticleSpritesBackground 
        className="absolute inset-0"
        particleCount={300}
        followMouse={true}
        mouseSensitivity={0.05}
        colors={beeliaColors}
        cycleColors={false}
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
