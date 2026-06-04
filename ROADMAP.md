# One Question - Project Roadmap

**Last Updated:** June 2, 2026  
**Project Status:** Foundation & Scaffolding Phase  
**Current Version:** 0.1.0

---

## Project Vision

One Question is an AI-powered Q&A platform that enables creators, experts, and businesses to build personal knowledge spaces where AI automatically answers visitor questions based on uploaded content. The platform is designed to be simple, scalable, and accessible to anyone.

**Tagline:** "Your knowledge. Your answers. Your space."

---

## Core Features

### Phase 1: Foundation (Current - In Progress)
- ✅ Homepage with Linktree-style URL claim box
- ✅ Pricing structure (5-tier message-based billing)
- ✅ User authentication infrastructure (Clerk integration)
- ✅ Dashboard scaffolding
- ⏳ Backend API infrastructure preparation
- ⏳ Database schema (Convex)

### Phase 2: MVP - Core Functionality (Next)
- Profile creation and management
- Knowledge base upload (text, files, URLs)
- AI-powered Q&A engine (OpenAI integration)
- Public Q&A pages
- Analytics dashboard
- Message quota tracking

### Phase 3: Monetization
- Payment processing (Paystack integration)
- Subscription management
- Plan upgrades/downgrades
- Invoice generation
- Billing dashboard

### Phase 4: Advanced Features
- Custom domains
- Team collaboration
- API access for enterprise
- Webhooks and integrations
- Advanced analytics
- White-label options

---

## Pricing Tiers

| Plan | Price | Messages | Status | Features |
| :--- | :--- | :--- | :--- | :--- |
| **Free** | $0 | 30/month | Active | Basic AI responses, Public profile, Community support |
| **Starter** | $9 | 500/month | Active | Advanced AI responses, Custom domain, Analytics, Email support |
| **Pro** | $29 | 2,000/month | Coming Soon | Premium AI, Multiple Q&A pages, Advanced analytics, Priority support |
| **Business** | $49 | Unlimited | Coming Soon | Everything in Pro, Team access, Private spaces, Dedicated support |
| **Enterprise** | $99 | Unlimited | Coming Soon | Custom features, API access, SLA guarantee, Account manager |

**Note:** Free and Starter tiers are the primary focus for launch. Higher tiers will be rolled out incrementally.

---

## Technical Architecture

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Icons:** Lucide React

### Backend
- **Database:** Convex (Real-time, serverless)
- **Authentication:** Clerk
- **AI Engine:** OpenAI (GPT-4 Turbo, Embeddings)
- **Payments:** Paystack
- **Hosting:** Vercel

### Database Schema
- **profiles** - User profile information
- **knowledge** - User's knowledge base (text, files, URLs)
- **questions** - Visitor questions and AI answers
- **analytics** - Usage statistics and metrics
- **subscriptions** - Billing and plan information
- **waitlist** - Early access signups

---

## Development Phases & Timeline

### Phase 1: Foundation Setup (Week 1)
**Status:** In Progress

**Completed:**
- Repository initialization
- Dependency installation
- Project structure scaffolding
- Type definitions and constants
- Utility functions and validations
- Homepage with Linktree-style URL claim box
- 5-tier pricing structure
- Convex schema updates
- API route scaffolding

**Remaining:**
- Backend API implementation
- Convex queries and mutations
- OpenAI integration
- Clerk authentication flows
- UI component refinement

---

### Phase 2: Core Backend Implementation (Week 2-3)

#### 2.1 Profile Management
- [ ] Implement profile creation API
- [ ] Implement profile update API
- [ ] Implement username availability check
- [ ] Add profile validation
- [ ] Create profile dashboard UI

#### 2.2 Knowledge Base Management
- [ ] Implement text upload API
- [ ] Implement file upload API (PDF, TXT, Markdown)
- [ ] Implement URL import API
- [ ] Add knowledge validation
- [ ] Create knowledge management dashboard
- [ ] Implement knowledge deletion

#### 2.3 AI Q&A Engine
- [ ] Integrate OpenAI API
- [ ] Implement answer generation
- [ ] Implement embeddings generation
- [ ] Implement relevance checking
- [ ] Add response caching
- [ ] Implement error handling and fallbacks

#### 2.4 Question Management
- [ ] Implement question submission API
- [ ] Implement question storage
- [ ] Implement answer generation workflow
- [ ] Implement question retrieval
- [ ] Create public Q&A page
- [ ] Add answer feed component

---

### Phase 3: Frontend UI Development (Week 3-4)

#### 3.1 Dashboard Pages
- [ ] Profile settings page
- [ ] Knowledge management page
- [ ] Analytics dashboard
- [ ] Billing page
- [ ] Settings page

#### 3.2 Public Pages
- [ ] Public profile page
- [ ] Q&A page
- [ ] Answer feed
- [ ] Share functionality

#### 3.3 Authentication Pages
- [ ] Sign-up page
- [ ] Sign-in page
- [ ] Password reset
- [ ] Email verification

---

### Phase 4: Monetization & Billing (Week 4-5)

#### 4.1 Payment Integration
- [ ] Integrate Paystack
- [ ] Implement payment initialization
- [ ] Implement payment verification
- [ ] Implement webhook handling
- [ ] Add error handling

#### 4.2 Subscription Management
- [ ] Implement subscription creation
- [ ] Implement subscription updates
- [ ] Implement subscription cancellation
- [ ] Add plan downgrade logic
- [ ] Implement message quota tracking

#### 4.3 Billing Dashboard
- [ ] Current plan display
- [ ] Payment history
- [ ] Invoice generation
- [ ] Plan upgrade/downgrade UI

---

### Phase 5: Testing & Deployment (Week 5-6)

#### 5.1 Testing
- [ ] Unit tests for utilities
- [ ] Integration tests for APIs
- [ ] E2E tests for critical flows
- [ ] Performance testing
- [ ] Security testing

#### 5.2 Deployment
- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Configure environment variables
- [ ] Set up monitoring and logging
- [ ] Deploy to Vercel
- [ ] Set up custom domain

#### 5.3 Launch Preparation
- [ ] Final QA
- [ ] Documentation
- [ ] User onboarding flow
- [ ] Support setup

---

### Phase 6: Advanced Features (Post-Launch)

#### 6.1 Custom Domains
- [ ] Implement custom domain routing
- [ ] Add domain verification
- [ ] SSL certificate management

#### 6.2 Team Collaboration
- [ ] Implement team creation
- [ ] Add member management
- [ ] Implement role-based access control
- [ ] Add activity logging

#### 6.3 API & Integrations
- [ ] Build public API
- [ ] Implement API keys
- [ ] Add webhook support
- [ ] Create API documentation

#### 6.4 Advanced Analytics
- [ ] Implement detailed analytics
- [ ] Add export functionality
- [ ] Create custom reports
- [ ] Add visitor tracking

---

## API Endpoints

### Authentication
- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-in` - User login
- `POST /api/auth/sign-out` - User logout
- `POST /api/auth/refresh` - Refresh token

### Profile
- `GET /api/profile` - Get current user profile
- `POST /api/profile` - Create profile
- `PUT /api/profile` - Update profile
- `GET /api/profile/:username` - Get public profile
- `POST /api/check-username` - Check username availability

### Knowledge
- `GET /api/knowledge` - List user's knowledge
- `POST /api/upload` - Upload knowledge (text/file)
- `PUT /api/knowledge/:id` - Update knowledge
- `DELETE /api/knowledge/:id` - Delete knowledge

### Questions & Answers
- `POST /api/ask` - Submit question
- `GET /api/answers/:username` - Get answers for a profile
- `GET /api/questions` - Get user's questions

### Analytics
- `GET /api/analytics` - Get user analytics
- `GET /api/analytics/summary` - Get analytics summary

### Subscriptions & Billing
- `GET /api/subscription` - Get current subscription
- `POST /api/subscription/upgrade` - Upgrade plan
- `POST /api/subscription/downgrade` - Downgrade plan
- `POST /api/subscription/cancel` - Cancel subscription
- `GET /api/billing/history` - Get billing history

### Payments
- `POST /api/paystack/initialize` - Initialize payment
- `POST /api/paystack/verify` - Verify payment
- `POST /api/paystack/webhook` - Paystack webhook

---

## Infrastructure & DevOps

### Environment Variables
```
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Convex
CONVEX_DEPLOYMENT_URL=https://...

# OpenAI
OPENAI_API_KEY=sk-...

# Paystack
PAYSTACK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...

# App
NEXT_PUBLIC_APP_URL=https://onequestion.space
```

### Deployment
- **Hosting:** Vercel
- **Database:** Convex (serverless)
- **CDN:** Vercel Edge Network
- **Monitoring:** Vercel Analytics

---

## Success Metrics

### User Metrics
- [ ] 1,000 sign-ups in first month
- [ ] 100+ active users
- [ ] 10,000+ questions answered
- [ ] 50+ paying customers

### Performance Metrics
- [ ] Page load time < 2 seconds
- [ ] API response time < 500ms
- [ ] 99.9% uptime
- [ ] Zero critical bugs

### Business Metrics
- [ ] $1,000 MRR (Month 1)
- [ ] 20% month-over-month growth
- [ ] 5% conversion rate (Free to Paid)
- [ ] 80%+ customer satisfaction

---

## Known Limitations & Constraints

### Current Limitations
1. **Free tier limited to 30 messages/month** - Encourages upgrades
2. **No custom domains yet** - Coming in Phase 6
3. **Single knowledge base per user** - Will support multiple in Phase 4
4. **No team collaboration** - Coming in Phase 6
5. **Limited analytics** - Basic metrics only, advanced coming in Phase 6

### Technical Constraints
1. **Convex rate limits** - Monitor during scaling
2. **OpenAI API costs** - Implement caching and optimization
3. **File upload size** - Limited to 10MB per file
4. **Knowledge base size** - Limited to 50,000 characters initially

---

## Risk Mitigation

| Risk | Impact | Mitigation |
| :--- | :--- | :--- |
| OpenAI API costs | High | Implement caching, rate limiting, and cost monitoring |
| Convex scaling | Medium | Monitor usage, optimize queries, implement pagination |
| User acquisition | High | Focus on product-market fit, viral features, partnerships |
| Payment failures | Medium | Implement retry logic, clear error messages, support |
| Data security | High | Implement encryption, regular audits, compliance checks |

---

## Dependencies & Tools

### Frontend Dependencies
- next@16
- react@19
- typescript
- tailwindcss
- shadcn/ui
- zustand
- axios
- lucide-react

### Backend Dependencies
- convex
- @clerk/nextjs
- openai
- paystack

### Development Tools
- ESLint
- Prettier
- TypeScript
- Git
- GitHub

---

## Communication & Updates

- **Status Updates:** Weekly (Fridays)
- **Sprint Reviews:** Bi-weekly
- **Stakeholder Updates:** Monthly
- **Documentation:** Updated with each phase

---

## Next Steps

1. **Immediate (This Week)**
   - Finalize backend API infrastructure
   - Implement Convex queries and mutations
   - Set up OpenAI integration

2. **Short-term (Next 2 Weeks)**
   - Complete profile and knowledge management APIs
   - Build dashboard UI
   - Implement AI Q&A flow

3. **Medium-term (Weeks 4-6)**
   - Integrate Paystack payments
   - Complete testing
   - Deploy to production

---

## Questions & Support

For questions or clarifications about this roadmap, please reach out to the team or create an issue in the GitHub repository.

**Repository:** [onequestionspace/onequestion_space](https://github.com/onequestionspace/onequestion_space)

---

*This roadmap is a living document and will be updated as the project evolves.*
