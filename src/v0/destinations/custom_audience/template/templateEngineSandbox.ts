/**
 * esbuild entry point — bundled into a single IIFE for use inside isolated-vm.
 *
 * This file is NOT imported by any runtime code directly. It is compiled by:
 *   npm run build:sandboxes
 * into dist/templateEngineSandbox.bundle.js, which IvmScriptRunner reads
 * at runtime and loads into an isolate context.
 *
 * Exposes parse, custom-audience evaluation, and HTTP request-field/body
 * evaluation globals sharing one isolate per workspace.
 */
import jsonata from 'jsonata';
import { parseTemplate, evaluateTemplate, ParseTemplateResult } from './templateEngine';

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

export type EvaluateResult =
  | { ok: true; bodies: Record<string, unknown>[] }
  | { ok: false; error: string };
export type HttpBodyResult = { ok: true; body: unknown } | { ok: false; error: string };

declare const globalThis: Record<string, unknown>;

// HTTP templates iterate `$$.events` rather than custom_audience's `$$.records`.
const HTTP_COLLECTION = 'events';

const errorMessage = (e: unknown): string => (e as { message?: string })?.message || String(e);

globalThis.parseTemplateInSandbox = (template: string): ParseTemplateResult => {
  try {
    return parseTemplate(template);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unexpected error during template parsing.';
    return { valid: false, errors: [message] };
  }
};

// Verify all HTTP fields in one bounded isolate call, retaining one result per field.
globalThis.parseHttpTemplatesInSandbox = (templates: string[]): ParseTemplateResult[] =>
  templates.map((template) => {
    try {
      return parseTemplate(template, HTTP_COLLECTION);
    } catch (e: unknown) {
      return { valid: false, errors: [errorMessage(e)] };
    }
  });

globalThis.evaluateRequestFieldsInSandbox = async (
  expressions: RequestFieldExpressions,
  events: unknown[],
): Promise<RequestFieldResult[]> => {
  let compiled: {
    headers: { to: string; expr: jsonata.Expression }[];
    queryParams: { to: string; expr: jsonata.Expression }[];
    pathParams: jsonata.Expression[];
  };
  try {
    for (const expression of [
      ...expressions.headers.map(({ from }) => from),
      ...expressions.queryParams.map(({ from }) => from),
      ...expressions.pathParams,
    ]) {
      const result = parseTemplate(expression, HTTP_COLLECTION);
      if (!result.valid) throw new Error(result.errors.join('; '));
    }
    compiled = {
      headers: expressions.headers.map(({ to, from }) => ({ to, expr: jsonata(from) })),
      queryParams: expressions.queryParams.map(({ to, from }) => ({ to, expr: jsonata(from) })),
      pathParams: expressions.pathParams.map((path) => jsonata(path)),
    };
  } catch (e: unknown) {
    const error = errorMessage(e);
    return events.map(() => ({ ok: false, error }));
  }
  const results: RequestFieldResult[] = [];
  for (const message of events) {
    try {
      const data = { message };
      const headers: Record<string, unknown> = {};
      const params: Record<string, unknown> = {};
      for (const { to, expr } of compiled.headers) {
        // eslint-disable-next-line no-await-in-loop -- per-event field evaluation is ordered
        headers[to] = await expr.evaluate(data);
      }
      for (const { to, expr } of compiled.queryParams) {
        // eslint-disable-next-line no-await-in-loop -- per-event field evaluation is ordered
        params[to] = await expr.evaluate(data);
      }
      const pathParams: unknown[] = [];
      for (const expr of compiled.pathParams) {
        // eslint-disable-next-line no-await-in-loop -- evaluate compiled expressions in order
        pathParams.push(await expr.evaluate(data));
      }
      results.push({ ok: true, fields: { headers, params, pathParams } });
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
  const validation = parseTemplate(template, HTTP_COLLECTION);
  if (!validation.valid) {
    return chunks.map(() => ({ ok: false, error: validation.errors.join('; ') }));
  }
  return Promise.all(
    chunks.map(async (events): Promise<HttpBodyResult> => {
      try {
        const body = await evaluateTemplate(template, { events });
        return { ok: true, body };
      } catch (e: unknown) {
        return { ok: false, error: errorMessage(e) };
      }
    }),
  );
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
    const error = errorMessage(e);
    return { ok: false, error };
  }
};
