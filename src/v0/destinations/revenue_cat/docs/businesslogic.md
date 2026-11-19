# RevenueCat Business Logic and Mappings

## Endpoints

Base URL: `https://api.revenuecat.com/v1`.

| Flow     | Endpoint                                | Method | Headers                                       |
| -------- | --------------------------------------- | ------ | --------------------------------------------- |
| identify | `/subscribers/{app_user_id}`            | GET    | `Authorization`, `Content-Type`               |
| identify | `/subscribers/{app_user_id}/attributes` | POST   | `Authorization`, `Content-Type`               |
| track    | `/receipts`                             | POST   | `Authorization`, `Content-Type`, `X-Platform` |

`app_user_id` is inserted into the path without URL encoding.

## Identify (`RCIdentifyConfig.json`)

Body: `{ "attributes": { "<name>": { "value": "<string>" } } }`.

| RudderStack field                                                                                                                                                                                               | RevenueCat attribute                           |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| generic `userId` (includes `anonymousId`), required                                                                                                                                                             | `app_user_id` (also in path)                   |
| generic `name`, else `firstName lastName`                                                                                                                                                                       | `$displayName`                                 |
| generic `emailOnly`                                                                                                                                                                                             | `$email`                                       |
| generic `phone`                                                                                                                                                                                                 | `$phoneNumber`                                 |
| `traits.apnsTokens`, `fcmTokens`, `gpsAdId`                                                                                                                                                                     | `$apnsTokens`, `$fcmTokens`, `$gpsAdId`        |
| `context.idfa` / `context.device.advertisingId`                                                                                                                                                                 | `$idfa`                                        |
| `context.idfv` / `context.device.id`                                                                                                                                                                            | `$idfv`                                        |
| `context.device.advertisingId`                                                                                                                                                                                  | `$androidId`                                   |
| `context.campaign.name`                                                                                                                                                                                         | `$campaign`                                    |
| `context.ip` / `request_ip`                                                                                                                                                                                     | `$ip`                                          |
| `traits.creative`, `keyword`, `mediaSource`, `ad`                                                                                                                                                               | `$creative`, `$keyword`, `$mediaSource`, `$ad` |
| `traits.addGroup`                                                                                                                                                                                               | `$adGroup`                                     |
| `traits.adjustId`, `appsflyerId`, `fbAnonId`, `iterableUserId`, `iterableCampaignId`, `iterableTemplateId`, `mixpanelDistinctId`, `mparticleId`, `onesignalId`, `airshipChannelId`, `amazonAdId`, `clevertapId` | same name with `$` prefix                      |

Trait sources check both `traits` and `context.traits`. All other traits (not in `REVENUE_CAT_IDENTIFY_EXCLUSION`) become custom attributes `{ key: { value: String(value) } }`.

## Track (`RCTrackConfig.json`)

| RudderStack field                          | RevenueCat field                |
| ------------------------------------------ | ------------------------------- |
| generic `userId`, required                 | `app_user_id`                   |
| `properties.fetch_token`, required         | `fetch_token`                   |
| `properties.product_id`                    | `product_id`                    |
| `properties.price`                         | `price`                         |
| `properties.currency`                      | `currency`                      |
| `properties.payment_mode`                  | `payment_mode`                  |
| `properties.introductory_price`            | `introductory_price`            |
| `properties.is_restore`                    | `is_restore`                    |
| `properties.presented_offering_identifier` | `presented_offering_identifier` |

When `properties.products` is an array, one request is built per product; each product's `product_id`, `price`, `introductory_price`, `is_restore`, `presented_offering_identifier` override the top-level values (`RCProductConfig.json`). The event name is not used.

## Notes and Possible Issues

- `Authorization: Basic <raw apiKey>` (see README, Authentication).
- `$androidId` is mapped from `context.device.advertisingId` (the Android advertising ID / GAID), not the Android device ID. `NEEDS REVIEW`.
- `$adGroup` is read from `traits.addGroup` (typo in source key); `traits.adGroup` is excluded from custom attributes and therefore dropped. Likely bug.
- The `!payload` check in `identifyResponseBuilder` runs after `set(payload, ...)`, so it can never catch a null payload.

## Example (identify)

```json
[
  {
    "method": "GET",
    "endpoint": "https://api.revenuecat.com/v1/subscribers/user-1",
    "headers": { "Authorization": "Basic <apiKey>", "Content-Type": "application/json" }
  },
  {
    "method": "POST",
    "endpoint": "https://api.revenuecat.com/v1/subscribers/user-1/attributes",
    "headers": { "Authorization": "Basic <apiKey>", "Content-Type": "application/json" },
    "body": {
      "JSON": {
        "attributes": {
          "app_user_id": { "value": "user-1" },
          "$email": { "value": "jane@example.com" },
          "plan": { "value": "pro" }
        }
      }
    }
  }
]
```
