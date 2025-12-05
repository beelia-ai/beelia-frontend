'use client'

import React from 'react'

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
}

const defaultOrbs: GradientOrb[] = [
  {
    size: 800,
    color1: 'rgba(254, 218, 36, 0.15)',
    color2: 'rgba(239, 148, 31, 0.08)',
    top: '-300px',
    right: '-200px',
  },
  {
    size: 600,
    color1: 'rgba(239, 148, 31, 0.12)',
    color2: 'rgba(254, 218, 36, 0.05)',
    bottom: '-200px',
    left: '-150px',
  },
  {
    size: 400,
    color1: 'rgba(255, 215, 0, 0.1)',
    top: '40%',
    left: '20%',
  },
]

export function GradientOrbs({
  orbs = defaultOrbs,
  showGrid = true,
  gridOpacity = 0.03,
  gridSize = 60,
  className = '',
}: GradientOrbsProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Gradient orbs */}
      {orbs.map((orb, index) => (
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
          }}
        />
      ))}

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

