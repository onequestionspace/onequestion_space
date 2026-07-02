'use client';

import { Brain, BarChart3, Palette, Zap, Globe, Shield, Link2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function BentoSection() {
  return (
    <section className='relative py-24 overflow-hidden'>
      <div className="absolute top-0 left-0 right-0 h-px section-divider" />
      <div className='absolute inset-0' style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(245,158,11,0.06), transparent 70%)' }} />
      <div className='absolute inset-0' style={{ background: 'radial-gradient(ellipse 40% 40% at 80% 20%, rgba(239,68,68,0.05), transparent 60%)' }} />

      <div className='relative z-10 max-w-5xl mx-auto px-4'>
        <div className='text-center mb-16'>
          <p className='text-amber-400 text-sm font-bold uppercase tracking-widest mb-4'>Everything you need</p>
          <h2 className='text-4xl md:text-5xl font-black text-white leading-tight'>
            Built for people who<br />
            <span className='bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent'>value their time.</span>
          </h2>
        </div>

        {/* Row 1 */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
          {/* Chalk-white card — AI Knowledge */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className='md:col-span-2 rounded-3xl chalk-card p-6 relative overflow-hidden group'
          >
            <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700'
              style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(239,68,68,0.03), transparent 60%)' }} />
            <div className='absolute -right-12 -top-12 w-56 h-56 rounded-full blur-3xl transition-all duration-700 group-hover:opacity-70 opacity-30'
              style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.4), transparent 70%)' }} />
            <div className='absolute top-0 left-0 right-0 h-px'
              style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.2), transparent)' }} />
            <Brain className='w-8 h-8 text-amber-600 mb-5 relative z-10' />
            <h3 className='text-xl font-bold chalk-heading mb-3 relative z-10'>Semantic AI Knowledge</h3>
            <p className='chalk-sub text-sm leading-relaxed mb-6 relative z-10'>Your AI uses vector embeddings to find the most relevant answer — not keyword matching. The more you upload, the smarter it gets.</p>
            <div className='flex flex-wrap gap-2 relative z-10'>
              {['PDF upload', 'URL learning', 'Text training', 'Auto embeddings', 'Context search'].map(tag => (
                <span key={tag} className='px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-700 text-xs font-medium'>{tag}</span>
              ))}
            </div>
          </motion.div>

          {/* Analytics — dark */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className='rounded-3xl border border-white/8 p-6 relative overflow-hidden group'
            style={{ background: 'rgba(255,255,255,0.02)' }}
          >
            <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500' style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.04), transparent)' }} />
            <div className='absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity' style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.2), transparent)' }} />
            <BarChart3 className='w-6 h-6 text-amber-400 mb-4 relative z-10' />
            <h3 className='text-base font-bold text-white mb-2 relative z-10'>Real Analytics</h3>
            <p className='text-zinc-500 text-xs leading-relaxed mb-4 relative z-10'>See every question, visitor and response rate in real time.</p>
            <div className='space-y-3 relative z-10'>
              {[['Questions', '142', '#f59e0b'], ['Visitors', '89', '#fbbf24'], ['Rate', '98%', '#22c55e']].map(([label, val, color]) => (
                <div key={label} className='flex items-center justify-between'>
                  <span className='text-zinc-600 text-xs'>{label}</span>
                  <span className='text-sm font-bold' style={{ color }}>{val}</span>
                </div>
              ))}
              <div className='w-full h-1.5 bg-white/5 rounded-full overflow-hidden'>
                <div className='h-full rounded-full' style={{ width: '98%', background: 'linear-gradient(90deg, #f59e0b, #ef4444)' }} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Row 2 */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
          <div className='rounded-3xl border border-white/8 p-6 relative overflow-hidden group'
            style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className='absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity' style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.2), transparent)' }} />
            <Palette className='w-6 h-6 text-amber-400 mb-4 relative z-10' />
            <h3 className='text-base font-bold text-white mb-2 relative z-10'>Full Customization</h3>
            <p className='text-zinc-500 text-xs leading-relaxed mb-4 relative z-10'>Colors, fonts, backgrounds, chalk textures, custom images. Your space, your brand.</p>
            <div className='flex gap-2 relative z-10'>
              {['#f59e0b','#ef4444','#3b82f6','#22c55e','#f0eef8'].map(c => (
                <div key={c} className='w-7 h-7 rounded-full border-2 border-white/10 hover:scale-110 transition-transform cursor-pointer' style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>

          <div className='rounded-3xl border border-white/8 p-6 relative overflow-hidden group hover:border-yellow-400/20 transition-all duration-500'
            style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className='absolute -right-8 -bottom-8 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500' style={{ backgroundColor: '#facc15' }} />
            <div className='absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity' style={{ background: 'linear-gradient(90deg, transparent, rgba(250,204,21,0.3), transparent)' }} />
            <Zap className='w-6 h-6 text-yellow-400 mb-4 relative z-10' />
            <h3 className='text-base font-bold text-white mb-2 relative z-10'>Instant Answers</h3>
            <p className='text-zinc-500 text-xs leading-relaxed mb-4 relative z-10'>Gemini 2.5 Flash powers sub-2 second responses every time.</p>
            <div className='flex items-end gap-1 relative z-10'>
              <span className='text-4xl font-black text-white'>{'<'}2s</span>
              <span className='text-zinc-500 text-xs mb-1.5'>avg response</span>
            </div>
          </div>

          <div className='rounded-3xl border border-white/8 p-6 relative overflow-hidden group hover:border-white/20 transition-all duration-500'
            style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className='absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity' style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }} />
            <Shield className='w-6 h-6 text-white/60 mb-4 relative z-10' />
            <h3 className='text-base font-bold text-white mb-2 relative z-10'>Private by Default</h3>
            <p className='text-zinc-500 text-xs leading-relaxed relative z-10'>Your knowledge is yours. We never train our models on your data.</p>
          </div>
        </div>

        {/* Row 3 */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='rounded-3xl border border-white/8 p-6 relative overflow-hidden group hover:border-amber-500/20 transition-all duration-500'
            style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className='absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity' style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.2), transparent)' }} />
            <div className='text-3xl mb-3'>📱</div>
            <h3 className='text-base font-bold text-white mb-2'>Mobile First</h3>
            <p className='text-zinc-500 text-xs leading-relaxed'>Built entirely from an Android phone. Works perfectly on any device.</p>
          </div>

          {/* Chalk-white card — One Link */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className='md:col-span-2 rounded-3xl chalk-card p-8 relative overflow-hidden group'
          >
            <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700'
              style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.06), rgba(245,158,11,0.04), transparent 60%)' }} />
            <div className='absolute -left-12 -bottom-12 w-56 h-56 rounded-full blur-3xl transition-all duration-700 group-hover:opacity-60 opacity-20'
              style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.4), transparent 70%)' }} />
            <div className='absolute top-0 left-0 right-0 h-px'
              style={{ background: 'linear-gradient(90deg, transparent, rgba(239,68,68,0.2), transparent)' }} />
            <Globe className='w-8 h-8 text-red-500 mb-5 relative z-10' />
            <h3 className='text-xl font-bold chalk-heading mb-3 relative z-10'>One Link. Everywhere.</h3>
            <p className='chalk-sub text-sm leading-relaxed mb-5 relative z-10'>Share one URL. Your AI handles every question from every visitor — on any device, any time zone, any language.</p>
            <div className='flex items-center gap-3 px-4 py-3 rounded-2xl border border-red-200 bg-red-50/50 relative z-10'>
              <span className='w-2 h-2 rounded-full bg-red-400 animate-pulse' />
              <span className='text-red-600 text-sm font-mono font-medium'>onequestion.space/<span className='text-[#1a1a1a]'>yourname</span></span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
