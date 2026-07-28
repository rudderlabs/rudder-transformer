/**
 * Sandboxed custom-mapping evaluation. Runs JsonTemplateEngine inside a
 * dedicated, low-resource, per-workspaceId isolate pool (custom_mappings_ivm),
 * independent from custom_audience. Fails closed when workspaceId is absent.
 */
import { ConfigurationError, PlatformError } from '@rudderstack/integrations-lib';
import logger from '../../logger';
import { IvmScriptRunner, resolveBundlePath } from '../ivm/scriptRunner';
import type { MappingsResult } from './mappingsSandbox';

// src/util/customMappings — 3 levels up reaches the build root (dist/ in production).
const BUNDLE_PATH = resolveBundlePath(__dirname, '../../../', 'mappingsSandbox.bundle.js');

// Lazily constructed on first use. Building the runner creates a DisposableCache that logs
// on init, so instantiating it at module load would run that side effect merely by importing
// this file (it is pulled in transitively via v0/util) — breaking callers that mock the logger.
// Mappings fan out across many more workspaces than custom_audience, so this dedicated pool
// (custom_mappings_ivm) is sized lower; isolates are still created lazily per workspace and
// purged by LRU + TTL. Start maxSize at 20; tune from ivm_cache_size / hit-ratio metrics.
let runner: IvmScriptRunner | undefined;
const getRunner = (): IvmScriptRunner => {
  if (!runner) {
    runner = new IvmScriptRunner({
      bundlePath: BUNDLE_PATH,
      memoryLimitMb: Number.parseInt(process.env.CUSTOM_MAPPINGS_IVM_MEMORY_MB || '16', 10),
      initTimeoutMs: Number.parseInt(process.env.CUSTOM_MAPPINGS_IVM_INIT_TIMEOUT_MS || '5000', 10),
      execTimeoutMs: Number.parseInt(process.env.CUSTOM_MAPPINGS_IVM_EXEC_TIMEOUT_MS || '500', 10),
      cacheName: 'custom_mappings_ivm',
      maxSize: Number.parseInt(process.env.CUSTOM_MAPPINGS_IVM_CACHE_MAX_SIZE || '20', 10),
      ttlMs: Number.parseInt(process.env.CUSTOM_MAPPINGS_IVM_CACHE_TTL_MS || '300000', 10),
      // A workspace's evals all share one fixed-size isolate heap. Left ungated, a burst piles
      // every in-flight eval onto that heap until V8 disposes the isolate and fails all of them
      // at once — the amplification behind INT-6832. Excess evals queue instead; the queue is
      // unbounded, so a burst costs latency rather than dropped events.
      maxConcurrentExecutions: Number.parseInt(
        process.env.CUSTOM_MAPPINGS_IVM_MAX_CONCURRENT_EXECUTIONS || '100',
        10,
      ),
    });
  }
  return runner;
};

export async function sandboxedApplyCustomMappings(
  event: unknown,
  mappings: unknown,
  workspaceId: string,
): Promise<unknown> {
  if (!workspaceId) {
    // Fail closed — never evaluate without a per-tenant isolate.
    throw new PlatformError(
      'workspaceId is required for sandboxed custom-mappings evaluation',
      500,
    );
  }
  let result: MappingsResult;
  try {
    result = await getRunner().execute<MappingsResult>(
      workspaceId,
      'return evaluateCustomMappingsInSandbox($0, $1)',
      [mappings, event],
    );
  } catch (err: unknown) {
    // Infra failure (timeout, OOM, disposed isolate). Log the detail internally, but
    // surface a generic message — never leak sandbox/infra internals to the caller.
    const reason = err instanceof Error ? err.message : String(err);
    logger.error('Custom mappings sandbox unavailable', { workspaceId, error: reason });
    throw new PlatformError('Custom mappings evaluation is temporarily unavailable', 500);
  }
  if (!result.ok) {
    // Raw engine error — callers (HTTP getCustomMappings, GA4 handleCustomMappings)
    // add their own "custom mappings" context, so no prefix here (avoids double-wrapping).
    throw new ConfigurationError(result.error);
  }
  return result.value;
}
