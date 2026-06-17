'use client';

import { Brain, BarChart3, Palette, Zap, Globe, Shield } from 'lucide-react';

export function BentoSection() {
  return (
    <section className='relative py-24 overflow-hidden'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.06),transparent_70%)]' />
      <div className='relative z-10 max-w-5xl mx-auto px-4'>
        <div className='text-center mb-16'>
          <p className='text-primary text-sm font-semibold uppercase tracking-widest mb-4'>Everything you need</p>
          <h2 className='text-4xl md:text-5xl font-black text-white leading-tight'>
            Built for people who<br /><span className='bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent'>value their time.</span>
          </h2>
        </div>

        {/* Row 1 — big + small */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
          {/* Big card */}
          <div className='md:col-span-2 rounded-3xl border border-white/8 p-8 relative overflow-hidden group hover:border-primary/30 transition-all duration-300' style={{ background: 'linear-gradient(135deg,rgba(147,51,234,0.08),rgba(255,255,255,0.02))' }}>
            <div className='absolute -right-12 -top-12 w-56 h-56 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500' />
            <Brain className='w-8 h-8 text-primary mb-5 relative z-10' />
            <h3 className='text-xl font-bold text-white mb-3 relative z-10'>Semantic AI Knowledge</h3>
            <p className='text-zinc-400 text-sm leading-relaxed mb-6 relative z-10'>Your AI uses vector embeddings to find the most relevant answer — not keyword matching. The more you upload, the smarter it gets.</p>
            <div className='flex flex-wrap gap-2 relative z-10'>
              {['PDF upload', 'Text training', 'Auto embeddings', 'Context search'].map(tag => (
                <span key={tag} className='px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium'>{tag}</span>
              ))}
            </div>
          </div>

          {/* Analytics */}
          <div className='rounded-3xl border border-white/8 p-6 relative overflow-hidden group hover:border-purple-400/30 transition-all duration-300' style={{ background: 'rgba(255,255,255,0.02)' }}>
            <BarChart3 className='w-6 h-6 text-purple-400 mb-4' />
            <h3 className='text-base font-bold text-white mb-2'>Real Analytics</h3>
            <p className='text-zinc-500 text-xs leading-relaxed mb-4'>See every question, visitor and response rate in real time.</p>
            <div className='space-y-3'>
              {[['Questions', '142', '#a855f7'], ['Visitors', '89', '#e879f9'], ['Rate', '98%', '#22c55e']].map(([label, val, color]) => (
                <div key={label} className='flex items-center justify-between'>
                  <span className='text-zinc-600 text-xs'>{label}</span>
                  <span className='text-sm font-bold' style={{ color }}>{val}</span>
                </div>
              ))}
              <div className='w-full h-1.5 bg-white/5 rounded-full overflow-hidden'>
                <div className='h-full rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500' style={{ width: '98%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Row 2 — three equal */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
          <div className='rounded-3xl border border-white/8 p-6 relative overflow-hidden group hover:border-fuchsia-400/30 transition-all duration-300' style={{ background: 'rgba(255,255,255,0.02)' }}>
            <Palette className='w-6 h-6 text-fuchsia-400 mb-4' />
            <h3 className='text-base font-bold text-white mb-2'>Full Customization</h3>
            <p className='text-zinc-500 text-xs leading-relaxed mb-4'>Colors, fonts, backgrounds, social links. Your space, your brand.</p>
            <div className='flex gap-2'>
              {['#a855f7','#3b82f6','#22c55e','#f97316','#ec4899'].map(c => (
                <div key={c} className='w-7 h-7 rounded-full border-2 border-white/10 hover:scale-110 transition-transform cursor-pointer' style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>

          <div className='rounded-3xl border border-white/8 p-6 relative overflow-hidden group hover:border-yellow-400/30 transition-all duration-300' style={{ background: 'rgba(255,255,255,0.02)' }}>
            <Zap className='w-6 h-6 text-yellow-400 mb-4' />
            <h3 className='text-base font-bold text-white mb-2'>Instant Answers</h3>
            <p className='text-zinc-500 text-xs leading-relaxed mb-4'>Gemini 2.5 Flash powers sub-2 second responses every time.</p>
            <div className='flex items-end gap-1'>
              <span className='text-4xl font-black text-white'>{'<'}2s</span>
              <span className='text-zinc-500 text-xs mb-1.5'>avg response</span>
            </div>
          </div>

          <div className='rounded-3xl border border-white/8 p-6 relative overflow-hidden group hover:border-blue-400/30 transition-all duration-300' style={{ background: 'rgba(255,255,255,0.02)' }}>
            <Shield className='w-6 h-6 text-blue-400 mb-4' />
            <h3 className='text-base font-bold text-white mb-2'>Private by Default</h3>
            <p className='text-zinc-500 text-xs leading-relaxed'>Your knowledge is yours. We never train our models on your data.</p>
          </div>
        </div>

        {/* Row 3 — small + big */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='rounded-3xl border border-white/8 p-6 relative overflow-hidden group hover:border-green-400/30 transition-all duration-300' style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className='text-3xl mb-3'>📱</div>
            <h3 className='text-base font-bold text-white mb-2'>Mobile First</h3>
            <p className='text-zinc-500 text-xs leading-relaxed'>Built entirely from an Android phone. Works perfectly on any device.</p>
          </div>

          <div className='md:col-span-2 rounded-3xl border border-white/8 p-8 relative overflow-hidden group hover:border-green-400/30 transition-all duration-300' style={{ background: 'linear-gradient(135deg,rgba(34,197,94,0.06),rgba(255,255,255,0.02))' }}>
            <div className='absolute -left-12 -bottom-12 w-56 h-56 bg-green-500/8 rounded-full blur-3xl' />
            <Globe className='w-8 h-8 text-green-400 mb-5 relative z-10' />
            <h3 className='text-xl font-bold text-white mb-3 relative z-10'>One Link. Everywhere.</h3>
            <p className='text-zinc-400 text-sm leading-relaxed mb-5 relative z-10'>Share one URL. Your AI handles every question from every visitor — on any device, any time zone, any language.</p>
            <div className='flex items-center gap-3 px-4 py-3 rounded-2xl border border-green-500/20 relative z-10' style={{ background: 'rgba(34,197,94,0.05)' }}>
              <span className='w-2 h-2 rounded-full bg-green-400 animate-pulse' />
              <span className='text-green-400 text-sm font-mono font-medium'>onequestion.space/<span className='text-white'>yourname</span></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}