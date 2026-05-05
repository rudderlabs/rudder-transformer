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
