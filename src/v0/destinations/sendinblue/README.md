# Sendinblue (Brevo) Destination

Implementation in **JavaScript** (NOT a CDK v2 implementation)

## Overview

Sendinblue (rebranded as **Brevo** in 2023) is an email, SMS and marketing automation platform. The RudderStack integration creates and updates Brevo contacts (optionally through double opt-in), manages list membership, and sends custom events, link clicks and page views to Brevo's tracker so they can drive automations.

The integration still calls the legacy `sendinblue.com` hosts (`api.sendinblue.com`, `in-automate.sendinblue.com`), not the `brevo.com` hosts.

## Configuration

### Required Settings

- **API Key** (`apiKey`): Brevo v3 API key. Sent as the `api-key` header on contact (identify) calls. Secret.
- **Client Key** (`clientKey`): Brevo tracker (marketing automation) key. Sent as the `ma-key` header on track and page calls.

### Optional Settings

- **Create contact via Double-opt-in** (`doi`, default `false`): When enabled, identify calls use the double opt-in (DOI) flow instead of the plain create/update contact call.
- **Template ID** (`templateId`): DOI email template ID. Required for the DOI create flow unless provided per event through the `sendinblueDOITemplateId` external ID. Must be an integer.
- **Redirection Url** (`redirectionUrl`): URL the contact is sent to after confirming the DOI email.
- **Send user traits in track call** (`sendTraitsInTrack`, default `false`): When enabled, user traits are sent as contact `properties` with track events.
- **Map your traits to Sendinblue contact attributes** (`contactAttributeMapping`): `[{ from, to }]` pairs that rename traits to Brevo contact attribute names (for example `area_code` to `AREA`).
- **Event filtering** (`eventFilteringOption`, `whitelistedEvents`, `blacklistedEvents`): Allowlist/denylist applied by rudder-server before transformation.
- **Consent management** (`consentManagement`, `oneTrustCookieCategories`, `ketchConsentPurposes`).
- **Use device-mode to send events** (`useNativeSDK.web`): Web device mode, not handled by this transformer code.

## Integration Functionalities

> Sendinblue supports **Cloud mode** for all listed sources and **Device mode** for web.

### Supported Message Types

- **Identify**: Yes. Create/update contact, double opt-in create/update, or unlink contact from lists.
- **Track**: Yes. Tracker `trackEvent`, or `trackLink` when the event name is `trackLink` (case-insensitive).
- **Page**: Yes. Tracker `trackPage`.

From `db-config.json`:

```json
"supportedMessageTypes": {
  "cloud": ["track", "identify", "page"],
  "device": { "web": ["identify", "track", "page"] }
}
```

Supported source types: android, androidKotlin, ios, iosSwift, web, unity, amp, cloud, reactnative, flutter, cordova, warehouse, shopify.

### Config keys used in code

`apiKey`, `clientKey`, `doi`, `templateId`, `redirectionUrl`, `contactAttributeMapping`, `sendTraitsInTrack`.

### Batching Support

- **Supported**: No. `processRouterDest` uses `simpleProcessRouterDest`; every event becomes its own request.

### Intermediate Calls

- **Identify with DOI enabled**: `GET https://api.sendinblue.com/v3/contacts/{identifier}` (identifier is the URL-encoded email or the `sendinblueContactId` external ID) checks whether the contact exists.
  - `200` with an `id`: contact exists, so the event is sent as an update (`PUT /v3/contacts/{identifier}`).
  - `404`: contact does not exist, so the event is sent as a DOI create (`POST /v3/contacts/doubleOptinConfirmation`).
  - Any other status: `NetworkError` with the matching retry/abort classification.
- No other event type makes intermediate calls.

### Proxy Delivery

- **Supported**: No. There is no `networkHandler.js`.

### User Deletion

- **Supported**: No. There is no `deleteUsers.js`.

### OAuth Support

- **Supported**: No. API key (`api-key`) and tracker key (`ma-key`) headers.

### Processor vs Router

- `transformAtV1: "router"`; router transform enabled in `src/features.ts`.

### Additional Functionalities

- **Phone-only contacts**: When only a phone is available on track/page events, the email is built as `<phone without +>@mailin-sms.com`, matching the email Brevo assigns to SMS-only contacts.
- **List management**: `sendinblueIncludeListIds` and `sendinblueUnlinkListIds` external IDs (arrays) add a contact to lists or remove it from lists.
- **Blocklisting**: `integrations.sendinblue.emailBlacklisted` and `integrations.sendinblue.smsBlacklisted` are passed through on contact create/update.
- **Event IDs**: `integrations.sendinblue.propertiesIdKey` names the property used as `eventdata.id` in track events (falls back to `messageId`).
- **Email change**: `traits.newEmail` maps to the `EMAIL` attribute so an existing contact's email can be changed.

### Validations

- `message.type` is required; only identify, track and page are accepted.
- Email must be a valid email and phone must be a valid number with country code wherever they are present.
- **Identify (non-DOI)**: email or phone is required.
- **Identify (DOI)**: email or `sendinblueContactId` is required; `templateId` (config or external ID) must be an integer; `sendinblueIncludeListIds` is required for the DOI create path.
- **Identify (unlink)**: email, phone or `sendinblueContactId` is required.
- **Track**: event name is required; email or phone is required; `trackLink` events require `properties.link`.
- **Page**: email or phone is required; page URL (`properties.url` or `context.page.url`) is required.

### Rate Limits

From [Brevo API rate limits](https://developers.brevo.com/docs/api-limits) (general tier; higher tiers exist on Professional and Enterprise plans):

| Endpoint                                  | Limit                                            |
| ----------------------------------------- | ------------------------------------------------ |
| `/v3/contacts/*` (all contact calls used) | 36,000 requests/hour and 10 requests/second      |
| Tracker `in-automate` `/api/v2/track*`    | Not listed on the rate-limits page. NEEDS REVIEW |

Exceeding a limit returns HTTP `429`. Brevo returns `x-sib-ratelimit-*` headers ([limit headers](https://developers.brevo.com/docs/limit-headers)).

## General Queries

### Event Ordering

- **Identify**: Ordering is required. Identify calls create/update the contact profile and its list membership; an out-of-order identify can overwrite newer attributes or undo a list change.
- **Track / Page**: Ordering is less important. The tracker payload carries no event timestamp from RudderStack, so Brevo records the time the event is received. Replaying old events records them with the replay time, which can trigger automations late.

### Data Replay Feasibility

- **Missing data replay**: Feasible for identify (upsert with `updateEnabled: true`) provided events are replayed in order. Feasible for track/page, with the caveat that the event time becomes the replay time and automations may fire.
- **Already delivered data replay**: Identify replays are idempotent upserts. Track and page replays create duplicate events. `eventdata.id` is sent, but Brevo's documentation does not describe deduplication on it. NEEDS REVIEW.

### Multiplexing

- **Identify with `sendinblueUnlinkListIds` (non-DOI)**: One `POST /v3/contacts/lists/{listId}/contacts/remove` request per list ID. The contact create/update call is NOT sent in this case.
- **Identify with DOI**: One intermediate GET plus one delivery request (not multiplexed in output).
- All other events produce one request.

## Version Information

### Current Version

- **API:** Main API (contacts)
- **Version:** `v3`
- **Where in code:** `config.js` (`BASE_ENDPOINT_MAIN`, `VERSION_MAIN`, `CONFIG_CATEGORIES`, `getContactDetailsEndpoint`, `getUnlinkContactEndpoint`)
- **API:** Tracker API (track, page, link)
- **Version:** `v2`
- **Where in code:** `config.js` (`BASE_ENDPOINT_TRACKER`, `VERSION_TRACKER`, `CONFIG_CATEGORIES.TRACK_EVENTS`, `TRACK_LINK`, `PAGE`)

Main API calls go to `https://api.sendinblue.com/v3/...`; tracker calls go to `https://in-automate.sendinblue.com/api/v2/trackEvent`, `trackLink` and `trackPage`.

### Version Deprecation

- **API:** Main API (contacts)
- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Brevo API changelog](https://developers.brevo.com/changelog)
- **API:** Tracker API (track, page, link)
- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Tracker REST implementation](https://developers.brevo.com/docs/tracker-rest-implementation)

- Brevo's docs label the `in-automate` REST tracker as legacy ([Track custom events (REST)](https://developers.brevo.com/docs/track-custom-events-rest)) and point to the v3 Events API as the current way to track events. No removal date was found. NEEDS REVIEW.
- The integration uses the pre-rebrand `sendinblue.com` hosts; Brevo's documentation now uses `api.brevo.com` / `in-automate.brevo.com`. No retirement date for the old hosts was found. NEEDS REVIEW.
- Brevo deprecated `POST /contacts/batch` on 2026-10-30 ([notice](https://developers.brevo.com/changelog/2026/5/12)). This integration does not call it.

### Latest Available Version

- **API:** Main API (contacts)
- **Version:** `v3`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [Brevo API overview](https://developers.brevo.com/docs/getting-started)
- **API:** Tracker API (track, page, link)
- **Version:** `v3`
- **Released:** Unknown
- **Upgrade needed:** Yes
- **Source:** [Event endpoints](https://developers.brevo.com/docs/event-endpoints)

`POST https://api.brevo.com/v3/events` (and `/v3/events/batch`, up to 200 events per request) is the newer Events API. Moving track events to it would change auth (`api-key` instead of `ma-key`) and the payload shape.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## Documentation Links

- [Brevo API overview](https://developers.brevo.com/docs/getting-started)
- [API key authentication](https://developers.brevo.com/docs/api-key-authentication)
- [Create a contact](https://developers.brevo.com/reference/createcontact)
- [Create a contact via double opt-in](https://developers.brevo.com/reference/create-doi-contact)
- [Update a contact](https://developers.brevo.com/reference/update-contact)
- [Remove a contact from a list](https://developers.brevo.com/reference/remove-contact-from-list)
- [Brevo API rate limits](https://developers.brevo.com/docs/api-limits)
- [Rate limit headers](https://developers.brevo.com/docs/limit-headers)
- [Tracker REST implementation](https://developers.brevo.com/docs/tracker-rest-implementation)
- [Track custom events (REST, legacy tracker)](https://developers.brevo.com/docs/track-custom-events-rest)
- [Track link clicks (REST)](https://developers.brevo.com/docs/track-link-clicks-rest)
- [Track page views (REST)](https://developers.brevo.com/docs/track-page-views-rest)

### Changelog References

- **Changelog:** [Brevo API changelog](https://developers.brevo.com/changelog)
- **Deprecations:** None found
- **Versions:** None found
- **Feed:** [Brevo changelog RSS](https://developers.brevo.com/changelog.rss)
- **Announcements:** [OAuth 2.0 machine-to-machine authentication, API keys unaffected (2026-10-06)](https://developers.brevo.com/changelog/2026/10/6)
- **Last checked:** 2026-11-16

Brevo posts deprecation notices as changelog entries (for example [`POST /contacts/batch`, 2026-10-30](https://developers.brevo.com/changelog/2026/5/12)); it has no separate deprecations or versions page.

## FAQ

_No entries yet._
