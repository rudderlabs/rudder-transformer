# Facebook App Events Business Logic and Mappings

## Overview

`transform.js` builds a base event (`buildBaseEvent`), adds the event name and properties (`processEventTypeGeneric`), normalises and hashes user data (`sanityCheckPayloadForTypesAndModifications`), and returns a form-encoded request (`responseBuilderSimple`).

- **Endpoint**: `POST https://graph.facebook.com/v25.0/{appID}/activities`
- **Body**: `FORM` (form-encoded). `custom_events` and `extinfo` are JSON strings.
- **Headers**: `x-forwarded-for` = `context.ip` or `request_ip`
- **Fixed field**: `event = "CUSTOM_APP_EVENTS"`

## Base Mapping (`data/FbAppBasicMapping.json`)

| RudderStack field                         | Facebook field                 | Notes                                                |
| ----------------------------------------- | ------------------------------ | ---------------------------------------------------- |
| `userId`                                  | `app_user_id`                  |                                                      |
| `anonymousId`                             | `anon_id`                      | Dropped when user data or `advertiser_id` is present |
| `context.device.adTrackingEnabled`        | `advertiser_tracking_enabled`  | Converted to `"0"`/`"1"` (NaN becomes `"0"`)         |
| `properties.application_tracking_enabled` | `application_tracking_enabled` | Converted to `"0"`/`"1"` (NaN becomes `"0"`)         |
| `context.device.advertisingId`            | `advertiser_id`                |                                                      |
| `timestamp`                               | `custom_events[0]._logTime`    | Converted to epoch milliseconds                      |
| `event`                                   | `custom_events[0]._eventName`  | Overwritten by the mapped event name                 |

### `extinfo` array

| Index | Meaning                | Source                                                           |
| ----- | ---------------------- | ---------------------------------------------------------------- |
| 0     | extinfo version        | `a2` when `context.device.type` is android, `i2` for Apple types |
| 1     | App package name       | `context.app.namespace`                                          |
| 2     | App build              | `context.app.build`                                              |
| 3     | App version            | `context.app.version`                                            |
| 4     | OS version             | `context.os.version`                                             |
| 5     | Device model           | `context.device.model`                                           |
| 6     | Locale                 | `context.locale`                                                 |
| 7     | Time zone abbreviation | `context.abv_timezone`                                           |
| 8     | Carrier                | `context.network.carrier`                                        |
| 9     | Screen width           | `context.screen.width` (integer)                                 |
| 10    | Screen height          | `context.screen.height` (integer)                                |
| 11    | Screen density         | `context.screen.density` (2-decimal string)                      |
| 12    | CPU cores              | `context.cpu_cores` (integer)                                    |
| 13    | Storage size (GB)      | `context.ext_storage_size` (integer)                             |
| 14    | Free space (GB)        | `context.avl_storage_size` (integer)                             |
| 15    | Time zone              | `context.timezone`                                               |

### User data (`ud[...]`)

Sourced from `traits.*` or `context.traits.*`. All values are SHA-256 hashed after normalisation.

| Trait       | Field    | Normalisation                                                   |
| ----------- | -------- | --------------------------------------------------------------- |
| `email`     | `ud[em]` | trim, lowercase                                                 |
| `firstName` | `ud[fn]` | trim, lowercase                                                 |
| `lastName`  | `ud[ln]` | trim, lowercase                                                 |
| `phone`     | `ud[ph]` | digits only, leading zeros removed                              |
| `gender`    | `ud[ge]` | `female` becomes `f`, any other string `m`; non-strings dropped |
| `birthDate` | `ud[db]` | intended `YYYYMMDD` via `getDateInFormat` (see Notes)           |
| `city`      | `ud[ct]` | trim, lowercase, spaces removed                                 |
| `state`     | `ud[st]` | trim, lowercase                                                 |
| `zip`       | `ud[zp]` | digits only, leading zeros removed                              |

## Event Name Mapping (`data/FbAppEventNameMapping.json`)

| RudderStack event         | Facebook event                 |
| ------------------------- | ------------------------------ |
| Application Installed     | `MOBILE_APP_INSTALL`           |
| Application Opened        | `fb_mobile_activate_app`       |
| Products Searched         | `fb_mobile_search`             |
| Product Viewed            | `fb_mobile_content_view`       |
| Product Added             | `fb_mobile_add_to_cart`        |
| Product Added to Wishlist | `fb_mobile_add_to_wishlist`    |
| Payment Info Entered      | `fb_mobile_add_payment_info`   |
| Checkout Started          | `fb_mobile_initiated_checkout` |
| Order Completed           | `fb_mobile_purchase`           |

Other track events keep their name. Screen events become `Viewed {properties.name} Screen` (or `Viewed Screen`); page events become `Viewed Page`.

## Property Mapping (`data/FbAppEventPropsMapping.json`)

| RudderStack property    | Facebook parameter | Type     |
| ----------------------- | ------------------ | -------- |
| `revenue`               | `_valueToSum`      | number   |
| `currency`              | `fb_currency`      | string   |
| `name`                  | `fb_description`   | string   |
| `products[].product_id` | `fb_content_id`    | string[] |
| `category`              | `fb_content_type`  | string   |
| `query`                 | `fb_search_string` | string   |
| `quantity`              | `fb_num_items`     | number   |

Any other property is copied into `custom_events[0]` under its key. Keys that fail the name regex have non-alphanumeric characters removed (and are cut to 40 characters when longer); a key left empty fails the event.

## Example

Input:

```json
{
  "type": "track",
  "event": "Order Completed",
  "anonymousId": "anon-1",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "context": {
    "device": { "type": "android", "advertisingId": "ad-id", "adTrackingEnabled": true },
    "app": { "namespace": "com.example.app", "version": "1.0.0" },
    "traits": { "email": "jane@example.com" },
    "ip": "1.2.3.4"
  },
  "properties": { "revenue": 10, "currency": "USD" }
}
```

Output (abridged):

```json
{
  "endpoint": "https://graph.facebook.com/v25.0/<appID>/activities",
  "method": "POST",
  "headers": { "x-forwarded-for": "1.2.3.4" },
  "body": {
    "FORM": {
      "event": "CUSTOM_APP_EVENTS",
      "advertiser_id": "ad-id",
      "advertiser_tracking_enabled": "1",
      "application_tracking_enabled": "0",
      "ud[em]": "<sha256>",
      "extinfo": "[\"a2\",\"com.example.app\",\"\",\"1.0.0\",...]",
      "custom_events": "[{\"_logTime\":1704067200000,\"_eventName\":\"fb_mobile_purchase\",\"_valueToSum\":10,\"fb_currency\":\"USD\"}]"
    }
  }
}
```

## Validations

| Check                                             | Error                                                                                         |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `context.device.type` not android or Apple family | `Extended device information i.e, "context.device.type" is required`                          |
| Message type not track, screen or page            | `Message type <type> not supported`                                                           |
| Event name fails regex                            | `Event name <name> is not a valid FB APP event name...`                                       |
| `revenue` without `currency`                      | `If properties.revenue is present, properties.currency is required.`                          |
| Mapped property of wrong type                     | `Value of <prop> is not of valid type. It should be of type <type>`                           |
| No user data, no advertising ID, no anonymous ID  | `Either context.device.advertisingId or traits or anonymousId must be present for all events` |

## Error Handling

`networkHandler.js` (used only when proxy delivery is enabled) delegates to the shared Facebook error handler, which maps Graph API `code`/`error_subcode` pairs to retryable, aborted or throttled statuses.

## Notes

- `responseBuilderSimple` reads `message?.context.ip`, which throws if `context` is missing. Events reach this point only after `buildBaseEvent`, which already requires `context.device.type`, so this is not reachable in practice.

- `getDateInFormat` (`src/v0/util/index.js`) pads the wrong way: single-digit months and days stay unpadded and two-digit ones get a leading `0` (for example 1990-12-25 becomes `1990012025`). The hashed `ud[db]` therefore does not match Meta's `YYYYMMDD` format. NEEDS REVIEW.

## General Use Cases

- Measure mobile installs, opens and purchases for Meta ad attribution and optimisation.
- Send app events server side when the Facebook SDK is not bundled in the app.
