'use client';
import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardHeader, ProgressBar } from '@/components/dashboard/Card';
import { Badge } from '@/components/dashboard/Badge';
import { Button } from '@/components/dashboard/Button';
import { CardSkeleton } from '@/components/dashboard/Skeleton';
import { Check, Zap, Sparkles, Minus, Plus, Loader2, ShieldCheck, AlertTriangle } from 'lucide-react';



const CREDIT_PRICE_USD = 0.018;

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    credits: 50,
    features: ['50 AI answers/month', 'Basic analytics', 'Space customization', 'Knowledge base'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9,
    credits: 500,
    features: [
      '500 AI answers/month',
      'Advanced analytics',
      'Priority AI processing',
      'Remove One Question branding',
      'Custom welcome message',
    ],
    recommended: true,
  },
];

const CREDIT_PACKS = [
  { credits: 50, label: 'Starter' },
  { credits: 100, label: 'Basic' },
  { credits: 250, label: 'Growth' },
  { credits: 500, label: 'Pro' },
  { credits: 1000, label: 'Power' },
];

function BillingContent() {
  const { isSignedIn, isLoaded, userId } = useAuth();
  const { user } = useUser();
  const [creditAmount, setCreditAmount] = useState(100);
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');
  const [verifyStatus, setVerifyStatus] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const reference = searchParams.get('reference');
    if (!reference) return;
    setVerifyStatus('verifying');
    fetch('/api/paystack/verify?reference=' + reference)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data?.success) {
          setVerifyStatus('success');
        } else {
          setVerifyStatus('failed');
        }
      })
      .catch(() => setVerifyStatus('failed'));
  }, [searchParams]);

  const subscription = useQuery(api.subscriptions.getSubscription, userId ? { userId } : 'skip');

  if (!isLoaded) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-zinc-500 text-sm">Loading...</div>
    </div>
  );
  if (!isSignedIn) { redirect('/'); }

  const ADMIN_IDS = ['user_3EhKmuVyC1AhoBDlL7QNssllwgu', 'user_3Fmuk2jHEa5seXKEzewhWlA9yQs'];
  const isAdmin = userId ? ADMIN_IDS.includes(userId) : false;
  const used = subscription?.messagesUsed ?? 0;
  const limit = subscription?.messagesLimit ?? 50;
  const plan = subscription?.plan ?? 'free';
  const usagePercent = isAdmin ? 0 : Math.min(Math.round((used / limit) * 100), 100);
  const creditCostUSD = (creditAmount * CREDIT_PRICE_USD).toFixed(2);

  const handleUpgrade = async (planId: string, priceUSD: number) => {
    if (!userId || priceUSD === 0) return;
    setLoading(planId);
    setError('');
    try {
      const res = await fetch('/api/paystack/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.emailAddresses?.[0]?.emailAddress }),
      });
      const data = await res.json();
      if (data.data?.authorization_url) {
        window.location.assign(data.data.authorization_url);
      } else {
        setError(data.error || 'Failed to start checkout.');
      }
    } catch {
      setError('Something went wrong. Try again.');
    }
    setLoading('');
  };

  const handleBuyCredits = async () => {
    if (!userId) return;
    setLoading('credits');
    setError('');
    try {
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(creditAmount * CREDIT_PRICE_USD * 100),
          metadata: { credits: creditAmount, type: 'credits' },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to start checkout.');
        setLoading('');
        return;
      }
      if (data.data?.authorization_url) {
        window.location.href = data.data.authorization_url;
      } else {
        setError('No checkout URL returned.');
        setLoading('');
      }
    } catch {
      setError('Connection error. Please try again.');
      setLoading('');
    }
  };

  return (
    <DashboardLayout title="Billing" description="Honest pricing. No surprises.">
      <div className="max-w-3xl mx-auto space-y-8">

        <div>
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 flex items-start gap-3">
            <span className="text-lg shrink-0 mt-0.5">🇳🇬</span>
            <div>
              <p className="text-amber-400 text-xs font-semibold">Prices show in Nigerian Naira at checkout</p>
              <p className="text-zinc-500 text-xs mt-0.5">
                I&apos;m based in Nigeria and use Paystack. Your card works perfectly — it converts automatically at your bank&apos;s rate.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div>
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 flex items-center gap-2 text-red-400 text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          </div>
        )}
        {verifyStatus === 'verifying' && (
          <div>
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 flex items-center gap-2 text-amber-500 text-sm">
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              Checking your payment...
            </div>
          </div>
        )}
        {verifyStatus === 'success' && (
          <div>
            <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-4 flex items-center gap-2 text-green-400 text-sm">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              Payment confirmed. Your AI just got more runway.
            </div>
          </div>
        )}
        {verifyStatus === 'failed' && (
          <div>
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
              Payment verification failed. If you were charged, email asym@onequestion.space and I&apos;ll sort it out.
            </div>
          </div>
        )}

        <div>
          {!subscription ? (
            <CardSkeleton />
          ) : (
            <Card>
              <CardHeader title="Usage" description="What you have used this month" />
              <div className="flex items-end gap-2 mb-3">
                <span className="text-4xl font-bold text-white">{used}</span>
                <span className="text-lg text-zinc-500 mb-1">/ {limit} credits</span>
                <span className="ml-auto">
                  <Badge variant={plan === 'pro' ? 'default' : 'neutral'} className="capitalize">{plan}</Badge>
                </span>
              </div>
              <ProgressBar value={used} max={limit} />
              <p className="text-xs text-zinc-500 mt-2">{limit - used} credits left this month</p>
            </Card>
          )}
        </div>

        <div>
          <h2 className="text-base font-semibold text-white mb-4">Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PLANS.map(p => (
              <div
                key={p.id}
                className={`rounded-2xl p-6 border-2 transition-all duration-200 ${
                  plan === p.id
                    ? 'border-amber-500 bg-amber-500/[0.03] shadow-[0_0_30px_rgba(245,158,11,0.08)]'
                    : 'border-white/[0.06] bg-white/[0.03] hover:border-white/[0.12] hover:bg-white/[0.05]'
                }`}
              >
                {p.recommended && (
                  <Badge variant="default" className="mb-3">Recommended</Badge>
                )}
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-3xl font-bold text-white">
                    {p.price === 0 ? 'Free' : '$' + p.price}
                  </span>
                  {p.price > 0 && <span className="text-zinc-500 text-sm mb-1">/month</span>}
                </div>
                <p className="text-xs text-zinc-500 mb-4">{p.credits} AI credits included</p>
                <ul className="space-y-2 mb-6">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs text-zinc-300">
                      <Check className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                {plan === p.id ? (
                  <div className="w-full py-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 text-center text-sm text-amber-400 font-medium">
                    Current Plan
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => handleUpgrade(p.id, p.price)}
                    loading={loading === p.id}
                    icon={<Zap className="w-4 h-4" />}
                  >
                    Upgrade to {p.name}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <Card>
            <CardHeader
              title="Buy Credits"
              description="Run out mid-month? Top up here. Credits never expire."
              icon={<Sparkles className="w-5 h-5 text-amber-500" />}
            />

            <div className="grid grid-cols-5 gap-2 mb-6">
              {CREDIT_PACKS.map(pack => (
                <button
                  key={pack.credits}
                  onClick={() => setCreditAmount(pack.credits)}
                  className={`p-3 rounded-xl border-2 text-center transition-all duration-150 hover:scale-105 active:scale-95 ${
                    creditAmount === pack.credits
                      ? 'border-amber-500 bg-amber-500/5 shadow-[0_0_20px_rgba(245,158,11,0.06)]'
                      : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]'
                  }`}
                >
                  <p className="text-sm font-bold text-white">{pack.credits}</p>
                  <p className="text-xs text-zinc-500">{pack.label}</p>
                  <p className="text-xs font-medium text-amber-500 mt-1">
                    ${(pack.credits * CREDIT_PRICE_USD).toFixed(2)}
                  </p>
                </button>
              ))}
            </div>

            <div className="mb-6">
              <p className="text-xs text-zinc-500 mb-3">Custom amount</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCreditAmount(Math.max(10, creditAmount - 10))}
                  className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors active:scale-95"
                >
                  <Minus className="w-4 h-4 text-zinc-400" />
                </button>
                <div className="flex-1 text-center">
                  <p className="text-2xl font-bold text-white">{creditAmount}</p>
                  <p className="text-xs text-zinc-500">credits</p>
                </div>
                <button
                  onClick={() => setCreditAmount(creditAmount + 10)}
                  className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors active:scale-95"
                >
                  <Plus className="w-4 h-4 text-zinc-400" />
                </button>
              </div>
              <input
                type="range"
                min={10}
                max={2000}
                step={10}
                value={creditAmount}
                onChange={e => setCreditAmount(Number(e.target.value))}
                className="w-full mt-3 accent-amber-500 h-1.5"
              />
              <div className="flex justify-between text-xs text-zinc-600 mt-1">
                <span>10</span>
                <span>2000</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{creditAmount} credits</p>
                  <p className="text-xs text-zinc-500">One time. Never expires.</p>
                </div>
                <p className="text-2xl font-bold text-white">${creditCostUSD}</p>
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full"
              onClick={handleBuyCredits}
              loading={loading === 'credits'}
              icon={<Zap className="w-4 h-4" />}
            >
              Buy {creditAmount} Credits for ${creditCostUSD}
            </Button>
            <p className="text-center text-xs text-zinc-600 mt-3">
              Payments through Paystack — you might see Naira at checkout. Your international card works fine.
            </p>
          </Card>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default function BillingPage() {
  return (
    <Suspense>
      <BillingContent />
    </Suspense>
  );
}
