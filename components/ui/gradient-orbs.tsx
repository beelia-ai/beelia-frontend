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

// Animation configs with more variety
const animationConfigs = [
  { duration: 8, delay: 0 },
  { duration: 12, delay: 1.5 },
  { duration: 7, delay: 3 },
  { duration: 10, delay: 0.5 },
  { duration: 14, delay: 2 },
  { duration: 9, delay: 4 },
  { duration: 11, delay: 1 },
  { duration: 6, delay: 2.5 },
  { duration: 13, delay: 0.8 },
  { duration: 8.5, delay: 3.5 },
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
      {/* Keyframe animations */}
      <style jsx>{`
        @keyframes orbPulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.08);
          }
        }
        @keyframes orbDrift0 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
          25% { transform: translate(15px, -12px) scale(1.06); opacity: 0.7; }
          50% { transform: translate(-8px, 18px) scale(1.03); opacity: 0.5; }
          75% { transform: translate(-18px, -8px) scale(1.07); opacity: 0.75; }
        }
        @keyframes orbDrift1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
          33% { transform: translate(-12px, 10px) scale(1.04); opacity: 0.65; }
          66% { transform: translate(10px, -15px) scale(1.08); opacity: 0.8; }
        }
        @keyframes orbDrift2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
          20% { transform: translate(8px, 12px) scale(1.05); opacity: 0.6; }
          40% { transform: translate(-15px, 5px) scale(1.02); opacity: 0.75; }
          60% { transform: translate(-5px, -18px) scale(1.07); opacity: 0.55; }
          80% { transform: translate(12px, -8px) scale(1.04); opacity: 0.85; }
        }
        @keyframes orbDrift3 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
          50% { transform: translate(-20px, 15px) scale(1.1); opacity: 0.45; }
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

