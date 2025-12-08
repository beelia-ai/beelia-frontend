"use client";

import { MainHero, AboutCompany } from './components'

export default function HomePage() {
  return (
    <main className="min-h-screen relative">
      <MainHero />
      <AboutCompany />
    </main>
  )
}

