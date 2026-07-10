'use client';

// framer-motion removed for mobile stability
import { Quote } from 'lucide-react';
import { FadeIn } from '@/components/motion/FadeIn';

const testimonials = [
  {
    quote: 'I used to get the same 5 questions every single day. Now I just send people my space and let the AI handle it. Best decision I made all year.',
    name: 'Lena M.',
    role: 'Freelance Designer',
    avatar: 'https://i.pravatar.cc/150?img=29',
  },
  {
    quote: 'Honestly was skeptical about AI answering for me, but it sounds exactly like how I would respond. Even uses my slang correctly.',
    name: 'Kwame A.',
    role: 'Software Engineer',
    avatar: 'https://i.pravatar.cc/150?img=13',
  },
  {
    quote: 'Setup took literally 3 minutes. Now my bio link page actually answers questions instead of just showing my face. Game changer.',
    name: 'Priya S.',
    role: 'Product Manager',
    avatar: 'https://i.pravatar.cc/150?img=44',
  },
  {
    quote: 'I train my AI on every new project I launch. My visitors get instant answers about pricing, timeline, process — even at 3 AM.',
    name: 'Carlos T.',
    role: 'Independent Consultant',
    avatar: 'https://i.pravatar.cc/150?img=14',
  },
];

export function TestimonialsSection() {
  return (
    <section className='relative py-24 overflow-hidden'>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(245,166,35,0.15), transparent)' }} />
      <div className="absolute inset-0 amber-radial-soft pointer-events-none" />

      <div className='relative max-w-4xl mx-auto px-4 sm:px-6'>
        <div className='text-center mb-14'>
          <FadeIn>
            <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold mb-5'>
              <Quote className='w-3 h-3' />
              Real people. Real results.
            </div>
            <h2 className='text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight'>
              What early users<br />
              <span className='gradient-text'>are saying.</span>
            </h2>
          </FadeIn>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          {testimonials.map((t, i) => (
            <FadeIn key={i} delay={i * 0.08} y={16}>
              <div className='paper-card p-5 relative group'>
                <div className='absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
                <div className='flex items-center gap-3 mb-3'>
                  <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full shrink-0 shadow-lg object-cover" loading="lazy" />
                  <div>
                    <p className='text-white text-sm font-semibold'>{t.name}</p>
                    <p className='text-zinc-500 text-[11px]'>{t.role}</p>
                  </div>
                </div>
                <p className='text-zinc-300 text-sm leading-relaxed'>&ldquo;{t.quote}&rdquo;</p>
                <div className='flex gap-1 mt-3'>
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className='w-3 h-3 text-primary' fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
