const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf8');

// Fix primary in @layer base :root to match the purple
css = css.replace(
  '--primary: oklch(0.205 0 0);',
  '--primary: oklch(0.5 0.24 300);'
);
// Fix primary-foreground to be white
css = css.replace(
  '--primary-foreground: oklch(0.985 0 0);\n    --secondary: oklch(0.97 0 0);',
  '--primary-foreground: oklch(0.985 0 0);\n    --secondary: oklch(0.97 0 0);'
);

fs.writeFileSync('app/globals.css', css);
console.log('Fixed --primary conflict');
