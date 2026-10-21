import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { enforceRateLimit } from '@/lib/server-rate-limit';

export async function POST(request: NextRequest) {
  const rate = await enforceRateLimit(request, 'pageview', 60, 60 * 1000);
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
    const page = typeof input.page === 'string' ? input.page.trim() : '';
    if (!page.startsWith('/') || page.length > 200) return NextResponse.json({ error: 'Invalid page' }, { status: 400 });

    const secret = process.env.ONEQUESTION_STREAM_SECRET;
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!secret || !url) return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });

    const convex = new ConvexHttpClient(url);
    await convex.mutation(api.siteAnalytics.trackPageview, {
      secret,
      page,
      visitorId: typeof input.visitorId === 'string' ? input.visitorId.slice(0, 120) : undefined,
      referrer: typeof input.referrer === 'string' ? input.referrer.slice(0, 500) : undefined,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[pageview] Failed to record pageview:', error);
    return NextResponse.json({ error: 'Could not record pageview' }, { status: 500 });
  }
}
