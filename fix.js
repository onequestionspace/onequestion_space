const fs = require('fs');

const files = [
  'app/dashboard/analytics/page.tsx',
  'app/dashboard/billing/page.tsx',
  'app/dashboard/knowledge/page.tsx',
  'app/dashboard/page.tsx',
  'app/dashboard/settings/page.tsx',
  'app/dashboard/train/page.tsx',
  'app/dashboard/blogs/page.tsx',
  'app/dashboard/admin/page.tsx',
  'app/dashboard/studio/page.tsx',
  'components/DashboardLayout.tsx',
  'components/DashboardAI.tsx',
];

const replacements = [
  [/#a855f7/g, '#f59e0b'],
  [/from-primary to-pink/g, 'from-amber-500 to-orange-400'],
  [/from-primary\/(\d+)/g, 'from-amber-500/$1'],
  [/to-pink\/(\d+)/g, 'to-orange-400/$1'],
  [/bg-primary\/(\d+)/g, 'bg-amber-500/$1'],
  [/bg-primary(?![/-])/g, 'bg-amber-500'],
  [/text-primary/g, 'text-amber-500'],
  [/border-primary\/(\d+)/g, 'border-amber-500/$1'],
  [/border-primary(?![/-])/g, 'border-amber-500'],
  [/ring-primary\/(\d+)/g, 'ring-amber-500/$1'],
  [/shadow-glow-primary/g, 'shadow-amber-500/20'],
  [/hover:shadow-glow-primary/g, 'hover:shadow-amber-500/20'],
  [/accent-primary/g, 'accent-amber-500'],
  [/fill-primary/g, 'fill-amber-500'],
  [/stroke-primary/g, 'stroke-amber-500'],
];

let totalChanges = 0;
for (const file of files) {
  try {
    let c = fs.readFileSync(file, 'utf8');
    const original = c;
    for (const [from, to] of replacements) {
      c = c.replace(from, to);
    }
    if (c !== original) {
      fs.writeFileSync(file, c);
      totalChanges++;
      console.log('updated:', file);
    }
  } catch (e) {
    console.warn('skip:', file, e.message);
  }
}
console.log('done —', totalChanges, 'files updated');
