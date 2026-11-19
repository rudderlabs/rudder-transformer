# Rockerbox Business Logic

## Request

- **Method**: `POST`
- **Endpoint**: `https://webhooks.getrockerbox.com/rudderstack?advertiser=<advertiserId>`
- **Headers**: default only (no auth)
- **Body**: JSON payload below, null and undefined removed

## Flow

1. `process` checks `type` and `advertiserId`; only `track` continues.
2. `responseBuilderSimple`:
   - Builds the payload from `data/RockerboxTrackConfig.json`.
   - Requires `customer_id` or `anonymous_id`.
   - Sets `conversion_source: "RudderStack"`.
   - Looks up `event.toLowerCase()` in `eventsMap`; sets `action` or throws.
   - Copies remaining `properties` keys (not in `ROCKERBOX_DEFINED_PROPERTIES`) to the root.

## Field Mappings (`data/RockerboxTrackConfig.json`)

| Destination         | Source                                          | Notes                  |
| ------------------- | ----------------------------------------------- | ---------------------- |
| `customer_id`       | `userIdOnly` (generic map)                      |                        |
| `anonymous_id`      | `anonymousId`                                   |                        |
| `email`             | `emailOnly` (generic map)                       |                        |
| `phone`             | `phone` (generic map)                           |                        |
| `timestamp`         | `timestamp` (generic map)                       | Required, Unix seconds |
| `revenue`           | `properties.revenue`, `value`, `price`, `total` |                        |
| `order_id`          | `properties.orderId`, `properties.order_id`     |                        |
| `in_store`          | `properties.in_store`                           |                        |
| `salesforce`        | `properties.salesforce`                         |                        |
| `country_code`      | `properties.countryCode`                        |                        |
| `listing_id`        | `properties.listingId`                          |                        |
| `action`            | `eventsMap[event.toLowerCase()]`                | Required               |
| `conversion_source` | `"RudderStack"`                                 | Constant               |

## Example

```json
{
  "customer_id": "user-1",
  "anonymous_id": "anon-1",
  "email": "a@example.com",
  "timestamp": 1763200000,
  "revenue": 99.5,
  "order_id": "o-1",
  "action": "purchase",
  "conversion_source": "RudderStack",
  "coupon": "SAVE10"
}
```

## Known Issues

- **Message type mismatch.** `db-config.json` allows `identify` and `page` in cloud mode, but the transformer accepts only `track`, so those events always fail. Either drop them from `supportedMessageTypes.cloud` or support them.
- A track event without `event` throws a `TypeError` at `message.event.toLowerCase()` instead of an `InstrumentationError`.
- Email and phone are sent unhashed.

## Use Cases

- Server-side conversion events (purchases, sign-ups) for Rockerbox multi-touch attribution.
