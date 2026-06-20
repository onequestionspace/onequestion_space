const fs = require('fs');

let page = fs.readFileSync('app/founding/page.tsx', 'utf8');

page = page.replace(
  `setSpotNumber(result.spotNumber);`,
  `setSpotNumber(result.spotNumber ?? null);`
);

fs.writeFileSync('app/founding/page.tsx', page);
console.log('✓ Fixed spotNumber type');
