# One Question - Complete Project Documentation

**Version:** 0.1.0  
**Last Updated:** June 2, 2026  
**Status:** Pre-API Integration Phase

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Technology Stack](#architecture--technology-stack)
3. [Project Structure](#project-structure)
4. [Core Features](#core-features)
5. [File-by-File Breakdown](#file-by-file-breakdown)
6. [API Routes & Endpoints](#api-routes--endpoints)
7. [Database Schema](#database-schema)
8. [Theme System](#theme-system)
9. [Component Library](#component-library)
10. [Development Workflow](#development-workflow)
11. [Deployment & Environment](#deployment--environment)
12. [Next Steps - API Integration](#next-steps---api-integration)

---

## Project Overview

**One Question** is an AI-powered Q&A platform that enables creators, experts, and businesses to build personal knowledge spaces where AI automatically answers visitor questions based on uploaded content.

**Core Value Proposition:** "Your knowledge. Your answers. Your space."

The platform is currently in the **Pre-API Integration Phase**, meaning all UI, components, and infrastructure are ready for backend APIs to be connected. Once APIs are integrated, the system will automatically sync data across the application.

---

## Architecture & Technology Stack

### Frontend Stack
- **Framework:** Next.js 16 (App Router with TypeScript)
- **Styling:** Tailwind CSS with custom theme system
- **UI Components:** shadcn/ui (custom implementations)
- **State Management:** Zustand
- **HTTP Client:** Axios (via custom `useApi` hook)
- **Icons:** Lucide React
- **Authentication:** Clerk

### Backend Stack (To Be Integrated)
- **Database:** Convex (serverless, real-time)
- **AI Engine:** OpenAI (GPT-4 Turbo, Embeddings)
- **Payments:** Paystack
- **Hosting:** Vercel

### Development Tools
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- GitHub for version control

---

## Project Structure

```
onequestion_space/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with ThemeProvider
│   ├── page.tsx                 # Homepage
│   ├── [username]/              # Public Q&A pages
│   │   └── page.tsx            # Dynamic profile page
│   ├── dashboard/               # Authenticated dashboard
│   │   ├── page.tsx            # Dashboard overview
│   │   ├── knowledge/          # Knowledge management
│   │   ├── analytics/          # Analytics dashboard
│   │   ├── billing/            # Billing & subscription
│   │   └── settings/           # User settings
│   ├── pricing/                 # Pricing page
│   ├── waitlist/                # Waitlist signup
│   ├── api/                     # API routes
│   │   ├── ask/                # Question submission
│   │   ├── upload/             # Knowledge upload
│   │   ├── profile/            # Profile management
│   │   ├── knowledge/          # Knowledge CRUD
│   │   ├── subscription/       # Subscription management
│   │   ├── analytics/          # Analytics data
│   │   ├── check-username/     # Username availability
│   │   ├── waitlist/           # Waitlist signup
│   │   └── paystack/           # Payment processing
│   └── globals.css             # Global styles
├── components/                  # Reusable React components
│   ├── Navbar.tsx              # Navigation bar with theme toggle
│   ├── Footer.tsx              # Footer component
│   ├── Hero.tsx                # Homepage hero section
│   ├── URLClaimBox.tsx         # Linktree-style URL claim box
│   ├── ThemeToggle.tsx         # Theme switcher (3 themes)
│   ├── DashboardLayout.tsx     # Dashboard layout wrapper
│   ├── UploadKnowledge.tsx     # Knowledge upload form
│   ├── AskForm.tsx             # Question form component
│   ├── AnswerFeed.tsx          # Answer display component
│   ├── PricingSection.tsx      # Pricing cards
│   ├── SocialProof.tsx         # Social proof section
│   ├── HowItWorks.tsx          # How it works section
│   ├── ProfilePreview.tsx      # Profile preview
│   ├── TeamSection.tsx         # Team showcase
│   ├── CTASection.tsx          # Call-to-action section
│   └── ui/                     # Basic UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Input.tsx
├── lib/                         # Utility functions & helpers
│   ├── theme-context.tsx       # Theme provider & hook
│   ├── openai.ts               # OpenAI integration (placeholder)
│   ├── paystack.ts             # Paystack integration
│   ├── clerk.ts                # Clerk auth utilities
│   ├── utils.ts                # General utilities
│   └── validations.ts          # Input validation functions
├── hooks/                       # Custom React hooks
│   ├── useAuth.ts              # Authentication hook
│   └── useApi.ts               # API call hook
├── types/                       # TypeScript type definitions
│   └── index.ts                # All interface definitions
├── constants/                   # App constants
│   └── index.ts                # Configuration constants
├── convex/                      # Convex backend schema (placeholder)
│   ├── schema.ts               # Database schema
│   ├── profiles.ts             # Profile queries/mutations
│   ├── knowledge.ts            # Knowledge queries/mutations
│   ├── questions.ts            # Question queries/mutations
│   ├── analytics.ts            # Analytics queries/mutations
│   └── subscriptions.ts        # Subscription queries/mutations
├── public/                      # Static assets
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies
├── ROADMAP.md                  # Development roadmap
├── BACKEND_READINESS.md        # Backend integration checklist
└── PROJECT_DOCUMENTATION.md    # This file
```

---

## Core Features

### Phase 1: Foundation (Current - ✅ Complete)
- ✅ Homepage with Linktree-style URL claim box
- ✅ Three-theme toggle system (Cosmic, Emerald, Sunset)
- ✅ Pricing structure (5-tier message-based billing)
- ✅ User authentication infrastructure (Clerk integration)
- ✅ Dashboard scaffolding
- ✅ Public Q&A page design
- ✅ Backend API infrastructure preparation
- ✅ Database schema (Convex)
- ✅ Component library

### Phase 2: MVP - Core Functionality (Next)
- ⏳ Profile creation and management (API ready)
- ⏳ Knowledge base upload (API ready)
- ⏳ AI-powered Q&A engine (API ready)
- ⏳ Public Q&A pages (UI complete, awaiting API)
- ⏳ Analytics dashboard (UI complete, awaiting API)
- ⏳ Message quota tracking (API ready)

### Phase 3: Monetization
- ⏳ Payment processing (Paystack integration ready)
- ⏳ Subscription management (API ready)
- ⏳ Plan upgrades/downgrades (API ready)
- ⏳ Invoice generation (API ready)

---

## File-by-File Breakdown

### Homepage & Landing Pages

#### `/app/page.tsx`
The main landing page that composes all marketing sections. Includes the URL Claim Box, Hero section, Social Proof, How It Works, Profile Preview, Pricing, and CTA sections. This page is fully designed and ready for API integration.

#### `/components/URLClaimBox.tsx`
A Linktree-inspired component that allows users to check username availability and claim their space. Features include:
- Real-time username validation
- Availability checking (placeholder API call)
- Instant URL generation preview
- Responsive design for all devices

**Status:** UI Complete | Awaiting `/api/check-username` implementation

#### `/components/Hero.tsx`
The hero section with animated background, brand messaging, and CTA buttons. Includes a preview card showing what a user's Q&A page will look like.

#### `/components/PricingSection.tsx`
Displays all five pricing tiers with message-based billing. Features:
- Free tier: 30 messages/month
- Starter tier: 500 messages/month (highlighted)
- Pro, Business, Enterprise tiers marked as "Coming Soon"
- Dynamic rendering from constants
- Responsive grid layout

**Status:** UI Complete | Ready for payment integration

### Public Q&A Pages

#### `/app/[username]/page.tsx`
The public-facing Q&A page for each user. Features include:
- Full profile showcase with statistics
- Question submission form
- Recent answers display
- Knowledge topics sidebar
- Response time metrics
- Social sharing buttons

**Status:** UI Complete | Awaiting `/api/ask` and profile data APIs

### Dashboard Pages

#### `/app/dashboard/page.tsx`
Main dashboard overview with:
- Quick statistics (questions, responses, visitors)
- Recent questions list
- Quick action buttons
- Subscription info

**Status:** UI Scaffolded | Awaiting `/api/analytics` data

#### `/app/dashboard/knowledge/page.tsx`
Knowledge base management with:
- Drag-and-drop file upload
- Text content input
- URL import (coming soon)
- Knowledge item list
- Edit/delete functionality

**Status:** UI Scaffolded | Awaiting `/api/knowledge` and `/api/upload` APIs

#### `/app/dashboard/analytics/page.tsx`
Analytics dashboard showing:
- Total questions and answers
- Visitor statistics
- Response rate
- Charts and graphs (placeholder)
- Engagement metrics

**Status:** UI Scaffolded | Awaiting `/api/analytics` API

#### `/app/dashboard/billing/page.tsx`
Billing and subscription management:
- Current plan display
- Message usage tracking
- Payment method management
- Billing history
- Upgrade/downgrade options

**Status:** UI Scaffolded | Awaiting `/api/subscription` API

#### `/app/dashboard/settings/page.tsx`
User settings and profile management:
- Profile information editing
- Display name and bio
- Avatar upload
- Privacy settings
- Danger zone (delete account)

**Status:** UI Scaffolded | Awaiting `/api/profile` API

### API Routes

#### `/app/api/profile/route.ts`
Handles user profile operations:
- `GET /api/profile` - Get current user's profile
- `POST /api/profile` - Create new profile
- `PUT /api/profile` - Update profile
- `DELETE /api/profile` - Delete profile

**Status:** Scaffolded with validation | Awaiting Convex integration

#### `/app/api/knowledge/route.ts`
Handles knowledge base operations:
- `GET /api/knowledge` - List user's knowledge
- `POST /api/knowledge` - Create knowledge item (text or file)

**Status:** Scaffolded with validation | Awaiting file storage and Convex integration

#### `/app/api/ask/route.ts`
Handles question submission:
- `POST /api/ask` - Submit question and get AI answer

**Status:** Scaffolded with validation | Awaiting OpenAI integration

#### `/app/api/subscription/route.ts`
Handles subscription management:
- `GET /api/subscription` - Get current subscription
- `POST /api/subscription/upgrade` - Upgrade plan

**Status:** Scaffolded with validation | Awaiting Paystack and Convex integration

#### `/app/api/analytics/route.ts`
Handles analytics data:
- `GET /api/analytics` - Get user analytics

**Status:** Scaffolded | Awaiting Convex integration

#### `/app/api/check-username/route.ts`
Handles username availability checking:
- `POST /api/check-username` - Check if username is available

**Status:** Scaffolded with validation | Awaiting Convex integration

### Components

#### `/components/Navbar.tsx`
Navigation bar with:
- Logo and branding
- Navigation links
- Theme toggle button
- Authentication buttons (sign up/login or user menu)

**Status:** Complete with Theme Toggle integrated

#### `/components/ThemeToggle.tsx`
Theme switcher component with three options:
- **Cosmic:** Purple & Pink (default)
- **Emerald:** Green & Cyan
- **Sunset:** Orange & Red

Features SSR-safe rendering and localStorage persistence.

#### `/components/DashboardLayout.tsx`
Wrapper component for dashboard pages providing:
- Sidebar navigation
- Profile section
- Subscription info
- Responsive layout

#### `/components/UploadKnowledge.tsx`
Knowledge upload form with:
- Title input
- Content textarea
- File upload (PDF, TXT, Markdown)
- Validation

**Status:** UI Complete | Awaiting `/api/upload` implementation

### Hooks

#### `/hooks/useAuth.ts`
Custom hook for authentication state:
- Returns user info from Clerk
- Provides `isSignedIn`, `isLoaded`, `userId`
- Handles authentication state

#### `/hooks/useApi.ts`
Custom hook for API calls:
- Handles loading and error states
- Provides `execute` function for making requests
- Supports callbacks for success/error

### Utilities

#### `/lib/theme-context.tsx`
Theme provider and hook:
- Manages three themes (Cosmic, Emerald, Sunset)
- Persists theme to localStorage
- Provides `useTheme()` hook
- SSR-safe implementation

#### `/lib/validations.ts`
Input validation functions:
- `validateUsername()` - Validates username format
- `validateEmail()` - Validates email format
- `validatePassword()` - Validates password strength
- `validateQuestion()` - Validates question length
- `validateFile()` - Validates file size and type
- And more...

#### `/lib/openai.ts`
OpenAI integration (placeholder):
- `generateAnswer()` - Generate AI response
- `generateEmbeddings()` - Create embeddings
- `isRelevantQuestion()` - Check question relevance
- `extractTopics()` - Extract key topics

**Status:** Placeholder | Awaiting implementation

#### `/lib/paystack.ts`
Paystack payment integration:
- `initializePayment()` - Start payment process
- `verifyPayment()` - Verify payment completion
- `validateWebhookSignature()` - Validate webhook
- `createPaymentPlan()` - Create subscription plan
- `getPaymentPlans()` - List available plans

**Status:** Partially implemented | Awaiting full integration

---

## API Routes & Endpoints

### Profile Management
| Method | Endpoint | Purpose | Status |
| :--- | :--- | :--- | :--- |
| GET | `/api/profile` | Get current user profile | Scaffolded |
| POST | `/api/profile` | Create new profile | Scaffolded |
| PUT | `/api/profile` | Update profile | Scaffolded |
| DELETE | `/api/profile` | Delete profile | Scaffolded |

### Knowledge Management
| Method | Endpoint | Purpose | Status |
| :--- | :--- | :--- | :--- |
| GET | `/api/knowledge` | List user's knowledge | Scaffolded |
| POST | `/api/knowledge` | Create knowledge item | Scaffolded |
| PUT | `/api/knowledge/:id` | Update knowledge | Planned |
| DELETE | `/api/knowledge/:id` | Delete knowledge | Planned |

### Questions & Answers
| Method | Endpoint | Purpose | Status |
| :--- | :--- | :--- | :--- |
| POST | `/api/ask` | Submit question | Scaffolded |
| GET | `/api/answers/:username` | Get answers for profile | Planned |
| GET | `/api/questions` | Get user's questions | Planned |

### Analytics
| Method | Endpoint | Purpose | Status |
| :--- | :--- | :--- | :--- |
| GET | `/api/analytics` | Get user analytics | Scaffolded |

### Subscriptions & Billing
| Method | Endpoint | Purpose | Status |
| :--- | :--- | :--- | :--- |
| GET | `/api/subscription` | Get current subscription | Scaffolded |
| POST | `/api/subscription/upgrade` | Upgrade plan | Scaffolded |
| POST | `/api/subscription/downgrade` | Downgrade plan | Planned |
| POST | `/api/subscription/cancel` | Cancel subscription | Planned |
| GET | `/api/billing/history` | Get billing history | Planned |

### Utilities
| Method | Endpoint | Purpose | Status |
| :--- | :--- | :--- | :--- |
| POST | `/api/check-username` | Check username availability | Scaffolded |
| POST | `/api/waitlist` | Add to waitlist | Scaffolded |

### Payments
| Method | Endpoint | Purpose | Status |
| :--- | :--- | :--- | :--- |
| POST | `/api/paystack/initialize` | Initialize payment | Scaffolded |
| POST | `/api/paystack/verify` | Verify payment | Scaffolded |
| POST | `/api/paystack/webhook` | Handle payment webhook | Scaffolded |

---

## Database Schema

### Profiles Table
Stores user profile information with indexes for fast lookups.

```typescript
{
  userId: string,           // Clerk user ID
  username: string,         // Unique username
  displayName: string,      // Display name
  bio?: string,            // User bio
  avatar?: string,         // Avatar URL
  createdAt: number,       // Creation timestamp
  updatedAt: number,       // Last update timestamp
}
```

**Indexes:** `by_userId`, `by_username`

### Knowledge Table
Stores user's knowledge base content.

```typescript
{
  userId: string,          // Owner user ID
  title: string,          // Knowledge title
  content: string,        // Knowledge content
  fileUrl?: string,       // File storage URL
  fileType?: string,      // File MIME type
  createdAt: number,      // Creation timestamp
  updatedAt: number,      // Last update timestamp
}
```

**Indexes:** `by_userId`

### Questions Table
Stores visitor questions and AI answers.

```typescript
{
  profileId: string,       // Profile ID (reference)
  visitorId?: string,      // Visitor identifier
  question: string,        // Question text
  answer?: string,         // AI answer
  isAnswered: boolean,     // Answer status
  createdAt: number,       // Creation timestamp
  answeredAt?: number,     // Answer timestamp
}
```

**Indexes:** `by_profileId`, `by_isAnswered`

### Analytics Table
Stores usage statistics and metrics.

```typescript
{
  profileId: string,       // Profile ID (reference)
  totalQuestions: number,  // Total questions received
  totalAnswers: number,    // Total answers given
  totalVisitors: number,   // Unique visitors
  createdAt: number,       // Creation timestamp
  updatedAt: number,       // Last update timestamp
}
```

**Indexes:** `by_profileId`

### Subscriptions Table
Stores subscription and billing information with message-based quotas.

```typescript
{
  userId: string,          // User ID
  plan: 'free' | 'starter' | 'pro' | 'business' | 'enterprise',
  status: 'active' | 'inactive' | 'cancelled' | 'trial',
  messagesUsed: number,    // Messages used this month
  messagesLimit: number,   // Monthly message limit (-1 = unlimited)
  paymentReference?: string, // Payment transaction ID
  amount?: number,         // Payment amount
  currency?: string,       // Currency code
  renewalDate?: number,    // Next renewal timestamp
  trialEndsAt?: number,    // Trial end timestamp
  createdAt: number,       // Creation timestamp
  updatedAt: number,       // Last update timestamp
}
```

**Indexes:** `by_userId`

### Waitlist Table
Stores early access signups.

```typescript
{
  email: string,          // Email address
  name?: string,          // Optional name
  createdAt: number,      // Signup timestamp
}
```

**Indexes:** `by_email`

---

## Theme System

The application features a three-theme system allowing users to choose their preferred color scheme:

### Cosmic Theme (Default)
- **Primary:** Purple (#a855f7)
- **Accent 1:** Pink (#ec4899)
- **Accent 2:** Red (#ef4444)
- **Accent 3:** Yellow (#facc15)
- **Vibe:** Modern, Bold, Tech-forward

### Emerald Theme
- **Primary:** Green (#10b981)
- **Accent 1:** Cyan (#06b6d4)
- **Accent 2:** Purple (#8b5cf6)
- **Accent 3:** Amber (#f59e0b)
- **Vibe:** Fresh, Growth-oriented, Sustainable

### Sunset Theme
- **Primary:** Orange (#f97316)
- **Accent 1:** Red (#ef4444)
- **Accent 2:** Pink (#ec4899)
- **Accent 3:** Amber (#fbbf24)
- **Vibe:** Warm, Energetic, Inviting

### Implementation
The theme system is implemented via:
1. **ThemeProvider** (`/lib/theme-context.tsx`) - Manages theme state and persistence
2. **ThemeToggle** (`/components/ThemeToggle.tsx`) - UI for switching themes
3. **localStorage** - Persists user's theme choice
4. **CSS Custom Properties** - Dynamic theme application

---

## Component Library

### UI Components
- **Button.tsx** - Reusable button component
- **Card.tsx** - Card wrapper with header, content, footer
- **Input.tsx** - Text input component

### Layout Components
- **Navbar.tsx** - Navigation bar with theme toggle
- **Footer.tsx** - Footer with links and branding
- **DashboardLayout.tsx** - Dashboard sidebar and layout

### Feature Components
- **URLClaimBox.tsx** - Username claim interface
- **ThemeToggle.tsx** - Theme switcher
- **UploadKnowledge.tsx** - Knowledge upload form
- **AskForm.tsx** - Question submission form
- **AnswerFeed.tsx** - Answer display component
- **PricingSection.tsx** - Pricing cards

### Marketing Components
- **Hero.tsx** - Hero section
- **SocialProof.tsx** - Social proof section
- **HowItWorks.tsx** - How it works section
- **ProfilePreview.tsx** - Profile preview
- **TeamSection.tsx** - Team showcase
- **CTASection.tsx** - Call-to-action section

---

## Development Workflow

### Setting Up Development Environment

```bash
# Clone repository
gh repo clone onequestionspace/onequestion_space
cd onequestion_space

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev

# Open browser to http://localhost:3000
```

### Environment Variables Required

```
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Convex Database
CONVEX_DEPLOYMENT_URL=https://...

# OpenAI
OPENAI_API_KEY=sk-...

# Paystack
PAYSTACK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...

# App Configuration
NEXT_PUBLIC_APP_URL=https://onequestion.space
```

### Building & Deployment

```bash
# Build for production
npm run build

# Start production server
npm start

# Deploy to Vercel
vercel deploy
```

---

## Deployment & Environment

### Current Deployment Status
- **Hosting:** Vercel (ready for deployment)
- **Database:** Convex (schema defined, awaiting implementation)
- **Authentication:** Clerk (integrated)
- **Payments:** Paystack (integration ready)

### Pre-Deployment Checklist
- [ ] All environment variables configured
- [ ] Clerk project created and configured
- [ ] Convex project initialized
- [ ] OpenAI API key obtained
- [ ] Paystack account set up
- [ ] Custom domain configured (optional)
- [ ] SSL certificate verified
- [ ] Database migrations tested
- [ ] Payment webhook configured
- [ ] Email service configured

---

## Next Steps - API Integration

The project is now ready for the final integration phase. The following steps should be taken in order:

### Step 1: Implement Convex Backend (Week 1-2)
- Implement all query and mutation functions in Convex modules
- Connect Convex to the application
- Test database operations

### Step 2: Implement OpenAI Integration (Week 2)
- Complete OpenAI API integration
- Implement answer generation
- Implement embeddings and relevance checking

### Step 3: Wire API Routes to Backend (Week 2-3)
- Connect all API routes to Convex
- Implement data validation and error handling
- Add authentication middleware

### Step 4: Implement Paystack Integration (Week 3)
- Complete payment flow
- Implement subscription management
- Add webhook handling

### Step 5: Testing & QA (Week 4)
- Unit tests for utilities
- Integration tests for APIs
- E2E tests for critical flows
- Performance testing

### Step 6: Launch (Week 5)
- Final QA
- Deploy to production
- Monitor and support

---

## Summary

One Question is a fully designed and scaffolded platform ready for backend integration. All UI components, API routes, database schemas, and infrastructure are in place. The next phase is to implement the backend APIs and connect them to the frontend, at which point the system will automatically sync data across the application.

For questions or clarifications, refer to the `ROADMAP.md` and `BACKEND_READINESS.md` files.
