'use client';

import { useState } from 'react';
// framer-motion removed for mobile stability
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FadeIn } from '@/components/motion/FadeIn';

const FAQS = [
  { q: 'Can I start without a credit card?', a: 'The free plan is designed to let you set up a page before paying. Check the pricing page for the current monthly answer allowance and any plan limits.' },
  { q: 'What happens when I reach my answer limit?', a: 'AI answers may pause until your allowance resets or you change plans. Check the usage and billing screens for your current plan details before relying on the page for a time-sensitive workflow.' },
  { q: 'How does the AI know what to say?', a: 'You add source material such as your bio, services, FAQs, project details, and supported documents or URLs. The system uses that information to help answer visitors. Review and test the page regularly; AI can still make mistakes.' },
  { q: 'Can I control what visitors learn about me?', a: 'Yes. Only add information you are comfortable sharing and are authorized to publish. Avoid passwords, private customer information, confidential documents, and other sensitive data.' },
  { q: 'Will the AI always answer correctly?', a: 'No AI system is perfect. Good source material helps, but answers can still be incomplete or wrong. Test important questions, keep your knowledge current, and provide a clear way for visitors to contact you when they need a definitive answer.' },
  { q: 'Does it work on mobile?', a: 'The public page is designed to be usable on phones, tablets, and desktop browsers. We recommend checking your own page on a phone before sharing it widely.' },
  { q: 'Can I customize my page?', a: 'You can edit your profile and use the appearance options supported by your account. Available customization can change as the product evolves.' },
  { q: 'What is included in Pro?', a: 'Pro is listed at $9/month and includes a higher monthly answer allowance and additional features such as advanced analytics. Review the live pricing and billing screens for current limits and terms.' },
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
            <div
              key={i}
              className="paper-card-static overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
              >
                <span className="text-sm font-medium text-white">{faq.q}</span>
                <div>
                  <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
                </div>
              </button>
                {open === i && (
                  <div
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 pt-0">
                      <p className="text-sm text-zinc-400 leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
