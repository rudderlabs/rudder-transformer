---
name: code-structure
description: Code design conventions — handler maps, dependency management, function extraction. Applied automatically — not user-invocable.
---

# Code Structure Conventions

Follow these conventions when writing or restructuring modules.

## Avoid eslint-disable; Restructure Instead

Prefer restructuring code to eliminate lint violations rather than suppressing them. However, use a targeted `eslint-disable-next-line` with a reason comment when the violation IS the intended behavior (e.g. in-place mutation in a function whose purpose is mutation) and restructuring would just be cosmetic indirection hiding the same operation from the linter.

```ts
// Good — pass the recursive function as a parameter to break the cycle
const PLUGINS: Record<string, Plugin> = {
  markdown: {
    render: (content, renderChild) => {
      content.sections.forEach((s) => renderChild(s));
    },
  },
};

function render(content: Content): string {
  return PLUGINS[content.type].render(content, render);
}

// Bad — suppress the lint rule
/* eslint-disable @typescript-eslint/no-use-before-define */
const PLUGINS: Record<string, Plugin> = {
  markdown: {
    render: (content) => {
      content.sections.forEach((s) => render(s)); // forward ref
    },
  },
};

function render(content: Content): string {
  return PLUGINS[content.type].render(content);
}
/* eslint-enable @typescript-eslint/no-use-before-define */
```

```ts
// Good — targeted disable when the function's purpose IS mutation
function stripInternalProps(value: unknown): unknown {
  if (Array.isArray(value)) {
    for (const prop of INTERNAL_PROPS) {
      // eslint-disable-next-line no-param-reassign -- intentional in-place mutation
      if (prop in value) delete (value as Record<string, unknown>)[prop];
    }
  }
  return value;
}

// Bad — local variable indirection that just hides the same mutation from the linter
function stripInternalProps(value: unknown): unknown {
  if (Array.isArray(value)) {
    const arr: Record<string, unknown> = value as unknown as Record<string, unknown>;
    for (const prop of INTERNAL_PROPS) {
      if (prop in arr) delete arr[prop]; // still mutating `value`
    }
  }
  return value;
}
```

## Centralized Handler Map Over Duplicated Logic

When multiple functions need per-type behavior, use a single handler map rather than parallel switch statements or if-else chains. Adding a new type should require a change in exactly one place.

```ts
// Good — one map entry per type, both behaviors co-located
const EVENT_HANDLERS: Record<string, { validate: ValidateFn; transform?: TransformFn }> = {
  purchase: {
    validate: (event, ctx) => {
      /* ... */
    },
    transform: (event, output) => {
      /* ... */
    },
  },
};

// Bad — parallel switches that must stay in sync
function validateEvent(event: Event) {
  switch (event.type) {
    case 'purchase':
      /* ... */ break;
  }
}
function transformEvent(event: Event) {
  switch (event.type) {
    case 'purchase':
      /* ... */ break;
  }
}
```

## Type-Specific Logic Belongs in the Handler

The generic dispatch function should only look up and invoke the handler. Checks specific to one type belong inside that type's handler, not in the dispatcher.

```ts
// Good — type-specific guard lives in the handler
const ROUTE_HANDLERS = {
  webhook: {
    process: (request, ctx) => {
      if (!ctx.signatureVerified) {
        ctx.errors.push('Webhooks require a verified signature.');
        return;
      }
      // ... handle webhook
    },
  },
};

function processRequest(request: Request, ctx: Context): void {
  const handler = ROUTE_HANDLERS[request.type];
  if (!handler) {
    ctx.errors.push(`Unknown type: ${request.type}`);
    return;
  }
  handler.process(request, ctx);
}

// Bad — type-specific check leaks into the dispatcher
function processRequest(request: Request, ctx: Context): void {
  if (request.type === 'webhook' && !ctx.signatureVerified) {
    ctx.errors.push('Webhooks require a verified signature.');
    return;
  }
  const handler = ROUTE_HANDLERS[request.type];
  if (!handler) {
    ctx.errors.push(`Unknown type: ${request.type}`);
    return;
  }
  handler.process(request, ctx);
}
```

## Named Constants for Magic Strings in Comparisons

Extract string literals used in equality checks to named constants with a comment explaining what produces that value. This applies to any string coming from an external library, parser output, or engine internal.

```ts
// Good — named constants with origin documented
// Dot notation `$.records` → prop.type = "id"
// Bracket notation `$["records"]` → prop.type = "str"
const SELECTOR_PROP_TYPE_ID = 'id';
const SELECTOR_PROP_TYPE_STR = 'str';

if (prop.type === SELECTOR_PROP_TYPE_STR) {
  errors.push('Bracket notation is not supported.');
}

// Bad — magic strings with no explanation of where they come from
if (prop.type === 'str') {
  errors.push('Bracket notation is not supported.');
}
```

## Comments Proportional to Complexity

Comment density should match code complexity. Straightforward code needs no comments. Non-obvious code — especially code operating on parsed structures, engine internals, or implicit conventions — needs inline comments showing concrete examples of the runtime data shape.

JSDoc describes the function's contract (what it does, what it returns). Implementation workarounds (library quirks, perf tradeoffs, upstream bug references) belong as inline comments directly above the relevant code line, not in the JSDoc.

```ts
// Good — JSDoc = contract; inline comment = implementation workaround
/**
 * Compile and evaluate a template against the provided data.
 * Returns the evaluation result. Throws on parse or evaluation errors.
 */
export async function evaluateTemplate(
  template: string,
  data: Record<string, unknown>,
): Promise<unknown> {
  const result = await expr.evaluate(data);
  // Strip JSONata-internal properties (e.g. `sequence` flag on mapped arrays).
  // No built-in cleanup API exists — see jsonata-js/jsonata#296.
  return JSON.parse(JSON.stringify(result));
}

// Bad — implementation workaround in JSDoc pollutes the contract
/**
 * Compile and evaluate a template against the provided data.
 * The result is JSON-round-tripped to strip JSONata-internal properties
 * (e.g. the `sequence` flag). Recommended per jsonata-js/jsonata#296.
 */
export async function evaluateTemplate(
  template: string,
  data: Record<string, unknown>,
): Promise<unknown> {
  const result = await expr.evaluate(data);
  return JSON.parse(JSON.stringify(result));
}

// Good — complex code has comments showing the actual data shape
// $ path — check if this is `$.records.(<block>)` to enter iteration context.
// AST shape: root="___d", parts=[selector("records"), block_expr([...])]
const isRecordsPath =
  root === INTERNAL_ROOT &&
  parts.length >= 2 &&
  parts[0].type === SyntaxType.SELECTOR &&
  parts[0].prop?.value === RECORDS_FIELD;

// Good — simple code has no comments
const fields = new Set<string>();
collectFields(ast, false, fields);
return [...fields];

// Bad — complex code with no explanation of "___d" or what parts[0] represents
const isRecordsPath =
  root === '___d' &&
  parts.length >= 2 &&
  parts[0].type === 'selector' &&
  parts[0].prop?.value === 'records';
```

## Use `formatZodError` for Zod Validation Errors

When returning Zod validation errors in controllers or utilities, use `formatZodError` from `@rudderstack/integrations-lib` instead of manually formatting `error.issues`.

```ts
// Good
import { formatZodError } from '@rudderstack/integrations-lib';

const parsed = schema.safeParse(ctx.request.body);
if (!parsed.success) {
  ctx.body = { error: formatZodError(parsed.error) };
  ctx.status = 400;
  return;
}

// Bad — manual formatting duplicates what the util already does
if (!parsed.success) {
  ctx.body = { error: parsed.error.issues.map((i) => i.message).join('; ') };
  ctx.status = 400;
  return;
}
```

## Keep Utility Error Messages Generic

Error messages in reusable utilities should describe _what_ failed, not prescribe a caller-specific fix. The caller knows its own build commands, scripts, and context.

```ts
// Good — states what's wrong, the caller can add context
throw new Error(`IvmScriptRunner: bundle not found at ${this.bundlePath}.`);

// Bad — prescribes a fix that only applies to one caller
throw new Error(
  `IvmScriptRunner: bundle not found at ${this.bundlePath}. Run \`npm run build:custom-audience-sandbox\` first.`,
);
```

## Inline Single-Use Wrapper Functions

Don't extract a function that's called from exactly one place and adds no clarity. Inline it.

```ts
// Good — logic directly in the function that uses it
function loadConfig(raw: string): AppConfig {
  let parsed: RawConfig;
  try {
    parsed = JSON.parse(raw);
  } catch (e: any) {
    throw new ConfigError(e.message);
  }
  return normalize(parsed);
}

// Bad — unnecessary wrapper called from one place
function safeParse(raw: string): RawConfig {
  try {
    return JSON.parse(raw);
  } catch (e: any) {
    throw new ConfigError(e.message);
  }
}

function loadConfig(raw: string): AppConfig {
  const parsed = safeParse(raw);
  return normalize(parsed);
}
```

## Reuse Existing Repo-Wide Utilities Instead of Redeclaring

Before defining a new constant, enum, or shared type for a record-spec destination, audience destination, or other common concept, search for an existing one. Common locations:

- `src/v0/util/recordUtils.js` — `EVENT_TYPES` (`{ INSERT, UPDATE, DELETE }`) for record-action keys
- `src/v0/util/audienceUtils.ts` — `HashingType` enum, `processAudienceRecord` for empty-stripping + hashing
- `src/types/rudderEvents.ts` — `RecordAction` enum, `RudderRecordV2` Zod schema and inferred type, `RudderMessage`
- `src/v0/util/index.js` — `getSuccessRespEvents`, `getErrorRespEvents`, `defaultRequestConfig`, `removeUndefinedAndNullAndEmptyValues`, `applyCustomMappings`, `applyJSONStringTemplate`

```ts
// Good — use the canonical record-action source
import { EVENT_TYPES } from '../../util/recordUtils';
import type { RecordAction } from '../../../types/rudderEvents';

const schema = z.object({
  action: z.enum([EVENT_TYPES.INSERT, EVENT_TYPES.UPDATE, EVENT_TYPES.DELETE]),
});

// Bad — re-declares constants and types that already exist
const ACTIONS = { INSERT: 'insert', UPDATE: 'update', DELETE: 'delete' } as const;
type Action = (typeof ACTIONS)[keyof typeof ACTIONS];
```

## Don't Re-Validate Inputs That Zod Has Already Validated

If a function is reachable only through a Zod-guarded entry point (`getInputSchema()` in a `BatchDestination`, a controller's `safeParse()`, etc.), helpers downstream should treat the validated fields as guaranteed. Don't re-check enum membership, presence, or shape — let the type system carry that contract.

```ts
// Good — Zod validated `action`; the helper only handles its real job (lookup)
const lookupActionConfig = (action: Action, destConfig: DestConfig): ActionConfig => {
  const actionConfig = destConfig.actions[action];
  if (!actionConfig) {
    throw new InstrumentationError(`No action configuration for: ${action}`);
  }
  return actionConfig;
};

// Bad — duplicates the enum check Zod already enforced upstream
const lookupActionConfig = (action: string, destConfig: DestConfig) => {
  if (action !== 'insert' && action !== 'update' && action !== 'delete') {
    throw new InstrumentationError(`Unsupported action: ${action}`);
  }
  // ... lookup
};
```

## Drop Config Knobs Without Varying Callers

If every call site passes the same value (or always falls through to the default), remove the parameter and hardcode the value. Don't keep optional knobs "for flexibility" without a real caller varying them — every unused knob adds an option to read, document, and test.

```ts
// Good — single caller, hardcode the value
export class IvmScriptRunner {
  constructor(options: IvmScriptRunnerOptions) {
    this.cache = new DisposableCache({ name: 'custom_audience_ivm' });
    // ...
  }
}

// Bad — optional knob with one caller that never varies it
export interface IvmScriptRunnerOptions {
  bundlePath: string;
  memoryLimitMb: number;
  cacheName?: string; // every instantiation passes nothing or the same value
}

export class IvmScriptRunner {
  constructor(options: IvmScriptRunnerOptions) {
    this.cache = new DisposableCache({ name: options.cacheName ?? 'custom_audience_ivm' });
    // ...
  }
}
```

## Don't Wrap a Callee's Existing Try-Catch

If the function you call already converts errors to a project-standard error type (`InstrumentationError`, `ConfigurationError`, etc.), don't wrap the call site in another try-catch that re-throws the same kind of error. The added layer obscures the stack and only changes the message prefix.

```ts
// Good — evaluateTemplate already throws InstrumentationError on failure
const resolveEndpoint = (template: string, baseUrl: string, conn: ConnConfig): string => {
  const path = String(evaluateTemplate(`\`${template}\``, { connection: conn }) ?? '');
  return `${baseUrl.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
};

// Bad — redundant outer try-catch that just re-wraps the same error class
const resolveEndpoint = (template, baseUrl, conn) => {
  let path: unknown;
  try {
    path = evaluateTemplate(`\`${template}\``, { connection: conn });
  } catch (err) {
    throw new InstrumentationError(`Failed to resolve endpoint: ${(err as Error).message}`);
  }
  // ...
};
```

## Handle Errors Closest to the Source

Orchestrator methods that coordinate multiple stages should not contain try-catch blocks. The helper that can fail should catch its own errors and return a structured result. The orchestrator then checks the result — no catching, just branching.

```ts
// Good — helper catches internally; orchestrator is a clean linear flow
async function safeTransformBatch(events) {
  try {
    return { payloads: await transformBatch(events) };
  } catch (err: unknown) {
    return { payloads: [], error: err instanceof Error ? err.message : String(err) };
  }
}

// orchestrator — no try-catch, just checks the result
const result = await safeTransformBatch(events);
if (result.error) {
  return { transformed: [{ error: result.error }] };
}
return { transformed: result.payloads };

// Bad — orchestrator wraps the call in try-catch far from the error source
try {
  response.transformed = await transformBatch(events);
} catch (err: any) {
  response.transformed = [{ error: err.message }];
}
```

## Dispatch on the Integration Major (`destination.version`)

A destination definition can ship multiple **integration majors** (its config/API v1 → v2). The data plane carries the major as `destination.version` (a number; `destinationVersion` on the proxy payload). Branch on it **inside the destination's own code** — never route majors through `getDestHandler` (that argument is the unrelated `v0`/`v1`/`v2` architecture directory).

Default to an in-file inline branch on `getDestinationVersion(event.destination.version)` (from `src/util/utils`, which normalizes the raw major) at the top of the entry `process`; keep v1 in place and factor shared logic into `utils.ts`. `0`, `undefined`, non-numeric, and `1` all normalize to `1` and fall to v1; fractions are truncated. Branch on the helper, not the bare `Number(...)`, so metrics never see a `destVersion=0`.

```ts
// Good — in-file branch; v1 unchanged; shared logic in utils
import { getDestinationVersion } from '../../../util/utils';

const process = (event) => {
  const major = getDestinationVersion(event.destination.version);
  if (major >= 2) return processV2(event);
  return processV1(event);
};

// Bad — bare Number(event.destination.version) (skips normalization; destVersion=0 leaks to metrics)
// Bad — routing the major through getDestHandler (conflates the architecture-version axis)
```

Escalate the v2 branch to a sibling module (`transformV2.ts` — the existing repo convention) only on large divergence; prefer that over `./v1` / `./v2` subdirs (none exist today), though subdirs aren't strictly banned for a major large enough to warrant its own tree. Branch `routerTransform` / `deleteUsers` / the proxy `networkHandler` (which reads top-level `destinationVersion`) only when a major actually changes them. Full reference: CONTRIBUTING.md → "Dispatching on the integration major".
