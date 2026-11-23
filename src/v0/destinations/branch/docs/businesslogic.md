# Branch Business Logic

## Endpoints

| Category                                | Endpoint                                   | Method |
| --------------------------------------- | ------------------------------------------ | ------ |
| Standard (commerce, content, lifecycle) | `https://api2.branch.io/v2/event/standard` | POST   |
| Custom                                  | `https://api2.branch.io/v2/event/custom`   | POST   |

Headers: `Content-Type: application/json`, `Accept: application/json`. Body always includes `branch_key: Config.branchKey`. Null and undefined values are removed. The response `userId` is set to `message.anonymousId`.

## Event name resolution

1. **Track**: if `eventsMapping` has an entry whose `from` equals `message.event`, use its `to`. Otherwise use `message.event`.
2. **Identify**: the name is `message.userId`.
3. The name is matched case-insensitively against both the RudderStack keys and Branch values of each category in `data/eventMapping.js`. A match gives the Branch name and category; no match means a custom event with the name unchanged.

Built-in name map:

| Category  | RudderStack name → Branch name                                                                                                                                                                                                                                                                                                                            |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Commerce  | Product Added → ADD_TO_CART; Product Added to Wishlist → ADD_TO_WISHLIST; Cart Viewed → VIEW_CART; Checkout Started → INITIATE_PURCHASE; Payment Info Entered → ADD_PAYMENT_INFO; **Order Completed → ADD_PAYMENT_INFO**; Spend Credits → SPEND_CREDITS; Promotion Viewed → VIEW_AD; Promotion Clicked → CLICK_AD; Purchase → PURCHASE; Reserve → RESERVE |
| Content   | Products Searched → SEARCH; Product Viewed → VIEW_ITEM; Product List Viewed → VIEW_ITEMS; Product Reviewed → RATE; Product Shared → SHARE; Initiate Stream → INITIATE_STREAM; Complete Stream → COMPLETE_STREAM                                                                                                                                           |
| Lifecycle | Complete Registration, Complete Tutorial, Achieve Level, Unlock Achievement, Invite, Login, Start Trial, Subscribe → upper snake case of the same name                                                                                                                                                                                                    |

### Known issues

- **`Order Completed` maps to `ADD_PAYMENT_INFO`**, not `PURCHASE`. Order Completed is the RudderStack e-commerce purchase event, so purchases are reported to Branch as payment-info events unless the user overrides it with `eventsMapping`. **NEEDS REVIEW**: likely bug.
- **Identify sends a custom event named after the user ID** (for example `name: "sampath"`), with traits in `custom_data`. This is covered by the component tests, so it is existing behaviour, but it creates one custom event name per user in Branch. **NEEDS REVIEW**.

## Properties mapping

Source object: `properties` for track, generic `traits` (`traits`, `context.traits`) for identify. For each key:

1. If the category has `content_items` and the key is a product field, it goes into a content item under the Branch name.
2. Else, if the key is in the category's `event_data` list, it goes into `event_data`.
3. Else it goes into `custom_data`.

Custom events have no `content_items`/`event_data` lists, so all keys go to `custom_data`.

`properties.products[]`: each product becomes its own content item. Top-level product fields form one more content item that is always appended (it can be `{}`).

Empty `custom_data`, `content_items` or `event_data` objects are set to `null` and removed, but `content_items` is an array and is never empty, so `[{}]` can be sent.

Content item field map (`product` in `eventMapping.js`): `title→$og_title`, `description→$og_description`, `image_url→$og_image_url`, `canonical_identifier→$canonical_identifier`, `price→$price`, `quantity→$quantity`, `sku→$sku`, `name→$product_name`, `brand→$product_brand`, `category→$product_category`, `variant→$product_variant`, `rating_*→$rating_*`, `creating_timestamp→$creation_timestamp`, `exp_date→$exp_date`, `keywords→$keywords`, `address_*→$address_*`, `latitude→$latitude`, `longitude→$longitude`, `image_captions→$image_captions`, `condition→$condition`, plus `publicly_indexable`, `locally_indexable`.

`event_data` keys: commerce `transaction_id, currency, revenue, shipping, tax, coupon, description`; content `search_query, description`; lifecycle `description`.

## user_data mapping

| Source                                                       | Destination                      |
| ------------------------------------------------------------ | -------------------------------- |
| `context.os.name`                                            | `os`                             |
| `context.os.version`                                         | `os_version`                     |
| `context.app.version`                                        | `app_version`                    |
| `context.device.model`                                       | `model`                          |
| `context.device.brand`                                       | `brand`                          |
| `context.screen.density`                                     | `screen_dpi`                     |
| `context.screen.height` / `width`                            | `screen_height` / `screen_width` |
| generic `userId` (falls back to `anonymousId`)               | `developer_identity`             |
| `context.userAgent`                                          | `user_agent`                     |
| iOS family: `context.idfa` or `context.device.advertisingId` | `idfa`                           |
| iOS family: `context.idfv` or `context.device.id`            | `idfv`                           |
| Android: `context.android_id` or `context.device.id`         | `android_id`                     |
| Android: `context.aaid` or `context.device.advertisingId`    | `aaid`                           |
| `context.device.attTrackingStatus` 3 / 2                     | `limit_ad_tracking` false / true |

Not sent: `ip`, `dma_*` consent fields, `browser_fingerprint_id`, `advertising_ids`.

## Example

Input:

```json
{
  "type": "track",
  "event": "Product Added",
  "anonymousId": "a1",
  "userId": "u1",
  "context": { "os": { "name": "iOS", "version": "17" }, "device": { "advertisingId": "IDFA-1" } },
  "properties": { "sku": "S1", "price": 10, "currency": "USD", "color": "red" }
}
```

Output (`POST /v2/event/standard`):

```json
{
  "branch_key": "<key>",
  "name": "ADD_TO_CART",
  "content_items": [{ "$sku": "S1", "$price": 10 }],
  "event_data": { "currency": "USD" },
  "custom_data": { "color": "red" },
  "user_data": { "os": "iOS", "os_version": "17", "developer_identity": "u1", "idfa": "IDFA-1" }
}
```

## Error Handling

- `InstrumentationError`: missing track `event`, unsupported type.
- No custom response handling. Branch returns `400` for authentication failure (bad Branch Key) and `429` for rate limits.
