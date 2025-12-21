'use client'

import { useState, useEffect, useRef } from 'react'
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
    /** Scroll progress (0-1) for retraction animation */
    scrollProgress?: number
    /** Whether retraction is active */
    isRetracting?: boolean
    /** Current scroll Y position in pixels */
    scrollY?: number
    /** Hero section scroll progress (0-1) for dots fade animation */
    heroScrollProgress?: number
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
    scrollProgress = 0,
    isRetracting = false,
    isLeftSide = false,
}: Readonly<{
    pathId: string
    d: string
    gradientId: string
    beamWidth: number
    glowFilterId: string
    duration: number
    delay: number
    reverse?: boolean
    scrollProgress?: number
    isRetracting?: boolean
    isLeftSide?: boolean
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
    const actualReverse = reverse ? !goingRight : goingRight

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
    
    // Animate gradient using requestAnimationFrame - only when not retracting
    useEffect(() => {
        if (!gradientRef.current || isRetracting) return
        
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
            
            if (gradientRef.current && !isRetracting) {
                gradientRef.current.setAttribute('x1', currentX1.toString())
                gradientRef.current.setAttribute('x2', currentX2.toString())
            }
            
            if (!isRetracting) {
                animationFrame = requestAnimationFrame(animateGradient)
            }
        }
        
        animationFrame = requestAnimationFrame(animateGradient)
        
        return () => {
            cancelAnimationFrame(animationFrame)
        }
    }, [duration, delay, gradientAnim, isRetracting])
    
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
    scrollProgress = 0,
    isRetracting = false,
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
    scrollProgress?: number
    isRetracting?: boolean
}>) {
    const centerX = x + width / 2
    const centerY = y + height / 2
    
    // Create smooth circular motion around the rectangle perimeter
    // We'll move the gradient along the perimeter in one continuous direction
    const topMid = { x: centerX, y }
    const rightMid = { x: x + width, y: centerY }
    const bottomMid = { x: centerX, y: y + height }
    const leftMid = { x, y: centerY }
    
    // Calculate perimeter length for dash offset
    const perimeter = 2 * (width + height)
    
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
                pathLength={1}
                strokeDasharray={isRetracting ? "1" : "none"}
                strokeDashoffset={isRetracting ? scrollProgress : 0}
                style={{
                    opacity: isRetracting ? 1 - scrollProgress : 1
                }}
            />
            <defs>
                <motion.linearGradient
                    id={gradientId}
                    gradientUnits="userSpaceOnUse"
                    animate={isRetracting ? {} : {
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
    scrollProgress = 0,
    isRetracting = false,
    scrollY = 0,
    heroScrollProgress = 0,
}: Readonly<TraceLineAnimatedProps>) {
    // Use a stable ID that's consistent between server and client
    const [stableId, setStableId] = useState('trace-lines')

    useEffect(() => {
        // Generate a unique ID only on the client after mount
        setStableId(`trace-lines-${Math.random().toString(36).substring(2, 11)}`)
    }, [])

    const glowFilterId = `beam-glow-${stableId}`

    // Path definitions - these match the Trace_Lines.svg coordinates
    // Note: Horizontal beams are now handled separately in HorizontalBeamAnimated component
    const paths = {
        // Right side - beams going outward from center (top and bottom only)
        rightTop: 'M703.874 185.265L746.294 57.7268L792.477 57.726',
        rightBottom: 'M703.873 185.266L793.103 309.355L838.5 309.355',
        // Left side - beams going outward from center (top and bottom only)
        leftTop: 'M401.177 185.265L358.757 57.7268L307.574 57.726',
        leftBottom: 'M401.178 185.266L311.948 309.355L256.434 309.355',
    }

    // Right side beam configurations - retract with positive scrollProgress
    const rightBeamConfigs = [
        { key: 'rightTop', d: paths.rightTop, delay: 0.3, reverse: false },
        { key: 'rightBottom', d: paths.rightBottom, delay: 0.6, reverse: false },
    ]

    // Left side beam configurations - retract with negative scrollProgress (inverse)
    const leftBeamConfigs = [
        { key: 'leftTop', d: paths.leftTop, delay: 0.45, reverse: true },
        { key: 'leftBottom', d: paths.leftBottom, delay: 0.75, reverse: true },
    ]

    // Calculate dots opacity - fade out smoothly by y position 20 (scrollProgress 0.02)
    // Use heroScrollProgress which tracks the hero section scroll (0-1)
    // 0.02 scroll progress = 20px in a 1000px hero section
    const dotsOpacity = (heroScrollProgress ?? 0) >= 0.02 ? 0 : Math.max(0, 1 - ((heroScrollProgress ?? 0) / 0.02))

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
            </defs>

            {/* RIGHT SIDE - Retracts from left to right (clips from left) */}
            <g style={{
                clipPath: isRetracting ? `inset(0 0 0 ${scrollProgress * 100}%)` : 'none',
                opacity: isRetracting ? 1 - scrollProgress : 1,
            }}>
                {rightBeamConfigs.map((config) => (
                    <path
                        key={`static-${config.key}`}
                        d={config.d}
                        stroke={pathColor}
                        strokeWidth={pathWidth}
                        fill="none"
                    />
                ))}
                {rightBeamConfigs.map((config) => (
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
                        scrollProgress={scrollProgress}
                        isRetracting={isRetracting}
                    />
                ))}
            </g>

            {/* LEFT SIDE - Retracts from right to left (clips from right) */}
            <g style={{
                clipPath: isRetracting ? `inset(0 ${scrollProgress * 100}% 0 0)` : 'none',
                opacity: isRetracting ? 1 - scrollProgress : 1,
            }}>
                {leftBeamConfigs.map((config) => (
                    <path
                        key={`static-${config.key}`}
                        d={config.d}
                        stroke={pathColor}
                        strokeWidth={pathWidth}
                        fill="none"
                    />
                ))}
                {leftBeamConfigs.map((config) => (
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
                        scrollProgress={scrollProgress}
                        isRetracting={isRetracting}
                        isLeftSide={true}
                    />
                ))}
            </g>

            {/* Junction dots - Right side */}
            <circle
                cx="703.999"
                cy="185.286"
                r="2"
                fill="white"
                style={{
                    filter: 'drop-shadow(0 0 6px #FEDA24)',
                    opacity: dotsOpacity,
                    transition: 'opacity 0.3s ease-out',
                }}
            />
            <circle 
                cx="746.999" 
                cy="58.286" 
                r="2" 
                fill="white"
                style={{
                    opacity: dotsOpacity,
                    transition: 'opacity 0.3s ease-out',
                }}
            />
            <circle 
                cx="792.999" 
                cy="309.286" 
                r="2" 
                fill="white"
                style={{
                    opacity: dotsOpacity,
                    transition: 'opacity 0.3s ease-out',
                }}
            />

            {/* Junction dots - Left side */}
            <circle
                cx="401.052"
                cy="185.286"
                r="2"
                fill="white"
                style={{
                    filter: 'drop-shadow(0 0 6px #FEDA24)',
                    opacity: dotsOpacity,
                    transition: 'opacity 0.3s ease-out',
                }}
            />
            <circle 
                cx="358.052" 
                cy="58.286" 
                r="2" 
                fill="white"
                style={{
                    opacity: dotsOpacity,
                    transition: 'opacity 0.3s ease-out',
                }}
            />
            <circle 
                cx="312.052" 
                cy="309.286" 
                r="2" 
                fill="white"
                style={{
                    opacity: dotsOpacity,
                    transition: 'opacity 0.3s ease-out',
                }}
            />

            {/* Outer rounded rectangles */}
            {showOuterBoxes && (
                <>
                    {/* Static background boxes */}
                    {/* Right side boxes */}
                    <rect 
                        x="992.16" 
                        y="129.481" 
                        width="109.32" 
                        height="109.32" 
                        rx="31.5" 
                        stroke={pathColor} 
                        fill="none"
                        style={{
                            opacity: isRetracting ? 1 - scrollProgress : 1
                        }}
                    />
                    <rect 
                        x="792.23" 
                        y="0.5" 
                        width="109.32" 
                        height="109.32" 
                        rx="31.5" 
                        stroke={pathColor} 
                        fill="none"
                        style={{
                            opacity: isRetracting ? 1 - scrollProgress : 1
                        }}
                    />
                    <rect 
                        x="838.17" 
                        y="254.15" 
                        width="109.32" 
                        height="109.32" 
                        rx="31.5" 
                        stroke={pathColor} 
                        fill="none"
                        style={{
                            opacity: isRetracting ? 1 - scrollProgress : 1
                        }}
                    />

                    {/* Left side boxes */}
                    <rect 
                        x="0.18" 
                        y="129.481" 
                        width="109.32" 
                        height="109.32" 
                        rx="31.5" 
                        stroke={pathColor} 
                        fill="none"
                        style={{
                            opacity: isRetracting ? 1 - scrollProgress : 1
                        }}
                    />
                    <rect 
                        x="197.278" 
                        y="0.5" 
                        width="109.32" 
                        height="109.32" 
                        rx="31.5" 
                        stroke={pathColor} 
                        fill="none"
                        style={{
                            opacity: isRetracting ? 1 - scrollProgress : 1
                        }}
                    />
                    <rect 
                        x="146.17" 
                        y="252.641" 
                        width="109.32" 
                        height="109.32" 
                        rx="31.5" 
                        stroke={pathColor} 
                        fill="none"
                        style={{
                            opacity: isRetracting ? 1 - scrollProgress : 1
                        }}
                    />

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
                        scrollProgress={scrollProgress}
                        isRetracting={isRetracting}
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
                        scrollProgress={scrollProgress}
                        isRetracting={isRetracting}
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
                        scrollProgress={scrollProgress}
                        isRetracting={isRetracting}
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
                        scrollProgress={scrollProgress}
                        isRetracting={isRetracting}
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
                        scrollProgress={scrollProgress}
                        isRetracting={isRetracting}
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
                        scrollProgress={scrollProgress}
                        isRetracting={isRetracting}
                    />
                </>
            )}
        </svg>
    )
}

export default TraceLinesAnimated
