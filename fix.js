const fs = require('fs');
// Check if there's a .env.local.production or similar
const files = ['.env', '.env.local', '.env.production', '.env.development'];
files.forEach(f => {
  try {
    const c = fs.readFileSync(f, 'utf8');
    const keys = c.match(/CLERK[^=]+=.+/g) || [];
    if (keys.length) console.log(f + ':', keys.map(k => k.split('=')[0]).join(', '));
  } catch {}
});
