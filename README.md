# Beelia.ai Frontend

AI Marketplace & App Store Platform - Frontend Application

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **UI Library:** React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Component Library:** shadcn/ui
- **Hosting:** Vercel
- **CI/CD:** GitHub Actions

---

## 📐 High-Level Design (HLD)

### System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      VERCEL EDGE NETWORK                         │
│  ┌────────────────────────────────────────────────────────┐     │
│  │              Next.js 14 Application                     │     │
│  │  ┌──────────────────────────────────────────────┐      │     │
│  │  │         App Router (RSC + Client)            │      │     │
│  │  │  • Server Components (Default)               │      │     │
│  │  │  • Client Components ('use client')          │      │     │
│  │  │  • Server Actions (Form submissions)         │      │     │
│  │  └──────────────────────────────────────────────┘      │     │
│  │                                                          │     │
│  │  ┌──────────────────────────────────────────────┐      │     │
│  │  │          React 18 Components                 │      │     │
│  │  │  • shadcn/ui Design System                   │      │     │
│  │  │  • Radix UI Primitives                       │      │     │
│  │  │  • Tailwind CSS Styling                      │      │     │
│  │  └──────────────────────────────────────────────┘      │     │
│  └────────────────────────────────────────────────────────┘     │
└───────────────┬──────────────────────────────────────────────────┘
                │
                │ API Calls
                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND SERVICES                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │ Vercel Serverless│  │ Cloudflare Workers│  │   Stripe     │  │
│  │   Functions      │  │   (Edge Runtime)  │  │   Payment    │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Key Frontend Components

```
┌──────────────────────────────────────────────────────────────┐
│                    FRONTEND ARCHITECTURE                      │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              PRESENTATION LAYER                      │    │
│  │  ┌────────────────────────────────────────────┐     │    │
│  │  │  Pages & Layouts (App Router)              │     │    │
│  │  │  • /app/page.tsx (Homepage)                │     │    │
│  │  │  • /app/marketplace/page.tsx               │     │    │
│  │  │  • /app/tools/[id]/page.tsx                │     │    │
│  │  │  • /app/dashboard/page.tsx                 │     │    │
│  │  │  • /app/checkout/page.tsx                  │     │    │
│  │  └────────────────────────────────────────────┘     │    │
│  └─────────────────────────────────────────────────────┘    │
│                           │                                   │
│                           ▼                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              COMPONENT LAYER                         │    │
│  │  ┌────────────────────────────────────────────┐     │    │
│  │  │  shadcn/ui Components                      │     │    │
│  │  │  • Button, Card, Dialog, Form              │     │    │
│  │  │  • Dropdown, Sheet, Toast, Tabs            │     │    │
│  │  │  • Table, Input, Badge, Avatar             │     │    │
│  │  └────────────────────────────────────────────┘     │    │
│  │  ┌────────────────────────────────────────────┐     │    │
│  │  │  Custom Components                         │     │    │
│  │  │  • ToolCard, ToolGrid, ToolDetails         │     │    │
│  │  │  • PaymentForm, PricingCard                │     │    │
│  │  │  • SearchBar, FilterPanel                  │     │    │
│  │  │  • UserProfile, DashboardStats             │     │    │
│  │  └────────────────────────────────────────────┘     │    │
│  └─────────────────────────────────────────────────────┘    │
│                           │                                   │
│                           ▼                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              STATE MANAGEMENT                        │    │
│  │  • React Context (Global State)                     │    │
│  │  • React Hooks (Local State)                        │    │
│  │  • Server Actions (Mutations)                       │    │
│  │  • SWR / React Query (Data Fetching - Optional)    │    │
│  └─────────────────────────────────────────────────────┘    │
│                           │                                   │
│                           ▼                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              API/SERVICE LAYER                       │    │
│  │  • API Routes (/app/api/*)                          │    │
│  │  • Server Actions (form handlers)                   │    │
│  │  • External API Clients                             │    │
│  │  • Authentication Middleware                        │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔧 Low-Level Design (LLD)

### Directory Structure

```
beelia-frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx                 # Login page
│   │   ├── register/
│   │   │   └── page.tsx                 # Registration page
│   │   └── layout.tsx                   # Auth layout
│   │
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   ├── page.tsx                 # User dashboard
│   │   │   ├── purchases/page.tsx       # Purchase history
│   │   │   └── settings/page.tsx        # User settings
│   │   └── layout.tsx                   # Dashboard layout
│   │
│   ├── (marketplace)/
│   │   ├── marketplace/
│   │   │   └── page.tsx                 # Browse all tools
│   │   ├── tools/
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx             # Tool details
│   │   │   │   └── loading.tsx          # Loading state
│   │   │   └── category/
│   │   │       └── [slug]/page.tsx      # Category page
│   │   └── layout.tsx                   # Marketplace layout
│   │
│   ├── checkout/
│   │   ├── page.tsx                     # Checkout flow
│   │   ├── success/page.tsx             # Payment success
│   │   └── cancel/page.tsx              # Payment cancelled
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/route.ts   # Auth endpoints
│   │   ├── tools/
│   │   │   ├── route.ts                 # GET tools list
│   │   │   └── [id]/route.ts            # GET single tool
│   │   ├── stripe/
│   │   │   ├── checkout/route.ts        # Create checkout
│   │   │   └── webhook/route.ts         # Stripe webhooks
│   │   └── user/
│   │       └── purchases/route.ts       # User purchases
│   │
│   ├── layout.tsx                       # Root layout
│   ├── page.tsx                         # Homepage
│   ├── globals.css                      # Global styles
│   └── error.tsx                        # Error boundary
│
├── components/
│   ├── ui/                              # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── toast.tsx
│   │   └── ...
│   │
│   ├── layout/
│   │   ├── header.tsx                   # Site header
│   │   ├── footer.tsx                   # Site footer
│   │   ├── sidebar.tsx                  # Dashboard sidebar
│   │   └── navigation.tsx               # Main navigation
│   │
│   ├── marketplace/
│   │   ├── tool-card.tsx                # Tool listing card
│   │   ├── tool-grid.tsx                # Grid of tools
│   │   ├── tool-detail.tsx              # Tool detail view
│   │   ├── search-bar.tsx               # Search component
│   │   ├── filter-panel.tsx             # Filter sidebar
│   │   └── category-nav.tsx             # Category navigation
│   │
│   ├── payment/
│   │   ├── pricing-card.tsx             # Price display
│   │   ├── checkout-form.tsx            # Stripe checkout
│   │   └── payment-method.tsx           # Payment options
│   │
│   └── dashboard/
│       ├── stats-card.tsx               # Dashboard stats
│       ├── purchase-list.tsx            # Purchase history
│       └── user-profile.tsx             # Profile info
│
├── lib/
│   ├── api/
│   │   ├── client.ts                    # API client setup
│   │   ├── tools.ts                     # Tools API methods
│   │   ├── auth.ts                      # Auth API methods
│   │   ├── payments.ts                  # Payment API methods
│   │   └── users.ts                     # User API methods
│   │
│   ├── hooks/
│   │   ├── use-toast.ts                 # Toast notifications
│   │   ├── use-tools.ts                 # Tools data hook
│   │   ├── use-auth.ts                  # Auth state hook
│   │   └── use-debounce.ts              # Debounce utility
│   │
│   ├── utils/
│   │   ├── cn.ts                        # Class name utility
│   │   ├── format.ts                    # Formatting helpers
│   │   ├── validation.ts                # Form validation
│   │   └── constants.ts                 # App constants
│   │
│   ├── stripe/
│   │   ├── client.ts                    # Stripe.js setup
│   │   └── helpers.ts                   # Stripe utilities
│   │
│   └── types/
│       ├── tool.ts                      # Tool types
│       ├── user.ts                      # User types
│       ├── payment.ts                   # Payment types
│       └── api.ts                       # API response types
│
├── public/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── styles/
│   └── globals.css                      # Tailwind imports
│
├── .env.local                           # Environment variables
├── .gitignore
├── next.config.js                       # Next.js config
├── package.json
├── tailwind.config.ts                   # Tailwind config
├── tsconfig.json                        # TypeScript config
├── components.json                      # shadcn/ui config
└── README.md
```

### Component Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERACTION FLOW                     │
└─────────────────────────────────────────────────────────────┘

1. Homepage Visit
   ┌──────────┐
   │ page.tsx │ → Server Component (RSC)
   └────┬─────┘
        │
        ├─→ Header (navigation)
        ├─→ HeroSection (marketing)
        ├─→ FeaturedTools (tool cards)
        └─→ Footer

2. Browse Marketplace
   ┌──────────────────┐
   │ marketplace/     │ → Server Component
   │ page.tsx         │    Fetches tools server-side
   └────┬─────────────┘
        │
        ├─→ SearchBar ('use client')
        │   └─→ useDebounce hook
        │
        ├─→ FilterPanel ('use client')
        │   └─→ Category selection
        │       └─→ Price range filter
        │
        └─→ ToolGrid (Server Component)
            └─→ ToolCard[] ('use client')
                └─→ onClick → navigate to tool detail

3. View Tool Details
   ┌──────────────────┐
   │ tools/[id]/      │ → Server Component
   │ page.tsx         │    Dynamic route
   └────┬─────────────┘
        │
        ├─→ Fetch tool data (RSC)
        │
        ├─→ ToolDetail component
        │   ├─→ Images carousel
        │   ├─→ Description
        │   ├─→ Features list
        │   └─→ Reviews
        │
        └─→ PricingCard ('use client')
            └─→ "Buy Now" button
                └─→ onClick → initiate checkout

4. Checkout Flow
   ┌──────────────────┐
   │ checkout/        │ → Client Component
   │ page.tsx         │    'use client'
   └────┬─────────────┘
        │
        ├─→ CheckoutForm
        │   ├─→ Stripe Elements
        │   └─→ Payment details
        │
        ├─→ Server Action: createCheckout()
        │   └─→ POST /api/stripe/checkout
        │       └─→ Stripe Checkout Session
        │
        └─→ Redirect to Stripe
            └─→ On success → /checkout/success
            └─→ On cancel → /checkout/cancel

5. User Dashboard
   ┌──────────────────┐
   │ dashboard/       │ → Protected route
   │ page.tsx         │    Middleware check
   └────┬─────────────┘
        │
        ├─→ StatsCard (purchases, favorites)
        ├─→ PurchaseList
        │   └─→ Fetch /api/user/purchases
        │
        └─→ RecentActivity timeline
```

### State Management Pattern

```typescript
// Server Component (Default - No 'use client')
// app/marketplace/page.tsx
async function MarketplacePage() {
  // Direct database/API calls on server
  const tools = await fetchTools();
  
  return (
    <div>
      <SearchBar /> {/* Client Component */}
      <ToolGrid tools={tools} /> {/* Server Component */}
    </div>
  );
}

// Client Component
// components/marketplace/search-bar.tsx
'use client';

import { useState } from 'react';
import { useDebounce } from '@/lib/hooks/use-debounce';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  
  // Client-side interactivity
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  
  return <input onChange={handleSearch} />;
}

// Server Action (Form submission)
// app/actions/checkout.ts
'use server';

export async function createCheckoutSession(formData: FormData) {
  const toolId = formData.get('toolId');
  
  // Server-side logic
  const session = await stripe.checkout.sessions.create({
    // ... configuration
  });
  
  redirect(session.url);
}
```

### API Integration Pattern

```typescript
// lib/api/client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return response.json();
}

// lib/api/tools.ts
import { apiClient } from './client';
import { Tool } from '@/lib/types/tool';

export async function getTools(): Promise<Tool[]> {
  return apiClient<Tool[]>('/api/tools');
}

export async function getToolById(id: string): Promise<Tool> {
  return apiClient<Tool>(`/api/tools/${id}`);
}
```

---

## 🎨 Styling Architecture

### Tailwind CSS + shadcn/ui Pattern

```typescript
// Using cn() utility for conditional classes
import { cn } from '@/lib/utils/cn';

export function ToolCard({ featured, className }: Props) {
  return (
    <div
      className={cn(
        // Base styles
        "rounded-lg border bg-card p-6 shadow-sm transition-all",
        // Conditional styles
        featured && "border-primary ring-2 ring-primary/20",
        // User override
        className
      )}
    >
      {/* Content */}
    </div>
  );
}
```

### Theme Configuration

```typescript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... other theme colors
      },
    },
  },
};
```

---

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd beelia-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.beelia.ai
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start

# Deploy to Vercel (automatic via GitHub integration)
git push origin main
```

---

## 📦 Key Features Implementation

### 1. Server Components (Default)
- Fast initial page loads
- Zero JavaScript by default
- Direct database/API access
- SEO-friendly

### 2. Client Components ('use client')
- Interactive UI elements
- Form handling
- Real-time updates
- Browser APIs

### 3. Server Actions
- Type-safe mutations
- Progressive enhancement
- No API routes needed for forms

### 4. Streaming & Suspense
- Instant page transitions
- Loading states
- Partial page updates

---

## 🔐 Authentication Flow

```
User Login
   ↓
NextAuth.js
   ↓
JWT Token (httpOnly cookie)
   ↓
Middleware validates token
   ↓
Protected routes accessible
```

---

## 💳 Payment Integration (Stripe)

```
1. User clicks "Buy Now"
2. Frontend calls Server Action
3. Server Action creates Stripe Checkout Session
4. User redirected to Stripe
5. Payment completed
6. Stripe webhook → Backend
7. Database updated
8. User redirected to success page
```

---

## 📊 Performance Optimization

- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Dynamic imports for heavy components
- **Caching**: Vercel Edge Network + ISR
- **Font Optimization**: next/font for custom fonts

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint
```

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

