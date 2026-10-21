import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) return NextResponse.json({ success: false, error: 'Database connection is not configured' }, { status: 503 });
    const convex = new ConvexHttpClient(convexUrl);
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');
    if (!reference) return NextResponse.json({ success: false, error: 'Missing reference' }, { status: 400 });

    const result = await convex.action(api.subscriptions.verifyAndApplyPayment, {
      reference,
      expectedUserId: userId,
    });
    if (!result.success && result.reason === 'account_mismatch') {
      return NextResponse.json({ success: false, error: 'This payment belongs to another account.' }, { status: 403 });
    }

    return NextResponse.json({ success: result.success, data: result }, { status: 200 });
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
