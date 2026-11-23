# Twitter Ads Business Logic

## Request

| Item     | Value                                                                               |
| -------- | ----------------------------------------------------------------------------------- |
| Method   | `POST`                                                                              |
| Endpoint | `https://ads-api.twitter.com/12/measurement/conversions/<pixelId>`                  |
| Headers  | `Authorization: OAuth ...` (OAuth 1.0a HMAC-SHA1), `Content-Type: application/json` |
| Body     | `{ "conversions": [ <conversion> ] }`                                               |

`pixelId` = `properties.pixelId` or `Config.pixelId`.

## Field Mappings (`data/TwitterAdsTrackConfig.json` plus code)

| Source                                            | Destination                                                | Notes                              |
| ------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------- |
| `properties.eventId`, else `twitterAdsEventNames` | `event_id`                                                 | Required                           |
| `properties.conversionTime`, else `timestamp`     | `conversion_time`                                          |                                    |
| `properties.quantity`, `properties.numberItems`   | `number_items`                                             | `toNumber`                         |
| `properties.currency`                             | `price_currency`                                           |                                    |
| `properties.value`, `price`, `revenue`            | `value`                                                    | `toString`                         |
| `properties.conversionId`                         | `conversion_id`                                            | Used by X for dedupe               |
| `properties.description`                          | `description`                                              |                                    |
| `properties.contents[]`                           | `contents[]`                                               | Renamed fields, see README         |
| `context.ip`, `request_ip`                        | `ip_address`                                               | Top level of the conversion object |
| `context.userAgent`                               | `user_agent`                                               | Top level of the conversion object |
| `properties.email`                                | `identifiers[].hashed_email`                               | trim, lowercase, SHA-256           |
| `properties.phone`                                | `identifiers[].hashed_phone_number`                        | trim, SHA-256                      |
| `properties.twclid`                               | `identifiers[].twclid`                                     |                                    |
| `properties.ip_address` + `properties.user_agent` | `identifiers[]` entry, or merged into the first identifier |                                    |

**NEEDS REVIEW (likely bug)**: `context.ip` and `context.userAgent` are written as top-level `ip_address` / `user_agent` on the conversion object (see the processor test fixture, which expects a top-level `user_agent`). X's API reads IP and user agent only inside `identifiers`, so these top-level values are probably ignored. Only `properties.ip_address` / `properties.user_agent` reach `identifiers`.

## Flow

1. Reject non-track messages.
2. Build `identifiers` from `properties` (see Validations in the README).
3. Map the conversion fields and attach `identifiers`.
4. Resolve `event_id` (`properties.eventId` or the event mapping); fail if missing.
5. Default `conversion_time` to `message.timestamp`.
6. Transform `contents`.
7. Sign the request with OAuth 1.0a and build the response.

## Example

Input:

```json
{
  "type": "track",
  "event": "Purchase",
  "timestamp": "2024-01-01T00:00:00Z",
  "properties": {
    "email": " A@B.com ",
    "twclid": "tw1",
    "value": 25,
    "currency": "USD",
    "conversionId": "c1"
  }
}
```

Config: `pixelId: "px1"`, `twitterAdsEventNames: [{ "rudderEventName": "purchase", "twitterEventId": "tw-ev-1" }]`.

Output body:

```json
{
  "conversions": [
    {
      "price_currency": "USD",
      "value": "25",
      "conversion_id": "c1",
      "identifiers": [{ "hashed_email": "<sha256('a@b.com')>" }, { "twclid": "tw1" }],
      "event_id": "tw-ev-1",
      "conversion_time": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## Error Handling

- `Message type <type> not supported`
- `[TWITTER ADS]: properties must be present in event. Aborting message`
- `[TWITTER ADS]: one of twclid, phone, email or ip_address with user_agent must be present in properties.`
- `[TWITTER ADS]: properties.<field> must be a string, received <type>. Aborting message`
- `[TWITTER ADS]: Event - '<event>' do not have a corresponding eventId in configuration. Aborting` (ConfigurationError)
- `OAuthSecretError` when the OAuth secret or any of its four fields is missing.
- No proxy, so delivery errors use rudder-server's default HTTP handling.
