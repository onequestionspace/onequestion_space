const fs = require('fs');

fs.writeFileSync('app/api/paystack/subscribe/route.ts', `import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;
const BASE = 'https://api.paystack.co';
const PRO_PLAN_CODE = 'PLN_pbcztd7o78o66lz';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { email } = await request.json();
    if (!email) return NextResponse.json({ success: false, error: 'Email required' }, { status: 400 });

    const res = await fetch(BASE + '/transaction/initialize', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + PAYSTACK_SECRET, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        amount: 1350000,
        currency: 'NGN',
        plan: PRO_PLAN_CODE,
        channels: ['card', 'apple_pay'],
        metadata: { userId, plan: 'pro', type: 'subscription' },
      }),
    });

    const data = await res.json();
    if (!data.status) return NextResponse.json({ success: false, error: data.message || 'Failed to initialize' }, { status: 400 });

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
console.log('✓ Subscribe route updated with hardcoded plan code');

// Update billing page to pass email to subscribe endpoint
let billing = fs.readFileSync('app/dashboard/billing/page.tsx', 'utf8');

// Add useUser import
if (!billing.includes('useUser')) {
  billing = billing.replace(
    `import { useAuth } from '@/hooks/useAuth';`,
    `import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@clerk/nextjs';`
  );
}

// Add useUser hook
billing = billing.replace(
  `  const { isSignedIn, isLoaded, userId } = useAuth();`,
  `  const { isSignedIn, isLoaded, userId } = useAuth();
  const { user } = useUser();`
);

// Fix handleUpgrade to pass email
billing = billing.replace(
  `      const res = await fetch('/api/paystack/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });`,
  `      const res = await fetch('/api/paystack/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.emailAddresses?.[0]?.emailAddress }),
      });`
);

fs.writeFileSync('app/dashboard/billing/page.tsx', billing);
console.log('✓ Billing page updated to pass email');
