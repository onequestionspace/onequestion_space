const fs = require('fs');

// ── Fix 1: layout.tsx — add preload: false to Inter ──
let layout = fs.readFileSync('app/layout.tsx', 'utf8');
layout = layout.replace(
  `const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
});`,
  `const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  preload: false,
});`
);
fs.writeFileSync('app/layout.tsx', layout);
console.log('Fix 1 done');

// ── Fix 2: next.config.js — remove invalid keys ──
let config = fs.readFileSync('next.config.js', 'utf8');
config = config.replace(
  `  experimental: {
    turbo: false,
  },`,
  ``
);
config = config.replace(
  `  eslint: {
    ignoreDuringBuilds: true,
  },`,
  ``
);
fs.writeFileSync('next.config.js', config);
console.log('Fix 2 done');

