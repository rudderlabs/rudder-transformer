import { randomUUID } from 'crypto';
import { LiveResource, LiveSecret, RunContext } from './types';

const EMAIL_DOMAIN = process.env.LIVE_TEST_EMAIL_DOMAIN || 'ci.rudderstack-test.com';

// Parses a relative time offset like '-3h' / '+1d' into milliseconds (empty -> 0).
const OFFSET_RE = /^([+-])(\d+)([smhd])$/;
const offsetToMs = (offset?: string): number => {
  if (!offset) {
    return 0;
  }
  const m = OFFSET_RE.exec(offset.trim());
  if (!m) {
    throw new Error(`Invalid time offset: "${offset}"`);
  }
  const [, sign, rawAmount, unit] = m;
  const unitMs: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  return (sign === '-' ? -1 : 1) * Number(rawAmount) * unitMs[unit];
};

export class RunContextImpl implements RunContext {
  readonly runId: string;

  readonly liveSecret: LiveSecret;

  private readonly startedAt: number;

  private readonly identityCache = new Map<string, string>();

  private readonly registered: LiveResource[] = [];

  private readonly cleanups: Array<() => void | Promise<void>> = [];

  constructor(params: { liveSecret: LiveSecret }) {
    this.runId = `run-${Date.now()}-${randomUUID().slice(0, 8)}`;
    this.liveSecret = params.liveSecret;
    this.startedAt = Date.now();
  }

  // Identities are namespaced by runId so each run uses fresh records — avoiding cross-run
  // collisions and duplicate-conflict errors — and memoised so repeat calls in a run are stable.
  identity(entity: string): string {
    const cached = this.identityCache.get(entity);
    if (cached) {
      return cached;
    }
    const id = `ci-${this.runId}-${entity}`;
    this.identityCache.set(entity, id);
    return id;
  }

  email(entity = 'user'): string {
    return `ci+${this.runId}-${entity}@${EMAIL_DOMAIN}`;
  }

  now(offset?: string): string {
    return new Date(this.startedAt + offsetToMs(offset)).toISOString();
  }

  register(resource: LiveResource): void {
    this.registered.push(resource);
  }

  addCleanup(fn: () => void | Promise<void>): void {
    this.cleanups.push(fn);
  }

  // Drain registered teardown fns LIFO; best-effort — a failing cleanup is logged, not thrown,
  // so one failure can't strand the rest. Called by the runner in afterAll.
  async runCleanups(): Promise<void> {
    while (this.cleanups.length > 0) {
      const cleanup = this.cleanups.pop();
      try {
        // eslint-disable-next-line no-await-in-loop
        await cleanup!();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('[live] cleanup failed', e);
      }
    }
  }

  get resources(): LiveResource[] {
    return [...this.registered];
  }
}
