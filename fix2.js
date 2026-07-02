const fs = require('fs');
const path = 'app/globals.css';
let content = fs.readFileSync(path, 'utf8');

const old = `.dot-pattern {
  background-image: radial-gradient(rgba(245, 158, 11, 0.12) 1px, transparent 1px);
  background-size: 20px 20px;
}`;

const replacement = `.dot-pattern {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Ccircle cx='1' cy='1' r='1' fill='rgba(245,158,11,0.12)'/%3E%3C/svg%3E");
  background-size: 20px 20px;
}`;

if (!content.includes(old)) {
  console.error('❌ Pattern not found — aborting. File may have changed.');
  process.exit(1);
}
if (content.includes('data:image/svg+xml') && content.includes("cx='1' cy='1' r='1'")) {
  console.log('⚠️ Already patched — skipping.');
  process.exit(0);
}

content = content.replace(old, replacement);
fs.writeFileSync(path, content);
console.log('✅ dot-pattern converted to SVG background — fixes mobile GPU glitch.');
