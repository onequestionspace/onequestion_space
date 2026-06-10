const fs = require('fs');

let auth = fs.readFileSync('components/AuthLayout.tsx', 'utf8');
auth = "import Image from 'next/image';\n" + auth;
auth = auth.replace(
  '<span className="text-white font-bold text-2xl">Q</span>',
  '<Image src="/logo.png" alt="One Question" width={32} height={32} className="rounded-xl" />'
);
fs.writeFileSync('components/AuthLayout.tsx', auth);

let sol = fs.readFileSync('components/SolutionSection.tsx', 'utf8');
sol = "import Image from 'next/image';\n" + sol;
sol = sol.replace(
  '<div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-pink flex items-center justify-center text-white font-bold text-sm">A</div>',
  '<Image src="/founders/asym.png" alt="Asym" width={40} height={40} className="w-10 h-10 rounded-full object-cover" />'
);
fs.writeFileSync('components/SolutionSection.tsx', sol);

console.log('Done');
