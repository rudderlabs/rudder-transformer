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
  /**
   * Max execute() calls in flight at once on a single isolate; further calls queue.
   * The queue itself is unbounded — nothing is ever shed, so a burst costs latency
   * rather than dropped events. Omit (or pass a non-positive value) to leave
   * execution ungated.
   */
  maxConcurrentExecutions?: number;
}

interface CacheEntry {
  isolate: ivm.Isolate;
  context: ivm.Context;
  destroy: () => Promise<void>;
}

/** One isolate's execution gate: slots in use plus the callers waiting for one. */
interface ExecutionGate {
  /**
   * Slots currently spoken for — deliberately *not* "executions running". A slot handed from
   * a departing caller to a waiter stays counted here across the microtask gap in which
   * neither is executing, because the cap governs reservations, not work in progress.
   */
  slotsInUse: number;
  /** FIFO — see the `shift()` in `acquireSlot`'s release closure. */
  waiters: Array<() => void>;
}

/** Slot release for the ungated path — nothing was reserved, so nothing to hand back. */
const NOOP_RELEASE = () => {};

// isolated-vm timeout errors include this message when evalClosure exceeds its timeout option.
const SCRIPT_EXECUTION_TIMEOUT_MESSAGE = 'script execution timed out';

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

  private readonly maxConcurrentExecutions: number;

  /** Per-isolate execution gates, keyed like the isolate cache. Dropped once fully idle. */
  private gates = new Map<string, ExecutionGate>();

  constructor(options: IvmScriptRunnerOptions) {
    // An absent or nonsensical cap means "ungated" rather than "never admit anything", so a
    // misconfigured env var leaves execution ungated instead of wedging the sandbox. Absent
    // defaults to NaN, which — like an unparseable env var — fails the comparison below and
    // falls through to Infinity.
    const {
      bundlePath,
      memoryLimitMb,
      initTimeoutMs,
      execTimeoutMs,
      cacheName,
      maxSize,
      ttlMs,
      maxConcurrentExecutions = NaN,
    } = options;
    this.bundlePath = bundlePath;
    this.memoryLimitMb = memoryLimitMb;
    this.initTimeoutMs = initTimeoutMs;
    this.execTimeoutMs = execTimeoutMs;
    this.maxConcurrentExecutions = maxConcurrentExecutions > 0 ? maxConcurrentExecutions : Infinity;
    this.cache = new DisposableCache({
      name: cacheName,
      ttlAutopurge: true,
      // Passed through only when provided so existing consumers keep their defaults
      // (DisposableCache falls back to IVM_CACHE_MAX_SIZE ?? 10 / IVM_CACHE_TTL_MS ?? 300000).
      ...(maxSize !== undefined ? { maxSize } : {}),
      ...(ttlMs !== undefined ? { ttlMs } : {}),
      onChange: () => this.emitAggregateHeapStats(),
    });
  }

  /**
   * Execute a closure inside a cached isolate, passing args via structured
   * clone. Args are scoped to the closure (referenced as $0, $1, $2, …),
   * avoiding global mutation and race conditions between concurrent calls.
   *
   * Admission is gated per isolate (see {@link acquireSlot}) so a burst cannot pile
   * unbounded concurrent evaluations onto one fixed-size heap.
   */
  async execute<T>(cacheKey: string, expression: string, args: unknown[]): Promise<T> {
    // One label set for every metric this call can emit — the platform-error counter and both
    // gate metrics — so they can be joined on (workspaceId, functionName, cache) in a query.
    const metricTags = {
      functionName: expression,
      workspaceId: cacheKey,
      cache: this.cache.cacheName,
    };
    // Outside the try so `releaseSlot` is in scope for the finally. Waiting for a slot is
    // not a failure mode — acquireSlot never rejects, it only ever admits or queues.
    const releaseSlot = await this.acquireSlot(cacheKey, metricTags);
    try {
      // Seed the platform-error counter at 0 when a fresh isolate is built for this label set
      // (once per isolate, not per call — warm-isolate calls never touch the registry).
      // Prometheus only exports a counter after its first increment, and rate()/increase()
      // anchor on the first sample within their window — so without a 0 baseline, an error
      // burst that lands on a freshly-seen (workspaceId, functionName, cache) series is
      // invisible to the ivm-platform-errors alert: increase() can only catch the *second*
      // increment of an already-established series, missing the first burst entirely. A
      // workspace's first call is always a cache miss, so the 0 is materialised before any
      // error can occur, giving increase() the 0 -> N edge it needs to detect the first burst.
      const entry = await this.getOrCreate(cacheKey, () =>
        stats.counter('ivm_platform_error', 0, metricTags),
      );
      const result = await entry.context.evalClosure(expression, args, {
        arguments: { copy: true },
        result: { copy: true, promise: true },
        timeout: this.execTimeoutMs,
      });
      return result as T;
    } catch (err: unknown) {
      // Platform failures are still observed and rethrown. Execution timeouts do not
      // corrupt the isolate, so keep it cached; OOM, disposed-isolate, and build
      // failures still evict so the next call gets a fresh isolate.
      const isTimeout =
        err instanceof Error &&
        err.message.toLowerCase().includes(SCRIPT_EXECUTION_TIMEOUT_MESSAGE);
      if (!isTimeout) {
        this.cache.delete(cacheKey);
      }
      stats.increment('ivm_platform_error', metricTags);
      throw err;
    } finally {
      releaseSlot();
    }
  }

  /**
   * Reserve one of the isolate's concurrency slots, queueing if they are all taken.
   *
   * An isolate executes JS on a single thread with a fixed heap, so extra concurrency buys
   * no throughput — it only keeps more argument copies and evaluation working sets alive on
   * that one heap at once, which is what breaches `memoryLimit` and makes V8 dispose the
   * whole isolate (failing every in-flight call, not just the one that tipped it). Queued
   * callers hold their args on the Node heap instead, where they already were.
   *
   * The queue is unbounded: nothing is ever shed, so an overload costs latency rather than
   * dropped events, and `ivm_execution_queued` is the signal that a pool is at its cap.
   *
   * Returns a release function that is safe to call once; it hands the slot straight to the
   * next waiter so the isolate stays saturated up to the cap.
   */
  private acquireSlot(
    cacheKey: string,
    metricTags: Record<string, string>,
  ): Promise<() => void> | (() => void) {
    if (this.maxConcurrentExecutions === Infinity) {
      return NOOP_RELEASE;
    }

    // Captured by reference for the lifetime of this call: the gate is only dropped from the
    // map once fully idle, which cannot happen while this caller holds a slot or waits in the
    // queue, so the closures below can never end up mutating a gate that has been replaced.
    let gate: ExecutionGate;
    const existing = this.gates.get(cacheKey);
    if (existing) {
      gate = existing;
    } else {
      gate = { slotsInUse: 0, waiters: [] };
      this.gates.set(cacheKey, gate);
    }

    let released = false;
    const release = () => {
      if (released) {
        return;
      }
      released = true;
      // FIFO on purpose. Popping the newest waiter would be marginally cheaper but lets the
      // oldest starve: under sustained saturation the stack never drains, and nothing bounds
      // queue time here (execTimeoutMs covers evaluation only, and the queue is unbounded).
      // Taking from the head caps the wait at queue-depth / drain-rate.
      const next = gate.waiters.shift();
      if (next) {
        // Hand the slot over instead of freeing it: `slotsInUse` stays as is. Freeing it *and*
        // waking a waiter would let the gate drift and admit past the cap.
        next();
        return;
      }
      gate.slotsInUse -= 1;
      // Keep `gates` bounded by the live isolate set rather than every key ever seen. No waiters
      // can exist here (shift() came back empty), so an idle gate is just one with no slots in
      // use.
      //
      // Reaching 0 also implies this gate is still the one stored under `cacheKey`, so the
      // delete can never drop another caller's gate: a gate is only ever removed at exactly 0,
      // and once removed nothing can re-acquire it (gates are reached only via `gates.get`, and
      // the `set` above runs only on a miss), so a removed gate counts further down from 0 and
      // never returns to it.
      if (gate.slotsInUse === 0) {
        this.gates.delete(cacheKey);
      }
    };

    if (gate.slotsInUse < this.maxConcurrentExecutions) {
      gate.slotsInUse += 1;
      return release;
    }

    // Counted at enqueue, not on admission: the wait timer below only samples once a caller is
    // let in, so under sustained saturation it lags the burst by however long the queue takes
    // to drain, while this shows the backlog forming. Emitted before the promise is built so a
    // throwing metric cannot leave a waiter enqueued holding a slot that is never released.
    //
    // Carries the full label set: the gate is per isolate, i.e. per workspace, and these two
    // metrics are the only overload signal there is — "which tenant is at its cap" is the
    // first thing you need during an incident. Cardinality is bounded by the workspaces that
    // actually reach the cap, which is rare by design (the cap sits far above normal traffic),
    // not by call volume; `functionName` is a hardcoded expression literal per call site, so
    // it adds no fan-out of its own.
    stats.increment('ivm_execution_queued', metricTags);

    const queuedAt = new Date();
    return new Promise<() => void>((resolve) => {
      // Resolved by a departing holder, which transfers its slot rather than freeing it —
      // so `slotsInUse` is already accounted for by the time we run.
      gate.waiters.push(() => {
        // Resolve before emitting: this runs inside the departing caller's release(), so a
        // throwing metric here would strand this waiter with a slot that is never handed back.
        resolve(release);
        // Same label set as the counter above, so the two join cleanly: "ws-1 queued 10k times"
        // and "ws-1 waits p99 2s" are different facts and you want both for the same series.
        // This one backs a histogram, so a label set costs a series per bucket plus _sum/_count
        // rather than the counter's single series — affordable only because the labels
        // materialise for saturating workspaces alone, which the cap makes rare.
        stats.timing('ivm_execution_queue_wait', queuedAt, metricTags);
      });
    });
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

  private async getOrCreate(cacheKey: string, onCreate: () => void) {
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
      // First build for this key — seed the error counter's 0 baseline before the isolate
      // (and any error it could raise) exists. Concurrent first callers coalesce below, so
      // this runs once per isolate creation.
      onCreate();
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
