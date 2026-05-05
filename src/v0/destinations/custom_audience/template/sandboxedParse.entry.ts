/**
 * esbuild entry point — bundled into a single IIFE for use inside isolated-vm.
 *
 * This file is NOT imported by any runtime code directly. It is compiled by:
 *   npm run build:custom-audience-sandbox
 * into dist/sandboxedParse.bundle.js, which IvmScriptRunner reads
 * at runtime and loads into an isolate context.
 */
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
