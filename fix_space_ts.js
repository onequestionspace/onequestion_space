const fs = require('fs');

// ── 1. Fix space page — profile used inside SpaceBackground default case ─────
let space = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

space = space.replace(
  `    default: return (
      <SpaceBackground themeBg={profile.themeBg || 'none'} color={color} />
    );`,
  `    default: return (
      <div className='fixed inset-0 -z-10 overflow-hidden pointer-events-none'>
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] opacity-20' style={{ backgroundColor: color }} />
      </div>
    );`
);

fs.writeFileSync('app/(space)/[username]/page.tsx', space);
console.log('✓ Fixed space page default background');

// ── 2. Fix tailwind — merge animations into existing keys ────────────────────
let tailwind = fs.readFileSync('tailwind.config.ts', 'utf8');

// Remove the duplicate animation/keyframes block we added
tailwind = tailwind.replace(
  `      animation: {
        'float': 'float var(--duration, 10s) ease-in-out infinite',
        'rise': 'rise var(--duration, 12s) ease-in infinite',
        'aurora-1': 'aurora1 8s ease-in-out infinite',
        'aurora-2': 'aurora2 10s ease-in-out infinite',
        'aurora-3': 'aurora3 12s ease-in-out infinite',
        'matrix': 'matrix var(--duration, 8s) linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '25%': { transform: 'translateY(-20px) translateX(10px)' },
          '50%': { transform: 'translateY(-10px) translateX(-10px)' },
          '75%': { transform: 'translateY(-30px) translateX(5px)' },
        },
        rise: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0.3' },
          '100%': { transform: 'translateY(-110vh) scale(1.5)', opacity: '0' },
        },
        aurora1: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(80px, 40px) scale(1.2)' },
        },
        aurora2: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(-60px, -30px) scale(1.1)' },
        },
        aurora3: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(40px, -50px) scale(1.3)' },
        },
        matrix: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },`,
  ``
);

// Now inject into the existing animation block
tailwind = tailwind.replace(
  `      animation: {`,
  `      animation: {
        'float': 'float 10s ease-in-out infinite',
        'rise': 'rise 12s ease-in infinite',
        'aurora-1': 'aurora1 8s ease-in-out infinite',
        'aurora-2': 'aurora2 10s ease-in-out infinite',
        'aurora-3': 'aurora3 12s ease-in-out infinite',
        'matrix': 'matrix 8s linear infinite',`
);

tailwind = tailwind.replace(
  `      keyframes: {`,
  `      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '25%': { transform: 'translateY(-20px) translateX(10px)' },
          '50%': { transform: 'translateY(-10px) translateX(-10px)' },
          '75%': { transform: 'translateY(-30px) translateX(5px)' },
        },
        rise: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0.3' },
          '100%': { transform: 'translateY(-110vh) scale(1.5)', opacity: '0' },
        },
        aurora1: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(80px, 40px) scale(1.2)' },
        },
        aurora2: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(-60px, -30px) scale(1.1)' },
        },
        aurora3: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(40px, -50px) scale(1.3)' },
        },
        matrix: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },`
);

fs.writeFileSync('tailwind.config.ts', tailwind);
console.log('✓ Fixed tailwind duplicate keys');

console.log('\nDone. Run: npx tsc --noEmit');
