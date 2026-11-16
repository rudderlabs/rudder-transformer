# Google Ads Enhanced Conversions Business Logic and Mappings

## Overview

| File                    | Role                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------ |
| `transform.ts`          | Builds one conversion adjustment per track event (mapping, hashing, adjustment type)       |
| `routerTransform.ts`    | Batching-framework integration: input schema, conversion action lookup, 2,000-item batches |
| `utils.ts`              | Conversion action lookup with cache, PII normalise/validate/hash pipeline                  |
| `delivery.ts`           | Delivery spec: partial-failure handling, auth error mapping, developer-token injection     |
| `data/trackConfig.json` | Field mapping                                                                              |

## Request Flow (Track)

1. **Input schema** (`routerTransform.ts`): `type` must be `track` and `event` non-empty.
2. **Transform** (`transform.ts#processTrackEvent`):
   - `event` must be in `listOfConversions`.
   - Map fields with `trackConfig.json`; set `partialFailure: true`.
   - `ENHANCEMENT` (default): run `processUserIdentifiers` on the identifiers.
   - `RESTATEMENT`: remove `userIdentifiers` and `userAgent`.
   - Build headers `Authorization: Bearer {access_token}`, `Content-Type: application/json`, and `login-customer-id` when `subAccount` is `true`.
3. **Conversion action lookup** (`utils.ts#getConversionActionId`): resolves `event` to `customers/{id}/conversionActions/{id}` through `googleAds:searchStream`, cached by `sha256(event + customerId)`.
4. **Batch**: adjustments with the same endpoint, method and headers are chunked into up to 2,000 per request: `{ "conversionAdjustments": [...], "partialFailure": true }`.
5. **Deliver**: `POST https://googleads.googleapis.com/v25/customers/{customerId}:uploadConversionAdjustments`, with the `developer-token` header added at delivery time.

## Field Mapping (`data/trackConfig.json`)

All destination keys are under `conversionAdjustments[0]`.

| RudderStack field                                                                    | Google Ads field                                    | Notes                              |
| ------------------------------------------------------------------------------------ | --------------------------------------------------- | ---------------------------------- |
| `properties.orderId` / `properties.order_id`                                         | `orderId`                                           | Required, string                   |
| `properties.gclid`                                                                   | `gclidDateTimePair.gclid`                           | String                             |
| `properties.conversionDateTime`                                                      | `gclidDateTimePair.conversionDateTime`              | String                             |
| `properties.adjustedValue`                                                           | `restatementValue.adjustedValue`                    | Number                             |
| `properties.currencyCode` / `properties.currency`                                    | `restatementValue.currencyCode`                     |                                    |
| `properties.adjustmentDateTime`                                                      | `adjustmentDateTime`                                |                                    |
| `context.userAgent`                                                                  | `userAgent`                                         | Removed for restatements           |
| `traits.email` / `context.traits.email` / `properties.email`                         | `userIdentifiers[].hashedEmail`                     | Hashed                             |
| `traits.phone` / `context.traits.phone` / `properties.phone`                         | `userIdentifiers[].hashedPhoneNumber`               | Hashed                             |
| First name (generic `firstName` paths in `traits` / `context.traits`)                | `userIdentifiers[].addressInfo.hashedFirstName`     | Hashed                             |
| Last name (generic `lastName` paths in `traits` / `context.traits`)                  | `userIdentifiers[].addressInfo.hashedLastName`      | Hashed                             |
| `context.traits.streetAddress` / `context.traits.address`                            | `userIdentifiers[].addressInfo.hashedStreetAddress` | Hashed; non-string values dropped  |
| `context.traits.state` / `context.traits.address.state`                              | `userIdentifiers[].addressInfo.state`               | Not hashed                         |
| `context.traits.city` / `context.traits.address.city`                                | `userIdentifiers[].addressInfo.city`                | Not hashed                         |
| `context.traits.countryCode` / `country` / `address.countryCode` / `address.country` | `userIdentifiers[].addressInfo.countryCode`         | Not hashed                         |
| `context.traits.postalCode` / `context.traits.address.postalCode`                    | `userIdentifiers[].addressInfo.postalCode`          | Not hashed                         |
| Resolved by lookup                                                                   | `conversionAction`                                  | Added in `routerTransform.ts`      |
| Config `adjustmentType`                                                              | `adjustmentType`                                    | `ENHANCEMENT` unless `RESTATEMENT` |

## PII Processing (`processUserIdentifiers`)

| Field                 | Normalisation                         | Validation           |
| --------------------- | ------------------------------------- | -------------------- |
| `hashedEmail`         | `normalizeEmail` (shared Google util) | `validator.isEmail`  |
| `hashedPhoneNumber`   | `normalizePhone`                      | `isValidPhoneNumber` |
| `hashedFirstName`     | `normalizeName`                       | non-empty            |
| `hashedLastName`      | `normalizeName`                       | non-empty            |
| `hashedStreetAddress` | trim, lowercase                       | non-empty            |

- With `requireHash` `true` or unset, valid values are SHA-256 hashed. With `false`, values are passed through as pre-hashed.
- Data that contradicts `requireHash` fails the event with an instrumentation error.
- Invalid values are dropped and counted in the `<destType>_invalid_field` metric.
- Output identifiers are rebuilt in order: email, phone, `addressInfo`. An `addressInfo` left empty is dropped.
- If no identifier survives, the event fails with `Any of email, phone, firstName, lastName, city, street, countryCode, postalCode or streetAddress is required in traits.`

## Example

Input (ENHANCEMENT):

```json
{
  "type": "track",
  "event": "Purchase",
  "context": {
    "userAgent": "Mozilla/5.0",
    "traits": {
      "email": "Jane@Example.com",
      "phone": "+15551234567",
      "firstName": "Jane",
      "lastName": "Doe",
      "country": "US",
      "postalCode": "94107"
    }
  },
  "properties": {
    "order_id": "ORDER-1",
    "gclid": "gclid-1",
    "conversionDateTime": "2026-11-01 12:00:00+00:00"
  }
}
```

Batched output body:

```json
{
  "conversionAdjustments": [
    {
      "conversionAction": "customers/1234567890/conversionActions/111",
      "adjustmentType": "ENHANCEMENT",
      "orderId": "ORDER-1",
      "gclidDateTimePair": {
        "gclid": "gclid-1",
        "conversionDateTime": "2026-11-01 12:00:00+00:00"
      },
      "userAgent": "Mozilla/5.0",
      "userIdentifiers": [
        { "hashedEmail": "<sha256>" },
        { "hashedPhoneNumber": "<sha256>" },
        {
          "addressInfo": {
            "hashedFirstName": "<sha256>",
            "hashedLastName": "<sha256>",
            "countryCode": "US",
            "postalCode": "94107"
          }
        }
      ]
    }
  ],
  "partialFailure": true
}
```

## Validations

| Check                                       | Error                                                                                                                                         |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `type` not track                            | `Message Type is not supported. Only track events are supported.`                                                                             |
| `event` empty                               | `event is required for track calls`                                                                                                           |
| `event` not in `listOfConversions`          | `Conversion named "<event>" was not specified in the RudderStack destination configuration`                                                   |
| Missing order ID                            | Required-field error from the mapping                                                                                                         |
| No identifiers (enhancement)                | `Any of email, phone, firstName, ... is required in traits.`                                                                                  |
| `customerId` not string or number           | `customerId should be a string or number`                                                                                                     |
| `subAccount` true without `loginCustomerId` | `loginCustomerId is required as subAccount is true.`                                                                                          |
| Conversion action not found                 | `Conversion Action not found, make sure the event name provided on the dashboard is exactly same as the conversion action name in Google Ads` |
| No `access_token` in metadata               | OAuth secret error                                                                                                                            |

## Error Handling

- **Lookup errors**: Client and application errors from the SDK become `NetworkError`s with the Google status and an auth category from `getAuthErrCategory`. Other unexpected responses become a 500.
- **Delivery 2xx with `partialFailureError`** (code not 0): adjustments with an empty or missing `results[i]` are aborted with the partial-failure message; others succeed. Treating a missing entry as failed avoids retrying adjustments Google already accepted.
- **Delivery 4xx**: `REFRESH_TOKEN` category becomes an auth-expired retry; `AUTH_STATUS_INACTIVE` (for example 2-Step Verification not enrolled, `CUSTOMER_NOT_FOUND`) marks the account inactive. Other 4xx use the framework default.
- Failure reason is taken from `error.message` in the response.

## General Use Cases

- Improve conversion measurement for web conversions tracked by the Google tag by sending hashed customer data after the purchase.
- Restate conversion values after returns, cancellations or margin adjustments (`RESTATEMENT`).
