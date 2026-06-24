const fs = require('fs');
let code = fs.readFileSync('components/ProblemSection.tsx', 'utf8');

// Remove the Image import that got prepended before 'use client'
code = code.replace(`import Image from 'next/image';\n'use client';`, `'use client';\nimport Image from 'next/image';`);

fs.writeFileSync('components/ProblemSection.tsx', code);
console.log('Done');
