import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/check-username
 * Check if a username is available
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username } = body;

    // Validate username format
    if (!username || typeof username !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Username is required' },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { success: false, error: 'Username must be at least 3 characters' },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Username can only contain letters, numbers, hyphens, and underscores',
        },
        { status: 400 }
      );
    }

    // TODO: Implement the following:
    // 1. Query Convex database to check if username exists
    // 2. Check reserved usernames list
    // 3. Return availability status

    // Placeholder: Mock response
    const isAvailable = Math.random() > 0.2; // 80% chance available

    return NextResponse.json(
      {
        success: true,
        data: {
          username,
          available: isAvailable,
          url: isAvailable ? `https://onequestion.space/${username}` : null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in /api/check-username:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
