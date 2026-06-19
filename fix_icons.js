const fs = require('fs');

// ── 1. Fix space page icon imports ──────────────────────────────────────────
let space = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

space = space.replace(
  `import { Send, Brain, Sparkles, Copy, Check, XIcon, Github, Globe, Linkedin } from 'lucide-react';`,
  `import { Send, Brain, Sparkles, Copy, Check, XIcon, GitBranch, Globe, ExternalLink } from 'lucide-react';`
);

space = space.replace(/<Github/g, '<GitBranch').replace(/<\/Github>/g, '</GitBranch>');
space = space.replace(/<Linkedin/g, '<ExternalLink').replace(/<\/Linkedin>/g, '</ExternalLink>');

fs.writeFileSync('app/(space)/[username]/page.tsx', space);
console.log('✓ Fixed icon imports in space page');

// ── 2. Fix paystack verify type ──────────────────────────────────────────────
let paystack = fs.readFileSync('app/api/paystack/verify/route.ts', 'utf8');

paystack = paystack.replace(
  `await convex.mutation(api.subscriptions.updateSubscription, { userId, plan, status: 'active' });`,
  `await convex.mutation(api.subscriptions.updateSubscription, { userId, plan: plan as 'free' | 'starter' | 'pro' | 'business' | 'enterprise', status: 'active' });`
);

fs.writeFileSync('app/api/paystack/verify/route.ts', paystack);
console.log('✓ Fixed paystack type cast');

// ── 3. Fix Hero.tsx TYPING_PAIRS ─────────────────────────────────────────────
let hero = fs.readFileSync('components/Hero.tsx', 'utf8');

if (!hero.includes('const TYPING_PAIRS')) {
  const pairs = `const TYPING_PAIRS = [
  { question: 'What services do you offer?', answer: 'I offer web development, design consulting, and technical mentorship.' },
  { question: 'How can I work with you?', answer: 'Book a call through my space and I will get back to you within 24 hours.' },
  { question: 'What is your tech stack?', answer: 'Next.js, TypeScript, Convex, and Tailwind CSS are my go-to tools.' },
];\n\n`;
  hero = hero.replace(/^(export default function Hero)/m, pairs + 'export default function Hero');
  fs.writeFileSync('components/Hero.tsx', hero);
  console.log('✓ Fixed Hero.tsx TYPING_PAIRS');
} else {
  console.log('- Hero.tsx already has TYPING_PAIRS');
}

console.log('\nDone. Run: npx tsc --noEmit');
