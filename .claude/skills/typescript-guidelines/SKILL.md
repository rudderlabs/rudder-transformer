---
name: typescript-guidelines
description: TypeScript-specific conventions — type narrowing, optional chaining, type safety. Applied automatically — not user-invocable.
---

# TypeScript Guidelines

Follow these conventions when writing TypeScript code.

## No Optional Chaining When the Type Guarantees the Property

Inside a type-specific handler or after narrowing, don't use `?.` on properties that the type guarantees exist. It adds noise and obscures which properties are genuinely optional.

```ts
// Good — inside the "order" handler, lineItems is guaranteed
order: {
  process: (event) => {
    event.lineItems.forEach((item) => validateItem(item));
  },
},

// Bad — unnecessary defensive chaining
order: {
  process: (event) => {
    event.lineItems?.forEach((item) => validateItem(item));
  },
},
```

## Discriminated Unions in Return Types

When a function returns success/failure outcomes, use a union type discriminated on a literal field — not a single type with optional fields.

```ts
// Good
type Result = { valid: true; recordFields: string[] } | { valid: false; errors: string[] };

// Bad
type Result = { valid: boolean; errors?: string[]; recordFields?: string[] };
```

## Cast at the Earliest Point Where the Type Is Known

Place type assertions as close as possible to where the value's shape is determined. This applies at two levels: wrapper functions should narrow their return type so callers never cast, and within a function, cast individual values at the point of production rather than on an aggregate after collection.

```ts
// Good — wrapper narrows; callers are type-safe
export async function sandboxedEvaluate(
  template: string,
  chunks: unknown[][],
): Promise<Record<string, unknown>[]> {
  const result = await runner.execute<EvaluateResult>(key, expr);
  return result.bodies; // typed Record<string, unknown>[] inside EvaluateResult
}

const bodies = await sandboxedEvaluate(template, chunks);
return chunks.map((chunk, i) => ({ body: bodies[i], jobIds: chunk.jobIds }));

// Bad — wrapper returns unknown[]; every caller casts
export async function sandboxedEvaluate(template: string, chunks: unknown[][]): Promise<unknown[]> {
  const result = await runner.execute<{ bodies: unknown[] }>(key, expr);
  return result.bodies;
}

const bodies = await sandboxedEvaluate(template, chunks);
return chunks.map((chunk, i) => ({
  body: bodies[i] as Record<string, unknown>, // cast leaks into call site
  jobIds: chunk.jobIds,
}));
```

Within a function, cast each value where it originates — not after aggregating into an array or object.

```ts
// Good — cast at the individual call site where the shape is known
const bodies = await Promise.all(
  chunks.map(
    (records) =>
      evaluateTemplate(template, { records, connection }) as Promise<Record<string, unknown>>,
  ),
);

// Bad — cast on the collected aggregate
const bodies = (await Promise.all(
  chunks.map((records) => evaluateTemplate(template, { records, connection })),
)) as Record<string, unknown>[];
```

## Prefer `unknown` Over `any` for Generic Containers

Use `unknown` instead of `any` for `Map`, `Promise`, or collection types where the container doesn't need to know the value's shape. Callers can narrow with `as T` at the point of use.

```ts
// Good
private pendingCreations = new Map<string, Promise<unknown>>();
private cache = new Map<string, unknown>();

// Bad
private pendingCreations = new Map<string, Promise<any>>();
private cache = new Map<string, any>();
```

## Use `.finally()` for Shared Cleanup in Promise Chains

When `.then()` and `.catch()` both need the same cleanup, move it to `.finally()` and keep only the success-path logic in `.then()`.

```ts
// Good — cleanup in one place
pending = this.createEntry()
  .then((entry) => {
    this.cache.set(cacheKey, entry);
    return entry;
  })
  .finally(() => {
    this.pendingCreations.delete(cacheKey);
  });

// Bad — duplicated cleanup
pending = this.createEntry()
  .then((entry) => {
    this.pendingCreations.delete(cacheKey);
    this.cache.set(cacheKey, entry);
    return entry;
  })
  .catch((err) => {
    this.pendingCreations.delete(cacheKey);
    throw err;
  });
```

## Required Config Is `z.string().min(1)`, Not `z.string()`

`z.string()` accepts `''`. For a credential or an account identifier that means an
unconfigured destination passes schema validation and the emptiness surfaces on the wire —
`Authorization: Bearer ` or `?pid=` — as a 401/400 from the partner at delivery time, long
after the point where it could have been reported as a configuration error.

Push required-ness into the schema, and the downstream runtime check becomes deletable (see
`code-structure` → "Don't Re-Validate Inputs That Zod Has Already Validated"). The two rules
work together: the schema is the single place the requirement is expressed.

```ts
// Good — fails at transform time with a clear error
const DestinationConfigSchema = z.object({
  apiKey: z.string().min(1),
  pixelId: z.string().min(1),
});

// Bad — `''` passes, and a `resolveAccountConfig()` helper re-checks it at runtime
const DestinationConfigSchema = z.object({
  apiKey: z.string().optional(),
  pixelId: z.string().optional(),
});
```

## `??` Does Not Catch Throws

A nullish-coalescing fallback only fires on `undefined` or `null`. If the left-hand expression
*throws* — because it validates its input — the throw propagates and the fallback never runs.
A resolver that both validates and participates in a `??` chain defeats its own default.

Decide which one it is: either the resolver returns `undefined` for unusable input and the
fallback handles it, or it throws and there is no fallback to write.

```ts
// Bad — a whitespace-padded currency throws, so `defaultCurrency` is never reached
const currency = normalizeCurrency(getValueFromMessage(message, paths)) ?? config.defaultCurrency;

// Good — unusable input returns undefined; genuinely invalid input still throws
const raw = getValueFromMessage(message, paths);
const currency = normalizeCurrency(raw) ?? normalizeCurrency(config.defaultCurrency);
```

Normalize consistently while you are here. If a file trims and lowercases one enum before
comparing it, every other enum comparison in that file should do the same — an
`action_source` matched case-sensitively rejects a perfectly ordinary `'Web'` and drops the
event, purely because it was the one string nobody normalized.

## No Bare `as string` Over a Dot-Path Value

`get(message, path)` returns `any`. Casting the result to `string` because the payload type
says `string` asserts something nothing checked: the customer's field may be a number, and the
path may not resolve at all. Both failures are silent — a JSON number reaches an API expecting
a string, or the field is `undefined` and gets stripped by `removeUndefinedAndNullValues`, so
the request goes out missing a **required** field instead of failing with an actionable error.

```ts
// Good — validate the type, stringify, and fail loudly when a required value is absent
const raw = get(message, mapping.deduplicationKey);
if (isPresent(raw) && !['string', 'number', 'boolean'].includes(typeof raw)) {
  throw new InstrumentationError(`deduplicationKey "${mapping.deduplicationKey}" is not a scalar`);
}
const id = isPresent(raw) ? String(raw) : message.messageId;

// Bad — a lie about two untyped sources
const id = (get(message, mapping.deduplicationKey) ?? message.messageId) as string;
```

## Non-Auth Destinations Read Credentials From `Config`

When a destination's credentials live in the destination config rather than the accounts
framework, read them from `destination.Config` directly. Don't model an `Account` shape for
them, and don't cast the destination to get there — a `DestinationIntegration` subclass already
carries a typed `destination`, so `this.destination as MyDestination` is a sign the generic
parameter is wrong rather than that a cast is needed.
