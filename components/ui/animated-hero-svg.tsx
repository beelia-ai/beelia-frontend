'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface BeamState {
    id: string
    progress: number  // 0 = at outer endpoint, 1 = at center
    active: boolean
    startDelay: number // Stagger start times
}

interface DotGlowState {
    dotId: string
    intensity: number // 0-1
}

// Line paths from the SVG - each goes from an outer point to the center sphere
const PATHS = {
    // Right side lines
    rightHorizontal: {
        id: 'right-h',
        start: { x: 885, y: 152 },
        end: { x: 502, y: 152 },
        midDot: null,
    },
    rightTop: {
        id: 'right-top',
        start: { x: 690, y: 25 },
        mid: { x: 636, y: 25 },
        bend: { x: 594, y: 152 },
        end: { x: 502, y: 152 },
        midDot: { x: 594, y: 152 },
    },
    rightBottom: {
        id: 'right-bottom',
        start: { x: 740, y: 276 },
        mid: { x: 683, y: 276 },
        bend: { x: 594, y: 152 },
        end: { x: 502, y: 152 },
        midDot: { x: 594, y: 152 },
    },
    // Left side lines
    leftHorizontal: {
        id: 'left-h',
        start: { x: 0, y: 153 },
        end: { x: 383, y: 153 },
        midDot: null,
    },
    leftTop: {
        id: 'left-top',
        start: { x: 194, y: 25 },
        mid: { x: 248, y: 25 },
        bend: { x: 291, y: 152 },
        end: { x: 383, y: 153 },
        midDot: { x: 291, y: 152 },
    },
    leftBottom: {
        id: 'left-bottom',
        start: { x: 144, y: 276 },
        mid: { x: 201, y: 276 },
        bend: { x: 291, y: 152 },
        end: { x: 383, y: 153 },
        midDot: { x: 291, y: 152 },
    },
}

// Calculate position along a path based on progress
function getPositionOnPath(
    pathId: string,
    progress: number
): { x: number; y: number } {
    const path = Object.values(PATHS).find(p => p.id === pathId)
    if (!path) return { x: 0, y: 0 }

    // Simple two-point paths (horizontal lines)
    if (!('bend' in path)) {
        return {
            x: path.start.x + (path.end.x - path.start.x) * progress,
            y: path.start.y + (path.end.y - path.start.y) * progress,
        }
    }

    // Three-segment paths (diagonal lines with bends)
    // Split progress into segments
    const segment1End = 0.3 // start to mid
    const segment2End = 0.7 // mid to bend
    // segment 3: bend to end

    if (progress <= segment1End) {
        const localProgress = progress / segment1End
        return {
            x: path.start.x + (path.mid.x - path.start.x) * localProgress,
            y: path.start.y + (path.mid.y - path.start.y) * localProgress,
        }
    } else if (progress <= segment2End) {
        const localProgress = (progress - segment1End) / (segment2End - segment1End)
        return {
            x: path.mid.x + (path.bend.x - path.mid.x) * localProgress,
            y: path.mid.y + (path.bend.y - path.mid.y) * localProgress,
        }
    } else {
        const localProgress = (progress - segment2End) / (1 - segment2End)
        return {
            x: path.bend.x + (path.end.x - path.bend.x) * localProgress,
            y: path.bend.y + (path.end.y - path.bend.y) * localProgress,
        }
    }
}

export interface AnimatedHeroSvgProps {
    className?: string
    style?: React.CSSProperties
}

export function AnimatedHeroSvg({ className, style }: AnimatedHeroSvgProps) {
    const [beams, setBeams] = useState<BeamState[]>([
        { id: 'right-h', progress: 0, active: true, startDelay: 0 },
        { id: 'right-top', progress: 0, active: true, startDelay: 200 },
        { id: 'right-bottom', progress: 0, active: true, startDelay: 400 },
        { id: 'left-h', progress: 0, active: true, startDelay: 100 },
        { id: 'left-top', progress: 0, active: true, startDelay: 300 },
        { id: 'left-bottom', progress: 0, active: true, startDelay: 500 },
    ])

    const [dotGlows, setDotGlows] = useState<Record<string, number>>({
        'outer-right': 0,
        'outer-right-top': 0,
        'outer-right-bottom': 0,
        'outer-left': 0,
        'outer-left-top': 0,
        'outer-left-bottom': 0,
        'junction-right': 0,
        'junction-left': 0,
        'center': 0,
    })

    const [sphereGlow, setSphereGlow] = useState(0)
    const animationRef = useRef<number | null>(null)
    const startTimeRef = useRef<number>(Date.now())

    const BEAM_SPEED = 0.004 // Progress per frame
    const CYCLE_DELAY = 2000 // Delay between cycles in ms

    useEffect(() => {
        startTimeRef.current = Date.now()

        const animate = () => {
            const currentTime = Date.now()
            const elapsed = currentTime - startTimeRef.current

            setBeams(prevBeams => {
                const newBeams = prevBeams.map(beam => {
                    // Check if this beam should start yet (based on stagger delay)
                    if (elapsed < beam.startDelay) {
                        return beam
                    }

                    if (!beam.active) return beam

                    const newProgress = Math.min(1, beam.progress + BEAM_SPEED)

                    // Check if beam reached junction point (progress ~0.7 for diagonal paths)
                    if (beam.id.includes('top') || beam.id.includes('bottom')) {
                        if (beam.progress < 0.7 && newProgress >= 0.7) {
                            // Pulse the junction dot
                            const junctionId = beam.id.includes('right') ? 'junction-right' : 'junction-left'
                            setDotGlows(prev => ({ ...prev, [junctionId]: 1 }))
                            setTimeout(() => {
                                setDotGlows(prev => ({ ...prev, [junctionId]: Math.max(0, prev[junctionId] - 0.3) }))
                            }, 150)
                            setTimeout(() => {
                                setDotGlows(prev => ({ ...prev, [junctionId]: Math.max(0, prev[junctionId] - 0.3) }))
                            }, 300)
                            setTimeout(() => {
                                setDotGlows(prev => ({ ...prev, [junctionId]: 0 }))
                            }, 450)
                        }
                    }

                    // Check if beam reached center
                    if (beam.progress < 1 && newProgress >= 1) {
                        // Pulse the center sphere
                        setSphereGlow(prev => Math.min(1, prev + 0.3))
                        setDotGlows(prev => ({ ...prev, 'center': Math.min(1, prev['center'] + 0.3) }))
                    }

                    return {
                        ...beam,
                        progress: newProgress,
                        active: newProgress < 1,
                    }
                })

                // Check if all beams completed
                const allComplete = newBeams.every(b => b.progress >= 1)
                if (allComplete) {
                    // Reset after delay
                    setTimeout(() => {
                        startTimeRef.current = Date.now()
                        setBeams(prevB => prevB.map(b => ({ ...b, progress: 0, active: true })))
                        setSphereGlow(0)
                        setDotGlows({
                            'outer-right': 0,
                            'outer-right-top': 0,
                            'outer-right-bottom': 0,
                            'outer-left': 0,
                            'outer-left-top': 0,
                            'outer-left-bottom': 0,
                            'junction-right': 0,
                            'junction-left': 0,
                            'center': 0,
                        })
                    }, CYCLE_DELAY)
                }

                return newBeams
            })

            // Decay sphere glow
            setSphereGlow(prev => Math.max(0, prev - 0.005))

            animationRef.current = requestAnimationFrame(animate)
        }

        animationRef.current = requestAnimationFrame(animate)

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [])

    // Render a beam element
    const renderBeam = (beam: BeamState) => {
        if (beam.progress <= 0 || beam.progress >= 1) return null

        const pos = getPositionOnPath(beam.id, beam.progress)
        const isHorizontal = beam.id === 'right-h' || beam.id === 'left-h'
        const isRightSide = beam.id.includes('right')

        // Calculate beam angle for diagonal paths
        let angle = 0
        if (!isHorizontal) {
            const nextPos = getPositionOnPath(beam.id, Math.min(1, beam.progress + 0.05))
            angle = Math.atan2(nextPos.y - pos.y, nextPos.x - pos.x) * (180 / Math.PI)
        } else {
            angle = isRightSide ? 180 : 0
        }

        return (
            <g key={beam.id}>
                {/* Beam glow */}
                <defs>
                    <linearGradient id={`beam-gradient-${beam.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="15%" stopColor="#FEDA24" />
                        <stop offset="50%" stopColor="#ffffff" />
                        <stop offset="85%" stopColor="#FEDA24" />
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                    <filter id={`beam-glow-${beam.id}`} x="-100%" y="-100%" width="300%" height="300%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <rect
                    x={pos.x - 50}
                    y={pos.y - 1}
                    width={100}
                    height={2}
                    fill={`url(#beam-gradient-${beam.id})`}
                    filter={`url(#beam-glow-${beam.id})`}
                    transform={`rotate(${angle}, ${pos.x}, ${pos.y})`}
                    style={{ opacity: 0.9 }}
                />
            </g>
        )
    }

    // Render glowing dot
    const renderGlowingDot = (cx: number, cy: number, id: string, baseRadius: number = 2) => {
        const glowIntensity = dotGlows[id] || 0
        const scale = 1 + glowIntensity * 0.5
        const glowRadius = glowIntensity * 15

        return (
            <g key={id}>
                {glowIntensity > 0 && (
                    <>
                        {/* Outer glow */}
                        <circle
                            cx={cx}
                            cy={cy}
                            r={baseRadius + glowRadius}
                            fill={`rgba(254, 218, 36, ${glowIntensity * 0.3})`}
                            style={{ filter: 'blur(8px)' }}
                        />
                        {/* Inner glow */}
                        <circle
                            cx={cx}
                            cy={cy}
                            r={baseRadius + glowRadius * 0.5}
                            fill={`rgba(255, 255, 255, ${glowIntensity * 0.5})`}
                            style={{ filter: 'blur(4px)' }}
                        />
                    </>
                )}
                {/* Core dot */}
                <circle
                    cx={cx}
                    cy={cy}
                    r={baseRadius * scale}
                    fill={glowIntensity > 0 ? '#ffffff' : 'white'}
                    style={{
                        transition: 'all 0.15s ease-out',
                        filter: glowIntensity > 0 ? `drop-shadow(0 0 ${6 + glowIntensity * 10}px #FEDA24)` : 'none',
                    }}
                />
            </g>
        )
    }

    return (
        <svg
            width="886"
            height="306"
            viewBox="0 0 886 306"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            style={style}
        >
            {/* Defs for gradients and filters */}
            <defs>
                {/* Beam gradient */}
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                {/* Center sphere filters - copied from original */}
                <filter id="filter0_f" x="322.095" y="31.6641" width="243.81" height="243.81" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur stdDeviation="20.9524" result="effect1_foregroundBlur" />
                </filter>
                <filter id="filter1_f" x="372.571" y="82.1402" width="142.857" height="142.857" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur stdDeviation="11.9048" result="effect1_foregroundBlur" />
                </filter>
                <filter id="filter2_f" x="393.524" y="103.093" width="100.952" height="100.952" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur stdDeviation="8.57143" result="effect1_foregroundBlur" />
                </filter>
                <filter id="filter3_f" x="409.714" y="119.283" width="68.5714" height="68.5714" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur stdDeviation="7.14286" result="effect1_foregroundBlur" />
                </filter>
                <filter id="filter4_f" x="409.928" y="114.521" width="68.143" height="78.0952" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur stdDeviation="0.952381" result="effect1_foregroundBlur" />
                </filter>
            </defs>

            {/* Static lines - Right side */}
            <line x1="502.227" y1="152.717" x2="885.05" y2="152.717" stroke="#444444" />
            <path d="M593.874 152.693L636.294 25.1548L690.477 25.154" stroke="#444444" />
            <path d="M593.874 152.693L683.104 276.783L740.618 276.783" stroke="#444444" />

            {/* Static lines - Left side */}
            <line y1="-0.5" x2="382.823" y2="-0.5" transform="matrix(-1 0 0 1 382.823 153.217)" stroke="#444444" />
            <path d="M291.176 152.693L248.756 25.1548L194.573 25.154" stroke="#444444" />
            <path d="M291.176 152.693L201.947 276.783L144.433 276.783" stroke="#444444" />

            {/* Animated beams */}
            {beams.map(beam => renderBeam(beam))}

            {/* Outer endpoint dots */}
            {renderGlowingDot(637, 25.71, 'outer-right-top')}
            {renderGlowingDot(683, 276.71, 'outer-right-bottom')}
            {renderGlowingDot(248, 25.71, 'outer-left-top')}
            {renderGlowingDot(202, 276.71, 'outer-left-bottom')}

            {/* Junction dots */}
            {renderGlowingDot(594, 152.71, 'junction-right')}
            {renderGlowingDot(291, 152.71, 'junction-left')}

            {/* Center sphere with enhanced glow based on beam arrivals */}
            <g style={{ filter: sphereGlow > 0 ? `drop-shadow(0 0 ${20 + sphereGlow * 30}px rgba(254, 218, 36, ${0.5 + sphereGlow * 0.5}))` : 'none', transition: 'filter 0.3s ease-out' }}>
                {/* Outer glow */}
                <g opacity={0.2 + sphereGlow * 0.3} filter="url(#filter0_f)">
                    <circle cx="444" cy="153.569" r="80" fill="#FFAD3A" />
                </g>
                {/* Red inner glow */}
                <g filter="url(#filter1_f)">
                    <circle cx="444" cy="153.569" r="47.619" fill="#D50707" />
                </g>
                {/* Orange glow */}
                <g filter="url(#filter2_f)">
                    <circle cx="444" cy="153.569" r="33.3333" fill="#FA6513" />
                </g>
                {/* Yellow core glow */}
                <g filter="url(#filter3_f)">
                    <circle cx="444" cy="153.569" r="20" fill="#FFB904" />
                </g>
                {/* Star shape */}
                <g filter="url(#filter4_f)">
                    <path d="M444 116.426L444.679 134.65C444.966 142.366 453.218 147.131 460.044 143.521L476.166 134.997L460.723 144.698C454.185 148.805 454.185 158.333 460.723 162.44L476.166 172.14L460.044 163.616C453.218 160.007 444.966 164.772 444.679 172.488L444 190.712L443.321 172.488C443.033 164.772 434.781 160.007 427.955 163.616L411.833 172.14L427.276 162.44C433.815 158.333 433.815 148.805 427.276 144.698L411.833 134.997L427.955 143.521C434.781 147.131 443.033 142.366 443.321 134.65L444 116.426Z" fill="#FFDE6A" />
                </g>
            </g>

            {/* Elliptical rays around center */}
            <ellipse cx="428.417" cy="127.465" rx="0.952381" ry="20.9524" transform="rotate(-30 428.417 127.465)" fill="url(#paint0_radial)" />
            <ellipse cx="458.893" cy="180.251" rx="0.952381" ry="20.9524" transform="rotate(-30 458.893 180.251)" fill="url(#paint1_radial)" />
            <ellipse cx="413.488" cy="153.744" rx="0.952381" ry="20.9524" transform="rotate(-90 413.488 153.744)" fill="url(#paint2_radial)" />
            <ellipse cx="474.44" cy="153.744" rx="0.952381" ry="20.9524" transform="rotate(-90 474.44 153.744)" fill="url(#paint3_radial)" />
            <ellipse cx="458.893" cy="126.512" rx="0.952381" ry="20.9524" transform="rotate(30 458.893 126.512)" fill="url(#paint4_radial)" />
            <ellipse cx="428.417" cy="179.298" rx="0.952381" ry="20.9524" transform="rotate(30 428.417 179.298)" fill="url(#paint5_radial)" />

            {/* Radial gradients for rays */}
            <defs>
                <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(428.417 127.465) rotate(90) scale(20.9524 0.952381)">
                    <stop stopColor="#FFD028" />
                    <stop offset="1" stopColor="#FFD028" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="paint1_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(458.893 180.251) rotate(90) scale(20.9524 0.952381)">
                    <stop stopColor="#FFD028" />
                    <stop offset="1" stopColor="#FFD028" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="paint2_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(413.488 153.744) rotate(90) scale(20.9524 0.952381)">
                    <stop stopColor="#FFD028" />
                    <stop offset="1" stopColor="#FFD028" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="paint3_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(474.44 153.744) rotate(90) scale(20.9524 0.952381)">
                    <stop stopColor="#FFD028" />
                    <stop offset="1" stopColor="#FFD028" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="paint4_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(458.893 126.512) rotate(90) scale(20.9524 0.952381)">
                    <stop stopColor="#FFD028" />
                    <stop offset="1" stopColor="#FFD028" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="paint5_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(428.417 179.299) rotate(90) scale(20.9524 0.952381)">
                    <stop stopColor="#FFD028" />
                    <stop offset="1" stopColor="#FFD028" stopOpacity="0" />
                </radialGradient>
            </defs>
        </svg>
    )
}

export default AnimatedHeroSvg
