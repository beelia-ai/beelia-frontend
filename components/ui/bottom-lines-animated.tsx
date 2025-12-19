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
    // For horizontal paths like "M612.227 185.289H992.05", extract the X coordinates
    const parsePathBounds = (path: string) => {
        const numbers = path.match(/-?\d+\.?\d*/g)?.map(Number) || []
        if (numbers.length >= 2) {
            const xCoords = [numbers[0]]
            // For H command, the last number is the end X
            if (path.includes('H')) {
                xCoords.push(numbers.at(-1)!)
            } else if (path.includes('L')) {
                // For L commands, extract all X coordinates (every other number starting from 0)
                for (let i = 2; i < numbers.length; i += 2) {
                    xCoords.push(numbers[i])
                }
            }
            return {
                minX: Math.min(...xCoords),
                maxX: Math.max(...xCoords),
                startX: numbers[0],
                y: numbers[1],
                isHorizontal: path.includes('H')
            }
        }
        return { minX: 0, maxX: 1000, startX: 0, y: 185, isHorizontal: false }
    }

    const bounds = parsePathBounds(d)
    const pathLength = bounds.maxX - bounds.minX
    const beamLength = pathLength * 0.5 // Beam is 50% of path length for long effect

    // Determine direction based on path start position and reverse flag
    const goingRight = bounds.startX === bounds.minX
    const actualReverse = reverse ? goingRight : !goingRight

    // Calculate gradient animation coordinates - ensure proper values for horizontal lines
    const gradientAnim = actualReverse
        ? {
            // Right to left animation
            x1: [bounds.maxX + beamLength, bounds.minX - beamLength],
            x2: [bounds.maxX + beamLength * 0.5, bounds.minX - beamLength * 1.5],
        }
        : {
            // Left to right animation (default for rightHorizontal)
            x1: [bounds.minX - beamLength, bounds.maxX + beamLength],
            x2: [bounds.minX - beamLength * 1.5, bounds.maxX + beamLength * 0.5],
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
            const x1Start = gradientAnim.x1[0]
            const x1End = gradientAnim.x1[1]
            const x2Start = gradientAnim.x2[0]
            const x2End = gradientAnim.x2[1]
            
            const currentX1 = x1Start + (x1End - x1Start) * eased
            const currentX2 = x2Start + (x2End - x2Start) * eased
            
            if (gradientRef.current) {
                gradientRef.current.setAttribute('x1', currentX1.toString())
                gradientRef.current.setAttribute('x2', currentX2.toString())
            }
            
            animationFrame = requestAnimationFrame(animateGradient)
        }
        
        animationFrame = requestAnimationFrame(animateGradient)
        
        return () => {
            cancelAnimationFrame(animationFrame)
        }
    }, [duration, delay, gradientAnim])
    
    return (
        <>
            <defs>
                <linearGradient
                    ref={gradientRef}
                    id={gradientId}
                    gradientUnits="userSpaceOnUse"
                    x1={gradientAnim.x1[0]}
                    x2={gradientAnim.x2[0]}
                    y1={yPos}
                    y2={yPos}
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

            {/* Junction dots with pulsing animation */}
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
            <circle cx="766.536" cy="207.914" r="1.96814" fill="white" />
            <circle cx="15.5358" cy="207.914" r="1.96814" fill="white" />
        </svg>
    )
}

export default BottomLinesAnimated

