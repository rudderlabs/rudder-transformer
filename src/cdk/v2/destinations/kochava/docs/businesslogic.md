# Kochava Business Logic and Mappings

## Request

- Method: `POST`
- Endpoint: `https://control.kochava.com/track/json`
- Headers: none set by the workflow
- `userId` on the response: `message.anonymousId`

## Payload Mapping

`deviceId` = `context.device.id` ?? `anonymousId` ?? `""`. Apple family is detected with `isAppleFamily(context.os.name)`; Android when `context.os.name` lowercased is `android`.

| Kochava field                         | Source                                                                             |
| ------------------------------------- | ---------------------------------------------------------------------------------- |
| `kochava_app_id`                      | `Config.apiKey`                                                                    |
| `kochava_device_id`                   | `deviceId`                                                                         |
| `action`                              | `rudderAction` ?? `"event"`                                                        |
| `data.event_name`                     | see below                                                                          |
| `data.event_data`                     | `properties` ?? `{}`                                                               |
| `data.usertime`                       | event timestamp in milliseconds                                                    |
| `data.app_version`                    | `context.app.build`                                                                |
| `data.app_name`                       | `context.app.name`                                                                 |
| `data.app_short_string`               | `context.app.version`                                                              |
| `data.origination_ip`                 | `context.ip` ?? `request_ip`                                                       |
| `data.locale`                         | `context.locale`                                                                   |
| `data.os_version`                     | `context.os.version`                                                               |
| `data.screen_dpi`                     | `context.screen.density`                                                           |
| `data.app_tracking_transparency.att`  | `context.device.attTrackingStatus === 3`                                           |
| `data.device_ver`                     | `{device.model}-{os.name}-{os.version}` when model and OS version exist, else `""` |
| `data.device_ids.idfa` / `idfv`       | Apple: `context.device.advertisingId` / `deviceId`; else `""`                      |
| `data.device_ids.adid` / `android_id` | Android: `context.device.advertisingId` / `deviceId`; else `""`                    |
| `data.device_ua`                      | `context.userAgent` ?? `""`                                                        |
| `data.currency`                       | `properties.currency` ?? `"USD"`                                                   |

Null and undefined values are removed.

## Event Name

- `screen`: `"screen view"` plus `properties.name` if present (for example `screen view Home`).
- `track`: lowercased `event`, translated through `eventNameMapping`, else the lowercased name:

| RudderStack event           | Kochava event     |
| --------------------------- | ----------------- |
| `product added`             | `Add to Cart`     |
| `product added to wishlist` | `Add to Wishlist` |
| `checkout started`          | `Checkout Start`  |
| `order completed`           | `Purchase`        |
| `product reviewed`          | `Rating`          |
| `products searched`         | `Search`          |

A `track` without `event` has no `event_name`.

## Error Handling

Only workflow validation errors. Kochava returns HTTP 200 with `{"success":"1"}` even for Free App Analytics accounts, where S2S post-install events are dropped (per third-party integration docs; NEEDS REVIEW).

## General Use Cases

Mobile attribution: report in-app events (purchases, add to cart) to Kochava for campaign measurement.
