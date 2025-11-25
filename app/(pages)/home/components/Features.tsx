import { Section, Card, CardHeader, CardTitle, CardDescription } from '@/components/ui'
import { Shield, Zap, DollarSign, Sparkles, Users, Globe } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'Curated AI Tools',
    description: 'Handpicked selection of the best AI tools and models, verified for quality and performance.',
  },
  {
    icon: Zap,
    title: 'Instant Deployment',
    description: 'Deploy AI models in seconds with our one-click integration system. No complex setup required.',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security with 99.9% uptime guarantee. Your data is always protected.',
  },
  {
    icon: DollarSign,
    title: 'Transparent Pricing',
    description: 'Clear pricing with no hidden fees. Pay once or subscribe monthly - your choice.',
  },
  {
    icon: Users,
    title: 'Creator Community',
    description: 'Join thousands of AI creators monetizing their tools through our platform.',
  },
  {
    icon: Globe,
    title: 'Global Marketplace',
    description: 'Access AI tools from creators worldwide. Support innovation from anywhere.',
  },
]

export function Features() {
  return (
    <Section spacing="xl" className="bg-black">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Why Choose Beelia.ai?
        </h2>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Everything you need to discover, deploy, and monetize AI tools in one platform
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <Card key={feature.title} variant="bordered" className="hover:shadow-lg transition-shadow bg-white/5 border-white/10">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-black" />
                </div>
                <CardTitle className="text-white">{feature.title}</CardTitle>
                <CardDescription className="mt-2 text-base leading-relaxed text-gray-400">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          )
        })}
      </div>
    </Section>
  )
}
