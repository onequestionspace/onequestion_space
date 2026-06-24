const fs = require('fs');

// ── 1. Fix space page broken ternary ────────────────────────────────────────
let space = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

space = space.replace(
  `  const _visitorId = visitorId
    : 'anon';`,
  `  const _visitorId = visitorId || 'anon';`
);

fs.writeFileSync('app/(space)/[username]/page.tsx', space);
console.log('✓ Fixed space page visitorId ternary');

// ── 2. Fix founding page — Link to external URL should be <a> ───────────────
let founding = fs.readFileSync('app/founding/page.tsx', 'utf8');

founding = founding.replace(
  `                  <Link
                    href="https://discord.gg/JuQJQRTDYP"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-indigo-500 text-white text-sm font-bold hover:opacity-90 transition-opacity"
                  >
                    Join the Founders Discord
                  </Link>`,
  `                  <a
                    href="https://discord.gg/JuQJQRTDYP"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-indigo-500 text-white text-sm font-bold hover:opacity-90 transition-opacity"
                  >
                    Join the Founders Discord
                  </a>`
);

fs.writeFileSync('app/founding/page.tsx', founding);
console.log('✓ Fixed founding page Discord link');
