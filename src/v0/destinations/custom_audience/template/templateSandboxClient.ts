/**
 * Sandboxed template operations for custom_audience — parse and evaluate
 * user-supplied requestBody templates inside isolated-vm.
 *
 * One isolate per workspaceId serves both operations. The combined bundle at
 * dist/templateEngineSandbox.bundle.js is produced by
 * `npm run build:custom-audience-sandbox`.
 */
import { InstrumentationError, PlatformError } from '@rudderstack/integrations-lib';
import logger from '../../../../logger';
import { ERROR_MESSAGES } from '../constants';
import { templateSandboxRunner } from './ivmScriptRunner';
import type { ParseTemplateResult } from './templateEngine';
import type { EvaluateResult } from './templateEngineSandbox';

// ---------------------------------------------------------------------------
// Parse
// ---------------------------------------------------------------------------

export async function sandboxedParseTemplate(
  template: string,
  workspaceId: string,
): Promise<ParseTemplateResult> {
  try {
    return await templateSandboxRunner.execute<ParseTemplateResult>(
      workspaceId,
      'return parseTemplateInSandbox($0)',
      [template],
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error('Template sandbox parse error', { workspaceId, error: message });
    return { valid: false, errors: ['Template parsing is temporarily unavailable.'] };
  }
}

// ---------------------------------------------------------------------------
// Evaluate
// ---------------------------------------------------------------------------

export async function sandboxedEvaluateTemplate(
  template: string,
  chunks: unknown[][],
  connection: unknown,
  workspaceId: string,
): Promise<Record<string, unknown>[]> {
  let result: EvaluateResult;
  try {
    result = await templateSandboxRunner.execute<EvaluateResult>(
      workspaceId,
      'return evaluateTemplateInSandbox($0, $1, $2)',
      [template, chunks, connection],
    );
  } catch (err: unknown) {
    // Timeout, OOM, disposed isolate, or other infrastructure failure —
    // internal/platform problem, not an issue with the user's template.
    const reason = err instanceof Error ? err.message : String(err);
    logger.error('Template sandbox execute failed', { workspaceId, error: reason });
    throw new PlatformError(`Template sandbox unavailable: ${reason}`, 500);
  }

  if (!result.ok) {
    throw new InstrumentationError(ERROR_MESSAGES.TEMPLATE_EVALUATION_FAILED(result.error));
  }
  return result.bodies;
}
