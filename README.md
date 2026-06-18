# One Question

"Your knowledge. Your answers. Your space."

One Question is a platform where anyone creates their own AI-powered Q&A page. Users upload knowledge once, and AI answers visitor questions using that knowledge.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Convex
- Clerk
- OpenAI
- Paystack
- Vercel
- GitHub
- shadcn/ui

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/onequestionspace/stackblitz-starters-cnscawrq.git one-question
    cd one-question
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env.local` file in the root of your project and add the following:

    ```
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
    CLERK_SECRET_KEY=sk_test_...
    
    CONVEX_DEPLOYMENT_URL=https://...
    
    OPENAI_API_KEY=sk-...
    
    PAYSTACK_SECRET_KEY=sk_test_...
    NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
app/
├── dashboard/
│   ├── page.tsx
│   ├── knowledge/page.tsx
│   ├── analytics/page.tsx
│   ├── billing/page.tsx
│   └── settings/page.tsx
├── pricing/page.tsx
├── waitlist/page.tsx
├── [username]/page.tsx
└── api/
    ├── ask/route.ts
    ├── upload/route.ts
    ├── waitlist/route.ts
    └── paystack/
        ├── initialize/route.ts
        ├── verify/route.ts
        └── webhook/route.ts

components/
├── AskForm.tsx
├── AnswerFeed.tsx
├── ShareCard.tsx
├── Navbar.tsx
├── Footer.tsx
├── UploadKnowledge.tsx
└── ui/

convex/
├── schema.ts
├── profiles.ts
├── questions.ts
├── knowledge.ts
├── analytics.ts
└── subscriptions.ts

lib/
├── openai.ts
├── paystack.ts
├── clerk.ts
├── utils.ts
└── validations.ts

hooks/
types/
constants/
```

## Contributing

TODO: Add contributing guidelines.

## License

TODO: Add license information.

