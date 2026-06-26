const fs = require('fs');

// Fix HowItWorksSection
let how = fs.readFileSync('components/HowItWorksSection.tsx', 'utf8');

// Kill purple radial
how = how.replace(
  `      <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.06),transparent_70%)]' />`,
  ``
);

// Fix headline
how = how.replace(
  `          <h2 className='text-4xl md:text-5xl font-extrabold text-white leading-tight'>
            Up and running<br /><span className='gradient-text'>in under 5 minutes.</span>
          </h2>`,
  `          <h2 className='text-4xl md:text-5xl font-black text-white leading-tight tracking-tight'>
            Up and running<br /><span className='text-primary'>in under 5 minutes.</span>
          </h2>`
);

fs.writeFileSync('components/HowItWorksSection.tsx', how);
console.log('HowItWorksSection done');

// Fix Navbar
let nav = fs.readFileSync('components/Navbar.tsx', 'utf8');

// Simplify nav links — remove Contact
nav = nav.replace(
  `  const navLinks = [
    { name: 'Pricing', href: '/pricing' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];`,
  `  const navLinks = [
    { name: 'Blog', href: '/blog' },
    { name: 'Pricing', href: '/pricing' },
  ];`
);

// Fix avatar gradient — remove pink
nav = nav.replace(
  `className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-pink flex items-center justify-center text-white text-xs font-bold hover:shadow-glow transition-all overflow-hidden"`,
  `className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black text-xs font-bold hover:shadow-glow transition-all overflow-hidden"`
);

// Fix sign up button — remove white bg, use amber
nav = nav.replace(
  `className="text-xs font-bold px-4 py-1.5 rounded-full bg-white text-black hover:bg-primary hover:text-white transition-all flex items-center gap-1"`,
  `className="text-xs font-bold px-4 py-1.5 rounded-full bg-primary text-black hover:bg-primary/90 transition-all flex items-center gap-1"`
);

// Fix mobile sign up button
nav = nav.replace(
  `className="block text-center py-3 rounded-full bg-white text-black font-bold text-sm"`,
  `className="block text-center py-3 rounded-full bg-primary text-black font-bold text-sm"`
);

fs.writeFileSync('components/Navbar.tsx', nav);
console.log('Navbar done');

