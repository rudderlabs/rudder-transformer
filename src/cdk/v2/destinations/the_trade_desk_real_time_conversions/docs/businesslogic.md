# The Trade Desk Real Time Conversions Business Logic

## Request

- **Method**: `POST`
- **Endpoint**: `https://insight.adsrvr.org/track/realtimeconversion`
- **Headers**: `Content-Type: application/json`
- **Body**: `{ "data": [ <event payload> ] }` with null and undefined values removed

## Workflow Steps (`procWorkflow.yaml`)

1. `validateConfig`: `advertiserId` and `trackerId` required.
2. `validateInput`: type must be `track`; `event` required.
3. `prepareTrackPayload`: builds the payload from config, common mapping, items, advertising ID, custom properties, event name, revenue and privacy fields, then adds leftover properties.
4. `buildResponseForProcessTransformation`: wraps it in `data` and sets endpoint and headers.

## Field Mappings

### From config

| Destination field | Source                |
| ----------------- | --------------------- |
| `adv`             | `Config.advertiserId` |
| `tracker_id`      | `Config.trackerId`    |

### Common (`data/TTDCommonConfig.json`)

| Destination field | Source                     |
| ----------------- | -------------------------- |
| `currency`        | `properties.currency`      |
| `client_ip`       | `context.ip`, `request_ip` |
| `referrer_url`    | `context.page.referrer`    |
| `imp`             | `messageId`                |
| `order_id`        | `properties.order_id`      |

### Items (`data/TTDItemConfig.json`)

| Destination field | Source              |
| ----------------- | ------------------- |
| `item_code`       | `product_id`, `sku` |
| `name`            | `name`              |
| `qty`             | `quantity`          |
| `price`           | `price`             |
| `cat`             | `category_id`       |

- Events with `itemsArray` (`Order Completed`, `Checkout Started`, `Cart Viewed`): one item per `properties.products[]` entry; other product keys are copied onto the item.
- Other ecommerce events (`Product Added`, `Product Viewed`, `Product Added to Wishlist`): one item built from `properties`.
- Custom events: no `items`.

### Event name (`event_name`)

1. `Config.eventsMapping` match on the lowercased event name.
2. Built-in ecommerce map (`ECOMM_EVENT_MAP` in `config.js`).
3. Otherwise the original event name.

### Revenue (`value`)

- Default: `properties.value`.
- `Product Added`, `Product Viewed`, `Product Added to Wishlist`: `price * quantity` (quantity defaults to 1) when `price` is numeric.
- `Order Completed`, `Checkout Started`: `properties.revenue`, falling back to `properties.value`. `Order Completed` without either throws `value is required for 'Order Completed' event`.

### Advertising ID (`adid`, `adid_type`)

1. `context.device.advertisingId` with type from `context.os.name`: `android` → `AAID`, `windows` → `NAID`, Apple family → `IDFA`.
2. Otherwise the first `context.externalId[]` entry whose `type` (uppercased) is one of `TDID`, `IDFA`, `AAID`, `DAID`, `NAID`, `IDL`, `EUID`, `UID2`.

### Custom properties

- For each `Config.customProperties` row, `get(message, rudderProperty)` is sent as `tradeDeskProperty`, and the source path is **removed from the message** so it is not sent twice.

### Privacy (from `integrations.THE_TRADE_DESK`)

- `data_processing_option`: `{ policies: ["LDU"], region }`, set only when `region` is present. Region must start with `us`; only `LDU` is accepted.
- `privacy_settings`: passed through as-is.

### Leftover properties

- Custom events: every `properties` key except `value` is copied to the root.
- Ecommerce events with `products`: every key except `products`, `revenue`, `value`.
- Other ecommerce events: every key except the item mapping source keys.

## Example

```json
{
  "data": [
    {
      "tracker_id": "trk123",
      "adv": "adv123",
      "currency": "USD",
      "imp": "msg-1",
      "order_id": "o-1",
      "event_name": "purchase",
      "value": 50,
      "items": [{ "item_code": "p-1", "name": "Shoe", "qty": 1, "price": 50 }],
      "adid": "AAAA-BBBB",
      "adid_type": "AAID"
    }
  ]
}
```

## Known Issues

- `getRevenue` destructures `properties` without a guard: `Product Added`, `Product Viewed` or `Product Added to Wishlist` without `properties` throws a `TypeError` instead of an `InstrumentationError`.
- `prepareItemsFromProducts` calls `products.forEach` without checking: `Order Completed`, `Checkout Started` or `Cart Viewed` without `properties.products` throws a `TypeError`.
- `getDataProcessingOptions` assumes `policies` is an array. A string such as `"LDU"` fails with `Only one policy is allowed`.
- The event `timestamp` is not mapped. NEEDS REVIEW: check whether the API accepts an event time.

## Use Cases

- Server-side conversion tracking for Trade Desk campaigns (purchases, add to cart, leads), matched on device advertising IDs, TDID, UID2 or EUID.
