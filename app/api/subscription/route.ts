import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

/**
 * GET /api/subscription
 * Get current user's subscription
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // TODO: Implement the following:
    // 1. Query Convex to get subscription by userId
    // 2. Return subscription data with message usage
    // 3. Calculate remaining messages

    return NextResponse.json(
      {
        success: true,
        data: {
          id: 'placeholder-id',
          userId,
          plan: 'free',
          status: 'active',
          messagesUsed: 0,
          messagesLimit: 30,
          messagesRemaining: 30,
          paymentReference: null,
          amount: null,
          currency: null,
          renewalDate: null,
          trialEndsAt: null,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/subscription:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/subscription/upgrade
 * Upgrade user's subscription plan
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { plan } = body;

    // Validate plan
    const validPlans = ['free', 'starter', 'pro', 'business', 'enterprise'];
    if (!plan || !validPlans.includes(plan)) {
      return NextResponse.json(
        { success: false, error: 'Invalid plan' },
        { status: 400 }
      );
    }

    // TODO: Implement the following:
    // 1. Get current subscription
    // 2. Validate plan upgrade (can't downgrade)
    // 3. If paid plan: Initialize payment with Paystack
    // 4. Return payment initialization response or update subscription

    return NextResponse.json(
      {
        success: true,
        data: {
          message: 'Upgrade initiated',
          plan,
          requiresPayment: plan !== 'free',
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in POST /api/subscription/upgrade:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
