# Pinterest Tag Business Logic

## Endpoints

| API version (`apiVersion`) | Method | Endpoint                                                        | Headers                                                   |
| -------------------------- | ------ | --------------------------------------------------------------- | --------------------------------------------------------- |
| `legacyApi` (v3, default)  | POST   | `https://ct.pinterest.com/events/v3`                            | `Content-Type: application/json`                          |
| `newApi` (v5)              | POST   | `https://api.pinterest.com/v5/ad_accounts/{adAccountId}/events` | `Content-Type`, `Authorization: Bearer {conversionToken}` |

Query params: `{ "test": true }` when `sendAsTestEvent` is on. Router body: `{ "data": [ ... ] }`, up to 1000 events.

## Common Fields

| Destination                   | Source                                                                                                                                               |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `event_time`                  | generic `timestamp`, in seconds (required)                                                                                                           |
| `event_source_url`            | generic `pageUrl`                                                                                                                                    |
| `action_source`               | `traits/context.traits/properties` `.action_source` or `.actionSource`, else `channel` (required, one of `app_android`, `app_ios`, `web`, `offline`) |
| `app_name`                    | `properties.appName` / `context.app.name`                                                                                                            |
| `app_version`                 | `properties.appVersion` / `context.app.version`                                                                                                      |
| `device_brand`                | `properties.manufacturer` / `context.device.manufacturer`                                                                                            |
| `device_model`                | `properties.deviceModel` / `context.device.model`                                                                                                    |
| `device_type`                 | `properties.deviceType` / `context.device.type`                                                                                                      |
| `os_version`                  | `context.os.version`                                                                                                                                 |
| `language`                    | `properties.language` / `context.traits.language` / `context.locale`                                                                                 |
| `advertiser_tracking_enabled` | `context.device.adTrackingEnabled` (v5 only, boolean)                                                                                                |
| `opt_out`                     | `!context.device.adTrackingEnabled` when defined                                                                                                     |
| `event_id`                    | value at `Config.deduplicationKey` path, else `messageId`                                                                                            |
| `app_id`                      | `Config.appId`                                                                                                                                       |
| `advertiser_id`               | `Config.advertiserId` (removed for v5)                                                                                                               |
| `partner_name`                | `properties.partnerName`                                                                                                                             |
| `device_carrier`              | `context.network.carrier`, only when `properties.partnerName` is set                                                                                 |
| `wifi`                        | `context.network.wifi`                                                                                                                               |
| `event_name`                  | see Event Names                                                                                                                                      |

## User Data (`user_data`)

| Destination           | Source                                          | Normalization before hashing                 |
| --------------------- | ----------------------------------------------- | -------------------------------------------- |
| `em`                  | generic `email`                                 | trim, lowercase                              |
| `ph`                  | generic `phone`                                 | digits only, leading zeros removed           |
| `ge`                  | `traits.gender` / `context.traits.gender`       | `f`/`m`/`n` from common spellings; lowercase |
| `db`                  | generic `birthday`                              | none                                         |
| `fn`, `ln`            | generic `firstName`, `lastName`                 | trim, lowercase                              |
| `ct`, `st`, `country` | `traits.address.*` / `context.traits.address.*` | trim, lowercase                              |
| `zp`                  | `address.zip`                                   | digits only                                  |
| `hashed_maids`        | `context.device.advertisingId`                  | none                                         |
| `client_ip_address`   | `context.ip` / `request_ip`                     | not hashed, string                           |
| `client_user_agent`   | `context.userAgent`                             | not hashed, string                           |
| `external_id`         | generic `userId` (only if `sendExternalId`)     | hashed                                       |
| `click_id`            | `properties.clickId`                            | not hashed, string                           |
| `partner_id`          | `traits.partnerId` / `context.traits.partnerId` | not hashed, string                           |

- `sendingUnHashedData: true`: every field except `client_user_agent`, `client_ip_address`, `click_id`, `partner_id` is normalized, SHA-256 hashed and wrapped in an array.
- `sendingUnHashedData: false`: values are only wrapped in arrays; raw `gender` is passed through as `ge`.
- Validation: at least `em`, `hashed_maids`, or both `client_ip_address` and `client_user_agent`.

## Custom Data (`custom_data`, Track only)

| Destination                                         | Source                                                                                          |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `currency`                                          | `properties.currency`                                                                           |
| `value`                                             | `properties.value` / `total` / `revenue` (string)                                               |
| `num_items`                                         | sum of `products[].quantity`, else `properties.quantity`; overridden by `properties.numOfItems` |
| `order_id`                                          | `properties.order_id`                                                                           |
| `search_string`                                     | `properties.query`                                                                              |
| `opt_out_type`                                      | `properties.optOutType`                                                                         |
| `content_name`, `content_category`, `content_brand` | `properties.contentName`, `contentCategory`, `contentBrand`                                     |
| `np`                                                | `properties.np`                                                                                 |
| `content_ids`                                       | `products[].product_id ?? sku ?? id` (or top-level)                                             |
| `contents`                                          | per product `{ quantity (default 1), item_price, item_name, id, item_category, item_brand }`    |

## Event Names

- **Page**: `view_category` if `message.category` is set, else `page_visit`.
- **Track / Screen** (`event` or `name`), first match wins:
  1. `eventsMapping` entries with `from === event` (case-sensitive), `to` converted to snake_case. Can return several names.
  2. Default e-commerce map (case-insensitive): `order completed` → `checkout`; `product added` → `add_to_cart`; `products searched`, `product list filtered` → `search`.
  3. `custom` if `sendAsCustomEvent` is on.
  4. The original event name.

One payload is produced per event name (multiplexing).

## Example (v5 Track)

Input: `{ "type": "track", "event": "Order Completed", "channel": "web", "messageId": "m1", "timestamp": "2024-01-01T00:00:00Z", "context": { "traits": { "email": "A@b.com" } }, "properties": { "revenue": 20, "currency": "USD", "products": [{ "product_id": "p1", "price": 10, "quantity": 2 }] } }`

Output body (router):

```json
{
  "data": [
    {
      "event_name": "checkout",
      "event_time": 1704067200,
      "action_source": "web",
      "event_id": "m1",
      "user_data": { "em": ["<sha256 of a@b.com>"] },
      "custom_data": {
        "currency": "USD",
        "value": "20",
        "num_items": 2,
        "content_ids": ["p1"],
        "contents": [{ "quantity": 2, "item_price": "10", "id": "p1" }]
      }
    }
  ]
}
```

Illustrative only: empty optional fields (for example `item_name`) are left out.

## Error Handling

- Validation errors fail the single event (400) and are returned alongside batched successes.
- No proxy; partner responses are handled by rudder-server's default status-code logic.

## Use Cases

- Server-side conversion tracking for Pinterest Ads (checkout, add to cart, search, page visits), deduplicated against the Pinterest Tag via `event_id`.
