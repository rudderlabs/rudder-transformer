# Google Analytics (UA) / GA360 Business Logic

All requests are `POST https://www.google-analytics.com/collect` with the hit in `response.params` (query string). One input event produces one hit. UA stopped processing these hits in 2023/2024 (see the README).

## Common Payload (`responseBuilderSimple`)

| UA param                           | Source                                                                                  |
| ---------------------------------- | --------------------------------------------------------------------------------------- |
| `v`                                | `'1'`                                                                                   |
| `t`                                | Hit type from the category (`event`, `pageview`, `screenview`, `transaction`, `social`) |
| `tid`                              | `Config.trackingID`                                                                     |
| `ds`                               | `traits.ds` or `message.channel`                                                        |
| `npa` / `aip`                      | `1` when `doubleClick` / `anonymizeIp`                                                  |
| `linkid`                           | `properties.linkid` when `enhancedLinkAttribution`                                      |
| `ua`, `ul`                         | `context.userAgent`, `context.locale` (identify traits override)                        |
| `an`, `av`, `aiid`                 | `context.app.name`, `.version`, `.namespace`                                            |
| `cn`, `cs`, `cm`, `cc`, `ck`, `ci` | `context.campaign.name`, `.source`, `.medium`, `.content`, `.term`, `.campaignId`       |
| `sr` / `vp`                        | `context.screen.width x height` / `innerWidth x innerHeight`                            |
| `gclid` / `dclid`                  | `externalId` types `googleAdsId` / `googleDisplayAdsId`                                 |
| `dp`, `dl`, `dh`, `dt`             | From page URL/title (non-pageview hits also get these, without `dr`)                    |
| `cd<n>`, `cm<n>`, `cg<n>`          | `Config.dimensions` / `metrics` / `contentGroupings` (`from` property → `to`)           |
| `uid`                              | `message.userId` when `sendUserId`                                                      |
| `cid`                              | See priority in README                                                                  |
| `uip`                              | `traits.uip` or parsed request IP                                                       |
| `qt`                               | `Date.now() - (timestamp or originalTimestamp)`                                         |

Per-category static mappings live in `data/GA*Config.json` (for example, `GATransactionEventConfig.json` maps `order_id → ti`, `affiliation → ta`, `shipping → ts`, `tax → tt`, `coupon → tcc`, `currency → cu`).

## Flow per Message Type

### Identify

- Requires `Config.enableServerSideIdentify`; otherwise `ConfigurationError`.
- Hit type `event`, `ni=1`, `ea = serverSideIdentifyEventAction || 'User Enriched'`, `ec = traits[serverSideIdentifyEventCategory]` (only when an action is configured) else `All`.
- Traits `ua, ul, cn, cs, cm, cc, ck, an, av, aiid` override context values.
- rETL (`mappedToDestination`): `externalId` is copied to traits; when `identifierType === 'uid'` it becomes `userId`.

### Page

- Hit type `pageview`. `dl` = page URL, `dh`/`dp` from parsing it (`dp` URL-encoded; query added when `includeSearch`), `dt` = title, `dr` = referrer.

### Screen

- Hit type `screenview`; only common fields.

### Track

- **`enhancedEcommerce: false`**: always `NON_ECOM`: `ea = event`, `ec = properties.category || 'All'`, `ni` from `properties.nonInteraction` or `Config.nonInteraction`, `el = properties.label || 'event'`.
- **`enhancedEcommerce: true`**: event name (lowercased) selects a category from `config.js` `Event`; unknown names fall back to `NON_ECOM`. Hit type is forced to `event`. `ea = event`, `ec = properties.category || 'EnhancedEcommerce'`, `ev = value || revenue || total`, `ni` defaults to `1`.

| Event(s)                                                                                | Category     | Product action                                                                                     |
| --------------------------------------------------------------------------------------- | ------------ | -------------------------------------------------------------------------------------------------- |
| product list viewed / filtered / clicked                                                | PRODUCT_LIST | `detail` / `detail` / `click`; `il1pi<n>*` impressions                                             |
| promotion viewed / clicked                                                              | PROMOTION    | `promoa` + `pa` = `view` / `promo_click`                                                           |
| product clicked / viewed / added / removed, wishlist events                             | PRODUCT      | `click` / `detail` / `add` / `remove`; `pr1id` = product_id or sku                                 |
| checkout started, order updated / completed / cancelled                                 | TRANSACTION  | `checkout` / `checkout` / `purchase` / `refund`; `tr` = revenue → value → total; products required |
| checkout step viewed / completed, payment info entered                                  | PAYMENT      | `checkout` / `checkout_option`                                                                     |
| order refunded                                                                          | REFUND       | `refund`; products or `ti = order_id`                                                              |
| product shared, cart shared                                                             | SHARING      | `st` = url / space-joined product ids                                                              |
| cart viewed, coupon entered/applied/denied/removed, product reviewed, products searched | ECOM_GENERIC | `detail` / `add` / `remove` / `detail` / `click`                                                   |

Product-level dimensions/metrics use `pr<index><cdN|cmN>` from `Config.dimensions` / `metrics`.

## Example

Input:

```json
{
  "type": "track",
  "event": "Signup",
  "anonymousId": "anon-1",
  "properties": { "category": "Account", "label": "web" },
  "context": { "userAgent": "Mozilla/5.0", "locale": "en-US" }
}
```

Output params (`enhancedEcommerce: false`):

```json
{
  "v": "1",
  "t": "event",
  "tid": "UA-123-1",
  "ea": "Signup",
  "ec": "Account",
  "el": "web",
  "ni": 0,
  "ua": "Mozilla/5.0",
  "ul": "en-US",
  "cid": "anon-1",
  "qt": 1234
}
```

## Error Handling

- Event delivery has no custom response handler (no proxy).
- User deletion: see `networkHandler.js` mapping in the README.

## Code Observations (NEEDS REVIEW)

- `processSingleMessage` sets `category.hitType = 'event'` on the shared `ConfigCategory` object for Enhanced Ecommerce, mutating module state. `transaction` hit types in `config.js` are never emitted.
- `order cancelled` maps to `pa=refund`.
- `deleteUsers.js` only throws when `secret` is an empty object; an absent `secret` sends `Authorization: Bearer undefined`.
- `deleteUsers.js` sends `propertyId` instead of `webPropertyId` when `useNativeSDK` is on, which is not a UA-specific condition.
- `validatePayloadSize` (8192 bytes) is not called.
