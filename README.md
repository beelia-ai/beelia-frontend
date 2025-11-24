# Beelia.ai Frontend

AI Marketplace & App Store Platform - Frontend Application

## 🚀 Tech Stack

- **Framework:** Next.js 15.0.3 (App Router, Turbopack, React 19)
- **UI Library:** React 19.0.0 (Server Components, Actions)
- **Language:** TypeScript 5.7.2 (Strict Mode)
- **Styling:** Tailwind CSS 3.4.15
- **Component Library:** shadcn/ui (Radix UI Primitives)
- **Authentication:** NextAuth.js v5 (Auth.js)
- **Payments:** Stripe 17.3.1 SDK + @stripe/stripe-js 4.10.0
- **Icons:** Lucide React 0.460.0
- **Validation:** Zod 3.23.8
- **Hosting:** Vercel (Edge Network)
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
│  │              Next.js 15 Application                     │     │
│  │  ┌──────────────────────────────────────────────┐      │     │
│  │  │         App Router (RSC + Client)            │      │     │
│  │  │  • Server Components (Default, React 19)     │      │     │
│  │  │  • Client Components ('use client')          │      │     │
│  │  │  • Server Actions (Type-safe mutations)      │      │     │
│  │  │  • Turbopack (Dev bundler)                   │      │     │
│  │  └──────────────────────────────────────────────┘      │     │
│  │                                                          │     │
│  │  ┌──────────────────────────────────────────────┐      │     │
│  │  │          React 19 Components                 │      │     │
│  │  │  • shadcn/ui Design System                   │      │     │
│  │  │  • Radix UI Primitives (Latest)              │      │     │
│  │  │  • Tailwind CSS 3.4.15 Styling               │      │     │
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
├── next.config.ts                       # Next.js 15 config (TypeScript)
├── package.json                         # Dependencies (latest)
├── tailwind.config.ts                   # Tailwind 3.4.15 config
├── tsconfig.json                        # TypeScript 5.7 config
├── postcss.config.js                    # PostCSS config
├── components.json                      # shadcn/ui config
└── README.md
```

### User Flow

```
1. Homepage → Browse Marketplace → Tool Details → Checkout → Success
2. User Registration/Login → Dashboard → View Purchases
3. Search & Filter → Tool Results → Tool Selection
```

---

## 🚦 Getting Started

**Prerequisites:** Node.js 18+ or Bun 1.0+

```bash
bun install
cp .env.example .env.local
bun dev
```

**Environment:** `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`

**Deploy:** Push to main branch → Auto-deploy via Vercel

---

## 📦 Key Features

- **Server Components** - Fast SSR, SEO-friendly
- **Client Components** - Interactive UI with 'use client'
- **Server Actions** - Type-safe mutations
- **Streaming & Suspense** - Progressive loading

---

## 🔐 Authentication

**Flow:** NextAuth.js → JWT (httpOnly) → Middleware validation → Protected routes

## 💳 Payments

**Flow:** Buy Now → Server Action → Stripe Checkout → Payment → Webhook → DB Update → Success

## ⚡ Performance

- Next.js Image optimization
- Automatic code splitting
- Vercel Edge caching + ISR
- Dynamic imports for heavy components

