// Shared poll helper for eventually-consistent destination read-backs.

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export type PollCheckResult<T> = { done: boolean; value: T };

export type PollUntilOptions = {
  label: string;
  attempts: number;
  /** Delay before the next attempt; `attempt` is 0-based (after the first check). */
  delayMs: (attempt: number) => number;
  /** Extra wait after a successful check (e.g. search-index settle). */
  settleMs?: number;
  /**
   * When true, return the last observed value on exhaustion instead of throwing — useful for
   * verify steps that want a jest `expect` diff of the final read-back.
   */
  soft?: boolean;
};

/**
 * Poll `check` until it returns `{ done: true }` or attempts are exhausted.
 * Transient throws are retained; with `soft: false` (default) they are rethrown if nothing
 * ever succeeded, otherwise a timeout error is thrown.
 */
export async function pollUntil<T>(
  check: () => Promise<PollCheckResult<T>>,
  options: PollUntilOptions,
): Promise<T> {
  let lastValue: T | undefined;
  let lastError: unknown;
  let sawValue = false;

  for (let attempt = 0; attempt < options.attempts; attempt += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const result = await check();
      lastValue = result.value;
      sawValue = true;
      if (result.done) {
        if (options.settleMs) {
          // eslint-disable-next-line no-await-in-loop
          await sleep(options.settleMs);
        }
        return result.value;
      }
    } catch (err) {
      lastError = err;
    }
    if (attempt < options.attempts - 1) {
      // eslint-disable-next-line no-await-in-loop
      await sleep(options.delayMs(attempt));
    }
  }

  if (options.soft) {
    if (!sawValue && lastError) {
      throw lastError;
    }
    return lastValue as T;
  }

  if (lastError && !sawValue) {
    throw lastError;
  }
  throw new Error(
    `pollUntil: ${options.label} not satisfied after ${options.attempts} attempts` +
      (lastError instanceof Error ? ` (last error: ${lastError.message})` : ''),
  );
}
