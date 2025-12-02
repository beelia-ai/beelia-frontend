"use client";

import { MainHero } from './(pages)/home/components'

export default function HomePage() {
  return (
    <main className="min-h-screen" style={{ isolation: 'isolate' }}>
      <MainHero />
    </main>
  )
}
