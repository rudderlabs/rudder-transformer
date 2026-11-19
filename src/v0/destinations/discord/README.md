# Discord Destination

Implementation in **JavaScript** (`src/v0/destinations/discord/`)

Discord posts a text message (and optionally an embed) to a Discord channel through an incoming webhook. It reuses the template helpers from the Slack destination (`src/v0/destinations/slack/util.js`).

## Configuration

### Required Settings

- **Webhook Url** (`webhookUrl`): The Discord channel webhook URL, for example `https://discord.com/api/webhooks/<id>/<token>`. The token in the URL is the only credential.

### Optional Settings

- **Identify Template** (`identifyTemplate`): Handlebars template for identify messages.
- **Event Template Settings** (`eventTemplateSettings`): List of `{ eventName, eventTemplate, eventRegex }`. Picks a Handlebars template per track event name, by exact match or by regex.
- **Whitelisted Traits** (`whitelistedTraitsSettings`): List of `{ trait }`. Limits which traits appear in the default identify text and in `{{traits}}`.
- **Embed Flag** (`embedFlag`): When true, an `embeds` entry is added to the message.
- **Title Template** (`embedTitleTemplate`) and **Description Template** (`embedDescriptionTemplate`): Handlebars templates for the embed. Used only when `embedFlag` is true.
- Consent management settings (handled outside this transformer).

## Integration Functionalities

> Discord supports **Cloud mode** only.

### Supported Message Types

- **Identify**, **Track**

### Implementation

- **Implemented in**: JavaScript (v0)
- **CDK v2 Enabled**: No
- **Processor vs Router**: Processor destination (`transformAtV1: "processor"`). `processRouterDest` wraps `process` with `simpleProcessRouterDest`.

### Authentication

- No auth header. The request carries only `Content-Type: application/json`. The webhook token embedded in `webhookUrl` authenticates the call.
- No OAuth.
- `secretKeys` in `db-config.json` is empty, so `webhookUrl` (which contains the token) is not marked as a secret. NEEDS REVIEW: the webhook token probably should be in `secretKeys`.
- **Auth changes announced by Discord**: none found for webhook execution. Discord's changelog lists API changes but no change to webhook token auth was found. NEEDS REVIEW against the [changelog](https://docs.discord.com/developers/change-log).

### Batching Support

- **Supported**: No. One event becomes one webhook call.

### Intermediate Calls

- None.

### Proxy Delivery

- **Supported**: No (`networkHandler.js` is not present).

### User Deletion

- **Supported**: No.

### OAuth Support

- **Supported**: No.

### Additional Functionalities

- Handlebars templating with flattened traits/properties as variables. See [docs/businesslogic.md](docs/businesslogic.md).
- Regex event matching (`eventRegex: true`): the configured event name is treated as a regular expression.
- Optional embed with title and description templates.

### Validations

- `message.type` is required and must be identify or track.
- Track: `event` is required.
- Discord limits (from the webhook docs): `content` up to 2000 characters, embed title up to 256 characters, embed description up to 4096 characters. The code does not truncate, so longer messages get a 400 from Discord.

### Rate Limits

- Discord applies per-route rate limits returned in `X-RateLimit-*` headers, plus a global limit of 50 requests per second per bot/application. Webhooks are rate limited per webhook. Exact per-webhook values are not published and must be read from the headers. NEEDS REVIEW.
- Reference: [Discord rate limits](https://docs.discord.com/developers/topics/rate-limits)

## General Queries

### Event Ordering

- Messages are posted in the order received. Ordering matters only for how the channel reads. No profile state is kept, so out-of-order delivery does not corrupt data.

### Data Replay Feasibility

- **Missing data**: Replay is possible; messages are posted at delivery time, not at the event timestamp.
- **Already delivered data**: Replay posts duplicate messages. Discord does not deduplicate webhook messages.

### Multiplexing

- No. One input event produces one webhook call.

## Version Information

### Current Version

- **Version:** `Unversioned`
- **Where in code:** `src/v0/destinations/discord/transform.js` (`buildResponse`, `destination.Config.webhookUrl`)

The code uses the `webhookUrl` the user pastes. URLs copied from the Discord UI have no version segment (`/api/webhooks/...`), so they go to Discord's default API version. A user can add a version (for example `/api/v10/webhooks/...`).

### Version Deprecation

- **Status:** Unknown
- **Sunset date:** None announced
- **Source:** [Discord API reference: API versioning](https://docs.discord.com/developers/reference)

Discord's API reference lists v6, v7 and v8 as deprecated, v3 to v5 as discontinued (requests fail with 400), and v9 and v10 as available. The reference does not mark which version unversioned routes resolve to; Discord has historically kept v6 as the default. No removal date for the default unversioned route is announced. NEEDS REVIEW: confirm which version unversioned webhook URLs resolve to today.

### Latest Available Version

- **Version:** `v10`
- **Released:** Unknown
- **Upgrade needed:** Yes
- **Source:** [Discord API reference: API versioning](https://docs.discord.com/developers/reference)

Pinning `/api/v10/` in the webhook URL avoids depending on the unversioned default.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## Documentation Links

- [Discord: Webhook resource (Execute Webhook)](https://docs.discord.com/developers/resources/webhook)
- [Discord: API reference and versioning](https://docs.discord.com/developers/reference)
- [Discord: Rate limits](https://docs.discord.com/developers/topics/rate-limits)
- [RudderStack docs: Discord destination](https://www.rudderstack.com/docs/destinations/streaming-destinations/discord/)

### Changelog References

- **Changelog:** [Discord developer change log](https://docs.discord.com/developers/change-log)
- **Deprecations:** [API versioning (deprecated and discontinued versions)](https://docs.discord.com/developers/reference)
- **Versions:** [API versioning](https://docs.discord.com/developers/reference)
- **Feed:** [Change log RSS](https://docs.discord.com/developers/change-log/rss.xml)
- **Announcements:** None found
- **Last checked:** 2026-11-16

## FAQ

_No entries yet._
