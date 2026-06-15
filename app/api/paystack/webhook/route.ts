import { NextRequest, NextResponse } from 'next/server';
import { validateWebhookSignature } from '@/lib/paystack';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-paystack-signature');
    const body = await request.text();

    if (!signature) return NextResponse.json({ success: false, error: 'Missing signature' }, { status: 400 });
    if (!validateWebhookSignature(body, signature)) return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 401 });

    const event = JSON.parse(body);

    if (event.event === 'charge.success') {
      const { metadata, reference, amount } = event.data;
      const userId = metadata?.userId;
      const type = metadata?.type;

      if (!userId) {
        console.error('No userId in metadata');
        return NextResponse.json({ success: true }, { status: 200 });
      }

      if (type === 'credits') {
        // Add credits to subscription
        const credits = metadata?.credits || 0;
        await convex.mutation(api.subscriptions.addCredits, { userId, credits });
        console.log('Credits added:', credits, 'for user:', userId);
      } else if (type === 'subscription') {
        // Upgrade plan
        const plan = metadata?.plan || 'pro';
        const limits: Record<string, number> = { free: 50, pro: 500, starter: 500 };
        const sub = await convex.query(api.subscriptions.getSubscription, { userId });
        if (sub) {
          await convex.mutation(api.subscriptions.updateSubscription, {
            userId,
            plan,
            status: 'active',
          });
          // Set new message limit
          await convex.mutation(api.subscriptions.addCredits, {
            userId,
            credits: (limits[plan] || 500) - sub.messagesLimit,
          });
        }
        console.log('Plan upgraded to:', plan, 'for user:', userId);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}