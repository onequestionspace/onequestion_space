import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { initializePayment } from '@/lib/paystack';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const user = await currentUser();
    const email = user?.emailAddresses?.[0]?.emailAddress;
    if (!email) return NextResponse.json({ success: false, error: 'No email found' }, { status: 400 });

    const body = await request.json();
    const { amount, metadata } = body;

    if (!amount) return NextResponse.json({ success: false, error: 'Missing amount' }, { status: 400 });

    const result = await initializePayment(email, amount, { ...metadata, userId });

    return NextResponse.json({ success: true, data: result.data }, { status: 200 });
  } catch (error) {
    console.error('Error in /api/paystack/initialize:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}