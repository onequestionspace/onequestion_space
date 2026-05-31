import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { initializePayment } from '@/lib/paystack';

/**
 * POST /api/paystack/initialize
 * Initialize payment transaction
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
    const { email, amount, plan } = body;

    if (!email || !amount || !plan) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: Implement the following:
    // 1. Validate plan and amount
    // 2. Call Paystack API to initialize payment
    // 3. Save payment reference to database
    // 4. Return authorization URL

    const result = await initializePayment(email, amount * 100, {
      userId,
      plan,
    });

    return NextResponse.json(
      { success: true, data: result },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in /api/paystack/initialize:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
