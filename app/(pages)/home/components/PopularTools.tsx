import { Section, Card, CardHeader, CardTitle, CardDescription, CardFooter, Button, Badge } from '@/components/ui'
import { Star, TrendingUp, Eye } from 'lucide-react'

const tools = [
  {
    id: '1',
    name: 'GPT-4 Image Generator',
    description: 'Create stunning AI-generated images from text descriptions with GPT-4 Vision.',
    category: 'Image Generation',
    price: 29.99,
    rating: 4.8,
    reviews: 1243,
    trending: true,
  },
  {
    id: '2',
    name: 'CodeAI Assistant',
    description: 'AI-powered code completion and refactoring tool for 20+ programming languages.',
    category: 'Development',
    price: 49.99,
    rating: 4.9,
    reviews: 2156,
    trending: true,
  },
  {
    id: '3',
    name: 'Voice Clone Studio',
    description: 'Clone any voice with just 30 seconds of audio. Perfect for content creators.',
    category: 'Audio',
    price: 39.99,
    rating: 4.7,
    reviews: 892,
    trending: false,
  },
  {
    id: '4',
    name: 'DataInsight Pro',
    description: 'Analyze and visualize complex datasets with natural language queries.',
    category: 'Data Science',
    price: 59.99,
    rating: 4.9,
    reviews: 1567,
    trending: true,
  },
]

export function PopularTools() {
  return (
    <Section spacing="xl" className="bg-black">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Popular AI Tools
        </h2>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Top-rated tools loved by thousands of users
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {tools.map((tool) => (
          <Card key={tool.id} variant="elevated" className="flex flex-col bg-white/5 border-white/10">
            <CardHeader>
              {/* Category and trending badge */}
              <div className="flex items-center justify-between mb-3">
                <Badge variant="default" size="sm" className="bg-white text-black">
                  {tool.category}
                </Badge>
                {tool.trending && (
                  <div className="flex items-center gap-1 text-white">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs font-medium">Trending</span>
                  </div>
                )}
              </div>
              
              {/* Tool icon placeholder */}
              <div className="w-full h-40 bg-gradient-to-br from-white/10 to-white/5 rounded-lg mb-4 flex items-center justify-center">
                <Eye className="w-12 h-12 text-white" />
              </div>
              
              <CardTitle className="mb-2 text-white">{tool.name}</CardTitle>
              <CardDescription className="text-gray-400">{tool.description}</CardDescription>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-white text-white" />
                  <span className="text-sm font-semibold text-white">
                    {tool.rating}
                  </span>
                </div>
                <span className="text-sm text-gray-400">
                  ({tool.reviews.toLocaleString()} reviews)
                </span>
              </div>
            </CardHeader>
            
            <CardFooter className="mt-auto">
              <div className="flex items-center justify-between w-full">
                <div>
                  <div className="text-2xl font-bold text-white">
                    ${tool.price}
                  </div>
                  <div className="text-xs text-gray-400">one-time purchase</div>
                </div>
                <Button size="sm">
                  View Details
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="text-center">
        <Button variant="outline" size="lg">
          View All Tools
        </Button>
      </div>
    </Section>
  )
}
