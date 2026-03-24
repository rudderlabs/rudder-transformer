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
2. Lets each destination focus **only** on per-event transformation and endpoint grouping
3. Supports all existing batching patterns without forcing a single payload shape
4. Is opt-in — destinations migrate incrementally via a registry map

## Requirements

| #   | Requirement                                                                      | Status |
| --- | -------------------------------------------------------------------------------- | ------ |
| R1  | Integration does transformation + grouping; framework does chunking + formatting | Done   |
| R2  | Support `dontBatch` metadata flag (single-event batches)                         | Done   |
| R3  | Zod-based input validation (base spec + destination-specific rules)              | Done   |
| R4  | Configurable chunking by item count and payload byte size                        | Done   |
| R5  | Dot-notation `payloadHierarchyPath` for nested chunkable arrays                  | Done   |
| R6  | Per-call instantiation to avoid race conditions with mutable state               | Done   |
| R7  | Thread `reqMetadata` for feature flag support                                    | Done   |
| R8  | Correct `statTags` on validation errors for metrics accuracy                     | Done   |

## Terminology

| Term                       | Definition                                                                                      |
| -------------------------- | ----------------------------------------------------------------------------------------------- |
| **RouterIntegration**      | Abstract class a destination extends to opt into the framework                                  |
| **batchTransform**         | Destination-implemented method: transforms all events and groups them by endpoint               |
| **postTransform**          | Optional override: receives one endpoint group, applies custom post-chunk logic                 |
| **getBatchConfig**         | Returns chunking configuration (`payloadHierarchyPath`, `maxChunkSize`, `maxPayloadSize`)       |
| **GroupedSuccessEvents**   | One bucket of successfully transformed events sharing an endpoint                               |
| **BatchConfig**            | Chunking parameters — path to the chunkable array, size limits                                  |
| **BatchRequest**           | Final HTTP request shape before framework wraps it in server format                             |
| **PostTransformResult**    | Pairing of a `BatchRequest` with aligned `jobIds`                                               |
| **batchedDestinationsMap** | Registry (`src/constants/batchedDestinationsMap.ts`) that opts a destination into the framework |

## Architecture — Block Diagram

```
                          ┌──────────────────────────────┐
                          │  POST /routerTransform       │
                          └──────────────┬───────────────┘
                                         │
                          ┌──────────────▼───────────────┐
                          │ NativeIntegrationDestination  │
                          │   .doRouterTransformation()   │
                          └──────────────┬───────────────┘
                                         │
                       ┌─────────────────┴─────────────────┐
                       │  batchedDestinationsMap lookup     │
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
              │  For each GroupedSuccessEvents │
              │    → postTransform()          │
              │      → chunkGroup()           │
              │      → custom post-chunk      │
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
