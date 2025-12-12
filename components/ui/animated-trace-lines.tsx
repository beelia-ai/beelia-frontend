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
    const rightHRef = useRef<HTMLDivElement>(null)      // Right horizontal end
    const rightTopRef = useRef<HTMLDivElement>(null)    // Right top corner
    const rightBottomRef = useRef<HTMLDivElement>(null) // Right bottom corner

    // Outer endpoints - Left side  
    const leftHRef = useRef<HTMLDivElement>(null)       // Left horizontal end
    const leftTopRef = useRef<HTMLDivElement>(null)     // Left top corner
    const leftBottomRef = useRef<HTMLDivElement>(null)  // Left bottom corner

    // Junction points where lines meet before going to center
    const rightJunctionRef = useRef<HTMLDivElement>(null)
    const leftJunctionRef = useRef<HTMLDivElement>(null)

    // Based on Trace_Lines.svg (1102x364):
    // Center is around x=551, y=182
    // Right junction: x≈704, y≈185
    // Left junction: x≈401, y≈185
    // SVG viewBox endpoints (as percentages):
    const positions = {
        center: { left: '50%', top: '50.8%' },
        rightJunction: { left: '63.9%', top: '50.8%' },  // x=704/1102
        leftJunction: { left: '36.4%', top: '50.8%' },   // x=401/1102
        rightH: { left: '90%', top: '50.8%' },           // ~992/1102
        rightTop: { left: '76.8%', top: '15.1%' },       // ~847/1102, ~55/364
        rightBottom: { left: '81%', top: '84.9%' },      // ~893/1102, ~309/364
        leftH: { left: '10%', top: '50.8%' },            // ~110/1102
        leftTop: { left: '23.2%', top: '15.1%' },        // ~256/1102
        leftBottom: { left: '19%', top: '84.9%' },       // ~209/1102
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
            <BeamAnchor ref={rightTopRef} style={positions.rightTop} />
            <BeamAnchor ref={rightBottomRef} style={positions.rightBottom} />
            <BeamAnchor ref={leftHRef} style={positions.leftH} />
            <BeamAnchor ref={leftTopRef} style={positions.leftTop} />
            <BeamAnchor ref={leftBottomRef} style={positions.leftBottom} />

            {/* Animated Beams - Right side (coming towards center) */}
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={rightHRef}
                toRef={centerRef}
                pathColor="#444444"
                pathOpacity={0}
                gradientStartColor="#FEDA24"
                gradientStopColor="#ffffff"
                duration={3}
                delay={0}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={rightTopRef}
                toRef={rightJunctionRef}
                curvature={-30}
                pathColor="#444444"
                pathOpacity={0}
                gradientStartColor="#FEDA24"
                gradientStopColor="#ffffff"
                duration={2.5}
                delay={0.3}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={rightJunctionRef}
                toRef={centerRef}
                pathColor="#444444"
                pathOpacity={0}
                gradientStartColor="#FEDA24"
                gradientStopColor="#ffffff"
                duration={1.5}
                delay={0.8}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={rightBottomRef}
                toRef={rightJunctionRef}
                curvature={30}
                pathColor="#444444"
                pathOpacity={0}
                gradientStartColor="#FEDA24"
                gradientStopColor="#ffffff"
                duration={2.5}
                delay={0.5}
            />

            {/* Animated Beams - Left side (coming towards center) */}
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={leftHRef}
                toRef={centerRef}
                pathColor="#444444"
                pathOpacity={0}
                gradientStartColor="#FEDA24"
                gradientStopColor="#ffffff"
                duration={3}
                delay={0.2}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={leftTopRef}
                toRef={leftJunctionRef}
                curvature={-30}
                pathColor="#444444"
                pathOpacity={0}
                gradientStartColor="#FEDA24"
                gradientStopColor="#ffffff"
                duration={2.5}
                delay={0.4}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={leftJunctionRef}
                toRef={centerRef}
                pathColor="#444444"
                pathOpacity={0}
                gradientStartColor="#FEDA24"
                gradientStopColor="#ffffff"
                duration={1.5}
                delay={0.9}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={leftBottomRef}
                toRef={leftJunctionRef}
                curvature={30}
                pathColor="#444444"
                pathOpacity={0}
                gradientStartColor="#FEDA24"
                gradientStopColor="#ffffff"
                duration={2.5}
                delay={0.6}
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
