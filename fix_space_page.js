const fs = require('fs');
let content = fs.readFileSync('app/[username]/page.tsx', 'utf8');

// Remove any Navbar or Footer imports if present
content = content.replace(/import.*Navbar.*\n/g, '');
content = content.replace(/import.*Footer.*\n/g, '');
content = content.replace(/<Navbar\s*\/>/g, '');
content = content.replace(/<Footer\s*\/>/g, '');

// Fix background to be cleaner
content = content.replace(
  '<div className="min-h-screen bg-background">',
  '<div className="min-h-screen bg-background">'
);

fs.writeFileSync('app/[username]/page.tsx', content);
console.log('Space page cleaned');
