import { Hero, Features, HowItWorks, PopularTools, CTA } from './(pages)/home/components'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <HowItWorks />
      <PopularTools />
      <CTA />
    </main>
  )
}
