import { createHash } from 'node:crypto';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

export type RateLimitResult =
  | { allowed: true; remaining: number }
  | { allowed: false; retryAfterSeconds: number }
  | { allowed: false; unavailable: true };

type LocalBucket = { count: number; resetAt: number };

// Vercel instances do not share memory, so this is a degraded-mode safeguard,
// not a replacement for the distributed Convex limiter. It keeps a Convex
// outage from automatically taking the public answer endpoint offline.
const localBuckets = new Map<string, LocalBucket>();
const MAX_LOCAL_BUCKETS = 5_000;

function enforceLocalFallback(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  let bucket = localBuckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    if (localBuckets.size >= MAX_LOCAL_BUCKETS) {
      // Remove expired buckets first, then evict oldest entries to keep memory bounded.
      localBuckets.forEach((existingBucket, existingKey) => {
        if (existingBucket.resetAt <= now) localBuckets.delete(existingKey);
      });
      while (localBuckets.size >= MAX_LOCAL_BUCKETS) {
        const oldestKey = localBuckets.keys().next().value;
        if (oldestKey === undefined) break;
        localBuckets.delete(oldestKey);
      }
    }
    bucket = { count: 0, resetAt: now + windowMs };
    localBuckets.set(key, bucket);
  }

  if (bucket.count >= limit) {
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) };
  }

  bucket.count += 1;
  return { allowed: true, remaining: Math.max(0, limit - bucket.count) };
}

export async function enforceRateLimit(
  request: Request,
  route: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const secret = process.env.ONEQUESTION_STREAM_SECRET;
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

  // Prefer Vercel's platform-provided client IP. Fall back to the final
  // forwarded address rather than the first, which is commonly user-supplied.
  const ip = request.headers.get('x-real-ip')
    || request.headers.get('x-forwarded-for')?.split(',').map((v) => v.trim()).filter(Boolean).at(-1)
    || 'unknown';
  const key = createHash('sha256')
    .update(secret || convexUrl || 'onequestion-local-rate-limit-fallback')
    .update(':')
    .update(route)
    .update(':')
    .update(ip)
    .digest('hex');

  // Missing or unavailable rate-limit infrastructure should degrade to a
  // bounded per-instance limiter instead of blocking every visitor. Other
  // Convex operations still validate their own required configuration.
  if (!secret || !convexUrl) {
    console.error('[rate-limit] configuration missing; using local fallback');
    return enforceLocalFallback(key, limit, windowMs);
  }

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
    console.error('[rate-limit] backend unavailable; using local fallback:', error);
    return enforceLocalFallback(key, limit, windowMs);
  }
}
