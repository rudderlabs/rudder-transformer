# The Trade Desk Audience Business Logic and Mappings

## Overview

Router workflow (`rtWorkflow.yaml`):

1. `validateConfig`: assert `audienceId`, `advertiserId`, `advertiserSecretKey`; `ttlInDays` in 0 to 180 if set.
2. `validateInput`: input must be a non-empty array.
3. `processRecordEvents`: `processRecordInputs` (`transformRecord.js`) for `record` events.
4. `failOtherEvents`: every non-`record` event fails with `Event type <type> is not supported`.

## Record Flow (`processRecordInputs`)

For each event:

1. `action` must be `insert` or `delete`, else `Invalid action type. You can only add or remove IDs from the audience/segment`.
2. `fields` must be non-empty with no falsy values, else `` `fields` cannot be empty ``.
3. For each `[idType, value]` in `fields`, push an item:

```json
{ "<idType>": "<value>", "Data": [{ "Name": "<audienceId>", "TTLInMinutes": <ttl> }] }
```

- `TTLInMinutes` = `ttlInDays * 1440` for `insert`, `0` for `delete` (TTL 0 removes the user from the segment).

Items from all events are chunked to at most 2.5 MB and wrapped as:

```json
{ "DataProviderId": "rudderstack", "AdvertiserId": "<advertiserId>", "Items": [ ... ] }
```

## Endpoint

`POST {dataServer base}/data/advertiser`

| `dataServer`  | Base URL                      |
| ------------- | ----------------------------- |
| `apac`        | `https://sin-data.adsrvr.org` |
| `tokyo`       | `https://tok-data.adsrvr.org` |
| `usEastCoast` | `https://use-data.adsrvr.org` |
| `usWestCoast` | `https://usw-data.adsrvr.org` |
| `ukEu`        | `https://euw-data.adsrvr.org` |
| `china`       | `https://data-cn2.adsrvr.cn`  |

Signature headers (`TtdSignature`, `TtdSignature-dp`) are added at delivery by the proxy (see README).

## Field Mappings

`fields` keys are sent as-is as the item's ID key. The VDM field list (rudder-integrations-info, `src/routes/the_trade_desk/config.ts`) offers: `tdid`, `daid`, `uid2`, `uid2Token`, `euid`, `euidToken`, `idl`, `id5`, `netID`, `firstID`.

NEEDS REVIEW: VDM field names are lowercase (`tdid`, `daid`, ...) while TTD documents `TDID`, `DAID`, `UID2`, ...; component tests use the uppercase form. Confirm TTD accepts the lowercase keys.

## Example Payload

Input:

```json
[
  {
    "message": {
      "type": "record",
      "action": "insert",
      "fields": { "DAID": "daid-1", "UID2": "uid2-1" }
    }
  },
  { "message": { "type": "record", "action": "delete", "fields": { "DAID": "daid-2" } } }
]
```

Config: `audienceId: "seg"`, `advertiserId: "adv"`, `dataServer: "usEastCoast"`, `ttlInDays: 30`.

Output (one batched request):

```json
{
  "endpoint": "https://use-data.adsrvr.org/data/advertiser",
  "method": "POST",
  "body": {
    "JSON": {
      "DataProviderId": "rudderstack",
      "AdvertiserId": "adv",
      "Items": [
        { "DAID": "daid-1", "Data": [{ "Name": "seg", "TTLInMinutes": 43200 }] },
        { "UID2": "uid2-1", "Data": [{ "Name": "seg", "TTLInMinutes": 43200 }] },
        { "DAID": "daid-2", "Data": [{ "Name": "seg", "TTLInMinutes": 0 }] }
      ]
    }
  }
}
```

## Error Handling

- Config/input validation errors → `ConfigurationError` / `InstrumentationError` (400, aborted).
- Delivery (`networkHandler.js`):
  - Non-2xx → `NetworkError` with status-based type (5xx/429 retried, other 4xx aborted).
  - 200 with non-empty `FailedLines` (for example `{"FailedLines":[{"ErrorCode":"MissingUserId","Message":"Invalid DAID, item #1"}]}`) → `AbortedError` (400) for the whole request.
  - 200 with `{}` → success.

## General Use Cases

- Building and refreshing TTD retargeting or suppression segments from warehouse audiences.
