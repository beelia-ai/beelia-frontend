import type { HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Container } from './container'

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  spacing?: 'sm' | 'md' | 'lg' | 'xl'
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, containerSize = 'xl', spacing = 'lg', children, ...props }, ref) => {
    const spacings = {
      sm: 'py-8',
      md: 'py-12',
      lg: 'py-16',
      xl: 'py-24',
    }
    
    return (
      <section
        ref={ref}
        className={cn(spacings[spacing], className)}
        {...props}
      >
        <Container size={containerSize}>
          {children}
        </Container>
      </section>
    )
  }
)

Section.displayName = 'Section'
