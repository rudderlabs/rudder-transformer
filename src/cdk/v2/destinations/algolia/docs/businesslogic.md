# Algolia Business Logic and Mappings

## Overview

Events go to `POST https://insights.algolia.io/1/events` with headers `X-Algolia-Application-Id: <applicationId>` and `X-Algolia-API-Key: <apiKey>`. The body is `{ "events": [ ... ] }`, with up to 1000 events per request.

The workflow is `procWorkflow.yaml` (one event) and `rtWorkflow.yaml` (batching). Helpers come from `src/v0/destinations/algolia/util.js` and `config.js`.

## Field Mappings

| RudderStack field                                    | Algolia field  | Notes                                                     |
| ---------------------------------------------------- | -------------- | --------------------------------------------------------- |
| `event` (trimmed, lower-cased)                       | `eventName`    | Required                                                  |
| `properties.eventType` or `eventTypeSettings[event]` | `eventType`    | Required; `click`, `view` or `conversion`                 |
| `properties.eventSubtype`                            | `eventSubtype` | Only for `conversion`, and only `addToCart` or `purchase` |
| `properties.index`                                   | `index`        | Required                                                  |
| `userId` → ... → `anonymousId`                       | `userToken`    | Generic `userId` paths                                    |
| `properties.queryId`                                 | `queryID`      | Dropped unless 32 characters and hexadecimal              |
| `properties.objectIds`                               | `objectIDs`    | Must be an array; cut to 20                               |
| `properties.positions`                               | `positions`    | Click only; converted to integers; cut to 20              |
| `properties.filters`                                 | `filters`      | Must be an array; cut to 10                               |
| `properties.timestamp`                               | `timestamp`    | Dropped if older than 4 days                              |
| `properties.value`                                   | `value`        | Only when `properties.currency` is set                    |
| `properties.currency`                                | `currency`     |                                                           |

### Products (`product list viewed`, `order completed`)

When `properties.products` is present and the event name is `product list viewed` or `order completed`:

| Event type   | Behaviour                                                                            |
| ------------ | ------------------------------------------------------------------------------------ |
| `click`      | `objectIDs` = `products[].objectId`, `positions` = `products[].position`             |
| `view`       | `objectIDs` = first 20 `products[].objectId`                                         |
| `conversion` | `objectIDs` = first 20 `products[].objectId`; `objectData` built per product (below) |

`objectData` item:

| Product field         | Algolia field | Notes                                          |
| --------------------- | ------------- | ---------------------------------------------- |
| `queryID` / `queryId` | `queryID`     | String                                         |
| `price`               | `price`       | String; only when `properties.currency` is set |
| `quantity`            | `quantity`    | Number                                         |
| `discount`            | `discount`    | String                                         |

## Request Flow

1. Validate the message type, event name and credentials.
2. Find the event type: `properties.eventType` first, then `eventTypeSettings`.
3. Build the payload and clean invalid values (`genericpayloadValidator`).
4. Expand products for `product list viewed` / `order completed`.
5. Check `filters` vs `objectIDs`.
6. For click events, check `positions` and `queryID` (`clickPayloadValidator`).
7. Remove null and undefined values.
8. Router: group into batches of up to 1000 (`dontBatch` events alone) and send.

### Example

Input:

```json
{
  "type": "track",
  "event": "Product List Viewed",
  "userId": "user-1",
  "properties": {
    "index": "products",
    "eventType": "click",
    "queryId": "43b15df305339e827f0ac0bdc5ebcaa7",
    "products": [
      { "objectId": "ecommerce-sample-data-919", "position": 7 },
      { "objectId": "9780439784542", "position": 8 }
    ]
  }
}
```

Output event:

```json
{
  "index": "products",
  "queryID": "43b15df305339e827f0ac0bdc5ebcaa7",
  "objectIDs": ["ecommerce-sample-data-919", "9780439784542"],
  "positions": [7, 8],
  "userToken": "user-1",
  "eventName": "product list viewed",
  "eventType": "click"
}
```

## Error Handling

- Validation failures fail the event with status 400 (`InstrumentationError` / `ConfigurationError`).
- Delivery (`src/v1/destinations/algolia/networkHandler.js`):
  - 2xx: all events succeed.
  - 4xx: all events get status 500 and `dontBatch: true`, so each is retried alone. A `dontBatch` event that fails again gets the real 4xx status and is aborted.
  - Other non-2xx: `TransformerProxyError` with a dynamic error type (retryable for 5xx, throttled for 429).

## Validation Messages

| Condition                                       | Message                                                                           |
| ----------------------------------------------- | --------------------------------------------------------------------------------- |
| Not a track event                               | `message type <type> not supported`                                               |
| No `event`                                      | `event is required for track call`                                                |
| No `properties.index`                           | `Missing required value from "properties.index"`                                  |
| No event type                                   | `eventType is mandatory for track call`                                           |
| Event type not click/view/conversion            | `eventType can be either click, view or conversion`                               |
| Both `filters` and `objectIDs`                  | `event can't have both objectIds and filters at the same time.`                   |
| Neither `filters` nor `objectIDs`               | `Either filters or objectIds is required and must be non empty.`                  |
| Click: lengths differ                           | `length of objectId and position should be equal`                                 |
| Click: only one of `positions` / `queryID`      | `for click eventType either both positions and queryId should be present or none` |
| Conversion `objectData` price info, no currency | `Currency missing when objectData fields has price informations.`                 |

## Use Cases

- Send search result clicks and conversions for Algolia Click and Conversion Analytics.
- Feed Personalization, Dynamic Re-Ranking and Recommend models with user behaviour.
