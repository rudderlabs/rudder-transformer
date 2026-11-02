/**
 * Sandboxed template operations for HTTP v2 — parse and evaluate user-supplied
 * request body and request field templates inside isolated-vm.
 *
 * One isolate per workspaceId (http_ivm pool, separate from custom_audience).
 * The bundle at dist/httpTemplateSandbox.bundle.js is produced by
 * `npm run build:sandboxes`.
 */
import { PlatformError } from '@rudderstack/integrations-lib';
import logger from '../../../logger';
import { IvmScriptRunner, resolveBundlePath } from '../../../util/ivm/scriptRunner';
import type { ParseTemplateResult } from '../../../util/jsonataTemplate/templateEngine';
import type {
  HttpBodyResult,
  RequestFieldExpressions,
  RequestFieldResult,
} from './httpTemplateSandbox';

// src/v0/destinations/http — 4 levels up reaches the build root (dist/ in production).
const BUNDLE_PATH = resolveBundlePath(__dirname, '../../../../', 'httpTemplateSandbox.bundle.js');

export const httpTemplateSandboxRunner = new IvmScriptRunner({
  bundlePath: BUNDLE_PATH,
  memoryLimitMb: Number.parseInt(process.env.HTTP_IVM_MEMORY_MB || '32', 10),
  initTimeoutMs: Number.parseInt(process.env.HTTP_IVM_INIT_TIMEOUT_MS || '5000', 10),
  execTimeoutMs: Number.parseInt(process.env.HTTP_IVM_EXEC_TIMEOUT_MS || '500', 10),
  cacheName: 'http_ivm',
});

async function execute<T>(
  workspaceId: string,
  script: string,
  args: unknown[],
  operation: string,
): Promise<T> {
  try {
    return await httpTemplateSandboxRunner.execute<T>(workspaceId, script, args);
  } catch (err: unknown) {
    // Timeout, OOM or disposed isolate — a platform problem, not the user's template.
    // Log the detail, but never leak infra internals to the caller.
    const reason = err instanceof Error ? err.message : String(err);
    logger.error(`HTTP ${operation} sandbox execute failed`, { workspaceId, error: reason });
    throw new PlatformError(`Template ${operation} is temporarily unavailable`, 500);
  }
}

export const sandboxedParseHttpTemplates = (
  templates: string[],
  workspaceId: string,
): Promise<ParseTemplateResult[]> =>
  execute(workspaceId, 'return parseHttpTemplatesInSandbox($0)', [templates], 'parsing');

export const sandboxedEvaluateRequestFields = (
  fields: RequestFieldExpressions,
  events: unknown[],
  workspaceId: string,
): Promise<RequestFieldResult[]> =>
  execute(
    workspaceId,
    'return evaluateRequestFieldsInSandbox($0, $1)',
    [fields, events],
    'evaluation',
  );

export const sandboxedEvaluateHttpBody = (
  template: string,
  chunks: unknown[][],
  workspaceId: string,
): Promise<HttpBodyResult[]> =>
  execute(
    workspaceId,
    'return evaluateHttpBodyInSandbox($0, $1)',
    [template, chunks],
    'evaluation',
  );
