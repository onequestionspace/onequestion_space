const fs = require('fs');

// ── Fix 1: founding page line 218 <a href="/early"> → <Link> ──
let founding = fs.readFileSync('app/founding/page.tsx', 'utf8');
founding = founding.replace(
  `            <a href="/early" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-medium hover:bg-primary/20 transition-colors">`,
  `            <Link href="/early" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-medium hover:bg-primary/20 transition-colors">`
);
founding = founding.replace(
  `            </a>\n            Built by`,
  `            </Link>\n            Built by`
);
fs.writeFileSync('app/founding/page.tsx', founding);
console.log('Fix 1 done');

// ── Fix 2: AppearanceTab — remove unused eslint-disable ──
let appearance = fs.readFileSync('components/AppearanceTab.tsx', 'utf8');
appearance = appearance.replace(
  `  // eslint-disable-next-line react-hooks/exhaustive-deps\n`,
  ''
);
fs.writeFileSync('components/AppearanceTab.tsx', appearance);
console.log('Fix 2 done');

// ── Fix 3: DashboardAI — remove unused eslint-disable ──
let dashboard = fs.readFileSync('components/DashboardAI.tsx', 'utf8');
dashboard = dashboard.replace(
  `  // eslint-disable-next-line react-hooks/set-state-in-effect\n`,
  ''
);
fs.writeFileSync('components/DashboardAI.tsx', dashboard);
console.log('Fix 3 done');

// ── Fix 4: Navbar — <img> → <Image> ──
let navbar = fs.readFileSync('components/Navbar.tsx', 'utf8');
if (!navbar.includes("import Image from 'next/image'")) {
  navbar = navbar.replace(
    `import Image from 'next/image';`,
    `import Image from 'next/image';`
  );
}
navbar = navbar.replace(
  `{profile?.avatar ? <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" /> : (profile?.displayName?.charAt(0)?.toUpperCase() || "U")}`,
  `{profile?.avatar ? <Image src={profile.avatar} alt="avatar" width={32} height={32} className="w-full h-full object-cover" /> : (profile?.displayName?.charAt(0)?.toUpperCase() || "U")}`
);
fs.writeFileSync('components/Navbar.tsx', navbar);
console.log('Fix 4 done');

// ── Fix 5: ProblemSection — <img> → <Image> ──
let problem = fs.readFileSync('components/ProblemSection.tsx', 'utf8');
if (!problem.includes("import Image from 'next/image'")) {
  problem = `import Image from 'next/image';\n` + problem;
}
problem = problem.replace(
  `        <img src={avatar} alt={name} className="w-full h-full object-cover" />`,
  `        <Image src={avatar} alt={name} width={32} height={32} className="w-full h-full object-cover" />`
);
fs.writeFileSync('components/ProblemSection.tsx', problem);
console.log('Fix 5 done');

// ── Fix 6: avatar-upload — <img> → <Image> ──
let avatar = fs.readFileSync('components/avatar-upload.tsx', 'utf8');
if (!avatar.includes("import Image from 'next/image'")) {
  avatar = `import Image from 'next/image';\n` + avatar;
}
avatar = avatar.replace(
  /<img src=\{(.*?)\} alt="avatar preview" className="(.*?)" \/>/,
  `<Image src={$1} alt="avatar preview" width={80} height={80} className="$2" />`
);
fs.writeFileSync('components/avatar-upload.tsx', avatar);
console.log('Fix 6 done');

