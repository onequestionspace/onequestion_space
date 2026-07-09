import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const subscription = await convex.mutation(api.subscriptions.getOrCreateSubscription, { userId });

    return NextResponse.json({
      success: true,
      data: {
        id: subscription?._id ?? 'pending',
        userId,
        plan: subscription?.plan ?? 'free',
        status: subscription?.status ?? 'active',
        messagesUsed: subscription?.messagesUsed ?? 0,
        messagesLimit: subscription?.messagesLimit ?? 50,
        messagesRemaining: (subscription?.messagesLimit ?? 50) - (subscription?.messagesUsed ?? 0),
        renewalDate: subscription?.renewalDate ?? null,
        trialEndsAt: subscription?.trialEndsAt ?? null,
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/subscription:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { plan } = body;

    const validPlans = ['free', 'starter', 'pro', 'business', 'enterprise'];
    if (!plan || !validPlans.includes(plan)) {
      return NextResponse.json({ success: false, error: 'Invalid plan' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: { message: 'Upgrade initiated', plan, requiresPayment: plan !== 'free' },
    }, { status: 200 });
  } catch (error) {
    console.error('Error in POST /api/subscription/upgrade:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
