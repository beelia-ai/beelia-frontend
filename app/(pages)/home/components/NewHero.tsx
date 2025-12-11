'use client'

import LightRays from '@/components/LightRays'

export function NewHero() {
  return (
    <section className="h-screen bg-black relative overflow-hidden">
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
