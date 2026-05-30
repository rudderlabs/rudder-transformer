# Mistakes & Lessons Learned

> Record mistakes made during development and how to avoid them.
> This file is append-only - agents add discoveries, never delete.
>
> Format: Describe what went wrong, why, and how to avoid it next time.

(Add mistakes and lessons as you encounter them)

## wrapBody closure trap

**What happened:** Agent wrote a single `getBatchStrategy()` that returns the same `ChunkBatchStrategy` instance for all groups, with `wrapBody` trying to branch on the endpoint at call time. But `wrapBody(bodies: TBody[])` receives ONLY the bodies array — no endpoint, no group key is passed.

**Why:** `ChunkBatchStrategy.wrapBody` is called by the framework with only the body array. Any state (listId, isSubscribe) that wrapBody needs must come from a closure.

**Prevention:** Read `chunkBatchStrategy.ts` — the `wrapBody` signature is `(bodies: TBody[]) => Record<string, unknown>`. No other args. If you see wrapBody trying to access endpoint from a parameter, it's wrong.

**Fix:** Instantiate a fresh `ChunkBatchStrategy` per call to `getBatchStrategy(endpoint)`, capturing `listId` and the subscribe/unsubscribe branch from the endpoint string in the closure:
```typescript
getBatchStrategy(endpoint: string) {
  const { listId } = this.connection\!.config.destination;
  const isSubscribe = endpoint.endsWith('/api/lists/subscribe');
  return new ChunkBatchStrategy({ maxItems: MAX_BATCH_SIZE, wrapBody: (bodies) => isSubscribe ? buildSubscribeBody(listId, ...) : buildUnsubscribeBody(listId, ...) });
}
```

## Missing isHashRequired in processAudienceRecord call

**What happened:** Agent called `processAudienceRecord(record, { fieldConfigs, destination: { workspaceId, id, type } })` without the `config: { isHashRequired }` field. The function destructures this at lines 48-56 and throws a runtime error.

**Why:** `AudienceDestination` interface requires `config: { isHashRequired: boolean }`. The destructure is unconditional.

**Prevention:** Always include `config: { isHashRequired: false }` in the destination argument — even when hashing is irrelevant (all fields are HashingType.NONE). The value is never read when no field is hashable, but the key must be present.

**Fix:**
```typescript
destination: {
  workspaceId: metadata.workspaceId,
  id: destination.ID,
  type: DESTINATION_TYPE,
  config: { isHashRequired: false },  // required by audienceUtils.ts:48-56 destructure
}
```

## batchedDestinationsMap not updated

**What happened:** Destination code written and working locally but the destination never invoked through the router path — falls back to legacy router pipeline silently.

**Why:** `getBatchDestinationHandler` in `misc.ts` is only called after `isBatchingFrameworkEnabled()` returns true, which requires `batchedDestinationsMap[dest] === true`.

**Prevention:** Immediately after creating routerTransform.ts, add `ITERABLE_AUDIENCE: true` to `src/constants/batchedDestinationsMap.ts`. Without this entry the BatchDestination class is never instantiated by the router.

## Incorrect datacenter key translation

**What happened:** Agent passed account-level `dataCenter` value (`'US'` or `'EU'`) directly to `constructEndpoint()` which expects `'USDC'` or `'EUDC'`.

**Why:** The account config uses simpler labels (`US`/`EU`); `constructEndpoint` was written for the existing iterable destination which uses full datacenter keys.

**Prevention:** Always translate at the call site: `const DATA_CENTER_TO_BASE_KEY = { US: 'USDC', EU: 'EUDC' } as const;`

## UserForgotten classified as 400

**What happened:** Agent passed `forgottenEmails`/`forgottenUserIds` through `createBatchErrorChecker` without short-circuiting, resulting in 400 status for GDPR-forgotten users.

**Why:** `createBatchErrorChecker` returns `isAbortable: true` for forgotten paths (they are in ITERABLE_RESPONSE_*_PATHS). Without a pre-check, these become 400 errors.

**Prevention:** In AudienceListStrategy.handleSuccess, check the forgotten paths BEFORE calling `checkEventError`. The forgotten lookup must run first:
```typescript
if (forgottenLookup.has(identifier)) {
  // emit metric, return 200
} else if (isUnsubscribe && notFoundLookup.has(identifier)) {
  // return 200
} else {
  // checkEventError(subscriber) → isAbortable → 400
}
```

**Fix:** Build a separate `forgottenLookup` Set from `response.failedUpdates.forgottenEmails` and `forgottenUserIds`, then check it first.

## Test runner glob mismatch (test:js vs npm test for TypeScript)

**What happened:** Signal acceptance criterion used `npm run test:js -- --testPathPattern iterable_audience` which exits 1 with "No tests found" for any TypeScript destination.

**Why:** `jest.default.config.js` (used by `test:js`) only globs `**/*.test.[j]s` — no `.ts` extension. `iterable_audience` tests are TypeScript. The correct command is `npm test` (uses `jest.config.js` which matches both `.ts` and `.js`).

**Prevention:** Before adding an acceptance criterion that runs tests, verify the test runner's `testMatch` or `testPathPattern` glob covers the file extensions of the destination's tests. `test:js` → JS only; `npm test` → both.

**Fix:** Use `npm test -- --testPathPattern="iterable_audience" --no-coverage --forceExit --runInBand` for TypeScript destination unit tests.

## identifierMappings field naming — LLD vs codebase convention

**What happened:** The LLD/spec used `{ iterableField, warehouseColumn }` for identifierMappings entries. The codebase convention (from `customerio_audience`, `custom_audience`) is `{ from: warehouseColumn, to: destinationField }`.

**Why:** The spec was written independently of the codebase; the canonical shape is the `CustomMapping` convention used across audience destinations.

**Prevention:** When the LLD specifies a field mapping shape, check adjacent audience destinations first (`customerio_audience/types.ts`, `custom_audience/types.ts`). If they use `{ from, to }`, prefer that and note the conflict.

**Fix:** Use `{ from: string; to: 'email' | 'userId' }` — `from` is the source warehouse column, `to` is the Iterable field name.

## Relative import path depth wrong in spec

**What happened:** Spec gave relative paths with incorrect `../` depth for strategy files under `v1/destinations/iterable_audience/strategies/`. A file 4 levels deep below `src/` needs 4 `../` hops to reach `src/`, not 3.

**Why:** Counting relative path hops is error-prone when directory nesting was not explicitly verified.

**Prevention:** Count directory components from the file's location to the target before trusting any relative path from a spec. Formula: `levels_deep - 1` = number of `../` hops needed from the file to `src/`.

**Fix:** Verify import paths compile (`npx tsc --noEmit`) before committing.

## eslint no-continue blocks continue statements

**What happened:** Agent wrote `for` loop body with `continue` to skip iterations. eslint rule `no-continue` fails the lint check.

**Why:** The project's eslint config prohibits `continue` statements.

**Prevention:** Invert the condition. Replace `if (cond) continue; doX();` with `if (\!cond) { doX(); }`.

**Fix:** Refactor any `continue`-based loop body to use inverted-if or early-return pattern.

## prettier reformats knowledge files during lint

**What happened:** `npm run lint` (which calls `prettier --write .`) scanned `doc/loom/knowledge/*.md` and reformatted them — adding blank lines before code fences, escaping underscores in backtick blocks.

**Why:** Knowledge files are not in `.prettierignore`.

**Prevention:** Before committing after running lint, run `git diff doc/loom/knowledge/` to check for spurious prettier changes. If found, revert: `git checkout -- doc/loom/knowledge/`

**Fix (permanent):** Add `doc/loom/knowledge/` to `.prettierignore`.
