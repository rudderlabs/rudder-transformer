# Batching Framework for Router Transform — Overview

## Problem Statement

The `/routerTransform` route handles batching for 50+ destinations, each implementing its own `processRouterDest` function. This leads to:

- **Duplicated batching logic** across destinations (chunking, size limits, metadata alignment)
- **Inconsistent error handling** — some destinations swallow errors, others propagate differently
- **No shared validation** — each destination validates inputs independently (or doesn't)
- **Difficult onboarding** — new destinations must re-implement chunking, metadata mapping, and response formatting from scratch

## Goal

Provide a **generic batching framework** that:

1. Standardises validation, chunking, metadata resolution, and response formatting
2. Lets each destination focus **only** on per-event transformation and batching strategy
3. Supports all existing batching patterns without forcing a single payload shape
4. Is opt-in — destinations migrate incrementally via a registry map

## Requirements

| #   | Requirement                                                                                          | Status |
| --- | ---------------------------------------------------------------------------------------------------- | ------ |
| R1  | Integration does per-event transformation; framework does iteration, grouping, chunking + formatting | Done   |
| R2  | Support `dontBatch` metadata flag (single-event batches)                                             | Done   |
| R3  | Zod-based input validation (base spec + destination-specific rules)                                  | Done   |
| R4  | Configurable chunking by item count and payload byte size                                            | Done   |
| R5  | `wrapBody` callback for constructing the final chunked payload                                       | Done   |
| R6  | Per-call instantiation to avoid race conditions with mutable state                                   | Done   |
| R7  | Thread `reqMetadata` for feature flag support                                                        | Done   |
| R8  | Correct `statTags` on validation errors for metrics accuracy                                         | Done   |

## Terminology

| Term                       | Definition                                                                                                              |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **RouterIntegration**      | Abstract class a destination extends to opt into the framework                                                          |
| **transformEvent**         | Per-event method: transforms one input into one or more `TransformedPayload`s                                           |
| **batchTransform**         | Framework-provided default that iterates inputs and calls `transformEvent()`; overridable for pre-batch bulk operations |
| **getBatchStrategy**       | Returns a `BatchStrategy` (`chunk` or `customBatch`) for a given endpoint                                               |
| **TransformedPayload**     | One transformed event payload with endpoint, method, headers, and body                                                  |
| **BatchStrategy**          | Describes how to combine payloads within a group — either `chunk(...)` or `customBatch(...)`                            |
| **batchedDestinationsMap** | Registry (`src/constants/batchedDestinationsMap.ts`) that opts a destination into the framework                         |

## Architecture — Block Diagram

```
                          ┌──────────────────────────────┐
                          │  POST /routerTransform       │
                          └──────────────┬───────────────┘
                                         │
                          ┌──────────────▼───────────────┐
                          │ NativeIntegrationDestination │
                          │   .doRouterTransformation()  │
                          └──────────────┬───────────────┘
                                         │
                       ┌─────────────────┴─────────────────┐
                       │  batchedDestinationsMap lookup    │
                       └────────┬──────────────────┬───────┘
                                │                  │
                     dest IS in map          dest NOT in map
                                │                  │
                   ┌────────────▼──────────┐  ┌────▼──────────────┐
                   │ NEW FRAMEWORK PATH    │  │ LEGACY PATH       │
                   │ processBatchedDest()  │  │ processRouterDest │
                   └────────────┬──────────┘  └───────────────────┘
                                │
              ┌─────────────────▼─────────────────┐
              │  1. Build metadataMap (jobId→Meta) │
              │  2. Validate (Zod: base + custom)  │
              │  3. Split on dontBatch flag        │
              └─────────┬───────────────┬─────────┘
                        │               │
             batchable events    nonBatchable events
                        │               │
           ┌────────────▼────┐  ┌───────▼──────────┐
           │ batchTransform  │  │ batchTransform    │
           │ (all at once)   │  │ (one per event)   │
           └────────┬────────┘  └───────┬───────────┘
                    │                   │
                    └─────────┬─────────┘
                              │
              ┌───────────────▼───────────────┐
              │  group by composite key        │
              │  { endpoint, method, headers,  │
              │    params }  [private]          │
              │  → Map<key, Payload[]>         │
              └───────────────┬───────────────┘
                              │
              ┌───────────────▼───────────────┐
              │  For each (group)              │
              │    → getBatchStrategy(endpoint)│
              │    → apply strategy            │
              └───────────────┬───────────────┘
                              │
              ┌───────────────▼───────────────┐
              │  convertToServerFormat()       │
              │  (wrap in REST envelope with   │
              │   JSON/XML/FORM/files shape)   │
              └───────────────┬───────────────┘
                              │
              ┌───────────────▼───────────────┐
              │  handleRouterTransform        │
              │  SuccessEvents() — metrics    │
              └───────────────────────────────┘
```

### Framework Execution Flow (Summary)

```
1. batchTransform(inputs)                          ← default iterates, calls transformEvent()
   → flat list of TransformedPayload[]             ← framework catches errors, tracks jobIds

2. group by { endpoint, method, headers, params }  ← framework groups automatically (private)
   → Map<compositeKey, TransformedPayload[]>

3. for each (group):
     getBatchStrategy(group.endpoint)              ← destination returns chunk/customBatch
     apply strategy to payloads                    ← framework executes

4. convertToServerFormat()                         ← framework wraps in REST envelope
```

**Key design decisions:**

- **Grouping is a private framework concern.** Payloads are grouped by the composite key `{ endpoint, method, headers, params }` — exactly the set of fields that define "can these share a single HTTP request?". This is not overridable, removing the footgun of incorrect grouping.
- **Grouping happens before batching.** The framework always groups first, then applies `getBatchStrategy()` within each partition. This ordering is enforced by the framework.

## Opt-In Mechanism

A destination opts in by:

1. Adding its key to `src/constants/batchedDestinationsMap.ts`
2. Creating `src/v0/destinations/{dest}/routerTransform.ts` that exports `Integration` (the class, not an instance)

```typescript
// src/constants/batchedDestinationsMap.ts
export const batchedDestinationsMap: Record<string, true> = {
  POSTHOG: true,
  BRAZE: true,
};
```

The framework caches the **constructor** (not an instance) in `FetchHandler.routerTransformHandlerMap` and creates a **new instance per request** to avoid race conditions with mutable instance state.

## Entry Point Flow

```
doRouterTransformation(events, destType, version, reqMetadata)
  │
  ├─ if batchedDestinationsMap[destType]:
  │    IntegrationClass = FetchHandler.getRouterTransformHandler(destType)
  │    results = processBatchedDestination(events, IntegrationClass, reqMetadata)
  │    return handleRouterTransformSuccessEvents(results, ...)
  │
  └─ else:
       destHandler = FetchHandler.getDestHandler(destType, version)
       destHandler.processRouterDest(events, reqMetadata)  // legacy
```
