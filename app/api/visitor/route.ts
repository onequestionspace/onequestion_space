import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { enforceRateLimit } from '@/lib/server-rate-limit';

export async function POST(request: NextRequest) {
  const rate = await enforceRateLimit(request, 'public-visitor', 20, 60 * 60 * 1000);
  if ('unavailable' in rate) {
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, {
      status: 429,
      headers: { 'Retry-After': String(rate.retryAfterSeconds) },
    });
  }

  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== 'object' || !('profileId' in body)
      || typeof body.profileId !== 'string' || body.profileId.length > 64) {
      return NextResponse.json({ error: 'Invalid profile ID' }, { status: 400 });
    }
    const secret = process.env.ONEQUESTION_STREAM_SECRET;
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!secret || !url) return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });

    const convex = new ConvexHttpClient(url);
    await convex.mutation(api.analytics.recordPublicVisitor, {
      secret,
      profileId: body.profileId as Id<'profiles'>,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[visitor] Failed to record public visitor:', error);
    return NextResponse.json({ error: 'Could not record visitor' }, { status: 500 });
  }
}
