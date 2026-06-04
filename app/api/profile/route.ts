import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { validateUsername } from '@/lib/validations';

/**
 * GET /api/profile
 * Get current user's profile
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // TODO: Implement the following:
    // 1. Query Convex to get profile by userId
    // 2. Return profile data
    // 3. Handle profile not found

    return NextResponse.json(
      {
        success: true,
        data: {
          id: 'placeholder-id',
          userId,
          username: 'placeholder-username',
          displayName: 'Placeholder User',
          bio: 'This is a placeholder profile',
          avatar: null,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/profile:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/profile
 * Create a new user profile
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
    const { username, displayName, bio, avatar } = body;

    // Validate username
    const usernameError = validateUsername(username);
    if (usernameError) {
      return NextResponse.json(
        { success: false, error: usernameError.message },
        { status: 400 }
      );
    }

    if (!displayName || typeof displayName !== 'string' || displayName.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Display name is required' },
        { status: 400 }
      );
    }

    // TODO: Implement the following:
    // 1. Check if username is already taken
    // 2. Check if user already has a profile
    // 3. Create profile in Convex
    // 4. Initialize subscription (Free tier)
    // 5. Initialize analytics
    // 6. Return created profile

    return NextResponse.json(
      {
        success: true,
        data: {
          id: 'placeholder-id',
          userId,
          username,
          displayName,
          bio: bio || null,
          avatar: avatar || null,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/profile:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/profile
 * Update current user's profile
 */
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { displayName, bio, avatar } = body;

    // Validate inputs
    if (displayName && (typeof displayName !== 'string' || displayName.trim().length === 0)) {
      return NextResponse.json(
        { success: false, error: 'Invalid display name' },
        { status: 400 }
      );
    }

    if (bio && typeof bio !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid bio' },
        { status: 400 }
      );
    }

    // TODO: Implement the following:
    // 1. Get current profile from Convex
    // 2. Update profile fields
    // 3. Save to Convex
    // 4. Return updated profile

    return NextResponse.json(
      {
        success: true,
        data: {
          id: 'placeholder-id',
          userId,
          username: 'placeholder-username',
          displayName: displayName || 'Placeholder User',
          bio: bio || null,
          avatar: avatar || null,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in PUT /api/profile:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/profile
 * Delete current user's profile
 */
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // TODO: Implement the following:
    // 1. Get profile from Convex
    // 2. Delete all associated data (knowledge, questions, analytics, subscription)
    // 3. Delete profile
    // 4. Return success

    return NextResponse.json(
      {
        success: true,
        message: 'Profile deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE /api/profile:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
