'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export function PricingSection() {
  const { isSignedIn } = useAuth();
  const createHref = isSignedIn ? '/dashboard' : '/sign-up';

  return (
    <section id="pricing" className="scroll-mt-20 border-t border-zinc-200 bg-white px-4 py-20 text-black sm:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-xl">
          <p className="text-sm font-medium text-zinc-500">Pricing</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            Start free. Upgrade when it helps.
          </h2>
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

          <article className="flex flex-col rounded-xl border border-zinc-300 p-6 sm:p-8">
            <div>
              <h3 className="text-base font-medium">Pro</h3>
              <p className="mt-4 text-4xl font-semibold tracking-tight">
                $9 <span className="text-base font-normal text-zinc-500">/ month</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-zinc-600">
                <li>500 answers per month</li>
                <li>Analytics</li>
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
