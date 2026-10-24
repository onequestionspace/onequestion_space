'use client';

import { MessageCircleQuestion } from 'lucide-react';

const exampleQuestions = [
  { category: 'Services', question: 'What services do you offer?' },
  { category: 'Process', question: 'How do you usually work with clients?' },
  { category: 'Pricing', question: 'What affects your pricing?' },
  { category: 'Experience', question: 'Can you show me examples of your work?' },
  { category: 'Contact', question: 'What is the best way to reach you?' },
];

export function LiveActivity() {
  return (
    <section className="relative border-t border-zinc-200 bg-[#f7f7f5] px-4 py-20 text-black sm:py-28">
      <div className="mx-auto max-w-4xl">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            A preview of the experience
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-5xl">
            Questions your page can help answer.
          </h2>
          <p className="mt-4 text-sm leading-6 text-zinc-600 sm:text-base">
            These are illustrative examples, not live visitor activity. Your page answers using the knowledge you choose to provide.
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {exampleQuestions.map((item) => (
            <article key={item.question} className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-[#f7f7f5]">
                <MessageCircleQuestion className="h-4 w-4 text-zinc-700" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">{item.category}</p>
                <p className="mt-1 text-sm font-medium text-zinc-900">{item.question}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
