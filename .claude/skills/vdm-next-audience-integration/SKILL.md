---
name: vdm-next-integration
description: Create the transformation logic for a new VDM Next audience destination. Implements record processing, identifier hashing, batching, and API request building for audience-based integrations.
argument-hint: <destination-name>
---

# VDM Next — Audience Integration (rudder-transformer)

**Objective:** Build the transformation logic for a new VDM Next audience destination — process warehouse record events into HTTP API requests that add/remove users from audience segments, with identifier normalization, hashing, and batching.

## Inputs

- **Destination name**: `$ARGUMENTS[0]` (lowercase, e.g., `fb_custom_audience`, `linkedin_audience`)

## Context

This is the transformer step in building a VDM Next audience integration.

Audience destinations share these traits:
- Operations are **add** (insert/update) and **remove** (delete) on audience membership
- Records contain **identifiers** (email, phone, ad IDs) that may require **normalization and hashing**
- Batching is by **user count** (destination API limits) and optionally **payload size**
- Some destinations support multiple **audience subtypes** (user vs company, standard vs value-based)

## File Structure

### Source Files

```
src/v0/destinations/<dest_name>/
├── routerTransform.ts        # BatchDestination subclass (default — uses batching framework)
├── transform.ts              # Per-event transform logic (processEvent), also legacy router entry
├── types.ts                  # Zod schemas + TypeScript types for record events
├── config.ts                 # Constants: endpoints, action maps, batch sizes, identifier configs
├── util.ts                   # (Optional) Normalization, hashing, field processing, API helpers
├── networkHandler.ts         # (Optional) Custom network/delivery handler
├── routerTransform.test.ts   # Unit tests for router transform
└── util.test.ts              # (Optional) Unit tests for utilities
```

### Integration Test Files

```
test/integrations/destinations/<dest_name>/
├── router/
│   └── data.ts               # Router test cases (data-driven)
└── (optional additional test organization below)
```

For destinations with delivery-layer testing or complex test organization:
```
├── mocks.ts                  # Jest mocks (e.g., fake timers, batch size overrides)
├── network.ts                # HTTP mock responses for network handler tests
├── router/
│   ├── data.ts               # Router test data entry point
│   ├── rETL.ts               # RETL-specific test fixtures
│   └── eventStream.ts        # (Optional) Event stream test fixtures
└── dataDelivery/
    ├── data.ts               # Delivery test entry point
    └── business.ts           # Business-level delivery tests
```

## Reference

Find following VDM audience destinations under `src/v0/destinations/`. Read complete examples to understand the full implementation pattern:

- **LinkedIn Audience** (`src/v0/destinations/linkedin_audience/`) — Clean, minimal pattern with Zod schemas, `processAudienceRecord` usage, user vs company audience types
- **Facebook Custom Audience** (`src/v0/destinations/fb_custom_audience/`) — Full-featured pattern with VDM v1/v2 flow detection, value-based audiences, custom normalization, shared network handler. For new audience integration, VDM v1 support is not needed.
- **TikTok Audience** (`src/v0/destinations/tiktok_audience/`) — Two-stage pipeline with `prepareIdentifiersPayload`, Zod schemas with `.passthrough()`

Also read the shared audience utilities:
- `src/v0/util/audienceUtils.ts` — `processAudienceRecord`, `AudienceField`, `HashingType`, `validateHashingConsistency`

---

## config.ts — Constants, Actions, and Identifier Configuration

```typescript
import { EVENT_TYPES } from '../../util/recordUtils';

// Map record actions to destination API actions
// insert and update both map to the "add" operation for audience destinations
export const ACTION_RECORD_MAP: Record<string, string> = {
  [EVENT_TYPES.INSERT]: 'ADD',    // or destination-specific value
  [EVENT_TYPES.UPDATE]: 'ADD',    // In majority of destinations, it's upsert API, so both INSERT/UPDATE maps to same endpoint
  [EVENT_TYPES.DELETE]: 'REMOVE', // or destination-specific value
};

export const DESTINATION_TYPE = '<dest_name>';

// API endpoints — may be parameterized by audienceId or audience type
export const BASE_URL = 'https://api.<destination>.com/v1';

// Endpoint may be a function when URL depends on runtime values
export function getEndpoint(audienceId: string): string {
  return `${BASE_URL}/audiences/${audienceId}/users`;
}

// Batch limits — audience destinations often allow large batches
export const MAX_BATCH_SIZE = 10000; // Facebook: 10000, LinkedIn: 5000, TikTok: 50

// Identifier fields supported by the destination
export const SUPPORTED_IDENTIFIER_FIELDS = [
  'EMAIL', 'PHONE', 'MADID', 'EXTERN_ID',
] as const;
```

**Reference:**
- `src/v0/destinations/fb_custom_audience/config.ts` — `schemaFields`, `MAX_USER_COUNT`, `getEndPoint()`
- `src/v0/destinations/linkedin_audience/config.ts` — `ACTION_RECORD_MAP`, `USER_IDENTIFIER_MAP`, `COMPANY_TRAITS`, `MAX_BATCH_SIZE`
- `src/v0/destinations/tiktok_audience/config.ts` — `ACTION_RECORD_MAP`, `TRAITS_SET`

---

## types.ts — Zod Schemas and Types

Use Zod schemas for runtime validation. Derive TypeScript types with `z.infer<>`.

```typescript
import { z } from 'zod';
import { RouterTransformationResponse } from '../../../types';

// Validate destination config
const DestinationSchema = z
  .object({
    ID: z.string(),
    Config: z
      .object({
        // Destination-level config (from dashboard settings)
      })
      .passthrough(),
  })
  .passthrough();

// Validate connection config — must match webapp form output
const ConnectionSchema = z
  .object({
    config: z
      .object({
        destination: z
          .object({
            audienceId: z.union([z.string(), z.number()]),
            isHashRequired: z.boolean(),
            // Audience type if destination supports multiple (e.g., 'user' | 'company')
            // audienceType: z.enum(['user', 'company']),
            // Value-based flag if applicable
            // isValueBasedAudience: z.boolean().optional(),
          })
          .passthrough(),
      })
      .passthrough(),
  })
  .passthrough();

// Validate the record message
const MessageSchema = z
  .object({
    type: z.enum(['record'], {
      required_error: 'message Type is not present. Aborting message.',
    }),
    action: z.enum(['insert', 'delete', 'update'], {
      required_error: 'action is not present. Aborting message.',
    }),
    userId: z.string().optional(),
    identifiers: z.record(z.string(), z.string().nullable()),
    fields: z.record(z.string(), z.string().nullable()),
  })
  .passthrough();

// Validate metadata with auth secrets
const MetadataSchema = z
  .object({
    workspaceId: z.string(),
    secret: z
      .object({
        accessToken: z.string({
          required_error: 'Access token is required. Authorize the destination.',
        }),
      })
      .passthrough(),
  })
  .passthrough();

// Compose the full router request schema
export const RecordRouterRequestSchema = z
  .object({
    message: MessageSchema,
    destination: DestinationSchema,
    connection: ConnectionSchema,
    metadata: MetadataSchema,
  })
  .passthrough();

// Derive TypeScript type from Zod schema
export type RecordRequest = z.infer<typeof RecordRouterRequestSchema>;

// Response type for the record processor
export type ProcessRecordsResponse = {
  failedResponses: RouterTransformationResponse[];
  successfulResponses: RouterTransformationResponse[];
};

// Destination-specific payload types
export type AudiencePayload = {
  action: string;
  // User-level identifiers (destination-specific structure)
  [key: string]: unknown;
};
```

**Reference:**
- `src/v0/destinations/linkedin_audience/types.ts` — Complete Zod schema example with `z.enum`, custom error messages, and `z.infer<>` type derivation
- `src/v0/destinations/tiktok_audience/recordTypes.ts` — Zod schemas with `.passthrough()` pattern

---

## Identifier Processing — The `processAudienceRecord` Utility

Audience destinations require normalizing and hashing user identifiers before sending to the API. Use the shared `processAudienceRecord` utility from `src/v0/util/audienceUtils.ts`.

### Defining Identifier Field Configs

Each audience destination defines a field config map describing how to normalize, validate, and hash each identifier type:

```typescript
import { AudienceField, HashingType } from '../../util/audienceUtils';
import validator from 'validator';

const IDENTIFIER_FIELD_CONFIG: Record<string, AudienceField> = {
  email: {
    hashingType: HashingType.SHA256,
    normalize: (value: string) => value.replace(/\s/g, '').toLowerCase(),
    validate: (normalized: string) => validator.isEmail(normalized),
  },
  phone: {
    hashingType: HashingType.SHA256,
    normalize: (value: string) => value.replace(/[^\d+]/g, ''),
    validate: (normalized: string) => /^\+?\d+$/.test(normalized),
  },
  advertisingId: {
    hashingType: HashingType.NONE,  // No hashing for device IDs
    normalize: (value: string) => value.trim(),
    validate: (normalized: string) => normalized.length > 0,
  },
};
```

### Using `processAudienceRecord`

```typescript
import { processAudienceRecord } from '../../util/audienceUtils';

const processedIdentifiers = processAudienceRecord(
  record.identifiers,
  {
    fieldConfigs: IDENTIFIER_FIELD_CONFIG,
    destination: {
      workspaceId: metadata.workspaceId,
      id: destination.ID,
      type: DESTINATION_TYPE,
      config: { isHashRequired: destConfig.isHashRequired },
    },
  },
);
// Returns Record<string, string> — normalized, validated, hashed identifiers
```

### Processing Pipeline Per Field

```
Raw value → Null check → Hashing consistency check → Normalization → Validation → Hashing → Result
```

1. **Null check**: Skip null, empty, or false values
2. **Hashing consistency**: Detects mismatches between `isHashRequired` flag and actual data (emits `audience_hashing_inconsistency` metric)
3. **Pre-hashed bypass**: If `isHashRequired=false` and value matches hash format, pass through as-is
4. **Normalize**: Apply field-specific normalization (lowercase, strip whitespace, etc.)
5. **Validate**: Apply field-specific validation (email format, phone format, etc.)
6. **Hash**: Apply SHA-256/SHA-512/MD5 if `isHashRequired=true` and field is hashable

**Reference:**
- `src/v0/util/audienceUtils.ts` — `processAudienceRecord()`, `AudienceField`, `HashingType`, `validateHashingConsistency()`
- `src/v0/destinations/linkedin_audience/transform.ts` — `USERS_IDENTIFIER_CONFIG` using `processAudienceRecord`
- `src/v0/destinations/fb_custom_audience/util.ts` — Custom normalization per Facebook field (EMAIL, PHONE, GEN, FN, LN, CT, ST, ZIP, COUNTRY, MADID, EXTERN_ID, LOOKALIKE_VALUE)

---

## transform.ts — Per-Event Transform / Legacy Router Entry Point

When using the batching framework (default), `transform.ts` contains the per-event transformation logic called from `routerTransform.ts`. It does not export `processRouterDest`.

When using the legacy manual approach, `transform.ts` is the router entry point exporting `processRouterDest`.

### Pattern A: Delegate to recordTransform (legacy, for complex destinations)

```typescript
import {
  InstrumentationError,
  groupByInBatches,
} from '@rudderstack/integrations-lib';
import type { RouterTransformationResponse } from '../../../types';
import { getSuccessRespEvents, handleRtTfSingleEventError } from '../../util';
import { processRecords } from './recordTransform';

const processRouterDest = async (
  events: unknown[],
): Promise<RouterTransformationResponse[]> => {
  if (!events || events.length === 0) return [];

  const groupedEvents = await groupByInBatches(
    events,
    (event: any) => event.message?.type?.toLowerCase(),
  );

  const failedResponses: RouterTransformationResponse[] = [];
  const successfulResponses: RouterTransformationResponse[] = [];

  if (groupedEvents.record) {
    const response = processRecords(groupedEvents.record);
    failedResponses.push(...response.failedResponses);
    successfulResponses.push(...response.successfulResponses);
  }

  const unsupported = Object.keys(groupedEvents).filter((t) => t !== 'record');
  for (const type of unsupported) {
    for (const event of groupedEvents[type]) {
      failedResponses.push(
        handleRtTfSingleEventError(
          event,
          new InstrumentationError(`unsupported event type: ${type}`),
          {},
        ),
      );
    }
  }

  return [...failedResponses, ...successfulResponses];
};

export { processRouterDest };
```

### Pattern B: Inline validation + group + batch (legacy, for simpler destinations)

When the destination is simple enough that a separate `recordTransform.ts` adds no value, the transform logic can live directly in `transform.ts`:

```typescript
export async function processRouterDest(
  events: unknown[],
): Promise<RouterTransformationResponse[]> {
  const successPayloads: Array<{ payload: AudiencePayload; event: RecordRequest }> = [];
  const failedResponses: RouterTransformationResponse[] = [];

  // Stage 1: Validate and transform each event
  for (const event of events) {
    try {
      const validated = validateEvent(event);
      const payload = preparePayload(validated);
      successPayloads.push({ payload, event: validated });
    } catch (error) {
      failedResponses.push(handleRtTfSingleEventError(event, error, {}));
    }
  }

  // Stage 2: Group by action, batch, build API requests
  const grouped = groupBy(successPayloads, (p) => p.payload.action);
  const successfulResponses: RouterTransformationResponse[] = [];

  for (const [action, payloads] of Object.entries(grouped)) {
    const batches = chunk(payloads, MAX_BATCH_SIZE);
    for (const batch of batches) {
      const request = buildRequest(batch, action);
      const metadataList = batch.map((p) => p.event.metadata);
      successfulResponses.push(
        getSuccessRespEvents(request, metadataList, batch[0].event.destination, true),
      );
    }
  }

  return [...failedResponses, ...successfulResponses];
}
```

**Reference:**
- `src/v0/destinations/tiktok_audience/transform.ts` — Pattern A with `groupByInBatches`
- `src/v0/destinations/linkedin_audience/transform.ts` — Pattern B with inline validation + grouping
- `src/v0/destinations/fb_custom_audience/transform.ts` — Hybrid pattern supporting both `record` and `audiencelist` message types

---

## recordTransform.ts — Core Record Processing

This is where the main business logic lives. The processing follows two stages.

### Stage 1: Validate & Extract Per Event

For each event:
1. **Validate** with Zod schema (`safeParse` -> `InstrumentationError` on failure)
2. **Extract** identifiers and fields from `event.message`
3. **Process identifiers** via `processAudienceRecord` (normalize, validate, hash)
4. **Validate** processed output (e.g., ensure at least one valid identifier remains)
5. **Map action** to destination API operation (insert/update -> ADD, delete -> REMOVE)

### Stage 2: Group & Batch

**Default approach: Use the native batching framework.** The framework handles grouping, chunking, error wrapping, and response formatting automatically. You only implement per-event transformation and batch strategy configuration.

Instead of writing manual grouping/batching logic, extend the `BatchDestination` abstract class and export it as `Integration` from `routerTransform.ts`. The framework orchestrator (`processBatchedDestination`) takes care of:
1. Input validation via your Zod schema (`getInputSchema()`)
2. Per-event transformation via your `transformEvent()`
3. Automatic grouping by composite key (endpoint, method, headers, params, `internalGroupKey`)
4. Chunking via your batch strategy (`getBatchStrategy()`)
5. Converting batch groups into `RouterTransformationResponse[]`
6. Error handling — failed events are wrapped and separated from successes

#### File Structure (Batching Framework)

```
src/v0/destinations/<dest_name>/
├── routerTransform.ts        # BatchDestination subclass (exported as Integration)
├── transform.ts              # Per-event transform logic (processEvent)
├── types.ts                  # Zod schemas, TypeScript types, payload types
├── config.ts                 # Constants, endpoints, action maps, batch sizes
├── util.ts                   # (Optional) Normalization, hashing, API helpers
└── routerTransform.test.ts   # Unit tests
```

#### routerTransform.ts — BatchDestination Implementation

```typescript
import { z, ZodType } from 'zod';
import { InstrumentationError } from '@rudderstack/integrations-lib';
import { BatchDestination } from '../../../services/destination/nativeBatching/batchDestination';
import { ChunkBatchStrategy } from '../../../services/destination/nativeBatching/chunkBatchStrategy';
import { CustomBatchStrategy } from '../../../services/destination/nativeBatching/customBatchStrategy';
import type { TransformedEvent } from '../../../services/destination/nativeBatching/types';
import type { BatchStrategy } from '../../../services/destination/nativeBatching/types';
import type { RouterTransformationRequestData } from '../../../types';
import { processAudienceRecord } from '../../util/audienceUtils';
import { RecordRouterRequestSchema, type RecordRequest } from './types';
import { ACTION_RECORD_MAP, getEndpoint, MAX_BATCH_SIZE, DESTINATION_TYPE, IDENTIFIER_CONFIG } from './config';

// Payload type for each individual transformed event body
type AudienceEventPayload = {
  action: string;
  processedIdentifiers: Record<string, string>;
  fields: Record<string, string | null>;
};

class AudienceIntegration extends BatchDestination<AudienceEventPayload> {
  // Step 1: Transform a single event into the intermediate payload
  transformEvent(input: RouterTransformationRequestData): TransformedEvent<AudienceEventPayload> {
    const event = input as unknown as RecordRequest;
    const { message, connection, destination, metadata } = event;
    const { action, identifiers, fields } = message;
    const destConfig = connection.config.destination;

    // Process identifiers: normalize, validate, hash
    const processedIdentifiers = processAudienceRecord(identifiers, {
      fieldConfigs: IDENTIFIER_CONFIG,
      destination: {
        workspaceId: metadata.workspaceId,
        id: destination.ID,
        type: DESTINATION_TYPE,
        config: { isHashRequired: destConfig.isHashRequired },
      },
    });

    if (Object.keys(processedIdentifiers).length === 0) {
      throw new InstrumentationError('All identifier values are empty after processing.');
    }

    const mappedAction = ACTION_RECORD_MAP[action];

    return {
      body: { action: mappedAction, processedIdentifiers, fields },
      endpoint: getEndpoint(String(destConfig.audienceId)),
      method: mappedAction === 'REMOVE' ? 'DELETE' : 'POST',
      headers: {
        Authorization: `Bearer ${metadata.secret.accessToken}`,
        'Content-Type': 'application/json',
      },
      // internalGroupKey forces separate batches per action (ADD vs REMOVE)
      internalGroupKey: mappedAction,
    };
  }

  // Step 2: Define how batches are chunked and wrapped
  getBatchStrategy(): BatchStrategy<AudienceEventPayload> {
    // Option A: ChunkBatchStrategy — size/count-based chunking with a wrapper function
    return new ChunkBatchStrategy<AudienceEventPayload>({
      maxItems: MAX_BATCH_SIZE,
      // maxPayloadSize: '10MB',  // Optional: also limit by total request size
      wrapBody: (bodies) => {
        // Build the destination-specific request body from the batch of event payloads
        // This is where you assemble the final API payload structure
        return buildRequestBody(bodies);
      },
    });

    // Option B: CustomBatchStrategy — full control over batching logic
    // return new CustomBatchStrategy<AudienceEventPayload>((payloads) => {
    //   // Custom grouping, chunking, and wrapping logic
    //   // Return: BatchGroup[] = Array<{ body: Record<string, unknown>, jobIds: Set<number> }>
    // });
  }

  // Step 3: Zod schema for input validation (run before transformEvent)
  getInputSchema(): ZodType {
    return RecordRouterRequestSchema;
  }
}

// Destination-specific: assemble the API request body from a batch of payloads
function buildRequestBody(bodies: AudienceEventPayload[]): Record<string, unknown> {
  // Pattern varies by destination:

  // LinkedIn style — array of elements:
  // return {
  //   elements: bodies.map((b) => ({
  //     action: b.action,
  //     userIds: Object.entries(b.processedIdentifiers).map(([k, v]) => ({
  //       idType: USER_IDENTIFIER_MAP[k], idValue: v,
  //     })),
  //     ...b.fields,
  //   })),
  // };

  // Facebook style — schema + data matrix:
  // const schema = Object.keys(bodies[0].processedIdentifiers);
  // return {
  //   payload: {
  //     schema,
  //     data: bodies.map((b) => schema.map((key) => b.processedIdentifiers[key])),
  //     is_raw: false,
  //   },
  // };

  // TikTok style — grouped identifier list:
  // return {
  //   id_schema: Object.keys(bodies[0].processedIdentifiers),
  //   user_list: bodies.map((b) => ({ id: Object.values(b.processedIdentifiers) })),
  // };

  throw new Error('Implement destination-specific request body builder');
}

export const Integration = AudienceIntegration;
```

#### Enabling the Batching Framework

Register the destination in `src/constants/batchedDestinationsMap.ts`:

```typescript
export const batchedDestinationsMap: Record<string, true> = {
  POSTHOG: true,
  CUSTOM_AUDIENCE: true,
  <DEST_NAME_UPPER>: true,  // Add your destination here
};
```

When enabled, the platform routes events through `processBatchedDestination()` instead of `processRouterDest()`. For gradual rollout before GA, use the env var pattern `{DEST_NAME_UPPER}_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS` (comma-separated workspace IDs or `ALL`).

#### Batch Strategy Options

| Strategy | When to Use | Configuration |
|----------|------------|---------------|
| `ChunkBatchStrategy` | Standard chunking by item count and/or payload size (default) | `maxItems`, `maxPayloadSize`, `wrapBody` |
| `CustomBatchStrategy` | Need full control over batch grouping logic | Custom `batchFn` callback returning `BatchGroup[]` |

`ChunkBatchStrategy` handles:
- Splitting by `maxItems` (e.g., 10000 users per request)
- Splitting by `maxPayloadSize` (e.g., `'10MB'`) — serializes with `wrapBody` to measure
- Returning `BatchGroup[]` with `{ body, jobIds }` for each chunk

#### The `internalGroupKey` Pattern

Use `internalGroupKey` in `TransformedEvent` to force events into separate batches beyond the default grouping by (endpoint, method, headers, params). For audience destinations, this is typically the action:

```typescript
return {
  body: { ... },
  endpoint: getEndpoint(audienceId),
  method: 'POST',
  internalGroupKey: action,  // 'ADD' and 'REMOVE' events get separate batches
};
```

#### TransformedEvent Type

```typescript
type TransformedEvent<TBody> = {
  body: TBody;                    // Individual event payload
  endpoint: string;               // API endpoint
  method: string;                 // HTTP method
  headers?: Record<string, unknown>;
  params?: Record<string, unknown>;
  internalGroupKey?: string;      // Extra grouping dimension
};
```

**Reference:**
- `src/v0/destinations/posthog/routerTransform.ts` — Complete `BatchDestination` implementation with `ChunkBatchStrategy`
- `src/services/destination/nativeBatching/batchDestination.ts` — Abstract base class
- `src/services/destination/nativeBatching/chunkBatchStrategy.ts` — Size/count chunking strategy
- `src/services/destination/nativeBatching/customBatchStrategy.ts` — Custom batch logic strategy
- `src/services/destination/nativeBatching/processBatchedDestination.ts` — Framework orchestrator
- `src/constants/batchedDestinationsMap.ts` — Feature flag registry

---

### Legacy Manual Batching (for reference only)

Older audience destinations (fb_custom_audience, linkedin_audience, tiktok_audience) use manual grouping and batching in `processRouterDest` / `recordTransform.ts`. This pattern is still functional but new destinations should prefer the batching framework above.

The manual pattern:
1. Loop over events, validate, group into a `Map<string, PreparedPayload[]>` by action
2. For each group, slice into `MAX_BATCH_SIZE` chunks
3. Build request with `defaultRequestConfig()`, call `getSuccessRespEvents()`
4. Catch errors per-event with `handleRtTfSingleEventError()`

```typescript
// Manual Stage 2 (legacy) — see full template in the code block below
for (const [action, payloads] of groupedByAction) {
  for (let i = 0; i < payloads.length; i += MAX_BATCH_SIZE) {
    const batch = payloads.slice(i, i + MAX_BATCH_SIZE);
    const request = defaultRequestConfig();
    request.body.JSON = buildRequestBody(batch, action);
    request.endpoint = getEndpoint(String(destConfig.audienceId));
    request.method = action === 'REMOVE' ? 'DELETE' : 'POST';
    request.headers = { Authorization: `Bearer ${accessToken}` };
    response.successfulResponses.push(
      getSuccessRespEvents(request, metadataList, destination, true),
    );
  }
}
```

**Reference:**
- `src/v0/destinations/linkedin_audience/transform.ts` — Inline two-stage processing with `processAudienceRecord` and action grouping
- `src/v0/destinations/fb_custom_audience/recordTransform.ts` — VDM v1/v2 flow detection, `preparePayload` with action grouping, payload size batching
- `src/v0/destinations/tiktok_audience/recordTransform.ts` — Two-stage pipeline with `prepareIdentifiersPayload`

---

## Audience-Specific Patterns

### Multiple Audience Types

Some destinations support different audience types with different identifier schemas and endpoints:

```typescript
const { audienceType } = connection.config.destination;

if (audienceType === 'user') {
  // Use user identifier config (email, phone, ad IDs)
  // Endpoint: /segments/{id}/users
  return prepareUserPayload(event);
} else if (audienceType === 'company') {
  // Use company identifier config (company name, domain, org URN)
  // Endpoint: /segments/{id}/companies
  // Company identifiers are typically NOT hashed
  return prepareCompanyPayload(event);
}
```

**Reference:** `src/v0/destinations/linkedin_audience/transform.ts` — `prepareUserTypePayload()` vs `prepareCompanyTypePayload()`

### Value-Based Audiences

Some destinations support value-based audiences where each user has an associated numeric value:

```typescript
const { isValueBasedAudience } = connection.config.destination;

if (isValueBasedAudience) {
  // Ensure LOOKALIKE_VALUE field is present in identifiers
  // Validate it's numeric and >= 0
  // Include it in the schema/data alongside other identifiers
}
```

**Reference:** `src/v0/destinations/fb_custom_audience/recordTransform.ts` — Value-based audience handling

### HTTP Method Per Action

```typescript
// Facebook: POST for add, DELETE for remove
request.method = action === 'REMOVE' ? 'DELETE' : 'POST';

// LinkedIn/TikTok: Always POST, action is inside the payload body
request.method = 'POST';
```

### Auth Header Patterns

```typescript
// Bearer token (LinkedIn)
request.headers = { Authorization: `Bearer ${accessToken}` };

// Query parameter (Facebook)
request.params = { access_token: accessToken };

// Custom header (TikTok)
request.headers = { 'Access-Token': accessToken };
```

---

## networkHandler.ts — Custom Network Handler (Optional)

Some audience destinations need custom network/delivery handling. If the destination API returns errors in a non-standard format, create a custom network handler:

```typescript
export { networkHandler, errorResponseHandler } from '../../util/<platform>Utils/networkHandler';
```

For destinations with standard REST error responses, no custom network handler is needed.

**Reference:** `src/v0/destinations/fb_custom_audience/networkHandler.ts` — Re-exports shared Facebook network handler

---

## Key Shared Utilities

```typescript
// From src/v0/util/index.js
import {
  defaultRequestConfig,      // Creates REST request template
  getSuccessRespEvents,       // Wraps successful transformation
  handleRtTfSingleEventError, // Wraps error for a single event
} from '../../util';

// From @rudderstack/integrations-lib
import {
  InstrumentationError,  // Bad input data — aborts event, no retry
  ConfigurationError,     // Bad configuration — aborts event, no retry
  formatZodError,         // Formats Zod validation errors
  groupByInBatches,       // Groups events by a key function
} from '@rudderstack/integrations-lib';

// Record action constants
import { EVENT_TYPES } from '../../util/recordUtils';
// EVENT_TYPES = { INSERT: 'insert', UPDATE: 'update', DELETE: 'delete' }

// Audience identifier processing utilities
import {
  processAudienceRecord,
  AudienceField,
  HashingType,
  validateHashingConsistency,
  isValidPhoneNumber,
} from '../../util/audienceUtils';
```

---

## Error Handling Strategy

| Scenario | Error Type | Handling |
|----------|-----------|----------|
| Zod validation failure | `InstrumentationError(formatZodError(...))` | Fails single event |
| Invalid/unknown identifier keys | `InstrumentationError` | Fails single event |
| All identifiers empty after processing | `InstrumentationError` | Fails single event |
| Unsupported audience type | `ConfigurationError` | Fails single event |
| Unsupported message type | `InstrumentationError` | Fails single event |
| Group-level error (batch build failure) | Caught in group loop | Fails all events in group |
| Hashing consistency violation (strict mode) | `InstrumentationError` | Fails single event |

For destinations with custom network handlers at delivery time:

| Scenario | Error Type | Effect |
|----------|-----------|--------|
| Token expired / invalid (401/190) | Retryable with token refresh | Triggers OAuth re-authorization |
| Rate limited (429) | Network error with backoff | Retries |
| Permission denied (294/403) | Abortable error | Permanent failure |
| Server error (5xx) | Network error | Retries |

---

## Test Structure

> **Note:** Follow the conventions defined in `.claude/skills/writing-tests/SKILL.md` for all test writing — including `it.each()` for table-driven tests, fixtures in `common.ts` when shared, mocking only leaf dependencies, and computing expected hashed values via hash functions.

### Unit Tests (co-located)

**routerTransform.test.ts** — Test the `Integration` class methods directly with a `buildBaseEvent()` factory.

```typescript
import { processRecords } from './recordTransform';
import stats from '../../../util/stats';

jest.mock('../../../util/stats', () => ({
  increment: jest.fn(),
}));

const buildBaseEvent = (
  overrides: Partial<RecordRequest['message']> = {},
  destConfigOverrides = {},
): RecordRequest => ({
  message: {
    type: 'record',
    action: 'insert',
    userId: 'user-1',
    identifiers: { email: 'user@example.com' },
    fields: {},
    ...overrides,
  },
  destination: { ID: 'dest-1', Config: {} },
  connection: {
    config: {
      destination: {
        audienceId: '12345',
        isHashRequired: true,
        schemaVersion: '1.1',
        ...destConfigOverrides,
      },
    },
  },
  metadata: { workspaceId: 'ws-1', secret: { accessToken: 'token' } },
});

describe('processRecords', () => {
  beforeEach(() => jest.clearAllMocks());

  it('valid insert -> successful response with hashed identifiers', () => {
    const event = buildBaseEvent();
    const { failedResponses, successfulResponses } = processRecords([event]);
    expect(failedResponses).toHaveLength(0);
    expect(successfulResponses).toHaveLength(1);
  });

  it('invalid identifier key -> failed response', () => {
    const event = buildBaseEvent({ identifiers: { UNKNOWN_KEY: 'value' } });
    const { failedResponses } = processRecords([event]);
    expect(failedResponses).toHaveLength(1);
  });

  it('all null identifiers -> failed response', () => {
    const event = buildBaseEvent({ identifiers: { email: null } });
    const { failedResponses } = processRecords([event]);
    expect(failedResponses).toHaveLength(1);
  });

  it('pre-hashed values pass through when isHashRequired=false', () => {
    const hashedEmail = 'a'.repeat(64);
    const event = buildBaseEvent(
      { identifiers: { email: hashedEmail } },
      { isHashRequired: false },
    );
    const { successfulResponses } = processRecords([event]);
    expect(successfulResponses).toHaveLength(1);
  });

  it('mixed actions -> grouped into separate requests', () => {
    const insert = buildBaseEvent({ action: 'insert' });
    const del = buildBaseEvent({ action: 'delete' });
    const { successfulResponses } = processRecords([insert, del]);
    expect(successfulResponses).toHaveLength(2);
  });

  it('missing access token -> Zod validation error', () => {
    const event = buildBaseEvent();
    delete (event.metadata as any).secret;
    const { failedResponses } = processRecords([event]);
    expect(failedResponses).toHaveLength(1);
  });
});
```

**Reference:**
- `src/v0/destinations/tiktok_audience/recordTransform.test.ts`
- `src/v0/destinations/fb_custom_audience/util.test.ts`

### Integration Tests

**router/data.ts** — Data-driven test cases with `input.request.body` and `output.response.body`.

```typescript
export const data = [
  {
    name: '<dest_name>',
    description: 'Record insert with valid identifiers -> successful batched response',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'record',
                action: 'insert',
                userId: 'user-1',
                identifiers: { email: 'user@example.com', phone: '+15551234567' },
                fields: { name: 'Test User' },
              },
              metadata: {
                jobId: 1, workspaceId: 'ws-1',
                secret: { accessToken: 'valid-token' }, userId: 'u1',
              },
              destination: {
                ID: 'dest-1',
                DestinationDefinition: { Name: '<DEST_NAME_UPPER>', Config: {} },
                Config: {},
              },
              connection: {
                config: {
                  destination: {
                    audienceId: '12345', isHashRequired: true, schemaVersion: '1.1',
                  },
                },
              },
            },
          ],
          destType: '<dest_name>',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: {
                version: '1', type: 'REST', method: 'POST',
                endpoint: '<EXPECTED_ENDPOINT>',
                headers: { Authorization: 'Bearer valid-token', 'Content-Type': 'application/json' },
                body: { JSON: { /* expected body */ }, JSON_ARRAY: {}, XML: {}, FORM: {} },
                files: {}, params: {},
              },
              metadata: [{ jobId: 1, workspaceId: 'ws-1', secret: { accessToken: 'valid-token' }, userId: 'u1' }],
              batched: true, statusCode: 200,
              destination: { /* destination object */ },
            },
          ],
        },
      },
    },
  },
  // Additional test cases:
  // - Delete action -> REMOVE operation
  // - Update action -> ADD operation
  // - Missing access token -> validation error
  // - Invalid identifier keys -> error response
  // - All null identifiers -> error response
  // - Pre-hashed values (isHashRequired=false)
  // - Batch size exceeded -> multiple batched requests
  // - Mixed actions -> separate batches per action
  // - Unsupported message type -> error response
  // - Multiple audience types (user vs company) if applicable
  // - Value-based audience if applicable
];
```

**Reference:**
- `test/integrations/destinations/linkedin_audience/router/data.ts`
- `test/integrations/destinations/fb_custom_audience/router/rETL.ts`
- `test/integrations/destinations/tiktok_audience/router/data.ts`

---

## Steps

1. Create `src/v0/destinations/<dest_name>/` folder
2. Create `config.ts` — action maps (`insert/update -> ADD`, `delete -> REMOVE`), endpoint constants or functions, batch sizes, identifier field configs (`AudienceField` objects with `hashingType`, `normalize`, `validate`), API version constants
3. Create `types.ts` — Zod schemas for message, destination, connection (with `audienceId`, `isHashRequired`, and any audience-type fields), metadata (with `secret.accessToken`); derive TypeScript types with `z.infer<>`; add destination-specific payload types
4. Create `transform.ts` — per-event transform logic: validate identifiers, process via `processAudienceRecord`, build the individual event payload
5. Create `routerTransform.ts` — extend `BatchDestination` with three methods:
   - `transformEvent()` — call transform logic, return `TransformedEvent` with endpoint, method, headers, `internalGroupKey` (action)
   - `getBatchStrategy()` — return `ChunkBatchStrategy` with `maxItems`/`maxPayloadSize` and `wrapBody` that builds the destination-specific request body
   - `getInputSchema()` — return the Zod schema for input validation
   - Export the class as `Integration`
6. Register in `src/constants/batchedDestinationsMap.ts` — add `<DEST_NAME_UPPER>: true`
7. Create `networkHandler.ts` (optional) — only if the destination API returns errors in a non-standard format requiring custom parsing
8. Create `routerTransform.test.ts` — unit tests with `buildBaseEvent()` factory covering: valid insert/update/delete, invalid identifiers, null identifiers, hashing on/off, batch overflow, mixed actions, missing auth
9. Create `test/integrations/destinations/<dest_name>/router/data.ts` — integration test cases covering: successful operations, validation errors, unsupported types, batching, audience subtypes, pre-hashed values
10. Run verification:
    ```bash
    npm run lint
    npm test -- --testPathPattern="<dest_name>" --no-coverage
    npm run test:ts -- component --destination=<dest_name>
    ```
