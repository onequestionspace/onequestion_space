'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useClerk } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, LayoutDashboard, Settings, LogOut, User, Sparkles } from 'lucide-react';
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
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
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

  if (isSpacePage) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 py-3">
        <div className={`flex items-center justify-between px-5 py-2.5 rounded-2xl transition-all duration-500 ${
          isScrolled
            ? 'bg-background/70 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
            : 'bg-transparent border border-transparent'
        }`}>
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-xl overflow-hidden ring-2 ring-amber-500/20 group-hover:ring-amber-500/40 transition-all">
              <Image src="/logo.png" alt="One Question" width={32} height={32} className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">
              One<span className="text-amber-500">Question</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative text-xs font-medium px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                  pathname === link.href
                    ? 'text-amber-500 bg-amber-500/10'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            {isLoaded && (
              isSignedIn ? (
                <div className="flex items-center gap-2" ref={profileRef}>
                  <Link href="/dashboard"
                    className="text-xs font-medium text-zinc-400 hover:text-white transition-colors px-3.5 py-1.5 rounded-full hover:bg-white/5">
                    Dashboard
                  </Link>
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-amber-500/30 hover:ring-amber-500/60 transition-all"
                    >
                      <div className="w-full h-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-black text-xs font-bold">
                        {profile?.avatar ? (
                          <Image src={profile.avatar} alt="avatar" width={32} height={32} className="w-full h-full object-cover" />
                        ) : (profile?.displayName?.charAt(0)?.toUpperCase() || "U")}
                      </div>
                    </button>
                    <AnimatePresence>
                      {isProfileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-10 w-56 glass-premium rounded-2xl shadow-2xl p-2 space-y-0.5"
                        >
                          <div className="px-3 py-2.5 border-b border-white/5 mb-1">
                            <p className="text-sm font-semibold text-white truncate">{profile?.displayName || 'User'}</p>
                            <p className="text-xs text-zinc-500 truncate">@{profile?.username}</p>
                          </div>
                          <Link href="/dashboard" onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-all">
                            <LayoutDashboard className="w-4 h-4 text-amber-500" />
                            Dashboard
                          </Link>
                          {profile?.username && (
                            <Link href={`/${profile.username}`} onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-all">
                              <User className="w-4 h-4 text-zinc-500" />
                              My Space
                            </Link>
                          )}
                          <Link href="/dashboard/settings" onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-all">
                            <Settings className="w-4 h-4 text-zinc-500" />
                            Settings
                          </Link>
                          <div className="border-t border-white/5 my-1" />
                          <button onClick={() => signOut()}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all">
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
                    className="text-xs font-medium text-zinc-400 hover:text-white transition-colors px-3.5 py-1.5 rounded-full hover:bg-white/5">
                    Log in
                  </Link>
                  <Link href="/sign-up"
                    className="relative group text-xs font-bold px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:opacity-90 transition-all flex items-center gap-1.5 shadow-lg shadow-amber-500/20">
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
              <Link href="/dashboard" className="text-xs text-amber-500 font-medium">
                Dashboard
              </Link>
            )}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white hover:text-amber-500 transition-colors relative w-8 h-8 flex items-center justify-center">
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="mt-2 glass-premium rounded-2xl shadow-2xl px-4 py-5 space-y-4"
            >
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-base font-bold text-white hover:text-amber-500 transition-colors">
                  {link.name}
                </Link>
              ))}
              {isSignedIn ? (
                <div className="pt-4 space-y-3 border-t border-white/10">
                  <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 text-sm font-medium text-white">
                    <LayoutDashboard className="w-4 h-4 text-amber-500" />
                    Dashboard
                  </Link>
                  <Link href="/dashboard/profile" onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 text-sm font-medium text-zinc-400 hover:text-white">
                    <User className="w-4 h-4" />
                    Profile
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
                <div className="pt-4 space-y-3 border-t border-white/10">
                  <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-center text-sm font-medium text-zinc-400 py-2">
                    Log in
                  </Link>
                  <Link href="/sign-up" onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-center py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-sm shadow-lg shadow-amber-500/20">
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
