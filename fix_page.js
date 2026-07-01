const fs = require('fs');
let c = fs.readFileSync('app/page.tsx', 'utf8');
c = c.replace(`import { StorySection } from '@/components/StorySection';\n`, '');
c = c.replace(`        <StorySection />\n`, '');
fs.writeFileSync('app/page.tsx', c);
console.log('done');
