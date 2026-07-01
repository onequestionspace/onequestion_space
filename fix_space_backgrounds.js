const fs = require('fs');

let page = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

// Replace flat BG_STYLES with rich gradients
page = page.replace(
  `const BG_STYLES: Record<string, string> = {
  dark: "bg-[#0a0208]", darker: "bg-[#050308]", midnight: "bg-[#05080f]",
  aurora: "bg-[#030a05]", dusk: "bg-[#0a0510]", galaxy: "bg-[#04020d]",
  ocean: "bg-[#030d0f]", dawn: "bg-[#0d0403]", fog: "bg-[#f0eef8]",
  sand: "bg-[#f5efe6]", parchment: "bg-[#faf6f0]", sunset: "bg-[#0d0403]",
  rose: "bg-[#f7e5e4]", mint: "bg-[#e8f5ee]", slate: "bg-[#e8eaf2]",
  chalkwhite: "chalk-bg", chalkgreen: "chalk-green", chalkblack: "chalk-black",
};`,
  `const BG_STYLES: Record<string, string> = {
  dark: "bg-zinc-950",
  darker: "bg-black",
  midnight: "bg-slate-950",
  aurora: "bg-[#060312]",
  dusk: "bg-[#0d0518]",
  galaxy: "bg-[#04020d]",
  ocean: "bg-[#020c12]",
  dawn: "bg-[#12050a]",
  sunset: "bg-[#120808]",
  fog: "bg-[#f0eef8]",
  sand: "bg-[#f5efe6]",
  parchment: "bg-[#faf6f0]",
  rose: "bg-[#f7e5e4]",
  mint: "bg-[#e8f5ee]",
  slate: "bg-[#e8eaf2]",
  chalkwhite: "bg-white",
  chalkgreen: "bg-emerald-50",
  chalkblack: "bg-zinc-900",
};

// Rich gradient overlays per theme — applied on top of bg color
const BG_GRADIENTS: Record<string, string> = {
  dark: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(120,40,200,0.15), transparent)',
  darker: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(80,20,160,0.12), transparent)',
  midnight: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(30,60,200,0.15), transparent)',
  aurora: 'radial-gradient(ellipse 100% 60% at 30% 0%, rgba(20,180,80,0.12), transparent), radial-gradient(ellipse 80% 50% at 70% 100%, rgba(100,20,200,0.10), transparent)',
  dusk: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(150,30,200,0.18), transparent)',
  galaxy: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(80,20,255,0.18), transparent), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(200,20,200,0.10), transparent)',
  ocean: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(20,120,200,0.18), transparent)',
  dawn: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(200,60,20,0.15), transparent)',
  sunset: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(220,80,20,0.18), transparent), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(200,20,80,0.10), transparent)',
  fog: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(120,80,220,0.08), transparent)',
  sand: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(180,120,40,0.08), transparent)',
  parchment: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(160,100,40,0.06), transparent)',
  rose: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(220,80,80,0.08), transparent)',
  mint: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(40,180,100,0.08), transparent)',
  slate: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(80,100,200,0.08), transparent)',
  chalkwhite: 'none',
  chalkgreen: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(40,180,100,0.06), transparent)',
  chalkblack: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(120,40,200,0.12), transparent)',
};`
);

// Add gradient overlay div in the return statement
page = page.replace(
  "  const bgClass = BG_STYLES[profile.themeBg || 'dark'];",
  "  const bgClass = BG_STYLES[profile.themeBg || 'dark'];\n  const bgGradient = BG_GRADIENTS[profile.themeBg || 'dark'] || 'none';"
);

// Fix text colors for light vs dark themes
page = page.replace(
  "  const isLight = ['fog', 'sand', 'parchment', 'rose', 'mint', 'slate', 'chalkwhite'].includes(profile.themeBg || '');",
  "  const isLight = ['fog', 'sand', 'parchment', 'rose', 'mint', 'slate', 'chalkwhite', 'chalkgreen'].includes(profile.themeBg || '');\n  const textMain = isLight ? 'text-zinc-900' : 'text-white';\n  const textSub = isLight ? 'text-zinc-600' : 'text-zinc-400';\n  const textMuted = isLight ? 'text-zinc-500' : 'text-zinc-500';\n  const borderStyle = isLight ? 'border-zinc-200' : 'border-white/10';\n  const cardBg = isLight ? 'bg-white/80 backdrop-blur-xl border border-zinc-200 shadow-sm' : 'bg-zinc-950/80 backdrop-blur-xl border border-zinc-800';"
);

// Add gradient overlay to the main wrapper
page = page.replace(
  "    <div className={'min-h-screen ' + bgClass + ' ' + fontClass + (isLight ? ' text-zinc-800' : ' text-white')}>",
  "    <div className={'min-h-screen ' + bgClass + ' ' + fontClass + (isLight ? ' text-zinc-800' : ' text-white')} style={{ position: 'relative' }}>\n      {bgGradient !== 'none' && <div style={{ position: 'fixed', inset: 0, background: bgGradient, zIndex: 0, pointerEvents: 'none' }} />}"
);

fs.writeFileSync('app/(space)/[username]/page.tsx', page);
console.log('space backgrounds fixed — rich gradients per theme, proper light/dark text');
