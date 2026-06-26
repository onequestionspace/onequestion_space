const fs = require('fs');
let c = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

c = c.replace(
`const stripMarkdown = (text: string) => {
  return text
    .split('**').join('')
    .split('##').join('')
    .split('# ').join('')
    .split('* ').join('')
    .split('__').join('')
    .replace(/^[#]+\\s/gm, '')
    .trim();
};`,
`const stripMarkdown = (text: string) => {
  return text
    .replace(/\\*\\*(.*?)\\*\\*/g, '$1')
    .replace(/\\*(.*?)\\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/\`(.*?)\`/g, '$1')
    .replace(/^#{1,6}\\s+/gm, '')
    .replace(/^[-*+]\\s+/gm, '')
    .trim();
};`
);

fs.writeFileSync('app/(space)/[username]/page.tsx', c);
console.log('done');
