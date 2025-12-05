"use client";

import { MainHero } from './components'
import { Footer } from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <main className="min-h-screen" style={{ isolation: 'isolate' }}>
      <MainHero />
      <Footer />
    </main>
  )
}

