---
name: deprecate-processor-transform
description: Remove a destination's deprecated `process` (processor) transform and migrate its processor test coverage to the router suite, making the destination router-only. Use when asked to "remove process", "make a destination router-only", or "port processor tests to router".
argument-hint: <destination-folder-name>
---

# Deprecate the Processor Transform (port processor → router)

Make a destination router-only: remove `process` and port only the coverage the router suite
lacks. Audit empirically per destination — neither 1:1-port everything nor assume it's covered.

**Migrate first, remove last.** Add and verify router coverage while the processor suite is still
green, then remove `process` and its tests — coverage never lapses, and you read processor
fixtures directly instead of via `git show`.

## Preconditions

- **`src/features.ts` has `<DEST_UPPER>: { routerTransform: true, ... }`**
  (`grep -n "<DEST_UPPER>: {" src/features.ts`). rudder-server uses it to route via
  `/routerTransform`, never `POST /v0/destinations/<dest>` — that's what makes removal safe. If
  missing, STOP and add it first (update `src/features.test.ts` if it snapshots capabilities).
- `process` is deprecated (e.g. `// deprecated - using routerTransform`).
- `processRouterDest` shares `process`'s per-event logic — read the transform; anything only
  `process` does must move first.
- Confirm the processor route becoming unsupported for this destination is intended.

## Step 1 — Audit the processor suite (still present)

**Capture a coverage baseline before any change** with a temp scoped config (the global threshold
would false-fail on a subset):

```js
// jest.<dest>cov.js (temporary, repo root — delete when done)
const base = require('./jest.config.typescript.js');
module.exports = { ...base, collectCoverage: true,
  collectCoverageFrom: ['src/v0/destinations/<dest>/**/*.{ts,js}'],
  coverageThreshold: {}, coverageReporters: ['text'] };
```

```bash
NODE_OPTIONS='--no-node-snapshot' npx jest -c jest.<dest>cov.js component --destination=<dest> | tee /tmp/<dest>-cov-before.txt
```

**Count by output** — `grep -c "feature: 'processor'"` double-counts (error `statTags` carry it too):

```bash
f=test/integrations/destinations/<dest>/processor/data.ts
grep -c "statusCode: 200" $f   # success items
grep -c "statusCode: 400" $f   # error items
```

**Success coverage.** Router output is batched, so a literal diff understates coverage. Run each
processor success input through `processRouterDest` and check it returns 200 with an
endpoint/output already exercised by router fixtures. If the destination picks create/update/upsert
via a lookup, mock the lookup so update/upsert branches resolve. Port only what's uncovered.
Endpoint match is necessary but not sufficient (the same endpoint can come from different code,
e.g. event-stream lookup vs RETL batch) — the coverage diff in Final verification is authoritative.

**Error coverage.** Diff distinct messages:

```bash
grep -oE "error:\s*'[^']*'" $f | sort -u
grep -rhoE "error:\s*'[^']*'" test/integrations/destinations/<dest>/router/*.ts | sort -u
```

Keep leftovers reachable via the router with a still-supported auth/config mode. Skip
deprecated-auth-only errors, already-covered messages, and edges you can't reproduce exactly
(note them; never embed an unverified expectation).

## Step 2 — Add the router gap-fill cases, then verify

Add cases directly to `router/data.ts` under a short section comment, built from small local
factories (`errCase`/`successCase`). No intent-named fixture files (`coverageData.ts`,
`eventStreamData.ts`) — they proliferate and their labels go stale. **Generate every expected
output from the real transform** (see below) and apply both gotchas. Then both suites must be green:

```bash
npm run test:ts -- component --destination=<dest>
```

## Step 3 — Remove `process` from the transformer

In `src/v0/destinations/<dest>/transform.{ts,js}`:

1. Delete `process`; export becomes `export { processRouterDest }`.
2. Before deleting an import, count its uses — keep anything `processRouterDest` or shared helpers use.
3. `grep -rn "destinations/<dest>/transform" src/ test/ | grep -i process` → expect none.
4. Remove everything orphaned by *this* removal: note every helper/const/import/type `process`
   referenced, grep each across `src/` and `test/` afterwards, delete those referenced only by
   their own definition (and imports they solely used). Run `eslint` on changed files. Verify
   each; leave pre-existing dead code alone.

`nativeIntegration.ts` calls `destHandler.process` only on the processor route being dropped.

## Step 4 — Delete the processor test data, then re-verify

Remove `processor/data.ts` and the empty `processor/` dir, then:

```bash
npm run test:ts -- component --destination=<dest>
npm test -- --testPathPattern="<dest>" --no-coverage
npm run lint
```

## Running the transform to generate & verify outputs

**Never hand-write expected outputs.**

- **Add the case, read the diff** — placeholder output, run the component suite, paste Jest's
  received value, repeat until green.
- **Drive it directly** — throwaway test under `npm run test:ts`: build
  `[{ message, destination: { ID, Config, Enabled }, metadata }]`, call
  `processRouterDest(input, {})` with pre-validation HTTP mocked (gotcha 1), read `out[0]`.
- **Pick credentials that reuse existing mocks.** Suites often key lookup mocks by token/apiKey
  (A → empty search → create; B → one hit → update; C → many → abort; "fail" → 5xx). Read
  `network.ts` and choose the credential instead of writing a mock.
- **Batch-generate, then confirm against the suite.** A script replicating the token→response map
  can print many outputs at once; treat them as drafts — the real suite (actual `network.ts`,
  `onNoMatch: 'throwException'`) is the source of truth.
- **Success reconfirmation (Step 1):** import the still-present processor `data` and drive each
  success input. If already deleted, restore to a temp file beside the fixtures via
  `git show HEAD:.../processor/data.ts` so relative imports resolve.

## Two gotchas when writing expected outputs

**1. The router may fetch metadata before per-event validation** (object properties, record
search). Unmocked, the case fails with a network error instead of the intended validation error.
Add the mock to `network.ts` (auto-registered for the suite) rather than per-case `mockFns`, scoped to the destination's actual auth (header,
`hapikey`/apiKey param, Basic) — not a header-less catch-all:

```ts
{ httpReq: { url: '<lookup-url>', method: 'GET', headers: { Authorization: 'Bearer <token>' } }, // or params: { hapikey }
  httpRes: { status: 200, data: { /* minimal */ } } },
```

- Add entries only for endpoint/credential combos actually lacking a mock; often one suffices.
- **An empty object still counts as present.** `properties: {}`/`traits: {}` usually trips the
  fetch gate; *omit* the field for config/validation cases that must abort before HTTP (e.g.
  "API Key not found"), or the fetch runs first and 5xxs. Confirm no HTTP was attempted.
- Don't duplicate a pre-existing header-less mock with a token-scoped one: `axios-mock-adapter` /
  `registerAxiosMocks` are first-match in registration order and `network.ts` registers first, so yours would be dead.

**2. Error `statTags` are enriched by the route.** Raw `processRouterDest` errors carry only
`{ errorCategory, errorType }`; `handleRouterTransformSuccessEvents` adds the rest, and the
component test asserts all six:

```ts
statTags: { destType: '<DEST_UPPER>', errorCategory: '<category>', errorType,
  feature: 'router', implementation: 'native', module: 'destination' },
```

Success outputs are *not* enriched, so raw-transform verification works for them but not for
errors. Always confirm errors against the full component suite (`onNoMatch: 'throwException'` —
green means every request matched), and confirm pre-existing mock-dependent cases (e.g. "lookup
call failed") aren't shadowed by your mock.

## Final verification

```bash
npm run test:ts -- component --destination=<dest>   # --verbose lists cases; also catches fixture TS errors
```

**Coverage must not regress.** A path covered only by a processor case loses its only test —
the gap endpoint-matching can't catch. Re-run the scoped config and diff against the baseline,
especially `Uncovered Line #s`:

```bash
NODE_OPTIONS='--no-node-snapshot' npx jest -c jest.<dest>cov.js component --destination=<dest> | tee /tmp/<dest>-cov-after.txt
diff /tmp/<dest>-cov-before.txt /tmp/<dest>-cov-after.txt
```

For each drop, find the function, add a router case driving it (mocking any lookup in
`network.ts`), and re-run until coverage matches or beats the baseline. A drop means add a test,
never lower the bar. Delete `jest.<dest>cov.js`.

Checklist before the PR:

- [ ] `process` gone: `grep -nE "const process|function process|\bprocess\b" src/v0/destinations/<dest>/transform.*`; export is `export { processRouterDest }`.
- [ ] No orphaned helpers/constants/imports/types (zero references, definitions deleted).
- [ ] `src/features.ts` still has `<DEST_UPPER>: { routerTransform: true }`.
- [ ] `processor/` gone; new cases in `router/data.ts`, grouped and factory-built.
- [ ] `npx tsc --noEmit -p tsconfig.json` clean; `npm run lint` clean.
- [ ] Component suite green, including pre-existing lookup-failure cases.
- [ ] `npm test -- --testPathPattern="<dest>" --no-coverage` green.
- [ ] Coverage ≥ baseline.
- [ ] New error fixtures carry all six `statTags` keys.
- [ ] `git diff --stat` touches only `transform.ts`/`types.ts`, `router/*`, `network.ts`, the deleted `processor/data.ts`, and (if needed) `src/features.ts`.
