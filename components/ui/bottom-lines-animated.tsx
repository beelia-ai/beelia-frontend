'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BottomLinesAnimatedProps {
    className?: string
    style?: React.CSSProperties
    /** Animation duration in seconds */
    duration?: number
    /** Delay before animation starts (in seconds) */
    delay?: number
    /** Beam color - supports gradients */
    beamColor?: string
    /** Secondary beam color for gradient */
    beamColorSecondary?: string
    /** Path color (the static lines) */
    pathColor?: string
    /** Width of the beam */
    beamWidth?: number
    /** Width of the path stroke */
    pathWidth?: number
}

// Type definitions for gradient animations
type VerticalGradientAnim = { y1: number[]; y2: number[]; x1: number; x2: number }
type HorizontalGradientAnim = { x1: number[]; x2: number[]; y1: number; y2: number }

// Animated beam component using framer-motion - EXACT COPY from TraceLinesAnimated
function AnimatedPathBeam({
    pathId,
    d,
    gradientId,
    beamWidth,
    glowFilterId,
    duration,
    delay,
    reverse = false,
}: Readonly<{
    pathId: string
    d: string
    gradientId: string
    beamWidth: number
    glowFilterId: string
    duration: number
    delay: number
    reverse?: boolean
}>) {
    // Parse the path to extract start and end coordinates for proper gradient animation
    // Handles both horizontal and vertical paths
    const parsePathBounds = (path: string) => {
        const numbers = path.match(/-?\d+\.?\d*/g)?.map(Number) || []
        if (numbers.length >= 4) {
            const startX = numbers[0]
            const startY = numbers[1]
            const endX = numbers.at(-2) ?? numbers[0]
            const endY = numbers.at(-1) ?? numbers[1]
            
            // Check if path is vertical (same X) or horizontal (same Y)
            const isVertical = Math.abs(endX - startX) < 0.1
            const isHorizontal = Math.abs(endY - startY) < 0.1
            
            if (isVertical) {
                // Vertical path - use Y coordinates
                const yCoords = [startY, endY]
                return {
                    minX: Math.min(startX, endX),
                    maxX: Math.max(startX, endX),
                    minY: Math.min(...yCoords),
                    maxY: Math.max(...yCoords),
                    startX,
                    startY,
                    endX,
                    endY,
                    y: startY,
                    isHorizontal: false,
                    isVertical: true
                }
            } else {
                // Horizontal or diagonal path - use X coordinates
                const xCoords = [startX]
                if (path.includes('H')) {
                    xCoords.push(numbers.at(-1)!)
                } else if (path.includes('L')) {
                    for (let i = 2; i < numbers.length; i += 2) {
                        xCoords.push(numbers[i])
                    }
                }
                return {
                    minX: Math.min(...xCoords),
                    maxX: Math.max(...xCoords),
                    startX,
                    startY,
                    endX,
                    endY,
                    y: startY,
                    isHorizontal: path.includes('H') || isHorizontal,
                    isVertical: false
                }
            }
        }
        return { minX: 0, maxX: 1000, startX: 0, y: 185, isHorizontal: false, isVertical: false }
    }

    const bounds = parsePathBounds(d)
    
    // Check if path is vertical (same X coordinates)
    const numbers = d.match(/-?\d+\.?\d*/g)?.map(Number) || []
    const isVerticalPath = bounds.isVertical ?? (numbers.length >= 4 && Math.abs(numbers[0] - (numbers.at(-2) ?? numbers[0])) < 0.1)
    
    // Calculate path length - use Y difference for vertical paths, X difference for horizontal/diagonal
    const pathLength = isVerticalPath
        ? Math.abs((bounds.maxY ?? bounds.endY ?? numbers.at(-1) ?? numbers[1]) - (bounds.startY ?? bounds.y ?? numbers[1]))
        : bounds.maxX - bounds.minX
    const beamLength = pathLength * 0.5 // Beam is 50% of path length for long effect

    // Determine direction based on path start position and reverse flag
    const goingRight = bounds.startX === bounds.minX
    const actualReverse = reverse ? goingRight : !goingRight

    // Calculate gradient animation coordinates
    // For vertical paths, animate along Y axis; for horizontal/diagonal, animate along X axis
    const gradientAnim = isVerticalPath
        ? actualReverse
            ? {
                // Bottom to top animation (vertical)
                y1: [(bounds.maxY ?? bounds.endY ?? numbers.at(-1)!) + beamLength, (bounds.startY ?? bounds.y ?? numbers[1]) - beamLength],
                y2: [(bounds.maxY ?? bounds.endY ?? numbers.at(-1)!) + beamLength * 0.5, (bounds.startY ?? bounds.y ?? numbers[1]) - beamLength * 1.5],
                x1: bounds.startX,
                x2: bounds.startX,
            }
            : {
                // Top to bottom animation (vertical)
                y1: [(bounds.startY ?? bounds.y ?? numbers[1]) - beamLength, (bounds.maxY ?? bounds.endY ?? numbers.at(-1)!) + beamLength],
                y2: [(bounds.startY ?? bounds.y ?? numbers[1]) - beamLength * 1.5, (bounds.maxY ?? bounds.endY ?? numbers.at(-1)!) + beamLength * 0.5],
                x1: bounds.startX,
                x2: bounds.startX,
            }
        : actualReverse
            ? {
                // Right to left animation (horizontal/diagonal)
                x1: [bounds.maxX + beamLength, bounds.minX - beamLength],
                x2: [bounds.maxX + beamLength * 0.5, bounds.minX - beamLength * 1.5],
                y1: bounds.y,
                y2: bounds.y,
            }
            : {
                // Left to right animation (horizontal/diagonal)
                x1: [bounds.minX - beamLength, bounds.maxX + beamLength],
                x2: [bounds.minX - beamLength * 1.5, bounds.maxX + beamLength * 0.5],
                y1: bounds.y,
                y2: bounds.y,
            }

    // Ensure gradient coordinates are valid numbers
    const yPos = bounds.y || 185.289
    const gradientRef = useRef<SVGLinearGradientElement>(null)
    
    // Animate gradient using requestAnimationFrame
    useEffect(() => {
        if (!gradientRef.current) return
        
        let startTime: number | null = null
        let animationFrame: number
        
        const animateGradient = (timestamp: number) => {
            startTime ??= timestamp
            const elapsed = (timestamp - startTime) / 1000 // Convert to seconds
            const totalDuration = duration + 0.5 // Include repeatDelay
            
            // Calculate progress (0 to 1, repeating)
            const progress = ((elapsed + delay) % totalDuration) / duration
            const clampedProgress = Math.min(Math.max(progress, 0), 1)
            
            // Interpolate gradient position
            const easeInOutCubic = (t: number) => {
                return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
            }
            const eased = easeInOutCubic(clampedProgress)
            
            // Calculate current gradient position
            if (isVerticalPath) {
                // Vertical path - animate Y coordinates
                const vertAnim = gradientAnim as VerticalGradientAnim
                const y1Start = vertAnim.y1[0]
                const y1End = vertAnim.y1[1]
                const y2Start = vertAnim.y2[0]
                const y2End = vertAnim.y2[1]
                
                const currentY1 = y1Start + (y1End - y1Start) * eased
                const currentY2 = y2Start + (y2End - y2Start) * eased
                
                if (gradientRef.current) {
                    gradientRef.current.setAttribute('x1', vertAnim.x1.toString())
                    gradientRef.current.setAttribute('y1', currentY1.toString())
                    gradientRef.current.setAttribute('x2', vertAnim.x2.toString())
                    gradientRef.current.setAttribute('y2', currentY2.toString())
                }
            } else {
                // Horizontal/diagonal path - animate X coordinates
                const horizAnim = gradientAnim as HorizontalGradientAnim
                const x1Start = horizAnim.x1[0]
                const x1End = horizAnim.x1[1]
                const x2Start = horizAnim.x2[0]
                const x2End = horizAnim.x2[1]
                
                const currentX1 = x1Start + (x1End - x1Start) * eased
                const currentX2 = x2Start + (x2End - x2Start) * eased
                
                if (gradientRef.current) {
                    gradientRef.current.setAttribute('x1', currentX1.toString())
                    gradientRef.current.setAttribute('y1', horizAnim.y1.toString())
                    gradientRef.current.setAttribute('x2', currentX2.toString())
                    gradientRef.current.setAttribute('y2', horizAnim.y2.toString())
                }
            }
            
            animationFrame = requestAnimationFrame(animateGradient)
        }
        
        animationFrame = requestAnimationFrame(animateGradient)
        
        return () => {
            cancelAnimationFrame(animationFrame)
        }
    }, [duration, delay, gradientAnim, isVerticalPath])
    
    return (
        <>
            <defs>
                <linearGradient
                    ref={gradientRef}
                    id={gradientId}
                    gradientUnits="userSpaceOnUse"
                    x1={isVerticalPath ? (gradientAnim as VerticalGradientAnim).x1 : (gradientAnim as HorizontalGradientAnim).x1[0]}
                    x2={isVerticalPath ? (gradientAnim as VerticalGradientAnim).x2 : (gradientAnim as HorizontalGradientAnim).x2[0]}
                    y1={isVerticalPath ? (gradientAnim as VerticalGradientAnim).y1[0] : (gradientAnim as HorizontalGradientAnim).y1}
                    y2={isVerticalPath ? (gradientAnim as VerticalGradientAnim).y2[0] : (gradientAnim as HorizontalGradientAnim).y2}
                >
                    <stop stopColor="#FEDA24" stopOpacity="0" />
                    <stop offset="2%" stopColor="#FEDA24" stopOpacity="0.2" />
                    <stop offset="8%" stopColor="#FEDA24" stopOpacity="0.5" />
                    <stop offset="20%" stopColor="#FEDA24" stopOpacity="0.8" />
                    <stop offset="35%" stopColor="#FEDA24" />
                    <stop offset="48%" stopColor="#ffffff" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#ffffff" />
                    <stop offset="52%" stopColor="#ffffff" stopOpacity="0.9" />
                    <stop offset="65%" stopColor="#FEDA24" />
                    <stop offset="80%" stopColor="#FEDA24" stopOpacity="0.8" />
                    <stop offset="92%" stopColor="#FEDA24" stopOpacity="0.5" />
                    <stop offset="98%" stopColor="#FEDA24" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#FEDA24" stopOpacity="0" />
                </linearGradient>
            </defs>
            <path
                d={d}
                stroke={`url(#${gradientId})`}
                strokeWidth={beamWidth}
                fill="none"
                filter={`url(#${glowFilterId})`}
                strokeLinecap="round"
            />
        </>
    )
}

export function BottomLinesAnimated({
    className,
    style,
    duration = 3,
    delay = 0,
    beamColor = '#FEDA24',
    beamColorSecondary = '#FF8C32',
    pathColor = '#444444',
    beamWidth = 2,
    pathWidth = 1,
}: Readonly<BottomLinesAnimatedProps>) {
    // Use a stable ID that's consistent between server and client
    const [stableId, setStableId] = useState('bottom-lines')

    useEffect(() => {
        // Generate a unique ID only on the client after mount
        setStableId(`bottom-lines-${Math.random().toString(36).substring(2, 11)}`)
    }, [])

    const glowFilterId = `beam-glow-${stableId}`

    // Path definitions from Bottom_Lines.svg - beams flowing DOWN from center
    const paths = {
        // Center vertical line - flows down from top
        centerVertical: 'M391.754 122.126L391.754 240.33',
        // Right diagonal - flows down and right
        rightDiagonal: 'M391.776 159.205L767.027 208.263L767.027 240.555',
        // Left diagonal - flows down and left
        leftDiagonal: 'M390.306 158.789L15.055 207.847L15.055 240.277',
    }

    // All beam configurations - left flows left, right flows right, all start/finish together
    const beamConfigs = [
        { key: 'centerVertical', d: paths.centerVertical, delay: 0, reverse: true },
        { key: 'rightDiagonal', d: paths.rightDiagonal, delay: 0, reverse: false }, // Right flows right
        { key: 'leftDiagonal', d: paths.leftDiagonal, delay: 0, reverse: false }, // Left flows left
    ]

    return (
        <svg
            width="783"
            height="390"
            viewBox="0 0 783 390"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('', className)}
            style={style}
        >
            <defs>
                {/* Glow filter for animated beams */}
                <filter id={glowFilterId} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Static path lines (background) */}
            {beamConfigs.map((config) => (
                <path
                    key={`static-${config.key}`}
                    d={config.d}
                    stroke={pathColor}
                    strokeWidth={pathWidth}
                    fill="none"
                />
            ))}

            {/* Animated beams - flowing down */}
            {beamConfigs.map((config) => {
                const isHorizontal = config.key.includes('Horizontal')
                return (
                    <AnimatedPathBeam
                        key={config.key}
                        pathId={config.key}
                        d={config.d}
                        gradientId={`beam-grad-${config.key}-${stableId}`}
                        beamWidth={isHorizontal ? beamWidth : beamWidth * 0.8}
                        glowFilterId={glowFilterId}
                        duration={duration}
                        delay={delay + config.delay}
                        reverse={config.reverse}
                    />
                )
            })}

            {/* Junction dots with pulsing animation - all glow when beams hit */}
            <motion.circle
                cx="391.756"
                cy="158.914"
                r="1.96814"
                fill="white"
                animate={{
                    r: [1.96814, 3.5, 1.96814],
                    opacity: [0.5, 1, 0.5],
                }}
                transition={{
                    duration: duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                style={{
                    filter: 'drop-shadow(0 0 6px #FEDA24)',
                }}
            />
            <motion.circle
                cx="766.536"
                cy="207.914"
                r="1.96814"
                fill="white"
                animate={{
                    r: [1.96814, 3.5, 1.96814],
                    opacity: [0.5, 1, 0.5],
                }}
                transition={{
                    duration: duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0,
                }}
                style={{
                    filter: 'drop-shadow(0 0 6px #FEDA24)',
                }}
            />
            <motion.circle
                cx="15.5358"
                cy="207.914"
                r="1.96814"
                fill="white"
                animate={{
                    r: [1.96814, 3.5, 1.96814],
                    opacity: [0.5, 1, 0.5],
                }}
                transition={{
                    duration: duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0,
                }}
                style={{
                    filter: 'drop-shadow(0 0 6px #FEDA24)',
                }}
            />
        </svg>
    )
}

export default BottomLinesAnimated

