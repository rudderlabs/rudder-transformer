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
