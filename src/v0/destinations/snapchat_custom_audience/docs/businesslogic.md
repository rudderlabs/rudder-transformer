# Snapchat Custom Audience Business Logic

## Endpoints

| Operation | Method | Endpoint                                                    |
| --------- | ------ | ----------------------------------------------------------- |
| Add       | POST   | `https://adsapi.snapchat.com/v1/segments/{segmentId}/users` |
| Remove    | DELETE | `https://adsapi.snapchat.com/v1/segments/{segmentId}/users` |

Headers: `Authorization: Bearer <access_token>`, `Content-Type: application/json`.

## Flow

1. `validatePayload`: type is `audiencelist`, `properties.listData` exists and has `add` or `remove`.
2. For `add` (then `remove`), `responseBuilder`:
   - reads `properties.listData[type]` (array of records),
   - `getData` extracts the value for `Config.schema`, skips empty values, normalises and hashes it (unless `disableHashing`), and splits into chunks of 100,000,
   - `validateFields` fails if the first chunk is empty,
   - `generateResponse` builds one request per chunk.

## Identifier Lookup and Hashing

| `schema`     | Snap schema           | Keys read from each record                                                   | Normalisation before SHA-256                           |
| ------------ | --------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------ |
| `email`      | `EMAIL_SHA256`        | `email`, `EMAIL`, `Email`                                                    | lowercase, trim                                        |
| `phone`      | `PHONE_SHA256`        | `phone`, `Phone`, `PHONE`, `mobile`, `Mobile`, `MOBILE`                      | lowercase, trim, strip leading `0`s, remove non-digits |
| `mobileAdId` | `MOBILE_AD_ID_SHA256` | `mobileId`, `MOBILEID`, `mobileAdId`, `MOBILEADID`, `mobile_id`, `MOBILE_ID` | lowercase                                              |

Phone normalisation strips leading zeros before removing non-digits, so `+0...` or `(0...)` inputs keep their zero. Snap also asks to drop a leading `0` from the national number, which the code does not do. **NEEDS REVIEW**.

## Payloads

Add:

```json
{
  "users": [
    {
      "schema": ["EMAIL_SHA256"],
      "data": [["<sha256>"], ["<sha256>"]]
    }
  ]
}
```

Remove (same, plus `id`):

```json
{
  "users": [
    {
      "id": "<segmentId>",
      "schema": ["EMAIL_SHA256"],
      "data": [["<sha256>"]]
    }
  ]
}
```

## Example

Input (`schema: email`):

```json
{
  "type": "audiencelist",
  "properties": {
    "listData": {
      "add": [{ "email": "A@Example.com " }],
      "remove": [{ "email": "b@example.com" }]
    }
  }
}
```

Output: two requests, a POST with `sha256("a@example.com")` and a DELETE with `sha256("b@example.com")`.

## Error Handling

See README "Proxy Delivery": 401 → refresh and retry; `E3002` → aborted; others → `NetworkError` by status.

## Notes

- If `add` has no usable identifiers but `remove` does, the whole event fails at `validateFields` for `add`.
