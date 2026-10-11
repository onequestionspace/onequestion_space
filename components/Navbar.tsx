'use client';

import Link from 'next/link';

const navLinks = [
  { label: 'Product', href: '/#product' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Sign in', href: '/sign-in' },
];

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"
      >
        <Link href="/" className="text-sm font-semibold tracking-tight text-black" aria-label="OneQuestion home">
          OneQuestion
        </Link>
        <div className="flex items-center gap-5 sm:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs font-medium text-zinc-600 transition-colors hover:text-black sm:text-sm"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
