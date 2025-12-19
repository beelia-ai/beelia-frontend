'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

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
    const UPDATE = ({ x, y }: { x: number; y: number }) => {
      if (!cardRef.current) return
      const bounds = cardRef.current.getBoundingClientRect()
      const relativeX = x - bounds.left
      const relativeY = y - bounds.top
      
      cardRef.current.style.setProperty('--x', relativeX.toFixed(2))
      cardRef.current.style.setProperty('--y', relativeY.toFixed(2))
    }

    const handlePointerMove = (e: PointerEvent) => {
      UPDATE({ x: e.clientX, y: e.clientY })
    }

    document.body.addEventListener('pointermove', handlePointerMove)
    return () => {
      document.body.removeEventListener('pointermove', handlePointerMove)
    }
  }, [])

  return (
    <>
      <style jsx>{`
        .glow-card {
          --border-size: 2px;
          --spotlight-size: 150px;
          --hue: 210;
          --saturation: 100;
          --lightness: 70;
          --radius: 12px;
          --backdrop: hsl(0 0% 60% / 0.15);
          --backup-border: hsl(0 0% 60% / 0.2);
          --bg-spot-opacity: 0.1;
          --border-spot-opacity: 1;
          --border-light-opacity: 1;
          aspect-ratio: 3 / 4;
          border-radius: var(--radius);
          width: 260px;
          position: relative;
          display: grid;
          grid-template-rows: 1fr auto;
          gap: 1rem;
          padding: 1rem;
          box-shadow: 0 1rem 2rem -1rem black;
          backdrop-filter: blur(5px);
          background-image: radial-gradient(
            var(--spotlight-size) var(--spotlight-size) at
            calc(var(--x, 0) * 1px)
            calc(var(--y, 0) * 1px),
            hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / var(--bg-spot-opacity, 0.1)), transparent
          );
          background-color: var(--backdrop, transparent);
          background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
          background-position: 50% 50%;
          background-attachment: fixed;
          border: var(--border-size) solid var(--backup-border);
        }

        .glow-card::before,
        .glow-card::after {
          pointer-events: none;
          content: "";
          position: absolute;
          inset: calc(var(--border-size) * -1);
          border: var(--border-size) solid transparent;
          border-radius: var(--radius);
          background-attachment: fixed;
          background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
          background-repeat: no-repeat;
          background-position: 50% 50%;
          mask:
            linear-gradient(transparent, transparent),
            linear-gradient(white, white);
          mask-clip: padding-box, border-box;
          mask-composite: intersect;
        }

        .glow-card::before {
          background-image: radial-gradient(
            calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at
            calc(var(--x, 0) * 1px)
            calc(var(--y, 0) * 1px),
            hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 50) * 1%) / var(--border-spot-opacity, 1)), transparent 100%
          );
          z-index: 2;
          filter: brightness(2);
        }

        .glow-card::after {
          background-image: radial-gradient(
            calc(var(--spotlight-size) * 0.5) calc(var(--spotlight-size) * 0.5) at
            calc(var(--x, 0) * 1px)
            calc(var(--y, 0) * 1px),
            hsl(0 100% 100% / var(--border-light-opacity, 1)), transparent 100%
          );
          z-index: 2;
        }

        .glow-card__content {
          color: hsl(0 0% 70%);
          display: grid;
          grid-template-rows: auto 1fr auto;
        }

        .glow-card__content span {
          font-size: 0.875rem;
          font-weight: 120;
          opacity: 0.5;
        }

        .glow-card__content h2 {
          font-weight: 100;
          font-size: 1.5rem;
          margin: 0;
          color: hsl(0 0% 90%);
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
      <article ref={cardRef} className={cn('glow-card', className)}>
        <div className="glow-card__content">
          {subtitle && <span>{subtitle}</span>}
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
          <h2 dangerouslySetInnerHTML={{ __html: title }} />
        </div>
        <a href="#" className="glow-card__button">
          Follow
        </a>
      </article>
    </>
  )
}

