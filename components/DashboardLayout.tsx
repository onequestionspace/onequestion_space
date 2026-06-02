'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BarChart3, 
  Brain, 
  Settings, 
  CreditCard,
  ArrowLeft
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Knowledge Base', href: '/dashboard/knowledge', icon: Brain },
  { label: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function DashboardLayout({ children, title, description }: DashboardLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      {/* Background mesh */}
      <div className="fixed inset-0 -z-10">
        <div className="mesh-gradient opacity-50" />
        <div className="dot-pattern" />
      </div>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 glass-card border-r border-border p-6 hidden lg:block">
        <Link href="/" className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-pink" />
          <span className="text-xl font-bold text-foreground">OneQuestion</span>
        </Link>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-card'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <Link 
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 glass-card border-b border-border px-4 flex items-center justify-between z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-pink" />
          <span className="text-lg font-bold text-foreground">OneQuestion</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="lg:pl-64 pt-16 lg:pt-0 p-6 lg:p-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
            {description && <p className="text-muted-foreground">{description}</p>}
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
