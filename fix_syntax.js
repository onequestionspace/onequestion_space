const fs = require('fs');

let page = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

page = page.replace(
  "                  </div>\n                )}\n\n                )}\n\n                {aiResponse && (",
  "                  </div>\n                )}\n\n                {aiResponse && ("
);

fs.writeFileSync('app/(space)/[username]/page.tsx', page);
console.log('syntax fixed');
