const fs = require('fs');
let code = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

// SpaceBackground now reads themeEffect not themeBg
code = code.replace(
  `function SpaceBackground({ themeBg, color }: { themeBg: string; color: string }) {
  switch (themeBg) {
    case 'particles': return <ParticlesBackground color={color} />;
    case 'bubbles': return <BubblesBackground color={color} />;
    case 'net': return <NetBackground color={color} />;
    case 'aurora': return <AuroraBackground color={color} />;
    case 'matrix': return <MatrixBackground color={color} />;
    default: return (
      <div className='fixed inset-0 -z-10 overflow-hidden pointer-events-none'>
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] opacity-20' style={{ backgroundColor: color }} />
      </div>
    );
  }
}`,
  `function SpaceBackground({ themeEffect, color }: { themeEffect: string; color: string }) {
  switch (themeEffect) {
    case 'particles': return <ParticlesBackground color={color} />;
    case 'bubbles': return <BubblesBackground color={color} />;
    case 'net': return <NetBackground color={color} />;
    case 'matrix': return <MatrixBackground color={color} />;
    default: return null;
  }
}`
);

// Update BG_STYLES with warm backgrounds
code = code.replace(
  `const BG_STYLES: Record<string, string> = {
  dark: 'bg-[#0f0c1a]',
  darker: 'bg-[#080608]',
  midnight: 'bg-[#0a0f1e]',
  aurora: 'bg-[#0d0b1a]',
  sunset: 'bg-[#1a0d10]',
  ocean: 'bg-[#071018]',
  particles: 'bg-[#0d0b1a]',
  bubbles: 'bg-[#0d0b1a]',
  net: 'bg-[#0d0b1a]',
  matrix: 'bg-[#040d06]',
  dawn: 'bg-[#1a0e2e]',
  dusk: 'bg-[#12081e]',
  galaxy: 'bg-[#080612]',
  fog: 'bg-[#e8e4f0]',
  sand: 'bg-[#f5efe6]',
  parchment: 'bg-[#faf6f0]',
};`,
  `const BG_STYLES: Record<string, string> = {
  dark: 'bg-[#0f0c1a]',
  darker: 'bg-[#080608]',
  midnight: 'bg-gradient-to-br from-[#0a0f1e] to-[#0d0b1a]',
  aurora: 'bg-gradient-to-br from-[#0d0b1a] to-[#1a0d2e]',
  dusk: 'bg-gradient-to-br from-[#12081e] to-[#1a0e10]',
  galaxy: 'bg-gradient-to-br from-[#080612] to-[#0d0b1a]',
  ocean: 'bg-gradient-to-br from-[#071018] to-[#0a1628]',
  dawn: 'bg-gradient-to-br from-[#1a0e2e] to-[#2e1a0e]',
  fog: 'bg-gradient-to-br from-[#e8e4f0] to-[#f0eef8]',
  sand: 'bg-gradient-to-br from-[#f5efe6] to-[#ede8df]',
  parchment: 'bg-gradient-to-br from-[#faf6f0] to-[#f5f0e8]',
  sunset: 'bg-gradient-to-br from-[#1a0d10] to-[#0f0c1a]',
};`
);

// Use themeEffect from profile instead of themeBg for SpaceBackground
code = code.replace(
  `  const bgClass = BG_STYLES[profile.themeBg || 'dark'];`,
  `  const bgClass = BG_STYLES[profile.themeBg || 'dark'];
  const themeEffect = (profile as Record<string, unknown>).themeEffect as string || 'none';`
);

// Update SpaceBackground call
code = code.replace(
  `      <SpaceBackground themeBg={profile.themeBg || 'dark'} color={color} />`,
  `      <SpaceBackground themeEffect={themeEffect} color={color} />`
);

// For light backgrounds (fog/sand/parchment) make text dark
code = code.replace(
  `  return (
    <div className={'min-h-screen ' + bgClass + ' ' + fontClass}>`,
  `  const isLight = ['fog','sand','parchment'].includes(profile.themeBg || '');
  return (
    <div className={'min-h-screen ' + bgClass + ' ' + fontClass + (isLight ? ' text-zinc-900' : ' text-white')}>`
);

fs.writeFileSync('app/(space)/[username]/page.tsx', code);
console.log('Done');
