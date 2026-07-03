const fs = require('fs');
const path = 'app/dashboard/studio/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const old = `onClick={() => { setMode('preview'); setPreviewKey(k => k + 1); }}`;
const next = `onClick={() => setMode('preview')}`;

if (!content.includes(old)) {
  console.error('❌ Pattern not found — aborting.');
  process.exit(1);
}
if (content.includes(next) && !content.includes(old)) {
  console.log('⚠️ Already patched.');
  process.exit(0);
}
content = content.replace(old, next);
fs.writeFileSync(path, content);
console.log('✅ Preview toggle no longer force-reloads iframe — only Save/Refresh do now.');
