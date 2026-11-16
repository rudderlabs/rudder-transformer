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

- **Version:** `v25.0`
- **Where in code:** `hydrate.ts` (`FACEBOOK_GRAPH_API_URL`), used by `fetchLeadData` for `GET /{lead-id}`

### Version Deprecation

- **Status:** Supported
- **Sunset date:** 2027-02-23
- **Source:** [Marketing API changelog](https://developers.facebook.com/docs/marketing-api/marketing-api-changelog)

The Marketing API version table lists v25.0 (released 2026-02-18) as available until 2027-02-23. The [Graph API versions page](https://developers.facebook.com/docs/graph-api/changelog/versions) lists the same version until 2028-07-29. This endpoint is part of the Marketing API, so the earlier Marketing API date applies. Meta supports the previous Marketing API version for at least 90 days after a new one ships ([versioning policy](https://developers.facebook.com/docs/marketing-api/overview/versioning)).

NEEDS REVIEW: lead retrieval is documented under the Marketing API, so the Marketing API date is used. If Meta treats `GET /{lead-id}` as a Graph API call, v25.0 is available until 2028-07-29.

### Latest Available Version

- **Version:** `v27.0`
- **Released:** 2026-11-04
- **Upgrade needed:** Yes
- **Source:** [Graph API changelog](https://developers.facebook.com/docs/graph-api/changelog)

The [Marketing API v27.0 changelog](https://developers.facebook.com/documentation/ads-commerce/marketing-api/marketing-api-changelog/version27.0) only adds lead form fields (`phone_otp_verification_type`); no lead retrieval changes were found.

## Documentation Links

- [Retrieving leads](https://developers.facebook.com/docs/marketing-api/guides/lead-ads/retrieving)
- [Webhooks for Lead Ads](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-leadgen)
- [Graph API versioning](https://developers.facebook.com/docs/graph-api/guides/versioning)
- [Lead Ads overview](https://developers.facebook.com/docs/marketing-api/guides/lead-ads)
- [Access tokens](https://developers.facebook.com/docs/facebook-login/guides/access-tokens)

### Changelog References

- **Changelog:** [Graph API changelog](https://developers.facebook.com/docs/graph-api/changelog); [Marketing API changelog](https://developers.facebook.com/docs/marketing-api/marketing-api-changelog)
- **Deprecations:** [Graph API breaking changes](https://developers.facebook.com/docs/graph-api/changelog/breaking-changes); [Graph API out-of-cycle changes](https://developers.facebook.com/docs/graph-api/changelog/out-of-cycle-changes); [Marketing API out-of-cycle changes](https://developers.facebook.com/docs/marketing-api/out-of-cycle-changes)
- **Versions:** [Graph API versions and expiration dates](https://developers.facebook.com/docs/graph-api/changelog/versions); [Marketing API versioning](https://developers.facebook.com/docs/marketing-api/overview/versioning)
- **Feed:** [Meta for Developers blog Atom feed](https://developers.facebook.com/blog/feed/)
- **Announcements:** None found
- **Last checked:** 2026-11-16

## FAQ
