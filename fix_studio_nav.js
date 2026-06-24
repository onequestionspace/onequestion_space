const fs = require('fs');
let code = fs.readFileSync('components/DashboardLayout.tsx', 'utf8');

code = code.replace(
  `const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Knowledge', href: '/dashboard/knowledge', icon: Brain },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Profile', href: '/dashboard/profile', icon: User },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  { label: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { label: 'Train AI', href: '/dashboard/train', icon: Sparkles },
];`,
  `const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Space Studio ✦', href: '/dashboard/studio', icon: Layers },
  { label: 'Knowledge', href: '/dashboard/knowledge', icon: Brain },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { label: 'Train AI', href: '/dashboard/train', icon: Sparkles },
];`
);

fs.writeFileSync('components/DashboardLayout.tsx', code);
console.log('Done');
