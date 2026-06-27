const fs = require('fs');
let c = fs.readFileSync('components/AppearanceTab.tsx', 'utf8');
const lines = c.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('backgroundImage') && lines[i].includes('data:image/svg+xml')) {
    lines[i] = '';
  }
}
fs.writeFileSync('components/AppearanceTab.tsx', lines.join('\n'));
console.log('done');
