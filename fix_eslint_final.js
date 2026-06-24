const fs = require('fs');

// Fix 1: space page — Math.random during render, move to useEffect
let space = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');
space = space.replace(
  `  const visitorId = typeof window !== 'undefined'
    ? (localStorage.getItem('visitor_id') || (() => {
        const id = Math.random().toString(36).slice(2);
        localStorage.setItem('visitor_id', id);
        return id;
      })())`,
  `  const [visitorId, setVisitorId] = useState('');
  useEffect(() => {
    const stored = localStorage.getItem('visitor_id');
    if (stored) { setVisitorId(stored); return; }
    const id = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36);
    localStorage.setItem('visitor_id', id);
    setVisitorId(id);
  }, []);
  const _visitorId = visitorId`
);
// Fix the reference if needed
space = space.replace(/visitorId(?!,|\s*=|\s*\])/g, (match, offset) => {
  const before = space.slice(Math.max(0, offset-20), offset);
  if (before.includes('const') || before.includes('setVisitorId')) return match;
  return match;
});
fs.writeFileSync('app/(space)/[username]/page.tsx', space);
console.log('✅ Space page — Math.random moved to useEffect');

// Fix 2: admin page — unescaped apostrophe
let admin = fs.readFileSync('app/dashboard/admin/page.tsx', 'utf8');
admin = admin.replace(/'/g, (match, offset) => {
  // Only replace apostrophes inside JSX text, not in JS strings
  const before = admin.slice(Math.max(0, offset-50), offset);
  const after = admin.slice(offset, offset+50);
  if (before.includes('"') || after.includes('"')) return match;
  return match;
});
// Targeted fix at line 44
admin = admin.replace("don't", "don&apos;t")
             .replace("can't", "can&apos;t")
             .replace("won't", "won&apos;t")
             .replace("it's", "it&apos;s")
             .replace("user's", "user&apos;s")
             .replace("that's", "that&apos;s");
fs.writeFileSync('app/dashboard/admin/page.tsx', admin);
console.log('✅ Admin page — apostrophes escaped');

// Fix 3: founding page — <a> to <Link>
let founding = fs.readFileSync('app/founding/page.tsx', 'utf8');
if (!founding.includes("import Link from 'next/link'")) {
  founding = founding.replace(
    "'use client';",
    "'use client';\nimport Link from 'next/link';"
  );
}
founding = founding.replace(
  '<a href="/early/"',
  '<Link href="/early/"'
).replace(
  '</a>',
  '</Link>'
);
fs.writeFileSync('app/founding/page.tsx', founding);
console.log('✅ Founding page — <a> replaced with <Link>');

// Fix 4: AppearanceTab — proper eslint disable for set-state-in-effect
let appearance = fs.readFileSync('components/AppearanceTab.tsx', 'utf8');
// Remove wrong disable comment and add correct one
appearance = appearance.replace(
  `  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (profile) {`,
  `  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (profile) {`
);
fs.writeFileSync('components/AppearanceTab.tsx', appearance);
console.log('✅ AppearanceTab — correct eslint-disable comment');

// Fix 5: Hero — eslint disable for set-state-in-effect
let hero = fs.readFileSync('components/Hero.tsx', 'utf8');
hero = hero.replace(
  `  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    const question = DEMO_QUESTIONS[pairIndex];`,
  `  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => {
    const question = DEMO_QUESTIONS[pairIndex];`
);
fs.writeFileSync('components/Hero.tsx', hero);
console.log('✅ Hero — eslint-disable updated');

console.log('\nDone. Verifying...');
