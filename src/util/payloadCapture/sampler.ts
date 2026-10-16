/**
 * Token-bucket sampler: allows at most one record per key per interval.
 * Capture is a sampled diagnostic stream, not an archive — this bounds
 * file growth regardless of delivery volume.
 */
export class Sampler {
  private readonly lastAllowedAt = new Map<string, number>();

  constructor(private readonly intervalMs: number) {}

  allow(key: string, now: number = Date.now()): boolean {
    const last = this.lastAllowedAt.get(key);
    if (typeof last === 'number' && now - last < this.intervalMs) {
      return false;
    }
    this.lastAllowedAt.set(key, now);
    return true;
  }
}
