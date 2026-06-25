const fs = require('fs');

// Fix 1: Add animate-float to globals.css
let css = fs.readFileSync('app/globals.css', 'utf8');

const floatAnimation = `
/* Floating particle animation */
@keyframes float {
  0%, 100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.15; }
  25% { transform: translateY(-20px) translateX(10px) scale(1.1); opacity: 0.25; }
  50% { transform: translateY(-35px) translateX(-5px) scale(0.95); opacity: 0.2; }
  75% { transform: translateY(-15px) translateX(-15px) scale(1.05); opacity: 0.3; }
}

.animate-float {
  animation: float var(--duration, 12s) var(--delay, 0s) ease-in-out infinite;
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.15; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(1.05); }
}

.animate-pulse-slow {
  animation: pulse-slow 4s ease-in-out infinite;
}
`;

if (!css.includes('animate-float')) {
  css = css + floatAnimation;
  fs.writeFileSync('app/globals.css', css);
  console.log('✅ globals.css — animate-float keyframe added');
} else {
  console.log('⚠️  animate-float already exists');
}

// Fix 2: Fix PARTICLES to use useMemo inside component to avoid Math.random at module level
let spacePage = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

// Replace module-level PARTICLES with a seeded static array
spacePage = spacePage.replace(
  `const PARTICLES = Array.from({ length: 20 }).map(() => ({
  width: Math.random() * 4 + 2,
  height: Math.random() * 4 + 2,
  left: Math.random() * 100,
  top: Math.random() * 100,
  duration: Math.random() * 10 + 8,
  delay: Math.random() * 5,
}));`,
  `// Static particles — deterministic to avoid hydration mismatch
const PARTICLES = [
  { width: 3, height: 3, left: 10, top: 15, duration: 12, delay: 0 },
  { width: 5, height: 5, left: 25, top: 40, duration: 16, delay: 1 },
  { width: 2, height: 2, left: 40, top: 70, duration: 10, delay: 2 },
  { width: 4, height: 4, left: 55, top: 20, duration: 14, delay: 0.5 },
  { width: 3, height: 3, left: 70, top: 55, duration: 18, delay: 3 },
  { width: 6, height: 6, left: 85, top: 30, duration: 11, delay: 1.5 },
  { width: 2, height: 2, left: 15, top: 80, duration: 15, delay: 4 },
  { width: 4, height: 4, left: 30, top: 10, duration: 13, delay: 2.5 },
  { width: 3, height: 3, left: 60, top: 85, duration: 17, delay: 0.8 },
  { width: 5, height: 5, left: 80, top: 65, duration: 12, delay: 3.5 },
  { width: 2, height: 2, left: 90, top: 45, duration: 16, delay: 1.2 },
  { width: 4, height: 4, left: 45, top: 50, duration: 10, delay: 4.5 },
  { width: 3, height: 3, left: 5, top: 60, duration: 14, delay: 0.3 },
  { width: 5, height: 5, left: 35, top: 90, duration: 18, delay: 2.8 },
  { width: 2, height: 2, left: 75, top: 5, duration: 11, delay: 1.8 },
  { width: 4, height: 4, left: 20, top: 35, duration: 15, delay: 3.2 },
  { width: 3, height: 3, left: 50, top: 75, duration: 13, delay: 0.6 },
  { width: 6, height: 6, left: 65, top: 25, duration: 17, delay: 4.2 },
  { width: 2, height: 2, left: 92, top: 80, duration: 12, delay: 2.2 },
  { width: 4, height: 4, left: 8, top: 95, duration: 16, delay: 1.6 },
];`
);

// Fix the style to use CSS variables for duration and delay
spacePage = spacePage.replace(
  `            animationDuration: p.duration + 's',
            animationDelay: p.delay + 's',`,
  `            '--duration': p.duration + 's',
            '--delay': p.delay + 's',`
);

fs.writeFileSync('app/(space)/[username]/page.tsx', spacePage);
console.log('✅ Space page — particles fixed, deterministic, no hydration mismatch');

console.log('\nDone. Build and push.');
