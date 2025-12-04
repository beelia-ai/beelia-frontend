"use client";

import Image from 'next/image';
import LiquidEther from './liquid-ether';
import { cn } from '@/lib/utils';

export interface HeroBackgroundProps {
  readonly className?: string;
  readonly style?: React.CSSProperties;
}

export function HeroBackground({ className, style }: HeroBackgroundProps) {
  return (
    <div
      className={cn("relative w-full h-screen flex items-center justify-center bg-black", className)}
      style={{ ...style, zIndex: 1 }}
    >
      {/* Liquid Ether Background */}
      <div className="absolute inset-0" style={{ zIndex: 1 }}>
        <LiquidEther
          colors={['#FFD700', '#FFE55C', '#FFD700']}
          mouseForce={15}
          cursorSize={150}
          isViscous={true}
          viscous={60}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.3}
          autoIntensity={1.5}
          takeoverDuration={0.5}
          autoResumeDelay={0}
          autoRampDuration={0.5}
        />
      </div>
      
      {/* Honeycomb Background with fade - above background, behind logo */}
      <div className="absolute inset-0 h-screen flex items-center justify-center" style={{ zIndex: 2 }}>
        <div className="relative w-full h-full">
          <Image
            src="/images/honeycomb.svg"
            alt="Honeycomb Pattern"
            width={1200}
            height={1200}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-screen object-cover opacity-80 brightness-150 contrast-125"
            style={{ 
              width: '100%', 
              height: '100vh',
              filter: 'brightness(1.5) contrast(1.25) saturate(0.3) drop-shadow(0 0 20px rgba(192, 192, 192, 0.3))'
            }}
            priority
          />
          {/* Silver overlay for glossy effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none mix-blend-overlay" />
          {/* Gradient fade masks */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />
        </div>
      </div>
      
      {/* Centered Content */}
      <div className="relative flex flex-col items-center justify-center gap-8" style={{ zIndex: 3 }}>
        {/* Tagline Text */}
        <p 
          className="text-white uppercase text-center max-w-[658px] opacity-80"
          style={{
            fontFamily: 'var(--font-inria-sans), sans-serif',
            fontWeight: 400,
            fontSize: '18px',
            lineHeight: '26px',
            letterSpacing: '0.04em',
            textAlign: 'center',
            textTransform: 'uppercase',
            color: '#FFFFFF',
            width: '658px',
            height: '52px',
            opacity: 0.8
          }}
        >
          The App Store for AI, giving people a seamless way to find the right tools and start using them instantly, no setup, no friction.
        </p>
        
        {/* Beelia Logo */}
        <Image
          src="/icons/Union.svg"
          alt="Beelia.ai Logo"
          width={1302}
          height={363}
          className="relative w-auto h-64 md:h-80 lg:h-96"
          priority
          fetchPriority="high"
          style={{ aspectRatio: '1302/363' }}
        />
        
        {/* Tagline Text */}
        <p 
          className="text-white text-right opacity-90 whitespace-nowrap self-end -translate-x-16"
          style={{
            fontFamily: 'var(--font-inria-sans), var(--font-instrument-serif), sans-serif',
            fontWeight: 400,
            fontSize: '44px',
            lineHeight: '100%',
            letterSpacing: '0%',
            textAlign: 'right',
            color: '#FFFFFF',
            width: '490px',
            height: '57px',
            opacity: 0.9,
            whiteSpace: 'nowrap'
          }}
        >
          <span style={{ fontFamily: 'var(--font-inria-sans), sans-serif' }}>AI </span>
          <span style={{ fontFamily: 'var(--font-instrument-serif), serif', fontStyle: 'italic' }}>for Everyone, </span>
          <span style={{ fontFamily: 'var(--font-inria-sans), sans-serif' }}>By Everyone</span>
        </p>
      </div>
    </div>
  );
}

