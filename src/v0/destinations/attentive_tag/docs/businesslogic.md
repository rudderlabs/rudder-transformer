# Attentive Tag Business Logic and Mappings

## Overview

Every request is `POST https://api.attentivemobile.com/v1<endpoint>` with headers `Authorization: Bearer <apiKey>` and `Content-Type: application/json`. Null and undefined values are removed from the body.

## Common Mappings

### User (identify, custom and e-commerce events)

| RudderStack field                                            | Attentive field |
| ------------------------------------------------------------ | --------------- |
| `phone` (traits / context.traits)                            | `user.phone`    |
| `traits.email` → `context.traits.email` → `properties.email` | `user.email`    |

### External identifiers (`getExternalIdentifiersMapping`)

| RudderStack field                                                                            | Attentive field                         |
| -------------------------------------------------------------------------------------------- | --------------------------------------- |
| `context.externalId[]` with `type` `clientUserId`, `shopifyId`, `klaviyoId`                  | `externalIdentifiers.<type>`            |
| `traits.customIdentifiers` / `context.traits.customIdentifiers` (array of `{ name, value }`) | `externalIdentifiers.customIdentifiers` |

Other `context.externalId` types are ignored.

## Identify

### Legacy flow (`enableNewIdentifyFlow: false`, default)

1. Read `integrations.attentive_tag` (or the `Attentive Tag` aliases).
2. If `identifyOperation` is `unsubscribe`:
   - Endpoint `/subscriptions/unsubscribe`.
   - Body: `user` plus `subscriptions` and `notification` copied from the integrations object.
3. Otherwise (subscribe):
   - Endpoint `/subscriptions`.
   - Body: `user`, `signUpSourceId` (integrations object value, else `Config.signUpSourceId`), `externalIdentifiers`.
   - Missing `signUpSourceId` throws `ConfigurationError`.
4. `user.email` or `user.phone` is required.

```json
{
  "user": { "email": "test@rudderstack.com", "phone": "+16405273911" },
  "signUpSourceId": "240654",
  "externalIdentifiers": {
    "clientUserId": "user-1",
    "customIdentifiers": [{ "name": "crm", "value": "123" }]
  }
}
```

### New flow (`enableNewIdentifyFlow: true`)

Produces up to two requests:

1. **Identity resolution** (`/identity-resolution/user-identifiers`): body `{ phone, email, clientUserId, shopifyId, klaviyoId, customIdentifiers }`. Sent only when the identity is sufficient: `clientUserId` and `customIdentifiers`, or (email/phone/shopifyId/klaviyoId) with `clientUserId` or `customIdentifiers`.
2. **Custom attributes** (`/attributes/custom`): body `{ user: { email, phone, externalIdentifiers: { clientUserId, customIdentifiers } }, properties }`. `properties` are all traits except `email`, `phone` and `customIdentifiers`. Sent only when both `user` and `properties` are non-empty.

If neither request is built, the event fails with `Identify payload is not valid, either user or properties is empty`.

## Track

The event name is normalised (lower-case, trimmed, spaces to `_`). Except for `subscription_event`, the timestamp must be within the last 12 hours.

| Normalised event      | Endpoint                                             | Mapping file                   |
| --------------------- | ---------------------------------------------------- | ------------------------------ |
| `product_list_viewed` | `/events/ecommerce/product-view`                     | `productListViewedConfig.json` |
| `product_viewed`      | `/events/ecommerce/product-view`                     | `productViewedConfig.json`     |
| `order_completed`     | `/events/ecommerce/purchase`                         | `orderCompletedConfig.json`    |
| `product_added`       | `/events/ecommerce/add-to-cart`                      | `productAddedConfig.json`      |
| `subscription_event`  | `/subscriptions` and/or `/subscriptions/unsubscribe` | `identifyConfig.json`          |
| anything else         | `/events/custom`                                     | `customTrackConfig.json`       |

`user.externalIdentifiers` is added when available, and `user` defaults to `{}`.

### E-commerce events

| RudderStack field | Attentive field | Notes                  |
| ----------------- | --------------- | ---------------------- |
| `timestamp`       | `occuredAt`     | See NEEDS REVIEW below |
| `user.*`          | `user.*`        | Common user mapping    |

`items` is built from `properties.products`; without `products`, a single item is built from `properties`:

| Product field | Attentive item field | Notes                                                      |
| ------------- | -------------------- | ---------------------------------------------------------- |
| `product_id`  | `productId`          | Required                                                   |
| `variant`     | `productVariantId`   | Required                                                   |
| `name`        | `name`               |                                                            |
| `quantity`    | `quantity`           |                                                            |
| `image_url`   | `productImage`       |                                                            |
| `url`         | `productUrl`         |                                                            |
| `price`       | `price[0].value`     | `parseInt`, so decimals are dropped (`19.99` becomes `19`) |
| `currency`    | `price[0].currency`  |                                                            |

```json
{
  "user": { "email": "test@rudderstack.com" },
  "occuredAt": "2023-02-01T10:00:00.000Z",
  "items": [
    {
      "productId": "622c6f5d5cf86a4c77358033",
      "productVariantId": "123",
      "name": "Cones",
      "quantity": 2,
      "price": [{ "value": 8, "currency": "USD" }]
    }
  ]
}
```

### Custom events

| RudderStack field    | Attentive field   |
| -------------------- | ----------------- |
| `event`              | `type`            |
| `properties`         | `properties`      |
| `properties.eventId` | `externalEventId` |
| `timestamp`          | `occuredAt`       |
| user fields          | `user.*`          |

Property keys containing `'`, `"`, `{`, `}`, `[`, `]` or `,` are rejected.

NEEDS REVIEW: all event mapping files send the timestamp as `occuredAt`. Attentive's documented field is `occurredAt` (double `r`), so Attentive most likely ignores the value and uses the time it receives the event.

### `subscription_event`

1. Build `user` from email/phone; one of them is required.
2. `properties.channelConsents` must be an array of `{ channel, consented, type }`.
3. Consents with `consented: true` → `/subscriptions` with `{ user, signUpSourceId }`, where `user` keeps only the contacts for consented channels (`email` → email, `sms` → phone). `signUpSourceId` is `properties.signUpSourceId`, else `Config.signUpSourceId`.
4. Consents with `consented: false` → `/subscriptions/unsubscribe` with `{ user, subscriptions: [{ type, channel }], notification }`. Channel `sms` maps to `TEXT`, anything else to `EMAIL`. `notification` comes from `properties.notification`.
5. If no request is built, the event fails with `No valid consent found for subscription event`.

## Error Handling

- Validation failures throw `InstrumentationError` (400) or `ConfigurationError` (400).
- Delivery errors are handled by rudder-server with the standard HTTP status handling (no custom network handler).

## Use Cases

- Grow SMS and email subscriber lists from sign-up forms and consent events.
- Trigger Attentive journeys from product views, add-to-cart and purchases.
- Enrich subscriber profiles with custom attributes for segmentation.
