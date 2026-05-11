/**
 * esbuild entry point — bundled into a single IIFE for use inside isolated-vm.
 *
 * This file is NOT imported by any runtime code directly. It is compiled by:
 *   npm run build:custom-audience-sandbox
 * into dist/sandboxedTemplate.bundle.js, which IvmScriptRunner reads
 * at runtime and loads into an isolate context.
 *
 * Exposes two globals (parse + evaluate) sharing one isolate per workspace.
 */
import { JsonTemplateEngine, PathType } from '@rudderstack/json-template-engine';
import { parseTemplate, ParseTemplateResult } from './templateParser';

declare const globalThis: Record<string, unknown>;

globalThis.parseTemplateInSandbox = (template: string): ParseTemplateResult => {
  try {
    return parseTemplate(template);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unexpected error during template parsing.';
    return { valid: false, errors: [message] };
  }
};

// Must stay in sync with the EvaluateResult definition in templateSandbox.ts.
type EvaluateResult =
  | { ok: true; bodies: Record<string, unknown>[] }
  | { ok: false; error: string };

globalThis.evaluateTemplateInSandbox = (
  template: string,
  chunks: unknown[][],
  connection: unknown,
): EvaluateResult => {
  try {
    const compiled = JsonTemplateEngine.createAsSync(template, {
      defaultPathType: PathType.JSON,
    });
    const bodies = chunks.map(
      (records) => compiled.evaluate({ records, connection }) as Record<string, unknown>,
    );
    return { ok: true, bodies };
  } catch (e: unknown) {
    const error = e instanceof Error ? e.message : String(e);
    return { ok: false, error };
  }
};
