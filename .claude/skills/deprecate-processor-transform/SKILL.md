---
name: deprecate-processor-transform
description: Remove a destination's deprecated `process` (processor) transform and migrate its processor test coverage to the router suite, making the destination router-only. Use when asked to "remove process", "make a destination router-only", or "port processor tests to router".
argument-hint: <destination-folder-name>
---

# Deprecate the Processor Transform (port processor → router)

**Objective:** Make a destination router-only by removing its deprecated `process`
entry point and migrating any coverage the router test suite does not already provide.
Determine what's already covered empirically, per destination — don't blindly 1:1-port
every processor case, and don't assume everything is already covered either. The split
between "already covered" and "needs porting" varies by destination; audit it, don't
presume it.

**Order of operations — migrate first, remove last.** Add and verify the router
coverage while the processor suite is still present and green, THEN remove `process`
and delete the processor tests. This keeps coverage from ever lapsing, gives two
independently-verified checkpoints, and lets you read the processor fixtures directly
during the audit instead of `git show`-ing a deleted file.

## Preconditions

- **`src/features.ts` declares the destination as a router transformer.** Confirm
  `destinationCapabilities[<DEST_UPPER>]` includes `routerTransform: true`:

  ```bash
  grep -n "<DEST_UPPER>: {" src/features.ts   # expect: routerTransform: true
  ```

  This capability is served to rudder-server, which uses it to route the destination
  through `/routerTransform` and NEVER the processor route
  (`POST /v0/destinations/<dest>`). It is the guarantee that makes removing `process`
  safe. If the entry is missing or lacks `routerTransform: true`, STOP — add it first
  (and update `src/features.test.ts` if it snapshots the capability list); otherwise
  removing `process` breaks the destination in production.
- The destination's `process` is deprecated and production drives it via
  `routerTransform` (look for a comment like `// deprecated - using routerTransform`).
- `processRouterDest` runs the same per-event transform logic `process` did (they
  share a per-event helper), so removing `process` loses no transform behaviour. Confirm
  this by reading the transform — if `process` does something `processRouterDest` does
  not, that logic must move first.

Removing `process` makes the processor route (`POST /v0/destinations/<dest>`)
unsupported for this destination. Confirm that is intended before proceeding.

## Step 1 — Audit the processor suite (still present)

**Count correctly.** Do NOT trust `grep -c "feature: 'processor'"` — error cases also
carry `feature: 'processor'` inside `statTags`, so it double-counts. Count by output on
the still-present file:

```bash
f=test/integrations/destinations/<dest>/processor/data.ts
grep -c "statusCode: 200" $f   # success output items
grep -c "statusCode: 400" $f   # error output items
```

**Check success-transform coverage before porting.** Because the router batches,
a processor's single-event shape (one HTTP request per event) will not reappear
verbatim — the equivalent behaviour surfaces as batched router output — so a literal
diff understates coverage. Determine coverage empirically: run each processor success
input through `processRouterDest` (see "Running the transform") and check it returns
`statusCode: 200` and an endpoint/output already exercised by the destination's router
fixtures (`router/data.ts` and any siblings). If the destination chooses create vs
update vs upsert by looking up existing records, mock that lookup so the update/upsert
branches resolve — otherwise every record looks new and you only ever see the create
endpoint. Port any success behaviour the router suite does NOT already cover; skip the
ones it does. Don't assume the answer either way — some destinations will need router
success cases added, others none.

**Find the error/validation behaviours the router suite doesn't already cover.**
Compare the distinct processor error messages against the router ones:

```bash
grep -oE "error:\s*'[^']*'" $f | sort -u
grep -rhoE "error:\s*'[^']*'" test/integrations/destinations/<dest>/router/*.ts | sort -u
```

Keep only leftovers reachable via the router path with an auth/config mode the
destination still supports. Explicitly skip: deprecated-auth-only errors (if that auth
is out of scope), already-covered messages (dedupe against the router grep), and niche
config/input-shaped edges you cannot reproduce exactly (note them; never embed an
unverified expectation).

## Step 2 — Add the router gap-fill cases, then verify

Put the new error cases in a dedicated file (e.g. `router/errorValidationData.ts`)
built by a small factory, and spread it into `router/data.ts`'s exported array.
**Generate every expected output by running the real transform** (see "Running the
transform") — never hand-write message text or shape. Apply the two gotchas below
(network.ts mock; enriched `statTags`).

Verify with the full component suite — at this point BOTH the processor suite and the
new router cases must be green:

```bash
npm run test:ts -- component --destination=<dest>
```

## Step 3 — Remove `process` from the transformer

In `src/v0/destinations/<dest>/transform.{ts,js}`:

1. Delete the `process` function.
2. Drop it from the export: `export { process, processRouterDest }` -> `export { processRouterDest }`.
3. Before deleting any import, grep its usage count in the file — a symbol still
   referenced by `processRouterDest` (or the shared batch/per-event helpers) must stay;
   only drop imports whose sole use was `process` (commonly a processor-only request
   type).
4. Confirm nothing else imports it:
   `grep -rn "destinations/<dest>/transform" src/ test/ | grep -i process` -> expect none.

`nativeIntegration.ts` calls `destHandler.process` only on the processor route, so a
missing `process` is a runtime concern only for that route, which we are dropping.

## Step 4 — Delete the processor test data, then re-verify

Remove `test/integrations/destinations/<dest>/processor/data.ts` (and the now-empty
`processor/` dir). Re-run the checks — everything must still be green with the processor
suite gone:

```bash
npm run test:ts -- component --destination=<dest>
npm test -- --testPathPattern="<dest>" --no-coverage
npm run lint
```

Then follow the repo's standard post-change checks in `CLAUDE.md`.

## Running the transform to generate & verify outputs

**Never hand-write expected outputs — generate them by running the real transform.**

Two easy ways, both using the repo's normal test tooling:

- **Add the case, read the diff.** Add the new case with a placeholder output and run
  the component suite (`npm run test:ts -- component --destination=<dest>`). Jest prints
  the received value in the assertion diff — paste that into the fixture and re-run
  until green.
- **Drive the transform directly.** In a throwaway test run under the repo's TS jest
  config (`npm run test:ts`), import `processRouterDest`, build
  `[{ message, destination: { ID, Config, Enabled }, metadata }]`, call
  `processRouterDest(input, {})` with any pre-validation HTTP calls mocked (gotcha #1),
  and read `out[0]`.
- **Reconfirm success (Step 1):** the processor file is still present — import its
  `data` directly and drive each success input through `processRouterDest`. (If it were
  already deleted, restore it to a temp file next to the fixtures via
  `git show HEAD:.../processor/data.ts` so relative imports resolve, then remove it.)

## Two gotchas when writing expected outputs

**1. The router may fetch metadata BEFORE per-event validation.** Some destinations
issue a lookup/metadata call (e.g. fetching object properties, or searching for an
existing record) at the start of the router transform, before per-event validation
runs. In tests that HTTP call must be mocked or the case fails with a network error
instead of the intended validation error. Add the mock to the destination's
`test/integrations/destinations/<dest>/network.ts` (auto-registered for the whole
suite) rather than per-case `mockFns`, scoped to the exact request your cases produce —
match on whatever the destination authenticates with (an `Authorization` header, a
`hapikey`/apiKey query param, Basic auth, etc.), not a header-less catch-all:

```ts
// appended to networkCallsData in network.ts
{
  httpReq: {
    url: '<the-lookup-endpoint-url>',
    method: 'GET', // or POST for a search endpoint
    // match the destination's actual auth, e.g.:
    headers: { Authorization: 'Bearer <token>' }, // or params: { hapikey: '<key>' }
  },
  httpRes: { status: 200, data: { /* empty/minimal response */ } },
},
```

- Add an entry ONLY for the endpoint/credential combos that actually lack a mock — not
  one blanket entry. Different message types / code paths can hit different lookup
  endpoints, and some cases fetch nothing at all. The minimal fix is often a single new
  entry, with the rest served by pre-existing shared mocks.
- Do NOT add a token-scoped entry that duplicates a pre-existing header-less mock for
  the same URL. `axios-mock-adapter` / `registerAxiosMocks` use first-match in
  registration order, and network.ts entries register before per-case ones — a broad
  header-less entry registered earlier always wins, leaving your specific duplicate
  dead and misleading. Reuse the shared mock instead.

**2. Error `statTags` are enriched by the route.** Raw `processRouterDest` output for
an error carries only `{ errorCategory, errorType }`, but the full route
(`handleRouterTransformSuccessEvents`) adds `destType`, `feature: 'router'`,
`implementation: 'native'` (native destinations — the only kind with a `process` to
remove), `module: 'destination'`. The component test asserts the enriched form, so
expected `statTags` MUST include all six keys:

```ts
statTags: {
  destType: '<DEST_UPPER>',
  errorCategory: '<category>',   // e.g. 'dataValidation'
  errorType,                     // e.g. 'configuration' | 'instrumentation'
  feature: 'router',
  implementation: 'native',
  module: 'destination',
},
```

This is the subtle one: **success** outputs are NOT enriched (route post-processing is
a no-op for them), so verifying success against raw `processRouterDest` is fine — but
**error** outputs ARE enriched, which is why raw-transform verification of error cases
passes locally yet the component test fails on missing `statTags`. Always confirm error
cases against the full component suite (which runs with `onNoMatch: 'throwException'`,
so a green run also proves every request was genuinely matched — nothing passes by
accident), not just the raw transform. Also confirm pre-existing cases that rely on a
specific mock (e.g. a "lookup call failed" test) still pass — your token-scoped mock
must not shadow them.
