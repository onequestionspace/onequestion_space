const fs = require('fs');

let space = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

space = space.replace(
  `const BG_STYLES: Record<string, string> = {
  dark: 'bg-zinc-900',
  darker: 'bg-black',
  midnight: 'bg-slate-950',
  aurora: 'bg-gradient-to-br from-purple-950 to-blue-950',
  sunset: 'bg-gradient-to-br from-orange-950 to-pink-950',
  ocean: 'bg-gradient-to-br from-cyan-950 to-blue-950',
};`,
  `const BG_STYLES: Record<string, string> = {
  dark: 'bg-zinc-900',
  darker: 'bg-black',
  midnight: 'bg-slate-950',
  aurora: 'bg-gradient-to-br from-purple-950 to-blue-950',
  sunset: 'bg-gradient-to-br from-orange-950 to-pink-950',
  ocean: 'bg-gradient-to-br from-cyan-950 to-blue-950',
  particles: 'bg-zinc-950',
  bubbles: 'bg-zinc-950',
  net: 'bg-zinc-950',
  matrix: 'bg-black',
};`
);

fs.writeFileSync('app/(space)/[username]/page.tsx', space);
console.log('✓ BG_STYLES updated with animated background base colors');
