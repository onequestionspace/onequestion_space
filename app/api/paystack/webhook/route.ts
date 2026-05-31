import { NextRequest, NextResponse } from 'next/server';
import { validateWebhookSignature } from '@/lib/paystack';

/**
 * POST /api/paystack/webhook
 * Handle Paystack webhook events
 */
export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-paystack-signature');
    const body = await request.text();

    if (!signature) {
      return NextResponse.json(
        { success: false, error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Validate webhook signature
    if (!validateWebhookSignature(body, signature)) {
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);

    // TODO: Implement the following:
    // 1. Handle different event types (charge.success, charge.failed, etc.)
    // 2. Update subscription status based on event
    // 3. Send confirmation emails
    // 4. Log webhook events

    switch (event.event) {
      case 'charge.success':
        // Handle successful payment
        console.log('Payment successful:', event.data);
        break;
      case 'charge.failed':
        // Handle failed payment
        console.log('Payment failed:', event.data);
        break;
      default:
        console.log('Unhandled event:', event.event);
    }

    return NextResponse.json(
      { success: true, message: 'Webhook processed' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in /api/paystack/webhook:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
