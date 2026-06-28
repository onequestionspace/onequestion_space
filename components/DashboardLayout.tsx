'use client';
import { useUser } from '@clerk/nextjs';
import { Shield } from 'lucide-react';
import { DashboardAI } from './DashboardAI';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, Brain, BarChart3,
  Settings, Menu, X, ArrowLeft,
  MessageSquare, CreditCard, User,
  Sparkles, Inbox, Globe, Layers
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Space Studio ✦', href: '/dashboard/studio', icon: Layers },
  { label: 'Knowledge', href: '/dashboard/knowledge', icon: Brain },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Billing', href: '/dashboard/billing', icon: CreditCard },

];

const comingSoonItems = [
  { label: 'Inbox', icon: Inbox, desc: 'Direct messages from visitors' },
  { label: 'Custom Space', icon: Globe, desc: 'Custom domain + branding' },
  { label: 'Widget Templates', icon: Layers, desc: 'Embed Q&A on any site' },
  { label: 'Paywall DMs', icon: CreditCard, desc: 'Charge for direct access' },
];

export function DashboardLayout({ children, title, description }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const isAdmin = user?.id === 'user_3EhKmuVyC1AhoBDlL7QNssllwgu' || user?.id === 'user_3Ev3UAWNTTDAlVWSYFGGsEI6qQz';
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(147,51,234,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(232,121,249,0.08),transparent_50%)]" />
        <div className="absolute inset-0 dot-pattern opacity-20" />
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2.5 bg-zinc-900 border border-white/10 rounded-xl shadow-lg"
      >
        {isOpen
          ? <X className="w-5 h-5 text-white" />
          : <Menu className="w-5 h-5 text-white" />
        }
      </button>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-zinc-950/95 border-r border-white/8 backdrop-blur-xl p-6 z-40 transform transition-transform duration-200 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>

        {/* Logo */}
        <Link href="/" onClick={closeMenu} className="flex items-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br bg-amber-500 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold text-white">One Question</span>
        </Link>

        {/* Nav */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-500 border border-amber-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? 'text-amber-500' : 'text-zinc-500'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Coming Soon */}
        <div className='mt-6 pt-4 border-t border-white/8'>
          <p className='text-xs text-zinc-600 font-medium uppercase tracking-widest mb-3 px-3'>Coming Soon</p>
          {comingSoonItems.map(item => (
            <div key={item.label} className='flex items-center gap-3 px-3 py-2 rounded-xl text-zinc-600 cursor-not-allowed'>
              <item.icon className='w-4 h-4' />
              <div>
                <p className='text-xs font-medium'>{item.label}</p>
                <p className='text-[10px] text-zinc-700'>{item.desc}</p>
              </div>
              <span className='ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-500'>Soon</span>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="absolute bottom-6 left-6 right-6 space-y-3">
          <div className="h-px bg-white/8" />
          <Link href="/" onClick={closeMenu} className="flex items-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/60 z-30 backdrop-blur-sm" onClick={closeMenu} />
      )}

      {/* Main content */}
      <main className="lg:pl-64 pt-16 lg:pt-0 p-4 lg:p-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">{title}</h1>
            {description && <p className="text-zinc-400 text-sm">{description}</p>}
          </div>
          {children}
        </div>
      </main>
      <DashboardAI />
    </div>
  );
}
