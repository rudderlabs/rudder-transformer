---
name: code-structure
description: Code design conventions — handler maps, dependency management, function extraction. Applied automatically — not user-invocable.
---

# Code Structure Conventions

## Avoid eslint-disable; Restructure Instead

Restructure to remove a lint violation rather than suppress it. Exception: when the violation
**is** the intended behavior (e.g. in-place mutation in a function whose purpose is mutation), use
a targeted `eslint-disable-next-line` with a reason — indirection that hides the same operation
from the linter is worse.

```ts
// Good — pass the recursive function in to break the forward reference
const PLUGINS = { markdown: { render: (content, renderChild) => content.sections.forEach(renderChild) } };
function render(content: Content): string { return PLUGINS[content.type].render(content, render); }
// Bad — /* eslint-disable @typescript-eslint/no-use-before-define */ around a forward ref

// Good — the function exists to mutate
// eslint-disable-next-line no-param-reassign -- intentional in-place mutation
if (prop in value) delete (value as Record<string, unknown>)[prop];
// Bad — `const arr = value as unknown as Record<string, unknown>; delete arr[prop];` — still mutates `value`
```

## Centralized Handler Map Over Duplicated Logic

Per-type behavior lives in one map, not parallel switches/if-chains; a new type is a one-place change.

```ts
// Good
const EVENT_HANDLERS: Record<string, { validate: ValidateFn; transform?: TransformFn }> = {
  purchase: { validate: (event, ctx) => { /* … */ }, transform: (event, output) => { /* … */ } },
};
// Bad — validateEvent() and transformEvent() each switch on event.type and must stay in sync
```

## Type-Specific Logic Belongs in the Handler

The dispatcher only looks up and invokes; type-specific checks live in that type's handler.

```ts
// Good
const ROUTE_HANDLERS = {
  webhook: { process: (request, ctx) => {
    if (!ctx.signatureVerified) { ctx.errors.push('Webhooks require a verified signature.'); return; }
    // …
  } },
};
function processRequest(request: Request, ctx: Context): void {
  const handler = ROUTE_HANDLERS[request.type];
  if (!handler) { ctx.errors.push(`Unknown type: ${request.type}`); return; }
  handler.process(request, ctx);
}
// Bad — `if (request.type === 'webhook' && !ctx.signatureVerified)` inside processRequest
```

## Named Constants for Magic Strings in Comparisons

String literals in equality checks — from libraries, parser output, engine internals — become named
constants with a comment on what produces them.

```ts
// Dot notation `$.records` → prop.type = "id"; bracket `$["records"]` → prop.type = "str"
const SELECTOR_PROP_TYPE_STR = 'str';
if (prop.type === SELECTOR_PROP_TYPE_STR) errors.push('Bracket notation is not supported.'); // Good
if (prop.type === 'str') { /* … */ }                                                          // Bad
```

## Comments Proportional to Complexity

Simple code needs no comments. Non-obvious code (parsed structures, engine internals, implicit
conventions) needs inline comments showing the concrete runtime shape. JSDoc states the contract;
workarounds (library quirks, perf tradeoffs, upstream bug refs) go inline above the line they
explain, not in JSDoc.

```ts
// Good
/** Compile and evaluate a template against the data. Throws on parse or evaluation errors. */
export async function evaluateTemplate(template: string, data: Record<string, unknown>): Promise<unknown> {
  const result = await expr.evaluate(data);
  // Strip JSONata-internal properties (e.g. `sequence` on mapped arrays); no cleanup API — jsonata-js/jsonata#296.
  return JSON.parse(JSON.stringify(result));
}

// Good — complex code shows the shape
// $ path — is this `$.records.(<block>)`? AST: root="___d", parts=[selector("records"), block_expr([...])]
const isRecordsPath = root === INTERNAL_ROOT && parts.length >= 2
  && parts[0].type === SyntaxType.SELECTOR && parts[0].prop?.value === RECORDS_FIELD;

// Bad — the workaround in JSDoc; or `root === '___d' && parts[0].type === 'selector'` with no explanation
```

## Use `formatZodError` for Zod Validation Errors

```ts
import { formatZodError } from '@rudderstack/integrations-lib';
if (!parsed.success) { ctx.body = { error: formatZodError(parsed.error) }; ctx.status = 400; return; } // Good
ctx.body = { error: parsed.error.issues.map((i) => i.message).join('; ') };                            // Bad
```

## Keep Utility Error Messages Generic

Reusable utilities say *what* failed; the caller knows its own fix.

```ts
throw new Error(`IvmScriptRunner: bundle not found at ${this.bundlePath}.`); // Good
throw new Error(`… Run \`npm run build:custom-audience-sandbox\` first.`);   // Bad — one caller's fix
```

## Inline Single-Use Wrapper Functions

Don't extract a function called from one place that adds no clarity.

```ts
// Good
function loadConfig(raw: string): AppConfig {
  let parsed: RawConfig;
  try { parsed = JSON.parse(raw); } catch (e: any) { throw new ConfigError(e.message); }
  return normalize(parsed);
}
// Bad — a safeParse(raw) used only by loadConfig
```

## Reuse Existing Repo-Wide Utilities Instead of Redeclaring

Search before declaring a constant, enum or shared type:

- `src/v0/util/recordUtils.js` — `EVENT_TYPES` (`{ INSERT, UPDATE, DELETE }`)
- `src/v0/util/audienceUtils.ts` — `HashingType`, `processAudienceRecord`
- `src/types/rudderEvents.ts` — `RecordAction`, `RudderRecordV2` (schema + type), `RudderMessage`
- `src/v0/util/index.js` — `getSuccessRespEvents`, `getErrorRespEvents`, `defaultRequestConfig`,
  `removeUndefinedAndNullAndEmptyValues`, `applyCustomMappings`, `applyJSONStringTemplate`

```ts
z.enum([EVENT_TYPES.INSERT, EVENT_TYPES.UPDATE, EVENT_TYPES.DELETE]);                  // Good
const ACTIONS = { INSERT: 'insert', UPDATE: 'update', DELETE: 'delete' } as const;     // Bad
```

## Don't Re-Validate Inputs That Zod Has Already Validated

Code reachable only through a Zod-guarded entry (`getInputSchema()`, a controller's `safeParse()`)
treats validated fields as guaranteed — no re-checking enums, presence or shape.

```ts
// Good — only the real job (lookup)
const lookupActionConfig = (action: Action, destConfig: DestConfig): ActionConfig => {
  const actionConfig = destConfig.actions[action];
  if (!actionConfig) throw new InstrumentationError(`No action configuration for: ${action}`);
  return actionConfig;
};
// Bad — `if (action !== 'insert' && action !== 'update' && action !== 'delete') throw …`
```

## Drop Config Knobs Without Varying Callers

If every caller passes the same value (or the default), remove the parameter and hardcode it.

```ts
this.cache = new DisposableCache({ name: 'custom_audience_ivm' });                         // Good
this.cache = new DisposableCache({ name: options.cacheName ?? 'custom_audience_ivm' });    // Bad — no caller varies cacheName
```

## Don't Wrap a Callee's Existing Try-Catch

If the callee already throws the project error type, don't re-wrap it — it only changes the prefix
and obscures the stack.

```ts
// Good — evaluateTemplate already throws InstrumentationError
const path = String(evaluateTemplate(`\`${template}\``, { connection: conn }) ?? '');
// Bad
try { path = evaluateTemplate(…); } catch (err) { throw new InstrumentationError(`Failed to resolve endpoint: ${(err as Error).message}`); }
```

## Handle Errors Closest to the Source

Orchestrators have no try-catch; the failing helper catches and returns a structured result, and
the orchestrator branches on it.

```ts
// Good
async function safeTransformBatch(events) {
  try { return { payloads: await transformBatch(events) }; }
  catch (err: unknown) { return { payloads: [], error: err instanceof Error ? err.message : String(err) }; }
}
const result = await safeTransformBatch(events);
if (result.error) return { transformed: [{ error: result.error }] };
return { transformed: result.payloads };
// Bad — orchestrator wraps transformBatch in try-catch far from the source
```

## Dispatch on the Integration Major (`destination.version`)

A definition can ship several **integration majors** (config/API v1 → v2), carried as
`destination.version` (number; `destinationVersion` on the proxy payload). Branch **inside the
destination's code** — never via `getDestHandler` (its argument is the unrelated `v0`/`v1`/`v2`
architecture directory).

Default: an inline branch on `getDestinationVersion(event.destination.version)` (`src/util/utils`)
at the top of `process`, v1 left in place, shared logic in `utils.ts`. `0`, `undefined`,
non-numeric and `1` normalize to `1`; fractions truncate. Use the helper, not bare `Number(...)`,
so metrics never see `destVersion=0`.

```ts
import { getDestinationVersion } from '../../../util/utils';
const process = (event) => {
  const major = getDestinationVersion(event.destination.version);
  if (major >= 2) return processV2(event);
  return processV1(event);
};
```

Escalate to a sibling `transformV2.ts` (repo convention) only on large divergence — preferred over
`./v1`/`./v2` subdirs (none exist; not banned for a very large major). Branch `routerTransform` /
`deleteUsers` / the proxy `networkHandler` (reads top-level `destinationVersion`) only when a major
changes them. Full reference: CONTRIBUTING.md → "Dispatching on the integration major".

## No Re-Export Shims, No Empty Placeholder Files

Import from the module that defines the symbol; a file that only re-exports is an ownerless hop
(e.g. a `batch.ts` that is just `export { MAX_BATCH_SIZE } from './config'; export type { Integration } from './routerTransform';`).
Don't commit empty files to reserve a slot (an empty `dataDelivery/data.ts`) — add it when it has content.

## Export Only What Crosses a File Boundary

Default to module-local; `export` claims another file consumes it — for types, Zod schemas and
`const` helpers alike. After a refactor makes a symbol local, drop the leftover `export`.
