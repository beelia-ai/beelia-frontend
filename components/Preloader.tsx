'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export function Preloader() {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const updateProgress = () => {
      if (document.readyState === 'loading') {
        setProgress(30)
      } else if (document.readyState === 'interactive') {
        setProgress(70)
      } else if (document.readyState === 'complete') {
        setProgress(100)
        setIsComplete(true)
      }
    }

    updateProgress()
    document.addEventListener('readystatechange', updateProgress)

    return () => {
      document.removeEventListener('readystatechange', updateProgress)
    }
  }, [])

  // Fade out when complete
  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => setFadeOut(true), 400)
      return () => clearTimeout(timer)
    }
  }, [isComplete])

  // Don't render if faded out
  if (fadeOut) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isComplete ? 0 : 1,
        transition: 'opacity 0.4s ease-out',
        pointerEvents: isComplete ? 'none' : 'auto',
      }}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.02); opacity: 0.9; }
        }
      `}</style>

      {/* Beelia SVG Logo */}
      <div
        style={{
          marginBottom: '2.5rem',
          animation: 'pulse 2s ease-in-out infinite',
        }}
      >
        <Image
          src="/icons/Beelia.svg"
          alt="Beelia"
          width={200}
          height={60}
          priority
        />
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: '160px',
          height: '2px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '2px',
          overflow: 'hidden',
          marginBottom: '0.75rem',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #FF8C32, #FEDA24)',
            borderRadius: '2px',
            transition: 'width 0.3s ease-out',
          }}
        />
      </div>

      {/* Percentage */}
      <p
        style={{
          fontFamily: 'sans-serif',
          fontSize: '0.7rem',
          color: 'rgba(255,255,255,0.35)',
          letterSpacing: '0.1em',
          margin: 0,
        }}
      >
        {progress}%
      </p>
    </div>
  )
}
