const fs = require('fs');

let hero = fs.readFileSync('components/Hero.tsx', 'utf8');

if (!hero.includes('const TYPING_PAIRS')) {
  const pairs = `const TYPING_PAIRS = [
  { q: 'How can I work with Asym?', a: 'Book a call through my space and I will get back to you within 24 hours.' },
  { q: 'What tools does Asym use to build?', a: 'Next.js, Convex, Tailwind CSS, and Gemini AI — all from an Android phone.' },
  { q: 'What is One Question?', a: 'An AI-powered personal Q&A platform. Claim your space, upload your knowledge, let AI answer 24/7.' },
  { q: 'How do you build without a laptop?', a: 'Termux on Android. Constraints force better decisions and faster shipping.' },
];\n\n`;

  hero = hero.replace(`export function Hero()`, pairs + `export function Hero()`);
  fs.writeFileSync('components/Hero.tsx', hero);
  console.log('✓ Fixed TYPING_PAIRS');
} else {
  console.log('- Already exists');
}
