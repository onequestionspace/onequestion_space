'use client';

import { Brain, BarChart3, Palette, Zap, Globe, Shield, Sparkles } from 'lucide-react';
import { FadeIn } from '@/components/motion/FadeIn';

const features = [
  {
    icon: Brain, title: 'Semantic AI Knowledge',
    desc: 'Your AI uses vector embeddings to find the most relevant answer — not keyword matching. The more you upload, the smarter it gets.',
    tags: ['PDF upload', 'URL learning', 'Text training', 'Auto embeddings', 'Context search'],
    wide: true,
    chalk: true,
  },
  {
    icon: BarChart3, title: 'Real Analytics',
    desc: 'See every question, visitor and response rate in real time.',
    mini: true,
    stats: [
      ['Questions', '142', '#F5A623'],
      ['Visitors', '89', '#F5A623'],
      ['Rate', '98%', '#22c55e'],
    ],
  },
  {
    icon: Palette, title: 'Full Customization',
    desc: 'Colors, fonts, backgrounds, textures, custom images. Your space, your brand.',
    colors: ['#F5A623','#D9901A','#F7B955','#0A0A0A','#ffffff'],
    accent: '#F5A623',
  },
  {
    icon: Zap, title: 'Instant Answers',
    desc: 'Powered by advanced AI for sub-2 second responses every time.',
    extra: <div className='flex items-end gap-2'><span className='text-3xl font-black text-white'>{'<'}2s</span><span className='text-zinc-500 text-[11px] mb-1'>avg response</span></div>,
    accent: '#F5A623',
  },
  {
    icon: Shield, title: 'Private by Default',
    desc: 'Your knowledge is yours. We never train our models on your data.',
    accent: '#F5A623',
  },
  {
    mobile: true,
    icon: Globe, title: 'One Link. Everywhere.',
    desc: 'Share one URL. Your AI handles every question from every visitor — on any device, any time zone, any language.',
    wide: true,
    chalk: true,
  },
];

export function BentoSection() {
  return (
    <section className='relative py-24 overflow-hidden'>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(245,166,35,0.15), transparent)' }} />
      <div className='absolute inset-0 amber-radial-soft pointer-events-none' />

      <div className='relative max-w-5xl mx-auto px-4 sm:px-6'>
        <div className='text-center mb-14'>
          <FadeIn>
            <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold mb-5'>
              <Sparkles className='w-3 h-3' />
              Everything you need
            </div>
            <h2 className='text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight'>
              Built for people who<br />
              <span className='gradient-text'>value their time.</span>
            </h2>
          </FadeIn>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
          <FadeIn className='md:col-span-2'>
            <div className='paper-card p-6 relative overflow-hidden group'>
              <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700'
                style={{ background: 'linear-gradient(135deg, rgba(245,166,35,0.08), transparent 60%)' }} />
              <Brain className='w-6 h-6 text-primary mb-4 relative' />
              <h3 className='text-lg font-bold text-white mb-2 relative'>Semantic AI Knowledge</h3>
              <p className='text-zinc-400 text-sm leading-relaxed mb-5 relative'>Your AI uses vector embeddings to find the most relevant answer — not keyword matching. The more you upload, the smarter it gets.</p>
              <div className='flex flex-wrap gap-2 relative'>
                {['PDF upload', 'URL learning', 'Text training', 'Auto embeddings', 'Context search'].map(tag => (
                  <span key={tag} className='px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-medium'>{tag}</span>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn>
            <div className='paper-card p-5 relative overflow-hidden group'>
              <BarChart3 className='w-5 h-5 text-primary mb-3 relative' />
              <h3 className='text-sm font-bold text-white mb-1 relative'>Real Analytics</h3>
              <p className='text-zinc-500 text-xs leading-relaxed mb-4 relative'>See every question, visitor and response rate in real time.</p>
              <div className='space-y-2 relative'>
                {[['Questions', '142', '#F5A623'], ['Visitors', '89', '#F5A623'], ['Rate', '98%', '#22c55e']].map(([label, val, color]) => (
                  <div key={label} className='flex items-center justify-between'>
                    <span className='text-zinc-600 text-[11px]'>{label}</span>
                    <span className='text-sm font-bold' style={{ color }}>{val}</span>
                  </div>
                ))}
                <div className='w-full h-1 bg-white/5 rounded-full overflow-hidden'>
                  <div className='h-full rounded-full' style={{ width: '98%', backgroundColor: '#F5A623' }} />
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn>
            <div className='paper-card p-5 relative overflow-hidden group'>
              <Palette className='w-5 h-5 text-primary mb-3 relative' />
              <h3 className='text-sm font-bold text-white mb-1 relative'>Full Customization</h3>
              <p className='text-zinc-500 text-xs leading-relaxed mb-4 relative'>Colors, fonts, backgrounds, textures, custom images. Your space, your brand.</p>
              <div className='flex gap-2 relative'>
                {['#F5A623','#D9901A','#F7B955','#ffffff','#0A0A0A'].map(c => (
                  <div key={c} className='w-6 h-6 rounded-full border border-white/10' style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn>
            <div className='paper-card p-5 relative overflow-hidden group'>
              <Zap className='w-5 h-5 text-primary mb-3 relative' />
              <h3 className='text-sm font-bold text-white mb-1 relative'>Instant Answers</h3>
              <p className='text-zinc-500 text-xs leading-relaxed mb-4 relative'>Powered by advanced AI for sub-2 second responses every time.</p>
              <div className='flex items-end gap-2 relative'>
                <span className='text-3xl font-black text-white'>{'<'}2s</span>
                <span className='text-zinc-500 text-[11px] mb-1'>avg response</span>
              </div>
            </div>
          </FadeIn>

          <FadeIn>
            <div className='paper-card p-5 relative overflow-hidden group'>
              <Shield className='w-5 h-5 text-primary mb-3 relative' />
              <h3 className='text-sm font-bold text-white mb-1 relative'>Private by Default</h3>
              <p className='text-zinc-500 text-xs leading-relaxed relative'>Your knowledge is yours. We never train our models on your data.</p>
            </div>
          </FadeIn>

          <FadeIn className='md:col-span-2'>
            <div className='paper-card p-6 relative overflow-hidden group'>
              <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700'
                style={{ background: 'linear-gradient(135deg, rgba(245,166,35,0.08), transparent 60%)' }} />
              <Globe className='w-6 h-6 text-primary mb-4 relative' />
              <h3 className='text-lg font-bold text-white mb-2 relative'>One Link. Everywhere.</h3>
              <p className='text-zinc-400 text-sm leading-relaxed mb-4 relative'>Share one URL. Your AI handles every question from every visitor — on any device, any time zone, any language.</p>
              <div className='flex items-center gap-3 px-4 py-3 rounded-xl border border-primary/15 bg-primary/[0.04] relative shadow-sm'>
                <span className='w-1.5 h-1.5 rounded-full bg-primary animate-pulse' />
                <span className='text-primary text-sm font-mono font-medium'>onequestion.space/<span className='text-white'>yourname</span></span>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
