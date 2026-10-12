/**
 * In-memory hourly limit per key (user id). Resets on restart and is per server instance,
 * so it only caps abuse roughly; a shared store (Redis/DB) is a planned follow-up.
 */
export function createHourlyLimiter(maxPerHour: number) {
  const windows = new Map<string, { count: number; windowStart: number }>();
  const WINDOW_MS = 60 * 60 * 1000;

  return function check(key: string): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const entry = windows.get(key);
    if (!entry || now - entry.windowStart > WINDOW_MS) {
      windows.set(key, { count: 1, windowStart: now });
      return { allowed: true, remaining: maxPerHour - 1 };
    }
    if (entry.count >= maxPerHour) return { allowed: false, remaining: 0 };
    entry.count++;
    return { allowed: true, remaining: maxPerHour - entry.count };
  };
}
