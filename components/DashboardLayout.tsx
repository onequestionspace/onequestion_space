'use client';

import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Avatar } from '@/components/dashboard/Avatar';
import { ToastProvider } from '@/components/dashboard/Toast';
import { isAdminUser } from '@/convex/userIds';
import {
  LayoutDashboard, Brain, BarChart3,
  Menu, X,
  MessageSquare, CreditCard,
  Layers, BookOpen, Sparkles, UserPlus,
  ChevronRight, Inbox, LockKeyhole, Wrench, FileText, GraduationCap,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Chat', href: '/dashboard/chat', icon: Sparkles },
  { label: 'Studio', href: '/dashboard/studio', icon: Layers },
  { label: 'Inbox', href: '/dashboard/inbox', icon: Inbox },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3, pro: true },
  { label: 'Knowledge', href: '/dashboard/knowledge', icon: BookOpen },
  { label: 'Train', href: '/dashboard/train', icon: GraduationCap },
  { label: 'Tools', href: '/dashboard/tools/post-generator', icon: Wrench },
  { label: 'Content', href: '/dashboard/blogs', icon: FileText },
  { label: 'Billing', href: '/dashboard/billing', icon: CreditCard },
];

const secondaryItems = [
  { label: 'Settings', href: '/dashboard/settings', icon: Brain },
];

export function DashboardLayout({ children, title, description }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const profile = useQuery(api.profiles.current);
  const subscription = useQuery(
    api.subscriptions.getSubscription,
    user?.id ? { userId: user.id } : 'skip'
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const isAdmin = isAdminUser(user?.id);
  const isPro = subscription?.plan === 'pro' && subscription.status === 'active';

  return (
    <div className="dashboard-shell nest-background min-h-screen text-zinc-950">
      <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400" />
      {/* Mobile header bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 border-b border-zinc-200 bg-white">
        <Link href="/" className="flex items-center gap-2" aria-label="Home">
          <div className="w-7 h-7 rounded-md bg-black flex items-center justify-center">
            <MessageSquare className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-black">OneQuestion</span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
          className="p-2 text-zinc-600 hover:text-black transition-colors"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-black/20 transition-opacity duration-200 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-zinc-200 z-40 flex flex-col transition-transform duration-300 ease-out ${
          isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
        }`}
        aria-label="Dashboard navigation"
      >
        <div className="flex items-center gap-2.5 px-5 h-14 border-b border-zinc-200 shrink-0">
          <div className="w-8 h-8 rounded-md bg-black flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-black">OneQuestion</span>
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4 space-y-4">
          <div>
            <p className="px-3 text-[10px] font-medium text-zinc-500 uppercase tracking-[0.12em] mb-2">Workspace</p>
            <div className="space-y-0.5">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                const isLocked = item.pro && !isPro && !isAdmin;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={`relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                      isActive
                        ? 'text-black bg-zinc-100'
                        : 'text-zinc-600 hover:text-black hover:bg-zinc-50'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={isLocked ? `${item.label}, Pro plan` : undefined}
                  >
                    <item.icon className={`h-4 w-4 ${isActive ? 'text-black' : 'text-zinc-500'}`} />
                    {item.label}
                    {isLocked && <LockKeyhole className="ml-auto h-3.5 w-3.5 text-zinc-400" />}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-200">
            <p className="px-3 text-[10px] font-medium text-zinc-500 uppercase tracking-[0.12em] mb-2">Account</p>
            <div className="space-y-0.5">
              {secondaryItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={`relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                      isActive
                        ? 'text-black bg-zinc-100'
                        : 'text-zinc-600 hover:text-black hover:bg-zinc-50'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <item.icon className={`h-4 w-4 ${isActive ? 'text-black' : 'text-zinc-500'}`} />
                    {item.label}
                  </Link>
                );
              })}
              {isAdmin && (
                <>
                  <Link
                    href="/dashboard/admin/prospects"
                    onClick={closeMenu}
                    className={`relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                      pathname === '/dashboard/admin/prospects' || pathname.startsWith('/dashboard/admin/prospects/')
                        ? 'text-black bg-zinc-100 before:absolute before:left-0 before:top-1/2 before:h-5 before:w-0.5 before:-translate-y-1/2 before:rounded-full before:bg-purple-500'
                        : 'text-zinc-600 hover:text-black hover:bg-zinc-50'
                    }`}
                  >
                    <UserPlus className="h-4 w-4 text-zinc-500" />
                    Prospect Studio
                  </Link>
                  <Link
                    href="/dashboard/admin"
                    onClick={closeMenu}
                    className={`relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                      pathname === '/dashboard/admin'
                        ? 'text-black bg-zinc-100'
                        : 'text-zinc-600 hover:text-black hover:bg-zinc-50'
                    }`}
                  >
                    <Brain className="h-4 w-4 text-zinc-500" />
                    Admin
                  </Link>
                </>
              )}
            </div>
          </div>

        </nav>

        <div className="shrink-0 border-t border-zinc-200 p-3">
          <Link href="/dashboard/settings" onClick={closeMenu} className="flex items-center gap-3 group rounded-lg px-2 py-2 hover:bg-zinc-50 transition-colors">
            <Avatar
              src={profile?.avatar || user?.imageUrl}
              name={user?.fullName || user?.username}
              size="sm"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-zinc-900 truncate">
                {user?.fullName || user?.username || 'User'}
              </p>
              <p className="text-[11px] text-zinc-500 truncate">
                {user?.primaryEmailAddress?.emailAddress || ''}
              </p>
            </div>
            <ChevronRight className="w-3 h-3 text-zinc-400 group-hover:text-zinc-700 transition-colors" />
          </Link>
        </div>
      </aside>

      <main className="lg:pl-64 pt-14 lg:pt-0 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-zinc-950 mb-1">{title}</h1>
            {description && <p className="text-zinc-500 text-sm">{description}</p>}
          </div>
          <nav aria-label="Your OneQuestion workflow" className="mb-6 rounded-xl border border-zinc-200 bg-white p-3 sm:p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">Your workflow</p>
              <p className="text-xs text-zinc-500">Build it · teach it · test it · share it · improve it</p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {[
                { label: '1. Create', detail: 'Your page', href: '/dashboard' },
                { label: '2. Teach', detail: 'Add knowledge', href: '/dashboard/knowledge' },
                { label: '3. Test', detail: 'Check an answer', href: '/dashboard/chat' },
                { label: '4. Share', detail: 'Your public space', href: '/dashboard/studio' },
                { label: '5. Improve', detail: 'Review questions', href: '/dashboard/inbox' },
              ].map((step) => {
                const active = step.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname === step.href || pathname.startsWith(step.href + '/');
                return (
                  <Link
                    key={step.href}
                    href={step.href}
                    aria-current={active ? 'step' : undefined}
                    className={`rounded-lg border px-3 py-2.5 transition-colors ${active
                      ? 'border-zinc-900 bg-zinc-900 text-white'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50'}`}
                  >
                    <span className="block text-sm font-semibold">{step.label}</span>
                    <span className={`mt-0.5 block text-xs ${active ? 'text-zinc-300' : 'text-zinc-500'}`}>{step.detail}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
          <ToastProvider>
            {children}
          </ToastProvider>
        </div>
      </main>

    </div>
  );
}
