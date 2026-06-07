const fs = require('fs');
let content = fs.readFileSync('app/[username]/page.tsx', 'utf8');

if (!content.includes("import Image from 'next/image'")) {
  content = content.replace(
    "import Link from 'next/link';",
    "import Link from 'next/link';\nimport Image from 'next/image';"
  );
}

content = content.replace(
  /<div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-pink to-accent flex items-center justify-center text-5xl ring-4 ring-primary\/20 flex-shrink-0">\s*\{mockProfile\.avatar\}\s*<\/div>/,
  '<Image src={`/founders/${username}.png`} alt={mockProfile.displayName} width={96} height={96} className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/20 flex-shrink-0" onError={(e) => { e.currentTarget.style.display = "none"; }} />'
);

fs.writeFileSync('app/[username]/page.tsx', content);
console.log('Done');
