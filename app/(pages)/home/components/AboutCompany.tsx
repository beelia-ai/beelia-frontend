'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'

interface TeamMember {
  name: string
  role: string
  image: string
  description?: string
  quote?: string
}

// Grid node positions (percentage based)
// 3 columns (0%, 50%, 100%) x 5 rows (row positions)
interface GridNode {
  id: string
  x: number // percentage
  row: number // 0-4
}

interface BeamState {
  currentNode: string
  targetNode: string
  progress: number
  direction: 'horizontal' | 'vertical'
  distance: number // Distance to travel (for constant speed)
}

// Animated beam that traces table lines
function TableBeam({ 
  containerRef, 
  onDotLit,
  rowPositions
}: { 
  containerRef: React.RefObject<HTMLDivElement | null>
  onDotLit: (dotId: string, isLit: boolean) => void
  rowPositions: number[] // Actual Y positions in pixels
}) {
  const [beam, setBeam] = useState<BeamState | null>(null)
  const animationRef = useRef<number | null>(null)
  const [containerHeight, setContainerHeight] = useState(1)
  
  // Update container height
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.offsetHeight || 1)
      }
    }
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [containerRef])
  
  // Convert pixel positions to percentages
  const rowPercents = rowPositions.map(pos => (pos / containerHeight) * 100)
  
  // Define all nodes in the grid
  const nodes: GridNode[] = [
    // Row 0 (top)
    { id: 'r0-c0', x: 0, row: 0 },
    { id: 'r0-c1', x: 50, row: 0 },
    { id: 'r0-c2', x: 100, row: 0 },
    // Row 1 (after CEO section)
    { id: 'r1-c0', x: 0, row: 1 },
    { id: 'r1-c1', x: 50, row: 1 },
    { id: 'r1-c2', x: 100, row: 1 },
    // Row 2 (after separator 1)
    { id: 'r2-c0', x: 0, row: 2 },
    { id: 'r2-c1', x: 50, row: 2 },
    { id: 'r2-c2', x: 100, row: 2 },
    // Row 3 (after Emmanuel/Sanzhar)
    { id: 'r3-c0', x: 0, row: 3 },
    { id: 'r3-c1', x: 50, row: 3 },
    { id: 'r3-c2', x: 100, row: 3 },
    // Row 4 (after separator 2)
    { id: 'r4-c0', x: 0, row: 4 },
    { id: 'r4-c1', x: 50, row: 4 },
    { id: 'r4-c2', x: 100, row: 4 },
    // Row 5 (bottom)
    { id: 'r5-c0', x: 0, row: 5 },
    { id: 'r5-c1', x: 50, row: 5 },
    { id: 'r5-c2', x: 100, row: 5 },
  ]
  
  // Define edges (connections between nodes)
  const edges: [string, string][] = [
    // Horizontal edges (rows)
    ['r1-c0', 'r1-c1'], ['r1-c1', 'r1-c2'],
    ['r2-c0', 'r2-c1'], ['r2-c1', 'r2-c2'],
    ['r3-c0', 'r3-c1'], ['r3-c1', 'r3-c2'],
    ['r4-c0', 'r4-c1'], ['r4-c1', 'r4-c2'],
    // Vertical edges (columns)
    ['r0-c0', 'r1-c0'], ['r1-c0', 'r2-c0'], ['r2-c0', 'r3-c0'], ['r3-c0', 'r4-c0'], ['r4-c0', 'r5-c0'],
    ['r0-c1', 'r1-c1'], ['r1-c1', 'r2-c1'], ['r2-c1', 'r3-c1'], ['r3-c1', 'r4-c1'], ['r4-c1', 'r5-c1'],
    ['r0-c2', 'r1-c2'], ['r1-c2', 'r2-c2'], ['r2-c2', 'r3-c2'], ['r3-c2', 'r4-c2'], ['r4-c2', 'r5-c2'],
  ]
  
  const getNode = useCallback((id: string) => nodes.find(n => n.id === id), [])
  
  const getNeighbors = useCallback((nodeId: string): string[] => {
    const neighbors: string[] = []
    edges.forEach(([a, b]) => {
      if (a === nodeId) neighbors.push(b)
      if (b === nodeId) neighbors.push(a)
    })
    return neighbors
  }, [])
  
  const getRandomStartNode = useCallback(() => {
    // Pick from edge nodes (top, bottom, or sides)
    const edgeNodes = nodes.filter(n => 
      n.row === 0 || n.row === 5 || n.x === 0 || n.x === 100
    )
    return edgeNodes[Math.floor(Math.random() * edgeNodes.length)]
  }, [])
  
  // Calculate distance between two nodes (for constant speed)
  const getDistance = useCallback((node1: GridNode, node2: GridNode) => {
    const dx = Math.abs(node2.x - node1.x)
    const dy = Math.abs((rowPercents[node2.row] || 0) - (rowPercents[node1.row] || 0))
    return Math.hypot(dx, dy)
  }, [rowPercents])
  
  const startNewBeam = useCallback(() => {
    const startNode = getRandomStartNode()
    const neighbors = getNeighbors(startNode.id)
    if (neighbors.length === 0) return
    
    const targetId = neighbors[Math.floor(Math.random() * neighbors.length)]
    const targetNode = getNode(targetId)
    if (!targetNode) return
    
    const direction = startNode.x === targetNode.x ? 'vertical' : 'horizontal'
    const distance = getDistance(startNode, targetNode)
    
    setBeam({
      currentNode: startNode.id,
      targetNode: targetId,
      progress: 0,
      direction,
      distance: distance || 1,
    })
  }, [getRandomStartNode, getNeighbors, getNode, getDistance])
  
  // Track dots to light up (to avoid setState during render)
  const dotsToLight = useRef<string[]>([])
  
  // Process dot lighting outside of render
  useEffect(() => {
    if (dotsToLight.current.length > 0) {
      const dots = [...dotsToLight.current]
      dotsToLight.current = []
      
      dots.forEach(dotId => {
        onDotLit(dotId, true)
        setTimeout(() => {
          onDotLit(dotId, false)
        }, 400)
      })
    }
  })
  
  // Constant speed: pixels per frame (adjust this value to change speed)
  const BEAM_SPEED = 0.4
  
  // Animation loop
  useEffect(() => {
    if (!beam) {
      const timer = setTimeout(startNewBeam, 500)
      return () => clearTimeout(timer)
    }
    
    const animate = () => {
      setBeam(prev => {
        if (!prev) return null
        
        // Calculate progress increment based on distance for constant speed
        const progressIncrement = prev.distance > 0 ? BEAM_SPEED / prev.distance : 0.015
        const newProgress = prev.progress + progressIncrement
        
        if (newProgress >= 1) {
          // Queue dot to be lit (will be processed in separate effect)
          dotsToLight.current.push(prev.targetNode)
          
          // Get next target
          const neighbors = getNeighbors(prev.targetNode)
          const validNeighbors = neighbors.filter(n => n !== prev.currentNode)
          
          if (validNeighbors.length === 0) {
            // Dead end or edge - start new beam
            setTimeout(startNewBeam, 300)
            return null
          }
          
          // Check if we should exit (at edge)
          const currentNode = getNode(prev.targetNode)
          if (currentNode && (currentNode.row === 0 || currentNode.row === 5) && Math.random() > 0.7) {
            setTimeout(startNewBeam, 300)
            return null
          }
          
          const nextTargetId = validNeighbors[Math.floor(Math.random() * validNeighbors.length)]
          const nextTarget = getNode(nextTargetId)
          const current = getNode(prev.targetNode)
          
          if (!nextTarget || !current) return null
          
          // Calculate distance for next segment
          const newDistance = getDistance(current, nextTarget)
          
          return {
            currentNode: prev.targetNode,
            targetNode: nextTargetId,
            progress: 0,
            direction: current.x === nextTarget.x ? 'vertical' : 'horizontal',
            distance: newDistance || 1,
          }
        }
        
        return { ...prev, progress: newProgress }
      })
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animationRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [beam, getNeighbors, getNode, startNewBeam, getDistance])
  
  // Calculate beam position
  const getBeamPosition = () => {
    if (!beam || rowPercents.length < 6) return null
    
    const current = getNode(beam.currentNode)
    const target = getNode(beam.targetNode)
    if (!current || !target) return null
    
    const startX = current.x
    const startY = rowPercents[current.row] || 0
    const endX = target.x
    const endY = rowPercents[target.row] || 0
    
    const x = startX + (endX - startX) * beam.progress
    const y = startY + (endY - startY) * beam.progress
    
    return { x, y, direction: beam.direction }
  }
  
  const beamPos = getBeamPosition()
  
  return (
    <>
      {/* Beam element - slim elegant line */}
      {beamPos && (
        <div
          className="absolute pointer-events-none z-20"
          style={{
            left: `${beamPos.x}%`,
            top: `${beamPos.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Slim line beam */}
          <div
            style={{
              width: beamPos.direction === 'horizontal' ? '200px' : '3px',
              height: beamPos.direction === 'horizontal' ? '3px' : '200px',
              background: beamPos.direction === 'horizontal'
                ? 'linear-gradient(90deg, transparent 0%, #FEDA24 20%, #ffffff 50%, #FEDA24 80%, transparent 100%)'
                : 'linear-gradient(180deg, transparent 0%, #FEDA24 20%, #ffffff 50%, #FEDA24 80%, transparent 100%)',
              borderRadius: '2px',
            }}
          />
        </div>
      )}
    </>
  )
}

const teamMembers: TeamMember[] = [
  {
    name: 'Juan Carlos Calvo Fresno',
    role: 'Co-founder & CEO',
    image: '/images/JUAN.png',
    description: 'Based in Barcelona. My global perspective has been shaped by six years of life in the United States, fueling a deep passion for technology, innovation, and entrepreneurship.',
    quote: '"Driven by curiosity and ambition, I\'m continuously working to grow my expertise in the tech space. I aim to leverage my international background to spark meaningful innovation and contribute to impactful, forward-thinking solutions."'
  },
  {
    name: 'Emmanuel',
    role: 'Co-founder & CTO',
    image: '/images/EMMANUEL.png'
  },
  {
    name: 'Sanzhar',
    role: 'Co-founder & founding engineer',
    image: '/images/SANZHAR.png'
  },
  {
    name: 'Juan Carlos Calvo Rivera',
    role: 'Investor & Advisor',
    image: '/images/RIVERA.png'
  },
  {
    name: 'Arshdeep Singh',
    role: 'Product Lead',
    image: '/images/ARSHDEEP.png'
  }
]

// Intersection dot component with glow effect
function IntersectionDot({ 
  position, 
  isLit, 
  dotId 
}: { 
  position: 'left' | 'center' | 'right'
  isLit: boolean
  dotId: string
}) {
  const positionClasses = {
    left: 'left-0 -translate-x-1/2',
    center: 'left-1/2 -translate-x-1/2 hidden md:block',
    right: 'right-0 translate-x-1/2'
  }
  
  return (
    <div 
      data-dot-id={dotId}
      className={`absolute bottom-0 translate-y-1/2 z-10 transition-all duration-200 ${positionClasses[position]}`}
    >
      <div 
        className={`w-2 h-2 rounded-full transition-all duration-200 ${isLit ? 'scale-150' : 'scale-100'}`}
        style={{
          background: isLit ? '#fff' : '#FEDA24',
          boxShadow: isLit 
            ? '0 0 10px #fff, 0 0 20px #FEDA24, 0 0 30px #FEDA24, 0 0 40px #EF941F'
            : 'none',
        }}
      />
    </div>
  )
}

export function AboutCompany() {
  const tableRef = useRef<HTMLDivElement>(null)
  const row1Ref = useRef<HTMLDivElement>(null)
  const sep1Ref = useRef<HTMLDivElement>(null)
  const row2Ref = useRef<HTMLDivElement>(null)
  const sep2Ref = useRef<HTMLDivElement>(null)
  const row3Ref = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const [litDots, setLitDots] = useState<Set<string>>(new Set())
  const [rowPositions, setRowPositions] = useState<number[]>([0, 0, 0, 0, 0, 0])
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  
  // Calculate actual row positions from DOM
  useEffect(() => {
    const calculatePositions = () => {
      if (!tableRef.current) return
      
      const tableTop = tableRef.current.getBoundingClientRect().top
      const getBottom = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (!ref.current) return 0
        return ref.current.getBoundingClientRect().bottom - tableTop
      }
      
      const positions = [
        0, // Row 0 - top
        getBottom(row1Ref), // Row 1 - after CEO section
        getBottom(sep1Ref), // Row 2 - after separator 1
        getBottom(row2Ref), // Row 3 - after Emmanuel/Sanzhar
        getBottom(sep2Ref), // Row 4 - after separator 2
        tableRef.current.offsetHeight, // Row 5 - bottom
      ]
      
      setRowPositions(positions)
    }
    
    calculatePositions()
    window.addEventListener('resize', calculatePositions)
    
    // Recalculate after a short delay to ensure DOM is ready
    const timer = setTimeout(calculatePositions, 100)
    
    return () => {
      window.removeEventListener('resize', calculatePositions)
      clearTimeout(timer)
    }
  }, [])
  
  const handleDotLit = useCallback((dotId: string, isLit: boolean) => {
    setLitDots(prev => {
      const newSet = new Set(prev)
      if (isLit) {
        newSet.add(dotId)
      } else {
        newSet.delete(dotId)
      }
      return newSet
    })
  }, [])
  
  const isDotLit = useCallback((dotId: string) => litDots.has(dotId), [litDots])
  
  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play()
      setIsVideoPlaying(true)
    }
  }
  
  const handleVideoPlay = () => {
    setIsVideoPlaying(true)
  }
  
  const handleVideoPause = () => {
    setIsVideoPlaying(false)
  }
  
  // Ensure video shows first frame when loaded
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    
    const handleLoadedMetadata = () => {
      video.currentTime = 0.1 // Set to a small value to show first frame
    }
    
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [])
  
  return (
    <section className="relative w-full py-24 px-8 md:px-16 lg:px-24">
      {/* Video Section */}
      <div className="flex justify-center mb-16">
        <div className="relative w-full max-w-4xl">
          {/* A short-intro text - positioned adjacent to video */}
          <div 
            className="absolute flex items-center gap-2"
            style={{ 
              left: '-180px',
              top: '180px'
            }}
          >
            <Image 
              src="/icons/A short-intro!.svg"
              alt="A short-intro!"
              width={120}
              height={30}
              className="h-auto"
            />
            <Image 
              src="/icons/Curved-arrow.svg"
              alt="Arrow"
              width={50}
              height={30}
              className="h-auto"
            />
          </div>

          {/* Video Container */}
          <div 
            className="relative w-full aspect-video rounded-2xl overflow-hidden"
            style={{ 
              background: 'linear-gradient(135deg, rgba(50, 50, 50, 0.8) 0%, rgba(30, 30, 30, 0.9) 100%)'
            }}
          >
            {/* Video Element - Blurred when paused */}
            <video 
              ref={videoRef}
              className={`w-full h-full object-cover transition-all duration-500 ${
                !isVideoPlaying ? 'blur-[8px] scale-105' : 'blur-0 scale-100'
              }`}
              controls={isVideoPlaying}
              playsInline
              preload="metadata"
              onPlay={handleVideoPlay}
              onPause={handleVideoPause}
              onEnded={handleVideoPause}
            >
              <source src="/videos/beelia-intro.mov" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Preview Overlay with Play Button */}
            {!isVideoPlaying && (
              <div 
                className="absolute inset-0 z-10 cursor-pointer"
                onClick={handlePlayVideo}
              >
                {/* Additional dark overlay for better contrast */}
                <div className="absolute inset-0 bg-black/15" />
                
                {/* Glass border effect */}
                <div 
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(1px)',
                    boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.05)',
                  }}
                />
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="relative group w-20 h-20"
                  >
                    {/* Outer glow ring */}
                    <div 
                      className="absolute inset-0 rounded-full transition-all duration-300 group-hover:scale-[1.3]"
                      style={{
                        background: 'rgba(254, 218, 36, 0.2)',
                        filter: 'blur(10px)',
                        transform: 'scale(1.2)',
                      }}
                    />
                    <div 
                      className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: 'rgba(254, 218, 36, 0.3)',
                        filter: 'blur(10px)',
                        transform: 'scale(1.3)',
                      }}
                    />
                    
                    {/* Glass button background */}
                    <div 
                      className="absolute inset-0 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div 
                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: 'rgba(255, 255, 255, 0.15)',
                          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4), inset 0 0 30px rgba(255, 255, 255, 0.15)',
                        }}
                      />
                      {/* Play Icon */}
                      <svg 
                        width="32" 
                        height="32" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        className="ml-1 relative z-10"
                        style={{
                          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
                        }}
                      >
                        <path 
                          d="M8 5V19L19 12L8 5Z" 
                          fill="white"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div ref={tableRef} className="max-w-6xl mx-auto relative rounded-lg" style={{ background: 'transparent' }}>
        {/* Animated beam tracing the table */}
        <TableBeam containerRef={tableRef} onDotLit={handleDotLit} rowPositions={rowPositions} />
        {/* Left vertical line - extended with fade */}
        <div 
          className="absolute left-0 pointer-events-none"
          style={{
            width: '0.5px',
            top: '-40px',
            bottom: '-40px',
            background: 'linear-gradient(180deg, transparent 0%, rgba(254, 218, 36, 0.4) 15%, rgba(239, 148, 31, 0.4) 50%, rgba(254, 218, 36, 0.4) 85%, transparent 100%)',
          }}
        />
        {/* Right vertical line - extended with fade */}
        <div 
          className="absolute right-0 pointer-events-none"
          style={{
            width: '0.5px',
            top: '-40px',
            bottom: '-40px',
            background: 'linear-gradient(180deg, transparent 0%, rgba(254, 218, 36, 0.4) 15%, rgba(239, 148, 31, 0.4) 50%, rgba(254, 218, 36, 0.4) 85%, transparent 100%)',
          }}
        />
        {/* Center vertical line - extended with fade */}
        <div 
          className="hidden md:block absolute left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: '0.5px',
            top: '-40px',
            bottom: '-40px',
            background: 'linear-gradient(180deg, transparent 0%, rgba(254, 218, 36, 0.4) 15%, rgba(239, 148, 31, 0.4) 50%, rgba(254, 218, 36, 0.4) 85%, transparent 100%)',
          }}
        />

        {/* Intersection dots container - will be populated per row */}

        {/* CEO Section - First Row */}
        <div ref={row1Ref} className="grid grid-cols-1 md:grid-cols-2 gap-0 relative">
          {/* Left - Profile */}
          <div className="p-8 relative">
            <div className="flex items-start gap-4 mb-6">
              {/* Profile Image */}
              <div className="w-16 h-16 rounded-lg bg-gray-700 overflow-hidden flex-shrink-0">
                <Image 
                  src={teamMembers[0].image} 
                  alt={teamMembers[0].name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 
                  className="text-white mb-1"
                  style={{ 
                    fontFamily: 'var(--font-inria-sans), sans-serif',
                    fontWeight: 700,
                    fontSize: '18px'
                  }}
                >
                  {teamMembers[0].name}
                </h3>
                <p 
                  className="text-[#FEDA24]"
                  style={{ 
                    fontFamily: 'var(--font-inria-sans), sans-serif',
                    fontWeight: 400,
                    fontSize: '14px'
                  }}
                >
                  {teamMembers[0].role}
                </p>
              </div>
            </div>
            <p 
              className="text-white/70"
              style={{ 
                fontFamily: 'var(--font-inria-sans), sans-serif',
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '160%'
              }}
            >
              {teamMembers[0].description}
            </p>
          </div>

          {/* Right - Quote */}
          <div className="p-8 flex items-center">
            <p 
              className="text-white"
              style={{ 
                fontFamily: 'var(--font-inria-sans), sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '170%'
              }}
            >
              {teamMembers[0].quote}
            </p>
          </div>

          {/* Horizontal divider - extended with fade */}
          <div 
            className="absolute bottom-0 pointer-events-none"
            style={{ 
              height: '0.5px',
              left: '-200px',
              right: '-200px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(254, 218, 36, 0.4) 10%, rgba(239, 148, 31, 0.4) 50%, rgba(254, 218, 36, 0.4) 90%, transparent 100%)',
            }}
          />
          {/* Intersection dots */}
          <IntersectionDot position="left" dotId="r1-c0" isLit={isDotLit('r1-c0')} />
          <IntersectionDot position="center" dotId="r1-c1" isLit={isDotLit('r1-c1')} />
          <IntersectionDot position="right" dotId="r1-c2" isLit={isDotLit('r1-c2')} />
        </div>

        {/* Separator Row 1 */}
        <div 
          ref={sep1Ref}
          className="w-full relative"
          style={{ height: '56px' }}
        >
          <div className="absolute inset-0" style={{ opacity: 0.01 }} />
          {/* Horizontal divider - extended with fade */}
          <div 
            className="absolute bottom-0 pointer-events-none"
            style={{ 
              height: '0.5px',
              left: '-200px',
              right: '-200px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(254, 218, 36, 0.4) 10%, rgba(239, 148, 31, 0.4) 50%, rgba(254, 218, 36, 0.4) 90%, transparent 100%)',
            }}
          />
          {/* Intersection dots */}
          <IntersectionDot position="left" dotId="r2-c0" isLit={isDotLit('r2-c0')} />
          <IntersectionDot position="center" dotId="r2-c1" isLit={isDotLit('r2-c1')} />
          <IntersectionDot position="right" dotId="r2-c2" isLit={isDotLit('r2-c2')} />
        </div>

        {/* Second Row - Emmanuel & Sanzhar */}
        <div ref={row2Ref} className="grid grid-cols-1 md:grid-cols-2 gap-0 relative">
          {/* Emmanuel */}
          <div className="p-8 relative">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-gray-700 overflow-hidden flex-shrink-0">
                <Image 
                  src={teamMembers[1].image} 
                  alt={teamMembers[1].name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 
                  className="text-white mb-1"
                  style={{ 
                    fontFamily: 'var(--font-inria-sans), sans-serif',
                    fontWeight: 700,
                    fontSize: '18px'
                  }}
                >
                  {teamMembers[1].name}
                </h3>
                <p 
                  className="text-[#FEDA24]"
                  style={{ 
                    fontFamily: 'var(--font-inria-sans), sans-serif',
                    fontWeight: 400,
                    fontSize: '14px'
                  }}
                >
                  {teamMembers[1].role}
                </p>
              </div>
            </div>
          </div>

          {/* Sanzhar */}
          <div className="p-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-gray-700 overflow-hidden flex-shrink-0">
                <Image 
                  src={teamMembers[2].image} 
                  alt={teamMembers[2].name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 
                  className="text-white mb-1"
                  style={{ 
                    fontFamily: 'var(--font-inria-sans), sans-serif',
                    fontWeight: 700,
                    fontSize: '18px'
                  }}
                >
                  {teamMembers[2].name}
                </h3>
                <p 
                  className="text-[#FEDA24]"
                  style={{ 
                    fontFamily: 'var(--font-inria-sans), sans-serif',
                    fontWeight: 400,
                    fontSize: '14px'
                  }}
                >
                  {teamMembers[2].role}
                </p>
              </div>
            </div>
          </div>

          {/* Horizontal divider - extended with fade */}
          <div 
            className="absolute bottom-0 pointer-events-none"
            style={{ 
              height: '0.5px',
              left: '-200px',
              right: '-200px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(254, 218, 36, 0.4) 10%, rgba(239, 148, 31, 0.4) 50%, rgba(254, 218, 36, 0.4) 90%, transparent 100%)',
            }}
          />
          {/* Intersection dots */}
          <IntersectionDot position="left" dotId="r3-c0" isLit={isDotLit('r3-c0')} />
          <IntersectionDot position="center" dotId="r3-c1" isLit={isDotLit('r3-c1')} />
          <IntersectionDot position="right" dotId="r3-c2" isLit={isDotLit('r3-c2')} />
        </div>

        {/* Separator Row 2 */}
        <div 
          ref={sep2Ref}
          className="w-full relative"
          style={{ height: '56px' }}
        >
          <div className="absolute inset-0" style={{ opacity: 0.01 }} />
          {/* Horizontal divider - extended with fade */}
          <div 
            className="absolute bottom-0 pointer-events-none"
            style={{ 
              height: '0.5px',
              left: '-200px',
              right: '-200px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(254, 218, 36, 0.4) 10%, rgba(239, 148, 31, 0.4) 50%, rgba(254, 218, 36, 0.4) 90%, transparent 100%)',
            }}
          />
          {/* Intersection dots */}
          <IntersectionDot position="left" dotId="r4-c0" isLit={isDotLit('r4-c0')} />
          <IntersectionDot position="center" dotId="r4-c1" isLit={isDotLit('r4-c1')} />
          <IntersectionDot position="right" dotId="r4-c2" isLit={isDotLit('r4-c2')} />
        </div>

        {/* Third Row - Placeholder & Arshdeep */}
        <div ref={row3Ref} className="grid grid-cols-1 md:grid-cols-2 gap-0 relative">
          {/* Rivera */}
          <div className="p-8 relative">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-gray-700 overflow-hidden flex-shrink-0">
                <Image 
                  src={teamMembers[3].image} 
                  alt={teamMembers[3].name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 
                  className="text-white mb-1"
                  style={{ 
                    fontFamily: 'var(--font-inria-sans), sans-serif',
                    fontWeight: 700,
                    fontSize: '18px'
                  }}
                >
                  {teamMembers[3].name}
                </h3>
                <p 
                  className="text-[#FEDA24]"
                  style={{ 
                    fontFamily: 'var(--font-inria-sans), sans-serif',
                    fontWeight: 400,
                    fontSize: '14px'
                  }}
                >
                  {teamMembers[3].role}
                </p>
              </div>
            </div>
          </div>

          {/* Arshdeep */}
          <div className="p-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-gray-700 overflow-hidden flex-shrink-0">
                <Image 
                  src={teamMembers[4].image} 
                  alt={teamMembers[4].name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 
                  className="text-white mb-1"
                  style={{ 
                    fontFamily: 'var(--font-inria-sans), sans-serif',
                    fontWeight: 700,
                    fontSize: '18px'
                  }}
                >
                  {teamMembers[4].name}
                </h3>
                <p 
                  className="text-[#FEDA24]"
                  style={{ 
                    fontFamily: 'var(--font-inria-sans), sans-serif',
                    fontWeight: 400,
                    fontSize: '14px'
                  }}
                >
                  {teamMembers[4].role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

