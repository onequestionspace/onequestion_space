const fs = require('fs');

let navbar = fs.readFileSync('components/Navbar.tsx', 'utf8');

const oldLine = '  const pathname = usePathname();';
const newLine = `  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const reserved = ['dashboard','blog','pricing','contact','features','waitlist','onboarding','privacy','terms','sign-in','sign-up','api'];
  const isSpacePage = segments.length === 1 && !reserved.includes(segments[0]);
  if (isSpacePage) return null;`;

if (!navbar.includes(oldLine)) {
  console.log('❌ Could not find pathname line — paste Navbar manually');
  process.exit(1);
}

navbar = navbar.replace(oldLine, newLine);
fs.writeFileSync('components/Navbar.tsx', navbar);
console.log('✅ Navbar now returns null on space pages');
