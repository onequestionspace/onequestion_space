const fs = require('fs');

let route = fs.readFileSync('app/api/avatar/route.ts', 'utf8');

// Remove everything between the import and the POST function
route = route.replace(
  /export const config[\s\S]*?};(\s*)/,
  'export const maxDuration = 30;\n\n'
);

fs.writeFileSync('app/api/avatar/route.ts', route);
console.log('✅ Fixed');
console.log(fs.readFileSync('app/api/avatar/route.ts', 'utf8').slice(0, 200));
