# PROJECT CONTEXT

> Single source of truth for anyone (human or AI) working on this repo.
> Written 2026-10-03 after a full dead-code audit of the codebase.
> If this file disagrees with the code, **the code is right** — update this file.

---

## 1. What this is

**One Question** — a personal AI page that answers repetitive questions about a user,
their work, and expertise, 24/7. A user uploads knowledge, gets a public link, and shares it.

Live: [onequestion.space](https://onequestion.space) · Vercel auto-deploy from `main`.

- **Brand:** Chimera
- **Founder:** Asym Alwali · **Co-founder:** Muhammad Paraja
- **Origin:** built entirely from an Android phone via Termux. No laptop, ever.

---

## 2. Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js **16.2.9** (App Router) | **webpack only — Turbopack breaks on Android/Termux** |
| Backend | Convex 1.41 | real-time, `useQuery`/`useMutation` |
| Auth | Clerk 7.4 | `proxy.ts` middleware + `convex/auth.config.ts` |
| AI answers | Gemini 2.5 Flash | primary |
| AI fallback | Groq `llama-3.3-70b-versatile` | on Gemini rate-limit/empty |
| Embeddings | `gemini-embedding-001` | knowledge retrieval |
| Styling | Tailwind 3.4 | monochrome black/white with zinc neutrals |
| Payments | Paystack | USD→NGN conversion at runtime |
| Charts | Recharts 3.8 | analytics page |
| CI | GitHub Actions | lint + build + typecheck |

**Gemini and Groq are called over raw `fetch`.** The official SDKs were removed as unused
(commit `764ced2`). Do not re-add `@google/generative-ai`, `groq-sdk`, or `openai`.

---

## 3. Critical build constraints

1. **Always `--webpack`.** `npm run dev` / `npm run build` already bake it in. Do not switch to Turbopack.
2. **`next.config.js` sets `typescript.ignoreBuildErrors: true`.** The build will NOT fail on TS errors —
   `npx tsc --noEmit` is the only real type gate. Run it manually.
3. **Local builds fail without env vars.** Several routes do `new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)`
   at **module scope**. With no `.env`, `next build` dies at "Collecting page data" with
   `Client created with undefined deployment address`. This is environmental, not a code bug.
   To verify a build: `NEXT_PUBLIC_CONVEX_URL=https://example.convex.cloud npx next build --webpack`

### Environment variables

| Var | Used by |
|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk provider |
| `CLERK_SECRET_KEY` | Clerk server |
| `NEXT_PUBLIC_CONVEX_URL` | ConvexHttpClient in 13 modules |
| `CONVEX_DEPLOY_KEY` | Convex deploys |
| `GEMINI_API_KEY` | `lib/gemini.ts` + 6 API routes |
| `GROQ_API_KEY` | Groq fallback in `app/api/stream` |
| `PAYSTACK_SECRET_KEY` | Paystack initialize/verify/webhook in Next.js; also configure in Convex for server-side payment verification |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | billing page |
| `NEXT_PUBLIC_APP_URL` | Base URL for Clerk prospect invitations; defaults to `https://onequestion.space` in production |

No `.env` files are committed (gitignored via `.env*`).

---

## 4. Repo layout

```
app/
├── (public)/            → "/" , /blog, /pricing, /early, /founding, /waitlist,
│                          /features, /contact, /privacy, /terms, /sign-in, /sign-up
│                          └── layout.tsx  ← Navbar + Footer shell
├── (space)/[username]/  → public AI Q&A space (the product's core page)
├── dashboard/           → overview, knowledge, train, chat, inbox, analytics,
│                          blogs, studio, billing, settings, admin/prospects, tools/post-generator
├── onboarding, claim/[token], api/…
convex/                  → schema.ts + 16 function modules
components/              → marketing sections, dashboard/ (UI kit), motion/, ui/ (DELETED)
lib/                     → gemini, exchangeRate, payments/*, utils, validations
hooks/                   → useAuth (only hook that survived cleanup)
proxy.ts                 → Next 16 middleware (Clerk route protection)
```

**Route groups are stripped from URLs.** `app/(public)/page.tsx` *is* `/`. There is no `app/page.tsx`.
`app/space/`… does not exist — public spaces live at `/:username`.

### `proxy.ts` is not stray

Next 16 renamed `middleware.ts` → `proxy.ts`. It has **no importers** (the framework
auto-discovers it by filename) but **deleting it removes all Clerk route protection**:
dashboard auth, auth-page redirects, and `auth.protect()` on private routes.

---

## 5. Request flow (the core path)

```
Visitor opens /:username
  → app/(space)/[username]/page.tsx
  → POST /api/stream                     ← THE main answer route
      → gemini generateEmbeddings(question)
      → semantic match against previously answered questions
      → shared chunk-level semantic + lexical retrieval (`rankKnowledge`)
      → legacy whole-item knowledge uses lexical fallback until re-uploaded
      → Gemini 2.5 Flash (SSE stream)
      → fallback: Groq llama-3.3-70b on rate-limit / empty response
      → save question + answer, increment usage
  → page re-renders reactively via useQuery (no polling needed)
```

Knowledge upload: `POST /api/upload`, `/api/knowledge`, or `/api/knowledge/url`
→ paragraph-aware chunks → Gemini `RETRIEVAL_DOCUMENT` embeddings (768 dimensions)
→ Convex. Questions use `RETRIEVAL_QUERY` embeddings at the same dimension. The public
answer, dashboard chat, and inbox reuse semantic + lexical chunk ranking.

---

## 6. Live API routes (21)

| Route | Called by |
|---|---|
| `/api/stream` | space page — **primary answer route** |
| `/api/inbox/answer-all` | inbox — authenticated AI answers for pending questions |
| `/api/chat-knowledge` | dashboard/chat (SSE) |
| `/api/explore` | blog, privacy, terms, space page |
| `/api/knowledge` | onboarding, train, knowledge mgmt |
| `/api/knowledge/faq` | KnowledgeIntelligence |
| `/api/knowledge/url` | knowledge page (URL import) |
| `/api/upload` | studio, knowledge, AppearanceTab |
| `/api/avatar` | settings |
| `/api/check-username` | onboarding, settings |
| `/api/og-preview` | LinkPreviewCard |
| `/api/og/answer` | OG image, via `metadata` in space layout |
| `/api/paystack/{initialize,subscribe,verify}` | billing page |
| `/api/paystack/webhook` | **external** — Paystack servers |
| `/api/admin/prospects/*` | Admin-only knowledge embedding, answer testing, and Clerk invitations |
| `/api/waitlist` | `/waitlist` signup page |
| `/api/well-known` | **external** — `vercel.json` rewrite for Apple Pay |
| `/api/profile` | early, founding pages |
| `/api/tools/post-generator` | tools page |
| `/api/admin/seed-profile` | **manual ops** — curl + `x-admin-secret` |

---

## 7. Convex modules (14 live)

`schema.ts` defines 15 tables: `profiles, knowledge, questions, analytics,
subscriptions, paidTransactions, prospects, blogs, reactions, founding, earlyAdopters, pageviews, events,
waitlist, chats, chat_messages`.

| Module | Role |
|---|---|
| `profiles.ts` | profile CRUD, `current`, `byUsername` — the hot path |
| `knowledge.ts` | knowledge CRUD + embeddings |
| `questions.ts` | Q&A records, `listNeedsReview`, `resolveQuestion` |
| `knowledgeHealth.ts` | health, gaps, coverage score (powers KnowledgeIntelligence) |
| `siteAnalytics.ts` | `trackPageview`, site stats, user activity |
| `analytics.ts` | per-profile counters |
| `subscriptions.ts` | plan state, answer usage, and Paystack-verified Pro/credit application |
| `admin.ts` | admin-gated user/analytics queries and credit grants |
| `blogs.ts`, `chats.ts`, `reactions.ts`, `founding.ts`, `earlyAdopters.ts`, `waitlist.ts` | feature modules |

`/dashboard/admin/prospects` is the admin sales setup flow: create a reserved
page and claim token, add text/Markdown knowledge with Gemini document
embeddings, test retrieval and answers without consuming a visitor quota, and
send a Clerk invitation. Recipients create or sign in to their own Clerk
account; claiming requires the invited email address to match. Claiming transfers
the page's knowledge records to the new account. Enable Clerk invitation emails
and allow the production `/claim/*` redirect URL in the Clerk dashboard.

`convex/migrations.ts` — single `internalMutation` `remapClerkUser`. Not called from code;
run manually from the Convex dashboard after a Clerk account migration. Keep.
It does **not** use `@convex-dev/migrations`; that component is not installed.

`convex/_generated/` is **generated code, but it IS committed — and must stay that way.**
59 source files import `@/convex/_generated/api`. Vercel builds from a fresh clone and
never runs `convex dev`, so codegen does not run there. Untracking these files breaks the
entire production build (`Module not found: Can't resolve '@/convex/_generated/api'`) —
this happened in `764ced2` and was reverted in `d3a1270`. There is no `.gitignore`
entry for this path, deliberately.

Do not hand-edit these files; run `npx convex dev` locally and commit the result.
Read `convex/_generated/ai/guidelines.md` before writing Convex code.

---

## 8. Component layout

- **Marketing** (`components/*.tsx`) — sections of the landing page.
- **UI kit** (`components/dashboard/`) — `Button, Card, Input, Badge, Avatar, Toast,
  Skeleton, EmptyState` + `StatsCard`, `ProgressBar`, `useToast`. **This is the live kit.**
- `components/motion/` — only `AnimatedCounter` and `FadeIn` are used.
- `components/ui/` was **deleted** in `764ced2` (shadcn output, fully superseded by
  `components/dashboard/`). `components.json` still points shadcn at `@/components/ui`
  if you ever run `shadcn add` again.

Import components by deep path (`@/components/dashboard/Button`). Barrel files were removed
because all 60+ call sites used deep imports anyway.

---

## 9. Known bugs and risks (unfixed — flagged, not addressed)

Ordered by severity.

### 9.1 Orphaned CSS class `.dot-pattern`

Referenced by 6 TSX files but **no longer defined** in `app/globals.css`
(lost in an earlier globals.css rewrite). Those elements render with no background.

### 9.2 Dead code inside kept files

- `app/dashboard/admin/page.tsx` — `userActivity` query result is unused; the selected-user drawer JSX was removed.
- `lib/validations.ts` — 9 exports exist, only **`validateEmail`** is used (by `/api/waitlist`).
  Dead: `validateUsername`, `validatePassword`, `validateQuestion`,
  `validateKnowledgeTitle`, `validateKnowledgeContent`, `validateFile`,
  `validateDisplayName`, `validateBio`. Note `validateQuestion` lost its last caller
  when `/api/ask` was deleted.
- `lib/utils.ts` — `formatDateTime` uncalled.
- `lib/payments/stripe.ts` — imported by the adapter barrel, but `paymentProvider` is
  `PaystackAdapter`, so every method is an unreachable `throw`. Placeholder only.
- Unreferenced Convex functions: `admin.getAllProfiles`, `analytics.updateAnalytics`,
  `chats.getChatById`, `earlyAdopters.getEarlyAdopters`, `knowledge.getKnowledge`,
  `knowledge.updateKnowledge`, `knowledgeHealth.analyzeKnowledge`, `questions.deleteQuestion`,
  `siteAnalytics.trackEvent`, `subscriptions.cancelSubscription`,
  `waitlist.getWaitlistCount`.

### 9.3 README drift

`README.md:35` claims "Tailwind CSS + shadcn/ui" — shadcn output was deleted (§8).
`README.md` project-structure block still lists `api/ask/` and omits `(space)`.
`docs/project/ROADMAP.md:274` documents `POST /api/ask` as a live endpoint.

### 9.4 npm audit

18 vulnerabilities (1 low, 1 moderate, 15 high, 1 critical) as of the last install.
Not triaged.

---

## 10. Conventions

- **Monochrome light UI**: white surfaces, black primary actions, zinc neutrals, and thin borders.
  Keep dashboard, public pages, analytics, and billing free of colorful accents and gradients.
- **Pro** is $9/month and includes 500 answers per month, detailed analytics, and no OneQuestion
  branding. Free includes 50 answers per month. Payment application must only follow Paystack
  server-side verification; configure `PAYSTACK_SECRET_KEY` in both Vercel and Convex.
- Styling is **inline Tailwind classes**, not CSS modules.
- Animations use `components/motion/FadeIn` (IntersectionObserver), **not** framer-motion —
  it was removed for mobile stability. Several files still carry a
  `// framer-motion removed for mobile stability` comment marking where it used to be.
- AI calls: raw `fetch`, Gemini first, Groq fallback on rate-limit/empty.
- Commit style: lowercase imperative, optional `feat:`/`fix:`/`chore:` prefix.
  Example: `fix: Groq fallback reliability, full answer saved after stream`.
- CI enforces ESLint, `next build`, and `tsc --noEmit`. All three must pass.
  ESLint currently has **30 pre-existing errors** (mostly `react-hooks/set-state-in-effect`)
  that CI tolerates — do not add new ones.

---

## 11. Cleanup history

Commit `764ced2` (2026-10-03) removed 69 dead files and 12 unused deps (398 packages):

- **28 one-off root `fix*.js` / `gen_inbox.js` migration scripts.** All changes already applied.
  Four were *dangerous* to re-run: `fix_analytics_schema.js` (duplicate Convex tables → deploy
  failure), `gen_inbox.js` (destroyed ~170 lines of Inbox), `fix_analytics.js` (corrupted CSV
  export line breaks), `fix_jsx2.js` (reintroduced unbalanced JSX).
- Duplicates: `HowItWorks`→`HowItWorksSection`, `lib/paystack.ts`→`lib/payments/paystack.ts`,
  `StatsBar`/`ProfileDropdown` (already inlined in `Hero`/`Navbar`),
  and a byte-identical Apple Pay domain-association file in `public/`.
- REST wrappers superseded by direct Convex queries: `analytics`, `knowledge/{coverage,gaps,health}`,
  `subscription`, `events`.
- ~~`convex/_generated/` untracked~~ — **this was wrong and broke the Vercel build.**
  Reverted in `d3a1270`; the files must remain tracked. `.gitignore` deduplicated.

**Lesson for contributors:** this repo accumulated 28 ad-hoc root-level patch scripts. Prefer
normal commits. If you must script a migration, put it in a branch you delete, never at repo root.

---

## 12. Working rules for AI agents

1. Read `convex/_generated/ai/guidelines.md` before writing any Convex code.
2. Run `npx tsc --noEmit` — the Next build will not catch type errors.
3. Verify builds with `NEXT_PUBLIC_CONVEX_URL=https://example.convex.cloud npx next build --webpack`.
4. Never commit `.next/`, `tsconfig.tsbuildinfo`, or `.env*`.
   `convex/_generated/` **is** committed — see §7 before touching it.
5. **Verify changes the way Vercel does:** clone the repo to a scratch directory, `npm ci`,
   then build. A build on your working tree can pass while a fresh checkout fails, because
   generated or untracked files on your disk are absent from the clone. This is exactly how
   `764ced2` shipped a broken build.
6. Before deleting a file, confirm **zero** references — including string literals in
   `proxy.ts`, `vercel.json`, `next.config.js`, and `components.json`. Several "unused"
   things here are loaded by framework convention (`proxy.ts`) or called externally
   (`/api/paystack/webhook`, `/api/well-known`).
7. Keep the `components/dashboard/` kit as the single UI primitive source.