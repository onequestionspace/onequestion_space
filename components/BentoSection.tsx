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

        <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>

          {/* Big card — AI Knowledge */}
          <div className='col-span-2 md:col-span-2 rounded-3xl border border-white/8 p-8 relative overflow-hidden group hover:border-primary/30 transition-all' style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className='absolute -right-8 -top-8 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/15 transition-all' />
            <Brain className='w-8 h-8 text-primary mb-5' />
            <h3 className='text-xl font-bold text-white mb-2'>Semantic AI Knowledge</h3>
            <p className='text-zinc-400 text-sm leading-relaxed mb-6'>Your AI uses vector embeddings to find the most relevant knowledge and answer with precision — not keyword matching.</p>
            <div className='flex flex-wrap gap-2'>
              {['PDF upload', 'Text training', 'Auto embeddings', 'Context search'].map(tag => (
                <span key={tag} className='px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium'>{tag}</span>
              ))}
            </div>
          </div>

          {/* Analytics */}
          <div className='rounded-3xl border border-white/8 p-6 relative overflow-hidden group hover:border-purple-500/30 transition-all' style={{ background: 'rgba(255,255,255,0.02)' }}>
            <BarChart3 className='w-6 h-6 text-purple-400 mb-4' />
            <h3 className='text-base font-bold text-white mb-2'>Real Analytics</h3>
            <p className='text-zinc-500 text-xs leading-relaxed'>See every question, visitor count and response rate in real time.</p>
            <div className='mt-4 space-y-2'>
              {[['Questions', '142', 'text-purple-400'], ['Visitors', '89', 'text-fuchsia-400'], ['Rate', '98%', 'text-green-400']].map(([label, val, color]) => (
                <div key={label} className='flex items-center justify-between'>
                  <span className='text-zinc-600 text-xs'>{label}</span>
                  <span className={'text-sm font-bold ' + color}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Customization */}
          <div className='rounded-3xl border border-white/8 p-6 relative overflow-hidden group hover:border-fuchsia-500/30 transition-all' style={{ background: 'rgba(255,255,255,0.02)' }}>
            <Palette className='w-6 h-6 text-fuchsia-400 mb-4' />
            <h3 className='text-base font-bold text-white mb-2'>Full Customization</h3>
            <p className='text-zinc-500 text-xs leading-relaxed'>Colors, fonts, backgrounds, social links. Make it yours.</p>
            <div className='mt-4 flex gap-2'>
              {['#a855f7','#3b82f6','#22c55e','#f97316','#ec4899'].map(c => (
                <div key={c} className='w-6 h-6 rounded-full border-2 border-white/10' style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>

          {/* Speed */}
          <div className='rounded-3xl border border-white/8 p-6 relative overflow-hidden group hover:border-yellow-500/30 transition-all' style={{ background: 'rgba(255,255,255,0.02)' }}>
            <Zap className='w-6 h-6 text-yellow-400 mb-4' />
            <h3 className='text-base font-bold text-white mb-2'>Instant Answers</h3>
            <p className='text-zinc-500 text-xs leading-relaxed'>Gemini 2.5 Flash powers responses in under 2 seconds.</p>
            <div className='mt-4 flex items-end gap-1'>
              <span className='text-3xl font-black text-white'>{'<'}2s</span>
              <span className='text-zinc-500 text-xs mb-1'>response time</span>
            </div>
          </div>

          {/* Big card — Space */}
          <div className='col-span-2 md:col-span-2 rounded-3xl border border-white/8 p-8 relative overflow-hidden group hover:border-green-500/30 transition-all' style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className='absolute -left-8 -bottom-8 w-48 h-48 bg-green-500/8 rounded-full blur-3xl' />
            <Globe className='w-8 h-8 text-green-400 mb-5' />
            <h3 className='text-xl font-bold text-white mb-2'>Your Space. Your Brand.</h3>
            <p className='text-zinc-400 text-sm leading-relaxed mb-4'>One shareable link. Custom colors, bio, welcome message and social links. Looks like you built it from scratch.</p>
            <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-mono'>
              onequestion.space/<span className='text-white'>yourname</span>
            </div>
          </div>

          {/* Trust */}
          <div className='rounded-3xl border border-white/8 p-6 relative overflow-hidden group hover:border-blue-500/30 transition-all' style={{ background: 'rgba(255,255,255,0.02)' }}>
            <Shield className='w-6 h-6 text-blue-400 mb-4' />
            <h3 className='text-base font-bold text-white mb-2'>Private by Default</h3>
            <p className='text-zinc-500 text-xs leading-relaxed'>Your knowledge stays yours. We never train our models on your data.</p>
          </div>
        </div>
      </div>
    </section>
  );
}