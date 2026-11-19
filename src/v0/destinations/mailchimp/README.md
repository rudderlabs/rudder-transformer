# Mailchimp Destination

Implementation in **JavaScript**

## Configuration

### Required Settings

- **API Key** (`apiKey`): Mailchimp Marketing API key. Sent as HTTP Basic auth (`apiKey:<apiKey>`, base64). Secret key.
- **Audience ID** (`audienceId`): default Mailchimp audience (list) ID.
- **Datacenter ID** (`datacenterId`): server prefix (for example `us20`); builds `https://<datacenterId>.api.mailchimp.com/3.0`.

### Optional Settings

- **Enable Merge Fields** (`enableMergeFields`, default `false`): when `true`, identify traits are sent as `merge_fields`. The same value is passed as `skip_merge_validation` on the batch endpoint.
- Consent settings: applied outside the transformer.

## Integration Functionalities

> Cloud mode only.

### Implementation

- **Implemented in**: JavaScript (v0), `src/v0/destinations/mailchimp/`
- **CDK v2 Enabled**: No
- **Processor vs Router**: Router destination (`transformAtV1: "router"`, `MAILCHIMP: { routerTransform: true }`)

### Supported Message Types

| Type     | Single-event endpoint                                  | Router output                         |
| -------- | ------------------------------------------------------ | ------------------------------------- |
| Identify | `PUT /3.0/lists/{listId}/members/{md5(email)}`         | Batched to `POST /3.0/lists/{listId}` |
| Track    | `POST /3.0/lists/{listId}/members/{md5(email)}/events` | Not batched                           |

### Batching Support

- **Identify**: Yes. Grouped by audience ID and chunked by **500** members (`MAX_BATCH_SIZE`) into the [batch subscribe/unsubscribe](https://mailchimp.com/developer/marketing/api/lists/batch-subscribe-or-unsubscribe/) endpoint: `POST /3.0/lists/{listId}?skip_merge_validation=<enableMergeFields>&skip_duplicate_check=false` with `update_existing: true`.
- **Track**: No. One request per event.

### Intermediate Calls

For identify events not from rETL (`mappedToDestination` not set):

1. `GET /3.0/lists/{listId}/members/{md5(email)}`: does the member exist, and what is its status.
2. If the member does not exist: `GET /3.0/lists/{listId}`: is double opt-in enabled for the audience. Sets status `pending` (double opt-in) or `subscribed`. A failed call raises a `NetworkError`.

No intermediate calls for track events or rETL identify events.

### Proxy Delivery

- **Supported**: No (no `networkHandler.js`).

### User Deletion

- **Supported**: No.

### OAuth Support

- **Supported**: No. API key.

### Additional Functionalities

- **Per-event audience override**: `integrations.MailChimp.listId` (or legacy `context.MailChimp.listId`) overrides `audienceId`.
- **Subscription status override**: for existing members, `integrations.MailChimp.subscriptionStatus` sets the status; otherwise the existing status is kept.
- **Merge fields**: `FNAME`, `LNAME`, `PHONE`, `BIRTHDAY`, `ADDRESS` are mapped; any other trait becomes a merge tag (non-word characters removed, uppercased, truncated to 10 characters) when `enableMergeFields` is on.

### Validations

- `apiKey`, `audienceId`, `datacenterId` must be configured.
- Email is required for identify and track.
- `status` must be one of `subscribed`, `unsubscribed`, `cleaned`, `pending`, `transactional`.
- Address: if any address field is present, `addr1`, `city`, `state`, `zip` are all required and must be non-empty strings.
- Track: event name must be 2–30 characters; spaces become `_`.

### Rate Limits

[Rate limits and timeouts](https://mailchimp.com/developer/marketing/api-concepts/rate-limits-and-timeouts): 10 simultaneous connections per user (excess returns `429`), 120-second timeout per call. Batch subscribe accepts up to 500 members per call.

## General Queries

### Event Ordering

- **Identify: required.** Identify upserts member data and status. An older event processed later overwrites newer merge fields or subscription status.
- **Track: not strictly required.** `occurred_at` is sent from the event `timestamp`.

### Data Replay Feasibility

- **Missing data**: track events can be replayed (historical `occurred_at`). Identify replay can overwrite newer data and status.
- **Already delivered data**: identify is an upsert keyed by email, so re-sending the same data is harmless if no newer change exists. Track events have no dedupe key, so replays create duplicate events. NEEDS REVIEW: confirm Mailchimp has no event deduplication.

### Multiplexing

**No.** Each event produces one delivery request (identify events are batched). The member lookup and list lookup calls are intermediate calls, not multiplexing.

## Version Information

### Current Version

- **Version:** `3.0`
- **Where in code:** `utils.js` (`getMailChimpBaseEndpoint`, `getBatchEndpoint`: `https://<dc>.api.mailchimp.com/3.0/lists/<audienceId>`)

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Marketing API fundamentals](https://mailchimp.com/developer/marketing/docs/fundamentals/)

Older APIs (Export API 1.0, API 2.0) were retired ([release note](https://mailchimp.com/developer/release-notes/2023/6/1/)).

### Latest Available Version

- **Version:** `3.0`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [Marketing API fundamentals](https://mailchimp.com/developer/marketing/docs/fundamentals/)

Mailchimp launched [Audiences endpoints (BETA)](https://mailchimp.com/developer/release-notes/2025/8/7/) on 2025-08-07 as an alternative to the List Members endpoints, inside Marketing API 3.0. They are not a new API version.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## Documentation Links

- [Marketing API fundamentals](https://mailchimp.com/developer/marketing/docs/fundamentals/)
- [Send your first API request (authentication)](https://mailchimp.com/developer/marketing/guides/quick-start/)
- [Get list info](https://mailchimp.com/developer/marketing/api/lists/get-list-info/)
- [Add or update list member](https://mailchimp.com/developer/marketing/api/list-members/add-or-update-list-member/)
- [Get member info](https://mailchimp.com/developer/marketing/api/list-members/get-member-info/)
- [Add member event](https://mailchimp.com/developer/marketing/api/list-member-events/add-event/)
- [Batch subscribe or unsubscribe](https://mailchimp.com/developer/marketing/api/lists/batch-subscribe-or-unsubscribe/)
- [Merge fields](https://mailchimp.com/developer/marketing/docs/merge-fields/)
- [Rate limits and timeouts](https://mailchimp.com/developer/marketing/api-concepts/rate-limits-and-timeouts)

### Changelog References

- **Changelog:** [Mailchimp Developer release notes](https://mailchimp.com/developer/release-notes/)
- **Deprecations:** None found
- **Versions:** None found
- **Feed:** None found
- **Announcements:** [Export API 1.0 and API 2.0 no longer supported (2023-06-01)](https://mailchimp.com/developer/release-notes/2023/6/1/); [Changes when using multiple authorization methods (2021-02-17)](https://mailchimp.com/developer/release-notes/2021/2/17/)
- **Last checked:** 2026-11-16

A machine-readable index of all release notes is at [release-notes/llms.txt](https://mailchimp.com/developer/release-notes/llms.txt). Only Marketing API 3.0 is current; Mailchimp publishes no versions or sunset page. The 2021-02-17 change makes the Authorization header win over an `apikey` query parameter; this integration sends only the Authorization header.

## FAQ

_To be populated._
