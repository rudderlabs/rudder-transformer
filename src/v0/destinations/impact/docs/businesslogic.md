# impact.com Business Logic and Mappings

## Overview

`transform.js` validates the config, routes the event to the PageLoad or Conversions endpoint, and builds a form-encoded request.

All requests:

- Method `POST`, body `FORM` (`application/x-www-form-urlencoded`), `null`/`undefined` values removed
- Header `Authorization: Basic base64(accountSID:apiKey)`

## Event Routing

| Message type | Condition                                                        | Endpoint              |
| ------------ | ---------------------------------------------------------------- | --------------------- |
| identify     | `enableIdentifyEvents` on (otherwise configuration error)        | PageLoad              |
| page         | `enablePageEvents` on (otherwise configuration error)            | PageLoad              |
| screen       | `enableScreenEvents` on (otherwise configuration error)          | PageLoad              |
| track        | `event` in `installEventNames`, or equals `Applcation Installed` | Conversions (install) |
| track        | `event` in `actionEventNames`, or equals `Order Completed`       | Conversions (action)  |
| track        | Neither                                                          | PageLoad              |

- PageLoad: `https://trkapi.impact.com/PageLoad`
- Conversions: `https://api.impact.com/Advertisers/{accountSID}/Conversions`

The defaults apply only when the event is not already matched: `Applcation Installed` is checked first, then `Order Completed` (`else if`).

## PageLoad Mapping (`data/ImpactPageLoadConfig.json`)

| RudderStack field                                                                        | impact.com field                                             |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `timestamp` / `originalTimestamp`                                                        | `EventDate`                                                  |
| `traits.email` / `context.traits.email` / `properties.email`                             | `CustomerEmail` (SHA-1 when `enableEmailHashing`, see Notes) |
| `userId` / `traits.userId` / `traits.id` / `context.traits.userId` / `context.traits.id` | `CustomerId`                                                 |
| `anonymousId`                                                                            | `CustomProfileId`                                            |
| `context.page.url` / `properties.url` / `context.page.referrer` / `context.referrer.url` | `PageUrl`                                                    |
| `context.referrer.url` / `context.page.referrer`                                         | `ReferringUrl`                                               |
| `context.userAgent`                                                                      | `UserAgent`                                                  |
| `context.request_ip` / `context.ip`                                                      | `IpAddress`                                                  |
| `context.app.name`                                                                       | `AppName`                                                    |
| `context.app.build`                                                                      | `AppPackage`                                                 |
| `context.app.version`                                                                    | `AppVer`                                                     |
| `context.network.carrier`                                                                | `DeviceCarrier`                                              |
| `context.locale`                                                                         | `DeviceLocale`                                               |
| `context.device.manufacturer`                                                            | `DeviceMfr`                                                  |
| `context.device.model`                                                                   | `DeviceModel`                                                |
| `context.device.adTrackingEnabled`                                                       | `TrackingConsent`                                            |
| `context.device.type` / `context.os.name`                                                | `DeviceOs`                                                   |
| `context.os.version`                                                                     | `DeviceOsVer`                                                |
| Config `campaignId`                                                                      | `CampaignId`                                                 |
| Config `impactAppId`                                                                     | `PropertyId`, `ImpactAppId` (when set)                       |
| Device IDs (see below)                                                                   | `AppleIfv`, `AppleIfa`, `AndroidId`, `GoogAId`               |

## Conversions Mapping (`data/ImpactConversionConfig.json`)

Includes all PageLoad fields above (with `IpAddress` from top-level `request_ip` or `context.ip`), plus:

| RudderStack field                                                     | impact.com field                           | Notes                                                          |
| --------------------------------------------------------------------- | ------------------------------------------ | -------------------------------------------------------------- |
| `event`                                                               | `EventTypeCode`                            |                                                                |
| `timestamp` / `originalTimestamp`                                     | `EventDate`                                | Required                                                       |
| `properties.orderId` / `order_id` / `transactionID` / `checkout_id`   | `OrderId`                                  | Required                                                       |
| `properties.currency`                                                 | `CurrencyCode`                             |                                                                |
| `context.traits.status` / `properties.status`                         | `CustomerStatus`                           |                                                                |
| `context.location.latitude` / `properties.latitude`                   | `Latitude`                                 |                                                                |
| `context.location.longitude` / `properties.longitude`                 | `Longitude`                                |                                                                |
| `properties.discount`                                                 | `OrderDiscount`                            |                                                                |
| `properties.coupon` / `properties.coupon_id`                          | `OrderPromoCode`                           |                                                                |
| `properties.shipping`                                                 | `OrderShipping`                            |                                                                |
| `properties.tax`                                                      | `OrderTax`                                 |                                                                |
| `properties.margin`                                                   | `OrderMargin`                              |                                                                |
| `mediaid` (top level)                                                 | `MediaId`                                  |                                                                |
| `callerid` (top level)                                                | `CallerId`                                 |                                                                |
| Generic `city` (`traits.address.city`, `context.traits.address.city`) | `CustomerCity`                             |                                                                |
| Generic `zipcode` paths                                               | `CustomerPostCode`                         |                                                                |
| `traits.country` / `context.traits.country`                           | `CustomerCountry`                          |                                                                |
| `traits.region` / `context.traits.region`                             | `CustomerRegion`                           |                                                                |
| `traits.phone` / `context.traits.phone` / `properties.phone`          | `PhoneNumber`                              |                                                                |
| Config `campaignId`, `eventTypeId`, `impactAppId`                     | `CampaignId`, `EventTypeId`, `ImpactAppId` |                                                                |
| `context.referrer.id` / `properties.clickId`                          | `ClickId`                                  | Action conversions only, when not set by additional parameters |
| Product items (see below)                                             | `Item*{n}`                                 |                                                                |
| `rudderToImpactProperty` entries                                      | `{to}` = value at path `{from}`            |                                                                |

### Products

Default item mapping (`itemMapping` in `config.js`):

| impact.com prefix | Product key |
| ----------------- | ----------- |
| `ItemBrand`       | `brand`     |
| `ItemCategory`    | `category`  |
| `ItemName`        | `name`      |
| `ItemPrice`       | `price`     |
| `ItemPromoCode`   | `coupon`    |
| `ItemQuantity`    | `quantity`  |
| `ItemSku`         | `sku`       |

- With `properties.products`, item `n` (1-based) uses each product's keys. Every `productsMapping` entry also adds `{to}{n}` from the product's `{from}` key.
- Without a products array, `properties.brand`, `category`, `name`, `price`, `coupon`, `quantity`, `sku` fill item 1.

### Device IDs

| `context.os.name`          | `context.device.id` | `context.device.advertisingId` |
| -------------------------- | ------------------- | ------------------------------ |
| ios, ipados, watchos, tvos | `AppleIfv`          | `AppleIfa`                     |
| android                    | `AndroidId`         | `GoogAId`                      |

## Example

Input:

```json
{
  "type": "track",
  "event": "Order Completed",
  "userId": "user-1",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "context": { "traits": { "email": "jane@example.com" }, "ip": "1.2.3.4" },
  "properties": {
    "order_id": "ORDER-1",
    "currency": "USD",
    "clickId": "click-1",
    "products": [{ "sku": "SKU-1", "name": "Shoe", "price": 50, "quantity": 1 }]
  }
}
```

Output:

```json
{
  "endpoint": "https://api.impact.com/Advertisers/<accountSID>/Conversions",
  "method": "POST",
  "headers": {
    "Content-Type": "application/x-www-form-urlencoded",
    "Authorization": "Basic <base64(accountSID:apiKey)>"
  },
  "body": {
    "FORM": {
      "EventTypeCode": "Order Completed",
      "EventDate": "2024-01-01T00:00:00.000Z",
      "CurrencyCode": "USD",
      "OrderId": "ORDER-1",
      "CustomerEmail": "jane@example.com",
      "CustomerId": "user-1",
      "IpAddress": "1.2.3.4",
      "CampaignId": "<campaignId>",
      "EventTypeId": "<eventTypeId>",
      "ItemName1": "Shoe",
      "ItemPrice1": 50,
      "ItemQuantity1": 1,
      "ItemSku1": "SKU-1",
      "ClickId": "click-1"
    }
  }
}
```

## Validations

| Check                                          | Error                                                          |
| ---------------------------------------------- | -------------------------------------------------------------- |
| `type` missing                                 | `Event type is required`                                       |
| `accountSID`, `apiKey` or `campaignId` missing | `<fields> : are required fields` (configuration error)         |
| Unsupported type                               | `Event type <type> is not supported`                           |
| Identify/page/screen with flag off             | `<type> events are disabled from Config` (configuration error) |
| Conversion without timestamp or order ID       | `Missing required value from [...]`                            |

## Error Handling

No proxy delivery. Delivery errors are handled by rudder-server from the HTTP status.

## Notes (NEEDS REVIEW)

- The default install event name in code is `Applcation Installed` (typo); `Application Installed` is not treated as an install unless listed in `installEventNames`.
- Track events that fall back to PageLoad call `buildPageLoadPayload` without `enableEmailHashing`, so `CustomerEmail` is sent unhashed even when hashing is enabled. Identify, page and screen do pass the flag.
- `getProductsMapping` overwrites its result on each loop iteration, so a `productsMapping` override of a default item field only takes effect if it is the last entry. The extra `{to}{n}` fields are still added for every entry.

## General Use Cases

- Credit affiliate and partner conversions (orders, installs, sign-ups) in impact.com.
- Record visits and app opens for click and attribution tracking through PageLoad.
