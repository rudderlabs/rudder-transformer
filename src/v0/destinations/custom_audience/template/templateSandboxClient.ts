/**
 * Sandboxed template operations for custom_audience — parse and evaluate
 * user-supplied requestBody templates inside isolated-vm.
 *
 * One isolate per workspaceId serves both operations. The combined bundle at
 * dist/templateEngineSandbox.bundle.js is produced by
 * `npm run build:sandboxes`.
 */
import { InstrumentationError, PlatformError } from '@rudderstack/integrations-lib';
import logger from '../../../../logger';
import { ERROR_MESSAGES } from '../constants';
import { templateSandboxRunner } from './ivmScriptRunner';
import type { ParseTemplateResult } from './templateEngine';
import type {
  EvaluateResult,
  HttpBodyResult,
  RequestFieldExpressions,
  RequestFieldResult,
} from './templateEngineSandbox';

// ---------------------------------------------------------------------------
// Parse
// ---------------------------------------------------------------------------

export async function sandboxedParseTemplate(
  template: string,
  workspaceId: string,
  collection?: string,
): Promise<ParseTemplateResult> {
  try {
    return await templateSandboxRunner.execute<ParseTemplateResult>(
      workspaceId,
      'return parseTemplateInSandbox($0, $1)',
      [template, collection],
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error('Template sandbox parse error', { workspaceId, error: message });
    return { valid: false, errors: ['Template parsing is temporarily unavailable.'] };
  }
}

export async function sandboxedParseHttpTemplates(
  templates: string[],
  workspaceId: string,
): Promise<ParseTemplateResult[]> {
  try {
    return await templateSandboxRunner.execute<ParseTemplateResult[]>(
      workspaceId,
      'return parseHttpTemplatesInSandbox($0)',
      [templates],
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error('HTTP template sandbox parse error', { workspaceId, error: message });
    throw new PlatformError('Template parsing is temporarily unavailable', 500);
  }
}

export async function sandboxedEvaluateRequestFields(
  fields: RequestFieldExpressions,
  events: unknown[],
  workspaceId: string,
): Promise<RequestFieldResult[]> {
  try {
    return await templateSandboxRunner.execute<RequestFieldResult[]>(
      workspaceId,
      'return evaluateRequestFieldsInSandbox($0, $1)',
      [fields, events],
    );
  } catch (err: unknown) {
    const reason = err instanceof Error ? err.message : String(err);
    logger.error('Request field sandbox execute failed', { workspaceId, error: reason });
    throw new PlatformError('Request field evaluation is temporarily unavailable', 500);
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
    // internal/platform problem, not an issue with the user's template. Log the detail
    // internally, but surface a generic message — never leak infra internals to the caller.
    const reason = err instanceof Error ? err.message : String(err);
    logger.error('Template sandbox execute failed', { workspaceId, error: reason });
    throw new PlatformError('Template evaluation is temporarily unavailable', 500);
  }

  if (!result.ok) {
    throw new InstrumentationError(ERROR_MESSAGES.TEMPLATE_EVALUATION_FAILED(result.error));
  }
  return result.bodies as Record<string, unknown>[];
}

export async function sandboxedEvaluateHttpBody(
  template: string,
  chunks: unknown[][],
  workspaceId: string,
): Promise<HttpBodyResult[]> {
  try {
    return await templateSandboxRunner.execute<HttpBodyResult[]>(
      workspaceId,
      'return evaluateHttpBodyInSandbox($0, $1)',
      [template, chunks],
    );
  } catch (err: unknown) {
    const reason = err instanceof Error ? err.message : String(err);
    logger.error('HTTP body sandbox execute failed', { workspaceId, error: reason });
    throw new PlatformError('Template evaluation is temporarily unavailable', 500);
  }
}
