const fs = require('fs');

function fix(path, replacements) {
  let c = fs.readFileSync(path, 'utf8');
  for (const [from, to] of replacements) {
    c = c.split(from).join(to);
  }
  fs.writeFileSync(path, c);
  console.log('fixed:', path);
}

// AuthLayout
fix('components/AuthLayout.tsx', [
  ['bg-purple-600/15', 'bg-primary/10'],
  ['bg-fuchsia-500/10', 'bg-primary/8'],
  ['from-purple-600 to-fuchsia-500', 'bg-primary'],
  ['bg-gradient-to-br from-purple-600 to-fuchsia-500', 'bg-primary'],
  ['text-purple-400', 'text-primary'],
  ['text-purple-300', 'text-primary/80'],
  ['from-purple-600/5 via-transparent to-fuchsia-500/5', 'from-primary/5 via-transparent to-primary/3'],
]);

// CTASection — still has leftover pink
fix('components/CTASection.tsx', [
  ['bg-accent-pink/20', ''],
  ['from-primary via-pink to-accent-pink', 'from-primary/20'],
  ['bg-gradient-to-r from-primary to-pink', 'bg-primary'],
  ['text-accent-pink', 'text-primary'],
]);

// DashboardLayout
fix('components/DashboardLayout.tsx', [
  ['from-purple-600 to-fuchsia-500', 'bg-primary'],
  ['bg-gradient-to-br from-purple-600 to-fuchsia-500', 'bg-primary'],
  ['bg-purple-600/20 text-purple-400 border border-purple-500/20', 'bg-primary/20 text-primary border border-primary/20'],
  ['text-purple-400', 'text-primary'],
]);

// BentoSection — script didn't fully apply earlier
fix('components/BentoSection.tsx', [
  ['from-purple-400 to-fuchsia-400 bg-clip-text text-transparent', 'text-primary'],
  ['bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent', 'text-primary'],
  ['hover:border-purple-400/30', 'hover:border-primary/30'],
  ['text-purple-400', 'text-primary'],
  ['hover:border-fuchsia-400/30', 'hover:border-primary/30'],
  ['text-fuchsia-400', 'text-primary'],
  ["['#a855f7'], ['Visitors', '89', '#e879f9']", "['#f59e0b'], ['Visitors', '89', '#fbbf24']"],
  ["[['Questions', '142', '#a855f7'], ['Visitors', '89', '#e879f9'], ['Rate', '98%', '#22c55e']]", "[['Questions', '142', '#f59e0b'], ['Visitors', '89', '#fbbf24'], ['Rate', '98%', '#22c55e']]"],
  ['from-purple-500 to-fuchsia-500', 'bg-primary'],
  ['bg-gradient-to-r from-purple-500 to-fuchsia-500', 'bg-primary'],
  ["['#a855f7','#3b82f6','#22c55e','#f97316','#ec4899']", "['#f59e0b','#3b82f6','#22c55e','#ef4444','#f97316']"],
]);

// ProblemSection
fix('components/ProblemSection.tsx', [
  ['from-primary/40 to-pink/40', 'from-primary/20 to-primary/10'],
]);

// ProfilePreview
fix('components/ProfilePreview.tsx', [
  ['bg-accent-pink/10', 'bg-primary/8'],
  ['to-accent-pink/10', 'to-primary/8'],
]);

// SocialProof
fix('components/SocialProof.tsx', [
  ["'text-accent-pink'", "'text-primary'"],
]);

// TeamSection
fix('components/TeamSection.tsx', [
  ['from-primary to-accent-pink', 'from-primary to-primary/60'],
  ['from-accent-pink to-accent-red', 'from-primary/80 to-accent-red'],
]);

// ProductExplainer
fix('components/ProductExplainer.tsx', [
  ['from-primary to-pink', 'from-primary to-primary/60'],
]);

// HowItWorks
fix('components/HowItWorks.tsx', [
  ['from-primary to-accent-pink', 'from-primary to-primary/60'],
  ['from-accent-pink to-accent-red', 'from-primary/80 to-accent-red'],
  ['from-accent-yellow to-accent-pink', 'from-accent-yellow to-primary'],
  ['from-primary via-accent-pink to-accent-yellow', 'from-primary via-primary/80 to-accent-yellow'],
]);

// UploadSection
fix('components/UploadSection.tsx', [
  ["'from-primary to-pink'", "'from-primary to-primary/60'"],
  ["'from-pink to-accent-red'", "'from-primary/80 to-accent-red'"],
]);

// ProfilesSection
fix('components/ProfilesSection.tsx', [
  ['from-pink-500 to-rose-500', 'from-primary to-primary/60'],
  ['from-purple-600 to-fuchsia-500', 'from-primary to-primary/60'],
  ['text-purple-400', 'text-primary'],
  ['text-purple-300', 'text-primary/80'],
]);

// ProfileDropdown
fix('components/ProfileDropdown.tsx', [
  ['from-primary to-pink', 'bg-primary'],
  ['bg-gradient-to-br from-primary to-pink', 'bg-primary'],
]);

// DashboardAI
fix('components/DashboardAI.tsx', [
  ['from-primary to-pink', 'bg-primary'],
  ['bg-gradient-to-br from-primary to-pink', 'bg-primary'],
  ['bg-gradient-to-r from-primary to-pink', 'bg-primary'],
]);

// avatar-upload
fix('components/avatar-upload.tsx', [
  ['from-purple-500 to-blue-500', 'from-primary to-primary/60'],
  ['bg-gradient-to-br from-purple-500 to-blue-500', 'bg-primary'],
]);

console.log('All purple/pink references replaced');
