import { NextRequest, NextResponse } from 'next/server';
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
