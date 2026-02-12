/**
 * In-memory rate limit for expensive endpoints (e.g. AI).
 * Use when the app is public and strangers can call your API.
 * Resets on process restart; for multi-instance use Redis or your host's rate limit.
 */

const store = new Map<string, { count: number; resetAt: number }>();

/** Default: 10 requests per hour per IP for AI. Override with AI_RATE_LIMIT_PER_HOUR. */
const PER_HOUR =
  typeof process.env.AI_RATE_LIMIT_PER_HOUR === "string"
    ? Math.max(1, parseInt(process.env.AI_RATE_LIMIT_PER_HOUR, 10) || 10)
    : 10;

const WINDOW_MS = 60 * 60 * 1000;

function getClientId(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  const xri = req.headers.get("x-real-ip");
  const ip = (xff?.split(",")[0]?.trim() || xri || "anonymous").slice(0, 64);
  return `ai:${ip}`;
}

/** Returns true if allowed, false if rate limited. */
export function checkAiRateLimit(req: Request): { allowed: boolean; remaining: number; retryAfter?: number } {
  const id = getClientId(req);
  const now = Date.now();
  let entry = store.get(id);

  if (!entry) {
    store.set(id, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: PER_HOUR - 1 };
  }

  if (now >= entry.resetAt) {
    entry = { count: 1, resetAt: now + WINDOW_MS };
    store.set(id, entry);
    return { allowed: true, remaining: PER_HOUR - 1 };
  }

  if (entry.count >= PER_HOUR) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count += 1;
  return { allowed: true, remaining: PER_HOUR - entry.count };
}

/** Prune old entries occasionally so the map doesn't grow forever. */
function prune(): void {
  const now = Date.now();
  Array.from(store.entries()).forEach(([key, val]) => {
    if (now >= val.resetAt) store.delete(key);
  });
}
if (typeof setInterval !== "undefined") {
  setInterval(prune, 10 * 60 * 1000);
}
