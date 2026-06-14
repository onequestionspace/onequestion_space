const fs = require('fs');

let footer = fs.readFileSync('components/Footer.tsx', 'utf8');

const oldLine = `export function Footer() {`;
const newLine = `export function Footer() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const reserved = ['dashboard','blog','pricing','contact','features','waitlist','onboarding','privacy','terms','sign-in','sign-up','api'];
  const isSpacePage = segments.length === 1 && !reserved.includes(segments[0]);
  if (isSpacePage) return null;`;

if (!footer.includes(oldLine)) {
  console.log('❌ Could not find Footer function');
  process.exit(1);
}

footer = footer.replace(oldLine, newLine);
fs.writeFileSync('components/Footer.tsx', footer);
console.log('✅ Footer now returns null on space pages');
