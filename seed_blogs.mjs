import { ConvexHttpClient } from "convex/browser";

const client = new ConvexHttpClient("https://confident-orca-149.convex.cloud");

const blogs = [
  {
    title: "I Built a SaaS From a Phone. Here's What Nobody Tells You.",
    slug: "built-saas-from-phone",
    excerpt: "No laptop. No funding. No excuses. The real story of building One Question from Termux on Android in Nigeria.",
    content: `When I tell people I built One Question entirely from an Android phone, they usually say one of two things: "That's impressive" or "That's impossible."

Both reactions miss the point.

I didn't build from a phone because I wanted to be impressive. I built from a phone because it was the only computer I had. And that constraint — that single, annoying, liberating constraint — changed everything about how I build.

## The Setup

My entire development environment runs in Termux — a Linux terminal emulator for Android. Node.js, Git, npm, the Convex CLI, Next.js builds. All of it. I type with my thumbs on a screen that's cracked in one corner.

When I push to GitHub, Vercel deploys automatically. When I need to debug, I scroll through terminal output on a 6.5-inch screen. When I make a mistake, fixing it costs more than it would on a laptop — so I think harder before I write.

That's the secret nobody tells you about constraints: they don't just limit you. They clarify you.

## What Constraints Actually Do

Every developer I know who has "everything" — MacBook Pro, dual monitors, fast internet, funded startup — ships slower than they should. Not because they're lazy. Because abundance creates optionality, and optionality creates paralysis.

When I'm deciding whether to add a feature, I don't ask "can I?" I ask "is this worth debugging on a phone?" That filter alone has saved me from building dozens of things that didn't matter.

Constraints force you to:
- Ship the minimum thing that works, not the perfect thing you imagined
- Think before you type, not type then think
- Prioritize ruthlessly because you can't afford not to
- Find creative solutions instead of throwing compute at problems

## The Real Lesson

The phone is not the point. The constraint is the point.

If you're waiting for better conditions to start building — a faster computer, more funding, a co-founder, the right time — you're using "preparation" as a way to avoid the terror of actually starting.

The conditions will never be perfect. The phone I'm using right now is cracked. The internet cuts out. The terminal crashes.

I ship anyway.

That's the only difference between people who build things and people who talk about building things.

If you're a developer in Africa, or anywhere with limited resources, I want you to know: your constraint is not your problem. Your hesitation is.

Start. Ship. Learn. Repeat.

The rest figures itself out.`,
    tags: ["building", "constraints", "indie hacking", "africa"],
    author: "Asym Alwali",
    published: true,
  },
  {
    title: "Why I'm Building One Question in Public (And Why You Should Too)",
    slug: "building-in-public-why",
    excerpt: "Transparency is a competitive advantage. Here's why I share everything — revenue, failures, user counts — and what it has done for One Question.",
    content: `I share my revenue numbers publicly. I post when features break. I talk about my user count even when it's embarrassing.

Most founders think this is crazy. I think the alternative is crazier.

## What Building in Public Actually Means

Building in public is not posting highlight reels on LinkedIn. It's not performance. It's a commitment to sharing the real process — including the parts that make you look like you don't know what you're doing.

For One Question, building in public means:
- Posting daily updates on X at @Asym_Alwali
- Writing honest essays on my Substack, Broke & Building
- Sharing what's working and what's failing in equal measure
- Letting users see behind the product

## The Unexpected Benefits

I started building in public because I thought it would attract users. That happened. But the real benefits were things I didn't expect.

**Accountability.** When you tell 500 people you're going to ship something this week, you ship it. There's no hiding. The public commitment is more powerful than any productivity system.

**Feedback loops.** Users who find you through building in public are invested in your success. They tell you what's broken. They suggest features. They defend you when critics show up.

**Distribution.** Every honest post about the journey is content that compounds. A post about debugging at 2am on a phone gets more engagement than any feature announcement. People connect with struggle.

**Clarity.** Writing about what you're building forces you to understand what you're building. I've caught bad decisions just by trying to explain them in a tweet.

## The Fear Is Real But Wrong

The fear with building in public is that competitors will copy you. That investors won't take you seriously. That people will judge you for your early numbers.

Here's the reality: your competitors are not watching your tweets. Your early numbers don't matter because no one remembers them when you succeed. And the people who judge you for sharing honestly are not the people who will ever help you.

The founder who ships in private and the founder who ships in public are building different things. The private founder is building a product. The public founder is building a product and an audience simultaneously.

Guess which one has an easier time when it's time to launch.

## Start Today

You don't need a big following to build in public. You need a commitment to honesty.

Post about what you're building. Share the problem you're solving. Document the process even when — especially when — it's messy.

The audience finds the honest ones. Always.`,
    tags: ["building in public", "startup", "transparency", "indie hacking"],
    author: "Asym Alwali",
    published: true,
  },
  {
    title: "The $0 to $10k MRR Roadmap I'm Actually Following",
    slug: "zero-to-10k-mrr-roadmap",
    excerpt: "Not a theory. Not a framework. The actual steps I'm taking to grow One Question from nothing to $10,000 in monthly recurring revenue — from a phone in Nigeria.",
    content: `Everyone has a $0 to $10k MRR framework. Most of them are written by people who either never did it or did it with funding and a team.

This is mine. Written as I'm doing it. From a phone. In real time.

## The Actual Starting Point

One Question launched with zero users, zero revenue, and zero marketing budget. I had a product that worked, a belief that the problem was real, and a phone with Termux.

That's it. That's the starting point.

## Phase 1: Make Something That Works (Done)

Before you can sell anything, it has to work. Not perfectly — just reliably enough that someone can use it and get value.

For One Question, this meant:
- A working space page where visitors can ask questions
- An AI that actually answers in the space owner's voice
- A dashboard that shows what's happening
- An onboarding flow that gets new users to their first AI answer

This phase is mostly technical. The goal is not growth. The goal is making something you're not embarrassed to show people.

## Phase 2: Find the First 10 Paying Users (Current)

The jump from free to paid is the hardest in any SaaS. People love free. Getting them to pay requires either massive value or a problem painful enough that they're already spending money somewhere else.

My approach:
- Build in public so people find me organically
- DM the people who engage with my posts and offer them a Pro trial
- Ask every free user personally: what would make this worth $9/month to you?
- Fix the things they say. Ask again.

The goal is not to find 10 random people willing to pay $9. It's to find 10 people for whom One Question solves a real problem — then understand that problem deeply enough to find 100 more like them.

## Phase 3: Find the Channel That Works (Upcoming)

At some point, you can't DM your way to $10k MRR. You need a repeatable channel.

For One Question, I'm betting on:
- Building in public on X as the primary acquisition channel
- Broke & Building newsletter as the nurture channel
- The product itself as a viral loop — every space page is marketing

## The Number That Actually Matters

$10k MRR at $9/month is 1,112 paying users.

That sounds like a lot until you realize the internet has billions of people who answer questions for free every day. One Question doesn't need the whole internet. It needs 1,112 people who value their time enough to pay $9 to stop answering the same questions.

Those people exist. Finding them is the job.

## What I'm Not Doing

No paid ads. No growth hacking. No fake social proof. No inflated metrics.

Just: build something real, tell the truth about it, make it better every day, and trust that the right people will find it.

That's the roadmap. I'll keep posting the real numbers as they happen.`,
    tags: ["mrr", "revenue", "startup", "growth", "bootstrapping"],
    author: "Asym Alwali",
    published: true,
  },
  {
    title: "How AI Changed What It Means to Build Alone",
    slug: "ai-changed-solo-building",
    excerpt: "I'm a solo founder building a full SaaS from a phone. Without AI tools, this would be impossible. Here's how Claude, Gemini, and others have become my co-founders.",
    content: `I am a team of one. Building a full SaaS — frontend, backend, AI integration, design, marketing, customer support — alone, from a phone.

Without AI tools, this would not be possible. Not hard. Not slow. Not possible.

## The Old World of Solo Building

Five years ago, a solo founder building a SaaS had real limits. You could build the backend OR the frontend well, but not both. You could write code OR write marketing copy, but doing both at a high level was rare. You could ship fast OR ship polished, but rarely both.

These limits are why "you need a co-founder" was gospel in startup culture for decades. The logic was right for its time: one person can't do everything well.

## What Changed

AI tools — specifically large language models — changed the equation. Not by replacing developers. By eliminating the skill gaps that made solo building so hard.

I use Claude as my primary pair programmer. When I'm stuck on a problem, I describe it and get a working solution in seconds. When I'm not sure about an architecture decision, I think through it with Claude. When a component has a bug I can't find on my phone's tiny screen, Claude finds it.

The result is that my effective output is 3-4x what it would be without AI assistance. I ship features in hours that would have taken days. I write marketing copy in minutes that would have taken hours.

## What AI Can't Do

AI can write code. It cannot decide what to build.

AI can debug a component. It cannot understand why users are churning.

AI can generate marketing copy. It cannot build the trust that makes people buy.

The highest-value work in building a product — deciding what matters, understanding users deeply, building relationships, making judgment calls under uncertainty — is still fully human. AI makes the execution faster. It doesn't replace the strategic thinking.

This is actually good news for solo founders. The things AI can't do are the things that differentiate great products from mediocre ones. If you're good at understanding people and making product decisions, AI amplifies your advantage.

## The New Solo Founder

The solo founders who will win in the AI era are not the best coders. They're the best product thinkers who can use AI to close their skill gaps.

I'm not the best frontend developer. Claude helps me ship good frontend work.
I'm not a designer. AI tools help me make design decisions faster.
I'm not a copywriter. AI helps me write first drafts I can refine.

What I am is someone who understands the problem I'm solving and cares deeply about the users I'm building for. AI handles the rest.

If you're a solo founder feeling overwhelmed by everything you need to learn and do — the tools exist now to make it possible. Not easy. Possible.

That's enough to start.`,
    tags: ["ai", "solo founder", "building", "tools", "productivity"],
    author: "Asym Alwali",
    published: true,
  },
  {
    title: "What One Question Is Really For (And Who It's Not For)",
    slug: "what-one-question-is-really-for",
    excerpt: "One Question is not for everyone. Here's exactly who it's built for, what problem it solves, and why I built it the way I did.",
    content: `Every product needs to be honest about who it's for. Most products aren't.

They say "anyone who wants to save time" or "professionals who value efficiency" — which means nothing and targets no one.

One Question is for a specific person with a specific problem. Let me be exact.

## The Person One Question Is For

You are someone people ask questions. A lot of questions. The same questions, repeatedly.

Maybe you're a founder and everyone asks how to work with you, what you charge, what your background is.

Maybe you're a creator and your DMs are full of "what camera do you use" and "how did you get started."

Maybe you're a coach and every discovery call covers the same ground because people don't know enough about you to know if you're right for them.

Maybe you're a developer and colleagues keep asking you the same technical questions.

The common thread: you have knowledge that people want, you're spending time sharing it one person at a time, and you're tired.

## The Problem It Solves

The problem is not "I get too many messages." The problem is that you're spending real time — hours per week — on answers that don't change. Your answer to "what do you charge?" is the same whether you give it to the first person who asks or the thousandth.

One Question lets you answer once. Your AI answers forever — in your voice, 24/7, without you being involved.

It's not a chatbot. It's not a FAQ page. It's an AI that sounds like you because you trained it on your actual knowledge, your actual words, your actual story.

## Who It's Not For

One Question is not for businesses that need enterprise AI solutions with complex workflows and integrations. There are better tools for that.

It's not for people who want to hide behind an AI. The whole point is that your AI sounds like you — it enhances your presence, it doesn't replace it.

It's not for people who don't actually get asked questions. If your inbox is quiet and your DMs are empty, the problem One Question solves doesn't exist for you yet.

## Why I Built It This Way

I built One Question for creators, founders, and knowledge workers because that's the world I live in. I'm a founder who gets asked the same questions constantly. I built the solution I needed.

The product is opinionated because I am opinionated. I believe your AI should sound like you — not like a corporate chatbot. I believe the interface should feel personal — not like enterprise software. I believe pricing should be honest — not designed to confuse you into a higher tier.

These decisions make One Question wrong for some people and exactly right for others.

If you recognize yourself in the person I described — someone with knowledge, someone who gets asked, someone who's tired of repeating themselves — One Question was built for you.

Claim your space. Upload what you know. Let AI handle the rest.`,
    tags: ["product", "positioning", "one question", "founder"],
    author: "Asym Alwali",
    published: true,
  },
];

async function seed() {
  console.log("Seeding blogs...");
  for (const blog of blogs) {
    try {
      await client.mutation("blogs:createBlog", blog);
      console.log("✓", blog.title);
    } catch (e) {
      console.error("✗", blog.title, e.message);
    }
  }
  console.log("Done! Total:", blogs.length);
}

seed();
