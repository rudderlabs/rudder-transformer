# ActiveCampaign Destination

Implementation in **JavaScript** (NOT a CDK v2 implementation)

## Overview

ActiveCampaign is a marketing automation and CRM platform. The RudderStack integration creates and updates contacts (with tags, list subscriptions and custom field values), adds site tracking domains, and records custom events through ActiveCampaign's event tracking endpoint.

## Configuration

### Required Settings

- **API Url** (`apiUrl`): The account-specific API base URL (for example `https://<account>.api-us1.com`). Every v3 API call is built as `${apiUrl}/api/3/...`.
- **API Key** (`apiKey`): Sent as the `Api-Token` header on every request.

### Optional Settings

- **Event Key** (`eventKey`): Event tracking key, sent as `key` in track and screen requests to `https://trackcmp.net/event`.
- **ActID** (`actid`): ActiveCampaign account ID, sent as `actid` in track and screen requests.

> `eventKey` and `actid` are not marked required in `schema.json` and the code does not validate them, but ActiveCampaign's event tracking endpoint needs both, so track and screen events fail at delivery without them.

Consent management settings (`consentManagement`, `oneTrustCookieCategories`, `ketchConsentPurposes`) are handled by rudder-server, not by this transformer.

## Integration Functionalities

> ActiveCampaign supports **Cloud mode** for all sources, and **Device mode** and **Hybrid mode** for web. In hybrid mode, web `track`, `screen` and `identify` events go through cloud mode (`hybridModeCloudEventsFilter`).

### Supported Message Types

| Message type | Supported | Destination action                                                                              |
| ------------ | --------- | ----------------------------------------------------------------------------------------------- |
| Identify     | Yes       | Sync contact (`/api/3/contact/sync`), then add tags, list subscriptions and custom field values |
| Page         | Yes       | Add a site tracking domain (`/api/3/siteTrackingDomains`)                                       |
| Screen       | Yes       | Make sure the event name exists, then track the event (`https://trackcmp.net/event`)            |
| Track        | Yes       | Make sure the event name exists, then track the event (`https://trackcmp.net/event`)            |
| Others       | No        | `Message type not supported`                                                                    |

From `db-config.json`:

```json
"supportedMessageTypes": {
  "cloud": ["identify", "page", "screen", "track"],
  "device": { "web": ["identify", "page", "screen", "track"] }
}
```

### Batching Support

- **Supported**: No. Each event produces one request (`simpleProcessRouterDest`).

### Intermediate Calls

The integration makes several API calls during transformation, before the final request goes to rudder-server:

| Event type     | Intermediate calls                                                                                                                                                                                                                                                                                                                        | Why                                                                                                                                |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Identify       | 1. `POST /api/3/contact/sync` (gets the contact ID)<br>2. `GET /api/3/tags?limit=100` (paged by offset)<br>3. `POST /api/3/tags` for each new tag<br>4. `POST /api/3/contactTags` for each tag<br>5. `POST /api/3/contactLists` for each list with `subscribe`/`unsubscribe` status<br>6. `GET /api/3/fields?limit=100` (paged by offset) | The contact ID is needed to attach tags and lists, tags must exist before they are attached, and field values are sent by field ID |
| Track / Screen | 1. `GET /api/3/eventTrackingEvents`<br>2. `POST /api/3/eventTrackingEvents` if the event name does not exist                                                                                                                                                                                                                              | ActiveCampaign only accepts tracked events whose name is registered                                                                |
| Page           | None                                                                                                                                                                                                                                                                                                                                      | -                                                                                                                                  |

Steps 3 to 5 of identify change data in ActiveCampaign during transformation, not at delivery.

### Proxy Delivery

- **Supported**: No. There is no `networkHandler.js`.

### User Deletion

- **Supported**: No. There is no `deleteUsers.js`.

### OAuth Support

- **Supported**: No. Authentication uses the API key in the `Api-Token` header.

### Processor vs Router Destination

- **Type**: Router (`transformAtV1: "router"`). `src/features.ts` sets `ACTIVE_CAMPAIGN: { routerTransform: true }`.

### Additional Functionalities

- **Throttling cost** (`db-config.json`): `identify` = 4, `track` = 2, `screen` = 2. These reflect the extra intermediate calls each event makes.
- **Error normalisation** (`util.js`): if an intermediate call fails with a 2xx status (for example an HTML login page returned for a bad API key), the error is raised as a retryable 500 so events are not dropped.
- **`saveDestinationResponse: true`**: rudder-server stores the destination response.

### Validations

- `message.type` is required.
- Identify: `email` (`traits.email` / `context.traits.email`) is required.
- Page: one of `properties.domain`, `properties.url`, `context.page.url`, `properties.referring_domain`, `context.page.referring_domain` is required.
- Track / Screen: `event` (or `properties.name`) is required.
- Only custom fields that already exist in ActiveCampaign (matched by field title) are sent; unknown keys in `fieldInfo` are dropped silently.
- Only lists with `status` set to `subscribe` or `unsubscribe` are processed.

### Rate Limits

| API                          | Limit                                                | Source                                                                     |
| ---------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------- |
| v3 REST API (`/api/3/*`)     | 5 requests per second per account; 429 when exceeded | [Rate Limits](https://developers.activecampaign.com/reference/rate-limits) |
| `https://trackcmp.net/event` | NEEDS REVIEW: no separate limit found                | -                                                                          |

One identify event can make many API calls (see Intermediate Calls), so the 5 rps limit can be reached at low event volumes.

## General Queries

### Event Ordering

- **Identify**: Required. Identify updates contact attributes, list status and tags. Out-of-order delivery can overwrite newer contact data or flip list subscription status.
- **Track / Screen**: Not strictly required. The event tracking payload does not carry a timestamp, so ActiveCampaign records the event at the time it is received; ordering affects the recorded time only.
- **Page**: Not required. Adding a site tracking domain is idempotent.

### Data Replay Feasibility

- **Missing data replay**:
  - Identify: Feasible with caution. Replaying older identify events can overwrite newer contact attributes and list status.
  - Track / Screen: Feasible, but events are recorded with the replay time, not the original time.
  - Page: Feasible.
- **Already delivered data replay**:
  - Identify: Contact sync is an upsert by email, tags and list status are idempotent, so replay is safe apart from the ordering risk above.
  - Track / Screen: Not recommended. ActiveCampaign has no event ID for deduplication, so replays create duplicate events.
  - Page: Safe.

### Multiplexing

- **No**. Each input event produces one output request. Identify makes several intermediate calls (see above), but these are not delivered through rudder-server.

## Version Information

### Current Version

- ActiveCampaign API **v3** (`/api/3/...`) for contacts, tags, lists, fields, site tracking domains and event names.
- Event tracking uses `https://trackcmp.net/event`, which is not versioned.

### Version Deprecation

No deprecation of API v3 has been announced. ActiveCampaign still documents API v1 alongside v3, with no sunset date published. NEEDS REVIEW: no published deprecation timeline for `https://trackcmp.net/event` was found.

### Latest Available Version

API **v3** is the latest version. The integration uses it.

## Documentation Links

### API Documentation

- [API Overview](https://developers.activecampaign.com/reference/overview)
- [Rate Limits](https://developers.activecampaign.com/reference/rate-limits)
- [Pagination](https://developers.activecampaign.com/reference/pagination)
- [Create or update contact (sync)](https://developers.activecampaign.com/reference/create-or-update-contact-new)
- [Retrieve all tags](https://developers.activecampaign.com/reference/retrieve-all-tags)
- [Create a tag](https://developers.activecampaign.com/reference/create-a-new-tag)
- [Add a tag to a contact](https://developers.activecampaign.com/reference/create-contact-tag)
- [Update list status for a contact](https://developers.activecampaign.com/reference/update-list-status-for-contact)
- [Retrieve fields](https://developers.activecampaign.com/reference/retrieve-fields)
- [Site tracking](https://developers.activecampaign.com/reference/site-tracking)
- [List all event types](https://developers.activecampaign.com/reference/list-all-event-types)
- [Create an event (name only)](https://developers.activecampaign.com/reference/create-a-new-event-name-only)
- [Track event](https://developers.activecampaign.com/reference/track-event)

### Changelog References

- NEEDS REVIEW: Web search lists a developer changelog at `https://developers.activecampaign.com/changelog`, but it returned 404 when fetched. No deprecations page, API versions page or RSS feed was found.

### RETL Functionality

See [docs/retl.md](docs/retl.md).

### Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ

_No entries yet._
