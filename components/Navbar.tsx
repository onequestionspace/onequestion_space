'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useClerk } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, LayoutDashboard, Settings, LogOut, User, Sparkles, MessageSquare } from 'lucide-react';
import Image from 'next/image';

const navLinks = [
  { name: 'Blog', href: '/blog' },
  { name: 'Pricing', href: '/pricing' },
];

export function Navbar() {
  const { isSignedIn, isLoaded } = useAuth();
  const profile = useQuery(api.profiles.current);
  const { signOut } = useClerk();
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const reserved = ['dashboard','blog','pricing','contact','features','onboarding','privacy','terms','sign-in','sign-up','api'];
  const isSpacePage = segments.length === 1 && !reserved.includes(segments[0]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isDashboardPage = segments[0] === 'dashboard';
  if (isSpacePage || isDashboardPage) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" role="navigation" aria-label="Main navigation">
      <div className={`absolute inset-0 transition-all duration-500 ${isScrolled ? 'bg-black/80 backdrop-blur-2xl' : 'bg-gradient-to-b from-black/60 to-transparent pointer-events-none'}`} />
      <div className={`absolute left-0 right-0 bottom-0 h-px transition-opacity duration-500 ${isScrolled ? 'opacity-100' : 'opacity-0'}`} style={{ background: 'linear-gradient(90deg, transparent, rgba(245,166,35,0.15), transparent)' }} />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="One Question Home">
            <div className="relative w-8 h-8 rounded-xl overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
              <Image src="/logo.png" alt="" width={32} height={32} className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">
              One<span className="text-primary">Question</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="relative text-xs font-medium px-3.5 py-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isLoaded && (
              isSignedIn ? (
                <div className="flex items-center gap-3" ref={profileRef}>
                  <Link href="/dashboard"
                    className="text-xs font-medium text-zinc-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-lg px-2 py-1">
                    Dashboard
                  </Link>
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-primary/30 hover:ring-primary/60 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                      aria-label={isProfileOpen ? 'Close profile menu' : 'Open profile menu'}
                      aria-expanded={isProfileOpen}
                    >
                      <div className="w-full h-full bg-primary flex items-center justify-center text-black text-xs font-bold">
                        {profile?.avatar ? (
                          <Image src={profile.avatar} alt="avatar" width={32} height={32} className="w-full h-full object-cover" />
                        ) : (profile?.displayName?.charAt(0)?.toUpperCase() || "U")}
                      </div>
                    </button>
                    <AnimatePresence>
                      {isProfileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.96 }}
                          transition={{ duration: 0.12 }}
                          className="absolute right-0 top-10 w-56 bg-black/90 backdrop-blur-2xl rounded-2xl shadow-premium border border-white/[0.06] p-2 space-y-0.5"
                          role="menu"
                        >
                          <div className="px-3 py-2.5 border-b border-white/[0.06] mb-1">
                            <p className="text-sm font-semibold text-white truncate">{profile?.displayName || 'User'}</p>
                            <p className="text-xs text-zinc-500 truncate">@{profile?.username}</p>
                          </div>
                          <Link href="/dashboard" onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-zinc-300 hover:text-white hover:bg-white/[0.04] transition-all" role="menuitem">
                            <LayoutDashboard className="w-4 h-4 text-primary" />
                            Dashboard
                          </Link>
                          {profile?.username && (
                            <Link href={`/${profile.username}`} onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-zinc-300 hover:text-white hover:bg-white/[0.04] transition-all" role="menuitem">
                              <User className="w-4 h-4 text-zinc-500" />
                              My Space
                            </Link>
                          )}
                          <Link href="/dashboard/settings" onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-zinc-300 hover:text-white hover:bg-white/[0.04] transition-all" role="menuitem">
                            <Settings className="w-4 h-4 text-zinc-500" />
                            Settings
                          </Link>
                          <div className="border-t border-white/[0.06] my-1" />
                          <button onClick={() => signOut()}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all" role="menuitem">
                            <LogOut className="w-4 h-4" />
                            Sign out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/sign-in"
                    className="text-xs font-medium text-zinc-400 hover:text-white transition-colors px-3.5 py-1.5 rounded-full hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
                    Log in
                  </Link>
                  <Link href="/sign-up"
                    className="relative group text-xs font-bold px-4 py-1.5 rounded-full bg-primary text-black hover:bg-primary-light transition-all flex items-center gap-1.5 shadow-amber-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
                    <Sparkles className="w-3 h-3" />
                    Sign up free
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              )
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            {isSignedIn && (
              <Link href="/dashboard" className="text-xs text-primary font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded px-2 py-1">
                Dashboard
              </Link>
            )}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              className="p-2 text-white hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-lg">
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.12 }}
              className="mt-1 bg-black/90 backdrop-blur-2xl rounded-2xl shadow-premium border border-white/[0.06] px-4 py-5 space-y-4"
            >
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-base font-bold text-white hover:text-primary transition-colors">
                  {link.name}
                </Link>
              ))}
              {isSignedIn ? (
                <div className="pt-4 space-y-3 border-t border-white/[0.06]">
                  <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 text-sm font-medium text-white">
                    <LayoutDashboard className="w-4 h-4 text-primary" />
                    Dashboard
                  </Link>
                  <Link href={`/${profile?.username}`} onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 text-sm font-medium text-zinc-400 hover:text-white">
                    <User className="w-4 h-4" />
                    My Space
                  </Link>
                  <Link href="/dashboard/settings" onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 text-sm font-medium text-zinc-400 hover:text-white">
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <button onClick={() => signOut()}
                    className="flex items-center gap-2.5 text-sm font-medium text-red-400">
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="pt-4 space-y-3 border-t border-white/[0.06]">
                  <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-center text-sm font-medium text-zinc-400 py-2">
                    Log in
                  </Link>
                  <Link href="/sign-up" onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-center py-3 rounded-full bg-primary text-black font-bold text-sm shadow-amber-glow">
                    Sign up free
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
