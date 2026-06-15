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
      const userId = data?.metadata?.userId;
      const type = data?.metadata?.type;
      if (!userId) return NextResponse.json({ success: true }, { status: 200 });

      if (type === 'credits') {
        const credits = data?.metadata?.credits || 0;
        await convex.mutation(api.subscriptions.addCredits, { userId, credits });
        console.log('Credits added:', credits, 'userId:', userId);
      } else if (type === 'subscription') {
        const plan = data?.metadata?.plan || 'pro';
        await convex.mutation(api.subscriptions.updateSubscription, { userId, plan, status: 'active' });
        const limits: Record<string, number> = { pro: 500, starter: 500 };
        await convex.mutation(api.subscriptions.addCredits, { userId, credits: limits[plan] || 500 });
        console.log('Plan upgraded:', plan, 'userId:', userId);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}