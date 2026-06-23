const fs = require('fs');

let page = fs.readFileSync('app/dashboard/admin/page.tsx', 'utf8');

// Add debug display before the access denied check
page = page.replace(
  "  if (!isAdmin) {",
  "  // Debug — remove after fixing\n  console.log('Current user ID:', user?.id);\n\n  if (!isAdmin) {"
);

// Also show the user ID on the access denied screen
page = page.replace(
  "          <p className=\"text-muted-foreground text-sm\">You don't have permission to view this page.</p>",
  "          <p className=\"text-muted-foreground text-sm\">You don't have permission to view this page.</p>\n          <p className=\"text-xs text-muted-foreground mt-4 font-mono\">Your ID: {user?.id}</p>"
);

fs.writeFileSync('app/dashboard/admin/page.tsx', page);
console.log('debug added');
