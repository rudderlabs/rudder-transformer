# Gainsight PX Business Logic and Mappings

Base URL from `getBaseEndpoint(Config)`: `dataCenter` `EU` → `api-eu`, `US2` → `api-us2`, else `api.aptrinsic.com`, all `/v1`. Headers on every call: `X-APTRINSIC-API-KEY: {apiKey}`, `Content-Type: application/json`.

## Identify

1. `GET /users/{userId}`: 200 = exists, 404 = new, anything else throws `NetworkError`.
2. Build payload from `data/GainsightPX_Identify.json`.
3. Exists: `PUT /users/{userId}`. New: `POST /users` with `identifyId: userId`.

| PX field                                                                                                                                                                                                  | Source                                                                                   |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `email`, `gender`, `lastSeenDate`, `signUpDate`, `firstVisitDate`, `title`, `phone`, `score`, `role`, `subscriptionId`, `numberOfVisits`, `createDate`, `globalUnsubscribe`, `sfdcContactId`, `accountId` | same-named key in `traits` / `context.traits`                                            |
| `location.*` (`countryName`, `countryCode`, `stateName`, `stateCode`, `city`, `street`, `postalCode`, `continent`, `regionName`, `timeZone`, `coordinates.latitude/longitude`)                            | same-named trait                                                                         |
| `firstName`, `lastName`                                                                                                                                                                                   | generic `firstName`/`lastName`; overridden by splitting `traits.name` on the first space |
| `signUpDate`, `createDate`                                                                                                                                                                                | new users only: default to event `timestamp`/`originalTimestamp`                         |
| `customAttributes`                                                                                                                                                                                        | other traits, renamed by `userAttributeMap`; unmapped ones dropped                       |
| `propertyKeys`                                                                                                                                                                                            | `[productTagKey]`                                                                        |
| `type`                                                                                                                                                                                                    | `USER`                                                                                   |

## Group

Default flow (`groupResponseBuilder`):

1. `GET /users/{userId}`; abort if not found.
2. `GET /accounts/{groupId}`.
3. Exists: `PUT /accounts/{groupId}` (expects 204). New: `POST /accounts` with `id: groupId` (expects 201).
4. Delivered request: `PUT /users/{userId}` with `{ "accountId": groupId }`.

`limitAPIForGroup` flow (`newGroupResponseBuilder`, enabled by `integrations.gainsight_px.limitAPIForGroup`): `PUT /accounts/{groupId}`, and create only if the update failed with no error message; then step 4.

Account payload (`data/GainsightPX_Group.json`, from `traits`): `name` (required), `trackedSubscriptionId`, `sfdcId`, `dunsNumber`, `industry`, `numberOfEmployees`, `sicCode`, `website`, `naicsCode`, `plan`, `numberOfUsers`, `parentGroupId`, `createDate` (falls back to timestamp), `lastModifiedDate`, `lastSeenDate`, `location.*`; `customAttributes` via `accountAttributeMap`; `propertyKeys: [productTagKey]`.

## Track

`POST /events/custom`:

| PX field          | Source                                                                     |
| ----------------- | -------------------------------------------------------------------------- |
| `identifyId`      | `userId` (required in mapping)                                             |
| `accountId`       | `traits.groupId` / `context.traits.groupId`                                |
| `eventName`       | `event`                                                                    |
| `date`            | `properties.date`, `timestamp`, `originalTimestamp`                        |
| `sessionId`       | `properties.sessionId`, `context.sessionId`                                |
| `attributes`      | `properties`; nested objects are JSON-stringified; `globalContext` removed |
| `url`, `referrer` | `context.page.url`, `context.page.referrer`                                |
| `propertyKey`     | `productTagKey`                                                            |
| `userType`        | `USER`                                                                     |
| `globalContext`   | `properties.globalContext`, else `globalContextMap`                        |

## Error Handling

Intermediate calls use `handleHttpRequest`; an unexpected status throws `NetworkError` with the PX status and its error type. Account create/update failures throw `ConfigurationError` (400). Delivery has no custom handler.

## Known Issues (NEEDS REVIEW)

- `newGroupResponseBuilder` destructures `error` from `createAccount`, which returns `err`, so the failure message is always `undefined`.
- In the same flow, `updateAccount` returns `err` as a string on 400 (never `null`), so `!updateSuccess && err === null` is never true and the account is never created; a missing account surfaces as a 404 `NetworkError` or a "failed to update account" error.
- `dataCenter` is defined per source type in `schema.json` (`{ web, warehouse }`) and is not in `destConfig` for `cloud` and mobile sources, while `getBaseEndpoint` compares it as a string. Confirm the shape the transformer receives; if it is the object form, all traffic goes to the US host.
- `traits.name` is split on the first space only, so `"Mary Ann Smith"` gives `lastName: "Ann"`.

## General Use Cases

- Sync product users and accounts into PX for in-app engagement and analytics.
- Send server-side custom events alongside the PX web tag.
