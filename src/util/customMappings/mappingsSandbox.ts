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

globalThis.evaluateCustomMappingsInSandbox = (
  mappings: TemplateInput,
  event: unknown,
): MappingsResult => {
  try {
    const value = JsonTemplateEngine.createAsSync(mappings, {
      defaultPathType: PathType.JSON,
    }).evaluate(event);
    return { ok: true, value };
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
};
