/**
 * Lightweight cached isolate runner for pre-built script bundles.
 *
 * Uses DisposableCache from ivmCache/ for LRU caching with stats, logging,
 * and automatic disposal of evicted isolates.
 */
import ivm from 'isolated-vm';
import fs from 'fs';
import path from 'path';
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
   * Execute a closure inside a cached isolate, passing args via structured
   * clone. Args are scoped to the closure (referenced as $0, $1, $2, …),
   * avoiding global mutation and race conditions between concurrent calls.
   */
  async execute<T>(cacheKey: string, expression: string, args: unknown[]): Promise<T> {
    const entry = await this.getOrCreate(cacheKey);

    try {
      const result = await entry.context.evalClosure(expression, args, {
        arguments: { copy: true },
        result: { copy: true, promise: true },
        timeout: this.execTimeoutMs,
      });
      return result as T;
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

// ---------------------------------------------------------------------------
// Shared runner for custom_audience template operations.
//
// One isolate per workspaceId serves both parsing and execution. Memory and
// timeout are sized for the heavier op (evaluate); the lighter parse op runs
// comfortably inside the same envelope.
// ---------------------------------------------------------------------------

// Production runs from dist/src/…/template — 5 levels up reaches dist/.
// Tests run from src/…/template via ts-jest — 5 levels up reaches <root>, needs dist/ prefix.
const BUNDLE_FILENAME = 'templateEngineSandbox.bundle.js';
const ROOT_FROM_HERE = '../../../../../';
const PRODUCTION_BUNDLE = path.resolve(__dirname, ROOT_FROM_HERE, BUNDLE_FILENAME);
export const BUNDLE_PATH = fs.existsSync(PRODUCTION_BUNDLE)
  ? PRODUCTION_BUNDLE
  : path.resolve(__dirname, ROOT_FROM_HERE, 'dist', BUNDLE_FILENAME);

export const templateSandboxRunner = new IvmScriptRunner({
  bundlePath: BUNDLE_PATH,
  memoryLimitMb: Number.parseInt(process.env.CUSTOM_AUDIENCE_IVM_MEMORY_MB || '32', 10),
  initTimeoutMs: Number.parseInt(process.env.CUSTOM_AUDIENCE_IVM_INIT_TIMEOUT_MS || '5000', 10),
  execTimeoutMs: Number.parseInt(process.env.CUSTOM_AUDIENCE_IVM_EXEC_TIMEOUT_MS || '500', 10),
});
