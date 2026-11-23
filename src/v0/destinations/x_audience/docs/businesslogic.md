# X Audience Business Logic

## Request

- **Method**: `POST`
- **Endpoint**: `https://ads-api.twitter.com/12/accounts/:account_id/custom_audiences/:audience_id/users`
  - `:account_id` = first value of `JSON.parse(Config.accountId)`
  - `:audience_id` = `Config.audienceId` (from connection config)
- **Headers**: `Authorization: OAuth ...` (OAuth 1.0a, signed per request), `Content-Type: application/json`
- **Body**: JSON array of operation objects (`body.JSON_ARRAY = { batch: JSON.stringify(operations) }`)

## Flow

1. `processRouterDest` runs `processRecordEvent` on each input.
2. `processRecordEvent`:
   - Rejects non-`record` types.
   - `operation_type`: `Delete` when `action === "delete"`, otherwise `Update` (insert and update both add users).
   - `params`: `effective_at`, `expires_at` and `users: [getUserDetails(fields, config)]`, empty values removed.
3. `batchEvents`:
   - Groups by `[operation_type, effective_at, expires_at]`.
   - Within a group, merges all users into one operation until the users JSON reaches 4,000,000 bytes.
   - Packs operations into requests of at most 2500 operations or 4,000,000 bytes.
4. Each request is signed with the secret from the batch's metadata and returned with all metadata attached.

## Field Mapping (`getUserDetails`)

| VDM field         | Destination field     | Hashed when `enableHash` |
| ----------------- | --------------------- | ------------------------ |
| `email`           | `email`               | Yes (SHA-256)            |
| `phone_number`    | `phone_number`        | Yes                      |
| `handle`          | `handle`              | Yes                      |
| `device_id`       | `device_id`           | Yes                      |
| `twitter_id`      | `twitter_id`          | Yes                      |
| `partner_user_id` | `partner_user_id`     | Never                    |
| `effective_at`    | `params.effective_at` | No                       |
| `expires_at`      | `params.expires_at`   | No                       |

- Each identifier is split on `,` and sent as an array.
- No normalization (trim, lowercase) is applied before hashing. X requires normalized values (lowercase email, E.164 phone, etc.), so warehouse data must already be normalized. NEEDS REVIEW: consider normalizing in code.

## Example

Input:

```json
{
  "type": "record",
  "action": "insert",
  "fields": { "email": "a@x.com,b@x.com", "partner_user_id": "p1" }
}
```

Request body (hashing on):

```json
[
  {
    "operation_type": "Update",
    "params": {
      "users": [{ "email": ["<sha256 a@x.com>", "<sha256 b@x.com>"], "partner_user_id": ["p1"] }]
    }
  }
]
```

## Known Issues

- **Config validation never runs.** `processRecordEvent` does `const { accountId, audienceId } = { config };`, which always yields `undefined`, and the checks are inverted (`if (accountId) throw`). Missing IDs are not reported as `ConfigurationError`.
- **Crash after a size split in `getOperationObjectList`.** When a group overflows 4 MB it sets `currentMetadata = event.metadata` (an object, not an array). The next `currentMetadata.push(...)` throws, and the final `metadataList` is an object. Should be `[event.metadata]`.
- `currentUserList = event.message.params.users` aliases the event's array, so later pushes mutate it.
- `processRouterDest` uses `inputs.map(async ...)` without awaiting. It works only because the callback has no `await`.
- Uses host `ads-api.twitter.com`; X docs now use `ads-api.x.com`.

## Use Cases

- Mirror a warehouse segment into an X Custom Audience for ad targeting or exclusion.
