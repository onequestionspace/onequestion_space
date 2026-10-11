'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const reserved = ['dashboard', 'blog', 'pricing', 'contact', 'features', 'onboarding', 'privacy', 'terms', 'sign-in', 'sign-up', 'api', 'waitlist'];
  const isSpacePage = segments.length === 1 && !reserved.includes(segments[0]);
  if (isSpacePage) return null;

  return (
    <footer className="border-t border-zinc-200 bg-white px-4 py-8 text-black">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="text-sm font-semibold tracking-tight">OneQuestion</Link>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-zinc-500">
          <Link href="/#product" className="hover:text-black">Product</Link>
          <Link href="/#pricing" className="hover:text-black">Pricing</Link>
          <Link href="/privacy" className="hover:text-black">Privacy</Link>
          <Link href="/terms" className="hover:text-black">Terms</Link>
          <Link href="mailto:hello@onequestion.space" className="hover:text-black">Contact</Link>
        </nav>
        <span className="text-xs text-zinc-500">© {new Date().getFullYear()} OneQuestion</span>
      </div>
    </footer>
  );
}
