/**
 * Sandboxed template parser — runs parseTemplate inside isolated-vm.
 *
 * One isolate per workspaceId, cached via LRU. The bundle
 * (dist/sandboxedParse.bundle.js) is produced at build time by esbuild
 * and contains templateParser + json-template-engine as a single IIFE.
 */
import path from 'path';
import { IvmScriptRunner } from './ivmScriptRunner';
import logger from '../../../../logger';
import type { ParseTemplateResult } from './templateParser';

// Resolve relative to __dirname so the path is stable regardless of process.cwd().
// Works under both ts-jest (src/) and compiled runtime (dist/).
const BUNDLE_PATH = path.resolve(__dirname, '../../../../../dist/sandboxedParse.bundle.js');

const runner = new IvmScriptRunner({
  bundlePath: BUNDLE_PATH,
  memoryLimitMb: 8,
  initTimeoutMs: 5_000,
  execTimeoutMs: 1_000,
});

export async function sandboxedParseTemplate(
  template: string,
  workspaceId: string,
): Promise<ParseTemplateResult> {
  try {
    return await runner.execute<ParseTemplateResult>(
      workspaceId,
      `parseTemplateInSandbox(${JSON.stringify(template)})`,
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error('Template sandbox error', { workspaceId, error: message });
    return { valid: false, errors: ['Template parsing is temporarily unavailable.'] };
  }
}
