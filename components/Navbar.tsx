'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useClerk } from '@clerk/nextjs';
import { Menu, X, ChevronRight, LayoutDashboard, Settings, LogOut, User } from 'lucide-react';
import Image from 'next/image';

export function Navbar() {
  const { isSignedIn, isLoaded, userId } = useAuth();
  const profile = useQuery(api.profiles.current);
  const { signOut } = useClerk();
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const reserved = ['dashboard','blog','pricing','contact','features','waitlist','onboarding','privacy','terms','sign-in','sign-up','api'];
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

  const navLinks = [
    { name: 'Blog', href: '/blog' },
    { name: 'Pricing', href: '/pricing' },
  ];

  if (isSpacePage) return null;

  return (
    <nav className="fixed top-3 left-0 right-0 z-50 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between px-4 py-2.5 rounded-full bg-background/80 backdrop-blur-xl border border-white/15 shadow-lg max-w-lg mx-auto">
          <Link href="/" className="flex items-center gap-2 group">
            <Image src="/logo.png" alt="One Question" width={32} height={32} className="rounded-xl group-hover:scale-110 transition-transform ring-0 border-0" />
            <span className="text-sm font-bold text-white tracking-tight">One Question</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={'text-xs font-medium px-3 py-1.5 rounded-full transition-all hover:bg-white/10 ' + (pathname === link.href ? 'text-primary bg-white/5' : 'text-muted-foreground')}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            {isLoaded && (
              isSignedIn ? (
                <div className="flex items-center gap-2" ref={profileRef}>
                  <Link href="/dashboard" className="text-xs font-medium text-muted-foreground hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-white/10">
                    Dashboard
                  </Link>
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black text-xs font-bold hover:shadow-glow transition-all overflow-hidden"
                    >
                      {profile?.avatar ? <Image src={profile.avatar} alt="avatar" width={32} height={32} className="w-full h-full object-cover" /> : (profile?.displayName?.charAt(0)?.toUpperCase() || "U")}
                    </button>
                    {isProfileOpen && (
                      <div className="absolute right-0 top-10 w-48 glass rounded-2xl border border-white/10 shadow-xl p-2 space-y-1">
                        <Link href="/dashboard" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white hover:bg-white/10 transition-colors">
                          <LayoutDashboard className="w-4 h-4 text-primary" />
                          Dashboard
                        </Link>
                        <Link href="/dashboard/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white hover:bg-white/10 transition-colors">
                          <User className="w-4 h-4 text-muted-foreground" />
                          Profile
                        </Link>
                        <Link href="/dashboard/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white hover:bg-white/10 transition-colors">
                          <Settings className="w-4 h-4 text-muted-foreground" />
                          Settings
                        </Link>
                        {profile?.username && (
                          <Link href={`/${profile.username}`} onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white hover:bg-white/10 transition-colors">
                            <User className="w-4 h-4 text-muted-foreground" />
                            My Space
                          </Link>
                        )}
                        <div className="border-t border-white/10 my-1" />
                        <button onClick={() => signOut()} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/sign-in" className="text-xs font-medium text-muted-foreground hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-white/10">
                    Log in
                  </Link>
                  <Link href="/sign-up" className="text-xs font-bold px-4 py-1.5 rounded-full bg-primary text-black hover:bg-primary/90 transition-all flex items-center gap-1">
                    Sign up free
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              )
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            {isSignedIn && (
              <Link href="/dashboard" className="text-xs text-primary font-medium">
                Dashboard
              </Link>
            )}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-white hover:text-primary transition-colors">
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="mt-2 bg-background/95 backdrop-blur-2xl border border-white/10 rounded-2xl px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-bold text-white hover:text-primary transition-colors">
                {link.name}
              </Link>
            ))}
            {isSignedIn ? (
              <div className="pt-4 space-y-3 border-t border-white/10">
                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-sm font-medium text-white">
                  <LayoutDashboard className="w-4 h-4 text-primary" />
                  Dashboard
                </Link>
                <Link href="/dashboard/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white hover:bg-white/10 transition-colors">
                          <User className="w-4 h-4 text-muted-foreground" />
                          Profile
                        </Link>
                        <Link href="/dashboard/settings" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                <button onClick={() => signOut()} className="flex items-center gap-2 text-sm font-medium text-red-400">
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            ) : (
              <div className="pt-4 space-y-3 border-t border-white/10">
                <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)} className="block text-center text-sm font-medium text-muted-foreground py-2">
                  Log in
                </Link>
                <Link href="/sign-up" onClick={() => setIsMobileMenuOpen(false)} className="block text-center py-3 rounded-full bg-primary text-black font-bold text-sm">
                  Sign up free
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}