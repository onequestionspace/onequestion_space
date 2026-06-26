const fs = require('fs');
let h = fs.readFileSync('components/Hero.tsx', 'utf8');
h = h.replace(
  `['#f59e0b','#ef4444','#3b82f6','#22c55e','#a855f7'][i]`,
  `['#f59e0b','#ef4444','#3b82f6','#22c55e','#f97316'][i]`
);
fs.writeFileSync('components/Hero.tsx', h);
console.log('done');
