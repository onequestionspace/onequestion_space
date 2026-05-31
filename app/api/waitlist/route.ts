import { NextRequest, NextResponse } from 'next/server';
import { validateEmail } from '@/lib/validations';

/**
 * POST /api/waitlist
 * Handle waitlist signups
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    // Validate email
    const emailError = validateEmail(email);
    if (emailError) {
      return NextResponse.json(
        { success: false, error: emailError.message },
        { status: 400 }
      );
    }

    // TODO: Implement the following:
    // 1. Check if email already exists in waitlist
    // 2. Save to Convex database
    // 3. Send confirmation email
    // 4. Return success response

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully added to waitlist',
        data: {
          email,
          name,
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
