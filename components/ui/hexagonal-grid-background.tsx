'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

export interface HexagonalGridBackgroundProps {
  readonly className?: string
  readonly showControls?: boolean
  readonly children?: React.ReactNode
  readonly colors?: number[] // Array of hex colors in 0x format (e.g., [0xFEDA24, 0xEF941F, 0xFF8C32])
}

export function HexagonalGridBackground({ 
  className, 
  showControls = false,
  children,
  colors
}: HexagonalGridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bgInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    let isMounted = true
    let script: HTMLScriptElement | null = null

    // Helper to initialize background
    const initializeBackground = (Grid1Background: any) => {
      if (isMounted && canvasRef.current && Grid1Background) {
        bgInstanceRef.current = Grid1Background(canvasRef.current)
        
        // Apply custom colors if provided
        if (colors && bgInstanceRef.current?.grid) {
          let gridColors: number[]
          if (colors.length >= 3) {
            gridColors = colors.slice(0, 3)
          } else if (colors.length === 2) {
            gridColors = [colors[0], colors[1], colors[0]]
          } else {
            gridColors = [colors[0], colors[0], colors[0]]
          }
          
          bgInstanceRef.current.grid.setColors(gridColors)
          
          // Set light colors to match the gradient
          if (gridColors[0]) {
            bgInstanceRef.current.grid.light1.color.set(gridColors[0])
            bgInstanceRef.current.grid.light1.intensity = 750
          }
          if (gridColors[1]) {
            bgInstanceRef.current.grid.light2.color.set(gridColors[1])
            bgInstanceRef.current.grid.light2.intensity = 375
          }
        }
      }
    }

    // Load Grid1Background from CDN using script tag (runtime only, avoids Webpack build errors)
    const loadGridBackground = (): Promise<void> => {
      return new Promise<void>((resolve, reject) => {
        // Check if already loaded
        if ((globalThis as any).Grid1Background) {
          initializeBackground((globalThis as any).Grid1Background)
          resolve()
          return
        }

        // Check if script is already being loaded
        const existingScript = document.querySelector(
          'script[src*="threejs-components"][src*="grid1"]'
        )
        
        if (existingScript) {
          // Wait for existing script to load
          const checkInterval = setInterval(() => {
            if ((globalThis as any).Grid1Background) {
              clearInterval(checkInterval)
              if (isMounted) {
                initializeBackground((globalThis as any).Grid1Background)
                resolve()
              }
            }
          }, 100)
          
          setTimeout(() => {
            clearInterval(checkInterval)
            if (!(globalThis as any).Grid1Background) {
              reject(new Error('Grid1Background not found after waiting'))
            }
          }, 10000)
          return
        }

        // Create import map for ES module
        const importMap = document.createElement('script')
        importMap.type = 'importmap'
        importMap.textContent = JSON.stringify({
          imports: {
            'grid1-background': 'https://cdn.jsdelivr.net/npm/threejs-components@0.0.16/build/backgrounds/grid1.cdn.min.js'
          }
        })

        // Create module script that imports and exposes to globalThis
        script = document.createElement('script')
        script.type = 'module'
        script.textContent = `
          import Grid1Background from 'grid1-background';
          globalThis.Grid1Background = Grid1Background.default || Grid1Background;
          globalThis.dispatchEvent(new CustomEvent('grid1-loaded'));
        `
        
        const handleLoad = () => {
          setTimeout(() => {
            if (isMounted && (globalThis as any).Grid1Background) {
              initializeBackground((globalThis as any).Grid1Background)
              resolve()
            } else {
              reject(new Error('Grid1Background not found after script load'))
            }
          }, 500)
        }

        const handleError = () => {
          reject(new Error('Failed to load Grid1Background script'))
        }

        // Use window for addEventListener (standard API)
        window.addEventListener('grid1-loaded', handleLoad, { once: true })
        script.onerror = handleError
        importMap.onerror = handleError

        document.head.appendChild(importMap)
        document.head.appendChild(script)
      })
    }

    loadGridBackground().catch(() => {})

    // Cleanup on unmount
    return () => {
      isMounted = false
      script?.remove()
      bgInstanceRef.current?.dispose?.()
    }
  }, [colors])

  const handleRandomColors = () => {
    if (!bgInstanceRef.current) return

    const bg = bgInstanceRef.current
    if (bg.grid) {
      bg.grid.setColors([
        0xffffff * Math.random(),
        0xffffff * Math.random(),
        0xffffff * Math.random()
      ])
      bg.grid.light1.color.set(0xffffff * Math.random())
      bg.grid.light1.intensity = 500 + Math.random() * 1000
      bg.grid.light2.color.set(0xffffff * Math.random())
      bg.grid.light2.intensity = 250 + Math.random() * 250
    }
  }

  return (
    <div 
      className={cn(
        "relative w-full h-full",
        "bg-gradient-radial from-white via-black/50 to-black",
        className
      )}
      style={{
        background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(0,0,0,0.5) 200%)'
      }}
    >
      {/* WebGL Canvas */}
      <canvas
        ref={canvasRef}
        id="webgl-canvas"
        className="fixed top-0 right-0 bottom-0 left-0 overflow-hidden"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          overflow: 'hidden'
        }}
      />

      {/* Hero Content */}
      {children && (
        <div className="relative h-full flex flex-col items-center justify-center">
          {children}
        </div>
      )}

      {/* Control Buttons */}
      {showControls && (
        <div className="fixed w-full bottom-[15px] flex justify-center items-center gap-[15px]">
          <button
            type="button"
            onClick={handleRandomColors}
            className="font-montserrat bg-white/50 rounded-[5px] border border-gray-500 px-2 py-1"
            style={{
              fontFamily: '"Montserrat", serif',
              background: 'rgba(255, 255, 255, 0.5)',
              borderRadius: '5px',
              border: '1px solid grey',
              padding: '4px 8px'
            }}
          >
            Random colors
          </button>
        </div>
      )}
    </div>
  )
}
