---
name: writing-tests
description: Conventions to follow when writing or modifying tests in this repo. Applied automatically — not user-invocable.
---

# Test Writing Conventions

Follow these conventions when writing or modifying tests in this repo.

## Error Matchers

Never use `/.+/` or other catch-all patterns in test assertions. Run the code to find the actual error message and match on a distinctive substring.

```ts
// Good
errorMatch: /Unexpected token/;

// Bad
errorMatch: /.+/;
```

## No Redundant If-Guards After Assertions

`expect(result.valid).toBe(true)` already throws on failure — don't wrap the next assertion in `if (result.valid)`. Use `'field' in result && result.field` for TypeScript narrowing without a runtime branch.

```ts
// Good
expect(result.valid).toBe(true);
expect('recordFields' in result && result.recordFields.sort()).toEqual(expected);

// Bad
expect(result.valid).toBe(true);
if (result.valid) {
  expect(result.recordFields.sort()).toEqual(expected);
}
```

## Table-Driven Tests With `it.each()`

When two or more test cases share the same assertion structure, group them into an `it.each()` data table. When a describe block has cases with different assertion shapes, use one `it.each()` per shape. Keep test data arrays at the top of the describe block for easy scanning.

```ts
// Good — cases grouped by assertion shape, each group gets its own it.each()
const validCases = [
  { name: 'objects', template: '$.records.({ "e": .email })', expectedFields: ['email'] },
  { name: 'arrays', template: '$.records.([.email, .phone])', expectedFields: ['email', 'phone'] },
];

const invalidCases = [
  { name: 'spread operator', template: '{ ...$.records }', errorMatch: /spread_expr/ },
  { name: 'bare identifier', template: 'process', errorMatch: /Bare identifiers/ },
];

it.each(validCases)('should accept: $name', ({ template, expectedFields }) => { ... });
it.each(invalidCases)('should reject: $name', ({ template, errorMatch }) => { ... });

// Bad — individual blocks with identical assertion structure
it('should reject spread operator', () => {
  const result = validateTemplate('{ ...$.records }');
  expect(result.valid).toBe(false);
  expect(result.errors?.[0]).toMatch(/spread_expr/);
});

it('should reject variable declarations', () => {
  const result = validateTemplate('let x = 1');
  expect(result.valid).toBe(false);
  expect(result.errors?.[0]).toMatch(/definition_expr/);
});
```

## Test Depth Should Match Logic Ownership

Thoroughly test the logic a layer owns (e.g., input validation in a controller — cover all invalid shapes). For success/failure paths delegated to another module that has its own tests, one representative case each is enough.

```ts
// Good — controller owns Zod validation, so test all 400 shapes;
// one valid + one invalid template case since templateValidator.test.ts covers the rest
const badRequestCases = [
  { name: 'missing field', body: {}, expectedError: 'requestBody: Required' },
  { name: 'empty string', body: { requestBody: '' }, expectedError: '...' },
  { name: 'wrong type', body: { requestBody: 123 }, expectedError: '...' },
];

it.each(badRequestCases)('should return 400: $name', async ({ body, expectedError }) => { ... });

it('should return valid=true for a valid template', async () => { ... });
it('should return valid=false for an invalid template', async () => { ... });

// Bad — controller test re-tests every template validation scenario
// that templateValidator.test.ts already covers
it('should reject spread operator', ...);
it('should reject bare identifiers', ...);
it('should reject bracket notation', ...);
```

## Test File Location and Naming

Test files use 1:1 name mapping to the source file. If a `__tests__/` directory already exists at that level, place the test there. Otherwise, co-locate it alongside the source file.

```
# If __tests__/ exists
src/controllers/__tests__/eventTest.test.ts

# If no __tests__/ directory
src/v0/destinations/custom_audience/templateValidator.test.ts
```

## Consistent Test Data Scoping

All test data arrays within a `describe` block should live at the same scope — either all inside or all outside. Don't mix.

## Component Test Fixtures Live in `common.ts`

Reusable destination, connection, and override fixtures for component tests under `test/integrations/destinations/<destination>/` go in `common.ts` and are imported by `router/data.ts`, `processor/data.ts`, etc. Don't define them inline at the top of `data.ts`. This includes per-scenario variants (e.g., a destination override that changes a single action's `requestBody`, or a connection variant with `isHashRequired: true`).

```ts
// Good — variants exported from common.ts alongside the base fixtures
// common.ts
export const destination = { /* ... */ };
export const connection = { /* ... */ };
export const hashRequiredConnection = {
  ...connection,
  config: { destination: { ...connection.config.destination, isHashRequired: true } },
};

// router/data.ts
import { destination, connection, hashRequiredConnection } from '../common';
export const data = [
  { /* ... */, connection: hashRequiredConnection },
];

// Bad — variants declared at the top of router/data.ts
const hashRequiredConnection = { /* ... */ };  // belongs in common.ts
```

## Component Test Entries Are Plain Object Literals

Each entry in the exported `data` array of `test/integrations/destinations/<destination>/{router,processor}/data.ts` is a plain object literal. Don't wrap an entry in an IIFE just to lift local consts — hoist those to top-level constants in `common.ts` (or near the top of the file if truly local) instead.

```ts
// Good — plain object entries; overrides hoisted to common.ts or top of file
import { customMappingsDestination, customMappingsConnection } from '../common';

export const data = [
  {
    id: 'test-4',
    /* ... */,
    input: { /* uses customMappingsDestination, customMappingsConnection */ },
  },
];

// Bad — IIFE inside the array breaks the file's pattern
export const data = [
  (() => {
    const customMappingsDestination = { /* ... */ };
    const customMappingsConnection = { /* ... */ };
    return { id: 'test-4', /* ... */ };
  })(),
];
```

## Compute Hashed Expected Values via the Hash Function

When asserting on hashed identifiers in audience-destination tests, invoke the hash function in the test data (`sha256('a@b.com')`) instead of pasting a copied hex string. Generated values stay in sync with input edits and reviewers can scan inputs without decoding hex.

```ts
// Good
import sha256 from 'sha256';

users: [
  { email: sha256('a@b.com') },
  { email: sha256('c@d.com') },
],

// Bad — copied hex; rotting risk if the input email is ever changed
users: [
  { email: 'fb98d44ad7501a959f3f4f4a3f004fe2d9e581ea6207e218c4b02c08a4d75adf' },
  { email: '6a4d2afe9d4d6f5cb73d8e3e3a8fa8e5dc1d2a1f64d1b9e0c5b9b1c2d6e3f5a4' },
],
```

## Assert Whole Response Objects, Not Individual Fields

When testing a method that returns a structured response, assert the entire object with `toEqual` rather than picking individual fields. This catches unexpected extra fields and makes the expected shape explicit at a glance.

```ts
// Good — full response shape visible in one assertion
expect(result).toEqual({
  users: [{ id: 'u1', status: 'active' }],
  errors: [],
  metadata: { total: 1 },
});

// Bad — individual field assertions hide the overall shape
expect(result.users).toEqual([{ id: 'u1', status: 'active' }]);
expect(result.errors).toEqual([]);
expect(result.metadata).toEqual({ total: 1 });
```

## Mock Leaf Dependencies, Not Intermediate Modules

Prefer using the real module and mocking only its leaf dependencies (logger, stats) rather than replacing the whole module with a stub. Only mock the module itself if using it makes the test significantly more complex.

```ts
// Good — real DisposableCache, only leaf deps mocked
jest.mock('../../../../logger', () => ({
  info: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));
jest.mock('../../../../util/stats', () => ({
  increment: jest.fn(),
  gauge: jest.fn(),
}));

import { IvmScriptRunner } from './ivmScriptRunner'; // uses real DisposableCache

// Bad — entire intermediate module replaced with a stub
jest.mock('../../../../util/ivmCache/index', () => {
  return class MockCache {
    private store = new Map();
    get(key: string) {
      return this.store.get(key);
    }
    set(key: string, value: any) {
      this.store.set(key, value);
    }
    delete(key: string) {
      this.store.delete(key);
    }
  };
});
```
