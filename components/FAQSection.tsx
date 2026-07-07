'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FadeIn } from '@/components/motion/FadeIn';

const FAQS = [
  { q: 'Is the free plan actually free?', a: 'Yes. No credit card, no trial period, no expiry. 50 AI answers a month forever. I hate fake free tiers.' },
  { q: 'What happens if I hit my limit?', a: 'Your space stays live — visitors just see a friendly message that answers are paused. You can buy extra credits or upgrade anytime from your dashboard.' },
  { q: 'Can I cancel Pro anytime?', a: 'Yes. One click. No emails asking why. No retention flow. Just cancel.' },
  { q: 'How does the AI know my answers?', a: 'You upload your knowledge — bio, FAQs, services, projects. The AI uses vector search to find the most relevant answer from what you have taught it. It sounds like you because it is trained on your content.' },
  { q: 'Does it work on mobile?', a: 'Yes. Every space is fully responsive. Visitors can ask questions from any device — phone, tablet, desktop.' },
  { q: 'Can I customize how my space looks?', a: 'Absolutely. Multiple backgrounds, effects, colors, fonts, card styles, and custom image uploads. Your space, your brand.' },
  { q: 'Why $9/month for Pro?', a: "Honest answer: it covers Gemini API, Convex, Vercel, and lets me keep building. It's not a number a VC told me — it's what makes sense." },
  { q: 'Why does a 19-year-old from Nigeria get to build this?', a: 'Honestly I ask myself that too sometimes. But the problem was real, the tools existed, and nobody else was building exactly this. So here we are.' },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(245,166,35,0.15), transparent)' }} />
      <div className="absolute inset-0 amber-radial-soft pointer-events-none" />
      <div className="relative max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold mb-5">
              <HelpCircle className="w-3 h-3" />
              FAQ
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-3">
              Questions people<br />
              <span className="gradient-text">actually ask.</span>
            </h2>
            <p className="text-zinc-500 text-sm">Honest answers to honest questions.</p>
          </FadeIn>
        </div>

        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="paper-card-static overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
              >
                <span className="text-sm font-medium text-white">{faq.q}</span>
                <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 pt-0">
                      <p className="text-sm text-zinc-400 leading-relaxed">{faq.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
