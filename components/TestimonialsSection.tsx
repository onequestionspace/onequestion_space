'use client';

import Link from 'next/link';
import { BriefcaseBusiness, BookOpenText, MessageCircleQuestion } from 'lucide-react';

const useCases = [
  {
    icon: BriefcaseBusiness,
    title: 'Independent professionals',
    description: 'Answer recurring questions about your services, process, availability, and pricing—using the information you choose to share.',
  },
  {
    icon: BookOpenText,
    title: 'Creators and educators',
    description: 'Give your audience one place to ask about your work, projects, resources, and expertise instead of repeating the same replies in DMs.',
  },
  {
    icon: MessageCircleQuestion,
    title: 'Small teams and businesses',
    description: 'Create a public knowledge page for common questions, so visitors can find supported answers before they contact you.',
  },
];

export function TestimonialsSection() {
  return (
    <section className="relative border-t border-zinc-200 bg-white px-4 py-20 text-black sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Made for repeat questions
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-5xl">
            Your knowledge should work even when you’re offline.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-600 sm:text-base">
            OneQuestion turns information you provide into a shareable Q&A page. Visitors can ask in their own words, and the AI answers from your knowledge—not invented claims about your work.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {useCases.map(({ icon: Icon, title, description }) => (
            <article key={title} className="rounded-xl border border-zinc-200 bg-[#f7f7f5] p-6 sm:p-7">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-white">
                <Icon className="h-5 w-5 text-zinc-700" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-base font-semibold tracking-tight">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{description}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 rounded-xl border border-zinc-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-sm font-semibold">Try it with your real questions.</p>
            <p className="mt-1 text-sm text-zinc-500">Start free, add your own knowledge, and check whether the answers are useful.</p>
          </div>
          <Link
            href="/sign-up"
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-lg bg-black px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Create your page
          </Link>
        </div>
      </div>
    </section>
  );
}
