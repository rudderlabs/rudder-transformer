---
name: code-structure
description: Code design conventions — handler maps, dependency management, function extraction. Applied automatically — not user-invocable.
---

# Code Structure Conventions

Follow these conventions when writing or restructuring modules.

## Avoid eslint-disable; Restructure Instead

Never suppress lint rules with `eslint-disable`. If a pattern triggers a violation (e.g. circular references between a const map and functions), restructure the code to eliminate the forward reference.

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

```ts
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
