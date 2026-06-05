'use client';

import Link from 'next/link';

/**
 * Footer Component
 * Clean minimal footer with brand colors
 */
export function Footer() {
  return (
    <footer className="relative border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">Q</span>
              </div>
              <span className="font-bold text-lg text-white">One Question</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your knowledge. Your answers. Your space.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/waitlist" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Waitlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/#team" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">&copy; {new Date().getFullYear()} One Question. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a 
              href="https://twitter.com/OneQuestion_Spa" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Twitter"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a 
              href="https://github.com/onequestionspace/onequestion_space" target="_blank" rel="noopener noreferrer" 
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            </a>
            <a 
              className="text-muted-foreground hover:text-primary transition-colors"
