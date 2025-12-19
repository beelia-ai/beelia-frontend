'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Outfit } from 'next/font/google'

const outfit = Outfit({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-outfit",
})

interface GlowCardProps {
  title: string
  subtitle?: string
  description: string
  iconPath: string
  className?: string
}

export function GlowCard({
  title,
  subtitle,
  description,
  iconPath,
  className,
}: GlowCardProps) {
  const cardRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    // Initialize with glow hidden (opacity 0)
    card.style.setProperty('--glow-opacity', '0')

    const UPDATE = (x: number, y: number) => {
      const bounds = card.getBoundingClientRect()
      const relativeX = x - bounds.left
      const relativeY = y - bounds.top
      
      // Update CSS variables with 'px' suffix
      card.style.setProperty('--x', `${relativeX.toFixed(2)}px`)
      card.style.setProperty('--y', `${relativeY.toFixed(2)}px`)
      card.style.setProperty('--glow-opacity', '1')
    }

    const handleMouseMove = (e: MouseEvent) => {
      e.stopPropagation()
      UPDATE(e.clientX, e.clientY)
    }

    const handleMouseEnter = (e: MouseEvent) => {
      UPDATE(e.clientX, e.clientY)
    }

    const handleMouseLeave = () => {
      // Hide glow when leaving
      card.style.setProperty('--glow-opacity', '0')
    }

    // Use mouse events instead of pointer events for better compatibility
    card.addEventListener('mousemove', handleMouseMove, { passive: true })
    card.addEventListener('mouseenter', handleMouseEnter)
    card.addEventListener('mouseleave', handleMouseLeave)
    
    return () => {
      card.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseenter', handleMouseEnter)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <>
      <style jsx>{`
        .glow-card {
          --border-size: 2px;
          --spotlight-size: 200px;
          --hue: 35;
          --saturation: 100;
          --lightness: 60;
          --radius: 8px;
          --backdrop: hsl(0 0% 60% / 0.05);
          --backup-border: hsl(0 0% 60% / 0.4);
          --bg-spot-opacity: 0.6;
          --border-spot-opacity: 1;
          --border-light-opacity: 1;
          --glow-opacity: 0;
          --x: 130px;
          --y: 173px;
          aspect-ratio: 3 / 4;
          border-radius: var(--radius);
          width: 260px;
          position: relative;
          z-index: 10;
          display: grid;
          grid-template-rows: 1fr auto;
          gap: 1rem;
          padding: 1rem;
          box-shadow: 0 1rem 2rem -1rem black;
          backdrop-filter: blur(3px);
          background-color: var(--backdrop, transparent);
          background-image: radial-gradient(
            var(--spotlight-size) var(--spotlight-size) at
            var(--x, 130px)
            var(--y, 173px),
            hsl(var(--hue, 35) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 60) * 1%) / calc(var(--bg-spot-opacity, 0.6) * var(--glow-opacity, 0))),
            hsl(calc(var(--hue, 35) + 10) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / calc(var(--bg-spot-opacity, 0.6) * 0.7 * var(--glow-opacity, 0))),
            hsl(calc(var(--hue, 35) + 15) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 75) * 1%) / calc(var(--bg-spot-opacity, 0.6) * 0.4 * var(--glow-opacity, 0))),
            transparent
          );
          background-color: var(--backdrop, transparent);
          background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
          background-position: 50% 50%;
          background-attachment: local;
          border: var(--border-size) solid var(--backup-border);
          will-change: background-image;
        }

        .glow-card::before,
        .glow-card::after {
          pointer-events: none;
          content: "";
          position: absolute;
          inset: calc(var(--border-size) * -1);
          border: var(--border-size) solid transparent;
          border-radius: var(--radius);
          background-attachment: local;
          background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
          background-repeat: no-repeat;
          background-position: 50% 50%;
          mask:
            linear-gradient(transparent, transparent),
            linear-gradient(white, white);
          mask-clip: padding-box, border-box;
          mask-composite: intersect;
          will-change: background-image;
        }

        .glow-card::before {
          background-image: radial-gradient(
            calc(var(--spotlight-size) * 0.85) calc(var(--spotlight-size) * 0.85) at
            var(--x, 130px)
            var(--y, 173px),
            hsl(var(--hue, 35) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 65) * 1%) / calc(var(--border-spot-opacity, 1) * var(--glow-opacity, 0))),
            hsl(calc(var(--hue, 35) + 10) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / calc(var(--border-spot-opacity, 1) * 0.9 * var(--glow-opacity, 0))),
            hsl(calc(var(--hue, 35) + 15) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 75) * 1%) / calc(var(--border-spot-opacity, 1) * 0.6 * var(--glow-opacity, 0))),
            transparent 100%
          );
          z-index: 2;
          filter: brightness(1.8);
          transition: background-image 0.1s ease-out;
        }

        .glow-card::after {
          background-image: radial-gradient(
            calc(var(--spotlight-size) * 0.6) calc(var(--spotlight-size) * 0.6) at
            var(--x, 130px)
            var(--y, 173px),
            hsl(var(--hue, 35) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 95) * 1%) / calc(var(--border-light-opacity, 1) * var(--glow-opacity, 0))),
            hsl(calc(var(--hue, 35) + 5) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 90) * 1%) / calc(var(--border-light-opacity, 1) * 0.7 * var(--glow-opacity, 0))),
            transparent 100%
          );
          z-index: 2;
          filter: brightness(1.3);
          transition: background-image 0.1s ease-out;
        }

        .glow-card__content {
          color: hsl(0 0% 70%);
          display: grid;
          grid-template-rows: auto 1fr auto;
          gap: 1rem;
        }

        .glow-card__content span {
          font-family: var(--font-outfit), Outfit, sans-serif;
          font-weight: 600;
          font-style: normal;
          font-size: 24px;
          line-height: 122%;
          letter-spacing: -2%;
          text-align: left;
          margin: 0;
          color: #FFFFFF;
          white-space: nowrap;
        }

        .glow-card__description {
          font-family: var(--font-outfit), Outfit, sans-serif;
          font-weight: 400;
          font-style: normal;
          font-size: 16px;
          line-height: 140%;
          letter-spacing: 2%;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }

        .glow-card__icons {
          position: relative;
          display: grid;
          align-items: center;
        }

        .glow-card__icons svg {
          width: 80px;
        }

        .glow-card__icons svg:not(:nth-of-type(1)) {
          position: absolute;
          top: 50%;
          left: 0;
          translate: calc(var(--index) * 40%) -50%;
          scale: calc(1 - (var(--index) * 0.2));
          z-index: calc(4 - var(--index));
          opacity: calc(4 / (2 * (var(--index) * 10)));
        }

        .glow-card__icons svg:nth-of-type(2) {
          --index: 1;
        }

        .glow-card__icons svg:nth-of-type(3) {
          --index: 2;
        }

        .glow-card__icons svg:nth-of-type(4) {
          --index: 3;
        }

        .glow-card__button {
          background: hsl(0 0% 0%);
          display: inline-block;
          color: white;
          text-decoration: none;
          font-weight: 140;
          text-align: center;
          padding: 0.75rem 1.5rem;
          position: relative;
          border-radius: var(--radius);
        }
      `}</style>
      <article ref={cardRef} className={cn('glow-card', outfit.variable, className)}>
        <div className="glow-card__content">
          <span dangerouslySetInnerHTML={{ __html: title }} />
          <div className="glow-card__icons">
            {[0, 1, 2, 3].map((index) => (
              <svg
                key={index}
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="none"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={iconPath}
                />
              </svg>
            ))}
          </div>
          {description && (
            <p 
              className="glow-card__description"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </div>
      </article>
    </>
  )
}

