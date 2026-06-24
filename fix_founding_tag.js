const fs = require('fs');

let founding = fs.readFileSync('app/founding/page.tsx', 'utf8');

founding = founding.replace(
  `                    Join the Founders Discord
                  </Link>
                  <Link href="/dashboard"`,
  `                    Join the Founders Discord
                  </a>
                  <Link href="/dashboard"`
);

fs.writeFileSync('app/founding/page.tsx', founding);
console.log('✓ Fixed closing tag');
