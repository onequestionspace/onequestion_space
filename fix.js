const fs = require('fs');
const path = 'components/Navbar.tsx';
let content = fs.readFileSync(path, 'utf8');

const old = '  if (isSpacePage) return null;';
const replacement = "  const isDashboardPage = segments[0] === 'dashboard';\n  if (isSpacePage || isDashboardPage) return null;";

if (!content.includes(old)) {
  console.error('❌ Navbar pattern not found — aborting patch.');
} else if (content.includes('isDashboardPage')) {
  console.log('⚠️ Navbar already patched — skipping.');
} else {
  content = content.replace(old, replacement);
  fs.writeFileSync(path, content);
  console.log('✅ Navbar.tsx patched.');
}
