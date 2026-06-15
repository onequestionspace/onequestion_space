'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowLeft } from 'lucide-react';

export function AuthLayout({ children, title, subtitle }: {
  children: React.ReactNode,
  title: string,
  subtitle: string
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">

      {/* Background glows */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(147,51,234,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(232,121,249,0.10),transparent_50%)]" />
        <div className="absolute inset-0 dot-pattern opacity-30" />
      </div>

      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse" />

      <div className="w-full max-w-md space-y-6 relative z-10">

        {/* Back + Logo */}
        <div className="flex flex-col items-center">
          <Link href="/" className="mb-6 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to home</span>
          </Link>

          <Link href="/" className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-500 flex items-center justify-center shadow-lg">
              <Image src="/logo.png" alt="One Question" width={32} height={32} className="rounded-xl" />
            </div>
          </Link>

          <h1 className="text-3xl font-bold text-white text-center">{title}</h1>
          <p className="text-zinc-400 text-center mt-2 text-sm">{subtitle}</p>
        </div>

        {/* Card */}
        <div className="relative rounded-3xl p-8 border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Sparkles className="w-16 h-16 text-purple-400" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-fuchsia-500/5 pointer-events-none rounded-3xl" />
          <div className="relative z-10">
            {children}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-zinc-500">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="text-purple-400 hover:text-purple-300 transition-colors">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy" className="text-purple-400 hover:text-purple-300 transition-colors">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
