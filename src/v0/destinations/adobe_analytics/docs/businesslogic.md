# Adobe Analytics Business Logic

## Request

```
POST https://<trackingServerSecureUrl>/b/ss//6
Content-type: application/xml

<?xml version="1.0" encoding="UTF-8"?><request>...<reportSuiteID>rsid1,rsid2</reportSuiteID></request>
```

Built with `jsontoxml` from `{ request: { ...commonPayload, ...eventPayload, reportSuiteID } }`.

## Event Handling (`handleTrack`)

Event name is lowercased. Page/screen use `message.name`.

| RudderStack event                            | Adobe event     | Extras                                                              |
| -------------------------------------------- | --------------- | ------------------------------------------------------------------- |
| `product viewed`, `product list viewed`      | `prodView`      |                                                                     |
| `product added`                              | `scAdd`         |                                                                     |
| `product removed`                            | `scRemove`      |                                                                     |
| `order completed`                            | `purchase`      | `purchaseID`, `transactionID` (purchaseId/transactionId → order_id) |
| `cart viewed`                                | `scView`        |                                                                     |
| `checkout started`                           | `scCheckout`    | `purchaseID`, `transactionID`                                       |
| `cart opened`                                | `scOpen`        |                                                                     |
| Other, mapped in `rudderEventsToAdobeEvents` | Mapped value(s) |                                                                     |
| Other, with `properties.overrideEventName`   | That value      |                                                                     |

`events` string: Adobe event(s) + `eventN=value` merchandising entries (`eventMerchEventToAdobeEvent` + `eventMerchProperties`) + product merchandising events. `properties.overrideEventString` replaces it.

`products` string (`handleProductStringSection`), for ecommerce events or events in `productMerchEventToAdobeEvent`: `category;item;quantity;total[;merchEvents;merchEvars]`, products joined by `,`. `item` uses `productIdentifier` (`id` → `product_id || id`). Single-product events (`scAdd`, `scRemove`, `prodView` except list viewed, or no `products` array) use `properties` as the product. `properties.overrideProductString` replaces it.

## Common Payload (`data/AACommonConfig.json` + `responseBuilderSimple`)

| Adobe field                                     | Source                                                                                                                |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `browserHeight` / `browserWidth`                | `context.screen.height` / `.width`                                                                                    |
| `campaign`                                      | `context.campaign.name`                                                                                               |
| `channel`                                       | `channel`                                                                                                             |
| `currencyCode`                                  | `properties.currency`                                                                                                 |
| `ipaddress`                                     | `context.ip` / `request_ip`                                                                                           |
| `language`, `timezone`, `userAgent`, `referrer` | `context.locale`, `.timezone`, `.userAgent`, `.page.referrer`                                                         |
| `purchaseID`, `transactionID`                   | `properties.order_id` / `orderId`                                                                                     |
| `state`, `zip`                                  | Traits address                                                                                                        |
| `contextData.*`                                 | `contextDataMapping` with `contextDataPrefix`                                                                         |
| `eVarN`, `hierN`, `listN`, `propN`              | Mappings (or `properties.overrideEvars` / `overrideHiers` / `overrideLists` / `overrideCustomProperties`)             |
| `linkType`, `linkName`, `linkURL`               | When `overridePageView` is false: integrations object or `o` / event name (`page view` for page) / `context.page.url` |
| `pageUrl`, `pageName`                           | When `properties.overridePageView` is true; `pageName` only with `trackPageName`                                      |
| `fallbackVisitorId`                             | `externalId` type `AdobeFallbackVisitorId` unless `noFallbackVisitorId`                                               |
| `marketingcloudorgid`                           | `Config.marketingCloudOrgId`                                                                                          |

### Visitor ID and Timestamp

| `timestampOption` | `visitorID` (needs `dropVisitorId: false` and a userId) | `timestamp` (needs `timestampOptionalReporting: true`) |
| ----------------- | ------------------------------------------------------- | ------------------------------------------------------ |
| `disabled`        | Sent                                                    | Not sent                                               |
| `enabled`         | Not sent                                                | Sent                                                   |
| `hybrid`          | Sent if `preferVisitorId`                               | Sent if not `preferVisitorId`                          |
| `optional`        | Not sent                                                | Not sent                                               |

## Response Handling (`networkHandler.js`)

HTTP 200 with `<status>SUCCESS</status>` → success. `<status>FAILURE</status>` → `InstrumentationError` with `<reason>`. Non-string responses are passed through with their status.

## Example

Input:

```json
{
  "type": "track",
  "event": "Product Added",
  "userId": "u1",
  "context": { "page": { "url": "https://shop.example/p1" } },
  "properties": { "name": "Shoe", "category": "Footwear", "price": 50, "quantity": 2 }
}
```

Output XML body (abridged, `productIdentifier: name`, `dropVisitorId: false`, `timestampOption: disabled`):

```xml
<request><linkType>o</linkType><linkName>Product Added</linkName><linkURL>https://shop.example/p1</linkURL><visitorID>u1</visitorID><events>scAdd</events><products>Footwear;Shoe;2;100.00</products><reportSuiteID>rsid1</reportSuiteID></request>
```

## Code Observations (NEEDS REVIEW)

- `responseBuilderSimple` assigns `properties.overridePageView` and `processTrackEvent` destructures `properties`; an event without `properties` throws a TypeError instead of a clear error. It also mutates the input message.
- `trackingServerSecureUrl` is not required in `schema.json`, but `.startsWith` is called on it unconditionally.
- `processTrackEvent`: when the event is in `productMerchEventToAdobeEvent`, it appends the Adobe events of **every** configured product-merch mapping, not only this event's.
- `handleProducts`: product-level eVars (`products.<key>` in `productMerchEvarsMap`) are read from root `properties`, not from the current product.
- `timestampOption: optional` (allowed by `schema.json`) is not handled, so neither `visitorID` nor `timestamp` is sent. With `timestampOption: enabled` and `timestampOptionalReporting: false`, no timestamp is sent either; Adobe rejects hits without a timestamp on timestamp-required report suites.
