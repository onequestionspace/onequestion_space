'use client';

import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-black">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-black">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

const CONTACTS = [
  {
    icon: XIcon,
    label: 'Asym on X',
    handle: '@Asym_Alwali',
    description: 'Building $0 → $10k MRR in public from a phone',
    href: 'https://twitter.com/Asym_Alwali',
  },
  {
    icon: XIcon,
    label: 'One Question on X',
    handle: '@OneQuestion_Spa',
    description: 'Product updates, launches, and announcements',
    href: 'https://twitter.com/OneQuestion_Spa',
  },
  {
    icon: GithubIcon,
    label: 'GitHub',
    handle: 'onequestionspace',
    description: 'Open source — built on a phone in Termux',
    href: 'https://github.com/onequestionspace/onequestion_space',
  },
  {
    icon: Mail,
    label: 'Email',
    handle: 'hello@onequestion.space',
    description: 'Partnerships, business, or just say hi',
    href: 'mailto:hello@onequestion.space',
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 pb-20">
        <div className="max-w-lg mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-10 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>

          <div className="mb-10">
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">Say hello.</h1>
            <p className="text-zinc-500 leading-relaxed">
              Built by a 19-year-old from Yobe, Nigeria — on a phone. No gatekeeping here. Reach out anywhere.
            </p>
          </div>

          <div className="space-y-3">
            {CONTACTS.map((c, i) => {
              const Icon = c.icon;
              return (
                <a key={i} href={c.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl border border-white/8 bg-white/3 hover:border-primary/30 hover:bg-white/5 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Icon />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm">{c.label}</p>
                    <p className="text-primary text-xs font-mono">{c.handle}</p>
                    <p className="text-zinc-500 text-xs mt-0.5">{c.description}</p>
                  </div>
                  <span className="text-zinc-600 group-hover:text-primary transition-colors text-lg">→</span>
                </a>
              );
            })}
          </div>

          <div className="mt-10 p-5 rounded-2xl border border-white/8 bg-white/3">
            <p className="text-white font-black text-sm mb-1">Want to collaborate?</p>
            <p className="text-zinc-500 text-xs leading-relaxed mb-4">
              I am open to partnerships, integrations, and feedback. Building in public means the door is always open.
            </p>
            <a href="mailto:hello@onequestion.space"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-black font-black text-sm hover:opacity-90 transition-all">
              <Mail className="w-4 h-4" />
              Send an email
            </a>
          </div>

          <p className="text-zinc-700 text-xs text-center mt-8">
            — Asym, building from Yobe 🇳🇬
          </p>
        </div>
      </main>
    </div>
  );
}
