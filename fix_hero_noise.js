const fs = require('fs');
let c = fs.readFileSync('components/Hero.tsx', 'utf8');

// Remove the noise overlay div entirely
c = c.replace(
  `        backgroundImage: \`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")\`,`,
  `        backgroundImage: 'none',`
);

fs.writeFileSync('components/Hero.tsx', c);
console.log('done');
