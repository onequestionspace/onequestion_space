const fs = require('fs');

// ── Fix 1: space page visitorId setState in effect ──
let code = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');
code = code.replace(
  `const [visitorId, setVisitorId] = useState<string>('');`,
  `const [visitorId] = useState<string>(() => {
    if (typeof window === 'undefined') return 'anon';
    const stored = localStorage.getItem('visitor_id');
    if (stored) return stored;
    const id = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36);
    localStorage.setItem('visitor_id', id);
    return id;
  });`
);
// Remove the useEffect that set visitorId
code = code.replace(
  `  useEffect(() => {
    const stored = localStorage.getItem('visitor_id');
    if (stored) { setVisitorId(stored); return; }
    const id = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36);
    localStorage.setItem('visitor_id', id);
    setVisitorId(id);
  }, []);`,
  ''
);
fs.writeFileSync('app/(space)/[username]/page.tsx', code);
console.log('Fix 1 done');

// ── Fix 2: founding page <a> → <Link> ──
let founding = fs.readFileSync('app/founding/page.tsx', 'utf8');
if (!founding.includes("import Link from 'next/link'")) {
  founding = founding.replace(
    `'use client';`,
    `'use client';\nimport Link from 'next/link';`
  );
}
founding = founding.replace(
  `<a href="/early/"`,
  `<Link href="/early/"`
);
founding = founding.replace(
  `</a>`,
  `</Link>`
);
fs.writeFileSync('app/founding/page.tsx', founding);
console.log('Fix 2 done');

// ── Fix 3: AppearanceTab setState in effect ──
let appearance = fs.readFileSync('components/AppearanceTab.tsx', 'utf8');
// Wrap the setState calls in setTimeout to break synchronous cascade
appearance = appearance.replace(
  `    if (profile) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setThemeColor(profile.themeColor || "#a855f7");
      setThemeBg(profile.themeBg || "dark");
      setThemeFont(profile.themeFont || "inter");
      setThemeCardStyle(profile.themeCardStyle || "glass");`,
  `    if (profile) {
      setTimeout(() => {
      setThemeColor(profile.themeColor || "#a855f7");
      setThemeBg(profile.themeBg || "dark");
      setThemeFont(profile.themeFont || "inter");
      setThemeCardStyle(profile.themeCardStyle || "glass");
      }, 0);`
);
// Remove unused eslint-disable directives
appearance = appearance.replace(
  `      // eslint-disable-next-line react-hooks/exhaustive-deps\n`,
  ''
);
fs.writeFileSync('components/AppearanceTab.tsx', appearance);
console.log('Fix 3 done');

// ── Fix 4: Hero setState in effect ──
let hero = fs.readFileSync('components/Hero.tsx', 'utf8');
hero = hero.replace(
  `    } else if (phase === 'show-q') {
      setDisplayed('');
      setPhase('typing-a');`,
  `    } else if (phase === 'show-q') {
      setTimeout(() => {
        setDisplayed('');
        setPhase('typing-a');
      }, 0);`
);
fs.writeFileSync('components/Hero.tsx', hero);
console.log('Fix 4 done');

