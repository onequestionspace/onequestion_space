const fs = require('fs');

function fix(path, pairs) {
  try {
    let c = fs.readFileSync(path, 'utf8');
    for (const [from, to] of pairs) c = c.split(from).join(to);
    fs.writeFileSync(path, c);
    console.log('fixed:', path);
  } catch(e) { console.log('skip:', path, e.message); }
}

// Fix footer copy — more human
fix('components/Footer.tsx', [
  ['Upload your knowledge once. Let AI answer visitors instantly.\n              The future of personal branding and knowledge sharing.',
   'Built from an Android phone in Nigeria. One space, every question answered.'],
  ['Made with', 'Built with'],
]);

// Fix CTA — remove old paragraph that's still there
fix('components/CTASection.tsx', [
  ['Join creators, businesses, and teams already saving time with AI-powered Q&A pages.',
   'Claim your space. Upload what you know. Your AI handles the rest — 24/7, in your voice.'],
  ['Free 14-day trial', 'Free forever plan'],
]);

// Fix navbar logo — remove any ring/border
fix('components/Navbar.tsx', [
  ['className="rounded-xl group-hover:scale-110 transition-transform"',
   'className="rounded-xl group-hover:scale-110 transition-transform ring-0 border-0"'],
]);

console.log('done');
