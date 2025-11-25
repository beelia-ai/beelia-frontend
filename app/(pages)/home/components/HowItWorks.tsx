import { Section } from '@/components/ui'
import { Search, ShoppingCart, Rocket, CheckCircle } from 'lucide-react'

const steps = [
  {
    icon: Search,
    title: 'Browse & Discover',
    description: 'Explore our curated marketplace of AI tools across various categories.',
    color: 'from-white/90 to-white/70',
  },
  {
    icon: ShoppingCart,
    title: 'Purchase Securely',
    description: 'Buy with confidence using our secure payment system powered by Stripe.',
    color: 'from-white/80 to-white/60',
  },
  {
    icon: Rocket,
    title: 'Deploy Instantly',
    description: 'Access your purchased tools immediately through our dashboard or API.',
    color: 'from-white/70 to-white/50',
  },
  {
    icon: CheckCircle,
    title: 'Start Creating',
    description: 'Integrate AI capabilities into your projects and start building amazing things.',
    color: 'from-white/60 to-white/40',
  },
]

export function HowItWorks() {
  return (
    <Section spacing="xl" className="bg-black">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          How It Works
        </h2>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Get started with AI tools in four simple steps
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
        {/* Connection lines */}
        <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-white/10 via-white/30 to-white/10 -z-10" />
        
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <div key={step.title} className="relative">
              <div className="flex flex-col items-center text-center">
                {/* Icon with gradient background */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <Icon className="w-8 h-8 text-black" />
                </div>
                
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-black border-2 border-white/20 flex items-center justify-center text-sm font-bold text-white">
                  {index + 1}
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
