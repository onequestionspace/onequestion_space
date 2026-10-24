'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  { q: 'What is OneQuestion?', a: 'OneQuestion gives you a shareable page where people can ask about your work. You add the information you want your page to use, and its AI uses that context to help answer visitors.' },
  { q: 'What should I add to my knowledge?', a: 'Start with the information people ask you for repeatedly: what you do, who you help, your services, pricing or packages, FAQs, project examples, and the best way to contact you. Do not add private information you would not want used to answer visitors.' },
  { q: 'Will the AI know everything about me?', a: 'No. Answers depend on the information you provide and the system’s available context. Review your knowledge, test common questions, and update it when your work changes. Visitors may ask something your page cannot answer.' },
  { q: 'What happens when the AI does not know an answer?', a: 'Keep your knowledge clear and current, and review questions in your dashboard inbox where available. For important business details, make sure your page also gives visitors a clear way to contact you.' },
  { q: 'Can I change how my page looks?', a: 'You can personalize the profile and available appearance options in Space Studio. The exact options depend on the controls available in your account.' },
  { q: 'Can I use OneQuestion for my business?', a: 'Yes. It can be useful for consultants, freelancers, creators, educators, and small businesses that repeatedly explain their work. It is not a replacement for professional advice or a human response when a question needs judgment.' },
  { q: 'What is included in the free plan?', a: 'The current pricing page lists a free plan with a monthly AI-answer allowance. Check the pricing page for the latest limits and features, since plan details can change.' },
  { q: 'Can I control what the AI shares?', a: 'You control the knowledge you add. Only include information you are comfortable making available through your public page, and test how the page responds before sharing the link widely.' },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="border-t border-zinc-200 bg-zinc-50 px-4 py-20 text-zinc-950 sm:py-28" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600">
            <HelpCircle className="h-3.5 w-3.5" />
            Frequently asked questions
          </div>
          <h2 id="faq-heading" className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
            Clear answers before you begin.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-600 sm:text-base">
            Understand how the page works, what to share, and where the AI has limits.
          </p>
        </div>

        <div className="divide-y divide-zinc-200 border-y border-zinc-200 bg-white">
          {FAQS.map((faq, i) => (
            <div key={faq.q}>
              <button
                type="button"
                aria-expanded={open === i}
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-5 px-4 py-5 text-left transition-colors hover:bg-zinc-50 sm:px-6"
              >
                <span className="text-sm font-medium text-zinc-900 sm:text-base">{faq.q}</span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && (
                <div className="px-4 pb-5 sm:px-6">
                  <p className="max-w-2xl text-sm leading-7 text-zinc-600">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <span className="text-zinc-600">Ready to make your page?</span>
          <Link href="/sign-up" className="font-medium text-zinc-950 underline underline-offset-4 hover:text-zinc-600">Create a free page</Link>
          <span className="text-zinc-300" aria-hidden="true">·</span>
          <Link href="/pricing" className="font-medium text-zinc-950 underline underline-offset-4 hover:text-zinc-600">Compare plans</Link>
        </div>
      </div>
    </section>
  );
}
