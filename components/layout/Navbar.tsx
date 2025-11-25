'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, User, Sparkles, Info } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'User', href: '/user' },
  { name: 'Creator', href: '/creator' },
  { name: 'About Us', href: '/about' },
]

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/icons/Beelia.svg"
              alt="Beelia.ai"
              width={136}
              height={36}
              className="h-9 w-auto group-hover:opacity-80 transition-opacity"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 ml-auto">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            ))}
            <div className="ml-4">
              <Button size="sm" className="bg-white text-black hover:bg-gray-200">
                Join Waitlist
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-white/5',
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-4 py-4 space-y-2 bg-black backdrop-blur-xl">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            >
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
          <div className="pt-4 space-y-2 border-t border-white/5">
            <Button
              className="w-full justify-center bg-white text-black hover:bg-gray-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Join Waitlist
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
