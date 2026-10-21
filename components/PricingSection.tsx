'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export function PricingSection() {
  const { isSignedIn } = useAuth();
  const createHref = isSignedIn ? '/dashboard' : '/sign-up';

  return (
    <section id="pricing" className="relative scroll-mt-20 overflow-hidden border-t border-zinc-200 bg-[#f7f7f5] px-4 py-20 text-black sm:py-28">
      <div className="nest-lines pointer-events-none absolute inset-x-0 top-0 h-64 opacity-25" aria-hidden="true" />
      <div className="relative mx-auto max-w-5xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Simple pricing</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-5xl">
              Start free. Stay useful.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-zinc-600">Everything you need to turn repeated questions into a helpful public space.</p>
          </div>
          <span className="w-fit rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-600">No credit card required</span>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <article className="flex flex-col rounded-xl border border-zinc-200 p-6 sm:p-8">
            <div>
              <h3 className="text-base font-medium">Free</h3>
              <p className="mt-4 text-4xl font-semibold tracking-tight">$0</p>
              <p className="mt-1 text-sm text-zinc-500">50 answers per month</p>
            </div>
            <Link
              href={createHref}
              className="mt-8 inline-flex h-11 items-center justify-center rounded-lg bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
            >
              Create your page
            </Link>
          </article>

          <article className="relative flex flex-col rounded-xl border border-zinc-900 bg-zinc-950 p-6 text-white shadow-[0_18px_50px_rgba(9,9,11,0.14)] sm:p-8">
            <span className="absolute right-6 top-6 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-900">Most useful</span>
            <div>
              <h3 className="text-base font-medium">Pro</h3>
              <p className="mt-4 text-4xl font-semibold tracking-tight">
                $9 <span className="text-base font-normal text-zinc-400">/ month</span>
              </p>
              <p className="mt-2 text-xs text-zinc-400">Less than one coffee. More useful than another link page.</p>
              <ul className="mt-5 space-y-2 text-sm text-zinc-300">
                <li>500 answers per month</li>
                <li>Analytics and question inbox</li>
                <li>Remove OneQuestion branding</li>
              </ul>
            </div>
            <Link
              href={isSignedIn ? '/dashboard/billing' : '/sign-up'}
              className="mt-8 inline-flex h-11 items-center justify-center rounded-lg bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
            >
              {isSignedIn ? 'Choose Pro' : 'Create your page'}
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
