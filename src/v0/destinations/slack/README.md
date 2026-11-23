# Slack Destination

Implementation in **JavaScript** (NOT a CDK v2 implementation)

## Overview

The Slack destination posts a text message to a Slack channel through an [incoming webhook](https://docs.slack.dev/messaging/sending-messages-using-incoming-webhooks) for every identify and track event. Message text is built from [Handlebars](https://handlebarsjs.com/) templates configured in the RudderStack dashboard, and track events can be routed to different channels by event name or regex.

## Configuration

### Required Settings

- **Webhook URL** (`webhookUrl`): Default Slack incoming webhook URL. Used for identify events and for track events that do not match a per-event channel webhook.

### Optional Settings

- **Incoming webhooks type** (`incomingWebhooksType`, `legacy` | `modern`, default `legacy`):
  - `legacy`: Legacy custom-integration webhooks. The channel can be overridden per event by sending `channel` in the payload.
  - `modern`: Slack app webhooks, which are bound to one channel. Per-event routing uses a separate webhook URL per channel.
- **Event channel settings** (`eventChannelSettings`): `[{ eventName, eventChannel, eventChannelWebhook, eventRegex }]`.
  - `eventChannel` is used in `legacy` mode, `eventChannelWebhook` in `modern` mode.
  - `eventRegex: true` treats `eventName` as a regular expression.
- **Identify template** (`identifyTemplate`): Handlebars template for identify messages.
- **Event template settings** (`eventTemplateSettings`): `[{ eventName, eventTemplate, eventRegex }]` Handlebars templates for track messages.
- **Allowlisted traits** (`whitelistedTraitsSettings`): `[{ trait }]` traits to include in the default identify text and in the `{{traits}}` variable.
- **Event denylist** (`denyListOfEvents`): `[{ eventName }]` track events to reject.
- **Consent management** (`consentManagement`, `oneTrustCookieCategories`, `ketchConsentPurposes`).

## Integration Functionalities

> Slack supports **Cloud mode** only.

### Supported Message Types

- **Identify**: Yes
- **Track**: Yes

From `db-config.json`:

```json
"supportedMessageTypes": { "cloud": ["identify", "track"] }
```

Supported source types: android, androidKotlin, ios, iosSwift, web, unity, amp, cloud, warehouse, reactnative, flutter, cordova, shopify.

### Config keys used in code

`webhookUrl`, `incomingWebhooksType`, `eventChannelSettings`, `identifyTemplate`, `eventTemplateSettings`, `whitelistedTraitsSettings`, `denyListOfEvents`.

### Batching Support

- **Supported**: No. Slack incoming webhooks accept one message per request.

### Intermediate Calls

None.

### Proxy Delivery

- **Supported**: No. There is no `networkHandler.js`.

### User Deletion

- **Supported**: No. There is no `deleteUsers.js`.

### OAuth Support

- **Supported**: No. The webhook URL itself is the credential (`secretKeys` is empty in `db-config.json`, so the URL is not stored as a secret).

### Processor vs Router

- `transformAtV1: "processor"`. Slack is not listed in `src/features.ts`, so only the processor transform runs. `processRouterDest` exists in `transform.js` but is not used.

### Additional Functionalities

- **Handlebars templates** with a custom `{{newline}}` helper.
- **Regex-based routing** of track events to channels and templates.
- **RudderStack branding**: `username: "RudderStack"` and `icon_url: https://cdn.rudderlabs.com/rudderstack.png` are added to every payload, except for messages sent to a `modern` per-event channel webhook (app webhooks ignore these overrides).

### Validations

- `message.type` is required; only identify and track are accepted.
- Track: `event` is required.
- Track: events in `denyListOfEvents` fail with a `ConfigurationError` ("Event is denied. Please check configuration."), so they show as failed (aborted) events rather than being silently filtered.
- A template that fails to render throws a `ConfigurationError`.
- Config schema (integrations-config) restricts lengths and rejects `ngrok.io` webhook URLs and some catastrophic regex patterns in `eventName`.

### Rate Limits

From [Slack rate limits](https://docs.slack.dev/apis/web-api/rate-limits):

| Endpoint          | Limit                                                                 |
| ----------------- | --------------------------------------------------------------------- |
| Incoming webhooks | 1 message per second per webhook; short bursts above that are allowed |

Exceeding the limit returns HTTP `429` with a `Retry-After` header. rudder-server retries 429s.

## General Queries

### Event Ordering

- **Identify / Track**: Ordering is not required for data correctness; each event only posts a message. Out-of-order delivery only changes the order messages appear in the channel. Slack does not accept a message timestamp through webhooks, so messages show the delivery time.

### Data Replay Feasibility

- **Missing data replay**: Feasible. Replayed events post messages with the replay time.
- **Already delivered data replay**: Not recommended. Every replayed event posts a duplicate message; Slack webhooks have no deduplication key.

### Multiplexing

- **No**. One input event produces exactly one webhook request.

## Version Information

### Current Version

- **Version:** `Unversioned`
- **Where in code:** `src/v0/destinations/slack/transform.js` (`buildResponse`, `channelWebhook` or `destination.Config.webhookUrl`)

Slack incoming webhooks are not versioned. The request is `POST <webhook URL>` with `Content-Type: application/x-www-form-urlencoded` and a `payload=<JSON>` form body.

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Sending messages using incoming webhooks](https://docs.slack.dev/messaging/sending-messages-using-incoming-webhooks)

Legacy custom-integration webhooks (`incomingWebhooksType: legacy`) are documented by Slack as legacy, and Slack recommends migrating them to Slack apps ([Legacy incoming webhooks](https://docs.slack.dev/legacy/legacy-custom-integrations/legacy-custom-integrations-incoming-webhooks)). No retirement date is given. Slack had scheduled classic apps to stop working on 2026-11-16, then paused that on 2025-12-08; classic apps keep working for now.

### Latest Available Version

- **Version:** `Unversioned`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [Sending messages using incoming webhooks](https://docs.slack.dev/messaging/sending-messages-using-incoming-webhooks)

App-based incoming webhooks (`modern`) are the current option. They are bound to one channel and ignore `channel`, `username` and `icon_url` overrides, which is why `modern` mode uses a webhook URL per channel.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## Documentation Links

- [Sending messages using incoming webhooks](https://docs.slack.dev/messaging/sending-messages-using-incoming-webhooks)
- [Legacy incoming webhooks](https://docs.slack.dev/legacy/legacy-custom-integrations/legacy-custom-integrations-incoming-webhooks)
- [Rate limits](https://docs.slack.dev/apis/web-api/rate-limits)

### Changelog References

- **Changelog:** [Developer changelog](https://docs.slack.dev/changelog/)
- **Deprecations:** [Changelog: deprecation tag](https://docs.slack.dev/changelog/tags/deprecation); [Deprecations (legacy changelog)](https://api.slack.com/changelog/deprecations)
- **Versions:** Not versioned
- **Feed:** [Changelog RSS](https://docs.slack.dev/changelog/rss.xml); [Changelog Atom](https://docs.slack.dev/changelog/atom.xml)
- **Announcements:** [Discontinuing legacy custom bots and classic apps](https://docs.slack.dev/changelog/2024-09-legacy-custom-bots-classic-apps-deprecation/); [Classic apps deprecation paused](https://docs.slack.dev/changelog/2025/12/08/classic-apps-deprecation-paused)
- **Last checked:** 2026-11-16

## FAQ

_No entries yet._
