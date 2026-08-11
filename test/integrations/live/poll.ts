import type { PollCheckResult, PollUntilOptions, RetryUntilPassesOptions } from './types';

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

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

/**
 * Run `assert` until it passes (resolves without throwing) or attempts are exhausted, rethrowing
 * the last error on exhaustion. The retry-on-throw sibling of `pollUntil`, for a jest read-back
 * assertion the framework owns — a matcher error on the final attempt surfaces a real diff, the
 * same quality `soft: true` gives today. Backs the scenario-level `verify` block (see types.ts).
 */
export async function retryUntilPasses(
  assert: () => Promise<void>,
  options?: RetryUntilPassesOptions,
): Promise<void> {
  const attempts = options?.attempts ?? 4;
  const delayMs = options?.delayMs ?? ((attempt) => 1000 * 2 ** attempt);
  let lastError: unknown;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await assert();
      return;
    } catch (err) {
      lastError = err;
      if (attempt < attempts - 1) {
        // eslint-disable-next-line no-await-in-loop
        await sleep(delayMs(attempt));
      }
    }
  }
  throw lastError;
}
