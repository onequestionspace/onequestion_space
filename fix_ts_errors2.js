const fs = require('fs');

// ── 1. Fix space page — remove layout/layoutId from plain div ────────────────
let space = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

space = space.replace(
  `                  style={{ borderColor: isExpanded ? color + '60' : undefined }}
                  layout layoutId={'hist-' + i}`,
  `                  style={{ borderColor: isExpanded ? color + '60' : undefined }}`
);

fs.writeFileSync('app/(space)/[username]/page.tsx', space);
console.log('✓ Fixed space page layout prop');

// ── 2. Fix BentoSection — remove delay prop ──────────────────────────────────
let bento = fs.readFileSync('components/BentoSection.tsx', 'utf8');

bento = bento.replace(/\s+delay=\{[^}]+\}/g, '');

fs.writeFileSync('components/BentoSection.tsx', bento);
console.log('✓ Fixed BentoSection delay prop');
