const fs = require('fs');

function fix(path, pairs) {
  try {
    let c = fs.readFileSync(path, 'utf8');
    for (const [from, to] of pairs) c = c.split(from).join(to);
    fs.writeFileSync(path, c);
    console.log('fixed:', path);
  } catch(e) { console.log('skip:', path); }
}

const pinkToAmber = [
  ['from-primary to-pink', 'bg-primary'],
  ['bg-gradient-to-r from-primary to-pink', 'bg-primary'],
  ['bg-gradient-to-br from-primary to-pink', 'bg-primary'],
  ['from-primary to-pink-500', 'bg-primary'],
  ['bg-gradient-to-r from-primary to-pink-500', 'bg-primary'],
  ['bg-gradient-to-br from-primary to-pink-500', 'bg-primary'],
  ['from-primary/5 to-pink/5', 'from-primary/5 to-primary/3'],
  ['text-white font-bold', 'text-black font-bold'],
];

// space page
fix('app/(space)/[username]/page.tsx', [
  ['border-purple-500/30 border-t-purple-500', 'border-primary/30 border-t-primary'],
  ['bg-purple-600', 'bg-primary'],
  ['hover:bg-purple-500', 'hover:bg-primary/90'],
  ['text-white text-sm font-medium hover:bg-purple-500', 'text-black text-sm font-medium hover:bg-primary/90'],
]);

// blog
fix('app/blog/page.tsx', pinkToAmber);

// billing
fix('app/dashboard/billing/page.tsx', [
  ['accent-purple-500', 'accent-amber-500'],
]);

// knowledge
fix('app/dashboard/knowledge/page.tsx', pinkToAmber);

// dashboard
fix('app/dashboard/page.tsx', pinkToAmber);

// settings
fix('app/dashboard/settings/page.tsx', [
  ['focus:ring-purple-500/40 focus:border-purple-500/40', 'focus:ring-primary/40 focus:border-primary/40'],
  ['bg-purple-600/20 text-purple-400 border border-purple-500/20', 'bg-primary/20 text-primary border border-primary/20'],
  ['from-purple-600 via-fuchsia-500 to-rose-500', 'bg-primary'],
  ['bg-gradient-to-br from-purple-600 via-fuchsia-500 to-rose-500', 'bg-primary'],
  ['ring-purple-500/30', 'ring-primary/30'],
  ['text-purple-400 hover:text-purple-300', 'text-primary hover:text-primary/80'],
  ['text-purple-400', 'text-primary'],
  ['from-purple-600 to-rose-500', 'bg-primary'],
  ['bg-gradient-to-r from-purple-600 to-rose-500', 'bg-primary'],
  ['bg-purple-600/10', 'bg-primary/10'],
]);

// train
fix('app/dashboard/train/page.tsx', pinkToAmber);

// studio
fix('app/dashboard/studio/page.tsx', [
  ['focus:ring-purple-500/40 focus:border-purple-500/40', 'focus:ring-primary/40 focus:border-primary/40'],
  ['from-purple-600 to-rose-500', 'bg-primary'],
  ['bg-gradient-to-r from-purple-600 to-rose-500', 'bg-primary'],
  ['text-purple-400', 'text-primary'],
  ['text-purple-300', 'text-primary/80'],
  ['hover:text-purple-300', 'hover:text-primary/80'],
  ['bg-purple-600/20 text-purple-400 border-purple-500/20', 'bg-primary/20 text-primary border-primary/20'],
  ['bg-purple-600/20', 'bg-primary/20'],
  ['border-purple-500/20', 'border-primary/20'],
  ['border-purple-500/40', 'border-primary/40'],
  ['bg-purple-500/8', 'bg-primary/8'],
  ['hover:border-purple-500/20', 'hover:border-primary/20'],
  ['border-purple-500 bg-purple-500', 'border-primary bg-primary'],
  ['hover:bg-purple-500/10', 'hover:bg-primary/10'],
  ['bg-purple-600/10', 'bg-primary/10'],
  ['border-purple-500/30', 'border-primary/30'],
]);

// sign-in
fix('app/sign-in/[[...sign-in]]/page.tsx', [
  ['!from-purple-600 !to-rose-500', '!bg-primary'],
  ['!bg-gradient-to-r !from-purple-600 !to-rose-500', '!bg-primary'],
  ['!text-purple-400 hover:!text-purple-300', '!text-primary hover:!text-primary/80'],
  ['!text-purple-400', '!text-primary'],
  ['focus:!border-purple-500/60 focus:!ring-2 focus:!ring-purple-500/20', 'focus:!border-primary/60 focus:!ring-2 focus:!ring-primary/20'],
]);

// sign-up
fix('app/sign-up/[[...sign-up]]/page.tsx', [
  ['!from-purple-600 !to-rose-500', '!bg-primary'],
  ['!bg-gradient-to-r !from-purple-600 !to-rose-500', '!bg-primary'],
  ['!text-purple-400 hover:!text-purple-300', '!text-primary hover:!text-primary/80'],
  ['!text-purple-400', '!text-primary'],
  ['focus:!border-purple-500/60 focus:!ring-2 focus:!ring-purple-500/20', 'focus:!border-primary/60 focus:!ring-2 focus:!ring-primary/20'],
  ['border-purple-500/30 bg-purple-500/10', 'border-primary/30 bg-primary/10'],
  ['text-purple-400 font-bold', 'text-primary font-bold'],
]);

// privacy, terms, blog shared pattern
fix('app/privacy/page.tsx', pinkToAmber);
fix('app/terms/page.tsx', pinkToAmber);

// contact
fix('app/contact/page.tsx', [
  ["'from-primary to-pink'", "'from-primary to-primary/60'"],
  ["'from-pink to-accent-red'", "'from-primary/80 to-accent-red'"],
  ['from-primary to-pink', 'bg-primary'],
  ['bg-gradient-to-r from-primary to-pink', 'bg-primary'],
  ['bg-gradient-to-br from-primary to-pink', 'bg-primary'],
]);

// waitlist
fix('app/waitlist/page.tsx', pinkToAmber);

// features
fix('app/features/page.tsx', [
  ["'text-fuchsia-400'", "'text-primary'"],
  ["'bg-fuchsia-400/10'", "'bg-primary/10'"],
  ["'text-purple-400'", "'text-primary'"],
  ["'bg-purple-400/10'", "'bg-primary/10'"],
  ['from-primary to-pink-500 bg-clip-text text-transparent', 'text-primary'],
  ['bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent', 'text-primary'],
  ['from-primary to-pink-500', 'bg-primary'],
  ['bg-gradient-to-r from-primary to-pink-500', 'bg-primary'],
]);

// onboarding
fix('app/onboarding/page.tsx', [
  ['bg-purple-600/15', 'bg-primary/10'],
  ['bg-fuchsia-500/10', 'bg-primary/8'],
  ['accent-purple-500', 'accent-amber-500'],
  ['from-primary to-pink', 'bg-primary'],
  ['bg-gradient-to-r from-primary to-pink', 'bg-primary'],
  ['from-primary/5 to-pink/5', 'from-primary/5 to-primary/3'],
  // buttons — keep text-white since these are action buttons (amber bg looks ok with white too)
]);

// founding + early
fix('app/founding/page.tsx', [
  ['from-primary to-pink-500', 'text-primary'],
  ['bg-gradient-to-r from-primary to-pink-500', 'bg-primary'],
  ['text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-500', 'text-primary'],
]);
fix('app/early/page.tsx', [
  ['from-primary to-pink-500', 'text-primary'],
  ['bg-gradient-to-r from-primary to-pink-500', 'bg-primary'],
  ['text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-500', 'text-primary'],
  ['h-full bg-gradient-to-r from-primary to-pink-500 rounded-full', 'h-full bg-primary rounded-full'],
]);

console.log('All app purple/pink done');
