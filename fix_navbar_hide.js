const fs = require('fs');

// Read current Navbar
let navbar = fs.readFileSync('components/Navbar.tsx', 'utf8');

// Check if already fixed
if (navbar.includes('usePathname')) {
  console.log('⚠️ Navbar already has usePathname — check manually');
} else {
  // Add usePathname import and hide on space pages
  navbar = navbar.replace(
    `'use client';`,
    `'use client';\nimport { usePathname } from 'next/navigation';`
  );

  // Add hide logic after the first line of the component function
  navbar = navbar.replace(
    /export default function Navbar\(\)[^{]*{/,
    `export default function Navbar() {\n  const pathname = usePathname();\n  const isSpacePage = pathname.split('/').length === 2 && !['dashboard', 'blog', 'pricing', 'contact', 'features', 'waitlist', 'onboarding', 'privacy', 'terms', 'sign-in', 'sign-up'].includes(pathname.split('/')[1]);\n  if (isSpacePage) return null;`
  );

  fs.writeFileSync('components/Navbar.tsx', navbar);
  console.log('✅ Navbar updated — hidden on space pages');
}

// Read current Footer
let footer = fs.readFileSync('components/Footer.tsx', 'utf8');

if (footer.includes('usePathname')) {
  console.log('⚠️ Footer already has usePathname — check manually');
} else {
  footer = footer.replace(
    `'use client';`,
    `'use client';\nimport { usePathname } from 'next/navigation';`
  );

  footer = footer.replace(
    /export default function Footer\(\)[^{]*{/,
    `export default function Footer() {\n  const pathname = usePathname();\n  const isSpacePage = pathname.split('/').length === 2 && !['dashboard', 'blog', 'pricing', 'contact', 'features', 'waitlist', 'onboarding', 'privacy', 'terms', 'sign-in', 'sign-up'].includes(pathname.split('/')[1]);\n  if (isSpacePage) return null;`
  );

  fs.writeFileSync('components/Footer.tsx', footer);
  console.log('✅ Footer updated — hidden on space pages');
}
