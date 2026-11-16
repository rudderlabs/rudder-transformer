# TikTok Audience Business Logic

## Request

| Item     | Value                                                                           |
| -------- | ------------------------------------------------------------------------------- |
| Method   | `POST`                                                                          |
| Endpoint | `https://business-api.tiktok.com/open_api/v1.3/segment/mapping/`                |
| Headers  | `Access-Token: <metadata.secret.accessToken>`, `Content-Type: application/json` |

Body:

```json
{
  "batch_data": [[{ "id": "<hash>", "audience_ids": ["<audienceId>"] }, {}]],
  "id_schema": ["EMAIL_SHA256", "PHONE_SHA256"],
  "advertiser_ids": ["<advertiserId>"],
  "action": "add"
}
```

## Record Flow (VDM V2, `recordTransform.ts`)

1. Group router events by `message.type`. Unsupported types fail.
2. Validate each `record` event with the zod schema (`recordTypes.ts`).
3. `id_schema` = sorted keys of `message.identifiers`. Each key must be one of `EMAIL_SHA256`, `PHONE_SHA256`, `IDFA_SHA256`, `AAID_SHA256`, `IDFA_MD5`, `AAID_MD5`.
4. For each key: if the value is empty, push `{}`. Otherwise check hashing consistency, then:
   - `isHashRequired: true`: normalize (see README), then SHA-256 or MD5.
   - `isHashRequired: false`: send the value as is.
   - Push `{ id, audience_ids: [connection.config.destination.audienceId] }`.
5. Fail the event if no identifier has a value.
6. Group payloads by `advertiserId` + action + `id_schema`, and build one request per group with all metadata attached.

### Action mapping

| Record action | TikTok action |
| ------------- | ------------- |
| `insert`      | `add`         |
| `update`      | `add`         |
| `delete`      | `delete`      |

## Audience List Flow (legacy VDM V1, `transform.ts`)

- `audienceId` from `context.externalId[type=TIKTOK_AUDIENCE...]` (`getDestinationExternalIDInfoForRetl(...).objectType`).
- `id_schema` = `context.destinationFields` split on commas (not sorted).
- `advertiser_ids` = `metadata.secret.advertiserIds`.
- One request per key of `properties.listData` (`add` to `add`, `remove` to `delete`).
- Hashing uses `destination.Config.isHashRequired`: SHA-256 for the SHA256 traits, MD5 for anything else. No normalization.

## Example (record)

Input:

```json
{
  "message": {
    "type": "record",
    "action": "insert",
    "identifiers": { "EMAIL_SHA256": " User@Example.com", "AAID_MD5": null },
    "fields": {}
  },
  "destination": { "ID": "d1", "Config": { "advertiserId": "adv1" } },
  "connection": { "config": { "destination": { "isHashRequired": true, "audienceId": "aud1" } } },
  "metadata": { "workspaceId": "w1", "secret": { "accessToken": "tok" } }
}
```

Output body:

```json
{
  "batch_data": [[{}, { "id": "<sha256('user@example.com')>", "audience_ids": ["aud1"] }]],
  "id_schema": ["AAID_MD5", "EMAIL_SHA256"],
  "advertiser_ids": ["adv1"],
  "action": "add"
}
```

## Error Handling

- zod validation errors become `InstrumentationError` with the formatted message.
- `Invalid identifier key <key> for TikTok Audience.`
- `No identifiers found, aborting event.`
- `unsupported event found <type>`
- Hashing-consistency errors from `validateHashingConsistency`.
- No proxy: TikTok returns HTTP 200 with a non-zero `code` in the body for many errors. **NEEDS REVIEW**: without a network handler, such responses may be treated as success by rudder-server.
