'use client';

import Link from 'next/link';
import { Sparkles, ArrowLeft } from 'lucide-react';

/**
 * Branded Auth Layout
 * Shared wrapper for Sign In and Sign Up pages
 */
export function AuthLayout({ children, title, subtitle }: { 
  children: React.ReactNode, 
  title: string, 
  subtitle: string 
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 -z-10">
        <div className="mesh-gradient opacity-50" />
        <div className="dot-pattern" />
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-pink/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Brand & Back link */}
        <div className="flex flex-col items-center">
          <Link href="/" className="mb-8 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to home</span>
          </Link>
          
          <Link href="/" className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-pink to-accent flex items-center justify-center shadow-glow-primary">
              <span className="text-white font-bold text-2xl">Q</span>
            </div>
          </Link>

          <h1 className="text-3xl font-bold text-foreground text-center">{title}</h1>
          <p className="text-muted-foreground text-center mt-2">{subtitle}</p>
        </div>

        {/* Auth Content Card */}
        <div className="glass-card rounded-3xl p-8 border border-border shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="w-12 h-12" />
          </div>
          {children}
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-muted-foreground">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and{' '}
          <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
