const fs = require('fs');

// Fix dashboard — remove the corrupted line 190
let dashboard = fs.readFileSync('app/dashboard/page.tsx', 'utf8');
const dashLines = dashboard.split('\n');
const cleanDash = dashLines.filter(line => 
  !line.includes('encodeURIComponent(q.answer)}&name=') &&
  !line.includes('tweetUrl') &&
  !line.includes('ogUrl') &&
  !line.includes('api/og') &&
  !line.includes('Card URL copied')
);
fs.writeFileSync('app/dashboard/page.tsx', cleanDash.join('\n'));
console.log('1 dashboard cleaned — removed', dashLines.length - cleanDash.length, 'corrupted lines');

// Fix space page — rewrite the response section cleanly
let space = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');
const spaceLines = space.split('\n');
const cleanSpace = spaceLines.filter(line =>
  !line.includes('ogUrl') &&
  !line.includes('tweetUrl') &&
  !line.includes('api/og') &&
  !line.includes('Share Card') &&
  !line.includes('Card URL copied') &&
  !line.includes('Copy Link') &&
  !line.includes('encodeURIComponent(My') &&
  !line.includes('encodeURIComponent(question)}&a=') &&
  !line.includes('intent/tweet')
);
fs.writeFileSync('app/(space)/[username]/page.tsx', cleanSpace.join('\n'));
console.log('2 space page cleaned — removed', spaceLines.length - cleanSpace.length, 'corrupted lines');
