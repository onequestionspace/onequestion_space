import { NextRequest, NextResponse } from 'next/server';
import { validateEmail } from '@/lib/validations';

import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';

function getConvexClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;

  if (!url) {
    throw new Error('NEXT_PUBLIC_CONVEX_URL is not configured');
  }

  return new ConvexHttpClient(url);
}

/**
 * POST /api/waitlist
 * Handle waitlist signups
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, role } = body;

    const emailError = validateEmail(email);

    if (emailError) {
      return NextResponse.json(
        { success: false, error: emailError.message },
        { status: 400 }
      );
    }

const convex = getConvexClient();

await convex.mutation(api.waitlist.addToWaitlist, {

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully added to waitlist',
        data: {
          email,
          role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in /api/waitlist:', error);

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
