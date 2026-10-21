import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { enforceRateLimit } from '@/lib/server-rate-limit';

const ALLOWED_EMOJIS = new Set(['fire', 'love', 'brain', 'clap', 'wow']);

export async function POST(request: NextRequest) {
  const rate = await enforceRateLimit(request, 'public-reaction', 10, 60 * 1000);
  if ('unavailable' in rate) return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, {
      status: 429,
      headers: { 'Retry-After': String(rate.retryAfterSeconds) },
    });
  }

  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    const input = body as Record<string, unknown>;
    if (typeof input.profileId !== 'string' || input.profileId.length > 64
      || typeof input.emoji !== 'string' || !ALLOWED_EMOJIS.has(input.emoji)
      || typeof input.visitorId !== 'string' || !input.visitorId.trim() || input.visitorId.length > 120) {
      return NextResponse.json({ error: 'Invalid reaction data' }, { status: 400 });
    }

    const secret = process.env.ONEQUESTION_STREAM_SECRET;
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!secret || !url) return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });

    const convex = new ConvexHttpClient(url);
    const result = await convex.mutation(api.reactions.addReaction, {
      secret,
      profileId: input.profileId as Id<'profiles'>,
      emoji: input.emoji,
      visitorId: input.visitorId.trim(),
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error('[reactions] Failed to record reaction:', error);
    return NextResponse.json({ error: 'Could not record reaction' }, { status: 500 });
  }
}
