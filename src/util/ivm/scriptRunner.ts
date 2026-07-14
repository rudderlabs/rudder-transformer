/**
 * Lightweight cached isolate runner for pre-built script bundles.
 * Shared across destinations; each consumer supplies its own bundle + cacheName.
 */
import ivm from 'isolated-vm';
import fs from 'fs';
import path from 'path';
import DisposableCache from '../ivmCache/index';
import stats from '../stats';

/**
 * Resolve a sandbox IIFE bundle path shared by isolate consumers. In production
 * the bundle sits next to the compiled JS (`<dirname>/<rootFromHere>/<filename>`);
 * when running from source under ts-jest it lives beneath `dist/`. `dirname` is the
 * consumer's `__dirname`; `rootFromHere` is the relative hops from there to the build root.
 */
export function resolveBundlePath(dirname: string, rootFromHere: string, filename: string): string {
  const productionBundle = path.resolve(dirname, rootFromHere, filename);
  return fs.existsSync(productionBundle)
    ? productionBundle
    : path.resolve(dirname, rootFromHere, 'dist', filename);
}

export interface IvmScriptRunnerOptions {
  /** Absolute path to the IIFE bundle loaded into each isolate context. */
  bundlePath: string;
  /** V8 heap limit per isolate (MB). */
  memoryLimitMb: number;
  /** Timeout for the initial bundle evaluation (ms). */
  initTimeoutMs: number;
  /** Timeout for each execute() call (ms). */
  execTimeoutMs: number;
  /** DisposableCache name — keep pools separate per consumer. */
  cacheName: string;
  /** LRU max entries (concurrent warm isolates). Omit to keep the DisposableCache default. */
  maxSize?: number;
  /** Idle-isolate TTL (ms). Omit to keep the DisposableCache default. */
  ttlMs?: number;
}

interface CacheEntry {
  isolate: ivm.Isolate;
  context: ivm.Context;
  destroy: () => Promise<void>;
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
    this.cache = new DisposableCache({
      name: options.cacheName,
      ttlAutopurge: true,
      // Passed through only when provided so existing consumers keep their defaults
      // (DisposableCache falls back to IVM_CACHE_MAX_SIZE ?? 10 / IVM_CACHE_TTL_MS ?? 300000).
      ...(options.maxSize !== undefined ? { maxSize: options.maxSize } : {}),
      ...(options.ttlMs !== undefined ? { ttlMs: options.ttlMs } : {}),
      onChange: () => this.emitAggregateHeapStats(),
    });
  }

  /**
   * Execute a closure inside a cached isolate, passing args via structured
   * clone. Args are scoped to the closure (referenced as $0, $1, $2, …),
   * avoiding global mutation and race conditions between concurrent calls.
   */
  async execute<T>(cacheKey: string, expression: string, args: unknown[]): Promise<T> {
    try {
      const entry = await this.getOrCreate(cacheKey);
      const result = await entry.context.evalClosure(expression, args, {
        arguments: { copy: true },
        result: { copy: true, promise: true },
        timeout: this.execTimeoutMs,
      });
      return result as T;
    } catch (err: unknown) {
      // Platform failure: timeout, OOM, disposed isolate, or a failure while
      // building the isolate. Evict so the next call gets a fresh one, and emit
      // a metric for observability before rethrowing.
      this.cache.delete(cacheKey);
      stats.increment('ivm_platform_error', {
        functionName: expression,
        workspaceId: cacheKey,
        cache: this.cache.cacheName,
      });
      throw err;
    }
  }

  /** Sum heap across all cached isolates. Called on cache mutation only. */
  private emitAggregateHeapStats() {
    let totalHeap = 0;
    for (const cached of this.cache.values() as CacheEntry[]) {
      try {
        totalHeap += cached.isolate.getHeapStatisticsSync().total_heap_size;
      } catch {
        // isolate may already be disposed
      }
    }
    stats.gauge('ivm_cache_total_heap', totalHeap, { cache: this.cache.cacheName });
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
