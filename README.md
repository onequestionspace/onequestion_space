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
| Styling | Tailwind CSS + shadcn/ui |
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
├── (space)/[username]/   — public AI Q&A space
├── dashboard/            — user dashboard
│   ├── train/            — AI training chat
│   ├── knowledge/        — knowledge base manager
│   ├── analytics/        — real-time stats
│   ├── blogs/            — blog editor
│   └── settings/         — appearance + profile
├── blog/                 — Knowledge Explorer + blog
├── founding/             — founding members page
└── api/
    ├── ask/              — main AI answer route
    ├── knowledge/        — knowledge save + embed
    └── paystack/         — payments

convex/
├── schema.ts
├── profiles.ts
├── knowledge.ts
├── questions.ts
├── analytics.ts
├── blogs.ts
├── reactions.ts
├── founding.ts
└── subscriptions.ts
```

---

## Status

Actively building in public. Follow the journey on X → [@Asym_Alwali](https://x.com/Asym_Alwali)
