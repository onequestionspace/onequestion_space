'use client';

import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Avatar } from '@/components/dashboard/Avatar';
import { ToastProvider } from '@/components/dashboard/Toast';
import {
  LayoutDashboard, Brain, BarChart3,
  Menu, X,
  MessageSquare, CreditCard,
  Layers, BookOpen, Sparkles,
  ChevronRight, Inbox,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Chat Your Knowledge', href: '/dashboard/chat', icon: Sparkles },
  { label: 'Space Studio', href: '/dashboard/studio', icon: Layers },
  { label: 'Inbox', href: '/dashboard/inbox', icon: Inbox },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Knowledge', href: '/dashboard/knowledge', icon: BookOpen },
  { label: 'Billing', href: '/dashboard/billing', icon: CreditCard },
];

const secondaryItems = [
  { label: 'Settings', href: '/dashboard/settings', icon: Brain },
];

export function DashboardLayout({ children, title, description }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const profile = useQuery(api.profiles.current);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const isAdmin = user?.id === 'user_3EhKmuVyC1AhoBDlL7QNssllwgu' || user?.id === 'user_3Ev3UAWNTTDAlVWSYFGGsEI6qQz';

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 border-b border-white/[0.06] bg-background">
        <Link href="/" className="flex items-center gap-2" aria-label="Home">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-amber-glow">
            <MessageSquare className="w-3.5 h-3.5 text-black" />
          </div>
          <span className="text-sm font-bold text-white">One<span className="text-primary">Question</span></span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
          className="p-2 text-zinc-400 hover:text-white transition-colors"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-black/75 transition-opacity duration-200 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-background/98 border-r border-white/[0.06] z-40 flex flex-col transition-transform duration-300 ease-out ${
          isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
        }`}
        aria-label="Dashboard navigation"
      >
        <div className="flex items-center gap-2.5 px-5 h-14 border-b border-white/[0.06] shrink-0">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-amber-glow">
            <MessageSquare className="w-4 h-4 text-black" />
          </div>
          <span className="text-sm font-bold text-white">
            One<span className="text-primary">Question</span>
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4 space-y-4">
          <div>
            <p className="px-3 text-[10px] font-medium text-zinc-600 uppercase tracking-[0.15em] mb-2">Main</p>
            <div className="space-y-0.5">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={`relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'text-primary bg-primary/[0.08]'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <div
                      className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-primary transition-opacity duration-150 ${
                        isActive ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      isActive ? 'bg-primary/15 text-primary' : 'text-zinc-500'
                    }`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-white/[0.06]">
            <p className="px-3 text-[10px] font-medium text-zinc-600 uppercase tracking-[0.15em] mb-2">Account</p>
            <div className="space-y-0.5">
              {secondaryItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={`relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'text-primary bg-primary/[0.08]'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <div
                      className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-primary transition-opacity duration-150 ${
                        isActive ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isActive ? 'bg-primary/15 text-primary' : 'text-zinc-500'
                    }`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    {item.label}
                  </Link>
                );
              })}
              {isAdmin && (
                <Link
                  href="/dashboard/admin"
                  onClick={closeMenu}
                  className={`relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                    pathname === '/dashboard/admin'
                      ? 'text-primary bg-primary/[0.08]'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
                  }`}
                >
                  <div
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-primary transition-opacity duration-150 ${
                      pathname === '/dashboard/admin' ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500">
                    <Brain className="w-4 h-4" />
                  </div>
                  Admin
                </Link>
              )}
            </div>
          </div>

        </nav>

        <div className="shrink-0 border-t border-white/[0.06] p-3">
          <Link href="/dashboard/settings" onClick={closeMenu} className="flex items-center gap-3 group rounded-xl px-2 py-2 hover:bg-white/[0.03] transition-all">
            <Avatar
              src={profile?.avatar || user?.imageUrl}
              name={user?.fullName || user?.username}
              size="sm"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">
                {user?.fullName || user?.username || 'User'}
              </p>
              <p className="text-[11px] text-zinc-500 truncate">
                {user?.primaryEmailAddress?.emailAddress || ''}
              </p>
            </div>
            <ChevronRight className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
          </Link>
        </div>
      </aside>

      <main className="lg:pl-64 pt-14 lg:pt-0 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
          <div className="mb-6">
            <h1 className="text-xl lg:text-2xl font-bold text-white mb-0.5">{title}</h1>
            {description && <p className="text-zinc-500 text-sm">{description}</p>}
          </div>
          <ToastProvider>
            {children}
          </ToastProvider>
        </div>
      </main>

    </div>
  );
}
