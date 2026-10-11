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
    const body: unknown = await request.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
    }
    const role = 'role' in body && typeof body.role === 'string' ? body.role : undefined;
    const name = 'name' in body && typeof body.name === 'string' ? body.name : undefined;
    const username = 'username' in body && typeof body.username === 'string' ? body.username : undefined;
    const email = 'email' in body && typeof body.email === 'string'
      ? body.email.trim().toLowerCase()
      : '';

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
        message: result.alreadyJoined ? 'You are already on the waitlist' : 'Successfully added to waitlist',
        alreadyJoined: result.alreadyJoined,
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
