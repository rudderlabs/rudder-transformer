# Attentive Tag Destination

Implementation in **JavaScript** (NOT a CDK v2 implementation)

## Overview

Attentive is an SMS and email marketing platform. The RudderStack integration subscribes and unsubscribes users, resolves user identities, sets custom user attributes, and sends custom and e-commerce events to the Attentive REST API (`https://api.attentivemobile.com/v1`).

## Configuration

### Required Settings

- **API Key** (`apiKey`): Attentive API key, sent as `Authorization: Bearer <apiKey>`.

### Optional Settings

- **Sign Up Source Id** (`signUpSourceId`): Numeric sign-up source ID. Required for subscribe calls (legacy identify flow and `subscription_event` with `consented: true`). It can be overridden per event with `integrations.attentive_tag.signUpSourceId` (identify) or `properties.signUpSourceId` (`subscription_event`).
- **Enable New Identify Flow (Beta)** (`enableNewIdentifyFlow`, default `false`): When on, identify calls the Identity Resolution and Custom Attributes APIs instead of the Subscriptions API.

Consent management settings (`consentManagement`, `oneTrustCookieCategories`, `ketchConsentPurposes`) are handled by rudder-server, not by this transformer.

## Integration Functionalities

> Attentive Tag supports **Cloud mode** only.

### Supported Message Types

| Message type | Supported | Destination action                                                                                                                           |
| ------------ | --------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Identify     | Yes       | Legacy flow: subscribe (`/subscriptions`) or unsubscribe (`/subscriptions/unsubscribe`). New flow: identity resolution and custom attributes |
| Track        | Yes       | E-commerce events (`/events/ecommerce/*`), custom events (`/events/custom`), or subscribe/unsubscribe for `subscription_event`               |
| Others       | No        | `Message type not supported`                                                                                                                 |

From `db-config.json`: `"supportedMessageTypes": { "cloud": ["identify", "track"] }`.

### Batching Support

- **Supported**: No. Each event produces one or two requests.

### Intermediate Calls

- **None**. All requests are returned to rudder-server for delivery.

### Proxy Delivery

- **Supported**: No. There is no `networkHandler.js`.

### User Deletion

- **Supported**: No. There is no `deleteUsers.js`.

### OAuth Support

- **Supported**: No. The integration uses an API key as a bearer token. (Attentive also offers OAuth for apps; RudderStack does not use it.)

### Processor vs Router Destination

- **Type**: Processor (`transformAtV1: "processor"`). `transform.js` also exports `processRouterDest`, but `ATTENTIVE_TAG` is not in `src/features.ts`, so router transform is not enabled.

### Additional Functionalities

- **Event name normalisation**: Track event names are lower-cased, trimmed, and spaces become `_` before matching (`Order Completed` matches `order_completed`).
- **`subscription_event`**: A track event named `subscription_event` uses `properties.channelConsents` to subscribe or unsubscribe each channel (`email`, `sms`).
- **External identifiers**: `clientUserId`, `shopifyId` and `klaviyoId` from `context.externalId`, and `customIdentifiers` from traits, are sent as `externalIdentifiers`.
- **`saveDestinationResponse: true`**: rudder-server stores the destination response.

### Validations

- `message.type` is required.
- Identify (legacy flow): `email` or `phone` is required. Subscribe needs `signUpSourceId`.
- Identify (new flow): at least one of the identity resolution or custom attributes payloads must be valid (see [businesslogic.md](docs/businesslogic.md)).
- Track: `event` is required.
- Track (except `subscription_event`): the event timestamp must be within the last **12 hours**.
- Custom track events: property keys must not contain `'`, `"`, `{`, `}`, `[`, `]` or `,`.
- E-commerce events with `properties.products`: every product needs `product_id`, `variant` and `price`; an empty `products` array is rejected.
- `subscription_event`: `email` or `phone` is required, and `properties.channelConsents` must be an array.

### Rate Limits

From [API Rate Limits](https://docs.attentive.com/docs/api-rate-limits):

| Endpoint                                   | Limit                                |
| ------------------------------------------ | ------------------------------------ |
| Subscribe (`/subscriptions`)               | 10 requests/second                   |
| Unsubscribe (`/subscriptions/unsubscribe`) | 5 requests/second                    |
| Identity (`/identity-resolution/...`)      | 10 requests/second                   |
| Most other endpoints (events, attributes)  | 150 requests/second per access token |

Requests over the limit return 429.

## General Queries

### Event Ordering

- **Identify / `subscription_event`**: Required. Subscribe and unsubscribe for the same user must arrive in order, or the final subscription state is wrong. Custom attribute updates also overwrite older values.
- **Track (custom and e-commerce)**: Not strictly required. Events carry a timestamp, but see the NEEDS REVIEW note on `occuredAt` in [businesslogic.md](docs/businesslogic.md).

### Data Replay Feasibility

- **Missing data replay**:
  - Track events older than 12 hours are rejected by the transformer, so replay is only possible within that window.
  - Identify / `subscription_event`: Feasible with caution. Replaying an old subscribe or unsubscribe can override a newer choice by the user.
- **Already delivered data replay**:
  - Custom events: `properties.eventId` is mapped to `externalEventId`, the event's unique ID in Attentive. NEEDS REVIEW: Attentive does not document whether it deduplicates on this ID.
  - E-commerce events: Not recommended. No deduplication key is sent, so replays create duplicate events.
  - Subscribe / unsubscribe: NEEDS REVIEW. Attentive does not document what happens when an already subscribed user is subscribed again (for example, whether a new opt-in message is sent).

### Multiplexing

- **Identify with `enableNewIdentifyFlow`**: Yes. Up to two requests: `/identity-resolution/user-identifiers` and `/attributes/custom`.
- **`subscription_event`**: Yes. Up to two requests: `/subscriptions` for consented channels and `/subscriptions/unsubscribe` for revoked channels.
- **All other events**: No.

## Version Information

### Current Version

- **Version:** `v1`
- **Where in code:** `config.js` (`BASE_URL`)

Attentive REST API v1 (`https://api.attentivemobile.com/v1`). Endpoints used:
`/v1/identity-resolution/user-identifiers`, `/v1/attributes/custom`, `/v1/subscriptions`, `/v1/subscriptions/unsubscribe`, `/v1/events/custom`, `/v1/events/ecommerce/purchase`, `/v1/events/ecommerce/add-to-cart`, `/v1/events/ecommerce/product-view`.

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Attentive API reference](https://docs.attentive.com/openapi/reference/overview/)

### Latest Available Version

- **Version:** `v2`
- **Released:** Unknown
- **Upgrade needed:** Yes
- **Source:** [Attentive API V2 reference](https://docs.attentive.com/openapi/reference-v2/overview/)

Attentive API V2 covers only user attributes (single and bulk create/update with attributes, subscriptions and identifiers), segments and bulk operations. The v1 event, subscription and unsubscribe endpoints used here have no V2 equivalent and v1 is still documented. NEEDS REVIEW: whether V2 user attributes should replace the v1 identify and custom attributes calls.

## Documentation Links

### API Documentation

- [Attentive API reference](https://docs.attentive.com/openapi/reference/overview/)
- [Attentive API V2 reference](https://docs.attentive.com/openapi/reference-v2/overview/)
- [Authentication](https://docs.attentive.com/docs/authentication)
- [API Rate Limits](https://docs.attentive.com/docs/api-rate-limits)
- [Identify (user identifiers)](https://docs.attentive.com/reference/identify)
- [Custom Attributes](https://docs.attentive.com/reference/postcustomattributes)
- [Subscribe user](https://docs.attentive.com/reference/addsubscriptions)
- [Unsubscribe subscriptions](https://docs.attentive.com/reference/unsubscribesubscriptions)
- [Custom Events](https://docs.attentive.com/reference/postcustomevents)
- [Custom Events (OpenAPI tag)](https://docs.attentive.com/openapi/reference/tag/Custom-Events)
- [Purchase events](https://docs.attentive.com/reference/postpurchaseevents)
- [Add to cart events](https://docs.attentive.com/reference/postaddtocartevents)
- [Product view events](https://docs.attentive.com/reference/postproductviewevents)

### Changelog References

- **Changelog:** [Attentive release notes](https://www.attentive.com/release-notes) (blocks automated requests)
- **Deprecations:** None found
- **Versions:** None found
- **Feed:** None found
- **Announcements:** None found
- **Last checked:** 2026-11-16

Attentive has no developer changelog. The docs index ([llms.txt](https://docs.attentive.com/llms.txt)) lists no changelog, deprecations or versions page, so the product release notes are the closest source.

### RETL Functionality

See [docs/retl.md](docs/retl.md).

### Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ

_No entries yet._
