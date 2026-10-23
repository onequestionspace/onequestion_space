import { createHash } from 'node:crypto';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

export type RateLimitResult =
  | { allowed: true; remaining: number }
  | { allowed: false; retryAfterSeconds: number }
  | { allowed: false; unavailable: true };

export async function enforceRateLimit(
  request: Request,
  route: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const secret = process.env.ONEQUESTION_STREAM_SECRET;
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!secret || !convexUrl) return { allowed: false, unavailable: true };

  // Prefer Vercel's platform-provided client IP. Fall back to the final
  // forwarded address rather than the first, which is commonly user-supplied.
  const ip = request.headers.get('x-real-ip')
    || request.headers.get('x-forwarded-for')?.split(',').map((v) => v.trim()).filter(Boolean).at(-1)
    || 'unknown';
  const key = createHash('sha256')
    .update(secret)
    .update(':')
    .update(route)
    .update(':')
    .update(ip)
    .digest('hex');

  try {
    const convex = new ConvexHttpClient(convexUrl);
    const result = await convex.mutation(api.rateLimits.consume, {
      secret,
      key,
      limit,
      windowMs,
    });
    if (!result.allowed) {
      return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil(result.retryAfterMs / 1000)) };
    }
    return { allowed: true, remaining: result.remaining };
  } catch (error) {
    console.error('[rate-limit] backend unavailable:', error);
    return { allowed: false, unavailable: true };
  }
}
