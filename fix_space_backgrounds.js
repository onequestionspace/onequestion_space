const fs = require('fs');

// ── 1. Add background components to space page ───────────────────────────────
let space = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

// Add background animations after imports
const bgAnimations = `
// ── Animated Background Components ──────────────────────────────────────────
function ParticlesBackground({ color }: { color: string }) {
  return (
    <div className='fixed inset-0 -z-10 overflow-hidden pointer-events-none'>
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className='absolute rounded-full opacity-20 animate-float'
          style={{
            width: Math.random() * 4 + 2 + 'px',
            height: Math.random() * 4 + 2 + 'px',
            backgroundColor: color,
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            animationDuration: Math.random() * 10 + 8 + 's',
            animationDelay: Math.random() * 5 + 's',
          }}
        />
      ))}
    </div>
  );
}

function BubblesBackground({ color }: { color: string }) {
  return (
    <div className='fixed inset-0 -z-10 overflow-hidden pointer-events-none'>
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className='absolute rounded-full animate-rise'
          style={{
            width: Math.random() * 60 + 20 + 'px',
            height: Math.random() * 60 + 20 + 'px',
            border: '1px solid ' + color + '30',
            backgroundColor: color + '08',
            left: Math.random() * 100 + '%',
            bottom: '-100px',
            animationDuration: Math.random() * 12 + 10 + 's',
            animationDelay: Math.random() * 8 + 's',
          }}
        />
      ))}
    </div>
  );
}

function NetBackground({ color }: { color: string }) {
  return (
    <svg className='fixed inset-0 -z-10 w-full h-full pointer-events-none opacity-20' xmlns='http://www.w3.org/2000/svg'>
      <defs>
        <pattern id='net' x='0' y='0' width='60' height='60' patternUnits='userSpaceOnUse'>
          <path d='M 60 0 L 0 0 0 60' fill='none' stroke={color} strokeWidth='0.5' />
        </pattern>
      </defs>
      <rect width='100%' height='100%' fill='url(#net)' />
      {Array.from({ length: 8 }).map((_, i) => (
        <circle
          key={i}
          cx={Math.random() * 100 + '%'}
          cy={Math.random() * 100 + '%'}
          r='3'
          fill={color}
          opacity='0.4'
        />
      ))}
    </svg>
  );
}

function AuroraBackground({ color }: { color: string }) {
  return (
    <div className='fixed inset-0 -z-10 overflow-hidden pointer-events-none'>
      <div className='absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[120px] opacity-30 animate-aurora-1' style={{ backgroundColor: color }} />
      <div className='absolute top-1/2 -right-40 w-80 h-80 rounded-full blur-[100px] opacity-20 animate-aurora-2' style={{ backgroundColor: color }} />
      <div className='absolute -bottom-40 left-1/3 w-72 h-72 rounded-full blur-[80px] opacity-25 animate-aurora-3' style={{ backgroundColor: color }} />
    </div>
  );
}

function MatrixBackground({ color }: { color: string }) {
  const chars = '01アイウエオカキクケコサシスセソ';
  return (
    <div className='fixed inset-0 -z-10 overflow-hidden pointer-events-none'>
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className='absolute top-0 text-xs font-mono animate-matrix flex flex-col gap-2'
          style={{
            color: color,
            opacity: 0.15,
            left: (i * 7) + '%',
            animationDuration: Math.random() * 8 + 6 + 's',
            animationDelay: Math.random() * 4 + 's',
          }}
        >
          {Array.from({ length: 20 }).map((_, j) => (
            <span key={j}>{chars[Math.floor(Math.random() * chars.length)]}</span>
          ))}
        </div>
      ))}
    </div>
  );
}

function SpaceBackground({ themeBg, color }: { themeBg: string; color: string }) {
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
}

`;

// Insert background components before the main component
space = space.replace(
  `export default function SpacePage`,
  bgAnimations + `export default function SpacePage`
);

// Replace the existing fixed background div with SpaceBackground component
space = space.replace(
  `      <div className='fixed inset-0 -z-10 overflow-hidden pointer-events-none'>
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] opacity-20' style={{ backgroundColor: color }} />
      </div>`,
  `      <SpaceBackground themeBg={profile.themeBg || 'none'} color={color} />`
);

fs.writeFileSync('app/(space)/[username]/page.tsx', space);
console.log('✓ Space backgrounds added');

// ── 2. Add animations to tailwind.config.ts ──────────────────────────────────
let tailwind = fs.readFileSync('tailwind.config.ts', 'utf8');

if (!tailwind.includes('animate-float')) {
  tailwind = tailwind.replace(
    `extend: {`,
    `extend: {
      animation: {
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
      },`
  );
  fs.writeFileSync('tailwind.config.ts', tailwind);
  console.log('✓ Tailwind animations added');
} else {
  console.log('- Tailwind animations already exist');
}

// ── 3. Update appearance settings to include new bg options ──────────────────
let settings = fs.readFileSync('app/dashboard/settings/page.tsx', 'utf8');

if (settings.includes("'dark'") && !settings.includes("'particles'")) {
  settings = settings.replace(
    /(\[[\s\S]*?'dark'[\s\S]*?'darker'[\s\S]*?\])/,
    (match) => {
      if (match.includes('particles')) return match;
      return match.replace(
        /\](\s*[,;]?\s*\/\/.*bg)/,
        `, 'particles', 'bubbles', 'net', 'aurora', 'matrix']$1`
      );
    }
  );
  fs.writeFileSync('app/dashboard/settings/page.tsx', settings);
  console.log('✓ Settings updated with new bg options');
} else {
  console.log('- Settings already has new bg options or needs manual update');
}

console.log('\nDone. Run: npx tsc --noEmit && git add . && git commit -m "feat: space animated backgrounds" && git push origin main');
