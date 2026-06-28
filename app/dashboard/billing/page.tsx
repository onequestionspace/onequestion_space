'use client';
import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Check, Zap, Loader2, Sparkles, Plus, Minus } from 'lucide-react';

const CREDIT_PRICE_USD = 0.018;

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    credits: 50,
    color: '#71717a',
    features: ['50 AI answers/month', 'Basic analytics', 'Space customization', 'Knowledge base'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9,
    credits: 500,
    color: '#f59e0b',
    features: ['500 AI answers/month', 'Advanced analytics', 'Priority AI processing', 'Remove One Question branding', 'Custom welcome message'],
    recommended: true,
  },
];

const CREDIT_PACKS = [
  { credits: 50, label: 'Starter Pack' },
  { credits: 100, label: 'Basic Pack' },
  { credits: 250, label: 'Growth Pack' },
  { credits: 500, label: 'Pro Pack' },
  { credits: 1000, label: 'Power Pack' },
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
    setTimeout(() => setVerifyStatus('verifying'), 0);
    fetch('/api/paystack/verify?reference=' + reference)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data?.status === 'success') setVerifyStatus('success');
        else setVerifyStatus('failed');
      })
      .catch(() => setVerifyStatus('failed'));
  }, [searchParams]);

  const subscription = useQuery(api.subscriptions.getSubscription, userId ? { userId } : 'skip');

  if (!isLoaded) return <div className='min-h-screen flex items-center justify-center text-muted-foreground'>Loading...</div>;
  if (!isSignedIn) { redirect('/'); }

  const ADMIN_IDS = ['user_3EhKmuVyC1AhoBDlL7QNssllwgu'];
  const isAdmin = userId ? ADMIN_IDS.includes(userId) : false;
  const used = subscription?.messagesUsed ?? 0;
  const limit = subscription?.messagesLimit ?? 50;
  const plan = subscription?.plan ?? 'free';
  const usagePercent = isAdmin ? 0 : Math.min(Math.round((used / limit) * 100), 100);
  const creditCostUSD = (creditAmount * CREDIT_PRICE_USD).toFixed(2);

  const handleUpgrade = async (planId: string, priceUSD: number) => {
    if (!userId || priceUSD === 0) return;
    setLoading(planId);
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
    } catch (e) { console.error(e); }
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
        setError(data.error || 'Failed to start checkout. Please try again.');
        setLoading('');
        return;
      }
      if (data.data?.authorization_url) {
        window.location.href = data.data.authorization_url;
      } else {
        setError('No checkout URL returned. Please try again.');
        setLoading('');
      }
    } catch (e) {
      console.error(e);
      setError('Something went wrong. Please check your connection and try again.');
      setLoading('');
    }
  };

  return (
    <DashboardLayout title='Billing' description='Honest pricing. No surprises. You only pay when it is worth it.'>
      <div className="max-w-3xl mx-auto space-y-8"><div className="p-4 rounded-xl bg-amber-500/8 border border-amber-500/20 flex items-start gap-3"><span className="text-lg shrink-0">🇳🇬</span><div><p className="text-amber-400 text-xs font-semibold">You will see prices in Nigerian Naira at checkout</p><p className="text-zinc-500 text-xs mt-0.5">I am based in Nigeria and use Paystack. Your Visa or Mastercard works perfectly — it converts automatically at your bank rate. No hidden fees.</p></div></div>

        {error && (
          <div className='p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm'>{error}</div>
        )}
        {verifyStatus === 'verifying' && (
          <div className='p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-500 flex items-center gap-2'>
            <Loader2 className='w-4 h-4 animate-spin' /> Checking your payment — give me a second...
          </div>
        )}
        {verifyStatus === 'success' && (
          <div className='p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-sm text-green-400 flex items-center gap-2'>
            <Check className='w-4 h-4' /> Payment confirmed. Your AI just got more runway. Go use it.
          </div>
        )}
        {verifyStatus === 'failed' && (
          <div className='p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400'>
            Something went wrong verifying your payment. If you were charged, message me directly and I will sort it out — asym@onequestion.space
          </div>
        )}

        {/* Usage */}
        <div className='glass-card rounded-2xl p-6 border border-border'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h3 className='font-semibold text-foreground'>Usage</h3>
              <p className='text-xs text-muted-foreground mt-0.5'>What you have used this month</p>
            </div>
            <span className='text-xs px-2.5 py-1 rounded-full font-medium capitalize' style={{ backgroundColor: '#f59e0b20', color: '#f59e0b' }}>{plan}</span>
          </div>
          <div className='flex items-end gap-2 mb-3'>
            <span className='text-4xl font-bold text-foreground'>{used}</span>
            <span className='text-lg text-muted-foreground mb-1'>/ {limit} credits</span>
          </div>
          <div className='w-full h-3 bg-card rounded-full overflow-hidden mb-2'>
            <div className='h-full rounded-full transition-all' style={{ width: usagePercent + '%', backgroundColor: usagePercent > 80 ? '#ef4444' : usagePercent > 50 ? '#f97316' : '#f59e0b' }} />
          </div>
          <p className='text-xs text-muted-foreground'>{limit - used} credits left this month · every question your AI answers uses one</p>
        </div>

        {/* Plans */}
        <div>
          <h3 className='font-semibold text-foreground mb-4'>Plans</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {PLANS.map(p => (
              <div key={p.id} className={'glass-card rounded-2xl p-6 border-2 transition-all ' + (plan === p.id ? 'border-amber-500' : 'border-border')}>
                {p.recommended && (
                  <div className='text-xs font-bold px-2 py-0.5 rounded-full mb-3 inline-block' style={{ backgroundColor: '#f59e0b20', color: '#f59e0b' }}>Recommended</div>
                )}
                <div className='flex items-end gap-1 mb-1'>
                  <span className='text-3xl font-black text-foreground'>{p.price === 0 ? 'Free' : '$' + p.price}</span>
                  {p.price > 0 && <span className='text-muted-foreground text-sm mb-1'>/month</span>}
                </div>
                <p className='text-xs text-muted-foreground mb-4'>{p.credits} AI credits included</p>
                <ul className='space-y-2 mb-6'>
                  {p.features.map(f => (
                    <li key={f} className='flex items-center gap-2 text-xs text-foreground'>
                      <Check className='w-3.5 h-3.5 shrink-0' style={{ color: p.color }} />
                      {f}
                    </li>
                  ))}
                </ul>
                {plan === p.id ? (
                  <div className='w-full py-2.5 rounded-xl border border-border text-center text-sm text-muted-foreground'>Current Plan</div>
                ) : (
                  <button
                    onClick={() => handleUpgrade(p.id, p.price)}
                    disabled={loading === p.id || p.price === 0}
                    className='w-full py-2.5 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50'
                    style={{ backgroundColor: p.color }}
                  >
                    {loading === p.id ? <Loader2 className='w-4 h-4 animate-spin' /> : <Zap className='w-4 h-4' />}
                    {p.price === 0 ? 'Current Plan' : 'Upgrade to ' + p.name}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Buy Credits */}
        <div className='glass-card rounded-2xl p-6 border border-border'>
          <div className='flex items-center gap-2 mb-1'>
            <Sparkles className='w-4 h-4 text-amber-500' />
            <h3 className='font-semibold text-foreground'>Buy One Question Credits</h3>
          </div>
          <p className='text-xs text-muted-foreground mb-6'>Run out mid-month? Top up here. Credits never expire — they roll over forever. I priced these at cost.</p>

          <div className='grid grid-cols-3 gap-2 mb-6'>
            {CREDIT_PACKS.map(pack => (
              <button
                key={pack.credits}
                onClick={() => setCreditAmount(pack.credits)}
                className={'p-3 rounded-xl border-2 text-center transition-all hover:scale-105 ' + (creditAmount === pack.credits ? 'border-amber-500 bg-amber-500/5' : 'border-border')}
              >
                <p className='text-sm font-bold text-foreground'>{pack.credits}</p>
                <p className='text-xs text-muted-foreground'>{pack.label}</p>
                <p className='text-xs font-medium mt-1' style={{ color: '#f59e0b' }}>{'$' + (pack.credits * CREDIT_PRICE_USD).toFixed(2)}</p>
              </button>
            ))}
          </div>

          <div className='mb-6'>
            <p className='text-xs text-muted-foreground mb-3'>Need a different number? Set it here.</p>
            <div className='flex items-center gap-3'>
              <button onClick={() => setCreditAmount(Math.max(10, creditAmount - 10))} className='w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-card transition-colors'>
                <Minus className='w-4 h-4 text-muted-foreground' />
              </button>
              <div className='flex-1 text-center'>
                <p className='text-2xl font-bold text-foreground'>{creditAmount}</p>
                <p className='text-xs text-muted-foreground'>credits</p>
              </div>
              <button onClick={() => setCreditAmount(creditAmount + 10)} className='w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-card transition-colors'>
                <Plus className='w-4 h-4 text-muted-foreground' />
              </button>
            </div>
            <input type='range' min={10} max={2000} step={10} value={creditAmount} onChange={e => setCreditAmount(Number(e.target.value))} className='w-full mt-3 accent-amber-500' />
            <div className='flex justify-between text-xs text-muted-foreground mt-1'><span>10</span><span>2000</span></div>
          </div>

          <div className='p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 mb-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-bold text-foreground'>{creditAmount} credits</p>
                <p className='text-xs text-muted-foreground'>One time. No subscription. Never expires.</p>
              </div>
              <p className='text-2xl font-bold text-foreground'>{'$' + creditCostUSD}</p>
            </div>
          </div>

          <button
            onClick={handleBuyCredits}
            disabled={loading === 'credits'}
            className='w-full py-3 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50'
            style={{ backgroundColor: '#f59e0b' }}
          >
            {loading === 'credits' ? <Loader2 className='w-4 h-4 animate-spin' /> : <Zap className='w-4 h-4' />}
            Buy {creditAmount} Credits for {'$' + creditCostUSD}
          </button>
          <p className='text-center text-xs text-muted-foreground mt-3'>Payments go through Paystack — you might see Naira at checkout. Your international card works fine.</p>
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
