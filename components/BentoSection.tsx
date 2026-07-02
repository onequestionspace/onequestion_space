'use client';

import { Brain, BarChart3, Palette, Zap, Globe, Shield, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export function BentoSection() {
  return (
    <section className='relative py-28 overflow-hidden'>
      <div className="absolute top-0 left-0 right-0 h-px section-divider" />
      <div className='absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/3 to-transparent' />
      <div className='absolute inset-0' style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(245,158,11,0.08), transparent 70%)' }} />
      <div className='absolute inset-0' style={{ background: 'radial-gradient(ellipse 40% 40% at 80% 20%, rgba(239,68,68,0.06), transparent 60%)' }} />

      <div className='relative z-10 max-w-5xl mx-auto px-4'>
        <div className='text-center mb-16'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-6'>
              <Sparkles className='w-3 h-3' />
              Everything you need
            </div>
            <h2 className='text-4xl md:text-6xl font-black text-white leading-tight tracking-tight'>
              Built for people who<br />
              <span className='bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent'>value their time.</span>
            </h2>
          </motion.div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className='md:col-span-2 rounded-3xl chalk-card p-6 relative overflow-hidden group'>
            <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700'
              style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(239,68,68,0.05), transparent 60%)' }} />
            <div className='absolute -right-12 -top-12 w-56 h-56 rounded-full blur-3xl transition-all duration-700 group-hover:opacity-70 opacity-30'
              style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.4), transparent 70%)' }} />
            <Brain className='w-8 h-8 text-amber-600 mb-5 relative z-10' />
            <h3 className='text-xl font-bold chalk-heading mb-3 relative z-10'>Semantic AI Knowledge</h3>
            <p className='chalk-sub text-sm leading-relaxed mb-6 relative z-10'>Your AI uses vector embeddings to find the most relevant answer — not keyword matching. The more you upload, the smarter it gets.</p>
            <div className='flex flex-wrap gap-2 relative z-10'>
              {['PDF upload', 'URL learning', 'Text training', 'Auto embeddings', 'Context search'].map(tag => (
                <span key={tag} className='px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-700 text-xs font-medium shadow-sm'>{tag}</span>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className='rounded-3xl border border-white/8 p-6 relative overflow-hidden group bg-white/[0.02] hover:border-amber-500/30 transition-all duration-500'>
            <div className='absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity' style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.3), transparent)' }} />
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
                <div className='h-full rounded-full animate-gradient' style={{ width: '98%', background: 'linear-gradient(90deg, #f59e0b, #ef4444, #f59e0b)', backgroundSize: '200% 100%' }} />
              </div>
            </div>
          </motion.div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
          {[
            { icon: Palette, title: 'Full Customization', desc: 'Colors, fonts, backgrounds, chalk textures, custom images. Your space, your brand.', colors: ['#f59e0b','#ef4444','#3b82f6','#22c55e','#f0eef8'] },
            { icon: Zap, title: 'Instant Answers', desc: 'Gemini 2.5 Flash powers sub-2 second responses every time.', accent: '#facc15', extra: <div className='flex items-end gap-1 relative z-10'><span className='text-4xl font-black text-white'>{'<'}2s</span><span className='text-zinc-500 text-xs mb-1.5'>avg response</span></div> },
            { icon: Shield, title: 'Private by Default', desc: 'Your knowledge is yours. We never train our models on your data.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className='rounded-3xl border border-white/8 p-6 relative overflow-hidden group bg-white/[0.02] hover:border-amber-500/30 transition-all duration-500'>
              <div className='absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity' style={{ background: `linear-gradient(90deg, transparent, ${item.accent || 'rgba(245,158,11,0.3)'}, transparent)` }} />
              <item.icon className={`w-6 h-6 mb-4 relative z-10 ${i === 2 ? 'text-white/60' : 'text-amber-400'}`} />
              <h3 className='text-base font-bold text-white mb-2 relative z-10'>{item.title}</h3>
              <p className='text-zinc-500 text-xs leading-relaxed mb-4 relative z-10'>{item.desc}</p>
              {item.colors && <div className='flex gap-2 relative z-10'>{item.colors.map(c => <div key={c} className='w-7 h-7 rounded-full border-2 border-white/10 hover:scale-110 transition-transform cursor-pointer shadow-sm' style={{ backgroundColor: c }} />)}</div>}
              {item.extra}
            </motion.div>
          ))}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className='rounded-3xl border border-white/8 p-6 relative overflow-hidden group bg-white/[0.02] hover:border-amber-500/30 transition-all duration-500'>
            <div className='text-3xl mb-3'>📱</div>
            <h3 className='text-base font-bold text-white mb-2'>Mobile First</h3>
            <p className='text-zinc-500 text-xs leading-relaxed'>Built entirely from an Android phone. Works perfectly on any device.</p>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className='md:col-span-2 rounded-3xl chalk-card p-8 relative overflow-hidden group'>
            <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700'
              style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(245,158,11,0.06), transparent 60%)' }} />
            <div className='absolute -left-12 -bottom-12 w-56 h-56 rounded-full blur-3xl transition-all duration-700 group-hover:opacity-60 opacity-20'
              style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.4), transparent 70%)' }} />
            <Globe className='w-8 h-8 text-red-500 mb-5 relative z-10' />
            <h3 className='text-xl font-bold chalk-heading mb-3 relative z-10'>One Link. Everywhere.</h3>
            <p className='chalk-sub text-sm leading-relaxed mb-5 relative z-10'>Share one URL. Your AI handles every question from every visitor — on any device, any time zone, any language.</p>
            <div className='flex items-center gap-3 px-4 py-3 rounded-2xl border border-red-200 bg-red-50/50 relative z-10 shadow-sm'>
              <span className='w-2 h-2 rounded-full bg-red-400 animate-pulse' />
              <span className='text-red-600 text-sm font-mono font-medium'>onequestion.space/<span className='text-[#1a1a1a]'>yourname</span></span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
