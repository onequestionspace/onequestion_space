const fs = require('fs');

const contact = `'use client';

import Link from 'next/link';
import { ArrowLeft, Mail, MessageCircle } from 'lucide-react';

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

const CONTACTS = [
  {
    icon: XIcon,
    label: 'X (Twitter)',
    handle: '@Asym_Alwali',
    description: 'Follow the build in public journey',
    href: 'https://twitter.com/Asym_Alwali',
    color: 'from-primary to-pink',
  },
  {
    icon: XIcon,
    label: 'One Question on X',
    handle: '@OneQuestion_Spa',
    description: 'Product updates and announcements',
    href: 'https://twitter.com/OneQuestion_Spa',
    color: 'from-pink to-accent-red',
  },
  {
    icon: GithubIcon,
    label: 'GitHub',
    handle: 'onequestionspace',
    description: 'Open source code and contributions',
    href: 'https://github.com/onequestionspace/onequestion_space',
    color: 'from-accent-yellow to-primary',
  },
  {
    icon: Mail,
    label: 'Email',
    handle: 'hello@onequestion.space',
    description: 'For partnerships and business inquiries',
    href: 'mailto:hello@onequestion.space',
    color: 'from-primary to-accent-yellow',
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 -z-10">
        <div className="mesh-gradient" />
        <div className="dot-pattern" />
      </div>

      <main className="pt-24 pb-20">
        <div className="max-w-lg mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-8 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="glass rounded-2xl p-6 border border-white/10 text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-pink mx-auto mb-4 flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Get In Touch</h1>
            <p className="text-muted-foreground text-sm">We are building in public. Reach us anywhere.</p>
          </div>

          <div className="space-y-3">
            {CONTACTS.map((c, i) => {
              const Icon = c.icon;
              return (
                <a key={i} href={c.href} target="_blank" rel="noopener noreferrer" className="glass rounded-2xl p-5 border border-white/10 flex items-center gap-4 hover:border-primary/30 transition-all group block">
                  <div className={'w-12 h-12 rounded-xl bg-gradient-to-br ' + c.color + ' flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform'}>
                    <Icon />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm">{c.label}</p>
                    <p className="text-primary text-xs">{c.handle}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">{c.description}</p>
                  </div>
                </a>
              );
            })}
          </div>

          <div className="glass rounded-2xl p-5 border border-white/10 mt-6 text-center">
            <p className="text-white font-semibold mb-1">Building something together?</p>
            <p className="text-muted-foreground text-sm mb-4">We are open to collaborations, partnerships and feedback from the community.</p>
            <a href="mailto:hello@onequestion.space" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-pink text-white font-semibold text-sm hover:shadow-glow transition-all">
              <Mail className="w-4 h-4" />
              Send us an email
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}`;

fs.writeFileSync('app/contact/page.tsx', contact);
console.log('Done');
