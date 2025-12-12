'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TraceLineAnimatedProps {
    className?: string
    style?: React.CSSProperties
    /** Animation duration in seconds */
    duration?: number
    /** Delay before animation starts (in seconds) */
    delay?: number
    /** Whether to show the outer rounded rectangles */
    showOuterBoxes?: boolean
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

// Animated beam component using framer-motion
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
                y: numbers[1]
            }
        }
        return { minX: 0, maxX: 1000, startX: 0, y: 185 }
    }

    const bounds = parsePathBounds(d)
    const pathLength = bounds.maxX - bounds.minX
    const beamLength = pathLength * 0.5 // Beam is 50% of path length for long effect

    // Determine direction based on path start position and reverse flag
    const goingRight = bounds.startX === bounds.minX
    const actualReverse = reverse ? !goingRight : goingRight

    // Calculate gradient animation coordinates
    const gradientAnim = actualReverse
        ? {
            // Right to left animation
            x1: [bounds.maxX + beamLength, bounds.minX - beamLength],
            x2: [bounds.maxX, bounds.minX - beamLength * 2],
        }
        : {
            // Left to right animation (default for rightHorizontal)
            x1: [bounds.minX - beamLength, bounds.maxX + beamLength],
            x2: [bounds.minX, bounds.maxX + beamLength * 2],
        }

    return (
        <>
            <path
                d={d}
                stroke={`url(#${gradientId})`}
                strokeWidth={beamWidth}
                fill="none"
                filter={`url(#${glowFilterId})`}
                strokeLinecap="round"
            />
            <defs>
                <motion.linearGradient
                    id={gradientId}
                    gradientUnits="userSpaceOnUse"
                    initial={{
                        x1: gradientAnim.x1[0],
                        x2: gradientAnim.x2[0],
                        y1: bounds.y,
                        y2: bounds.y,
                    }}
                    animate={{
                        x1: gradientAnim.x1,
                        x2: gradientAnim.x2,
                        y1: bounds.y,
                        y2: bounds.y,
                    }}
                    transition={{
                        delay,
                        duration,
                        ease: [0.16, 1, 0.3, 1],
                        repeat: Infinity,
                        repeatDelay: 0.5,
                    }}
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
                </motion.linearGradient>
            </defs>
        </>
    )
}

// Animated border beam for rectangles
function AnimatedBorderBeam({
    x,
    y,
    width,
    height,
    rx,
    gradientId,
    glowFilterId,
    duration,
    delay,
    beamColor,
}: Readonly<{
    x: number
    y: number
    width: number
    height: number
    rx: number
    gradientId: string
    glowFilterId: string
    duration: number
    delay: number
    beamColor: string
}>) {
    const centerX = x + width / 2
    const centerY = y + height / 2
    
    // Create smooth circular motion around the rectangle perimeter
    // We'll move the gradient along the perimeter in one continuous direction
    const topMid = { x: centerX, y }
    const rightMid = { x: x + width, y: centerY }
    const bottomMid = { x: centerX, y: y + height }
    const leftMid = { x, y: centerY }
    
    return (
        <>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                rx={rx}
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth="1.2"
                filter={`url(#${glowFilterId})`}
            />
            <defs>
                <motion.linearGradient
                    id={gradientId}
                    gradientUnits="userSpaceOnUse"
                    animate={{
                        x1: [
                            topMid.x, rightMid.x, bottomMid.x, leftMid.x, topMid.x
                        ],
                        y1: [
                            topMid.y, rightMid.y, bottomMid.y, leftMid.y, topMid.y
                        ],
                        x2: [
                            bottomMid.x, leftMid.x, topMid.x, rightMid.x, bottomMid.x
                        ],
                        y2: [
                            bottomMid.y, leftMid.y, topMid.y, rightMid.y, bottomMid.y
                        ],
                    }}
                    transition={{
                        delay,
                        duration: duration * 2,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                >
                    <stop stopColor={beamColor} stopOpacity="0" />
                    <stop offset="2%" stopColor={beamColor} stopOpacity="0.2" />
                    <stop offset="8%" stopColor={beamColor} stopOpacity="0.5" />
                    <stop offset="20%" stopColor={beamColor} stopOpacity="0.8" />
                    <stop offset="35%" stopColor={beamColor} />
                    <stop offset="48%" stopColor="#ffffff" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#ffffff" />
                    <stop offset="52%" stopColor="#ffffff" stopOpacity="0.9" />
                    <stop offset="65%" stopColor={beamColor} />
                    <stop offset="80%" stopColor={beamColor} stopOpacity="0.8" />
                    <stop offset="92%" stopColor={beamColor} stopOpacity="0.5" />
                    <stop offset="98%" stopColor={beamColor} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={beamColor} stopOpacity="0" />
                </motion.linearGradient>
            </defs>
        </>
    )
}

export function TraceLinesAnimated({
    className,
    style,
    duration = 3,
    delay = 0,
    showOuterBoxes = true,
    beamColor = '#FEDA24',
    beamColorSecondary = '#FF8C32',
    pathColor = '#444444',
    beamWidth = 2,
    pathWidth = 1,
}: Readonly<TraceLineAnimatedProps>) {
    // Use a stable ID that's consistent between server and client
    const [stableId, setStableId] = useState('trace-lines')

    useEffect(() => {
        // Generate a unique ID only on the client after mount
        setStableId(`trace-lines-${Math.random().toString(36).substring(2, 11)}`)
    }, [])

    const glowFilterId = `beam-glow-${stableId}`
    const staticGlowFilterId = `static-glow-${stableId}`

    // Path definitions - these match the Trace_Lines.svg coordinates
    const paths = {
        // Right side - beams going outward from center
        rightHorizontal: 'M612.227 185.289H992.05',
        rightTop: 'M703.874 185.265L746.294 57.7268L792.477 57.726',
        rightBottom: 'M703.873 185.266L793.103 309.355L838.5 309.355',
        // Left side - beams going outward from center
        leftHorizontal: 'M492.824 185.289H110.001',
        leftTop: 'M401.177 185.265L358.757 57.7268L307.574 57.726',
        leftBottom: 'M401.178 185.266L311.948 309.355L256.434 309.355',
    }

    // Horizontal lines (will have static glow)
    const horizontalPaths = [
        { key: 'rightHorizontal', d: paths.rightHorizontal },
        { key: 'leftHorizontal', d: paths.leftHorizontal },
    ]

    // Diagonal beam configurations with staggered delays (animated)
    const beamConfigs = [
        { key: 'rightTop', d: paths.rightTop, delay: 0.3, reverse: false },
        { key: 'rightBottom', d: paths.rightBottom, delay: 0.6, reverse: false },
        { key: 'leftTop', d: paths.leftTop, delay: 0.45, reverse: true },
        { key: 'leftBottom', d: paths.leftBottom, delay: 0.75, reverse: true },
    ]

    return (
        <svg
            width="1102"
            height="364"
            viewBox="0 0 1102 364"
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
                
                {/* Static glow filter for horizontal lines */}
                <filter id={staticGlowFilterId} x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur1" />
                    <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur2" />
                    <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur3" />
                    <feMerge>
                        <feMergeNode in="blur3" />
                        <feMergeNode in="blur2" />
                        <feMergeNode in="blur1" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Static path lines (background) - diagonal paths */}
            {beamConfigs.map((config) => (
                <path
                    key={`static-${config.key}`}
                    d={config.d}
                    stroke={pathColor}
                    strokeWidth={pathWidth}
                    fill="none"
                />
            ))}

            {/* Static background for horizontal lines */}
            {horizontalPaths.map((line) => (
                <path
                    key={`static-${line.key}`}
                    d={line.d}
                    stroke={pathColor}
                    strokeWidth={pathWidth}
                    fill="none"
                />
            ))}

            {/* Horizontal lines with static glow */}
            {horizontalPaths.map((line) => (
                <g key={`glow-group-${line.key}`}>
                    {/* Multiple layers for enhanced glow effect */}
                    <path
                        d={line.d}
                        stroke={beamColor}
                        strokeWidth={beamWidth * 3}
                        fill="none"
                        strokeLinecap="round"
                        opacity="0.4"
                        filter={`url(#${staticGlowFilterId})`}
                    />
                    <path
                        d={line.d}
                        stroke={beamColor}
                        strokeWidth={beamWidth * 1.5}
                        fill="none"
                        strokeLinecap="round"
                        opacity="0.6"
                        filter={`url(#${staticGlowFilterId})`}
                    />
                    <path
                        d={line.d}
                        stroke={beamColor}
                        strokeWidth={beamWidth}
                        fill="none"
                        strokeLinecap="round"
                        opacity="0.9"
                    />
                    <path
                        d={line.d}
                        stroke="#ffffff"
                        strokeWidth={beamWidth * 0.4}
                        fill="none"
                        strokeLinecap="round"
                        opacity="0.7"
                    />
                </g>
            ))}

            {/* Animated beams - only diagonal lines */}
            {beamConfigs.map((config) => (
                <AnimatedPathBeam
                    key={config.key}
                    pathId={config.key}
                    d={config.d}
                    gradientId={`beam-grad-${config.key}-${stableId}`}
                    beamWidth={beamWidth * 0.8}
                    glowFilterId={glowFilterId}
                    duration={duration}
                    delay={delay + config.delay}
                    reverse={config.reverse}
                />
            ))}

            {/* Junction dots - Right side with pulsing animation */}
            <motion.circle
                cx="703.999"
                cy="185.286"
                r="2"
                fill="white"
                animate={{
                    r: [2, 4, 2],
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
            <circle cx="746.999" cy="58.286" r="2" fill="white" />
            <circle cx="792.999" cy="309.286" r="2" fill="white" />

            {/* Junction dots - Left side with pulsing animation */}
            <motion.circle
                cx="401.052"
                cy="185.286"
                r="2"
                fill="white"
                animate={{
                    r: [2, 4, 2],
                    opacity: [0.5, 1, 0.5],
                }}
                transition={{
                    duration: duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.15,
                }}
                style={{
                    filter: 'drop-shadow(0 0 6px #FEDA24)',
                }}
            />
            <circle cx="358.052" cy="58.286" r="2" fill="white" />
            <circle cx="312.052" cy="309.286" r="2" fill="white" />

            {/* Outer rounded rectangles */}
            {showOuterBoxes && (
                <>
                    {/* Static background boxes */}
                    {/* Right side boxes */}
                    <rect x="992.16" y="129.481" width="109.32" height="109.32" rx="31.5" stroke={pathColor} fill="none" />
                    <rect x="792.23" y="0.5" width="109.32" height="109.32" rx="31.5" stroke={pathColor} fill="none" />
                    <rect x="838.17" y="254.15" width="109.32" height="109.32" rx="31.5" stroke={pathColor} fill="none" />

                    {/* Left side boxes */}
                    <rect x="0.18" y="129.481" width="109.32" height="109.32" rx="31.5" stroke={pathColor} fill="none" />
                    <rect x="197.278" y="0.5" width="109.32" height="109.32" rx="31.5" stroke={pathColor} fill="none" />
                    <rect x="146.17" y="252.641" width="109.32" height="109.32" rx="31.5" stroke={pathColor} fill="none" />

                    {/* Animated border beams on boxes */}
                    {/* Right side boxes */}
                    <AnimatedBorderBeam
                        x={992.16}
                        y={129.481}
                        width={109.32}
                        height={109.32}
                        rx={31.5}
                        gradientId={`box-beam-right-center-${stableId}`}
                        glowFilterId={glowFilterId}
                        duration={duration}
                        delay={delay + 0.2}
                        beamColor={beamColor}
                    />
                    <AnimatedBorderBeam
                        x={792.23}
                        y={0.5}
                        width={109.32}
                        height={109.32}
                        rx={31.5}
                        gradientId={`box-beam-right-top-${stableId}`}
                        glowFilterId={glowFilterId}
                        duration={duration}
                        delay={delay + 0.5}
                        beamColor={beamColor}
                    />
                    <AnimatedBorderBeam
                        x={838.17}
                        y={254.15}
                        width={109.32}
                        height={109.32}
                        rx={31.5}
                        gradientId={`box-beam-right-bottom-${stableId}`}
                        glowFilterId={glowFilterId}
                        duration={duration}
                        delay={delay + 0.8}
                        beamColor={beamColor}
                    />

                    {/* Left side boxes */}
                    <AnimatedBorderBeam
                        x={0.18}
                        y={129.481}
                        width={109.32}
                        height={109.32}
                        rx={31.5}
                        gradientId={`box-beam-left-center-${stableId}`}
                        glowFilterId={glowFilterId}
                        duration={duration}
                        delay={delay + 0.35}
                        beamColor={beamColor}
                    />
                    <AnimatedBorderBeam
                        x={197.278}
                        y={0.5}
                        width={109.32}
                        height={109.32}
                        rx={31.5}
                        gradientId={`box-beam-left-top-${stableId}`}
                        glowFilterId={glowFilterId}
                        duration={duration}
                        delay={delay + 0.65}
                        beamColor={beamColor}
                    />
                    <AnimatedBorderBeam
                        x={146.17}
                        y={252.641}
                        width={109.32}
                        height={109.32}
                        rx={31.5}
                        gradientId={`box-beam-left-bottom-${stableId}`}
                        glowFilterId={glowFilterId}
                        duration={duration}
                        delay={delay + 0.95}
                        beamColor={beamColor}
                    />
                </>
            )}
        </svg>
    )
}

export default TraceLinesAnimated
