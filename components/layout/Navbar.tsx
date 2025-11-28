'use client'

import { WaitlistButton } from '@/components/ui/waitlist-button'

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-0 border-b border-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end h-16">
          <WaitlistButton>Join Waitlist</WaitlistButton>
        </div>
      </div>
    </nav>
  )
}
