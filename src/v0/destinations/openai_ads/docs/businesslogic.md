# OpenAI Ads Business Logic

## Request

- **Method**: `POST`
- **Endpoint**: `https://bzr.openai.com/v1/events?pid=<pixelId>`
- **Headers**: `Authorization: Bearer <apiKey>`, `Content-Type: application/json`
- **Body**: `{ "events": [ ...up to 1000 events ] }`

## Flow (`buildOpenAIEvent`)

1. **Event mapping** (`resolveEventMapping`): source name is `event` for track, `name` for page and screen; matched case-insensitively against `eventMapping[].from`.
   - No row, but the name is a standard OpenAI event → used as-is.
   - No row, page or screen → `page_viewed`.
   - Otherwise → `InstrumentationError`.
2. **Top-level fields** (`topLevelMappings`): timestamp, action source, source URL, `oppref`, opt-out.
3. **Timestamp window check** (7 days back, 10 minutes ahead), before any hashing.
4. **User** (`buildUser`): hashed, list and scalar match keys.
5. **Data** (`buildEventData`): data type from the event, amount, currency, contents; for `custom` events, leftover `properties`.
6. **Event ID**: `deduplicationKey` value or `messageId`.

## Standard events and data types

| Event                                                                                            | `data.type`       |
| ------------------------------------------------------------------------------------------------ | ----------------- |
| `checkout_started`, `contents_viewed`, `items_added`, `order_created`, `page_viewed`             | `contents`        |
| `app_installed`, `app_opened`, `appointment_scheduled`, `lead_created`, `registration_completed` | `customer_action` |
| `subscription_created`, `trial_started`                                                          | `plan_enrollment` |
| `custom` (with `custom_event_name`)                                                              | `custom`          |

`customer_action` events never get `contents`.

## Field Mappings (`data/OPENAI_ADSConfig.json`)

### Top level

| Destination     | Source (first found)                                                              |
| --------------- | --------------------------------------------------------------------------------- |
| `timestamp_ms`  | `timestamp`, `originalTimestamp`, `sentAt`, `receivedAt` (required)               |
| `action_source` | `properties.action_source`, `properties.actionSource`, else `defaultActionSource` |
| `source_url`    | `properties.source_url`, `properties.sourceUrl`, `context.page.url`               |
| `oppref`        | `properties.oppref`                                                               |
| `opt_out`       | `properties.optOut`, `properties.opt_out`                                         |

### User (hashed, SHA-256, lowercase hex arrays)

| Destination            | Source                                                        | Normalization                          |
| ---------------------- | ------------------------------------------------------------- | -------------------------------------- |
| `emails_sha256`        | `traits.emails`, `traits.email` (and `context.traits.*`)      | trim, lowercase, must be a valid email |
| `phone_numbers_sha256` | `traits.phoneNumbers`, `phone_numbers`, `phones`, `phone`     | digits only, strip leading zeros       |
| `external_ids_sha256`  | `userId`, else `anonymousId`                                  | trim, lowercase                        |
| `first_names_sha256`   | `traits.firstNames`, `first_names`, `firstName`, `first_name` | lowercase, strip punctuation           |
| `last_names_sha256`    | `traits.lastNames`, `last_names`, `lastName`, `last_name`     | lowercase, strip punctuation           |

### User (plain)

| Destination              | Source                                                                                  |
| ------------------------ | --------------------------------------------------------------------------------------- |
| `regions`                | `traits.regions`, `traits.region`                                                       |
| `postal_codes`           | `traits.postalCodes`, `postal_codes`, `postalCode`, `postal_code`                       |
| `cities`                 | `traits.cities`, `traits.address.city`, `traits.city`                                   |
| `countries`              | `traits.countries`, `traits.country`                                                    |
| `obref`                  | `traits.obref`                                                                          |
| `android_advertising_id` | `traits.android_advertising_id`, `androidAdvertisingId`, `context.device.advertisingId` |
| `ip_address`             | `context.ip`, `request_ip` (dropped if not a valid IP)                                  |
| `user_agent`             | `context.userAgent`, `context.user_agent`                                               |

Each trait path is also checked under `context.traits`.

### Data

| Destination               | Source                                                                                 |
| ------------------------- | -------------------------------------------------------------------------------------- |
| `amount`                  | `properties.amount`, `value`, `revenue` → integer minor units (half away from zero)    |
| `currency`                | `properties.currency`, else `defaultCurrency`                                          |
| `contents[]`              | `properties.contents` or `properties.products`                                         |
| `contents[].id`           | `id`, `content_id`, `contentId`, `item_id`, `itemId`, `product_id`, `productId`, `sku` |
| `contents[].name`         | `name`, `title`, `product_name`, `productName`                                         |
| `contents[].content_type` | `content_type`, `contentType`, `type`, `category`, `product_category`                  |
| `contents[].group_id`     | `group_id`, `groupId`                                                                  |
| `contents[].variant_dict` | `variant_dict`, `variantDict` (objects only)                                           |
| `contents[].quantity`     | `quantity`, `count` (integer)                                                          |
| `contents[].amount`       | `amount`, `value`, `price` (minor units)                                               |
| `contents[].currency`     | `currency`, `currency_code`, `currencyCode`, else event currency                       |

## Example

```json
{
  "events": [
    {
      "id": "msg-1",
      "type": "order_created",
      "timestamp_ms": 1763280000000,
      "action_source": "web",
      "source_url": "https://shop.example.com/checkout",
      "user": {
        "emails_sha256": ["<sha256>"],
        "external_ids_sha256": ["<sha256>"],
        "ip_address": "203.0.113.1"
      },
      "data": {
        "type": "contents",
        "amount": 4999,
        "currency": "USD",
        "contents": [{ "id": "sku-1", "quantity": 1, "amount": 4999, "currency": "USD" }]
      }
    }
  ]
}
```

## Error Handling (`delivery.ts`)

- `400`, `422`: retried with `dontBatch: true` so each job is sent alone and only the bad one fails.
- Other statuses: framework default classification. Messages combine `error.message`, `code`, `param` and nested `errors[]`.

## Known Issues

- **No cap of three values per identifier list.** OpenAI returns `400` when any user list (for example `emails_sha256`) has more than three values and does not truncate. The code dedupes but does not cap, so one user with four emails fails the batch, which then re-sends every job alone.
- **`integration_source` is not sent.** OpenAI asks partners sending on behalf of advertisers to set a stable `integration_source` on every request.
- `isHashRequired` is read from config but not exposed in integrations-config, so it is always `true`.

## Use Cases

- Server-side conversion tracking for ChatGPT ads campaigns, alongside or instead of the OpenAI Measurement Pixel.
