const fs = require('fs');

// Remove waitlist from Footer links
let footer = fs.readFileSync('components/Footer.tsx', 'utf8');
footer = footer.replace(`        { name: 'Waitlist', href: '/waitlist' },\n`, '');
fs.writeFileSync('components/Footer.tsx', footer);
console.log('Footer done');

// Remove waitlist from Navbar reserved routes
let nav = fs.readFileSync('components/Navbar.tsx', 'utf8');
nav = nav.replace(`'waitlist',`, '');
fs.writeFileSync('components/Navbar.tsx', nav);
console.log('Navbar done');

// Delete the waitlist page
const { execSync } = require('child_process');
try {
  execSync('rm -rf app/waitlist');
  console.log('Waitlist page deleted');
} catch(e) { console.log('already gone'); }

