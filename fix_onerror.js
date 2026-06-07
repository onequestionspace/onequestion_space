const fs = require('fs');
let content = fs.readFileSync('app/[username]/page.tsx', 'utf8');
content = content.replace(
  ' onError={(e) => { e.currentTarget.style.display = "none"; }}',
  ''
);
fs.writeFileSync('app/[username]/page.tsx', content);
console.log('Done');
