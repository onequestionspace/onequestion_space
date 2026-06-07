const fs = require('fs');
let content = fs.readFileSync('components/TeamSection.tsx', 'utf8');

content = content.replace(
  "'use client';",
  "'use client';\nimport Image from 'next/image';"
);

content = content.replace("avatar: 'A',", "avatar: '/founders/asym.png',");
content = content.replace("avatar: 'P',", "avatar: '/founders/paraja.png',");

content = content.replace(
  /\<div className=\{`w-16 h-16 rounded-full bg-gradient-to-br \$\{member\.gradient\} flex items-center justify-center text-2xl font-bold text-white mb-4`\}>\s*\{member\.avatar\}\s*<\/div>/,
  '<Image src={member.avatar} alt={member.name} width={64} height={64} className="w-16 h-16 rounded-full object-cover mb-4" />'
);

fs.writeFileSync('components/TeamSection.tsx', content);
console.log('Done');
