/**
 * esbuild entry point — bundled into a single IIFE for use inside isolated-vm.
 *
 * This file is NOT imported by any runtime code directly. It is compiled by:
 *   npm run build:custom-audience-sandbox
 * into dist/templateEngineSandbox.bundle.js, which IvmScriptRunner reads
 * at runtime and loads into an isolate context.
 *
 * Exposes two globals (parse + evaluate) sharing one isolate per workspace.
 *
 * All template-language dependencies are encapsulated in templateEngine —
 * this file only orchestrates the sandbox boundary.
 */
import { parseTemplate, evaluateTemplate, ParseTemplateResult } from './templateEngine';

export type EvaluateResult =
  | { ok: true; bodies: Record<string, unknown>[] }
  | { ok: false; error: string };

declare const globalThis: Record<string, unknown>;

globalThis.parseTemplateInSandbox = (template: string): ParseTemplateResult => {
  try {
    return parseTemplate(template);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unexpected error during template parsing.';
    return { valid: false, errors: [message] };
  }
};

globalThis.evaluateTemplateInSandbox = async (
  template: string,
  chunks: unknown[][],
  connection: unknown,
): Promise<EvaluateResult> => {
  try {
    const bodies = await Promise.all(
      chunks.map(
        (records) =>
          evaluateTemplate(template, { records, connection }) as Promise<Record<string, unknown>>,
      ),
    );
    return { ok: true, bodies };
  } catch (e: unknown) {
    const error = e instanceof Error ? e.message : String(e);
    return { ok: false, error };
  }
};
