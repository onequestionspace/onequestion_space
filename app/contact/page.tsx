'use client';

import Link from 'next/link';
import { ArrowLeft, Mail, Code, MessageCircle, ExternalLink } from 'lucide-react';

const CONTACTS = [
  {
    icon: ExternalLink,
    label: 'X (Twitter)',
    handle: '@Asym_Alwali',
    description: 'Follow the build in public journey',
    href: 'https://twitter.com/Asym_Alwali',
    color: 'from-primary to-pink',
  },
  {
    icon: ExternalLink,
    label: 'One Question on X',
    handle: '@OneQuestion_Spa',
    description: 'Product updates and announcements',
    href: 'https://twitter.com/OneQuestion_Spa',
    color: 'from-pink to-accent-red',
  },
  {
    icon: Code,
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
                    <Icon className="w-6 h-6 text-white" />
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
}