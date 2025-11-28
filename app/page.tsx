import Image from 'next/image'
import { MainHero } from './(pages)/home/components'

export default function HomePage() {
  return (
    <main className="min-h-screen" style={{ isolation: 'isolate' }}>
      <MainHero />
      
      {/* Demo Section 1 - Gradient Background */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
        <div className="text-center">
          <Image 
            src="/icons/Beelia.svg" 
            alt="Beelia" 
            width={300} 
            height={80}
            className="mx-auto"
          />
          <p className="mt-8 text-white text-2xl font-light">Test refraction on gradient</p>
        </div>
      </section>

      {/* Demo Section 2 - Dark with Logo */}
      <section className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <Image 
            src="/icons/Beelia.svg" 
            alt="Beelia" 
            width={400} 
            height={100}
            className="mx-auto invert"
          />
          <p className="mt-8 text-white/60 text-2xl font-light">Test refraction on dark</p>
        </div>
      </section>

      {/* Demo Section 3 - Colorful Stripes */}
      <section className="min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex" style={{ zIndex: -1 }}>
          <div className="flex-1 bg-red-500" />
          <div className="flex-1 bg-orange-500" />
          <div className="flex-1 bg-yellow-500" />
          <div className="flex-1 bg-green-500" />
          <div className="flex-1 bg-blue-500" />
          <div className="flex-1 bg-indigo-500" />
          <div className="flex-1 bg-purple-500" />
        </div>
        <div className="text-center bg-black/30 backdrop-blur-sm p-12 rounded-3xl">
          <Image 
            src="/icons/Beelia.svg" 
            alt="Beelia" 
            width={300} 
            height={80}
            className="mx-auto invert"
          />
          <p className="mt-8 text-white text-2xl font-light">Test refraction on colors</p>
        </div>
      </section>

      {/* Demo Section 4 - Gradient */}
      <section className="min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
        <div className="text-center">
          <Image 
            src="/icons/Beelia.svg" 
            alt="Beelia" 
            width={350} 
            height={90}
            className="mx-auto drop-shadow-2xl"
          />
          <p className="mt-8 text-white text-2xl font-light drop-shadow-lg">Test refraction on vibrant gradient</p>
        </div>
      </section>

      {/* Demo Section 5 - Pattern */}
      <section className="min-h-screen flex items-center justify-center bg-white overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            zIndex: -1,
            backgroundImage: `
              linear-gradient(30deg, #000 12%, transparent 12.5%, transparent 87%, #000 87.5%, #000),
              linear-gradient(150deg, #000 12%, transparent 12.5%, transparent 87%, #000 87.5%, #000),
              linear-gradient(30deg, #000 12%, transparent 12.5%, transparent 87%, #000 87.5%, #000),
              linear-gradient(150deg, #000 12%, transparent 12.5%, transparent 87%, #000 87.5%, #000),
              linear-gradient(60deg, #222 25%, transparent 25.5%, transparent 75%, #222 75%, #222),
              linear-gradient(60deg, #222 25%, transparent 25.5%, transparent 75%, #222 75%, #222)
            `,
            backgroundSize: '80px 140px',
            backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px',
          }}
        />
        <div className="text-center">
          <Image 
            src="/icons/Beelia.svg" 
            alt="Beelia" 
            width={300} 
            height={80}
            className="mx-auto"
          />
          <p className="mt-8 text-black text-2xl font-light">Test refraction on pattern</p>
        </div>
      </section>
    </main>
  )
}
