import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';

function getConvexClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;

  if (!url) {
    throw new Error('NEXT_PUBLIC_CONVEX_URL is not configured');
  }

  return new ConvexHttpClient(url);
}

const RESERVED_USERNAMES = [
  'admin',
  'api',
  'dashboard',
  'settings',
  'login',
  'signup',
  'register',
  'about',
  'contact',
  'pricing',
  'billing',
  'support',
  'help',
  'privacy',
  'terms',
  'www',
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username } = body;

    if (!username || typeof username !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Username is required' },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        {
          success: false,
          error: 'Username must be at least 3 characters',
        },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Username can only contain letters, numbers, hyphens, and underscores',
        },
        { status: 400 }
      );
    }

    const normalized = username.toLowerCase();

    if (RESERVED_USERNAMES.includes(normalized)) {
      return NextResponse.json(
        {
          success: true,
          data: {
            username,
            available: false,
            url: null,
          },
        },
        { status: 200 }
      );
    }

    const convex = getConvexClient();

    const available = await convex.query(
      api.profiles.checkUsernameAvailable,
      {
        username: normalized,
      }
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          username: normalized,
          available,
          url: available
            ? `https://onequestion.space/${normalized}`
            : null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in /api/check-username:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
