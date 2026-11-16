# CleverTap Business Logic and Mappings

## Overview

All events go to `POST https://api.clevertap.com/1/upload` (or `https://<region>.api.clevertap.com/1/upload`) with headers:

```text
X-CleverTap-Account-Id: <accountId>
X-CleverTap-Passcode: <passcode>
Content-Type: application/json
```

The body is `{ "d": [ <record>, ... ] }`. The router merges up to 1000 records into one request.

## Field Mappings

### Identify profile (`data/CleverTapIdentify.json`)

| RudderStack field (traits / context.traits) | CleverTap `profileData` field | Notes                                   |
| ------------------------------------------- | ----------------------------- | --------------------------------------- |
| `email`                                     | `Email`                       |                                         |
| `name`                                      | `Name`                        | Falls back to `firstName lastName`      |
| `phone`                                     | `Phone`                       |                                         |
| `gender`                                    | `Gender`                      | `f`/`female` → `F`, `m`/`male` → `M`    |
| `employed`                                  | `Employed`                    |                                         |
| `birthday`                                  | `DOB`                         |                                         |
| `education`                                 | `Education`                   |                                         |
| `married`                                   | `Married`                     |                                         |
| `customerType`                              | `Customer Type`               |                                         |
| `avatar`                                    | `Photo`                       |                                         |
| other traits                                | same key                      | Objects and arrays are JSON-stringified |
| `overrideFields.*`                          | same key                      | Copied as is, not stringified           |
| `traits.ts` / `context.traits.ts`           | `ts` (record root)            | Converted to a Unix timestamp if needed |

Excluded from custom traits: `email`, `firstName`, `lastName` (all casings), `name`, `phone`, `gender`, `education`, `employed`, `birthday`, `married`, `customerType`, `anonymousId`, `avatar`, `userId`, `id`, `ts`, `overrideFields`.

### Track, Page, Screen (`CleverTapTrack.json`, `CleverTapPage.json`, `CleverTapScreen.json`)

| RudderStack field                                               | CleverTap field | Notes                                                 |
| --------------------------------------------------------------- | --------------- | ----------------------------------------------------- |
| Track: `event`                                                  | `evtName`       | Required                                              |
| Page: `event` → `properties.event` → `name` → `properties.name` | `evtName`       | `Web Page Viewed: <value>`, default `Web Page Viewed` |
| Screen: same as page                                            | `evtName`       | `Screen Viewed: <value>`, default `Screen Viewed`     |
| `properties`                                                    | `evtData`       | Objects and arrays are JSON-stringified               |
| `properties.ts`                                                 | `ts`            | Converted to a Unix timestamp if needed               |

### Order Completed → Charged (`CleverTapEcom.json`)

When `event` is `order completed` (any case), `evtName` is `Charged`:

| RudderStack field        | CleverTap `evtData` field | Notes                                             |
| ------------------------ | ------------------------- | ------------------------------------------------- |
| `properties.checkout_id` | `Charged ID`              |                                                   |
| `properties.revenue`     | `Amount`                  |                                                   |
| `properties.products`    | `Items`                   | Must be an array of objects                       |
| other properties         | same key                  | Except `checkout_id`, `revenue`, `products`, `ts` |

## User Identification

### `enableObjectIdMapping: false` (default)

- Identify: `identity` = `userId` (falls back to `anonymousId` through the `userId` generic path).
- Track/page/screen: `identity` = `userId` (same fallback).

### `enableObjectIdMapping: true`

| anonymousId | userId | Identify                                                  | Track/page/screen        |
| ----------- | ------ | --------------------------------------------------------- | ------------------------ |
| yes         | yes    | `objectId` = anonymousId, `profileData.identity` = userId | `objectId` = anonymousId |
| yes         | no     | `objectId` = anonymousId                                  | `objectId` = anonymousId |
| no          | yes    | `identity` = userId (CleverTap generates objectId)        | `identity` = userId      |

## Request Flow per Event Type

### Identify

1. Build `profileData` and the identity fields above.
2. If object ID mapping is on and there is a device token on Android or Apple, also build a token record:

```json
{
  "d": [
    {
      "type": "profile",
      "profileData": { "Email": "jamesDoe@gmail.com", "Name": "James Doe", "identity": "user-1" },
      "objectId": "anon-1",
      "ts": 1571043797
    },
    {
      "type": "token",
      "tokenData": { "id": "<device token>", "type": "fcm" },
      "objectId": "anon-1"
    }
  ]
}
```

### Alias

Adds the new `userId` as an identity on the profile found by `previousId`:

```json
{
  "d": [
    { "type": "profile", "profileData": { "identity": "new-user-id" }, "identity": "previous-id" }
  ]
}
```

### Track / Page / Screen

1. Reject if `userId` is missing and `trackAnonymous` is off.
2. Build the event record (`Charged` for Order Completed).
3. Set identity (`identity` or `objectId`).

```json
{
  "d": [
    {
      "type": "event",
      "evtName": "Product Added",
      "evtData": { "product_id": "123", "price": 10 },
      "identity": "user-1"
    }
  ]
}
```

### User Deletion

`POST /1/delete/profiles.json` with `{ "identity": ["u1", "u2", ...] }`, up to 100 IDs per request, batches sent one after another.

## Error Handling

- Transform validation errors throw `InstrumentationError` (400).
- Delivery (proxy, `networkHandler.js`):
  - Non-2xx: `NetworkError` with retryable (5xx), throttled (429) or aborted (other 4xx) error type.
  - 2xx with body `status` other than `success` (for example `{"status":"fail","processed":0,"unprocessed":[...]}`): `AbortedError` with status 400 for the whole request.
- User deletion: non-2xx throws `NetworkError`; missing credentials throw `ConfigurationError`.

## Use Cases

- Keep CleverTap user profiles in sync with user traits.
- Register push tokens for mobile users.
- Send behavioural and purchase events for segmentation and campaigns.
- Delete user profiles for privacy requests.
