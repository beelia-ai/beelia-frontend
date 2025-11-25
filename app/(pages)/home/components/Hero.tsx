import { Button } from '@/components/ui'
import Image from 'next/image'
import { Sparkles, Zap, TrendingUp } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-black min-h-screen flex flex-col">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,black,rgba(0,0,0,0.6))] -z-10" />
      
      {/* Content Container */}
      <div className="flex-1 flex flex-col justify-between pt-24 pb-0 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-6 sm:space-y-8">
          {/* Main heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight">
            Discover & Deploy <span className="text-white">AI Tools</span> Instantly
          </h1>
          
          {/* Subheading */}
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
            The ultimate marketplace for AI-powered tools and models. 
            Find, purchase, and integrate cutting-edge AI solutions into your workflow.
          </p>

          {/* CTA Button */}
          <div className="pt-4 sm:pt-6">
            <Button size="lg" className="w-full sm:w-auto min-w-[200px] bg-white text-black hover:bg-gray-100">
              Join Waitlist
            </Button>
          </div>
        </div>

        {/* Product Preview - Integrated into layout */}
        <div className="mt-12 sm:mt-16 md:mt-20 -mx-4 sm:mx-0">
          <div className="relative rounded-none sm:rounded-t-2xl overflow-hidden border-x-0 sm:border border-white/10 border-b-0 shadow-2xl max-w-full sm:max-w-[1800px] mx-auto">
            <Image
              src="/images/dashboard.png"
              alt="Beelia.ai Dashboard Preview"
              width={1920}
              height={1080}
              className="w-full h-auto"
              priority
            />
            {/* Static shadow overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
