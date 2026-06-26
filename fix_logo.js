const fs = require('fs');
let c = fs.readFileSync('components/Navbar.tsx', 'utf8');
c = c.replace(
  `<Image src="/logo.png" alt="One Question" width={32} height={32} className="rounded-xl group-hover:scale-110 transition-transform ring-0 border-0" />`,
  `<div className="w-8 h-8 rounded-xl bg-background overflow-hidden group-hover:scale-110 transition-transform">
              <Image src="/logo.png" alt="One Question" width={32} height={32} className="w-full h-full object-cover" />
            </div>`
);
fs.writeFileSync('components/Navbar.tsx', c);
console.log('done');
