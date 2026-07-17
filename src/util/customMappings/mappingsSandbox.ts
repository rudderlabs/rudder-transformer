/**
 * esbuild entry — bundled into a single IIFE loaded inside isolated-vm.
 * NOT imported by runtime code directly. Compiled by:
 *   npm run build:sandboxes  ->  dist/mappingsSandbox.bundle.js
 *
 * The JsonTemplateEngine Function() sink executes here, INSIDE the isolate,
 * where process/require/globalThis are unavailable.
 */
import {
  JsonTemplateEngine,
  PathType,
  type TemplateInput,
} from '@rudderstack/json-template-engine';

export type MappingsResult = { ok: true; value: unknown } | { ok: false; error: string };

declare const globalThis: Record<string, unknown>;

// Compiling a template (parse + codegen) dominates per-call allocation; running the compiled
// engine via evaluate() is cheap. The mappings are fixed per destination while the event
// varies, so memoize the compiled engine per template and only re-run evaluate() per event.
// This isolate is long-lived and per-workspace, so the cache persists across evals on it —
// under a concurrency burst each eval then allocates only evaluate()'s small working set
// instead of recompiling, which is what let the shared 16 MB heap breach and dispose the isolate.
// Bounded so a workspace with many distinct templates can't grow this cache into the very OOM
// it exists to prevent; a workspace realistically has a handful of templates, so the cap rarely bites.
const MAX_CACHED_ENGINES = 100;
const engineCache = new Map<string, ReturnType<typeof JsonTemplateEngine.createAsSync>>();

globalThis.evaluateCustomMappingsInSandbox = (
  mappings: TemplateInput,
  event: unknown,
): MappingsResult => {
  try {
    // Args cross the isolate boundary via structured clone, so `mappings` is a fresh copy each
    // call — key by content, not reference identity (which would never hit).
    const key = JSON.stringify(mappings);
    let engine = engineCache.get(key);
    if (!engine) {
      engine = JsonTemplateEngine.createAsSync(mappings, { defaultPathType: PathType.JSON });
      // FIFO eviction: Map preserves insertion order, so the first key is the oldest.
      if (engineCache.size >= MAX_CACHED_ENGINES) {
        engineCache.delete(engineCache.keys().next().value as string);
      }
      engineCache.set(key, engine);
    }
    return { ok: true, value: engine.evaluate(event) };
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
};
