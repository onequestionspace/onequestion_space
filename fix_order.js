const fs = require('fs');

let auth = fs.readFileSync('components/AuthLayout.tsx', 'utf8');
auth = auth.replace("import Image from 'next/image';\n'use client';", "'use client';\nimport Image from 'next/image';");
fs.writeFileSync('components/AuthLayout.tsx', auth);

let sol = fs.readFileSync('components/SolutionSection.tsx', 'utf8');
sol = sol.replace("import Image from 'next/image';\n'use client';", "'use client';\nimport Image from 'next/image';");
fs.writeFileSync('components/SolutionSection.tsx', sol);

console.log('Done');
