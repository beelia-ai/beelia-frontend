import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import GlassSurface from '@/components/GlassSurface';
import { Overlay } from '@/components/ui/overlay';

type MenuItem = {
  label: string;
  href: string;
  ariaLabel?: string;
  rotation?: number;
  hoverStyles?: {
    bgColor?: string;
    textColor?: string;
  };
};

export type BubbleMenuProps = {
  logo: ReactNode | string;
  onMenuClick?: (open: boolean) => void;
  className?: string;
  style?: CSSProperties;
  menuAriaLabel?: string;
  menuBg?: string;
  menuContentColor?: string;
  useFixedPosition?: boolean;
  items?: MenuItem[];
  animationEase?: string;
  animationDuration?: number;
  staggerDelay?: number;
};

const DEFAULT_ITEMS: MenuItem[] = [
  {
    label: 'home',
    href: '#',
    ariaLabel: 'Home',
    rotation: -8,
    hoverStyles: { bgColor: 'rgba(59, 130, 246, 0.4)', textColor: '#ffffff' }
  },
  {
    label: 'about',
    href: '#',
    ariaLabel: 'About',
    rotation: 8,
    hoverStyles: { bgColor: 'rgba(16, 185, 129, 0.4)', textColor: '#ffffff' }
  },
  {
    label: 'projects',
    href: '#',
    ariaLabel: 'Documentation',
    rotation: 8,
    hoverStyles: { bgColor: 'rgba(245, 158, 11, 0.4)', textColor: '#ffffff' }
  },
  {
    label: 'blog',
    href: '#',
    ariaLabel: 'Blog',
    rotation: 8,
    hoverStyles: { bgColor: 'rgba(239, 68, 68, 0.4)', textColor: '#ffffff' }
  },
  {
    label: 'contact',
    href: '#',
    ariaLabel: 'Contact',
    rotation: -8,
    hoverStyles: { bgColor: 'rgba(139, 92, 246, 0.4)', textColor: '#ffffff' }
  }
];

export default function BubbleMenu({
  logo,
  onMenuClick,
  className,
  style,
  menuAriaLabel = 'Toggle menu',
  menuBg = '#fff',
  menuContentColor = '#111',
  useFixedPosition = false,
  items,
  animationEase = 'back.out(1.5)',
  animationDuration = 0.5,
  staggerDelay = 0.12
}: BubbleMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<HTMLAnchorElement[]>([]);
  const labelRefs = useRef<HTMLSpanElement[]>([]);

  const menuItems = items?.length ? items : DEFAULT_ITEMS;

  const containerClassName = [
    'bubble-menu',
    useFixedPosition ? 'fixed' : 'absolute',
    'left-0 top-8',
    'flex items-center justify-start',
    'gap-4 px-8',
    'pointer-events-none',
    'z-[1001]',
    className
  ]
    .filter(Boolean)
    .join(' ');

  const handleToggle = () => {
    const nextState = !isMenuOpen;
    if (nextState) setShowOverlay(true);
    setIsMenuOpen(nextState);
    onMenuClick?.(nextState);
  };

  useEffect(() => {
    const overlay = overlayRef.current;
    const bubbles = bubblesRef.current.filter(Boolean);
    const labels = labelRefs.current.filter(Boolean);
    if (!overlay || !bubbles.length) return;

    if (isMenuOpen) {
      gsap.set(overlay, { display: 'flex' });
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.set(bubbles, { scale: 0, transformOrigin: '50% 50%' });
      gsap.set(labels, { y: 24, autoAlpha: 0 });

      bubbles.forEach((bubble, i) => {
        const delay = i * staggerDelay + gsap.utils.random(-0.05, 0.05);
        const tl = gsap.timeline({ delay });
        tl.to(bubble, {
          scale: 1,
          duration: animationDuration,
          ease: animationEase
        });
        if (labels[i]) {
          tl.to(
            labels[i],
            {
              y: 0,
              autoAlpha: 1,
              duration: animationDuration,
              ease: 'power3.out'
            },
            '-=' + animationDuration * 0.9
          );
        }
      });
    } else if (showOverlay) {
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.to(labels, {
        y: 24,
        autoAlpha: 0,
        duration: 0.2,
        ease: 'power3.in'
      });
      gsap.to(bubbles, {
        scale: 0,
        duration: 0.2,
        ease: 'power3.in',
        onComplete: () => {
          gsap.set(overlay, { display: 'none' });
          setShowOverlay(false);
        }
      });
    }
  }, [isMenuOpen, showOverlay, animationEase, animationDuration, staggerDelay]);

  useEffect(() => {
    const handleResize = () => {
      if (isMenuOpen) {
        const bubbles = bubblesRef.current.filter(Boolean);
        const isDesktop = window.innerWidth >= 900;
        bubbles.forEach((bubble, i) => {
          const item = menuItems[i];
          if (bubble && item) {
            const rotation = isDesktop ? (item.rotation ?? 0) : 0;
            gsap.set(bubble, { rotation });
          }
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen, menuItems]);

  return (
    <>
      {/* Workaround for silly Tailwind capabilities */}
      <style>{`
        .bubble-menu .menu-line {
          transition: transform 0.3s ease, opacity 0.3s ease;
          transform-origin: center;
        }
        .beelia-gradient-text {
          background: linear-gradient(135deg, #FFD700 0%, #FFE55C 50%, #FFD700 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .pill-link {
          position: relative;
        }
        .pill-link .glass-surface-wrapper {
          position: relative;
          overflow: hidden;
          border-radius: 999px;
        }
        .pill-link .glass-surface-wrapper::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 160px;
          background: linear-gradient(135deg, #FEDA24 0%, #EF941F 50%, #FEDA24 100%);
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateX(-100%);
          z-index: 1;
          border-radius: 999px;
          pointer-events: none;
        }
        .pill-link:hover .glass-surface-wrapper::after {
          transform: translateX(0);
        }
        .pill-link .glass-surface-wrapper > * {
          position: relative;
          z-index: 2;
        }
        .pill-link .pill-label {
          position: relative;
          z-index: 10 !important;
          background: linear-gradient(135deg, #FEDA24 0%, #EF941F 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: all 0.3s ease;
        }
        .pill-link:hover .pill-label {
          background: #FFFFFF;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .bubble-menu-items .pill-list .pill-col:nth-child(4):nth-last-child(2) {
          margin-left: calc(100% / 6);
        }
        .bubble-menu-items .pill-list .pill-col:nth-child(4):last-child {
          margin-left: calc(100% / 3);
        }
        @media (min-width: 900px) {
          .bubble-menu-items .pill-link {
            transform: rotate(var(--item-rot));
          }
          .bubble-menu-items .pill-link:active {
            transform: rotate(var(--item-rot)) scale(.94);
          }
        }
        @media (max-width: 899px) {
          .bubble-menu-items {
            padding-top: 120px;
            align-items: flex-start;
          }
          .bubble-menu-items .pill-list {
            row-gap: 16px;
          }
          .bubble-menu-items .pill-list .pill-col {
            flex: 0 0 100% !important;
            margin-left: 0 !important;
            overflow: visible;
          }
          .bubble-menu-items .pill-link {
            padding: clamp(1rem, 2vw, 2rem) 0;
            min-height: 80px !important;
          }
          .bubble-menu-items .pill-link:active {
            transform: scale(.94);
          }
        }
      `}</style>

      <nav className={containerClassName} style={style} aria-label="Main navigation">
        <button
          type="button"
          className={[
            'bubble toggle-bubble menu-btn',
            isMenuOpen ? 'open' : '',
            'inline-flex items-center gap-4',
            'pointer-events-auto',
            'border-0 cursor-pointer p-0',
            'will-change-transform',
            'bg-transparent'
          ].join(' ')}
          onClick={handleToggle}
          aria-label={menuAriaLabel}
          aria-pressed={isMenuOpen}
          style={{ background: 'transparent' }}
        >
          <div className="flex flex-col items-center justify-center">
            <span
              className="menu-line block rounded-[2px]"
              style={{
                width: 44,
                height: 2,
                background: '#fff',
                transform: isMenuOpen ? 'translateY(5px) rotate(45deg)' : 'none'
              }}
            />
            <span
              className="menu-line block rounded-[2px]"
              style={{
                marginTop: '8px',
                width: 44,
                height: 2,
                background: '#fff',
                transform: isMenuOpen ? 'translateY(-5px) rotate(-45deg)' : 'none'
              }}
            />
          </div>
          <span
            className="font-inria-sans font-normal uppercase text-white"
            style={{
              fontSize: '21px',
              lineHeight: '100%',
              letterSpacing: '0.06em',
            }}
          >
            menu
          </span>
        </button>
      </nav>

      {/* Background Overlay */}
      <Overlay
        isOpen={isMenuOpen}
        onClick={handleToggle}
        background="rgba(0, 0, 0, 0.7)"
        blur={12}
        zIndex={999}
        animationDuration={300}
      />

      {showOverlay && (
        <div
          ref={overlayRef}
          className={[
            'bubble-menu-items',
            useFixedPosition ? 'fixed' : 'absolute',
            'inset-0',
            'flex items-center justify-center',
            'pointer-events-none',
            'z-[1000]'
          ].join(' ')}
          aria-hidden={!isMenuOpen}
        >
          <ul
            className={[
              'pill-list',
              'list-none m-0 px-6',
              'w-full max-w-[1600px] mx-auto',
              'flex flex-wrap',
              'gap-x-0 gap-y-1',
              'pointer-events-auto'
            ].join(' ')}
            role="menu"
            aria-label="Menu links"
          >
            {menuItems.map((item, idx) => (
              <li
                key={idx}
                role="none"
                className={[
                  'pill-col',
                  'flex justify-center items-stretch',
                  '[flex:0_0_calc(100%/3)]',
                  'box-border'
                ].join(' ')}
              >
                <a
                  role="menuitem"
                  href={item.href}
                  aria-label={item.ariaLabel || item.label}
                  className="pill-link w-full no-underline"
                  style={{
                    ['--item-rot' as string]: `${item.rotation ?? 0}deg`,
                    ['--hover-bg' as string]: item.hoverStyles?.bgColor || 'rgba(255, 255, 255, 0.3)',
                    ['--hover-color' as string]: item.hoverStyles?.textColor || '#fff',
                  }}
                  ref={el => {
                    if (el) bubblesRef.current[idx] = el;
                  }}
                >
                  <div className="glass-surface-wrapper">
                    <GlassSurface
                      width="100%"
                      height={160}
                      borderRadius={999}
                      chromaticAberration={0.25}
                      className="w-full hover:scale-105 transition-transform duration-300 relative"
                      style={{ position: 'relative', zIndex: 2 }}
                    >
                    <span
                      className="pill-label inline-block font-inria-sans font-bold uppercase"
                      style={{
                        willChange: 'transform, opacity',
                        fontSize: 'clamp(2.5rem, 6.5vw, 5.5rem)',
                        lineHeight: '100%',
                        letterSpacing: '0.08em',
                        fontWeight: 700,
                        position: 'relative',
                        zIndex: 10
                      }}
                      ref={el => {
                        if (el) labelRefs.current[idx] = el;
                      }}
                    >
                      {item.label}
                    </span>
                  </GlassSurface>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

