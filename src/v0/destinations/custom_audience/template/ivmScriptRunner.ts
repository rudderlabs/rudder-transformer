/**
 * Lightweight cached isolate runner for pre-built script bundles.
 *
 * Uses DisposableCache from ivmCache/ for LRU caching with stats, logging,
 * and automatic disposal of evicted isolates.
 */
import ivm from 'isolated-vm';
import fs from 'fs';
import DisposableCache from '../../../../util/ivmCache/index';

export interface IvmScriptRunnerOptions {
  /** Absolute path to the IIFE bundle loaded into each isolate context. */
  bundlePath: string;
  /** V8 heap limit per isolate (MB). */
  memoryLimitMb: number;
  /** Timeout for the initial bundle evaluation (ms). */
  initTimeoutMs: number;
  /** Timeout for each execute() call (ms). */
  execTimeoutMs: number;
}

function releaseIvmResources(context?: ivm.Context, isolate?: ivm.Isolate) {
  try {
    context?.release();
  } catch {
    // already released
  }
  try {
    isolate?.dispose();
  } catch {
    // already disposed
  }
}

export class IvmScriptRunner {
  private cache: InstanceType<typeof DisposableCache>;

  private pendingCreations = new Map<string, Promise<unknown>>();

  private bundleCode: string | undefined;

  private readonly bundlePath: string;

  private readonly memoryLimitMb: number;

  private readonly initTimeoutMs: number;

  private readonly execTimeoutMs: number;

  constructor(options: IvmScriptRunnerOptions) {
    this.bundlePath = options.bundlePath;
    this.memoryLimitMb = options.memoryLimitMb;
    this.initTimeoutMs = options.initTimeoutMs;
    this.execTimeoutMs = options.execTimeoutMs;
    this.cache = new DisposableCache({ name: 'custom_audience_ivm' });
  }

  /**
   * Execute an expression inside a cached isolate.
   *
   * The isolate is looked up (or created) by `cacheKey`. The expression is
   * compiled as a script and run with `copy: true` so the return value is
   * transferred to the main thread via structured clone.
   */
  async execute<T>(cacheKey: string, expression: string): Promise<T> {
    const entry = await this.getOrCreate(cacheKey);

    try {
      const script = await entry.isolate.compileScript(expression);
      return (await script.run(entry.context, {
        timeout: this.execTimeoutMs,
        copy: true,
      })) as T;
    } catch (err: unknown) {
      // Timeout, OOM, or disposed isolate — evict so next call gets a fresh one
      this.cache.delete(cacheKey);
      throw err;
    }
  }

  private getBundleCode(): string {
    if (!this.bundleCode) {
      this.bundleCode = fs.readFileSync(this.bundlePath, 'utf-8');
    }
    return this.bundleCode;
  }

  private async createEntry() {
    const isolate = new ivm.Isolate({ memoryLimit: this.memoryLimitMb });
    let context: ivm.Context | undefined;
    try {
      context = await isolate.createContext();
      const script = await isolate.compileScript(this.getBundleCode());
      await script.run(context, { timeout: this.initTimeoutMs });
      return {
        isolate,
        context,
        destroy: async () => releaseIvmResources(context, isolate),
      };
    } catch (err) {
      releaseIvmResources(context, isolate);
      throw err;
    }
  }

  private async getOrCreate(cacheKey: string) {
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Promise coalescing: concurrent callers for the same key await the same
    // in-flight promise instead of each creating their own isolate.
    //
    // .then()/.catch() chaining is intentional — it returns a promise object
    // synchronously (no event-loop yield), so we can store it in the map on
    // the very next line, BEFORE any concurrent caller can enter this method.
    // A try { await } catch would yield the event loop at the await, leaving
    // the map empty and re-opening the race window.
    let pending = this.pendingCreations.get(cacheKey);
    if (!pending) {
      pending = this.createEntry()
        .then((entry) => {
          this.cache.set(cacheKey, entry);
          return entry;
        })
        .finally(() => {
          this.pendingCreations.delete(cacheKey);
        });
      this.pendingCreations.set(cacheKey, pending);
    }
    return pending;
  }
}
