const fs = require('fs');
let c = fs.readFileSync('app/dashboard/studio/page.tsx', 'utf8');

// Fix save button — black text on amber
c = c.replace(
  `className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold bg-gradient-to-r bg-primary hover:opacity-90 transition-all disabled:opacity-50 mt-4"`,
  `className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-black text-sm font-bold bg-primary hover:opacity-90 transition-all disabled:opacity-50 mt-4"`
);

// Fix title — more personal
c = c.replace(
  `<DashboardLayout title="Space Studio ✦" description="Your space updates as you build">`,
  `<DashboardLayout title="Space Studio" description="Build your space — changes go live instantly">`
);

// Fix completion bar label
c = c.replace(
  `<span className="text-sm font-semibold text-white">Space Completion</span>`,
  `<span className="text-sm font-semibold text-white">Your space is {score}% ready</span>`
);

// Remove duplicate score display
c = c.replace(
  `<span className="text-xs text-zinc-500">· {score}%</span>`,
  ``
);

// Make placeholder copy more human
c = c.replace(
  `placeholder="One line that makes people want to ask you something"`,
  `placeholder="CS student building from a phone in Nigeria"`
);

c = c.replace(
  `placeholder="Ask me anything about building in public!"`,
  `placeholder="Ask me anything — I reply fast."`
);

c = c.replace(
  `placeholder="Building the future from a phone in Nigeria."`,
  `placeholder="Building from a phone. Ask me anything."`
);

// Make the live preview header more exciting
c = c.replace(
  `<span className="text-xs text-zinc-400 font-medium">Live Preview</span>`,
  `<span className="text-xs text-zinc-400 font-medium">Your space — live</span>`
);

fs.writeFileSync('app/dashboard/studio/page.tsx', c);
console.log('studio done');
