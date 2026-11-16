# Slack Business Logic and Mappings

## Overview

Each identify or track event is rendered into a text message with Handlebars and posted to a Slack incoming webhook.

Common request shape (`buildResponse`):

- `endpoint`: per-event channel webhook (modern mode, when matched) or `Config.webhookUrl`.
- `method`: `POST`
- `headers`: `{ "Content-Type": "application/x-www-form-urlencoded" }`
- `body.FORM.payload`: JSON string of `{ text, channel?, username?, icon_url? }`
- `userId`: `message.userId`, else `message.anonymousId`

## Display Name (`getName`)

The `{{name}}` variable is resolved in this order:

1. `traits.name`
2. `traits.firstName` + `traits.lastName` (concatenated without a space), or `traits.firstName` alone
3. `traits.username`
4. `properties.email`
5. `traits.email`
6. `User <userId>`
7. `Anonymous user <anonymousId>`

Traits are read from `traits` / `context.traits` (generic `traits` mapping).

## Identify Flow

1. Template = `identifyTemplate` if non-blank; otherwise a default built as `Identified {{name}} ` followed by `<trait>: {{"<trait>"}} ` for each allowlisted trait, or for every trait when no allowlist is set.
2. Template input:

| Variable      | Value                                                              |
| ------------- | ------------------------------------------------------------------ |
| `name`        | `getName(message)`                                                 |
| `<trait key>` | Each trait, flattened to the top level                             |
| `traits`      | `"key: value "` string of allowlisted traits (all if no allowlist) |
| `traitsList`  | Traits object                                                      |

3. Sent to `Config.webhookUrl` with `username` and `icon_url`. No per-channel routing.

## Track Flow

1. Reject if `event` is missing or in `denyListOfEvents`.
2. **Channel resolution** (first match in config order wins):
   - `modern`: `eventChannelSettings[].eventChannelWebhook` for the matching `eventName`.
   - `legacy` (default): `eventChannelSettings[].eventChannel` for the matching `eventName`.
   - Matching is exact equality, or a regex test (`new RegExp(eventName, 'g')`) when `eventRegex` is true.
3. **Template resolution**: first matching `eventTemplateSettings` entry; default `{{name}} did {{event}}`.
4. Template input:

| Variable         | Value                                                              |
| ---------------- | ------------------------------------------------------------------ |
| `name`           | `getName(message)`                                                 |
| `event`          | `message.event`                                                    |
| `<property key>` | Each property, flattened to the top level                          |
| `properties`     | `message.properties`                                               |
| `propertiesList` | `"key: value "` string of all properties                           |
| `traits`         | `"key: value "` string of allowlisted traits (all if no allowlist) |
| `traitsList`     | Traits object                                                      |

5. Output:
   - `modern` with a matched channel webhook: `{ text }` to that webhook (no `username`/`icon_url`).
   - `legacy` with a matched channel name: `{ channel, text, username, icon_url }` to `webhookUrl`.
   - Otherwise: `{ text, username, icon_url }` to `webhookUrl`.

## Example Payload

Input:

```json
{
  "type": "track",
  "event": "Order Completed",
  "userId": "u1",
  "properties": { "revenue": 50 },
  "context": { "traits": { "name": "Jane" } }
}
```

Config: `incomingWebhooksType: legacy`, `eventChannelSettings: [{ eventName: "Order.*", eventRegex: true, eventChannel: "#orders" }]`, `eventTemplateSettings: [{ eventName: "Order Completed", eventTemplate: "{{name}} spent {{revenue}}" }]`.

Output:

```json
{
  "endpoint": "<webhookUrl>",
  "method": "POST",
  "headers": { "Content-Type": "application/x-www-form-urlencoded" },
  "userId": "u1",
  "body": {
    "FORM": {
      "payload": "{\"channel\":\"#orders\",\"text\":\"Jane spent 50\",\"username\":\"RudderStack\",\"icon_url\":\"https://cdn.rudderlabs.com/rudderstack.png\"}"
    }
  }
}
```

## Error Handling

- Missing type, unsupported type or missing event name → `InstrumentationError` (400).
- Denylisted event or template render failure → `ConfigurationError` (400).
- Delivery errors use rudder-server's default status handling. Slack returns `404 channel_not_found`, `403 invalid_token` and similar for bad webhooks, and `429` when rate limited.

## General Use Cases

- Real-time alerts in Slack for sign-ups, purchases or other key events.
- Routing different event families to different team channels.
