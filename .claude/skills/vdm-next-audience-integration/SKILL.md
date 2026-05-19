---
name: vdm-next-audience-integration
description: Create the transformation logic for a new VDM Next audience destination. Implements record processing, identifier hashing, batching, and API request building for audience-based integrations.
---

# VDM Next — Audience Integration (rudder-transformer)

**Objective:** Build the transformation logic for a new VDM Next audience destination — process warehouse record events into HTTP API requests that add/remove users from audience segments, with identifier normalization, hashing, and batching.

## Context

This is the transformer step in building a VDM Next audience integration.

Audience destinations share these traits:

- Operations are **add** (insert/update) and **remove** (delete) on audience membership
- Records contain **identifiers** (email, phone, ad IDs) that may require **normalization and hashing**
- Batching is by **user count** (destination API limits) and optionally **payload size**
- Some destinations support multiple **audience subtypes** (user vs company, standard vs value-based)

## File Structure

```
src/v0/destinations/<dest_name>/
├── routerTransform.ts        # BatchDestination subclass (exported as Integration)
├── types.ts                  # Zod schemas + TypeScript types for record events
├── config.ts                 # Constants: endpoints, action maps, batch sizes, identifier configs
├── utils.ts                  # (Optional) Normalization, hashing, field processing, API helpers
├── networkHandler.ts         # (Optional) Custom network/delivery handler
├── routerTransform.test.ts   # Unit tests for router transform
└── utils.test.ts             # (Optional) Unit tests for utilities
```

```
test/integrations/destinations/<dest_name>/
├── router/
│   └── data.ts               # Router test cases (data-driven)
└── (optional additional test organization below)
```

## Reference

**Primary reference** — uses the batching framework (the only pattern for new destinations):

- **Custom Audience** (`src/v0/destinations/custom_audience/`) — `BatchDestination` subclass with `CustomBatchStrategy`, field processing, hashing, auth headers. **Read this first.**

For audience-specific domain patterns (identifier schemas, hashing configs, payload formats):

- **LinkedIn Audience** (`src/v0/destinations/linkedin_audience/`) — User vs company audience types, `processAudienceRecord` usage, Zod schemas
- **Facebook Custom Audience** (`src/v0/destinations/fb_custom_audience/`) — Value-based audiences, custom per-field normalization, shared network handler
- **TikTok Audience** (`src/v0/destinations/tiktok_audience/`) — `prepareIdentifiersPayload`, Zod schemas with `.passthrough()`

Shared utilities:

- `src/v0/util/audienceUtils.ts` — `processAudienceRecord`, `AudienceField`, `HashingType`, `validateHashingConsistency`

For batching framework internals (abstract class, strategies, orchestrator):

- `.claude/skills/batching-framework/SKILL.md` — Full framework documentation

---

## config.ts — Constants, Actions, and Identifier Configuration

```typescript
import { EVENT_TYPES } from '../../util/recordUtils';

// Map record actions to destination API actions
// insert and update both map to the "add" operation for audience destinations
export const ACTION_RECORD_MAP: Record<string, string> = {
  [EVENT_TYPES.INSERT]: 'ADD', // or destination-specific value
  [EVENT_TYPES.UPDATE]: 'ADD', // In majority of destinations, it's upsert API, so both INSERT/UPDATE maps to same endpoint
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
export const SUPPORTED_IDENTIFIER_FIELDS = ['EMAIL', 'PHONE', 'MADID', 'EXTERN_ID'] as const;
```

**Reference:**

- `src/v0/destinations/custom_audience/constants.ts` — `SUPPORTED_HTTP_METHODS`, `AUTHENTICATION_TYPES`, `ERROR_MESSAGES`
- `src/v0/destinations/fb_custom_audience/config.ts` — `schemaFields`, `MAX_USER_COUNT`, `getEndPoint()`
- `src/v0/destinations/linkedin_audience/config.ts` — `ACTION_RECORD_MAP`, `USER_IDENTIFIER_MAP`, `COMPANY_TRAITS`, `MAX_BATCH_SIZE`

---

## types.ts — Zod Schemas and Types

Use Zod schemas for runtime validation. Derive TypeScript types with `z.infer<>`.

```typescript
import { z } from 'zod';

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
- `src/v0/destinations/custom_audience/types.ts` — TypeScript interfaces for action configs, field configs, connection config

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
    hashingType: HashingType.NONE, // No hashing for device IDs
    normalize: (value: string) => value.trim(),
    validate: (normalized: string) => normalized.length > 0,
  },
};
```

### Using `processAudienceRecord`

```typescript
import { processAudienceRecord } from '../../util/audienceUtils';

const processedIdentifiers = processAudienceRecord(record.identifiers, {
  fieldConfigs: IDENTIFIER_FIELD_CONFIG,
  destination: {
    workspaceId: metadata.workspaceId,
    id: destination.ID,
    type: DESTINATION_TYPE,
    config: { isHashRequired: destConfig.isHashRequired },
  },
});
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
- `src/v0/destinations/custom_audience/utils.ts` — `processFields()` with hashing via `processAudienceRecord`

---

## routerTransform.ts — BatchDestination Implementation

All new audience destinations use the native batching framework. Extend `BatchDestination` and implement three methods. For full framework documentation, see `.claude/skills/batching-framework/SKILL.md`.

```typescript
import { ZodType } from 'zod';
import { InstrumentationError } from '@rudderstack/integrations-lib';
import { BatchDestination } from '../../../services/destination/nativeBatching/batchDestination';
import { ChunkBatchStrategy } from '../../../services/destination/nativeBatching/chunkBatchStrategy';
import type { TransformedEvent, BatchStrategy } from '../../../services/destination/nativeBatching/types';
import type { RouterTransformationRequestData } from '../../../types';
import { processAudienceRecord } from '../../util/audienceUtils';
import { RecordRouterRequestSchema, type RecordRequest } from './types';
import {
  ACTION_RECORD_MAP,
  getEndpoint,
  MAX_BATCH_SIZE,
  DESTINATION_TYPE,
  IDENTIFIER_FIELD_CONFIG,
} from './config';

// Payload type for each individual transformed event body
type AudienceEventPayload = {
  action: string;
  processedIdentifiers: Record<string, string>;
  fields: Record<string, string | null>;
};

class AudienceIntegration extends BatchDestination<AudienceEventPayload> {
  // Transform a single event into the intermediate payload
  transformEvent(input: RouterTransformationRequestData): TransformedEvent<AudienceEventPayload> {
    const event = input as unknown as RecordRequest;
    const { message, connection, destination, metadata } = event;
    const { action, identifiers, fields } = message;
    const destConfig = connection.config.destination;

    // Process identifiers: normalize, validate, hash
    const processedIdentifiers = processAudienceRecord(identifiers, {
      fieldConfigs: IDENTIFIER_FIELD_CONFIG,
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

  // Define how batches are chunked and wrapped into API request bodies
  getBatchStrategy(): BatchStrategy<AudienceEventPayload> {
    return new ChunkBatchStrategy<AudienceEventPayload>({
      maxItems: MAX_BATCH_SIZE,
      // maxPayloadSize: '10MB',  // Optional: also limit by total request size
      wrapBody: (bodies) => buildRequestBody(bodies),
    });
  }

  // Zod schema for input validation (run before transformEvent)
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

### Enabling the Batching Framework

Register the destination in `src/constants/batchedDestinationsMap.ts`:

```typescript
export const batchedDestinationsMap: Record<string, true> = {
  POSTHOG: true,
  CUSTOM_AUDIENCE: true,
  <DEST_NAME_UPPER>: true,  // Add your destination here
};
```

**Reference:**

- `src/v0/destinations/custom_audience/routerTransform.ts` — Complete `BatchDestination` implementation with `CustomBatchStrategy`, field processing, auth headers
- `.claude/skills/batching-framework/SKILL.md` — `BatchDestination` abstract class, `ChunkBatchStrategy`, `CustomBatchStrategy`, `TransformedEvent` type, `internalGroupKey` pattern

---

## Audience-Specific Patterns

### Multiple Audience Types

Some destinations support different audience types with different identifier schemas and endpoints. Handle by branching on the audience type in `transformEvent()`:

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
method: action === 'REMOVE' ? 'DELETE' : 'POST';

// LinkedIn/TikTok: Always POST, action is inside the payload body
method: 'POST';
```

### Auth Header Patterns

```typescript
// Bearer token (LinkedIn)
headers: { Authorization: `Bearer ${accessToken}` };

// Query parameter (Facebook)
params: { access_token: accessToken };

// Custom header (TikTok)
headers: { 'Access-Token': accessToken };

// API key (custom_audience)
headers: { 'x-api-key': apiKey };
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
// From @rudderstack/integrations-lib
import {
  InstrumentationError, // Bad input data — aborts event, no retry
  ConfigurationError, // Bad configuration — aborts event, no retry
  formatZodError, // Formats Zod validation errors
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

Errors thrown in `transformEvent()` are automatically caught by the framework and wrapped into per-event error responses. Other events in the batch are not affected.

| Scenario                                    | Error Type               | Handling                  |
| ------------------------------------------- | ------------------------ | ------------------------- |
| Zod validation failure (from `getInputSchema`) | Framework auto-formats | Fails single event        |
| Invalid/unknown identifier keys             | `InstrumentationError`   | Fails single event        |
| All identifiers empty after processing      | `InstrumentationError`   | Fails single event        |
| Unsupported audience type                   | `ConfigurationError`     | Fails single event        |
| Batch strategy error (wrapBody failure)     | Caught in batch strategy | Fails all events in group |
| Hashing consistency violation (strict mode) | `InstrumentationError`   | Fails single event        |

For destinations with custom network handlers at delivery time:

| Scenario                          | Error Type                   | Effect                          |
| --------------------------------- | ---------------------------- | ------------------------------- |
| Token expired / invalid (401/190) | Retryable with token refresh | Triggers OAuth re-authorization |
| Rate limited (429)                | Network error with backoff   | Retries                         |
| Permission denied (294/403)       | Abortable error              | Permanent failure               |
| Server error (5xx)                | Network error                | Retries                         |

---

## Test Structure

> **Note:** Follow the conventions defined in `.claude/skills/writing-tests/SKILL.md` for all test writing — including `it.each()` for table-driven tests, fixtures in `common.ts` when shared, mocking only leaf dependencies, and computing expected hashed values via hash functions.

### Unit Tests (co-located)

**routerTransform.test.ts** — Test the `Integration` class via the framework's `processBatchedDestination` function.

```typescript
import { processBatchedDestination } from '../../../services/destination/nativeBatching/processBatchedDestination';
import { Integration } from './routerTransform';

const buildDestination = (overrides = {}) => ({
  ID: 'dest-1',
  Config: { ...overrides },
});

const buildConnection = (overrides = {}) => ({
  config: {
    destination: {
      audienceId: '12345',
      isHashRequired: true,
      ...overrides,
    },
  },
});

const buildInput = (jobId: number, messageOverrides = {}, connectionOverrides = {}) => ({
  message: {
    type: 'record',
    action: 'insert',
    userId: 'user-1',
    identifiers: { email: 'user@example.com' },
    fields: {},
    ...messageOverrides,
  },
  metadata: { jobId, workspaceId: 'ws-1', secret: { accessToken: 'token' } },
  destination: buildDestination(),
  connection: buildConnection(connectionOverrides),
});

describe('AudienceIntegration via processBatchedDestination', () => {
  it('valid insert -> successful batched response with hashed identifiers', async () => {
    const inputs = [buildInput(1), buildInput(2)];
    const results = await processBatchedDestination(inputs, Integration, {});
    const successes = results.filter((r) => r.statusCode === 200);
    expect(successes).toHaveLength(1);
    expect(successes[0].batched).toBe(true);
    expect(successes[0].metadata).toHaveLength(2);
    // Verify hashed values in batchedRequest.body.JSON
  });

  it('mixed actions -> grouped into separate batches', async () => {
    const inputs = [
      buildInput(1, { action: 'insert' }),
      buildInput(2, { action: 'insert' }),
      buildInput(3, { action: 'delete' }),
    ];
    const results = await processBatchedDestination(inputs, Integration, {});
    const successes = results.filter((r) => r.statusCode === 200);
    expect(successes).toHaveLength(2); // One ADD batch, one REMOVE batch
  });

  it('invalid identifier key -> per-event error response', async () => {
    const inputs = [buildInput(1, { identifiers: { UNKNOWN_KEY: 'value' } })];
    const results = await processBatchedDestination(inputs, Integration, {});
    expect(results[0].statusCode).toBe(400);
  });

  it('missing access token -> Zod validation error', async () => {
    const input = buildInput(1);
    delete (input.metadata as any).secret;
    const results = await processBatchedDestination([input], Integration, {});
    expect(results[0].statusCode).toBe(400);
  });

  it('pre-hashed values pass through when isHashRequired=false', async () => {
    const hashedEmail = 'a'.repeat(64);
    const inputs = [
      buildInput(1, { identifiers: { email: hashedEmail } }, { isHashRequired: false }),
    ];
    const results = await processBatchedDestination(inputs, Integration, {});
    const successes = results.filter((r) => r.statusCode === 200);
    expect(successes).toHaveLength(1);
    // Verify value passed through unchanged
  });
});
```

**Reference:**

- `src/v0/destinations/custom_audience/routerTransform.test.ts` — Complete test suite with `processBatchedDestination`, helper factories, action grouping, hashing, auth, and error cases

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
                jobId: 1,
                workspaceId: 'ws-1',
                secret: { accessToken: 'valid-token' },
                userId: 'u1',
              },
              destination: {
                ID: 'dest-1',
                DestinationDefinition: { Name: '<DEST_NAME_UPPER>', Config: {} },
                Config: {},
              },
              connection: {
                config: {
                  destination: {
                    audienceId: '12345',
                    isHashRequired: true,
                    schemaVersion: '1.1',
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
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: '<EXPECTED_ENDPOINT>',
                headers: {
                  Authorization: 'Bearer valid-token',
                  'Content-Type': 'application/json',
                },
                body: {
                  JSON: {
                    /* expected body with hashed identifiers */
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
                params: {},
              },
              metadata: [
                {
                  jobId: 1,
                  workspaceId: 'ws-1',
                  secret: { accessToken: 'valid-token' },
                  userId: 'u1',
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                /* destination object */
              },
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
4. Create `routerTransform.ts` — extend `BatchDestination` with three methods:
   - `transformEvent()` — validate identifiers, process via `processAudienceRecord`, map action, return `TransformedEvent` with endpoint, method, headers, `internalGroupKey` (action)
   - `getBatchStrategy()` — return `ChunkBatchStrategy` with `maxItems`/`maxPayloadSize` and `wrapBody` that builds the destination-specific request body
   - `getInputSchema()` — return the Zod schema for input validation
   - Export the class as `Integration`
5. Register in `src/constants/batchedDestinationsMap.ts` — add `<DEST_NAME_UPPER>: true`
6. Create `networkHandler.ts` (optional) — only if the destination API returns errors in a non-standard format requiring custom parsing
7. Create `routerTransform.test.ts` — unit tests using `processBatchedDestination(inputs, Integration, {})` covering: valid insert/update/delete, invalid identifiers, null identifiers, hashing on/off, batch overflow, mixed actions, missing auth
8. Create `test/integrations/destinations/<dest_name>/router/data.ts` — integration test cases covering: successful operations, validation errors, unsupported types, batching, audience subtypes, pre-hashed values
9. Run verification:
   ```bash
   npm run lint
   npm test -- --testPathPattern="<dest_name>" --no-coverage
   npm run test:ts -- component --destination=<dest_name>
   ```
