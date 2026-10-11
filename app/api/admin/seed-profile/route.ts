import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { isAdminUser } from '@/convex/userIds';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  const { userId, getToken } = await auth();
  if (!userId || !isAdminUser(userId)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { username, displayName, bio, welcomeMessage } = await req.json();
    if (!username || !displayName) {
      return NextResponse.json({ error: 'username and displayName required' }, { status: 400 });
    }
    const token = await getToken({ template: 'convex' });
    if (!token) {
      return NextResponse.json({ error: 'Could not authenticate with the database' }, { status: 503 });
    }
    convex.setAuth(token);
    const result = await convex.mutation(api.profiles.seedProfile, {
      username, displayName, bio, welcomeMessage,
    });
    const claimUrl = `https://onequestion.space${result.claimUrl}`;
    return NextResponse.json({ success: true, claimUrl });
  } catch (error) {
    console.error('Admin seed profile failed:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Could not create the page' }, { status: 400 });
  }
}
