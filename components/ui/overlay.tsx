"use client";

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface OverlayProps {
  /** Whether the overlay is visible */
  isOpen: boolean;
  /** Callback when overlay is clicked */
  onClick?: () => void;
  /** Background color/style */
  background?: string;
  /** Blur amount in pixels */
  blur?: number;
  /** Opacity value (0-1) */
  opacity?: number;
  /** Z-index value */
  zIndex?: number;
  /** Animation duration in ms */
  animationDuration?: number;
  /** Additional class names */
  className?: string;
  /** Children to render on top of overlay */
  children?: React.ReactNode;
}

export function Overlay({
  isOpen,
  onClick,
  background = 'rgba(0, 0, 0, 0.6)',
  blur = 8,
  opacity = 1,
  zIndex = 999,
  animationDuration = 300,
  className,
  children
}: OverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className={cn(
        "fixed inset-0 animate-in fade-in",
        className
      )}
      style={{
        background,
        backdropFilter: blur > 0 ? `blur(${blur}px)` : undefined,
        WebkitBackdropFilter: blur > 0 ? `blur(${blur}px)` : undefined,
        opacity,
        zIndex,
        animationDuration: `${animationDuration}ms`,
      }}
      onClick={onClick}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}

export default Overlay;

