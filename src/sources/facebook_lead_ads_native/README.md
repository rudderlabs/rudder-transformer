# Facebook Lead Ads Native Source

## Overview

A webhook source for Facebook (Meta) Lead Ads. Meta sends a `leadgen` webhook when a lead form is submitted. The webhook only carries IDs, so the source works in two steps:

1. **Transform** (`transform.ts`): turns each webhook change into an `identify` event.
2. **Hydrate** (`hydrate.ts`): rudder-server's processor calls the transformer's `/:version/sources/facebook_lead_ads_native/hydrate` route, which fetches each lead's form answers from the Graph API and adds them to `context.traits`.

Implemented in TypeScript. Display name in the dashboard: "Facebook Lead Ads". The source is gated by the `FBLA_SOURCE` flag.

## Configuration

From `rudder-integrations-config` `db-config.json`:

- **Account**: OAuth account definition `SOURCE_FACEBOOK_LEAD_ADS_NATIVE_OAUTH`.
- **`internalSecret.pageAccessToken`**: Page access token used for hydration (listed in `internalSecretKeys`).
- **`hydration.enabled: true`**: Turns on rudder-server's source hydration stage.

## Integration Functionalities

### Transform

- Payload `object` must be `page` and `entry` must be non-empty, otherwise `TransformationError`.
- Each `entry[].changes[].value` with `leadgen_id`, `page_id` and `form_id` becomes:
  - `type: identify`
  - `anonymousId`: `leadgen_id`
  - `messageId`: `<sourceId>-<leadgen_id>` (includes the source ID so dedup does not drop events for other sources subscribed to the same page)
  - `context.traits`: `{ pageId, formId }`
  - `originalTimestamp`: `value.created_time`; `sentAt`: `entry.time`
- Changes missing those IDs are skipped. If nothing is left, `No valid events found` is thrown.

### Hydrate

- Validates the request with Zod: each event needs `anonymousId`; the source needs `internalSecret.pageAccessToken`.
- For every event, in parallel: `GET https://graph.facebook.com/v25.0/{leadgen_id}?access_token=<pageAccessToken>`.
- Each `field_data` entry is added as `traits[name] = values[0]`, merged over existing traits.
- Failures use the shared Facebook `errorResponseHandler`; the failing job gets its own `statusCode` and `errorMessage`, other jobs are unaffected.

### Graph API calls

| Call                      | Purpose                                 |
| ------------------------- | --------------------------------------- |
| `GET /v25.0/{leadgen_id}` | Read the lead's `field_data` (answers). |

### Other Functionalities

- **Batching**: Hydration processes the batch rudder-server sends, one Graph API call per lead.
- **Multiplexing**: One webhook can carry several entries and changes; each valid change becomes one event.

## General Queries

### Event Ordering

Not required. Each lead is a separate, immutable submission.

### Data Replay Feasibility

- Replaying a webhook produces the same `messageId`, so rudder-server dedup can drop it.
- Hydration needs the lead to still be readable through the Graph API with a valid page token; Meta retains leads for a limited time. NEEDS REVIEW (retention period).

## Version Information

### Current Version

Graph API **v25.0** (`FACEBOOK_GRAPH_API_URL` in `hydrate.ts`).

### Version Deprecation

v25.0 was released February 18, 2026 and is available until **July 29, 2028**.

### Latest Available Version

**v26.0**, released July 29, 2026 (expiry not yet announced).

## Documentation Links

- [Retrieving leads](https://developers.facebook.com/docs/marketing-api/guides/lead-ads/retrieving)
- [Webhooks for Lead Ads](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-leadgen)
- [Graph API versioning](https://developers.facebook.com/docs/graph-api/guides/versioning)

### Changelog References

- Changelog: [https://developers.facebook.com/docs/graph-api/changelog](https://developers.facebook.com/docs/graph-api/changelog)
- Deprecations: [Breaking changes](https://developers.facebook.com/docs/graph-api/changelog/breaking-changes), [Out-of-cycle changes](https://developers.facebook.com/docs/graph-api/changelog/out-of-cycle-changes)
- Versions and sunset dates: [https://developers.facebook.com/docs/graph-api/changelog/versions](https://developers.facebook.com/docs/graph-api/changelog/versions)
- RSS/Atom feed: none found. NEEDS REVIEW

## FAQ
