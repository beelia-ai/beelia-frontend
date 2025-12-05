"use client";

import { MainHero, AboutCompany } from './components'

export default function HomePage() {
  return (
    <main className="min-h-screen" style={{ isolation: 'isolate' }}>
      <MainHero />
      <AboutCompany />
    </main>
  )
}

