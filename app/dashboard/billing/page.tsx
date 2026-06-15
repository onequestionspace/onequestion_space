'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Check, Zap, Loader2, Sparkles, Plus, Minus } from 'lucide-react';

const CREDIT_PRICE = 0.018; // $0.018 per credit — so 500 = $9

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
    color: '#a855f7',
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

export default function BillingPage() {
  const { isSignedIn, isLoaded, userId } = useAuth();
  const [creditAmount, setCreditAmount] = useState(100);
  const [loading, setLoading] = useState('');

  const subscription = useQuery(api.subscriptions.getSubscription, userId ? { userId } : 'skip');

  if (!isLoaded) return <div className='min-h-screen flex items-center justify-center text-muted-foreground'>Loading...</div>;
  if (!isSignedIn) { redirect('/'); }

  const used = subscription?.messagesUsed ?? 0;
  const limit = subscription?.messagesLimit ?? 50;
  const plan = subscription?.plan ?? 'free';
  const usagePercent = Math.min(Math.round((used / limit) * 100), 100);
  const creditCost = Math.round(creditAmount * CREDIT_PRICE * 100) / 100;

  const handleUpgrade = async (planId: string, price: number) => {
    if (!userId) return;
    setLoading(planId);
    try {
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: price * 100,
          email: '',
          metadata: { userId, plan: planId, type: 'subscription' },
        }),
      });
      const data = await res.json();
      if (data.data?.authorization_url) {
        const url = data.data.authorization_url; setTimeout(() => { window.location.assign(url); }, 0);
      }
    } catch (e) { console.error(e); }
    setLoading('');
  };

  const handleBuyCredits = async () => {
    if (!userId) return;
    setLoading('credits');
    try {
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(creditCost * 100),
          email: '',
          metadata: { userId, credits: creditAmount, type: 'credits' },
        }),
      });
      const data = await res.json();
      if (data.data?.authorization_url) {
        window.location.href = data.data.authorization_url;
      }
    } catch (e) { console.error(e); }
    setLoading('');
  };

  return (
    <DashboardLayout title='Billing' description='Manage your plan and credits.'>
      <div className='max-w-3xl mx-auto space-y-8'>

        {/* Current usage */}
        <div className='glass-card rounded-2xl p-6 border border-border'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='font-semibold text-foreground'>Current Usage</h3>
            <span className='text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium capitalize'>{plan} plan</span>
          </div>
          <div className='flex items-end gap-2 mb-3'>
            <span className='text-4xl font-bold text-foreground'>{used}</span>
            <span className='text-lg text-muted-foreground mb-1'>/ {limit} credits</span>
          </div>
          <div className='w-full h-3 bg-card rounded-full overflow-hidden mb-2'>
            <div
              className='h-full rounded-full transition-all'
              style={{ width: usagePercent + '%', backgroundColor: usagePercent > 80 ? '#ef4444' : usagePercent > 50 ? '#f97316' : '#a855f7' }}
            />
          </div>
          <p className='text-xs text-muted-foreground'>{limit - used} credits remaining · Each AI answer uses 1 credit</p>
        </div>

        {/* Plans */}
        <div>
          <h3 className='font-semibold text-foreground mb-4'>Plans</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {PLANS.map(p => (
              <div
                key={p.id}
                className={'glass-card rounded-2xl p-6 border-2 transition-all ' + (plan === p.id ? 'border-primary' : 'border-border')}
              >
                {p.recommended && (
                  <div className='text-xs font-bold px-2 py-0.5 rounded-full mb-3 inline-block' style={{ backgroundColor: '#a855f720', color: '#a855f7' }}>Recommended</div>
                )}
                <div className='flex items-end gap-1 mb-1'>
                  <span className='text-2xl font-bold text-foreground'>{p.price === 0 ? 'Free' : '$' + p.price}</span>
                  {p.price > 0 && <span className='text-muted-foreground text-sm mb-0.5'>/month</span>}
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
                    disabled={loading === p.id}
                    className='w-full py-2.5 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50'
                    style={{ backgroundColor: p.color }}
                  >
                    {loading === p.id ? <Loader2 className='w-4 h-4 animate-spin' /> : <Zap className='w-4 h-4' />}
                    Upgrade to {p.name}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Buy Credits */}
        <div className='glass-card rounded-2xl p-6 border border-border'>
          <div className='flex items-center gap-2 mb-1'>
            <Sparkles className='w-4 h-4 text-primary' />
            <h3 className='font-semibold text-foreground'>Buy One Question Credits</h3>
          </div>
          <p className='text-xs text-muted-foreground mb-6'>Top up anytime. Credits never expire. $0.018 per credit.</p>

          {/* Quick packs */}
          <div className='grid grid-cols-3 gap-2 mb-6'>
            {CREDIT_PACKS.map(pack => (
              <button
                key={pack.credits}
                onClick={() => setCreditAmount(pack.credits)}
                className={'p-3 rounded-xl border-2 text-center transition-all hover:scale-105 ' + (creditAmount === pack.credits ? 'border-primary bg-primary/5' : 'border-border')}
              >
                <p className='text-sm font-bold text-foreground'>{pack.credits}</p>
                <p className='text-xs text-muted-foreground'>{pack.label}</p>
                <p className='text-xs font-medium mt-1' style={{ color: '#a855f7' }}>${Math.round(pack.credits * CREDIT_PRICE * 100) / 100}</p>
              </button>
            ))}
          </div>

          {/* Custom amount */}
          <div className='mb-6'>
            <p className='text-xs text-muted-foreground mb-3'>Or choose a custom amount</p>
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
            <input
              type='range'
              min={10}
              max={2000}
              step={10}
              value={creditAmount}
              onChange={e => setCreditAmount(Number(e.target.value))}
              className='w-full mt-3 accent-purple-500'
            />
            <div className='flex justify-between text-xs text-muted-foreground mt-1'>
              <span>10</span><span>2000</span>
            </div>
          </div>

          {/* Summary + pay */}
          <div className='p-4 rounded-xl bg-primary/5 border border-primary/20 mb-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-bold text-foreground'>{creditAmount} credits</p>
                <p className='text-xs text-muted-foreground'>One-time purchase · Never expires</p>
              </div>
              <p className='text-2xl font-bold text-foreground'>${creditCost}</p>
            </div>
          </div>

          <button
            onClick={handleBuyCredits}
            disabled={loading === 'credits'}
            className='w-full py-3 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 bg-gradient-to-r from-primary to-pink'
          >
            {loading === 'credits' ? <Loader2 className='w-4 h-4 animate-spin' /> : <Zap className='w-4 h-4' />}
            Buy {creditAmount} Credits for ${creditCost}
          </button>
          <p className='text-center text-xs text-muted-foreground mt-3'>Powered by Paystack · Secure payment</p>
        </div>
      </div>
    </DashboardLayout>
  );
}