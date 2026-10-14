---
name: typescript-guidelines
description: TypeScript-specific conventions — type narrowing, optional chaining, type safety. Applied automatically — not user-invocable.
---

# TypeScript Guidelines

## No Optional Chaining When the Type Guarantees the Property

After narrowing (e.g. inside the `order` handler), `?.` on guaranteed properties is noise that hides
which ones are genuinely optional.

```ts
order: { process: (event) => event.lineItems.forEach(validateItem) },  // Good
order: { process: (event) => event.lineItems?.forEach(validateItem) }, // Bad
```

## Discriminated Unions in Return Types

```ts
type Result = { valid: true; recordFields: string[] } | { valid: false; errors: string[] }; // Good
type Result = { valid: boolean; errors?: string[]; recordFields?: string[] };              // Bad
```

## Cast at the Earliest Point Where the Type Is Known

Wrappers narrow their return type so callers never cast; inside a function, cast each value where
it is produced, not the aggregate.

```ts
// Good — wrapper returns Record<string, unknown>[] (typed via EvaluateResult); callers don't cast
export async function sandboxedEvaluate(template: string, chunks: unknown[][]): Promise<Record<string, unknown>[]> {
  const result = await runner.execute<EvaluateResult>(key, expr);
  return result.bodies;
}
// Bad — returns unknown[]; every caller writes `bodies[i] as Record<string, unknown>`

// Good — cast per call site
const bodies = await Promise.all(chunks.map((records) =>
  evaluateTemplate(template, { records, connection }) as Promise<Record<string, unknown>>));
// Bad — `(await Promise.all(...)) as Record<string, unknown>[]`
```

## Prefer `unknown` Over `any` for Generic Containers

```ts
private pendingCreations = new Map<string, Promise<unknown>>(); // Good — narrow with `as T` at use
private cache = new Map<string, any>();                         // Bad
```

## Use `.finally()` for Shared Cleanup in Promise Chains

```ts
// Good
pending = this.createEntry()
  .then((entry) => { this.cache.set(cacheKey, entry); return entry; })
  .finally(() => { this.pendingCreations.delete(cacheKey); });
// Bad — the same delete in both .then() and .catch()
```

## No Bare `as string` Over a Dot-Path Value

`get(message, path)` returns `any`; `as string` asserts what nothing checked. A number reaches an
API expecting a string, or an unresolved path becomes `undefined`, is stripped by
`removeUndefinedAndNullValues`, and a **required** field silently goes missing.

```ts
// Good — validate, stringify, fail loudly
const raw = get(message, mapping.deduplicationKey);
if (isPresent(raw) && !['string', 'number', 'boolean'].includes(typeof raw)) {
  throw new InstrumentationError(`deduplicationKey "${mapping.deduplicationKey}" is not a scalar`);
}
const id = isPresent(raw) ? String(raw) : message.messageId;

// Bad
const id = (get(message, mapping.deduplicationKey) ?? message.messageId) as string;
```
