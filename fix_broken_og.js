const fs = require('fs');

// Fix dashboard page — remove broken line 190
let dashboard = fs.readFileSync('app/dashboard/page.tsx', 'utf8');
dashboard = dashboard.replace(
  /\{!q\.isTyping && q\.answer && \(<div className="flex gap-2 mt-2">.*?\)\}/g,
  ''
);
fs.writeFileSync('app/dashboard/page.tsx', dashboard);
console.log('1 dashboard fixed');

// Fix space page — find and remove broken share block
let space = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');
space = space.replace(
  /const ogUrl[\s\S]*?const tweetUrl[\s\S]*?window\.open\(tweetUrl[^)]*\)[^}]*}/g,
  ''
);
fs.writeFileSync('app/(space)/[username]/page.tsx', space);
console.log('2 space page fixed');
