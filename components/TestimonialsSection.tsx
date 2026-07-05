'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: 'I used to get the same 5 questions every single day. Now I just send people my space and let the AI handle it. Best decision I made all year.',
    name: 'Lena M.',
    role: 'Freelance Designer',
    color: '#f59e0b',
    initial: 'L',
  },
  {
    quote: 'Honestly was skeptical about AI answering for me, but it sounds exactly like how I would respond. Even uses my slang correctly.',
    name: 'Kwame A.',
    role: 'Software Engineer',
    color: '#3b82f6',
    initial: 'K',
  },
  {
    quote: 'Setup took literally 3 minutes. Now my bio link page actually answers questions instead of just showing my face. Game changer.',
    name: 'Priya S.',
    role: 'Product Manager',
    color: '#22c55e',
    initial: 'P',
  },
  {
    quote: 'I train my AI on every new project I launch. My visitors get instant answers about pricing, timeline, process — even at 3 AM.',
    name: 'Carlos T.',
    role: 'Independent Consultant',
    color: '#ec4899',
    initial: 'C',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function TestimonialsSection() {
  return (
    <section className='relative py-28 overflow-hidden'>
      <div className="absolute top-0 left-0 right-0 h-px section-divider" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/3 to-transparent" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(245,158,11,0.06), transparent 70%)' }} />

      <div className='relative z-10 max-w-4xl mx-auto px-4'>
        <div className='text-center mb-16'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-6'>
              <Quote className='w-3 h-3' />
              Real people. Real results.
            </div>
            <h2 className='text-4xl md:text-6xl font-black text-white leading-tight tracking-tight'>
              What early users<br />
              <span className='bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent'>are saying.</span>
            </h2>
          </motion.div>
        </div>

        <motion.div
          className='grid grid-cols-1 md:grid-cols-2 gap-4'
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              className='p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04] transition-all group relative overflow-hidden'
            >
              <div className='absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
              <div className='flex items-center gap-3 mb-4'>
                <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${t.name}`} alt="" className="w-10 h-10 rounded-full shrink-0 shadow-lg" />
                <div>
                  <p className='text-white text-sm font-semibold'>{t.name}</p>
                  <p className='text-zinc-500 text-xs'>{t.role}</p>
                </div>
              </div>
              <p className='text-zinc-400 text-sm leading-relaxed'>&ldquo;{t.quote}&rdquo;</p>
              <div className='flex gap-1 mt-4'>
                {[...Array(5)].map((_, j) => (
                  <svg key={j} className='w-3.5 h-3.5' style={{ color: t.color }} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
