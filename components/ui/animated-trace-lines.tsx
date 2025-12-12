
'use client'

import React, { forwardRef, useRef } from 'react'
import Image from 'next/image'
import { AnimatedBeam } from './animated-beam'

// Invisible anchor point for beams
const BeamAnchor = forwardRef<
    HTMLDivElement,
    { className?: string; style?: React.CSSProperties }
>(({ className, style }, ref) => {
    return (
        <div
            ref={ref}
            className={`absolute w-1 h-1 ${className}`}
            style={style}
        />
    )
})

BeamAnchor.displayName = 'BeamAnchor'

export interface AnimatedTraceLinesProps {
    className?: string
    videoSrc?: string
}

export function AnimatedTraceLines({ className, videoSrc = "/videos/Beelia ani.webm" }: AnimatedTraceLinesProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    // Center point (where video/globe is)
    const centerRef = useRef<HTMLDivElement>(null)

    // Outer endpoints - Right side
    const rightHRef = useRef<HTMLDivElement>(null)      // Right horizontal outer end (992)
    const rightHInnerRef = useRef<HTMLDivElement>(null) // Right horizontal inner end (612)
    const rightTopRef = useRef<HTMLDivElement>(null)    // Right top corner
    const rightBottomRef = useRef<HTMLDivElement>(null) // Right bottom corner

    // Outer endpoints - Left side  
    const leftHRef = useRef<HTMLDivElement>(null)       // Left horizontal outer end (110)
    const leftHInnerRef = useRef<HTMLDivElement>(null)  // Left horizontal inner end (493)
    const leftTopRef = useRef<HTMLDivElement>(null)     // Left top corner
    const leftBottomRef = useRef<HTMLDivElement>(null)  // Left bottom corner

    // Junction points where lines meet before going to center
    const rightJunctionRef = useRef<HTMLDivElement>(null)
    const leftJunctionRef = useRef<HTMLDivElement>(null)

    // Elbow points for L-shaped diagonal paths
    const rightTopElbowRef = useRef<HTMLDivElement>(null)
    const rightBottomElbowRef = useRef<HTMLDivElement>(null)
    const leftTopElbowRef = useRef<HTMLDivElement>(null)
    const leftBottomElbowRef = useRef<HTMLDivElement>(null)

    // Based on Trace_Lines.svg (1102x364):
    // Center is around x=551, y=182
    // Right junction: x=704, y=185
    // Left junction: x=401, y=185
    // SVG viewBox endpoints (as percentages):
    const positions = {
        center: { left: '50%', top: '50.8%' },
        // Right side
        rightJunction: { left: '63.9%', top: '50.8%' },  // x=704/1102
        rightH: { left: '90%', top: '50.8%' },           // x=992/1102 (outer end)
        rightHInner: { left: '55.6%', top: '50.8%' },    // x=612/1102 (where SVG line starts)
        rightTopElbow: { left: '67.7%', top: '15.9%' },  // x=746/1102, y=58/364
        rightTop: { left: '71.9%', top: '15.9%' },       // x=792/1102, y=58/364 (actual endpoint)
        rightBottomElbow: { left: '72%', top: '85%' },   // x=793/1102, y=309/364
        rightBottom: { left: '76.1%', top: '85%' },      // x=838/1102, y=309/364 (actual endpoint)
        // Left side
        leftJunction: { left: '36.4%', top: '50.8%' },   // x=401/1102
        leftH: { left: '10%', top: '50.8%' },            // x=110/1102 (outer end)
        leftHInner: { left: '44.7%', top: '50.8%' },     // x=493/1102 (where SVG line ends)
        leftTopElbow: { left: '32.6%', top: '15.9%' },   // x=359/1102, y=58/364
        leftTop: { left: '27.9%', top: '15.9%' },        // x=307/1102, y=58/364 (actual endpoint)
        leftBottomElbow: { left: '28.3%', top: '85%' },  // x=312/1102, y=309/364
        leftBottom: { left: '23.3%', top: '85%' },       // x=256/1102, y=309/364 (actual endpoint)
    }

    return (
        <div
            ref={containerRef}
            className={`relative w-[1102px] h-[364px] ${className}`}
        >
            {/* Trace Lines SVG - background */}
            <Image
                src="/images/Trace_Lines.svg"
                alt="Trace Lines"
                fill
                className="object-contain"
                priority
            />

            {/* Beam anchor points */}
            <BeamAnchor ref={centerRef} style={positions.center} />
            <BeamAnchor ref={rightJunctionRef} style={positions.rightJunction} />
            <BeamAnchor ref={leftJunctionRef} style={positions.leftJunction} />
            <BeamAnchor ref={rightHRef} style={positions.rightH} />
            <BeamAnchor ref={rightHInnerRef} style={positions.rightHInner} />
            <BeamAnchor ref={rightTopRef} style={positions.rightTop} />
            <BeamAnchor ref={rightTopElbowRef} style={positions.rightTopElbow} />
            <BeamAnchor ref={rightBottomRef} style={positions.rightBottom} />
            <BeamAnchor ref={rightBottomElbowRef} style={positions.rightBottomElbow} />
            <BeamAnchor ref={leftHRef} style={positions.leftH} />
            <BeamAnchor ref={leftHInnerRef} style={positions.leftHInner} />
            <BeamAnchor ref={leftTopRef} style={positions.leftTop} />
            <BeamAnchor ref={leftTopElbowRef} style={positions.leftTopElbow} />
            <BeamAnchor ref={leftBottomRef} style={positions.leftBottom} />
            <BeamAnchor ref={leftBottomElbowRef} style={positions.leftBottomElbow} />

            {/* Animated Beams - Right side (coming towards center) */}

            {/* Path 1: Right horizontal - from outer edge to inner point (following SVG line) */}
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={rightHRef}
                toRef={rightHInnerRef}
                pathColor="#444444"
                pathOpacity={0}
                gradientStartColor="#FEDA24"
                gradientStopColor="#ffffff"
                duration={2}
                delay={0}
            />

            {/* Path 2: Right top diagonal - endpoint to elbow */}
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={rightTopRef}
                toRef={rightTopElbowRef}
                pathColor="#444444"
                pathOpacity={0}
                gradientStartColor="#FEDA24"
                gradientStopColor="#ffffff"
                duration={1}
                delay={0}
            />
            {/* Path 2: Right top diagonal - elbow to junction */}
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={rightTopElbowRef}
                toRef={rightJunctionRef}
                pathColor="#444444"
                pathOpacity={0}
                gradientStartColor="#FEDA24"
                gradientStopColor="#ffffff"
                duration={1.5}
                delay={0.5}
            />
            {/* Path 2: Right top diagonal - junction to center */}
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={rightJunctionRef}
                toRef={centerRef}
                pathColor="#444444"
                pathOpacity={0}
                gradientStartColor="#FEDA24"
                gradientStopColor="#ffffff"
                duration={1.2}
                delay={1.0}
            />

            {/* Path 3: Right bottom diagonal - endpoint to elbow */}
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={rightBottomRef}
                toRef={rightBottomElbowRef}
                pathColor="#444444"
                pathOpacity={0}
                gradientStartColor="#FEDA24"
                gradientStopColor="#ffffff"
                duration={1}
                delay={0.3}
            />
            {/* Path 3: Right bottom diagonal - elbow to junction */}
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={rightBottomElbowRef}
                toRef={rightJunctionRef}
                pathColor="#444444"
                pathOpacity={0}
                gradientStartColor="#FEDA24"
                gradientStopColor="#ffffff"
                duration={1.5}
                delay={0.8}
            />

            {/* Animated Beams - Left side (coming towards center) */}

            {/* Path 4: Left horizontal - from outer edge to inner point (following SVG line) */}
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={leftHRef}
                toRef={leftHInnerRef}
                pathColor="#444444"
                pathOpacity={0}
                gradientStartColor="#FEDA24"
                gradientStopColor="#ffffff"
                duration={2}
                delay={0.2}
            />

            {/* Path 5: Left top diagonal - endpoint to elbow */}
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={leftTopRef}
                toRef={leftTopElbowRef}
                pathColor="#444444"
                pathOpacity={0}
                gradientStartColor="#FEDA24"
                gradientStopColor="#ffffff"
                duration={1}
                delay={0.1}
            />
            {/* Path 5: Left top diagonal - elbow to junction */}
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={leftTopElbowRef}
                toRef={leftJunctionRef}
                pathColor="#444444"
                pathOpacity={0}
                gradientStartColor="#FEDA24"
                gradientStopColor="#ffffff"
                duration={1.5}
                delay={0.6}
            />
            {/* Path 5: Left top diagonal - junction to center */}
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={leftJunctionRef}
                toRef={centerRef}
                pathColor="#444444"
                pathOpacity={0}
                gradientStartColor="#FEDA24"
                gradientStopColor="#ffffff"
                duration={1.2}
                delay={1.1}
            />

            {/* Path 6: Left bottom diagonal - endpoint to elbow */}
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={leftBottomRef}
                toRef={leftBottomElbowRef}
                pathColor="#444444"
                pathOpacity={0}
                gradientStartColor="#FEDA24"
                gradientStopColor="#ffffff"
                duration={1}
                delay={0.4}
            />
            {/* Path 6: Left bottom diagonal - elbow to junction */}
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={leftBottomElbowRef}
                toRef={leftJunctionRef}
                pathColor="#444444"
                pathOpacity={0}
                gradientStartColor="#FEDA24"
                gradientStopColor="#ffffff"
                duration={1.5}
                delay={0.9}
            />

            {/* Video Globe - centered on top of trace lines */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-[420px] h-[420px] object-contain pointer-events-auto"
                >
                    <source src={videoSrc} type="video/webm" />
                </video>
            </div>
        </div>
    )
}

export default AnimatedTraceLines
