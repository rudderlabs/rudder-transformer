# Plan: Iterable Audience Destination — M1 (transformer)

## Overview

Implement the data-plane transform layer for the new `iterable_audience` destination:

- **v0 transform layer** at `src/v0/destinations/iterable_audience/` using the `BatchDestination` framework path with a per-endpoint `ChunkBatchStrategy`.
- **v1 delivery layer** at `src/v1/destinations/iterable_audience/` with an `AudienceListStrategy` that reuses the existing `iterable/` destination's `BaseStrategy`, `createBatchErrorChecker`, `FailedUpdates` types, `BASE_URL`, and `constructEndpoint`.
- Add `ITERABLE_AUDIENCE: true` to `src/constants/batchedDestinationsMap.ts`.

This is one of four per-repo plans implementing the M1 design. The full design is in `doc/plans/iterable-audience-m1-lld.md` (LLD) and `doc/plans/iterable-audience-m1-scope.md` (scope), copied alongside this plan. The cross-repo roadmap is at `<workspace>/doc/plans/PLAN-iterable-audience-m1.md`. The other three per-repo plans live in `rudder-integrations-config`, `rudder-integrations-info`, and `rudder-webapp`. All four are independent.

## Goals

- Ship the M1 anchor design unchanged: mirror sync (INSERT/UPDATE → subscribe; DELETE → unsubscribe), identifier-only payload (no `dataFields`), `channelUnsubscribe: false` always explicit, UserForgotten returns `statusCode: 200` + emits `iterable_forgotten_user_violations` metric (identifier TYPE only, never the value).
- **Zero framework changes.** Use the standard `BatchDestination` framework path. Reuse the existing `iterable/` destination's strategy infrastructure for v1 delivery; reuse the shared `processAudienceRecord` utility (`HashingType.NONE`) for the identifier pipeline.
- Endpoint string is the group discriminator — do NOT set `internalGroupKey`.

## Execution Diagram

```mermaid
graph LR
    knowledge-bootstrap --> data-plane
    data-plane --> integration-verify
    integration-verify --> knowledge-distill
```

A single implementation stage `data-plane` runs three parallel subagents (v0 transform, v1 delivery, registry+integration tests) — files are disjoint, see ownership table in the stage description.

---

## Stages

### 1. Knowledge Bootstrap

**Purpose:** Capture reuse contracts from the existing `iterable/` destination (v0 + v1), confirm `BatchDestination` framework path and `ChunkBatchStrategy.wrapBody` signature, and document the `processAudienceRecord` utility contract.

**Tasks:** Parallel Explore subagents read existing `iterable/` v0 (`config.js`) and v1 (`strategies/base.ts`, `utils.ts`, `types.ts`), `custom_audience` BatchDestination reference, `customerio_audience` record-event semantics, `src/v0/util/audienceUtils.ts` (`processAudienceRecord`, `AudienceField`, `HashingType`), `src/v0/util/recordUtils.ts` (`EVENT_TYPES`), `src/services/destination/nativeBatching/chunkBatchStrategy.ts`, `src/services/misc.ts` (confirms the v0 path is hardcoded for `BatchDestination`), `src/constants/batchedDestinationsMap.ts`.

---

### 2. Data plane — v0 transform + v1 delivery

**Purpose:** Implement transform and delivery in one stage with three parallel subagents (no file overlap).

**Subagents:**

| Subagent | Files Owned (write) | Files Read-Only |
|---|---|---|
| A — v0 transform | `src/v0/destinations/iterable_audience/{config,types,utils,routerTransform}.ts` + `src/v0/destinations/iterable_audience/__tests__/{routerTransform,utils}.test.ts` | existing `iterable/` v0 config; `src/v0/util/audienceUtils.ts`; `src/v0/util/recordUtils.ts`; `custom_audience/routerTransform.ts`; `customerio_audience/transform.ts`; `chunkBatchStrategy.ts` |
| B — v1 delivery | `src/v1/destinations/iterable_audience/{networkHandler,types}.ts` + `src/v1/destinations/iterable_audience/strategies/audience-list.ts` + `src/v1/destinations/iterable_audience/__tests__/networkHandler.test.ts` | existing `iterable/` v1 (`strategies/base.ts`, `utils.ts`, `types.ts`); `src/v0/destinations/iterable/config.js` (`ITERABLE_RESPONSE_*_PATHS`, `BASE_URL`, `constructEndpoint`) |
| C — Registry + data-driven tests | `src/constants/batchedDestinationsMap.ts` (1-line add) + `test/integrations/destinations/iterable_audience/router/data.ts` + mocks | `src/constants/batchedDestinationsMap.ts` (read first); template data files in `custom_audience` / `customerio_audience` |

NO FILE OVERLAP. Subagent A's tests live under `src/v0/destinations/iterable_audience/__tests__/`; Subagent B's tests under `src/v1/destinations/iterable_audience/__tests__/`; Subagent C owns the constants edit and the `test/integrations/...` data fixture.

**Key constraints (from `doc/plans/iterable-audience-m1-lld.md` §4.2, §4.3):**

- Path locked to v0 because `MiscService.getBatchDestinationHandler` (`src/services/misc.ts:32-34`) hardcodes the v0 path for the BatchDestination loader.
- `IterableAudienceIntegration extends BatchDestination<IterableAudiencePayload, ..., IterableConnectionConfig>`. `transformEvent` returns a `TransformedEvent` whose `endpoint` is `getSubscribeEndpoint(dataCenter)` or `getUnsubscribeEndpoint(dataCenter)` — the endpoint string is the natural group discriminator; `internalGroupKey` is NOT set.
- `getBatchStrategy(endpoint)` instantiates a fresh `ChunkBatchStrategy` per call, closing over `listId` and the subscribe/unsubscribe branch. `wrapBody` produces `{ listId, subscribers }` for subscribe and `{ listId, subscribers, channelUnsubscribe: false }` for unsubscribe. `channelUnsubscribe: false` is ALWAYS explicit.
- Per-row pipeline: `remapToIterableFields` → `processAudienceRecord` (`HashingType.NONE` for both email and userId) → `selectIdentifierForRow`. Hybrid + both present → return `userId` (Iterable primary matching key). Empty processed object → throw `InstrumentationError`. Project-type-vs-mapping mismatch is enforced by `IterableConnectionConfigSchema` `.superRefine` and surfaces as a config-level `ConfigurationError`.
- Account `dataCenter` values are `US`/`EU`; map to the existing iterable config's `USDC`/`EUDC` keys at the call site via a 2-entry constant. Reuse `BASE_URL` and `constructEndpoint` from `src/v0/destinations/iterable/config.js`.
- v1 networkHandler: thin strategy router → single `AudienceListStrategy extends BaseStrategy`. `handleSuccess` builds `forgottenLookup` (audience-specific short-circuit to 200 + metric) and delegates everything else to the reused `createBatchErrorChecker`. `notFoundEmails`/`notFoundUserIds` on unsubscribe → 200 (no-op success). `handleError` throws `TransformerProxyError` with every metadata entry at the same status (`AuthErrorCategory: 'AUTH'` on 401).
- UserForgotten metric emits `iterable_forgotten_user_violations` with `destType`, `destinationId`, `workspaceId`, `identifierType` tags only — NEVER the identifier value.
- Email lookup key: `value.toLowerCase()`. userId lookup key: `value` (preserved). Same case-folding applied on the request side.
- `MAX_BATCH_SIZE = 1000` (Iterable's documented per-request maximum for `/api/lists/subscribe` and `/api/lists/unsubscribe`).
- Adding `ITERABLE_AUDIENCE: true` to `src/constants/batchedDestinationsMap.ts` is REQUIRED — without it, the destination falls back to the legacy router pipeline and the BatchDestination class is never instantiated.

---

### 3. Integration Verification

**Purpose:** Tests pass, lint clean, build clean, code review identifies no issues, end-to-end functional smoke through `processBatchedDestination` and `AudienceListStrategy.handleSuccess`/`handleError` produces correct per-jobId outcomes.

---

### 4. Knowledge Distillation

**Purpose:** Curate stage memories into `doc/loom/knowledge/`. Capture the `BatchDestination` audience pattern, the v1 strategy-reuse contract with existing `iterable/`, and the case-sensitivity rules for identifier lookup.

---

<!-- loom METADATA -->

```yaml
loom:
  version: 1
  sandbox:
    enabled: true
    auto_allow: true
    excluded_commands:
      - "loom"
    filesystem:
      deny_read:
        - "~/.ssh/**"
        - "~/.aws/**"
        - "~/.config/gcloud/**"
        - "~/.gnupg/**"
      allow_write:
        - "src/v0/destinations/iterable_audience/**"
        - "src/v1/destinations/iterable_audience/**"
        - "src/constants/batchedDestinationsMap.ts"
        - "test/integrations/destinations/iterable_audience/**"
        - "doc/loom/knowledge/**"
        - "doc/plans/**"
    network:
      allowed_domains:
        - "registry.npmjs.org"
        - "registry.yarnpkg.com"
      allow_local_binding: false
      allow_unix_sockets: []
  stages:
    - id: knowledge-bootstrap
      name: "Bootstrap Knowledge Base"
      stage_type: knowledge
      model: "sonnet"
      reasoning_effort: "high"
      description: |
        MANDATORY first stage. Capture reuse contracts from the existing iterable/
        destination and the BatchDestination framework path before writing any code.

        Use parallel subagents and skills to maximize performance.

        Step 0 - CHECK EXISTING KNOWLEDGE:
          Run: loom knowledge check

        Step 1 - PARALLEL EXPLORATION (Explore subagents, all parallel):

          Subagent 1 - Existing iterable/ v0:
            Read src/v0/destinations/iterable/config.js — document BASE_URL,
            constructEndpoint signature, USDC/EUDC keys, ITERABLE_RESPONSE_*_PATHS.
            Output: loom knowledge update entry-points "## existing iterable v0\n\n..."

          Subagent 2 - Existing iterable/ v1:
            Read src/v1/destinations/iterable/strategies/base.ts — document
            BaseStrategy contract (handleSuccess / handleError split).
            Read src/v1/destinations/iterable/utils.ts — document
            createBatchErrorChecker (input/output, what paths it scans, what
            isAbortable means).
            Read src/v1/destinations/iterable/types.ts — document FailedUpdates,
            GeneralApiResponse, IterableBulkApiResponse, IterableBulkProxyInput.
            Output: loom knowledge update entry-points "## existing iterable v1\n\n..."

          Subagent 3 - BatchDestination framework + audience utils:
            Read src/v0/util/audienceUtils.ts — document processAudienceRecord
            signature, AudienceField, HashingType. Confirm config.isHashRequired
            destructure (audienceUtils.ts:48-56) and note that when every field
            is HashingType.NONE the isHashable branch never executes.
            Read src/v0/util/recordUtils.ts — document EVENT_TYPES.
            Read src/services/destination/nativeBatching/chunkBatchStrategy.ts —
            document ChunkBatchStrategy.wrapBody signature (receives only bodies,
            no endpoint or group key — strategy must close over per-group state).
            Read src/services/misc.ts — confirm getBatchDestinationHandler
            hardcodes the v0 path (line ~32-34).
            Read src/constants/batchedDestinationsMap.ts — note current entries
            so the addition is unambiguous.
            Output: loom knowledge update patterns "## BatchDestination framework\n\n..."

          Subagent 4 - Reference implementations:
            Read src/v0/destinations/custom_audience/routerTransform.ts —
            document the BatchDestination reference pattern.
            Read src/v0/destinations/customerio_audience/transform.ts — document
            record-event audience semantics.
            Output: loom knowledge update patterns "## audience destination references\n\n..."

          Spawn these as parallel Task tool calls.

        Read doc/plans/iterable-audience-m1-lld.md §4.2 and §4.3 in full before
        completing this stage.

        MEMORY & KNOWLEDGE RECORDING:
        - loom memory note "..." for observations
        - loom knowledge update mistakes "..." as **What happened / Why / Prevention / Fix**

        SUBAGENT PREAMBLE — include in every Task prompt:

          ** READ CLAUDE.md IMMEDIATELY AND FOLLOW ALL ITS RULES. **
          ⛔ SUBAGENT: NEVER git commit, git add -A/., or loom stage complete
          ⛔ AUTO-MEMORY: NEVER use ~/.claude/projects/*/memory/; only loom memory
          Record mistakes, decisions, surprises via loom memory note/decision.
          Do NOT record procedural actions.

        ⛔ NEVER use Claude Code auto-memory.
      dependencies: []
      acceptance:
        - "loom knowledge check"
        - 'rg -q "## " doc/loom/knowledge/entry-points.md'
        - 'rg -q "## " doc/loom/knowledge/patterns.md'
      files:
        - "doc/loom/knowledge/**"
      working_dir: "."
      artifacts:
        - "doc/loom/knowledge/entry-points.md"
        - "doc/loom/knowledge/patterns.md"

    - id: data-plane
      name: "Data plane — v0 transform + v1 delivery"
      stage_type: standard
      model: "opus[1m]"
      reasoning_effort: "xhigh"
      description: |
        Implement v0 transform layer and v1 delivery layer for iterable_audience.
        Three parallel subagents, file-exclusive ownership.

        Use parallel subagents and skills to maximize performance.
        Apply skills: vdm-next-audience-integration, batching-framework,
        writing-tests, typescript-guidelines, code-structure.

        READ FIRST:
          doc/plans/iterable-audience-m1-lld.md §4.2 (transform layer)
          doc/plans/iterable-audience-m1-lld.md §4.3 (delivery layer)
          doc/plans/iterable-audience-m1-scope.md (anchor design + error handling)

        SUBAGENT FILE ASSIGNMENTS:

          Subagent A — v0 transform (loom-senior-software-engineer):
            Files Owned:
              src/v0/destinations/iterable_audience/config.ts
              src/v0/destinations/iterable_audience/types.ts
              src/v0/destinations/iterable_audience/utils.ts
              src/v0/destinations/iterable_audience/routerTransform.ts
              src/v0/destinations/iterable_audience/__tests__/routerTransform.test.ts
              src/v0/destinations/iterable_audience/__tests__/utils.test.ts
            Files Read-Only:
              src/v0/destinations/iterable/config.js               (reuse BASE_URL, constructEndpoint, USDC/EUDC keys)
              src/v0/util/audienceUtils.ts                          (processAudienceRecord, AudienceField, HashingType)
              src/v0/util/recordUtils.ts                            (EVENT_TYPES)
              src/v0/destinations/custom_audience/routerTransform.ts (reference)
              src/v0/destinations/customerio_audience/transform.ts   (record-event semantics)
              src/services/destination/nativeBatching/chunkBatchStrategy.ts
              src/services/misc.ts                                   (confirm v0 path hardcoded)
            Detailed instructions:

              config.ts (LLD §4.2.1):
                import { EVENT_TYPES } from '../../util/recordUtils';
                import { constructEndpoint } from '../iterable/config';
                export const DESTINATION_TYPE = 'iterable_audience';
                const DATA_CENTER_TO_BASE_KEY = { US: 'USDC', EU: 'EUDC' } as const;
                export const SUBSCRIBE_CATEGORY   = { name: '', action: 'subscribe',   endpoint: 'lists/subscribe' };
                export const UNSUBSCRIBE_CATEGORY = { name: '', action: 'unsubscribe', endpoint: 'lists/unsubscribe' };
                export function getSubscribeEndpoint(dataCenter)   { return constructEndpoint(DATA_CENTER_TO_BASE_KEY[dataCenter], SUBSCRIBE_CATEGORY); }
                export function getUnsubscribeEndpoint(dataCenter) { return constructEndpoint(DATA_CENTER_TO_BASE_KEY[dataCenter], UNSUBSCRIBE_CATEGORY); }
                export const MAX_BATCH_SIZE = 1000;
                export const ACTION_RECORD_MAP = {
                  [EVENT_TYPES.INSERT]: 'subscribe',
                  [EVENT_TYPES.UPDATE]: 'subscribe',
                  [EVENT_TYPES.DELETE]: 'unsubscribe',
                };
                export const PROJECT_TYPES = {
                  EMAIL_BASED: 'email-based',
                  HYBRID: 'hybrid',
                  USERID_BASED: 'userId-based',
                } as const;

              types.ts (LLD §4.2.2):
                Zod schemas:
                  IterableAccountConfigSchema (apiKey secret, dataCenter US|EU, projectType enum)
                  IterableConnectionConfigSchema with superRefine enforcing project-type-vs-mappings:
                    - email-based: exactly one entry with iterableField === 'email'
                    - userId-based: exactly one entry with iterableField === 'userId'
                    - hybrid: 1-2 entries with distinct iterableField values
                  RecordMessageSchema (type: 'record', action, identifiers, fields)
                  MetadataSchema (workspaceId, secret.apiKey, account options)
                  IterableAudienceRouterRequestSchema (composed)
                Type exports via z.infer.
                IdentifierMapping = { iterableField: 'email' | 'userId', warehouseColumn: string };
                IterableSubscriber = { email: string } | { userId: string };  (XOR)
                IterableAudiencePayload = { action: 'subscribe' | 'unsubscribe', subscriber: IterableSubscriber };

              utils.ts (LLD §4.2.3):
                IDENTIFIER_FIELD_CONFIG: Record<'email'|'userId', AudienceField> = {
                  email:  { hashingType: HashingType.NONE,
                            normalize: v => v.trim().toLowerCase(),
                            validate:  v => validator.isEmail(v) },
                  userId: { hashingType: HashingType.NONE,
                            normalize: v => v,
                            validate:  v => v.length > 0 && v === v.trim() },
                }
                remapToIterableFields(rowIdentifiers, mappings): for each mapping, if
                  rowIdentifiers[warehouseColumn] is non-null and non-empty, set
                  out[iterableField] = rawValue.
                selectIdentifierForRow(processed, projectType): hybrid + userId
                  present → return { userId }; hybrid + only email → { email };
                  email-based + email → { email }; userId-based + userId → { userId };
                  empty → throw InstrumentationError('No valid identifier value for this record').
                buildSubscribeBody(listId, subscribers)   → { listId, subscribers }
                buildUnsubscribeBody(listId, subscribers) → { listId, subscribers, channelUnsubscribe: false }
                  channelUnsubscribe: false is ALWAYS explicit — never relies on default.

              routerTransform.ts (LLD §4.2.4):
                IterableAudienceIntegration extends BatchDestination<
                  IterableAudiencePayload, ..., IterableConnectionConfig
                > so this.connection.config.destination.listId is accessible.

                transformEvent(event):
                  const action = ACTION_RECORD_MAP[message.action];
                  if (!action) throw InstrumentationError('Unsupported record action');
                  const remapped  = remapToIterableFields(message.identifiers, connConfig.identifierMappings);
                  const processed = processAudienceRecord(remapped, {
                    fieldConfigs: IDENTIFIER_FIELD_CONFIG,
                    destination: {
                      workspaceId: metadata.workspaceId,
                      id: destination.ID,
                      type: DESTINATION_TYPE,
                      config: { isHashRequired: false },   // required by audienceUtils.ts:48-56 destructure;
                                                            // never read since every field is HashingType.NONE.
                    },
                  }) as Partial<Record<'email'|'userId', string>>;
                  if (Object.keys(processed).length === 0) {
                    throw new InstrumentationError('All identifier values are empty after normalization');
                  }
                  const subscriber = selectIdentifierForRow(processed, accountConfig.projectType);
                  const endpoint =
                    action === 'subscribe'
                      ? getSubscribeEndpoint(accountConfig.dataCenter)
                      : getUnsubscribeEndpoint(accountConfig.dataCenter);
                  return TransformedEvent with payload { action, subscriber } and endpoint.
                  Do NOT set internalGroupKey — endpoint is the discriminator.

                getBatchStrategy(endpoint): BatchStrategy<IterableAudiencePayload>
                  const { listId } = this.connection!.config.destination;
                  const isSubscribe = endpoint.endsWith('/api/lists/subscribe');
                  return new ChunkBatchStrategy<IterableAudiencePayload>({
                    maxItems: MAX_BATCH_SIZE,
                    wrapBody: bodies => {
                      const subscribers = bodies.map(b => b.subscriber);
                      return isSubscribe
                        ? buildSubscribeBody(listId, subscribers)
                        : buildUnsubscribeBody(listId, subscribers);
                    },
                  });
                  this.connection is populated by the framework at construction
                  (batchDestination.ts:44-47); the non-null assertion reflects that
                  audience destinations always receive a connection.

                getInputSchema(): IterableAudienceRouterRequestSchema.

              Tests (LLD §4.2.6):
                routerTransform.test.ts via processBatchedDestination(inputs, Integration, {}):
                  - each project type × each action (subscribe/unsubscribe)
                  - batch overflow (>MAX_BATCH_SIZE produces multiple groups)
                  - mixed actions produce separate subscribe and unsubscribe batches
                  - missing identifier → per-jobId InstrumentationError
                  - malformed email → per-jobId InstrumentationError
                  - identifier-vs-projectType mismatch → ConfigurationError at validation time
                utils.test.ts:
                  - email lowercasing + trim
                  - userId case preservation
                  - whitespace rejection (leading/trailing) for userId
                  - empty-row rejection
                  - hybrid userId-preference selection
                  - body builders always emit channelUnsubscribe: false on unsubscribe

          Subagent B — v1 delivery (loom-senior-software-engineer):
            Files Owned:
              src/v1/destinations/iterable_audience/networkHandler.ts
              src/v1/destinations/iterable_audience/types.ts
              src/v1/destinations/iterable_audience/strategies/audience-list.ts
              src/v1/destinations/iterable_audience/__tests__/networkHandler.test.ts
            Files Read-Only:
              src/v1/destinations/iterable/strategies/base.ts      (BaseStrategy)
              src/v1/destinations/iterable/utils.ts                (createBatchErrorChecker)
              src/v1/destinations/iterable/types.ts                (FailedUpdates etc.)
              src/v0/destinations/iterable/config.js               (ITERABLE_RESPONSE_*_PATHS)
              src/adapters/utils/networkUtils                       (processAxiosResponse, getDynamicErrorType)
              src/adapters/network                                  (prepareProxyRequest, proxyRequest)
            Detailed instructions (LLD §4.3):

              networkHandler.ts:
                Thin strategy router. proxyRequest delivers POST to Iterable.
                responseHandler delegates to AudienceListStrategy.

              strategies/audience-list.ts:
                AudienceListStrategy extends BaseStrategy (imported from
                ../../iterable/strategies/base).

                handleSuccess (HTTP 2xx):
                  const checkEventError = createBatchErrorChecker(destinationResponse);
                  // Reused from v1/iterable/utils — pre-builds O(1) lookup over every
                  // failedUpdates.* path (forgottenEmails, invalidEmails, conflictEmails,
                  // notFoundEmails, invalidDataEmails, plus userId variants).
                  const forgottenLookup = buildForgottenLookups(response.failedUpdates);
                  // Audience-specific: only the forgotten paths.

                  Iterate destinationRequest.body.JSON.subscribers index-aligned with
                  rudderJobMetadata. Each subscriber carries EXACTLY ONE identifier
                  (enforced at transform). Per subscriber:
                    1. forgottenLookup hit
                         → emit stats.counter('iterable_forgotten_user_violations', 1, {
                              destType: 'ITERABLE_AUDIENCE',
                              destinationId,
                              workspaceId,
                              identifierType: subscriber.email ? 'email' : 'userId',
                              // NEVER the identifier VALUE — value is subject to GDPR.
                            });
                         → return { statusCode: 200, error: 'success' }
                    2. isUnsubscribe AND notFound lookup hit
                         → return { statusCode: 200, error: 'success' }
                    3. checkEventError(subscriber)
                         → isAbortable → { statusCode: 400, error: errorMsg }
                         → otherwise   → { statusCode: 200, error: 'success' }

                  Return { status: 200, message, destinationResponse,
                           response: responseWithIndividualEvents }.

                handleError (HTTP 4xx/5xx):
                  Throw TransformerProxyError with responseWithIndividualEvents
                  populated for EVERY metadata entry at the same status. On 401,
                  set AuthErrorCategory: 'AUTH'. The downstream platform layer is
                  responsible for auto-disable on persistent 401 — out of scope here.

                Identifier lookup case-sensitivity:
                  email  → value.toLowerCase()    (Iterable lowercases server-side)
                  userId → value (preserved)      (Iterable is case-sensitive on userId)
                  Same case-folding applied on the request side, so what we sent
                  matches what we look up.

              Tests (LLD §4.3.6):
                - Full-success batch — all 200.
                - Each failedUpdates class in turn (forgotten/invalid/conflict/notFound).
                - UserForgotten metric: counter incremented, identifierType tag only,
                  NO value tag.
                - Whole-batch 401/404/429/500 — every entry same status;
                  AuthErrorCategory: 'AUTH' on 401 only.
                - Email case-insensitive: 'Alice@Example.Com' matches
                  'alice@example.com' in failedUpdates.invalidEmails.
                - userId case-sensitive: 'User_123' does NOT match 'user_123'.
                - notFound on unsubscribe → 200; notFound on subscribe → 400.
                - Mixed batch with success + forgotten + invalid + conflict —
                  assert per-jobId statuses align with metadata array index.
                - Hybrid sync with both columns mapped: row with both values
                  produces subscriber with userId only (preferred); row with
                  email only produces subscriber with email only. Inspected via
                  batchedRequest.body.JSON.subscribers.

          Subagent C — Registry + data-driven tests (loom-software-engineer):
            Files Owned:
              src/constants/batchedDestinationsMap.ts                              (1-line ITERABLE_AUDIENCE: true add)
              test/integrations/destinations/iterable_audience/router/data.ts      (data-driven integration tests)
              test/integrations/destinations/iterable_audience/network.ts          (mock fixtures if needed)
            Files Read-Only:
              src/constants/batchedDestinationsMap.ts                              (read first)
              test/integrations/destinations/custom_audience/router/data.ts        (template)
              test/integrations/destinations/customerio_audience/router/data.ts    (template)
            Detailed instructions:
              - Add ITERABLE_AUDIENCE: true to batchedDestinationsMap.ts. Without
                this entry the destination falls back to legacy router pipeline
                and the BatchDestination class is never instantiated.
              - Author data-driven router integration cases covering subscribe and
                unsubscribe batches. Sanity-check that the request body for
                unsubscribe has channelUnsubscribe: false and the request body
                for subscribe does NOT carry it.

          NO FILE OVERLAP between subagents — confirmed (test paths and source
          paths are all disjoint).

        MEMORY RECORDING (use loom memory ONLY — never loom knowledge update,
        never auto-memory):
        - Record reuse-contract surprises with the existing iterable/ destination.
        - Record decisions about edge cases in the per-row identifier pipeline.
        - Subagents must record their own memories.

        SUBAGENT PREAMBLE — include in every Task prompt:

          ** READ CLAUDE.md IMMEDIATELY AND FOLLOW ALL ITS RULES. **
          ⛔ SUBAGENT: NEVER git commit, git add -A/., or loom stage complete
          ⛔ AUTO-MEMORY: NEVER use ~/.claude/projects/*/memory/; only loom memory
          Record mistakes, decisions, surprises via loom memory note/decision.
          Do NOT record procedural actions.
      dependencies: ["knowledge-bootstrap"]
      acceptance:
        - "npm run test:js -- --testPathPattern iterable_audience"
        - "npm run lint"
      files:
        - "src/v0/destinations/iterable_audience/**"
        - "src/v1/destinations/iterable_audience/**"
        - "test/integrations/destinations/iterable_audience/**"
        - "src/constants/batchedDestinationsMap.ts"
      working_dir: "."
      artifacts:
        - "src/v0/destinations/iterable_audience/config.ts"
        - "src/v0/destinations/iterable_audience/types.ts"
        - "src/v0/destinations/iterable_audience/utils.ts"
        - "src/v0/destinations/iterable_audience/routerTransform.ts"
        - "src/v1/destinations/iterable_audience/networkHandler.ts"
        - "src/v1/destinations/iterable_audience/types.ts"
        - "src/v1/destinations/iterable_audience/strategies/audience-list.ts"
      wiring:
        - source: "src/constants/batchedDestinationsMap.ts"
          pattern: 'ITERABLE_AUDIENCE'
          description: "Destination registered in batchedDestinationsMap so BatchDestination loader instantiates it"
        - source: "src/v0/destinations/iterable_audience/config.ts"
          pattern: "from '../iterable/config'"
          description: "Reuses existing iterable destination constructEndpoint and BASE_URL"
        - source: "src/v1/destinations/iterable_audience/strategies/audience-list.ts"
          pattern: "from '../../iterable/"
          description: "v1 strategy reuses existing iterable destination BaseStrategy/createBatchErrorChecker"
        - source: "src/v0/destinations/iterable_audience/utils.ts"
          pattern: 'channelUnsubscribe'
          description: "channelUnsubscribe: false explicit in unsubscribe body builder"
        - source: "src/v0/destinations/iterable_audience/utils.ts"
          pattern: 'processAudienceRecord'
          description: "Per-row pipeline reuses shared audienceUtils.processAudienceRecord"

    - id: integration-verify
      name: "Integration Verification"
      stage_type: integration-verify
      model: "opus[1m]"
      reasoning_effort: "xhigh"
      description: |
        Full build, lint, test, code review, and functional smoke for the
        iterable_audience transformer code.

        Use parallel subagents and skills to maximize performance.

        ⛔ NEVER use Claude Code auto-memory.
        ⛔ NO loom knowledge update — record discoveries to loom memory for
        knowledge-distill to curate.

        CONTEXT GATHERING (FIRST):
        1. Read doc/plans/PLAN-iterable-audience-m1.md.
        2. Read doc/plans/iterable-audience-m1-lld.md §4.2 and §4.3.
        3. Read ALL stage memories: loom memory show --all
        4. Read doc/loom/knowledge/*.md.

        ⛔ ZERO TOLERANCE: ALL warnings, errors, test failures must be FIXED.

        BUILD & TEST:
        - npm run test:js (full suite, not just affected) — record any flakes
          via loom memory note and re-run.
        - npm run lint (warnings as errors).
        - npm run build (TypeScript clean).

        CODE REVIEW (parallel loom-code-reviewer subagents):

          Subagent IV-1 — Security review (loom-code-reviewer + /loom-security-audit):
            - apiKey never logged, never in query string, always in Api-Key header
              (note: this destination only constructs the body — the actual delivery
              uses framework-level proxy that handles the header).
            - UserForgotten metric tags do NOT include identifier values
              (only identifierType: 'email' | 'userId').
            - Input validation at boundaries (Zod schemas).
            - No hardcoded secrets in test fixtures.

          Subagent IV-2 — Architecture review (loom-code-reviewer):
            - Reuse contract honored: no duplication of BASE_URL, constructEndpoint,
              createBatchErrorChecker, BaseStrategy, FailedUpdates types between
              iterable_audience and existing iterable destination.
            - No framework changes (BatchDestination, ChunkBatchStrategy untouched).
            - channelUnsubscribe: false ALWAYS explicit on unsubscribe bodies.
            - internalGroupKey NOT set on TransformedEvent.
            - Per-endpoint ChunkBatchStrategy (NOT CustomBatchStrategy) since
              endpoint is the natural group discriminator.

          Subagent IV-3 — Test coverage review (loom-code-reviewer):
            - Each failedUpdates class covered (forgotten/invalid/conflict/notFound).
            - UserForgotten metric assertion: identifierType tag present, value tag
              absent.
            - Case-sensitivity asserted (email lowercased, userId preserved).
            - Hybrid both-columns-mapped covered.
            - Whole-batch 401/404/429/500.

          Fix ALL issues found — loom-code-reviewer is read-only; spawn
          loom-software-engineer or loom-senior-software-engineer to apply fixes.

        FUNCTIONAL VERIFICATION (MANDATORY — Subagent IV-4):
          - Drive a synthetic batch through processBatchedDestination:
            3 INSERTs + 2 DELETEs across email-only / userId-only / hybrid rows.
            Assert two batched requests produced (one subscribe + one unsubscribe),
            correct listId, correct subscribers, channelUnsubscribe: false on
            unsubscribe.
          - Drive a synthetic Iterable 2xx response with one entry per
            failedUpdates class through AudienceListStrategy.handleSuccess.
            Assert per-jobId outcomes match LLD §5.7.
          - Drive a 401 response through handleError. Assert
            AuthErrorCategory: 'AUTH' on every metadata entry.

        MEMORY RECORDING (loom memory ONLY):
        - loom memory note "..." for any issues found and fixed.
        - knowledge-distill (next stage) curates these.

        SUBAGENT PREAMBLE — include in every Task prompt:

          ** READ CLAUDE.md IMMEDIATELY AND FOLLOW ALL ITS RULES. **
          ⛔ SUBAGENT: NEVER git commit, git add -A/., or loom stage complete
          ⛔ AUTO-MEMORY: NEVER use ~/.claude/projects/*/memory/; only loom memory
          ⛔ NO knowledge writes — only loom memory in this stage.
          Record mistakes, decisions, surprises via loom memory note/decision.
          Do NOT record procedural actions.
      dependencies: ["data-plane"]
      acceptance:
        - "npm run test:js -- --testPathPattern iterable_audience"
        - "npm run lint"
        - 'rg -qF "ITERABLE_AUDIENCE" src/constants/batchedDestinationsMap.ts'
        - 'rg -qF "channelUnsubscribe" src/v0/destinations/iterable_audience/utils.ts'
        - 'rg -qF "iterable_forgotten_user_violations" src/v1/destinations/iterable_audience/strategies/audience-list.ts'
      working_dir: "."
      truths:
        - 'rg -qF "ITERABLE_AUDIENCE" src/constants/batchedDestinationsMap.ts'
      wiring:
        - source: "src/constants/batchedDestinationsMap.ts"
          pattern: 'ITERABLE_AUDIENCE'
          description: "BatchDestination loader registered"
        - source: "src/v1/destinations/iterable_audience/strategies/audience-list.ts"
          pattern: 'iterable_forgotten_user_violations'
          description: "UserForgotten compliance metric emitted"

    - id: knowledge-distill
      name: "Knowledge Distillation"
      stage_type: knowledge-distill
      model: "sonnet"
      reasoning_effort: "high"
      description: |
        Curate stage memories into permanent doc/loom/knowledge/.

        ⛔ NEVER use Claude Code auto-memory.

        CONTEXT GATHERING (FIRST):
        1. Read doc/plans/PLAN-iterable-audience-m1.md.
        2. Read ALL stage memories: loom memory show --all
        3. Read doc/loom/knowledge/*.md.

        MEMORY CURATION (use loom knowledge update):
        - patterns.md: "## BatchDestination audience pattern" — the per-endpoint
          ChunkBatchStrategy approach, where the endpoint string acts as group
          discriminator; the per-row identifier pipeline via processAudienceRecord
          with HashingType.NONE; the InstrumentationError on empty-row check.
        - patterns.md: "## v1 strategy reuse from existing destinations" —
          BaseStrategy + createBatchErrorChecker + FailedUpdates types reused
          from sibling destinations.
        - mistakes.md: format as **What happened / Why / Prevention / Fix**.
          Likely entries: forgetting batchedDestinationsMap entry → BatchDestination
          loader never instantiated; setting internalGroupKey unnecessarily;
          missing channelUnsubscribe: false default.
        - conventions.md: identifier case-folding rule (email lowercased both ways,
          userId preserved); audience compliance metric tags NEVER include the
          identifier value.

        KNOWLEDGE REVIEW:
        - loom review, remove stale entries, update architecture.md if changed.

        DOCUMENTATION UPDATE:
        - If a per-destination docs page is expected (see existing iterable destination's
          docs/ for the template), add a stub. Apply skill: generate-integration-docs
          (reference am/docs/ per LLD §7.1).
      dependencies: ["integration-verify"]
      acceptance:
        - 'rg -q "## " doc/loom/knowledge/patterns.md'
      files:
        - "doc/loom/knowledge/**"
        - "src/v0/destinations/iterable_audience/docs/**"
      working_dir: "."
```

<!-- END loom METADATA -->
