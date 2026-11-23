# LinkedIn Ads Business Logic and Mappings

## Overview

Track events are sent to the LinkedIn Conversions API as conversion events against the conversion rules mapped in `conversionMapping`.

## Flow

### Processor workflow (`procWorkflow.yaml`, run per event from the router)

1. **checkIfProcessed**: already-transformed events are passed through.
2. **validateInput / validateInputForTrack**: type must be `track`; `event` is required.
3. **commonFields**: builds `conversionHappenedAt`, `eventId`, `conversionValue`, `user.userIds`, `user.userInfo`.
4. **deduceConversionRules**: looks up `event` in `conversionMapping` (`from` → `to`); one or more rule IDs.
5. **preparePayload**: one element per rule ID, with `conversion: "urn:lla:llaPartnerConversion:<ruleId>"`.
6. **buildResponse**: `POST https://api.linkedin.com/rest/conversionEvents`, body `{ elements: [...] }`.

### Router workflow (`rtWorkflow.yaml`)

Runs the processor workflow per event, then `batchResponseBuilder` merges all elements and chunks them by 5000. Failed events are returned individually.

Headers:

| Header                      | Value                  |
| --------------------------- | ---------------------- |
| `Authorization`             | `Bearer <accessToken>` |
| `Content-Type`              | `application/json`     |
| `X-RestLi-Method`           | `BATCH_CREATE`         |
| `X-Restli-Protocol-Version` | `2.0.0`                |
| `LinkedIn-Version`          | `202609`               |

## Field Mappings

| RudderStack                                                                                   | LinkedIn                          | Notes                                                                                |
| --------------------------------------------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------ |
| `timestamp` / `originalTimestamp`                                                             | `conversionHappenedAt`            | Epoch ms; must be within 90 days                                                     |
| value at `Config.deduplicationKey`, else `messageId`                                          | `eventId`                         |                                                                                      |
| `properties.products[].price × quantity` (sum) or `properties.price × quantity`               | `conversionValue.amount`          | String; only when a price is present                                                 |
| `properties.currency`                                                                         | `conversionValue.currencyCode`    | Default `USD`                                                                        |
| email (`traits.email`, `context.traits.email`, `properties.email`, `context.externalId.0.id`) | `user.userIds[]` `SHA256_EMAIL`   | Hashed with SHA-256 when `hashData` is true (no lowercasing/trimming before hashing) |
| `externalId` type `LINKEDIN_FIRST_PARTY_ADS_TRACKING_UUID`                                    | `user.userIds[]` same `idType`    |                                                                                      |
| `externalId` type `ACXIOM_ID`                                                                 | `user.userIds[]` `ACXIOM_ID`      |                                                                                      |
| `externalId` type `ORACLE_MOAT_ID`                                                            | `user.userIds[]` `ORACLE_MOAT_ID` |                                                                                      |
| `firstName` (generic)                                                                         | `user.userInfo.firstName`         | `userInfo` only sent when first and last name exist                                  |
| `lastName` (generic)                                                                          | `user.userInfo.lastName`          |                                                                                      |
| `title` (generic)                                                                             | `user.userInfo.title`             |                                                                                      |
| `context.traits.companyName`                                                                  | `user.userInfo.companyName`       |                                                                                      |
| `countryCode` (generic)                                                                       | `user.userInfo.countryCode`       |                                                                                      |
| `conversionMapping[event]`                                                                    | `conversion`                      | `urn:lla:llaPartnerConversion:<ruleId>`                                              |

## Example

Input:

```json
{
  "type": "track",
  "event": "Order Completed",
  "messageId": "m-1",
  "timestamp": "2026-11-10T10:00:00.000Z",
  "context": {
    "traits": { "email": "alice@example.com", "firstName": "Alice", "lastName": "Doe" }
  },
  "properties": { "price": 50, "quantity": 2, "currency": "EUR" }
}
```

With `conversionMapping: [{ "from": "Order Completed", "to": "1234" }]` and `hashData: true`:

```json
{
  "elements": [
    {
      "conversion": "urn:lla:llaPartnerConversion:1234",
      "conversionHappenedAt": 1794304800000,
      "eventId": "m-1",
      "conversionValue": { "currencyCode": "EUR", "amount": "100" },
      "user": {
        "userIds": [{ "idType": "SHA256_EMAIL", "idValue": "<sha256(alice@example.com)>" }],
        "userInfo": { "firstName": "Alice", "lastName": "Doe" }
      }
    }
  ]
}
```

## Error Handling

Transformation errors:

- No matching conversion rule → `ConfigurationError`.
- No user identifier, invalid timestamp, or event older than 90 days → `InstrumentationError`.
- Missing access token → `OAuthSecretError`.

Delivery (proxy v1, `networkHandler.js`):

| LinkedIn status                     | Result                                       |
| ----------------------------------- | -------------------------------------------- |
| 2xx                                 | All jobs `200`                               |
| 401 `REVOKED_ACCESS_TOKEN`          | `400`, auth category `AUTH_STATUS_INACTIVE`  |
| 401 other                           | `500`, auth category `REFRESH_TOKEN`         |
| 403                                 | `400`, auth category `AUTH_STATUS_INACTIVE`  |
| 422 with parsable `Index: n` errors | Listed indexes `400`, others `500` (retried) |
| 426                                 | Converted to `500` (retry)                   |
| Other                               | All jobs get that status                     |

NEEDS REVIEW: when one event maps to several conversion rules, the batch has more `elements` than metadata entries. Elements and metadata are chunked separately by 5000 and 422 `Index` values are mapped to metadata by position, so the index-to-job mapping can be wrong in that case.

## Use Cases

Offline/server-side conversion tracking for LinkedIn ad campaign attribution and optimization (purchases, leads, sign-ups).
