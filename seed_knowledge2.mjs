import { ConvexHttpClient } from "convex/browser";

const client = new ConvexHttpClient("https://confident-orca-149.convex.cloud");
const USER_ID = "user_3Fmuk2jHEa5seXKEzewhWlA9yQs";

const knowledge = [
  {
    title: "Broke & Building Substack",
    content: "I run a Substack newsletter called Broke & Building at brokeandbuilding.substack.com. It is about building startups under extreme constraints — no laptop, no funding, limited internet, building from a phone in Nigeria. The niche is constraints and startup building. I write honestly about what is working, what is not, revenue numbers, technical decisions, and the mental side of building alone. If you want to follow the real journey of building One Question from $0 to $10k MRR, subscribe at brokeandbuilding.substack.com.",
  },
  {
    title: "What Broke and Building is about",
    content: "Broke and Building is my personal journal of building a SaaS startup from scratch with almost nothing. The core theme is constraints — how building under constraints like no laptop, no funding, slow internet, and being 19 in Nigeria actually forces better decisions and faster shipping. I cover topics like bootstrapping, indie hacking, building in public, shipping fast, staying focused, and the reality of startup life that most founders don't talk about. Every issue is honest, specific, and based on real experience not theory.",
  },
  {
    title: "Why constraints make better founders",
    content: "I believe constraints are a superpower. When you have no laptop, you think harder before writing code because debugging on a phone is painful. When you have no funding, you focus on what actually matters — getting users and making money. When you are in Nigeria with slow internet, you build leaner products. Every constraint I have has forced me to be more deliberate, more creative, and more resourceful. The founders I respect most built something real before they had resources — not after. Constraints filter out people who are not serious.",
  },
  {
    title: "Building in public philosophy",
    content: "I share everything publicly — revenue numbers, user counts, technical failures, wins, and doubts. Building in public keeps me accountable, attracts early users who believe in the mission, and creates a story that people want to follow. The Nigerian tech ecosystem needs more founders who build in public so others can see it is possible and learn from real experience. I post daily updates on X at @Asym_Alwali and longer essays on Broke and Building. Transparency is a competitive advantage not a risk.",
  },
  {
    title: "Advice for young African developers",
    content: "If you are a young developer in Africa trying to build something, my advice is: start with what you have right now. Do not wait for a laptop, funding, a co-founder, or perfect conditions. I started One Question with a phone and Termux. The constraint is not your problem — your hesitation is. Ship something small, talk to users, charge money early, and build in public so people can find you. The global market does not care where you are from — it cares what you built. Nigeria, Kenya, Ghana — we are building the future from here.",
  },
  {
    title: "Asym daily routine and work style",
    content: "I wake up early and write first — either a Substack post, a tweet thread, or product notes. Then I code for several hours, usually working on One Question features or bug fixes. I use Claude AI as a pair programmer which has dramatically increased my shipping speed. I test everything on my phone since that is my only device. I push to GitHub and Vercel deploys. Evening is for responding to users, checking analytics, and planning the next day. I try to ship something every single day — even if it is small. Momentum is everything when you are building alone.",
  },
  {
    title: "One Question goals and vision",
    content: "My goal for One Question is to reach $10k MRR while building entirely from a phone in Nigeria — and to document every step publicly. The bigger vision is to make it the default personal AI page for creators, founders, and knowledge workers who are tired of answering the same questions. I want One Question to be what Linktree was for links — but for AI-powered knowledge sharing. Long term, I want to build a company from Nigeria that competes globally, proving that geography is not destiny.",
  },
  {
    title: "Asym thoughts on Nigerian tech scene",
    content: "Nigeria has incredible developer talent but not enough builders who ship products and charge for them. Most developers here are looking for remote jobs rather than building their own products. I respect that — the economic reality makes it rational. But I think there is a massive opportunity for Nigerian founders who are willing to build in public, target global markets, and use AI tools to compete with much larger teams. The next generation of African founders will not wait for permission or resources. One Question is my attempt to be part of that generation.",
  },
  {
    title: "How to subscribe to Broke and Building",
    content: "You can subscribe to my Substack newsletter Broke and Building at brokeandbuilding.substack.com. It is free to subscribe. I write about constraints, startup building, building in public, and the real journey of building One Question from a phone in Nigeria. New issues come out regularly. You can also follow me on X at @Asym_Alwali for daily updates and behind the scenes posts.",
  },
];

async function seed() {
  console.log("Seeding Broke & Building knowledge...");
  for (const item of knowledge) {
    try {
      await client.mutation("knowledge:createKnowledge", {
        userId: USER_ID,
        title: item.title,
        content: item.content,
      });
      console.log("✓", item.title);
    } catch (e) {
      console.error("✗", item.title, e.message);
    }
  }
  console.log("Done! Total added:", knowledge.length);
}

seed();
