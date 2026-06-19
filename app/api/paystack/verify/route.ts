import { NextRequest, NextResponse } from 'next/server';
import { paymentProvider } from '@/lib/payments';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');
    if (!reference) return NextResponse.json({ success: false, error: 'Missing reference' }, { status: 400 });

    const result = await paymentProvider.verify(reference);

    if (result.success) {
      const { type, credits, plan } = result.metadata;
      if (type === 'credits' && credits) {
        await convex.mutation(api.subscriptions.addCredits, { userId, credits });
      } else if (type === 'subscription' && plan) {
        await convex.mutation(api.subscriptions.updateSubscription, { userId, plan: plan as 'free' | 'starter' | 'pro' | 'business' | 'enterprise', status: 'active' });
      }
    }

    return NextResponse.json({ success: result.success, data: result }, { status: 200 });
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}