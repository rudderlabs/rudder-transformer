# Snapchat Conversion Business Logic

## Endpoints

| API | Method / URL                                         | Auth                           | Body                                       |
| --- | ---------------------------------------------------- | ------------------------------ | ------------------------------------------ |
| v2  | `POST https://tr.snapchat.com/v2/conversion`         | `Authorization: Bearer apiKey` | Single object, or batch `JSON_ARRAY.batch` |
| v3  | `POST https://tr.snapchat.com/v3/{pixelId}/events`   | `?access_token=apiKey`         | `{ data: [ ... ] }`                        |
| v3  | `POST https://tr.snapchat.com/v3/{snapAppId}/events` | `?access_token=apiKey`         | `{ data: [ ... ] }` (MOBILE_APP events)    |

## Event Name Resolution

1. `page` → `page_view` → `PAGE_VIEW`.
2. `track`: if `rudderEventsToSnapEvents` has entries whose `from` matches the event (spaces → `_`, case-insensitive), each `to` is used (multiplexing). Otherwise the event name itself must be a key of `eventNameMapping`.

| RudderStack (normalized)                                                                                                             | Snap event            | Mapping file                       |
| ------------------------------------------------------------------------------------------------------------------------------------ | --------------------- | ---------------------------------- |
| `products_searched`                                                                                                                  | `SEARCH`              | `ProductsSearchedConfig[V3]`       |
| `product_list_viewed`                                                                                                                | `VIEW_CONTENT`        | `ProductListViewedConfig[V3]`      |
| `promotion_viewed`                                                                                                                   | `AD_VIEW`             | `PromotionViewedConfig[V3]`        |
| `promotion_clicked`                                                                                                                  | `AD_CLICK`            | `PromotionClickedConfig[V3]`       |
| `product_viewed`                                                                                                                     | `VIEW_CONTENT`        | `ProductViewedConfig[V3]`          |
| `product_added`                                                                                                                      | `ADD_CART`            | `ProductAddedConfig[V3]`           |
| `checkout_started`                                                                                                                   | `START_CHECKOUT`      | `CheckoutStartedConfig[V3]`        |
| `payment_info_entered`                                                                                                               | `ADD_BILLING`         | `PaymentInfoEnteredConfig[V3]`     |
| `order_completed`                                                                                                                    | `PURCHASE`            | `OrderCompletedConfig[V3]`         |
| `product_added_to_wishlist`                                                                                                          | `ADD_TO_WISHLIST`     | `ProductAddedToWishlistConfig[V3]` |
| `sign_up`                                                                                                                            | `SIGN_UP`             | `SignupConfig[V3]`                 |
| `app_open`, `save`, `subscribe`, `login`, `share`, `start_trial`, `list_view`, `page_view`, `app_install`, `custom_event_1..5`, etc. | Upper-case equivalent | `SnapchatTrackDefaultConfig[V3]`   |

For `product_list_viewed`, `checkout_started`, `order_completed`: item ids come from `properties.products[].product_id` and price defaults to the sum of product prices.

## v2 Payload (key fields)

| Snap v2 field                                                                                                                  | Source                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| `event_type`                                                                                                                   | Mapped Snap event                                                       |
| `event_conversion_type`                                                                                                        | `WEB` / `MOBILE_APP` / `OFFLINE`                                        |
| `pixel_id` / `page_url`                                                                                                        | WEB (`page_url` from page URL); OFFLINE sets `pixel_id` only            |
| `snap_app_id`, `app_id`                                                                                                        | MOBILE_APP                                                              |
| `hashed_email`, `hashed_phone_number`                                                                                          | SHA-256 of lowercased/trimmed email; phone digits without leading zeros |
| `hashed_ip_address`, `hashed_mobile_ad_id`, `hashed_idfv`                                                                      | SHA-256 of IP, advertising ID, IDFV                                     |
| `hashed_first_name_sha`, `hashed_last_name_sha`, `hashed_middle_name_sha`, `hashed_city_sha`, `hashed_state_sha`, `hashed_zip` | SHA-256 of traits                                                       |
| `user_agent`, `click_id`, `uuid_c1`, `level`, ...                                                                              | `TrackEventCommonConfig.json`                                           |
| `timestamp`                                                                                                                    | Event timestamp in seconds (string); rejected if older than 37 days     |
| `data_use`                                                                                                                     | `"['lmu']"` when `context.device.attTrackingStatus === 2`               |
| `client_dedup_id`                                                                                                              | `get(message, deduplicationKey \|\| 'messageId')` when dedup enabled    |

Values that already look like 64-character hex are treated as pre-hashed and sent as-is.

## v3 Payload (key fields)

| Snap v3 field                                                           | Source                                                                                                                   |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `data[0].event_name`                                                    | Mapped Snap event                                                                                                        |
| `data[0].action_source`                                                 | `WEB` / `MOBILE_APP` / `OFFLINE`                                                                                         |
| `data[0].event_time`                                                    | Event timestamp in seconds (string); rejected if older than 7 days                                                       |
| `data[0].event_source_url`                                              | Page URL (WEB)                                                                                                           |
| `data[0].app_data.app_id`, `app_data.extinfo`                           | `appId`; `extinfo` array built from context (`a2` Android / `i2` Apple)                                                  |
| `user_data.em`, `user_data.ph`                                          | SHA-256 email (validated with `validator.isEmail`), normalized phone                                                     |
| `user_data.fn`, `ln`, `ge`, `ct`, `zp`, `st`, `country`                 | SHA-256 of lowercased traits                                                                                             |
| `user_data.client_ip_address`, `client_user_agent`                      | `context.ip` / `request_ip`, `context.userAgent` (not hashed)                                                            |
| `user_data.madid`, `idfv`, `sc_click_id`, `sc_cookie1`                  | `TrackEventCommonConfigV3.json`                                                                                          |
| `custom_data.value`, `currency`, `content_ids`, `num_items`, `contents` | Event mapping files; `contents` from `properties.products` (or properties)                                               |
| `data_processing_options`                                               | `"['lmu']"` when `attTrackingStatus === 2`                                                                               |
| `event_id`                                                              | Mapping (`client_dedup_id` / `order_id` / `transaction_id`), overridden by `deduplicationKey` path when dedup is enabled |

## Router Flow

- v2: each event transformed (array when multiplexed) → `batchMultiplexedEvents(..., 2000)` → one request per batch with `JSON_ARRAY: { batch: JSON.stringify([...]) }`.
- v3: events split into `MOBILE_APP` and web/offline chunks → chunks of 2000 → `{ data: [...all data entries] }` using the first event's endpoint/params.

## Example (v3)

Input:

```json
{
  "type": "track",
  "event": "Order Completed",
  "channel": "web",
  "timestamp": "<now>",
  "context": {
    "traits": { "email": "a@b.com" },
    "page": { "url": "https://shop.example/thanks" },
    "userAgent": "Mozilla/5.0",
    "ip": "1.2.3.4"
  },
  "properties": {
    "order_id": "o1",
    "revenue": 20,
    "currency": "USD",
    "products": [{ "product_id": "p1", "price": 20, "quantity": 1 }]
  }
}
```

Output (abridged):

```json
{
  "data": [
    {
      "event_name": "PURCHASE",
      "action_source": "WEB",
      "event_source_url": "https://shop.example/thanks",
      "event_id": "o1",
      "user_data": {
        "em": "<sha256>",
        "client_ip_address": "1.2.3.4",
        "client_user_agent": "Mozilla/5.0"
      },
      "custom_data": {
        "value": 20,
        "currency": "USD",
        "content_ids": ["p1"],
        "contents": [{ "id": "p1", "item_price": 20, "quantity": 1 }]
      },
      "event_time": "<seconds>"
    }
  ]
}
```

`contents` entries carry `id` (`product_id` → `sku` → `id`), `item_price`, `quantity`, `delivery_category`, `brand`. Without `products`, one entry is built from `properties`.

## Errors

- Missing identifiers, unknown event, missing pixel/app IDs, stale timestamp → `InstrumentationError` / `ConfigurationError` per event.
- No proxy; Snap HTTP errors are handled generically by rudder-server.

## Code Observations (NEEDS REVIEW)

- v3 `data_processing_options` is sent as the string `"['lmu']"`; Snap documents a list of strings with values `LMU` / `DELETE`.
- v3 `event_time` is sent as a string of seconds; Snap documents an integer epoch (ms encouraged).
- `getEventConversionType` falls back to `OFFLINE` for any unrecognized channel (for example `server`, `sources`), so server-side web events need `properties.eventConversionType` to be counted as WEB.
