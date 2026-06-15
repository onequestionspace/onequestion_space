import { NextRequest, NextResponse } from 'next/server';
import { verifyPayment } from '@/lib/paystack';
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

    const result = await verifyPayment(reference);

    if (result.data?.status === 'success') {
      const metadata = result.data.metadata;
      const type = metadata?.type;

      if (type === 'credits') {
        const credits = metadata?.credits || 0;
        await convex.mutation(api.subscriptions.addCredits, { userId, credits });
      } else if (type === 'subscription') {
        const plan = metadata?.plan || 'pro';
        await convex.mutation(api.subscriptions.updateSubscription, { userId, plan, status: 'active' });
      }
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 200 });
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}