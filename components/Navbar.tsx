'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { UserButton } from '@clerk/nextjs';

/**
 * Navigation Bar Component
 * Clean, minimal Linktree-inspired design with brand colors
 */
export function Navbar() {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="text-white font-bold text-lg">Q</span>
            </div>
            <span className="font-bold text-lg text-white">One Question</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/pricing" 
              className="text-muted-foreground hover:text-white transition-colors text-sm font-medium"
            >
              Pricing
            </Link>
            <Link 
              href="#how-it-works" 
              className="text-muted-foreground hover:text-white transition-colors text-sm font-medium"
            >
              How it Works
            </Link>
            {isLoaded && isSignedIn && (
              <Link 
                href="/dashboard" 
                className="text-muted-foreground hover:text-white transition-colors text-sm font-medium"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Theme Toggle & Auth Section */}
          <div className="flex items-center gap-4">
            {isLoaded && isSignedIn ? (
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: 'w-9 h-9',
                  },
                }}
              />
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-muted-foreground hover:text-white font-medium text-sm px-4 py-2 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/sign-up"
                  className="bg-gradient-primary text-white px-5 py-2 rounded-full font-medium text-sm hover:opacity-90 transition-all hover:shadow-glow"
                >
                  Sign up free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
