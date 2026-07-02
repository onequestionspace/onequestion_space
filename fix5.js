const fs = require('fs');
const path = 'app/dashboard/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldReturn = `if (!isLoaded) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-zinc-500 text-sm">Loading...</div>
    </div>
  );
  if (!isSignedIn) { redirect('/'); }`;

const oldMemo = `  const insights: string[] = useMemo(() => {`;

if (!content.includes(oldReturn) || !content.includes(oldMemo)) {
  console.error('❌ Exact pattern not found — likely whitespace differs from what was pasted. Manual check needed.');
  process.exit(1);
}

// Extract the full useMemo block
const memoStart = content.indexOf(oldMemo);
const memoEnd = content.indexOf('}, [isNewUser, knowledgeCount, pendingCount, messagesUsed, messagesLimit, profile?.avatar, profile?.vibeQuote]);') + '}, [isNewUser, knowledgeCount, pendingCount, messagesUsed, messagesLimit, profile?.avatar, profile?.vibeQuote]);'.length;
const memoBlock = content.slice(memoStart, memoEnd);

// Remove it from its current position
content = content.slice(0, memoStart) + content.slice(memoEnd);

// Insert it BEFORE the early returns
content = content.replace(oldReturn, memoBlock + '\n\n  ' + oldReturn);

fs.writeFileSync(path, content);
console.log('✅ useMemo moved above early returns — Hooks Rules violation fixed.');
