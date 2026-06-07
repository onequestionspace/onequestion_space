const fs = require('fs');
let content = fs.readFileSync('components/ProfilePreview.tsx', 'utf8');

if (!content.includes("import Image from 'next/image'")) {
  content = content.replace(
    "'use client';",
    "'use client';\nimport Image from 'next/image';"
  );
}

content = content.replace(
  '<div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-accent-pink to-accent-red flex items-center justify-center text-3xl font-bold text-white mb-4 ring-4 ring-white/10">\n                  A\n                </div>',
  '<Image src="/founders/asym.png" alt="Asym" width={96} height={96} className="w-24 h-24 rounded-full object-cover mb-4 ring-4 ring-white/10" />'
);

fs.writeFileSync('components/ProfilePreview.tsx', content);
console.log('Done');
