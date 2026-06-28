const fs = require('fs');

// Read current file
let c = fs.readFileSync('app/dashboard/studio/page.tsx', 'utf8');

// Check if it has the new Code2 import (from our rewrite)
if (c.includes('Code2')) {
  console.log('New studio already written — skipping');
  process.exit(0);
}

console.log('Old studio detected — need full rewrite');
process.exit(1);
