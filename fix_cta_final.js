const fs = require('fs');

// Fix CTASection - the old content is still there
let c = fs.readFileSync('components/CTASection.tsx', 'utf8');

// Remove the trust badges entirely from under the button
c = c.replace(
  `          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-zinc-500 text-sm">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-primary shrink-0" />
              <span>Free forever plan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-primary shrink-0" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-primary shrink-0" />
              <span>Live in 2 minutes</span>
            </div>
          </div>`,
  `<p className="text-zinc-600 text-sm">Free forever. No credit card. Live in 2 minutes.</p>`
);

fs.writeFileSync('components/CTASection.tsx', c);
console.log('CTA done');

// Fix logo purple ring in footer/navbar
let nav = fs.readFileSync('components/Navbar.tsx', 'utf8');
// already fixed but check for any purple circle around logo
console.log('navbar purple check:', nav.includes('purple') ? 'FOUND' : 'clean');
fs.writeFileSync('components/Navbar.tsx', nav);

