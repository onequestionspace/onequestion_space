import { ConvexHttpClient } from "convex/browser";

const client = new ConvexHttpClient("https://confident-orca-149.convex.cloud");

const USER_ID = "user_3Fmuk2jHEa5seXKEzewhWlA9yQs";

const knowledge = [
  {
    title: "Who is Asym Alwali",
    content: "I am Asym Alwali, a 19-year-old software developer and founder from Yobe State, Nigeria. I am building One Question entirely from an Android phone using Termux — no laptop, no funding, just obsession and late nights. I am documenting the journey of building from $0 to $10k MRR in public on X at @Asym_Alwali. I study Computer Science and believe that constraints force better decisions and faster shipping.",
  },
  {
    title: "What is One Question",
    content: "One Question is an AI-powered personal Q&A platform. You claim a username, upload your knowledge, and your AI answers every visitor question instantly in your voice — 24/7. It is like having a personal assistant that knows everything about you and never sleeps. The idea came from me being tired of answering the same questions over and over. Built with Next.js, Convex, Clerk, and Gemini AI — all from an Android phone.",
  },
  {
    title: "How to work with Asym",
    content: "If you want to collaborate, partner, or work with me, the best way is to reach out on X at @Asym_Alwali or send an email to hello@onequestion.space. I am open to partnerships, integrations, feedback, and building in public together. I respond fast — usually within 24 hours.",
  },
  {
    title: "How Asym builds from a phone",
    content: "I use Termux on Android — a Linux terminal emulator for Android. My entire stack runs from there: Node.js, Git, npm, the Convex CLI, and Next.js builds. I push to GitHub and Vercel deploys automatically. The phone constraint has actually made me a better developer — I think more carefully before writing code because debugging on a phone is painful. My setup: Samsung Android phone, Termux, Vim/nano for editing, Claude AI for pair programming.",
  },
  {
    title: "Asym tech stack",
    content: "I build with Next.js 16, Convex real-time database, Clerk for auth, Tailwind CSS, shadcn/ui components, Gemini 2.5 Flash for AI responses, and Vercel for deployment. Everything is built and deployed from an Android phone using Termux. The entire codebase is open source at github.com/onequestionspace/onequestion_space.",
  },
  {
    title: "One Question pricing",
    content: "One Question has a free plan with 50 AI answers per month — no credit card required, no expiry. The Pro plan is $9 per month and includes 500 AI answers, advanced analytics, priority AI processing, and the ability to remove One Question branding. You can also buy extra credits anytime. The $9 price covers Gemini API costs, Convex, and Vercel — it is not a VC-inflated number, it is what makes sense.",
  },
  {
    title: "Asym background and story",
    content: "I grew up in Yobe State, Nigeria. I started coding at 16 and have been obsessed ever since. Building One Question from a phone is both a constraint and a statement — if I can ship a full SaaS from a phone in Nigeria, anyone can build anything anywhere. I share my full journey — wins, losses, revenue numbers, technical decisions — publicly on X and on my Substack newsletter Broke and Building at brokeandbuilding.substack.com.",
  },
  {
    title: "How to claim a One Question space",
    content: "Go to onequestion.space, type your username in the hero input, and click Claim your space free. You will be taken through a quick onboarding — pick your username, set your display name, write your bio, and add a welcome message. Then go to Space Studio to customize your space further. The whole process takes about 2 minutes and the free plan never expires.",
  },
];

async function seed() {
  console.log("Seeding knowledge for user:", USER_ID);
  for (const item of knowledge) {
    try {
      await client.mutation("knowledge:createKnowledge", {
        userId: USER_ID,
        title: item.title,
        content: item.content,
      });
      console.log("Added:", item.title);
    } catch (e) {
      console.error("Failed:", item.title, e.message);
    }
  }
  console.log("Done!");
}

seed();
