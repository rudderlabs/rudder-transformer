# TikTok Ads Offline Events Business Logic

## Requests

| Path      | Endpoint                                                            | Body                                                          |
| --------- | ------------------------------------------------------------------- | ------------------------------------------------------------- |
| Router    | `POST https://business-api.tiktok.com/open_api/v1.3/offline/batch/` | `{ event_set_id, partner_name: "RudderStack", batch: [...] }` |
| Processor | `POST https://business-api.tiktok.com/open_api/v1.3/offline/track/` | single event payload                                          |

Headers: `Access-Token: <accessToken>`, `Content-Type: application/json`.

## Flow

1. `process` checks `accessToken` and `type === track`.
2. `trackResponseBuilder` lowercases and trims `event`, then:
   - If it is in `eventsToStandard`, builds one payload per mapped TikTok event.
   - Else if it is in `EVENT_NAME_MAPPING`, builds one payload.
   - Else throws `InstrumentationError`.
3. `getTrackResponse` maps fields, sets `event` and `partner_name`, adds `properties.contents`, and adds hashed or plain `context.user.emails` and `context.user.phone_numbers`.
4. `processRouterDest` groups results by `event_set_id`, batches 80 per request with `batchMultiplexedEvents`, and sends each batch to `/offline/batch/`.

## Built-in Event Map (`config.js`)

| RudderStack event (lowercase)                | TikTok event                               |
| -------------------------------------------- | ------------------------------------------ |
| `addpaymentinfo`, `payment info entered`     | `AddPaymentInfo`                           |
| `addtocart`, `product added`                 | `AddToCart`                                |
| `addtowishlist`, `product added to wishlist` | `AddToWishlist`                            |
| `checkout started`                           | `InitiateCheckout`                         |
| `checkout step completed`                    | `CompletePayment`                          |
| `clickbutton`                                | `ClickButton`                              |
| `completeregistration`                       | `CompleteRegistration`                     |
| `contact`                                    | `Contact`                                  |
| `download`                                   | `Download`                                 |
| `order completed`                            | `PlaceAnOrder` (soft-deprecated by TikTok) |
| `purchase`                                   | `Purchase`                                 |
| `search`                                     | `Search`                                   |
| `submitform`                                 | `SubmitForm`                               |
| `subscribe`                                  | `Subscribe`                                |
| `viewcontent`                                | `ViewContent`                              |

## Field Mappings

### Event (`data/TikTokTrack.json`)

| Destination                | Source                                      | Required |
| -------------------------- | ------------------------------------------- | -------- |
| `event_set_id`             | `properties.eventSetId`                     | Yes      |
| `event_id`                 | `properties.eventId`, `messageId`           | No       |
| `timestamp`                | `timestamp` (generic map)                   | Yes      |
| `properties.order_id`      | `properties.order_id`, `properties.orderId` | No       |
| `properties.shop_id`       | `properties.shop_id`, `properties.shopId`   | No       |
| `properties.currency`      | `properties.currency`                       | No       |
| `properties.value`         | `properties.value`                          | No       |
| `properties.event_channel` | `context.channel`                           | No       |
| `event`                    | Mapped TikTok event name                    | —        |
| `partner_name`             | `"RudderStack"`                             | —        |

### Contents (`data/ContentsObject.json`)

Built from each `properties.products[]` item, or from `properties` when there is no products array.

| Destination        | Source                        |
| ------------------ | ----------------------------- |
| `content_name`     | `name`                        |
| `content_type`     | `content_type`, `contentType` |
| `content_category` | `category`                    |
| `content_id`       | `product_id`, `productId`     |
| `price`            | `price`                       |
| `quantity`         | `quantity`                    |

### User

| Destination                  | Source                                 | Processing                                                          |
| ---------------------------- | -------------------------------------- | ------------------------------------------------------------------- |
| `context.user.emails`        | `traits.email`, `context.traits.email` | trim, lowercase, SHA-256 if `hashUserProperties`                    |
| `context.user.phone_numbers` | `traits.phone`, `context.traits.phone` | trim (array items also lowercased), SHA-256 if `hashUserProperties` |

Arrays are accepted for both.

## Example (router)

```json
{
  "event_set_id": "1234567890",
  "partner_name": "RudderStack",
  "batch": [
    {
      "event_set_id": "1234567890",
      "event_id": "msg-1",
      "timestamp": "2026-11-15T10:00:00.000Z",
      "event": "Purchase",
      "partner_name": "RudderStack",
      "properties": {
        "order_id": "o-1",
        "currency": "USD",
        "value": 120,
        "contents": [{ "content_id": "sku-1", "price": 60, "quantity": 2 }]
      },
      "context": { "user": { "emails": ["<sha256>"], "phone_numbers": ["<sha256>"] } }
    }
  ]
}
```

## Known Issues

- Email and phone call `.trim()` without a type check. A numeric `phone` (or a non-string array item) throws a `TypeError` instead of an `InstrumentationError`.
- Phone numbers are not normalized to E.164 before hashing. NEEDS REVIEW: confirm TikTok's required phone format for offline events.
- The default map still sends `Order Completed` as `PlaceAnOrder`, which TikTok has soft-deprecated in favour of `Purchase`.
- The processor `process` result includes an extra top-level `event_set_id` key on each response (used for grouping in the router path).

## Use Cases

- Attribute in-store purchases, call-center orders or CRM conversions to TikTok campaigns.
