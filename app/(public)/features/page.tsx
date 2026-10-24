'use client';

import Link from 'next/link';
import { Brain, BarChart3, Palette, Zap, Globe, Shield, MessageSquare, Upload, Sparkles, ArrowRight } from 'lucide-react';

const FEATURES = [
  {
    icon: Brain,
    color: 'text-primary',
    bg: 'bg-primary/10',
    title: 'Semantic AI Knowledge',
    desc: 'Add the information your page should use: your bio, services, process, FAQs, projects, and useful documents. Keep it accurate and up to date.',
    tags: ['Supported files', 'Text knowledge', 'FAQs'],
  },
  {
    icon: Zap,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    title: 'Instant Answers',
    desc: 'Visitors can ask questions any time. Response speed and availability depend on the AI provider and service health, so test your page before sharing it widely.',
    tags: ['Shareable page', 'Visitor questions', 'AI-generated answers'],
  },
  {
    icon: Palette,
    color: 'text-primary',
    bg: 'bg-primary/10',
    title: 'Full Customization',
    desc: 'Personalize your profile and supported appearance settings so your public page feels consistent with your work and brand.',
    tags: ['Profile details', 'Theme options', 'Social links'],
  },
  {
    icon: BarChart3,
    color: 'text-primary',
    bg: 'bg-primary/10',
    title: 'Real-time Analytics',
    desc: 'Review question activity and available usage insights. Advanced analytics are available on eligible plans; empty data is not proof of demand.',
    tags: ['Question history', 'Usage insights', 'Pro analytics'],
  },
  {
    icon: MessageSquare,
    color: 'text-green-400',
    bg: 'bg-green-400/10',
    title: 'Reaction Bar',
    desc: 'Where enabled, visitors can react to answers to give you a lightweight signal about what is useful.',
    tags: ['Visitor feedback', 'Answer quality signals'],
  },
  {
    icon: Upload,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    title: 'Knowledge Base',
    desc: 'Build a source library from supported text, files, and URLs. Add clear answers to recurring questions and remove outdated details when your work changes.',
    tags: ['Text', 'Supported file types', 'URLs where available'],
  },
  {
    icon: Globe,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    title: 'Public Space Page',
    desc: 'Give people one memorable destination for questions about your work. Share it in your portfolio, social profile, newsletter, or email signature.',
    tags: ['Custom URL', 'No login needed', 'Mobile friendly'],
  },
  {
    icon: Shield,
    color: 'text-red-400',
    bg: 'bg-red-400/10',
    title: 'Private by Default',
    desc: 'Choose what information you add and review your privacy settings before uploading sensitive material. Do not add secrets or data you are not authorized to share.',
    tags: ['Data privacy', 'Your knowledge', 'Secure storage'],
  },
  {
    icon: Sparkles,
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
    title: 'Knowledge Explorer',
    desc: 'An AI-powered blog and Q&A explorer. Explore product resources and examples to learn how to set up a useful page and improve the questions it can answer.',
    tags: ['Setup guidance', 'Examples', 'Product resources'],
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
              A useful AI page for<br />
              <span className="bg-gradient-to-r text-primary">AI speak for you.</span>
            </h1>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              OneQuestion helps independent professionals, creators, educators, and small teams answer recurring questions using knowledge they choose to provide.
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
            <p className="text-muted-foreground text-sm mb-4">Start on the free plan. Check the pricing page for current limits and plan details.</p>
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r bg-primary text-white font-bold text-sm hover:opacity-90 transition-opacity">
              Claim your space <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
