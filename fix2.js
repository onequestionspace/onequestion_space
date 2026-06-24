const fs = require('fs');
let code = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');
code = code.replace(
  `<span className='text-xs font-medium' style={{ color }}>AI Response</span>`,
  `<span className='text-xs font-medium' style={{ color }}>{profile.displayName || username} replied</span>`
);
code = code.replace(
  `<span className='text-xs text-zinc-600'>{aiResponse.split(' ').length} tokens</span>`,
  ''
);
fs.writeFileSync('app/(space)/[username]/page.tsx', code);
console.log('Done');
