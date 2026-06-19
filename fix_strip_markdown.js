const fs = require('fs');

let space = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

// Remove the broken stripMarkdown function
space = space.replace(
  `const stripMarkdown = (text: string) =>
  text
    .replace(/#{1,6}s+/g, '')
    .replace(/**(.*?)**/g, '$1')
    .replace(/*(.*?)*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/[([^]]+)]([^)]+)/g, '$1')
    .replace(/^[-*+]s+/gm, '')
    .replace(/^d+.s+/gm, '')
    .trim();

`,
  ``
);

// Add a working version using split/join instead of regex
const cleanFn = `const stripMarkdown = (text${String.fromCharCode(58)} string) ${String.fromCharCode(61)}> {
  return text
    .split('**').join('')
    .split('##').join('')
    .split('# ').join('')
    .split('* ').join('')
    .split('__').join('')
    .replace(/^[#]+\\s/gm, '')
    .trim();
};

`;

space = space.replace(
  `const BG_STYLES`,
  cleanFn + `const BG_STYLES`
);

fs.writeFileSync('app/(space)/[username]/page.tsx', space);
console.log('✓ Fixed stripMarkdown function');
