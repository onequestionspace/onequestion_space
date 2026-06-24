const fs = require('fs');
let code = fs.readFileSync('components/Navbar.tsx', 'utf8');
code = code.replace(
  `<Link href="/dashboard/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white hover:bg-white/10 transition-colors">`,
  `<Link href="/dashboard/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white hover:bg-white/10 transition-colors">`
);
fs.writeFileSync('components/Navbar.tsx', code);
console.log('Done');
