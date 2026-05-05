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

// process.cwd() is the project root in both production (npm start) and test (Jest).
// __dirname is unsuitable here because it resolves to src/ under Jest (ts-jest) but
// dist/ at runtime, requiring different relative paths for each context.
const BUNDLE_PATH = path.join(process.cwd(), 'dist', 'sandboxedParse.bundle.js');

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
