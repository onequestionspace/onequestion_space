# One Question

> Your AI. Your answers. Always on.

**One Question** is an AI-powered personal Q&A platform. Claim a username, upload your knowledge once, and let AI answer every visitor question instantly — in your voice, 24/7.

Built entirely from an Android phone using Termux. No laptop. No office. Just constraints and shipping.

→ **Live:** [onequestion.space](https://onequestion.space)  
→ **Founder:** [@Asym_Alwali](https://x.com/Asym_Alwali) · Yobe, Nigeria  
→ **Co-founder:** [@MuhammadParaja](https://x.com/MuhammadParaja)  
→ **Brand:** Chimera

---

## What it does

1. You claim `onequestion.space/yourname`
2. You upload your knowledge — bio, FAQs, projects, services
3. Visitors ask questions
4. AI answers instantly using your knowledge, in your voice
5. You never have to answer the same question twice

---

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | Next.js 16 (webpack — Turbopack breaks on Android) |
| Database | Convex (real-time) |
| Auth | Clerk |
| AI Answers | Gemini 2.5 Flash |
| Embeddings | Gemini Embedding 001 (3072 dims) |
| Styling | Tailwind CSS + custom `components/dashboard/` kit |
| Payments | Paystack |
| Deployment | Vercel |

---

## Running locally

```bash
git clone https://github.com/onequestionspace/onequestion_space.git
cd onequestion_space
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CONVEX_URL=https://...
CONVEX_DEPLOY_KEY=...
GEMINI_API_KEY=...
PAYSTACK_SECRET_KEY=sk_...
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_...
```

```bash
npx convex dev --once
npx next dev --webpack --port 3000
```

> Note: always use `--webpack`. Turbopack is not supported on Android/Termux.

---

## Build constraints

This project is built 100% from a phone:

- **Device:** Android (Termux)
- **No laptop** — ever
- **Internet:** Starlink data bundles, Yobe Nigeria
- **CI:** GitHub Actions catches TypeScript errors before they hit production
- **Deploy:** push to main → Vercel auto-deploys

Constraints force better decisions. Shipping beats perfection.

---

## Project structure

```
app/
├── (public)/             — "/", blog, pricing, early, founding, features,
│                           contact, privacy, terms, sign-in, sign-up
├── (space)/[username]/   — public AI Q&A space
├── dashboard/            — overview, knowledge, train, chat, inbox, analytics,
│                           blogs, studio, billing, settings, admin,
│                           tools/post-generator
├── onboarding/           — new-user flow
└── api/                  — stream (main answer route), chat-knowledge,
                            knowledge, upload, paystack, og, explore, …

convex/
├── schema.ts             — 15 tables
├── profiles.ts           — profile CRUD (hot path)
├── knowledge.ts          — knowledge + embeddings
├── questions.ts          — Q&A records, needs-review queue
├── knowledgeHealth.ts    — health, gaps, coverage
├── siteAnalytics.ts      — pageviews, site stats
├── analytics.ts          — per-profile counters
├── subscriptions.ts      — plans + usage
├── admin.ts, blogs.ts, chats.ts, reactions.ts,
├── founding.ts, earlyAdopters.ts, waitlist.ts, migrations.ts

components/dashboard/     — UI kit (Button, Card, Input, Badge, Toast, …)
lib/gemini.ts             — Gemini + Groq, both via raw fetch
lib/payments/             — Paystack adapter
proxy.ts                  — Next 16 middleware (Clerk route protection)
```

> Full architecture, request flow, and known issues: **[PROJECT_CONTEXT.md](PROJECT_CONTEXT.md)**

---

## Status

Actively building in public. Follow the journey on X → [@Asym_Alwali](https://x.com/Asym_Alwali)
