const fs = require('fs');

// ── 1. Space page — Twitter/Github/Linkedin renamed in lucide-react ──────────
let space = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');
space = space.replace(
  /Twitter/g, 'XIcon'
).replace(
  /Github/g, 'Github'
).replace(
  /Linkedin/g, 'Linkedin'
);
// Actually just replace the import line precisely
space = space.replace(
  /import \{([^}]*Twitter[^}]*)\} from 'lucide-react'/,
  (match, imports) => {
    const fixed = imports
      .replace('Twitter', 'XIcon')
      .replace('Github', 'GithubIcon')
      .replace('Linkedin', 'LinkedinIcon');
    return `import {${fixed}} from 'lucide-react'`;
  }
);
// Fix usage in JSX too
space = space
  .replace(/<Twitter /g, '<XIcon ')
  .replace(/<\/Twitter>/g, '</XIcon>')
  .replace(/<Github /g, '<GithubIcon ')
  .replace(/<\/Github>/g, '</GithubIcon>')
  .replace(/<Linkedin /g, '<LinkedinIcon ')
  .replace(/<\/Linkedin>/g, '</LinkedinIcon>');
fs.writeFileSync('app/(space)/[username]/page.tsx', space);
console.log('✓ Fixed space page icon imports');

// ── 2. Paystack verify route — cast string to union type ─────────────────────
let paystack = fs.readFileSync('app/api/paystack/verify/route.ts', 'utf8');
paystack = paystack.replace(
  /plan:\s*([^,}\n]+),/g,
  (match, val) => {
    if (val.includes(' as ')) return match;
    return `plan: ${val.trim()} as 'free' | 'starter' | 'pro' | 'business' | 'enterprise',`;
  }
);
fs.writeFileSync('app/api/paystack/verify/route.ts', paystack);
console.log('✓ Fixed paystack verify route type');

// ── 3. Onboarding — add type to val parameter ────────────────────────────────
let onboarding = fs.readFileSync('app/onboarding/page.tsx', 'utf8');
onboarding = onboarding.replace(
  /\(val\) =>/g,
  '(val: string) =>'
);
fs.writeFileSync('app/onboarding/page.tsx', onboarding);
console.log('✓ Fixed onboarding parameter type');

// ── 4. Hero.tsx — TYPING_PAIRS not defined ───────────────────────────────────
let hero = fs.readFileSync('components/Hero.tsx', 'utf8');
if (!hero.includes('TYPING_PAIRS')) {
  console.log('- Hero.tsx has no TYPING_PAIRS reference, skipping');
} else if (!hero.includes('const TYPING_PAIRS')) {
  // Add the constant before the component
  const pairs = `const TYPING_PAIRS = [
  { question: 'What services do you offer?', answer: 'I offer web development, design consulting, and technical mentorship.' },
  { question: 'How can I work with you?', answer: 'Book a call through my space and I will get back to you within 24 hours.' },
  { question: 'What is your tech stack?', answer: 'Next.js, TypeScript, Convex, and Tailwind CSS are my go-to tools.' },
];\n\n`;
  hero = hero.replace(
    /^(export default function Hero)/m,
    pairs + 'export default function Hero'
  );
  fs.writeFileSync('components/Hero.tsx', hero);
  console.log('✓ Fixed Hero.tsx TYPING_PAIRS');
} else {
  console.log('- Hero.tsx TYPING_PAIRS already defined');
}

console.log('\nDone. Run: npx next build --webpack');
