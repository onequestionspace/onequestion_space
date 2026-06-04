# Agent Handoff Instructions - One Question

**Document Purpose:** This file provides comprehensive instructions for any AI agent, developer, or team member who will continue development on the One Question project.

**Last Updated:** June 2, 2026  
**Project Status:** Pre-API Integration Phase (UI Complete, APIs Scaffolded)

---

## Quick Start for New Agents

If you're a new agent joining this project, follow these steps:

1. **Read the Documentation** (in order):
   - `README.md` - Project overview and setup
   - `PROJECT_DOCUMENTATION.md` - Complete file-by-file breakdown
   - `ROADMAP.md` - Development roadmap and timeline
   - `BACKEND_READINESS.md` - API integration checklist
   - This file (`AGENT_HANDOFF.md`) - Continuation instructions

2. **Understand the Current State:**
   - All UI components are complete and styled
   - All API routes are scaffolded with validation
   - Database schema is defined in Convex
   - Three-theme toggle system is implemented
   - Public Q&A pages are fully designed
   - Dashboard is scaffolded and ready for data

3. **Know What's NOT Done:**
   - Convex backend implementation (queries/mutations)
   - OpenAI integration (answer generation)
   - Paystack payment flow (subscription management)
   - API route implementations (connecting to backend)
   - Testing and QA

4. **Start Contributing:**
   - Pick a task from the `BACKEND_READINESS.md` checklist
   - Follow the development workflow in `PROJECT_DOCUMENTATION.md`
   - Refer to the roadmap for prioritization

---

## Project Context

### What This Project Does
One Question is an AI-powered Q&A platform where:
1. Users create a personal Q&A page with a unique URL
2. Users upload their knowledge (text, files, or URLs)
3. Visitors ask questions on the public page
4. AI automatically answers based on the user's knowledge
5. Users can see analytics and manage subscriptions

### Current Development Phase
**Pre-API Integration Phase** - The frontend is 100% complete. All UI, components, and infrastructure are ready. The next phase is to implement the backend APIs and connect them.

### Key Design Decisions
- **Three-Theme System:** Users can choose between Cosmic (purple), Emerald (green), or Sunset (orange) themes
- **Message-Based Billing:** Pricing is based on the number of AI responses per month
- **Linktree-Inspired:** The URL claim box and overall design are inspired by Linktree's simplicity
- **API-First Architecture:** All backend logic is designed to be implemented as APIs that the frontend consumes

---

## Technology Stack Overview

### Frontend
```
Next.js 16 + React 19 + TypeScript
├── Tailwind CSS (styling)
├── shadcn/ui (component library)
├── Clerk (authentication)
├── Zustand (state management)
└── Lucide React (icons)
```

### Backend (To Be Implemented)
```
Convex (database)
├── OpenAI (AI engine)
├── Paystack (payments)
└── Vercel (hosting)
```

### Development
```
TypeScript, ESLint, Prettier, GitHub
```

---

## Project Structure Cheat Sheet

```
app/                    → Pages and API routes
├── page.tsx           → Homepage
├── [username]/        → Public Q&A pages
├── dashboard/         → User dashboard
├── pricing/           → Pricing page
└── api/               → API routes (scaffolded)

components/            → Reusable React components
├── Navbar.tsx         → Navigation with theme toggle
├── URLClaimBox.tsx    → Username claim interface
├── DashboardLayout.tsx → Dashboard wrapper
└── ...                → Other components

lib/                   → Utilities and helpers
├── theme-context.tsx  → Theme provider
├── openai.ts          → OpenAI integration (placeholder)
├── paystack.ts        → Paystack integration
└── validations.ts     → Input validation

types/                 → TypeScript interfaces
constants/             → App configuration
hooks/                 → Custom React hooks
convex/                → Database schema (Convex)
```

---

## File Importance Hierarchy

### Critical Files (Must Understand First)
1. `PROJECT_DOCUMENTATION.md` - Complete project overview
2. `ROADMAP.md` - Development timeline and priorities
3. `app/layout.tsx` - Root layout with ThemeProvider
4. `lib/theme-context.tsx` - Theme system
5. `types/index.ts` - All TypeScript interfaces

### Important Files (Understand Before Implementation)
1. `app/api/` - All API route scaffolds
2. `convex/schema.ts` - Database schema
3. `components/` - All UI components
4. `constants/index.ts` - App configuration

### Reference Files (Consult as Needed)
1. `lib/validations.ts` - Validation functions
2. `lib/openai.ts` - OpenAI placeholder
3. `lib/paystack.ts` - Paystack integration
4. `hooks/useApi.ts` - API call hook

---

## Current Implementation Status

### ✅ Complete (100%)
- Homepage and landing pages
- Public Q&A page design
- Dashboard layout and pages
- All UI components
- Theme system (3 themes)
- URL claim box
- Pricing page
- Authentication scaffolding
- Input validation
- Type definitions

### ⏳ Scaffolded (50%)
- API routes (structure ready, logic pending)
- Convex schema (structure ready, implementation pending)
- OpenAI integration (placeholder functions)
- Paystack integration (partial implementation)

### ❌ Not Started (0%)
- Convex backend implementation
- OpenAI API calls
- Payment processing
- API route implementations
- Testing and QA

---

## How to Continue Development

### Phase 1: Backend Implementation (Priority 1)

**Objective:** Implement all Convex queries and mutations

**Files to Modify:**
- `convex/profiles.ts` - Profile CRUD operations
- `convex/knowledge.ts` - Knowledge base CRUD
- `convex/questions.ts` - Question/answer storage
- `convex/analytics.ts` - Analytics tracking
- `convex/subscriptions.ts` - Subscription management

**Expected Outcome:** All database operations working

**Estimated Time:** 3-5 days

---

### Phase 2: API Route Implementation (Priority 2)

**Objective:** Connect API routes to Convex backend

**Files to Modify:**
- `app/api/profile/route.ts` - Profile management
- `app/api/knowledge/route.ts` - Knowledge management
- `app/api/ask/route.ts` - Question submission
- `app/api/subscription/route.ts` - Subscription management
- `app/api/analytics/route.ts` - Analytics data

**Expected Outcome:** All API routes working with real data

**Estimated Time:** 3-5 days

---

### Phase 3: AI Integration (Priority 3)

**Objective:** Implement OpenAI integration for answer generation

**Files to Modify:**
- `lib/openai.ts` - Complete all functions
- `app/api/ask/route.ts` - Use OpenAI in answer generation

**Expected Outcome:** AI can generate answers based on knowledge

**Estimated Time:** 2-3 days

---

### Phase 4: Payment Integration (Priority 4)

**Objective:** Implement Paystack payment flow

**Files to Modify:**
- `lib/paystack.ts` - Complete implementation
- `app/api/paystack/` - All payment routes
- `app/api/subscription/route.ts` - Payment handling

**Expected Outcome:** Users can upgrade plans and pay

**Estimated Time:** 2-3 days

---

### Phase 5: Testing & QA (Priority 5)

**Objective:** Comprehensive testing and bug fixes

**What to Test:**
- Unit tests for utilities
- Integration tests for APIs
- E2E tests for critical flows
- Performance testing
- Security testing

**Expected Outcome:** Production-ready application

**Estimated Time:** 3-5 days

---

## Common Tasks & How to Do Them

### Task: Add a New API Endpoint

1. Create route file: `app/api/[feature]/route.ts`
2. Import necessary utilities and types
3. Implement GET/POST/PUT/DELETE handlers
4. Add validation using functions from `lib/validations.ts`
5. Add TODO comments for Convex integration
6. Test with Postman or curl

### Task: Modify a Component

1. Locate component in `components/` directory
2. Understand props and state
3. Make changes
4. Test in browser
5. Check responsive design on mobile

### Task: Add a New Type

1. Open `types/index.ts`
2. Add interface definition
3. Export the type
4. Use in components and APIs

### Task: Update Constants

1. Open `constants/index.ts`
2. Add or modify constant
3. Import in files that need it
4. Update related components if needed

### Task: Implement Convex Function

1. Open relevant file in `convex/` directory
2. Replace TODO with actual implementation
3. Use Convex query/mutation syntax
4. Add error handling
5. Test with Convex dashboard

---

## Important Conventions

### Naming Conventions
- Components: PascalCase (e.g., `UserProfile.tsx`)
- Functions: camelCase (e.g., `getUserProfile()`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`)
- Types: PascalCase (e.g., `UserProfile`)
- Files: kebab-case for utilities (e.g., `user-utils.ts`)

### Code Style
- Use TypeScript for type safety
- Use functional components with hooks
- Use Tailwind CSS for styling
- Use shadcn/ui components when possible
- Add JSDoc comments for functions

### API Response Format
```typescript
{
  success: boolean,
  data?: T,
  error?: string,
  message?: string
}
```

### Error Handling
- Always validate input
- Return meaningful error messages
- Log errors to console in development
- Use try-catch for async operations

---

## Debugging Tips

### Frontend Issues
1. Check browser console for errors
2. Use React DevTools extension
3. Check network tab for API calls
4. Verify environment variables are set
5. Clear cache and rebuild: `npm run build`

### API Issues
1. Test endpoint with curl or Postman
2. Check request body format
3. Verify authentication token
4. Check API logs
5. Use debugger in VS Code

### Database Issues
1. Check Convex dashboard
2. Verify schema is correct
3. Check query syntax
4. Look for data type mismatches
5. Test with sample data

---

## Testing Checklist

Before marking a feature as complete:

- [ ] Component renders without errors
- [ ] All inputs validate correctly
- [ ] API returns expected response
- [ ] Data persists to database
- [ ] Error handling works
- [ ] Mobile responsive
- [ ] Theme toggle works
- [ ] No console errors
- [ ] TypeScript compiles without errors
- [ ] Build succeeds: `npm run build`

---

## Deployment Checklist

Before deploying to production:

- [ ] All tests pass
- [ ] No console errors
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] APIs tested in staging
- [ ] Payment webhook configured
- [ ] Email service configured
- [ ] Monitoring set up
- [ ] Backup strategy in place
- [ ] Rollback plan ready

---

## Resources & References

### Documentation
- Next.js: https://nextjs.org/docs
- Convex: https://docs.convex.dev
- Clerk: https://clerk.com/docs
- Tailwind CSS: https://tailwindcss.com/docs
- OpenAI: https://platform.openai.com/docs
- Paystack: https://paystack.com/docs

### Tools
- VS Code: https://code.visualstudio.com
- Postman: https://www.postman.com
- GitHub: https://github.com
- Vercel: https://vercel.com

### Community
- Next.js Discord: https://discord.gg/nextjs
- Convex Discord: https://discord.gg/convex
- Stack Overflow: https://stackoverflow.com

---

## FAQ

### Q: Where do I start if I'm new?
A: Read `PROJECT_DOCUMENTATION.md` first, then pick a task from `BACKEND_READINESS.md`.

### Q: How do I set up the development environment?
A: Follow the "Setting Up Development Environment" section in `PROJECT_DOCUMENTATION.md`.

### Q: What should I work on next?
A: Check `BACKEND_READINESS.md` for the priority list. Phase 1 (Convex implementation) is the highest priority.

### Q: How do I test my changes?
A: Run `npm run dev` and test in the browser. Use Postman for API testing.

### Q: How do I deploy?
A: The project is configured for Vercel. Push to GitHub and Vercel will auto-deploy.

### Q: Where are the API keys?
A: Create a `.env.local` file with the required variables (see `PROJECT_DOCUMENTATION.md`).

### Q: How do I debug an API route?
A: Add `console.log()` statements and check the terminal where `npm run dev` is running.

### Q: Can I modify the theme colors?
A: Yes, edit `lib/theme-context.tsx` to change the theme definitions.

### Q: How do I add a new page?
A: Create a new file in `app/` directory following the Next.js App Router convention.

### Q: Where do I add new components?
A: Create new files in `components/` directory and export them.

---

## Contact & Support

For questions about the project:
1. Check `PROJECT_DOCUMENTATION.md` for detailed information
2. Review `ROADMAP.md` for timeline and priorities
3. Consult `BACKEND_READINESS.md` for implementation details
4. Check GitHub issues for known problems
5. Review code comments for context

---

## Final Notes

This project is well-structured and ready for implementation. The frontend is complete, the APIs are scaffolded, and the database schema is defined. The next agent(s) should focus on:

1. **Implementing Convex backend** - This is the foundation
2. **Connecting API routes** - This brings data to the frontend
3. **Integrating OpenAI** - This powers the AI answering
4. **Implementing Paystack** - This enables monetization
5. **Testing and QA** - This ensures quality

Good luck with the project! Feel free to reference this document whenever you need guidance.

---

**Project Repository:** [onequestionspace/onequestion_space](https://github.com/onequestionspace/onequestion_space)

**Last Updated:** June 2, 2026  
**Next Review Date:** After Phase 1 completion
