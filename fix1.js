const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf8');
css = css.replace(
  '--primary: oklch(0.922 0 0);\n    --primary-foreground: oklch(0.205 0 0);',
  '--primary: oklch(0.5 0.24 300);\n    --primary-foreground: oklch(0.985 0 0);'
);
fs.writeFileSync('app/globals.css', css);
console.log('Done');
