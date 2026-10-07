import { NextRequest, NextResponse } from 'next/server';
import { paymentProvider } from '@/lib/payments';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-paystack-signature') || request.headers.get('stripe-signature') || '';
    const body = await request.text();

    const { valid, event, data } = paymentProvider.validateWebhook(body, signature);
    if (!valid) return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 401 });

    if (event === 'charge.success' || event === 'payment_intent.succeeded') {
      const reference = data?.reference;
      if (typeof reference !== 'string' || !reference) {
        return NextResponse.json({ success: false, error: 'Missing payment reference' }, { status: 400 });
      }
      await convex.action(api.subscriptions.verifyAndApplyPayment, { reference });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}