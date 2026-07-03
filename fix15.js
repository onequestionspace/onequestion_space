const fs = require('fs');
const path = 'components/DashboardLayout.tsx';
let content = fs.readFileSync(path, 'utf8');

const old = `const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Space Studio', href: '/dashboard/studio', icon: Layers },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Knowledge', href: '/dashboard/knowledge', icon: BookOpen },
  { label: 'Billing', href: '/dashboard/billing', icon: CreditCard },
];`;

const next = `const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Space Studio', href: '/dashboard/studio', icon: Layers },
  { label: 'Inbox', href: '/dashboard/inbox', icon: Inbox },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Knowledge', href: '/dashboard/knowledge', icon: BookOpen },
  { label: 'Billing', href: '/dashboard/billing', icon: CreditCard },
];`;

if (!content.includes(old)) {
  console.error('❌ navItems pattern not found — printing current navItems block for manual check:');
  const match = content.match(/const navItems = \[[\s\S]*?\];/);
  console.log(match ? match[0] : '(not found at all)');
  process.exit(1);
}
content = content.replace(old, next);
fs.writeFileSync(path, content);
console.log('✅ Inbox added to navItems.');
