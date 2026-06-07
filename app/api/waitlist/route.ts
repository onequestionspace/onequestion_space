import { NextRequest, NextResponse } from 'next/server';
import { validateEmail } from '@/lib/validations';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';

function getConvexClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) throw new Error('NEXT_PUBLIC_CONVEX_URL is not configured');
  return new ConvexHttpClient(url);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, role, name, username } = body;

    const emailError = validateEmail(email);
    if (emailError) {
      return NextResponse.json(
        { success: false, error: emailError.message },
        { status: 400 }
      );
    }

    const convex = getConvexClient();

    const result = await convex.mutation(api.waitlist.addToWaitlist, {
      email,
      role,
      name,
      username,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully added to waitlist',
        position: result.position,
        data: { email, role, name, username },
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
