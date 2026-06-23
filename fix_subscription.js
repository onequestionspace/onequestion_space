const fs = require('fs');

// ── 1. Create Paystack plan API route ────────────────────────────────────────
fs.mkdirSync('app/api/paystack/subscribe', { recursive: true });
fs.writeFileSync('app/api/paystack/subscribe/route.ts', `import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;
const BASE = 'https://api.paystack.co';

// Paystack Plan code for $9/month — create this in Paystack dashboard first
// Or we create it via API on first call
async function getOrCreatePlan() {
  // Check if plan exists
  const res = await fetch(BASE + '/plan', {
    headers: { Authorization: 'Bearer ' + PAYSTACK_SECRET },
  });
  const data = await res.json();
  const existing = data.data?.find((p: any) => p.name === 'One Question Pro');
  if (existing) return existing.plan_code;

  // Create plan
  const create = await fetch(BASE + '/plan', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + PAYSTACK_SECRET, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'One Question Pro',
      interval: 'monthly',
      amount: 900, // $9.00 in cents
      currency: 'USD',
      description: '500 AI answers/month, advanced analytics, priority AI',
    }),
  });
  const created = await create.json();
  return created.data?.plan_code;
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const user = await currentUser();
    const email = user?.emailAddresses?.[0]?.emailAddress;
    if (!email) return NextResponse.json({ success: false, error: 'No email found' }, { status: 400 });

    const planCode = await getOrCreatePlan();
    if (!planCode) return NextResponse.json({ success: false, error: 'Failed to get plan' }, { status: 500 });

    // Initialize subscription transaction
    const res = await fetch(BASE + '/transaction/initialize', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + PAYSTACK_SECRET, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        amount: 900,
        currency: 'USD',
        plan: planCode,
        channels: ['card', 'apple_pay'],
        metadata: { userId, plan: 'pro', type: 'subscription' },
        callback_url: process.env.NEXT_PUBLIC_APP_URL + '/dashboard/billing?reference={reference}',
      }),
    });

    const data = await res.json();
    if (!data.status) return NextResponse.json({ success: false, error: data.message }, { status: 400 });

    return NextResponse.json({
      success: true,
      data: { authorization_url: data.data.authorization_url, reference: data.data.reference }
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
`);
console.log('✓ app/api/paystack/subscribe/route.ts created');

// ── 2. Update billing page to use subscribe endpoint for Pro ─────────────────
let billing = fs.readFileSync('app/dashboard/billing/page.tsx', 'utf8');

billing = billing.replace(
  `  const handleUpgrade = async (planId: string, priceUSD: number) => {
    if (!userId || priceUSD === 0) return;
    setLoading(planId);
    try {
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: priceUSD * 100,
          metadata: { userId, plan: planId, type: 'subscription' },
        }),
      });
      const data = await res.json();
      if (data.data?.authorization_url) {
        window.location.assign(data.data.authorization_url);
      }
    } catch (e) { console.error(e); }
    setLoading('');
  };`,
  `  const handleUpgrade = async (planId: string, priceUSD: number) => {
    if (!userId || priceUSD === 0) return;
    setLoading(planId);
    try {
      const res = await fetch('/api/paystack/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.data?.authorization_url) {
        window.location.assign(data.data.authorization_url);
      } else {
        setError(data.error || 'Failed to start checkout.');
      }
    } catch (e) { console.error(e); }
    setLoading('');
  };`
);

fs.writeFileSync('app/dashboard/billing/page.tsx', billing);
console.log('✓ Billing page updated to use subscribe endpoint');
