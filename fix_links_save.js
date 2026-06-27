const fs = require('fs');
let c = fs.readFileSync('app/dashboard/studio/page.tsx', 'utf8');

c = c.replace(
  `{saveBtn({ links: JSON.stringify(links.filter(l => l.title && l.url)) })}`,
  `{saveBtn({ links: JSON.stringify(links.filter(l => l.title || l.url)) })}`
);

fs.writeFileSync('app/dashboard/studio/page.tsx', c);
console.log('done');
