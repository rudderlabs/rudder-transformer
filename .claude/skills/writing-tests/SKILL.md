---
name: writing-tests
description: Conventions to follow when writing or modifying tests in this repo. Applied automatically — not user-invocable.
---

# Test Writing Conventions

## Error Matchers

Never `/.+/` or other catch-alls. Run the code and match a distinctive substring of the real
message: `errorMatch: /Unexpected token/`.

## No Redundant If-Guards After Assertions

`expect(...).toBe(true)` already throws; narrow with `'field' in result &&` instead of `if`.

```ts
expect(result.valid).toBe(true);
expect('recordFields' in result && result.recordFields.sort()).toEqual(expected); // Good
// Bad — if (result.valid) { expect(result.recordFields.sort()).toEqual(expected); }
```

## Table-Driven Tests With `it.each()`

Two or more cases with the same assertion shape → one `it.each()` table; one table per shape. Keep
the data arrays at the top of the `describe`.

```ts
const validCases = [
  { name: 'objects', template: '$.records.({ "e": .email })', expectedFields: ['email'] },
  { name: 'arrays', template: '$.records.([.email, .phone])', expectedFields: ['email', 'phone'] },
];
const invalidCases = [
  { name: 'spread operator', template: '{ ...$.records }', errorMatch: /spread_expr/ },
  { name: 'bare identifier', template: 'process', errorMatch: /Bare identifiers/ },
];
it.each(validCases)('should accept: $name', ({ template, expectedFields }) => { /* … */ });
it.each(invalidCases)('should reject: $name', ({ template, errorMatch }) => { /* … */ });
// Bad — one it() per case with identical assertions
```

## Test Depth Should Match Logic Ownership

Exhaustively test what the layer owns (e.g. every invalid request shape a controller's Zod schema
rejects); for behavior delegated to a separately-tested module, one success and one failure case
suffice. A controller test must not re-test every template-validation scenario
`templateValidator.test.ts` covers.

## Test File Location and Naming

1:1 with the source file name. Use an existing `__tests__/` at that level
(`src/controllers/__tests__/eventTest.test.ts`); otherwise co-locate
(`src/v0/destinations/custom_audience/templateValidator.test.ts`).

## Consistent Test Data Scoping

All data arrays in a `describe` live at the same scope — all inside or all outside.

## Component Test Fixtures Live in `common.ts`

Reusable destination/connection/override fixtures for `test/integrations/destinations/<dest>/` —
including per-scenario variants — go in `common.ts`, imported by `router/data.ts` etc., never
declared at the top of `data.ts`.

```ts
// common.ts
export const connection = { /* … */ };
export const hashRequiredConnection = {
  ...connection,
  config: { destination: { ...connection.config.destination, isHashRequired: true } },
};
// router/data.ts
import { destination, connection, hashRequiredConnection } from '../common';
```

## Component Test Entries Are Plain Object Literals

Each `data` entry in `{router,processor}/data.ts` is a plain object. Don't wrap one in an IIFE to
lift local consts — hoist them to `common.ts` (or the top of the file if truly local).

## Compute Hashed Expected Values via the Hash Function

`{ email: sha256('a@b.com') }` (`import sha256 from 'sha256'`), never a pasted hex string — it
stays in sync with input edits and reviewers can read it.

## Assert Whole Response Objects, Not Individual Fields

`expect(result).toEqual({ users: [...], errors: [], metadata: { total: 1 } })` — shows the full
shape and catches unexpected fields, unlike per-field `expect(result.users)…`.

## Mock Leaf Dependencies, Not Intermediate Modules

Use the real module; mock only leaves (logger, stats). Stub a whole module only if using it makes
the test significantly more complex.

```ts
// Good — real DisposableCache
jest.mock('../../../../logger', () => ({ info: jest.fn(), debug: jest.fn(), warn: jest.fn(), error: jest.fn() }));
jest.mock('../../../../util/stats', () => ({ increment: jest.fn(), gauge: jest.fn() }));
import { IvmScriptRunner } from './ivmScriptRunner';
// Bad — jest.mock('../../../../util/ivmCache/index', () => class MockCache { /* Map-backed get/set/delete */ })
```

## Network Mocks Are Captured, Not Invented

`network.ts` entries are **real partner responses** — from a live call or the partner's published
API reference. An invented envelope tests your guess, and delivery code inherits it. An empty
`networkMocks` in a new destination means `dataDelivery` asserts nothing.

Cover at minimum: **success**; a **validation failure** (ideally *partial* — some records rejected
in a well-formed request, which drives per-item verdicts and `dontBatch`); **auth/config failures**
— invalid API key (401), invalid account/pixel id, missing required query param.

Mock **shape variants within one envelope** — e.g. `{ error: { message, type, param, code, errors[] } }`
for validation vs `param`/`code` null with no `errors[]` for auth are two formatter paths.

Both halves of a request–response pair must be real:

- **The request must be one the partner rejects** — replay it live; a 2xx means the mock is fiction.
- **Copy the body exactly, including empty** — `202` with no body is `data: ''`, not
  `{ status: 'accepted' }` (which skips the empty-body branch).
- **Don't mock a status the partner never returns** (`200` from a `202`-only partner; an
  all-failed `2xx` from one that sends `400`).
- **Docs vs live disagree → live wins.**

## Every New Destination Gets `live.ts`

Ship `test/integrations/destinations/<dest>/live.ts` with at least one positive scenario per
supported event shape. Mocked component tests can't catch a payload the partner rejects (endpoint
typo, renamed field, missing required parameter). Harness and credentials: `live-integration-test` skill.
