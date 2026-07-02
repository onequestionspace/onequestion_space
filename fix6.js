const fs = require('fs');
const path = 'app/dashboard/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Extract the current early-return guard block (wherever it now sits)
const guardBlock = `if (!isLoaded) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-zinc-500 text-sm">Loading...</div>
    </div>
  );
  if (!isSignedIn) { redirect('/'); }`;

if (!content.includes(guardBlock)) {
  console.error('❌ Guard block not found — whitespace likely differs. Manual fix needed.');
  process.exit(1);
}

// Remove it from its current (wrong) position
content = content.replace(guardBlock + '\n\n  ', '');
content = content.replace(guardBlock + '\n\n', '');
content = content.replace(guardBlock, '');

// 2. Re-insert it immediately before the final DashboardLayout return
const finalReturnMarker = 'return (\n    <DashboardLayout';
if (!content.includes(finalReturnMarker)) {
  console.error('❌ Final return marker not found — manual fix needed.');
  process.exit(1);
}

content = content.replace(
  finalReturnMarker,
  guardBlock + '\n\n  ' + finalReturnMarker
);

fs.writeFileSync(path, content);
console.log('✅ Guard clauses moved to just before final return — hook order now correct, no TDZ.');
