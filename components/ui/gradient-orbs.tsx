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

// Animation configs - varied durations, no delay for immediate start
const animationConfigs = [
  { duration: 25 },
  { duration: 30 },
  { duration: 22 },
  { duration: 28 },
  { duration: 35 },
  { duration: 24 },
  { duration: 32 },
  { duration: 27 },
  { duration: 20 },
  { duration: 26 },
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
      {/* Keyframe animations - smooth continuous drift with subtle opacity */}
      <style jsx>{`
        @keyframes orbDrift0 {
          0%, 100% { transform: translate(0, 0); opacity: 0.7; }
          25% { transform: translate(20px, -15px); opacity: 0.65; }
          50% { transform: translate(30px, 10px); opacity: 0.6; }
          75% { transform: translate(10px, 20px); opacity: 0.65; }
        }
        @keyframes orbDrift1 {
          0%, 100% { transform: translate(0, 0); opacity: 0.65; }
          25% { transform: translate(-18px, 12px); opacity: 0.6; }
          50% { transform: translate(-28px, -10px); opacity: 0.55; }
          75% { transform: translate(-10px, -22px); opacity: 0.6; }
        }
        @keyframes orbDrift2 {
          0%, 100% { transform: translate(0, 0); opacity: 0.6; }
          25% { transform: translate(15px, 22px); opacity: 0.55; }
          50% { transform: translate(-12px, 28px); opacity: 0.5; }
          75% { transform: translate(-25px, 8px); opacity: 0.55; }
        }
        @keyframes orbDrift3 {
          0%, 100% { transform: translate(0, 0); opacity: 0.75; }
          25% { transform: translate(-22px, -12px); opacity: 0.7; }
          50% { transform: translate(-10px, -30px); opacity: 0.65; }
          75% { transform: translate(18px, -15px); opacity: 0.7; }
        }
      `}</style>

      {/* Gradient orbs */}
      {displayOrbs.map((orb, index) => {
        const config = animationConfigs[index % animationConfigs.length]
        const driftVariant = index % 4
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
              animation: animate
                ? `orbDrift${driftVariant} ${config.duration}s linear infinite`
                : 'none',
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

