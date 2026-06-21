const fs = require('fs');

let layout = fs.readFileSync('components/DashboardLayout.tsx', 'utf8');

// Add Shield import
layout = layout.replace(
  `import {`,
  `import { Shield } from 'lucide-react';
import {`
);

// Check if Shield already imported
if (layout.includes("import { Shield }") && layout.includes("Shield,")) {
  layout = layout.replace(`import { Shield } from 'lucide-react';\nimport {`, `import {`);
}

// Add useUser import
if (!layout.includes('useUser')) {
  layout = layout.replace(
    `'use client';`,
    `'use client';
import { useUser } from '@clerk/nextjs';`
  );
}

// Add useUser hook inside component
layout = layout.replace(
  `  const pathname = usePathname();`,
  `  const pathname = usePathname();
  const { user } = useUser();
  const isAdmin = user?.id === 'user_3EhKmuVyC1AhoBDlL7QNssllwgu' || user?.id === 'user_3Ev3UAWNTTDAlVWSYFGGsEI6qQz';`
);

// Add admin link after billing in the NAV_ITEMS — actually add it dynamically in JSX
layout = layout.replace(
  `            {NAV_ITEMS.map((item) => {`,
  `            {[...NAV_ITEMS, ...(isAdmin ? [{ label: 'Admin', href: '/dashboard/admin', icon: Shield }] : [])].map((item) => {`
);

fs.writeFileSync('components/DashboardLayout.tsx', layout);
console.log('✓ Admin link added to dashboard nav');
