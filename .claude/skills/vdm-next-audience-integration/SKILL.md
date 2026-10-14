---
name: vdm-next-audience-integration
description: Create the transformation logic for a new VDM Next audience destination. Implements record processing, identifier hashing, batching, and API request building for audience-based integrations.
---

# VDM Next — Audience Integration (rudder-transformer)

Turn warehouse `record` events into API requests that add/remove users from an audience, with
identifier normalization, hashing and batching. Built on the batching framework — read
`.claude/skills/batching-framework/SKILL.md` for the class, strategies, `endpointPath`,
`internalGroupKey`, registration and testing; this skill covers only what is audience-specific.

Audience traits: **add** (insert/update) and **remove** (delete) membership; **identifiers**
(email, phone, ad ids) needing normalization + hashing; batching by **user count** (and maybe
payload size); sometimes **subtypes** (user vs company, standard vs value-based).

## Reference

- `src/v0/destinations/reddit_audience/` — **read first.** Modern shape: `makeRouterInputSchema`,
  typed generic, OAuth token from `metadata`, `processAudienceRecord`, `internalGroupKey` with its
  reason, `delivery.ts`.
- `src/v0/destinations/custom_audience/` — `CustomBatchStrategy`, template evaluation, auth headers,
  `routerTransform.test.ts` (complete suite).
- `src/v0/destinations/iterable_audience/delivery.ts` — identity-keyed failures.
- Domain patterns: `linkedin_audience/` (user vs company, `ACTION_RECORD_MAP`,
  `USER_IDENTIFIER_MAP`, `COMPANY_TRAITS`), `fb_custom_audience/` (value-based audiences, per-field
  normalization in `util.ts`, `recordTransform.ts`), `tiktok_audience/` (`prepareIdentifiersPayload`).
- `src/v0/util/audienceUtils.ts` — `processAudienceRecord`, `AudienceField`, `HashingType`,
  `validateHashingConsistency`, `isValidPhoneNumber`.
- Component fixtures: `test/integrations/destinations/{linkedin_audience,tiktok_audience}/router/data.ts`,
  `fb_custom_audience/router/rETL.ts`.

## File Structure

```
src/v0/destinations/<dest>/
├── routerTransform.ts   # DestinationIntegration subclass, exported as Integration
├── types.ts             # Zod schemas (makeRouterInputSchema) + payload types
├── config.ts            # endpoints, action map, batch limits
├── utils.ts             # (optional) identifier field config, body builders
├── delivery.ts          # (optional) only if response handling differs from default
├── routerTransform.test.ts
└── utils.test.ts        # (optional)
test/integrations/destinations/<dest>/  router/data.ts, common.ts, network.ts, live.ts
```

## config.ts

```typescript
import { EVENT_TYPES } from '../../util/recordUtils';

// Most audience APIs upsert, so insert and update share the "add" operation.
export const ACTION_RECORD_MAP: Record<string, string> = {
  [EVENT_TYPES.INSERT]: 'ADD',
  [EVENT_TYPES.UPDATE]: 'ADD',
  [EVENT_TYPES.DELETE]: 'REMOVE',
};
export const DESTINATION_TYPE = '<dest_name>';
export const getEndpoint = (audienceId: string) => `https://api.<destination>.com/v1/audiences/${audienceId}/users`;
export const MAX_BATCH_SIZE = 10000; // partner-doc constant (FB 10000, LinkedIn 5000, TikTok 50) — never a config field
```

## types.ts

```typescript
import { z } from 'zod';
import { makeRouterInputSchema } from '../../../services/destination/destinationIntegration/destinationIntegration';
import { RecordAction } from '../../../types/rudderEvents';

const ConnectionDestinationSchema = z.object({
  audienceId: z.union([z.string(), z.number()]), // must match the webapp form output
  isHashRequired: z.boolean(),
  // audienceType: z.enum(['user', 'company']), isValueBasedAudience: z.boolean().optional(),
}).passthrough();

export const RouterRequestSchema = makeRouterInputSchema({
  destinationConfig: z.object({}).passthrough(),
  message: z.object({
    type: z.literal('record'),
    action: z.nativeEnum(RecordAction),
    identifiers: z.record(z.string(), z.string().nullable()),
    fields: z.record(z.string(), z.string().nullable()),
  }).passthrough(),
  connectionConfig: z.object({ destination: ConnectionDestinationSchema }).passthrough(),
});

// metadata passes through unvalidated, so type the OAuth secret explicitly (reddit_audience types.ts)
export type RouterInput = z.infer<typeof RouterRequestSchema> & {
  metadata?: { secret?: { accessToken?: string } };
};
```

Reuse `EVENT_TYPES`, `RecordAction`, `RudderRecordV2` rather than redeclaring
(`code-structure` → "Reuse Existing Repo-Wide Utilities").

## Identifier Processing — `processAudienceRecord`

```typescript
import validator from 'validator';
import { AudienceField, HashingType, processAudienceRecord } from '../../util/audienceUtils';

export const IDENTIFIER_FIELD_CONFIG: Record<string, AudienceField> = {
  email: { hashingType: HashingType.SHA256, normalize: (v) => v.replace(/\s/g, '').toLowerCase(), validate: (n) => validator.isEmail(n) },
  phone: { hashingType: HashingType.SHA256, normalize: (v) => v.replace(/[^\d+]/g, ''), validate: (n) => /^\+?\d+$/.test(n) },
  advertisingId: { hashingType: HashingType.NONE, normalize: (v) => v.trim(), validate: (n) => n.length > 0 },
};

const processed = processAudienceRecord(message.identifiers, {
  fieldConfigs: IDENTIFIER_FIELD_CONFIG,
  destination: { workspaceId: this.destination.WorkspaceID, id: this.destination.ID, type: DESTINATION_TYPE,
                 config: { isHashRequired } },
}); // Record<string, string>
```

Per field: null/empty/false skipped → hashing-consistency check (mismatch with `isHashRequired`
emits `audience_hashing_inconsistency`) → pre-hashed bypass when `isHashRequired=false` and the
value looks hashed → normalize → validate → hash (SHA-256/SHA-512/MD5) when required and hashable.
FB's per-field normalizers (EMAIL, PHONE, GEN, FN, LN, CT, ST, ZIP, COUNTRY, MADID, EXTERN_ID,
LOOKALIKE_VALUE) are in `fb_custom_audience/util.ts`.

## routerTransform.ts

```typescript
class AudienceIntegration extends DestinationIntegration<AudiencePayload, typeof RouterRequestSchema> {
  constructor(...args: ConstructorParameters<typeof DestinationIntegration>) {
    super(...args);
    if (!this.connection) throw new InstrumentationError('Connection config is required for <dest>');
  }

  transformEvent(input: z.infer<typeof RouterRequestSchema>): TransformedEvent<AudiencePayload> {
    const { message, metadata } = input as RouterInput; // widens only the untyped metadata
    const accessToken = metadata?.secret?.accessToken;
    if (!accessToken) throw new OAuthSecretError('Secret or accessToken is not present in the metadata');

    const { audienceId, isHashRequired } = this.connection!.config.destination;
    const processed = processAudienceRecord(message.identifiers, { /* as above */ });
    if (Object.keys(processed).length === 0) {
      throw new InstrumentationError('All identifier values are empty after processing.');
    }
    const action = ACTION_RECORD_MAP[message.action];

    return {
      body: { action, processed },
      endpoint: getEndpoint(String(audienceId)),
      endpointPath: '/audiences/users',          // static metrics label, not the URL
      method: action === 'REMOVE' ? 'DELETE' : 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      internalGroupKey: action,                  // say which API constraint forces the split
    };
  }

  getBatchStrategy() {
    return new ChunkBatchStrategy<AudiencePayload>({ maxItems: MAX_BATCH_SIZE, wrapBody: buildRequestBody });
  }

  getInputSchema() { return RouterRequestSchema; }
}
export const Integration = AudienceIntegration;
```

`buildRequestBody` is destination-specific. Common shapes:

```typescript
// LinkedIn — elements array
({ elements: bodies.map((b) => ({ action: b.action,
   userIds: Object.entries(b.processed).map(([k, v]) => ({ idType: USER_IDENTIFIER_MAP[k], idValue: v })) })) });
// Facebook — schema + data matrix
({ payload: { schema, data: bodies.map((b) => schema.map((k) => b.processed[k])), is_raw: false } });
// TikTok — id_schema + user_list
({ id_schema: Object.keys(bodies[0].processed), user_list: bodies.map((b) => ({ id: Object.values(b.processed) })) });
```

If rows must align to one column order (FB, Reddit), put the column set in `internalGroupKey` too
and read it off `bodies[0]` in `wrapBody` (`reddit_audience` does, and fails loudly on misalignment
because Reddit silently accepts misaligned rows).

Register `<DEST_NAME_UPPER>: { routerTransform: true, batching: true }` in `src/features.ts`
(`batching-framework#enabling-the-framework`).

## Audience-Specific Patterns

- **Multiple audience types** — branch on `connection.config.destination.audienceType` in
  `transformEvent`: user (email/phone/ad ids, `/segments/{id}/users`) vs company (name, domain,
  org URN, `/segments/{id}/companies`, typically unhashed). See `linkedin_audience/transform.ts`
  `prepareUserTypePayload()` / `prepareCompanyTypePayload()`.
- **Value-based audiences** — when `isValueBasedAudience`, require a numeric `LOOKALIKE_VALUE ≥ 0`
  and include it in the schema/data (`fb_custom_audience/recordTransform.ts`).
- **HTTP method per action** — FB: `DELETE` for remove, `POST` for add; LinkedIn/TikTok: always
  `POST` with the action in the body; Reddit: `PATCH`.
- **Auth placement** — `Authorization: Bearer` (LinkedIn, Reddit), `params.access_token` (FB),
  `Access-Token` header (TikTok), `x-api-key` (custom_audience). Batch-invariant auth in
  `headers`/`params` keeps grouping correct.

## Delivery (optional)

Most audience destinations need nothing — the default reproduces `genericNetworkHandler`. See
`batching-framework-delivery` for the contract, verdicts and `perItem` rules. **No `networkHandler.ts`**
(`batching-framework-delivery#a-new-destination-gets-no-networkhandlerts`).

Audience-specific: failures are often keyed by **identity** (a `failedUpdates` object naming
emails/userIds) rather than index. `iterable_audience/delivery.ts` matches each posted subscriber
against the returned sets and keeps two deliberate successes — a GDPR-forgotten user, and
`notFound` on unsubscribe. Encode such semantics in `delivery.statusOverrides`, or the default
aborts them.

## Errors

| Scenario | Error | Effect |
| --- | --- | --- |
| Zod validation (`getInputSchema`) | auto-formatted | fails one event |
| Missing OAuth token | `OAuthSecretError` | fails one event |
| Unknown/invalid identifier keys, all identifiers empty, strict hashing violation | `InstrumentationError` | fails one event |
| Unsupported audience type | `ConfigurationError` | fails one event |
| `wrapBody` failure | caught by strategy | fails the group |

Delivery failures are verdicts (`authExpired`, `authRevoked`, `throttled`, `retry`, `perItem`);
override only signals that must be read from the body.

## Tests

Follow `writing-tests` (`it.each`, fixtures in `common.ts`, `sha256(...)` for expected hashes,
captured `network.ts`, `live.ts`). Unit tests drive `processDestinationIntegration(inputs,
Integration, {})` — model on `custom_audience/routerTransform.test.ts`. Cover:

- insert/update → ADD, delete → REMOVE; mixed actions → separate batches; over-limit → multiple batches
- hashing on, and pre-hashed passthrough with `isHashRequired: false`
- invalid identifier keys, all-null identifiers, missing token, unsupported message type
- audience subtypes and value-based audiences if applicable

## Steps

1. `config.ts` — action map, endpoint(s), batch limits.
2. `types.ts` — `makeRouterInputSchema` with connection `audienceId`/`isHashRequired`/subtype
   fields; `RouterInput` widening for `metadata.secret`; payload types.
3. Identifier field config (`AudienceField` with `hashingType`, `normalize`, `validate`).
4. `routerTransform.ts` — `transformEvent`, `getBatchStrategy`, `getInputSchema`; export `Integration`.
5. Register in `src/features.ts`.
6. `delivery.ts` only if needed.
7. Unit tests, `router/data.ts` component cases, `network.ts` captured responses, `live.ts`.
8. Verify:
   ```bash
   npm run lint
   npm test -- --testPathPattern="<dest_name>" --no-coverage
   npm run test:ts -- component --destination=<dest_name>
   ```
