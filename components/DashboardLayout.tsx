'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '@/components/dashboard/Avatar';
import { DashboardAI } from './DashboardAI';
import { ToastProvider } from '@/components/dashboard/Toast';
import {
  LayoutDashboard, Brain, BarChart3,
  Menu, X,
  MessageSquare, CreditCard,
  Layers, BookOpen, Sparkles,
  Globe, Inbox, ChevronRight,
  Zap,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Space Studio', href: '/dashboard/studio', icon: Layers },
  { label: 'Inbox', href: '/dashboard/inbox', icon: Inbox },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Knowledge', href: '/dashboard/knowledge', icon: BookOpen },
  { label: 'Billing', href: '/dashboard/billing', icon: CreditCard },
];

const secondaryItems = [
  { label: 'Settings', href: '/dashboard/settings', icon: Brain },
  { label: 'Admin', href: '/dashboard/admin', icon: Sparkles },
];

const sidebarVariants = {
  open: { x: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
  closed: { x: '-100%', transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
} as const;

const overlayVariants = {
  open: { opacity: 1, transition: { duration: 0.2 } },
  closed: { opacity: 0, transition: { duration: 0.2 } },
};

export function DashboardLayout({ children, title, description }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user } = useUser();
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
      <div className="fixed inset-0 -z-10 bg-black" />

      {/* Mobile header bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 border-b border-white/[0.06] bg-background/95">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <MessageSquare className="w-3.5 h-3.5 text-black" />
          </div>
          <span className="text-sm font-bold text-white">One<span className="text-amber-500">Question</span></span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-zinc-400 hover:text-white transition-colors"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="lg:hidden fixed inset-0 z-30 bg-black/75"
            onClick={closeMenu}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial={false}
        animate={isMobile ? (isOpen ? 'open' : 'closed') : 'open'}
        className="fixed left-0 top-0 h-full w-64 bg-background/98 border-r border-white/[0.06] z-40 flex flex-col"
      >
        <div className="flex items-center gap-2.5 px-6 h-14 border-b border-white/[0.06] shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <MessageSquare className="w-4 h-4 text-black" />
          </div>
          <span className="text-sm font-bold text-white">
            One<span className="text-amber-500">Question</span>
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
          <div>
            <p className="px-3 text-[11px] font-medium text-zinc-600 uppercase tracking-widest mb-2">Main</p>
            <div className="space-y-0.5">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'text-amber-500 bg-gradient-to-r from-amber-500/[0.10] to-transparent'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-gradient-to-b from-amber-500 to-orange-500"
                      />
                    )}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      isActive ? 'bg-amber-500/15 text-amber-500' : 'text-zinc-500'
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
            <p className="px-3 text-[11px] font-medium text-zinc-600 uppercase tracking-widest mb-2">Account</p>
            <div className="space-y-0.5">
              {secondaryItems.map((item) => {
                const isActive = pathname === item.href;
                if (item.label === 'Admin' && !isAdmin) return null;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'text-amber-500 bg-gradient-to-r from-amber-500/[0.10] to-transparent'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavSecondary"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-gradient-to-b from-amber-500 to-orange-500"
                      />
                    )}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isActive ? 'bg-amber-500/15 text-amber-500' : 'text-zinc-500'
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
            <p className="px-3 text-[11px] font-medium text-zinc-600 uppercase tracking-widest mb-2">Coming Soon</p>
            <div className="space-y-0.5">
              <div className="flex items-center gap-3 px-3 py-2 rounded-xl text-zinc-600 cursor-not-allowed">
                <div className='w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600'>
                  <Globe className="w-4 h-4" />
                </div>
                <span className="text-xs">Custom Domain</span>
                <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-500">Soon</span>
              </div>
            </div>
          </div>
        </nav>

        <div className="shrink-0 border-t border-white/[0.06] p-4">
          <Link href="/dashboard/settings" onClick={closeMenu} className="flex items-center gap-3 group">
            <Avatar
              src={user?.imageUrl}
              name={user?.fullName || user?.username}
              size="sm"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">
                {user?.fullName || user?.username || 'User'}
              </p>
              <p className="text-xs text-zinc-500 truncate">
                {user?.primaryEmailAddress?.emailAddress || ''}
              </p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
          </Link>
        </div>
      </motion.aside>

      <main className="lg:pl-64 pt-14 lg:pt-0">
        <div className="max-w-6xl mx-auto px-4 lg:px-10 py-6 lg:py-10">
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">{title}</h1>
            {description && <p className="text-zinc-400 text-sm">{description}</p>}
          </div>
          <ToastProvider>
            {children}
          </ToastProvider>
        </div>
      </main>

      <DashboardAI />
    </div>
  );
}
