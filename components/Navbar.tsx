'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { UserButton } from '@clerk/nextjs';
import { Menu, X, Sparkles, ChevronRight } from 'lucide-react';

export function Navbar() {
  const { isSignedIn, isLoaded } = useAuth();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Product', href: '/#product' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Waitlist', href: '/waitlist' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'py-4 bg-background/80 backdrop-blur-xl border-b border-white/5' : 'py-6 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-pink to-accent flex items-center justify-center shadow-glow-primary group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-xl">Q</span>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">One Question</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {isLoaded && (
              <>
                {isSignedIn ? (
                  <div className="flex items-center gap-6">
                    <Link 
                      href="/dashboard" 
                      className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                      Dashboard
                    </Link>
                    <UserButton />
                  </div>
                ) : (
                  <>
                    <Link 
                      href="/sign-in" 
                      className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href="/sign-up"
                      className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:bg-primary hover:text-white transition-all flex items-center gap-2 group"
                    >
                      Get Started
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {isSignedIn && <UserButton />}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white hover:text-primary transition-colors"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-2xl border-b border-white/5 animate-in slide-in-from-top duration-300">
          <div className="px-4 py-8 space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-2xl font-bold text-white hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
            {!isSignedIn && (
              <div className="pt-6 space-y-4">
                <Link
                  href="/sign-in"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-xl font-medium text-muted-foreground"
                >
                  Login
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-4 rounded-2xl bg-primary text-white text-center font-bold flex items-center justify-center gap-2"
                >
                  Get Started
                  <Sparkles className="w-5 h-5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
