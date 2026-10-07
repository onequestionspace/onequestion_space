'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Check, Loader2 } from 'lucide-react';

function BillingContent() {
  const { isSignedIn, isLoaded, userId } = useAuth();
  const { user } = useUser();
  const searchParams = useSearchParams();
  const subscription = useQuery(api.subscriptions.getSubscription, userId ? { userId } : 'skip');
  const ensureSubscription = useMutation(api.subscriptions.getOrCreateSubscription);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentState, setPaymentState] = useState<'idle' | 'success' | 'failed'>('idle');
  const isVerifyingPayment = paymentState === 'idle' && !!searchParams.get('reference') && !!userId;

  useEffect(() => {
    if (userId && subscription === null) {
      void ensureSubscription({ userId }).catch((subscriptionError) => {
        console.error('Could not create billing record:', subscriptionError);
        setError('Could not load your plan. Please refresh and try again.');
      });
    }
  }, [userId, subscription, ensureSubscription]);

  useEffect(() => {
    const reference = searchParams.get('reference');
    if (!reference || !userId) return;

    let active = true;
    void fetch(`/api/paystack/verify?reference=${encodeURIComponent(reference)}`)
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.success || !result.data?.success) {
          throw new Error(result.error || 'Payment verification failed.');
        }
        if (active) setPaymentState('success');
      })
      .catch((verificationError) => {
        console.error('Payment verification failed:', verificationError);
        if (active) setPaymentState('failed');
      });

    return () => {
      active = false;
    };
  }, [searchParams, userId]);

  if (!isLoaded) {
    return <div className="text-sm text-zinc-500">Loading billing…</div>;
  }
  if (!isSignedIn) redirect('/');

  const isPro = subscription?.plan === 'pro' && subscription.status === 'active';
  const used = subscription?.messagesUsed ?? 0;
  const limit = subscription?.messagesLimit ?? 50;
  const remaining = Math.max(0, limit - used);

  const handleUpgrade = async () => {
    if (!userId) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/paystack/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.emailAddresses?.[0]?.emailAddress }),
      });
      const result = await response.json();
      if (!response.ok || !result.success || !result.data?.authorization_url) {
        throw new Error(result.error || 'Could not start checkout.');
      }
      window.location.assign(result.data.authorization_url);
    } catch (upgradeError) {
      console.error('Could not start Pro checkout:', upgradeError);
      setError(upgradeError instanceof Error ? upgradeError.message : 'Could not start checkout.');
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Billing" description="A clear plan, with no extras to decode.">
      <div className="mx-auto max-w-3xl space-y-5">
        {error && (
          <p role="alert" className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
            {error}
          </p>
        )}
        {isVerifyingPayment && (
          <p role="status" className="flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-3 text-sm text-zinc-600">
            <Loader2 className="h-4 w-4 animate-spin" /> Confirming your payment…
          </p>
        )}
        {paymentState === 'success' && (
          <p role="status" className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
            Payment confirmed. {isPro ? 'Your Pro benefits are active.' : 'Your Pro plan is activating.'}
          </p>
        )}
        {paymentState === 'failed' && (
          <p role="alert" className="rounded-lg border border-zinc-200 px-4 py-3 text-sm text-zinc-700">
            We could not confirm this payment. If you were charged, contact hello@onequestion.space.
          </p>
        )}

        <section className="rounded-xl border border-zinc-200 p-5 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Current plan</p>
              <h2 className="mt-2 text-xl font-semibold capitalize tracking-tight text-zinc-950">
                {subscription === undefined ? 'Loading…' : isPro ? 'Pro' : 'Free'}
              </h2>
              <p className="mt-1 text-sm text-zinc-600">
                {subscription === undefined ? 'Checking your usage' : `${used} of ${limit} answers used · ${remaining} remaining this month`}
              </p>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 sm:max-w-56">
              <div
                className="h-full rounded-full bg-black transition-[width] duration-300"
                style={{ width: `${limit > 0 ? Math.min((used / limit) * 100, 100) : 0}%` }}
              />
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <article className={`rounded-xl border p-5 sm:p-6 ${!isPro ? 'border-zinc-400' : 'border-zinc-200'}`}>
            <p className="text-sm font-medium text-zinc-950">Free</p>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950">$0</p>
            <p className="mt-1 text-sm text-zinc-500">50 answers per month</p>
            {!isPro && <p className="mt-6 text-xs font-medium text-zinc-500">Your current plan</p>}
          </article>

          <article className={`rounded-xl border p-5 sm:p-6 ${isPro ? 'border-zinc-400 bg-zinc-50' : 'border-zinc-200'}`}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-950">Pro</p>
              {isPro && <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-600">Active</span>}
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950">
              $9 <span className="text-sm font-normal text-zinc-500">/ month</span>
            </p>
            <ul className="mt-5 space-y-3 text-sm text-zinc-700">
              {['500 answers per month', 'Analytics', 'Remove OneQuestion branding'].map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-zinc-500" />
                  {feature}
                </li>
              ))}
            </ul>
            {isPro ? (
              <p className="mt-6 text-xs text-zinc-500">Your paid features are active on your public page and dashboard.</p>
            ) : (
              <button
                type="button"
                onClick={() => void handleUpgrade()}
                disabled={loading || subscription === undefined}
                className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-lg bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Opening secure checkout…' : 'Upgrade to Pro'}
              </button>
            )}
          </article>
        </section>

        <p className="text-center text-xs text-zinc-500">
          Secure checkout via Paystack. <Link href="/terms" className="underline underline-offset-4 hover:text-black">Plan terms</Link>
        </p>
      </div>
    </DashboardLayout>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-zinc-500">Loading billing…</div>}>
      <BillingContent />
    </Suspense>
  );
}
