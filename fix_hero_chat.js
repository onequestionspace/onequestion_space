const fs = require('fs');

let hero = fs.readFileSync('components/Hero.tsx', 'utf8');

hero = hero.replace(
  `<div className='p-5 space-y-3 min-h-[200px] flex flex-col justify-end'>`,
  `<div className='p-5 space-y-3 min-h-[200px] max-h-[260px] overflow-y-auto flex flex-col justify-end'>`
);

fs.writeFileSync('components/Hero.tsx', hero);
console.log('✓ Fixed hero chat overflow');
