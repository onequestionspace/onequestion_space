const fs = require('fs');

let page = fs.readFileSync('app/dashboard/admin/page.tsx', 'utf8');

// Add isLoaded check before the isAdmin check
page = page.replace(
  "  const isAdmin = user?.id ? ADMIN_IDS.includes(user.id) : false;",
  "  const { isLoaded: clerkLoaded } = useUser();\n  const isAdmin = user?.id ? ADMIN_IDS.includes(user.id) : false;"
);

// Add loading state before access denied
page = page.replace(
  "  // Debug — remove after fixing\n  console.log('Current user ID:', user?.id);\n\n  if (!isAdmin) {",
  "  if (!clerkLoaded) return <div className='min-h-screen flex items-center justify-center text-muted-foreground'>Loading...</div>;\n\n  if (!isAdmin) {"
);

fs.writeFileSync('app/dashboard/admin/page.tsx', page);
console.log('admin access fixed');
