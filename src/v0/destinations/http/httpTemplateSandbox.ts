/**
 * esbuild entry point — bundled into a single IIFE for use inside isolated-vm.
 *
 * This file is NOT imported by any runtime code directly. It is compiled by:
 *   npm run build:sandboxes
 * into dist/httpTemplateSandbox.bundle.js, which IvmScriptRunner reads
 * at runtime and loads into an isolate context.
 *
 * Exposes HTTP v2 template parse, request-field and body evaluation globals
 * sharing one isolate per workspace.
 */
import {
  compileTemplate,
  CompiledTemplate,
  parseTemplate,
  ParseTemplateResult,
} from '../../../util/jsonataTemplate/templateEngine';

export type RequestFieldExpressions = {
  headers: { to: string; from: string }[];
  queryParams: { to: string; from: string }[];
  pathParams: string[];
};
export type EvaluatedRequestFields = {
  headers: Record<string, unknown>;
  params: Record<string, unknown>;
  pathParams: unknown[];
};
export type RequestFieldResult =
  | { ok: true; fields: EvaluatedRequestFields }
  | { ok: false; error: string };
export type HttpBodyResult = { ok: true; body: unknown } | { ok: false; error: string };

declare const globalThis: Record<string, unknown>;

// HTTP templates iterate `$$.events` rather than custom_audience's `$$.records`.
const HTTP_COLLECTION = 'events';

const errorMessage = (e: unknown): string => (e as { message?: string })?.message || String(e);

// Verify all HTTP fields in one bounded isolate call, retaining one result per field.
globalThis.parseHttpTemplatesInSandbox = (templates: string[]): ParseTemplateResult[] =>
  templates.map((template) => {
    try {
      return parseTemplate(template, HTTP_COLLECTION);
    } catch (e: unknown) {
      return { valid: false, errors: [errorMessage(e)] };
    }
  });

const evaluatePairs = async (
  pairs: [string, CompiledTemplate][],
  data: Record<string, unknown>,
): Promise<Record<string, unknown>> => {
  const out: Record<string, unknown> = {};
  for (const [key, evaluate] of pairs) {
    // eslint-disable-next-line no-await-in-loop -- per-event field evaluation is ordered
    out[key] = await evaluate(data);
  }
  return out;
};

globalThis.evaluateRequestFieldsInSandbox = async (
  expressions: RequestFieldExpressions,
  events: unknown[],
): Promise<RequestFieldResult[]> => {
  const compilePair = ({ to, from }: { to: string; from: string }): [string, CompiledTemplate] => [
    to,
    compileTemplate(from, HTTP_COLLECTION),
  ];
  let headers: [string, CompiledTemplate][];
  let queryParams: [string, CompiledTemplate][];
  let pathParams: CompiledTemplate[];
  try {
    headers = expressions.headers.map(compilePair);
    queryParams = expressions.queryParams.map(compilePair);
    pathParams = expressions.pathParams.map((path) => compileTemplate(path, HTTP_COLLECTION));
  } catch (e: unknown) {
    const error = errorMessage(e);
    return events.map(() => ({ ok: false, error }));
  }
  const results: RequestFieldResult[] = [];
  for (const message of events) {
    const data = { message };
    try {
      /* eslint-disable no-await-in-loop -- per-event field evaluation is ordered */
      const fields = {
        headers: await evaluatePairs(headers, data),
        params: await evaluatePairs(queryParams, data),
        pathParams: [] as unknown[],
      };
      for (const evaluate of pathParams) fields.pathParams.push(await evaluate(data));
      /* eslint-enable no-await-in-loop */
      results.push({ ok: true, fields });
    } catch (e: unknown) {
      results.push({ ok: false, error: errorMessage(e) });
    }
  }
  return results;
};

globalThis.evaluateHttpBodyInSandbox = async (
  template: string,
  chunks: unknown[][],
): Promise<HttpBodyResult[]> => {
  let evaluate: CompiledTemplate;
  try {
    evaluate = compileTemplate(template, HTTP_COLLECTION);
  } catch (e: unknown) {
    const error = errorMessage(e);
    return chunks.map(() => ({ ok: false, error }));
  }
  const results: HttpBodyResult[] = [];
  for (const events of chunks) {
    try {
      // eslint-disable-next-line no-await-in-loop -- a compiled expression is not reentrant
      results.push({ ok: true, body: await evaluate({ events }) });
    } catch (e: unknown) {
      results.push({ ok: false, error: errorMessage(e) });
    }
  }
  return results;
};
