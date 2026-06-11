'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  User,
  Settings,
  ChevronDown,
  Menu,
  X,
  ArrowLeft
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const settingsSubItems = [
  { label: 'General', href: '/dashboard/settings' },
  { label: 'Billing', href: '/dashboard/billing' },
];

export function DashboardLayout({ children, title, description }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);
  const isSettingsActive = pathname.startsWith('/dashboard/settings') || pathname.startsWith('/dashboard/billing');

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 -z-10">
        <div className="mesh-gradient opacity-50" />
        <div className="dot-pattern" />
      </div>

      {/* Solid black hamburger with pink/purple */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-3 bg-black border-pink/40 rounded-xl shadow-lg shadow-pink/20"
      >
        {isOpen? <X className="w-6 h-6 text-pink" /> : <Menu className="w-6 h-6 text-purple" />}
      </button>

      {/* Solid black sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-black border-r border-pink/20 p-6 z-40 transform transition-transform duration-200 ${
        isOpen? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <Link href="/" onClick={closeMenu} className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-pink" />
          <span className="text-xl font-bold text-foreground">OneQuestion</span>
        </Link>

        <nav className="space-y-2">
          <div className="hidden lg:block">
            <Link href="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl ${pathname === '/dashboard' ? 'bg-gradient-to-r from-primary/20 to-pink/20 text-primary font-medium border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-card'}`}>
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
          </div>

          <div className="lg:hidden space-y-2">
            <Link href="/dashboard" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-card">
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>

            <Link href="/dashboard/profile" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-card">
              <User className="w-5 h-5" />
              Profile
            </Link>

            <div>
              <button onClick={() => setSettingsOpen(!settingsOpen)} className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl ${isSettingsActive ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-card'}`}>
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5" />
                  Settings
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${settingsOpen? 'rotate-180' : ''}`} />
              </button>

              {settingsOpen && (
                <div className="ml-11 mt-1 space-y-1">
                  {settingsSubItems.map((item) => (
                    <Link key={item.href} href={item.href} onClick={closeMenu} className={`block px-3 py-2 text-sm rounded-lg ${pathname === item.href ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <Link href="/" onClick={closeMenu} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </aside>

      {isOpen && <div className="lg:hidden fixed inset-0 bg-black/40 z-30" onClick={closeMenu} />}

      <main className="lg:pl-64 pt-20 lg:pt-0 p-6 lg:p-10">
        <div className="max-w-6xl mx-auto">
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
