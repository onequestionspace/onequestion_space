const fs = require('fs');
let code = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

// Fix ParticlesBackground
code = code.replace(
  `function ParticlesBackground({ color }: { color: string }) {
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
}`,
  `const PARTICLES = Array.from({ length: 20 }).map(() => ({
  width: Math.random() * 4 + 2,
  height: Math.random() * 4 + 2,
  left: Math.random() * 100,
  top: Math.random() * 100,
  duration: Math.random() * 10 + 8,
  delay: Math.random() * 5,
}));

function ParticlesBackground({ color }: { color: string }) {
  return (
    <div className='fixed inset-0 -z-10 overflow-hidden pointer-events-none'>
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className='absolute rounded-full opacity-20 animate-float'
          style={{
            width: p.width + 'px',
            height: p.height + 'px',
            backgroundColor: color,
            left: p.left + '%',
            top: p.top + '%',
            animationDuration: p.duration + 's',
            animationDelay: p.delay + 's',
          }}
        />
      ))}
    </div>
  );
}`
);

// Fix BubblesBackground
code = code.replace(
  `function BubblesBackground({ color }: { color: string }) {
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
}`,
  `const BUBBLES = Array.from({ length: 12 }).map(() => ({
  width: Math.random() * 60 + 20,
  height: Math.random() * 60 + 20,
  left: Math.random() * 100,
  duration: Math.random() * 12 + 10,
  delay: Math.random() * 8,
}));

function BubblesBackground({ color }: { color: string }) {
  return (
    <div className='fixed inset-0 -z-10 overflow-hidden pointer-events-none'>
      {BUBBLES.map((b, i) => (
        <div
          key={i}
          className='absolute rounded-full animate-rise'
          style={{
            width: b.width + 'px',
            height: b.height + 'px',
            border: '1px solid ' + color + '30',
            backgroundColor: color + '08',
            left: b.left + '%',
            bottom: '-100px',
            animationDuration: b.duration + 's',
            animationDelay: b.delay + 's',
          }}
        />
      ))}
    </div>
  );
}`
);

// Fix MatrixBackground
code = code.replace(
  `        className='absolute top-0 text-xs font-mono animate-matrix flex flex-col gap-2'
          style={{
            color: color,
            opacity: 0.15,
            left: (i * 7) + '%',
            animationDuration: Math.random() * 8 + 6 + 's',
            animationDelay: Math.random() * 4 + 's',
          }}`,
  `        className='absolute top-0 text-xs font-mono animate-matrix flex flex-col gap-2'
          style={{
            color: color,
            opacity: 0.15,
            left: (i * 7) + '%',
            animationDuration: MATRIX_COLS[i].duration + 's',
            animationDelay: MATRIX_COLS[i].delay + 's',
          }}`
);

// Add MATRIX_COLS constant before MatrixBackground
code = code.replace(
  `function MatrixBackground({ color }: { color: string }) {`,
  `const MATRIX_COLS = Array.from({ length: 15 }).map(() => ({
  duration: Math.random() * 8 + 6,
  delay: Math.random() * 4,
}));

function MatrixBackground({ color }: { color: string }) {`
);

// Fix NetBackground SVG circles
code = code.replace(
  `      {Array.from({ length: 8 }).map((_, i) => (
        <circle
          key={i}
          cx={Math.random() * 100 + '%'}
          cy={Math.random() * 100 + '%'}
          r='3'
          fill={color}
          opacity='0.4'
        />
      ))}`,
  `      {NET_CIRCLES.map((c, i) => (
        <circle
          key={i}
          cx={c.cx + '%'}
          cy={c.cy + '%'}
          r='3'
          fill={color}
          opacity='0.4'
        />
      ))}`
);

code = code.replace(
  `function NetBackground({ color }: { color: string }) {`,
  `const NET_CIRCLES = Array.from({ length: 8 }).map(() => ({
  cx: Math.random() * 100,
  cy: Math.random() * 100,
}));

function NetBackground({ color }: { color: string }) {`
);

// Fix MatrixBackground chars
code = code.replace(
  `          {Array.from({ length: 20 }).map((_, j) => (
            <span key={j}>{chars[Math.floor(Math.random() * chars.length)]}</span>
          ))}`,
  `          {MATRIX_COLS[i].chars.map((ch: string, j: number) => (
            <span key={j}>{ch}</span>
          ))}`
);

// Update MATRIX_COLS to include chars
code = code.replace(
  `const MATRIX_COLS = Array.from({ length: 15 }).map(() => ({
  duration: Math.random() * 8 + 6,
  delay: Math.random() * 4,
}));`,
  `const MATRIX_CHARS = '01アイウエオカキクケコサシスセソ';
const MATRIX_COLS = Array.from({ length: 15 }).map(() => ({
  duration: Math.random() * 8 + 6,
  delay: Math.random() * 4,
  chars: Array.from({ length: 20 }).map(() => MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]),
}));`
);

fs.writeFileSync('app/(space)/[username]/page.tsx', code);
console.log('Done');
