const fs = require('fs');
const path = 'app/dashboard/analytics/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const guardRegex = /if \(!isLoaded\) return \(\s*<div className="min-h-screen flex items-center justify-center">\s*<div className="animate-pulse text-zinc-500 text-sm">Loading\.\.\.<\/div>\s*<\/div>\s*\);\s*if \(!isSignedIn\) \{ redirect\('\/'\); \}/;

const match = content.match(guardRegex);
if (!match) {
  console.error('❌ Guard block regex not found — aborting.');
  process.exit(1);
}
const guardBlock = match[0];

// Remove from current position
content = content.replace(guardBlock + '\n\n', '');

// Insert right before final return
const finalReturnRegex = /return \(\s*<DashboardLayout title="Analytics"/;
const finalMatch = content.match(finalReturnRegex);
if (!finalMatch) {
  console.error('❌ Final return marker not found — aborting.');
  process.exit(1);
}
content = content.replace(finalMatch[0], guardBlock + '\n\n  ' + finalMatch[0]);

fs.writeFileSync(path, content);
console.log('✅ Guards moved below hooks on analytics page — Hooks Rules violation fixed.');
