# Drip Business Logic and Mappings

Base URL: `https://api.getdrip.com`. All requests use Basic auth (see README).

## Identify

Mapping: `data/DripIdentify.json`. Body: `{ "subscribers": [payload] }`.

| Drip field                                      | Source                                                                |
| ----------------------------------------------- | --------------------------------------------------------------------- |
| `id`                                            | externalId `dripId`                                                   |
| `email`                                         | generic `email` (dropped if invalid)                                  |
| `user_id`                                       | generic `userId`                                                      |
| `new_email`                                     | `traits.newEmail`                                                     |
| `phone`                                         | `traits.phone` (stringified)                                          |
| `first_name`, `last_name`                       | generic `firstName`, `lastName`; else `name` split on the first space |
| `tags`, `remove_tags`                           | `traits.tags`, `traits.removeTags`                                    |
| `status`, `initial_status`                      | `traits.status`, `traits.initialStatus`                               |
| `time_zone`                                     | `context.timeZone` / `context.traits.timeZone`                        |
| `country`, `city`, `zip`                        | traits or `traits.address.*`                                          |
| `address1`                                      | `traits.address` (objects joined into one string)                     |
| `address2`                                      | `traits.address2`                                                     |
| `eu_consent`, `eu_consent_message`              | `traits.euConsent`, `traits.euConsentMessage`                         |
| `ip_address`                                    | `context.ip`                                                          |
| `lifetime_value`, `prospect`, `base_lead_score` | same-named camelCase traits                                           |
| `custom_fields`                                 | `traits.customFields`; else all other traits (validated, see README)  |

Traits are read from `traits` and `context.traits`.

**Without campaign** (or without a valid email): `POST /v2/{accountId}/subscribers`.

**With campaign** (externalId `dripCampaignId` or `Config.campaignId`) **and a valid email**:

1. Intermediate `POST /v2/{accountId}/subscribers` with the full payload. Failure aborts the event.
2. Returned request: `POST /v2/{accountId}/campaigns/{campaignId}/subscribers` with
   `{ "subscribers": [{ email, double_optin, starting_email_index, reactivate_if_removed }] }` from
   `traits.doubleOptin`, `traits.startingEmailIndex`, `traits.reactivateIfRemoved`.

## Track

Event name is trimmed and lower-cased.

If `enableUserCreation` is `false` and there is no `dripId`, the transformer first calls
`GET /v2/{accountId}/subscribers/{email}`.

### Order events

`order updated` → `updated`, `order completed` → `paid`, `order refunded` → `refunded`,
`order cancelled` → `canceled`, `checkout started` → `placed`, `fulfilled` / `order fulfilled` →
`fulfilled`.

**Endpoint**: `POST /v3/{accountId}/shopper_activity/order`. Mapping `data/DripEcom.json`:

| Drip field                                                                                                                         | Source                                                                    |
| ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `provider`                                                                                                                         | `properties.affiliation` (required)                                       |
| `order_id`                                                                                                                         | `properties.order_id` (required)                                          |
| `action`                                                                                                                           | mapped event name (above)                                                 |
| `email`, `person_id`                                                                                                               | email, externalId `dripId`                                                |
| `initial_status`, `order_public_id`, `total_fees`, `refund_amount`, `currency`, `order_url`, `billing_address`, `shipping_address` | same-named `properties`                                                   |
| `grand_total`, `total_discounts`, `total_taxes`, `total_shipping`                                                                  | `properties.total`, `discount`, `tax`, `shipping`                         |
| `occurred_at`                                                                                                                      | `properties.occurred_at` → `timestamp` → `originalTimestamp`              |
| `items[]`                                                                                                                          | `properties.products` via `data/DripProduct.json` (`url` → `product_url`) |

### Other events

**Endpoint**: `POST /v2/{accountId}/events`. Body: `{ "events": [payload] }`.

| Drip field    | Source                                                                                                                  |
| ------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `action`      | event name (lower-cased)                                                                                                |
| `id`, `email` | externalId `dripId`, email                                                                                              |
| `prospect`    | `properties.prospect`                                                                                                   |
| `occurred_at` | `properties.occurred_at` → `timestamp` → `originalTimestamp`                                                            |
| `properties`  | `properties.customFields`; else other properties minus `action`, `email`, `prospect`, `occurred_at`, `properties`, `id` |

## Example

```json
// input
{ "type": "track", "event": "Signed Up", "userId": "u1",
  "context": { "traits": { "email": "a@b.com" } }, "properties": { "plan": "pro" },
  "timestamp": "2024-01-01T10:00:00Z" }
// output: POST https://api.getdrip.com/v2/<accountId>/events
{ "events": [{ "action": "signed up", "email": "a@b.com",
  "occurred_at": "2024-01-01T10:00:00Z", "properties": { "plan": "pro" } }] }
```

## Error Handling

- Missing `accountId` or `apiKey` → configuration error.
- Missing identifiers or event → instrumentation error.
- Subscriber lookup (`userExists`): any non-2xx, including `404` for a missing subscriber, throws a
  `NetworkError` with that status. The "user does not exist" message is only reached on an unexpected
  non-200 success.
- Subscriber upsert failure → `AbortedError`.

## Notes and Possible Bugs

- A trait with a `null` value crashes identify custom field validation (`null.toString()`), instead of being
  skipped.
- If the email is invalid and `enableUserCreation` is `false`, the lookup is sent to
  `/subscribers/null`.
- Name splitting keeps only the first two words.

## General Use Cases

Email marketing automation: subscriber sync, campaign enrolment, custom events and ecommerce order tracking.
