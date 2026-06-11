// In-memory token bucket — protects free-tier AI quota from runaway clients.
// Single-user app on one serverless instance: per-instance state is acceptable;
// a cold start resets buckets, which only ever errs permissive.

interface Bucket {
  tokens: number;
  lastRefill: number;
}

interface RateLimitOptions {
  capacity: number; // max burst
  refillPerMinute: number; // sustained rate
}

const buckets = new Map<string, Bucket>();

export function checkRateLimit(key: string, opts: RateLimitOptions): boolean {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { tokens: opts.capacity, lastRefill: now };

  const elapsedMin = (now - bucket.lastRefill) / 60_000;
  const refilled = Math.min(opts.capacity, bucket.tokens + elapsedMin * opts.refillPerMinute);

  if (refilled < 1) {
    buckets.set(key, { tokens: refilled, lastRefill: now });
    return false;
  }

  buckets.set(key, { tokens: refilled - 1, lastRefill: now });
  return true;
}

// Route presets — AI-calling routes get tight budgets.
export const RATE_LIMITS: Record<string, RateLimitOptions> = {
  ingest: { capacity: 10, refillPerMinute: 5 },
  tutor: { capacity: 6, refillPerMinute: 3 },
  test: { capacity: 4, refillPerMinute: 1 },
};

export function rateLimited(route: keyof typeof RATE_LIMITS): boolean {
  return !checkRateLimit(route, RATE_LIMITS[route]);
}
