const fs = require('fs');
let content = fs.readFileSync('app/[username]/page.tsx', 'utf8');

// Add Image import if not already there
if (!content.includes("import Image from 'next/image'")) {
  content = content.replace(
    "import Link from 'next/link';",
    "import Link from 'next/link';\nimport Image from 'next/image';"
  );
}

// Update avatar in mockProfile
content = content.replace(
  "avatar: '👤',",
  "avatar: `/founders/${username}.png`,"
);

// Replace avatar div with Image
content = content.replace(
  '<div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-pink to-accent flex items-center justify-center text-5xl ring-4 ring-primary/20 flex-shrink-0">\n                  {mockProfile.avatar}\n                </div>',
  '<Image src={mockProfile.avatar} alt={mockProfile.displayName} width={96} height={96} className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/20 flex-shrink-0" />'
);

fs.writeFileSync('app/[username]/page.tsx', content);
console.log('Done');
