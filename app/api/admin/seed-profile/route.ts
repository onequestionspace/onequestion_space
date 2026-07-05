import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret');
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { username, displayName, bio, welcomeMessage } = await req.json();
  if (!username || !displayName) {
    return NextResponse.json({ error: 'username and displayName required' }, { status: 400 });
  }

  try {
    const result = await convex.mutation(api.profiles.seedProfile, {
      username, displayName, bio, welcomeMessage,
    });
    const claimUrl = `https://onequestion.space${result.claimUrl}`;
    return NextResponse.json({ success: true, claimUrl });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
