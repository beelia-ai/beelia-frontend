'use client'

import { useState, useEffect, useId } from 'react'
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
}: {
    pathId: string
    d: string
    gradientId: string
    beamWidth: number
    glowFilterId: string
    duration: number
    delay: number
    reverse?: boolean
}) {
    // Parse the path to extract start and end coordinates for proper gradient animation
    // For horizontal paths like "M612.227 185.289H992.05", extract the X coordinates
    const parsePathBounds = (path: string) => {
        const numbers = path.match(/-?\d+\.?\d*/g)?.map(Number) || []
        if (numbers.length >= 2) {
            const xCoords = [numbers[0]]
            // For H command, the last number is the end X
            if (path.includes('H')) {
                xCoords.push(numbers[numbers.length - 1])
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
    const beamLength = pathLength * 0.15 // Beam is 15% of path length

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
                    <stop stopColor="#FEDA24" />
                    <stop offset="32.5%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#FEDA24" stopOpacity="0" />
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
}: TraceLineAnimatedProps) {
    // Use a stable ID that's consistent between server and client
    const [stableId, setStableId] = useState('trace-lines')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        // Generate a unique ID only on the client after mount
        setStableId(`trace-lines-${Math.random().toString(36).substr(2, 9)}`)
        setMounted(true)
    }, [])

    const glowFilterId = `beam-glow-${stableId}`

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

    // Beam configurations with staggered delays
    const beamConfigs = [
        { key: 'rightHorizontal', d: paths.rightHorizontal, delay: 0, reverse: false },
        { key: 'rightTop', d: paths.rightTop, delay: 0.3, reverse: false },
        { key: 'rightBottom', d: paths.rightBottom, delay: 0.6, reverse: false },
        { key: 'leftHorizontal', d: paths.leftHorizontal, delay: 0.15, reverse: true },
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
                {/* Glow filter for the beams */}
                <filter id={glowFilterId} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Static path lines (background) */}
            {Object.entries(paths).map(([key, d]) => (
                <path
                    key={`static-${key}`}
                    d={d}
                    stroke={pathColor}
                    strokeWidth={pathWidth}
                    fill="none"
                />
            ))}

            {/* Animated beams */}
            {beamConfigs.map((config) => (
                <AnimatedPathBeam
                    key={config.key}
                    pathId={config.key}
                    d={config.d}
                    gradientId={`beam-grad-${config.key}-${stableId}`}
                    beamWidth={beamWidth}
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
                    {/* Right side boxes */}
                    <rect x="992.16" y="129.481" width="109.32" height="109.32" rx="31.5" stroke={pathColor} fill="none" />
                    <rect x="792.23" y="0.5" width="109.32" height="109.32" rx="31.5" stroke={pathColor} fill="none" />
                    <rect x="838.17" y="254.15" width="109.32" height="109.32" rx="31.5" stroke={pathColor} fill="none" />

                    {/* Left side boxes */}
                    <rect x="0.18" y="129.481" width="109.32" height="109.32" rx="31.5" stroke={pathColor} fill="none" />
                    <rect x="197.278" y="0.5" width="109.32" height="109.32" rx="31.5" stroke={pathColor} fill="none" />
                    <rect x="146.17" y="252.641" width="109.32" height="109.32" rx="31.5" stroke={pathColor} fill="none" />
                </>
            )}
        </svg>
    )
}

export default TraceLinesAnimated
