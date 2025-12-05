"use client";

import { MainHero, AboutCompany } from './components'
import { Footer } from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <main className="min-h-screen" style={{ isolation: 'isolate' }}>
      <MainHero />
      <AboutCompany />
      <Footer />
    </main>
  )
}

