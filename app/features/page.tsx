'use client';

import Link from 'next/link';
import { Brain, BarChart3, Palette, Zap, Globe, Shield, MessageSquare, Upload, Sparkles, ArrowRight } from 'lucide-react';

const FEATURES = [
  {
    icon: Brain,
    color: 'text-primary',
    bg: 'bg-primary/10',
    title: 'Semantic AI Knowledge',
    desc: 'Your AI uses vector embeddings to find the most relevant answer — not keyword matching. The more you upload, the smarter it gets.',
    tags: ['PDF upload', 'Text training', 'Auto embeddings'],
  },
  {
    icon: Zap,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    title: 'Instant Answers',
    desc: 'Gemini 2.5 Flash powers sub-2 second responses every time. Your visitors never wait.',
    tags: ['< 2s response', 'Gemini 2.5 Flash', '24/7 uptime'],
  },
  {
    icon: Palette,
    color: 'text-primary',
    bg: 'bg-primary/10',
    title: 'Full Customization',
    desc: 'Colors, fonts, backgrounds, social links. Particles, bubbles, matrix animations. Your space, your brand.',
    tags: ['Theme colors', 'Animated backgrounds', 'Custom fonts'],
  },
  {
    icon: BarChart3,
    color: 'text-primary',
    bg: 'bg-primary/10',
    title: 'Real-time Analytics',
    desc: 'See every question, visitor and response rate in real time. Know exactly what people want to know about you.',
    tags: ['Live stats', 'Question history', 'Response rate'],
  },
  {
    icon: MessageSquare,
    color: 'text-green-400',
    bg: 'bg-green-400/10',
    title: 'Reaction Bar',
    desc: 'Visitors react to AI answers with 🔥❤️🧠👏😮 — turning every answer into a feedback loop.',
    tags: ['5 reactions', 'Convex storage', 'Live counts'],
  },
  {
    icon: Upload,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    title: 'Knowledge Base',
    desc: 'Upload text, PDFs, FAQs, projects, services. Everything your AI needs to answer on your behalf.',
    tags: ['Text + PDF', 'Auto embeddings', 'Unlimited uploads'],
  },
  {
    icon: Globe,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    title: 'Public Space Page',
    desc: 'Your personal AI page at onequestion.space/you — shareable everywhere. X bio, LinkedIn, email signature.',
    tags: ['Custom URL', 'No login needed', 'Mobile friendly'],
  },
  {
    icon: Shield,
    color: 'text-red-400',
    bg: 'bg-red-400/10',
    title: 'Private by Default',
    desc: 'Your knowledge is yours. We never train our models on your data. Everything stays in your space.',
    tags: ['Data privacy', 'Your knowledge', 'Secure storage'],
  },
  {
    icon: Sparkles,
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
    title: 'Knowledge Explorer',
    desc: 'An AI-powered blog and Q&A explorer. Ask anything about One Question, AI, and building in public.',
    tags: ['AI chat', 'Blog system', 'SEO friendly'],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 -z-10">
        <div className="mesh-gradient opacity-40" />
        <div className="dot-pattern" />
      </div>

      <main className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-16">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-4">Features</p>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
              Everything you need to let<br />
              <span className="bg-gradient-to-r text-primary">AI speak for you.</span>
            </h1>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              One Question is built for creators, founders, and professionals who want AI to answer questions about them 24/7.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="glass rounded-2xl p-5 border border-white/10 hover:border-primary/30 transition-all group">
                  <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-5 h-5 ${f.color}`} />
                  </div>
                  <h3 className="text-white font-bold text-sm mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed mb-3">{f.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {f.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground">{tag}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="glass rounded-2xl p-6 border border-primary/20 text-center">
            <h2 className="text-white font-bold text-lg mb-2">Ready to claim your space?</h2>
            <p className="text-muted-foreground text-sm mb-4">Free forever. No credit card required.</p>
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r bg-primary text-white font-bold text-sm hover:opacity-90 transition-opacity">
              Claim your space <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
