# Reddit Audience Business Logic

## Request

```
PATCH https://ads-api.reddit.com/api/v3/custom_audiences/{audienceId}/users
Authorization: Bearer <metadata.secret.accessToken>
Content-Type: application/json
Accept: application/json
User-Agent: web:com.rudderstack.reddit-audience:v1.0.0 (by /u/rudderstack)

{
  "data": {
    "action_type": "ADD" | "REMOVE",
    "column_order": ["EMAIL_SHA256", "MAID_SHA256"],
    "user_data": [["<sha256 email>", "<sha256 maid>"], ...]
  }
}
```

## Mappings

| Record action | `action_type` |
| ------------- | ------------- |
| `insert`      | `ADD`         |
| `update`      | `ADD`         |
| `delete`      | `REMOVE`      |

| Identifier key (`message.identifiers`) | Normalization when `isHashRequired: true`                                                             |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `EMAIL_SHA256`                         | Trim, lowercase, drop `+alias`, strip non-alphanumerics from the username (all domains), then SHA-256 |
| `MAID_SHA256`                          | Trim only (IDFA upper-case and AAID lower-case must be preserved), then SHA-256                       |

Other identifier keys are ignored.

## Flow

1. Validate input (zod) and read the OAuth token from metadata.
2. Map action, run `processAudienceRecord` with `IDENTIFIER_FIELD_CONFIG` (normalize, validate, hash or verify pre-hashed).
3. `columnsFor` returns present columns in fixed order (`EMAIL_SHA256`, `MAID_SHA256`); empty → error for that record only.
4. Build the row in `column_order` order and set `internalGroupKey = action|columns`.
5. `ChunkBatchStrategy` groups by endpoint + key, chunks at 2500, and `wrapBody` builds the request. It throws if any row length differs from `column_order` (Reddit accepts misaligned rows silently).

## Example

Input record:

```json
{
  "type": "record",
  "action": "insert",
  "identifiers": { "EMAIL_SHA256": "Al.ice$+Apple@Example.Com" }
}
```

Output body:

```json
{
  "data": {
    "action_type": "ADD",
    "column_order": ["EMAIL_SHA256"],
    "user_data": [["ff8d9819fc0e12bf0d24892e45987e249a28dce836a85cad60e28eaaa8c6d976"]]
  }
}
```

## Response Handling (`classify.ts`, `delivery.ts`)

| Status    | Verdict                                                                                   |
| --------- | ----------------------------------------------------------------------------------------- |
| 2xx (204) | Success                                                                                   |
| 401       | Retry; `authExpired` (token refresh) when the body indicates `UNAUTHORIZED` / token error |
| 403       | Abort; message suggests missing `adsedit` scope or block; re-authorize                    |
| 404       | Abort; audience not found                                                                 |
| 429       | Throttled                                                                                 |
| 5xx       | Retry                                                                                     |
| Other 4xx | Abort                                                                                     |

Error messages come from Reddit's `{ error: { code, message, fields[] } }` envelope.

## Code Observations (NEEDS REVIEW)

- The header comment in `classify.ts` still describes a `networkHandler.ts` for the v0 proxy path, which no longer exists (removed in #5569). The comment is stale.
