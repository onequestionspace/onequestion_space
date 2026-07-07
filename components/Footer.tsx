'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Heart } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const reserved = ['dashboard','blog','pricing','contact','features','onboarding','privacy','terms','sign-in','sign-up','api'];
  const isSpacePage = segments.length === 1 && !reserved.includes(segments[0]);
  if (isSpacePage) return null;

  return (
    <footer className="relative border-t border-white/[0.04] pt-16 pb-8 overflow-hidden">
      <div className="absolute inset-0 amber-radial-soft pointer-events-none" />
      <div className="absolute inset-0 grain-subtle opacity-[0.015] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="mb-14 paper-card p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5">
          <div className="flex-1 text-center sm:text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1">From the Founder</p>
            <h3 className="text-white font-bold text-base">Broke & Building</h3>
            <p className="text-zinc-500 text-xs mt-1">
              Building One Question from an Android phone in Nigeria. No laptop. No funding. Just shipping.
            </p>
          </div>
          <a href="https://brokeandbuilding.substack.com" target="_blank" rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-black font-bold text-sm hover:bg-primary-light transition-all shadow-amber-glow">
            <Sparkles className="w-4 h-4" />
            Read & Subscribe
          </a>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-10 mb-8">
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-8 h-8 rounded-xl overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
                <Image src="/logo.png" alt="One Question" width={32} height={32} className="w-full h-full object-cover" />
              </div>
              <span className="text-sm font-bold text-white">
                One<span className="text-primary">Question</span>
              </span>
            </Link>
            <p className="text-zinc-500 text-xs leading-relaxed max-w-xs">
              Claim your space. Upload your knowledge. Let AI answer 24/7 — in your voice.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a href="https://twitter.com/OneQuestion_Spa" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-primary transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://github.com/onequestionspace/onequestion_space" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-primary transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="flex gap-16">
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-widest mb-4">Product</p>
              <ul className="space-y-3">
                <li><Link href="/pricing" className="text-xs text-zinc-500 hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link href="/blog" className="text-xs text-zinc-500 hover:text-primary transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="text-xs text-zinc-500 hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-widest mb-4">Legal</p>
              <ul className="space-y-3">
                <li><Link href="/privacy" className="text-xs text-zinc-500 hover:text-primary transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="text-xs text-zinc-500 hover:text-primary transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-xs text-zinc-600">&copy; {new Date().getFullYear()} One Question</span>
          <span className="text-xs text-zinc-600 flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-red-500" /> from a phone in Nigeria
          </span>
        </div>
      </div>
    </footer>
  );
}
