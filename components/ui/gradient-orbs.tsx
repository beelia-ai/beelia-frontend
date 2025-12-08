'use client'

import React, { useState, useEffect } from 'react'

export interface GradientOrb {
  size: number
  color1: string
  color2?: string
  opacity1?: number
  opacity2?: number
  top?: string
  bottom?: string
  left?: string
  right?: string
}

export interface GradientOrbsProps {
  orbs?: GradientOrb[]
  showGrid?: boolean
  gridOpacity?: number
  gridSize?: number
  className?: string
  animate?: boolean
  /** Number of randomly generated orbs (ignored if orbs prop is provided) */
  count?: number
}

// Color palette for orbs - warm golden/amber tones
const orbColors = [
  { color1: 'rgba(254, 218, 36, 0.18)', color2: 'rgba(239, 148, 31, 0.08)' },
  { color1: 'rgba(239, 148, 31, 0.15)', color2: 'rgba(254, 218, 36, 0.06)' },
  { color1: 'rgba(255, 215, 0, 0.12)', color2: 'rgba(255, 180, 0, 0.05)' },
  { color1: 'rgba(255, 193, 7, 0.14)', color2: 'rgba(255, 152, 0, 0.06)' },
  { color1: 'rgba(251, 191, 36, 0.16)', color2: 'rgba(245, 158, 11, 0.07)' },
  { color1: 'rgba(234, 179, 8, 0.13)', color2: 'rgba(202, 138, 4, 0.05)' },
  { color1: 'rgba(255, 200, 87, 0.11)', color2: 'rgba(255, 165, 0, 0.04)' },
  { color1: 'rgba(255, 170, 51, 0.14)', color2: 'rgba(255, 140, 0, 0.06)' },
]

// Generate truly random orbs with Math.random()
function generateRandomOrbs(count: number): GradientOrb[] {
  const orbs: GradientOrb[] = []
  
  for (let i = 0; i < count; i++) {
    // Size range: 200px to 800px with variety
    const size = Math.floor(200 + Math.random() * 600)
    
    // Pick a random color from palette
    const colorIndex = Math.floor(Math.random() * orbColors.length)
    const colors = orbColors[colorIndex]
    
    // Position: spread across the entire viewport with some overflow (-30% to 100%)
    const top = `${Math.floor(Math.random() * 130 - 30)}%`
    const left = `${Math.floor(Math.random() * 130 - 30)}%`
    
    orbs.push({
      size,
      color1: colors.color1,
      color2: colors.color2,
      top,
      left,
    })
  }
  
  return orbs
}

// Animation configs with longer durations and varied delays
const animationConfigs = [
  { duration: 15, delay: 0 },
  { duration: 20, delay: 2 },
  { duration: 12, delay: 4 },
  { duration: 18, delay: 1 },
  { duration: 25, delay: 3 },
  { duration: 14, delay: 5 },
  { duration: 22, delay: 1.5 },
  { duration: 16, delay: 3.5 },
  { duration: 19, delay: 0.5 },
  { duration: 13, delay: 4.5 },
]

export function GradientOrbs({
  orbs,
  showGrid = true,
  gridOpacity = 0.03,
  gridSize = 60,
  className = '',
  animate = true,
  count = 10,
}: GradientOrbsProps) {
  // Use state to store randomly generated orbs (generated once on mount)
  const [displayOrbs, setDisplayOrbs] = useState<GradientOrb[]>([])
  
  useEffect(() => {
    if (orbs) {
      setDisplayOrbs(orbs)
    } else {
      // Generate truly random orbs on mount
      setDisplayOrbs(generateRandomOrbs(count))
    }
  }, [orbs, count])

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Keyframe animations - more dramatic movement and opacity */}
      <style jsx>{`
        @keyframes orbDrift0 {
          0% { transform: translate(0, 0) scale(1); opacity: 0.9; }
          15% { transform: translate(60px, -40px) scale(1.15); opacity: 0.3; }
          30% { transform: translate(-30px, 80px) scale(0.9); opacity: 1; }
          45% { transform: translate(-80px, 20px) scale(1.2); opacity: 0.2; }
          60% { transform: translate(40px, -60px) scale(0.85); opacity: 0.8; }
          75% { transform: translate(-50px, -30px) scale(1.1); opacity: 0.15; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.9; }
        }
        @keyframes orbDrift1 {
          0% { transform: translate(0, 0) scale(1); opacity: 0.8; }
          20% { transform: translate(-70px, 50px) scale(1.25); opacity: 0.1; }
          40% { transform: translate(50px, -70px) scale(0.8); opacity: 0.95; }
          60% { transform: translate(80px, 30px) scale(1.15); opacity: 0.25; }
          80% { transform: translate(-40px, -50px) scale(0.95); opacity: 0.7; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.8; }
        }
        @keyframes orbDrift2 {
          0% { transform: translate(0, 0) scale(1); opacity: 0.7; }
          12% { transform: translate(40px, 60px) scale(1.3); opacity: 0.15; }
          25% { transform: translate(-60px, 30px) scale(0.75); opacity: 1; }
          37% { transform: translate(-20px, -80px) scale(1.2); opacity: 0.2; }
          50% { transform: translate(70px, -40px) scale(0.9); opacity: 0.85; }
          62% { transform: translate(30px, 50px) scale(1.1); opacity: 0.1; }
          75% { transform: translate(-50px, -20px) scale(0.85); opacity: 0.9; }
          87% { transform: translate(-80px, 40px) scale(1.25); opacity: 0.3; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
        }
        @keyframes orbDrift3 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          25% { transform: translate(-90px, 70px) scale(1.35); opacity: 0.1; }
          50% { transform: translate(60px, -50px) scale(0.7); opacity: 0.95; }
          75% { transform: translate(80px, 60px) scale(1.2); opacity: 0.2; }
          100% { transform: translate(0, 0) scale(1); opacity: 1; }
        }
        @keyframes orbDrift4 {
          0% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          16% { transform: translate(50px, -80px) scale(1.4); opacity: 0.05; }
          33% { transform: translate(-70px, -30px) scale(0.8); opacity: 0.9; }
          50% { transform: translate(-40px, 70px) scale(1.15); opacity: 0.15; }
          66% { transform: translate(80px, 40px) scale(0.9); opacity: 0.85; }
          83% { transform: translate(20px, -60px) scale(1.25); opacity: 0.25; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
        }
      `}</style>

      {/* Gradient orbs */}
      {displayOrbs.map((orb, index) => {
        const config = animationConfigs[index % animationConfigs.length]
        const driftVariant = index % 5
        return (
          <div
            key={index}
            className="absolute rounded-full"
            style={{
              width: `${orb.size}px`,
              height: `${orb.size}px`,
              background: orb.color2
                ? `radial-gradient(circle, ${orb.color1} 0%, ${orb.color2} 40%, transparent 70%)`
                : `radial-gradient(circle, ${orb.color1} 0%, transparent 60%)`,
              top: orb.top,
              bottom: orb.bottom,
              left: orb.left,
              right: orb.right,
              filter: 'blur(2px)',
              animation: animate
                ? `orbDrift${driftVariant} ${config.duration}s ease-in-out ${config.delay}s infinite`
                : 'none',
              willChange: animate ? 'transform, opacity' : 'auto',
            }}
          />
        )
      })}

      {/* Subtle grid pattern */}
      {showGrid && (
        <div
          className="absolute inset-0"
          style={{
            opacity: gridOpacity,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: `${gridSize}px ${gridSize}px`,
          }}
        />
      )}
    </div>
  )
}

export default GradientOrbs

