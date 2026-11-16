# PostHog Business Logic

## Request Flow

1. `PostHogIntegration` validates the input with `postHogInputSchema` (config + message type + userId/anonymousId).
2. `transformEvent` calls `processEvent` (`transform.ts`), which builds the event from the mapping JSONs in `data/`.
3. `api_key` is removed from each event; events over 900,000 bytes are rejected.
4. `ChunkBatchStrategy` packs events into ≤ 10 MB requests: `{ "api_key": "<teamApiKey>", "batch": [ ... ] }`.

## Endpoint

| Event type | Method | Endpoint                                                                | Headers                          |
| ---------- | ------ | ----------------------------------------------------------------------- | -------------------------------- |
| All        | POST   | `{stripTrailingSlash(yourInstance) \|\| https://app.posthog.com}/batch` | `Content-Type: application/json` |

## Event Shape

Each batch item = type-specific mapping + `properties` (common properties merged with mapped properties, mapped ones win) + `type` + `event`.

| Type     | `type`     | `event`          | Mapping file                                        |
| -------- | ---------- | ---------------- | --------------------------------------------------- |
| track    | `capture`  | `message.event`  | `PHTrackConfig.json`                                |
| identify | `identify` | `$identify`      | `PHIdentifyConfig.json`                             |
| page     | `page`     | `$pageview`      | `PHPageConfig.json`                                 |
| screen   | `screen`   | `$screen`        | `PHScreenConfig.json`                               |
| group    | `group`    | `$groupidentify` | `PHGroupConfig.json` (V2) / `PHGroupConfigOld.json` |
| alias    | `alias`    | `$create_alias`  | `PHAliasConfig.json`                                |

### Type-specific mappings

| Type         | Destination                                                                             | Source                                                              |
| ------------ | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| all          | `distinct_id`                                                                           | generic `userId` (userId, falling back to anonymousId), stringified |
| all          | `timestamp`                                                                             | generic `timestamp`; else `properties.timestamp`                    |
| track        | `event`, `messageId`, `properties`                                                      | `event`, `messageId`, `properties`                                  |
| identify     | `$set`, `messageId`                                                                     | `traits`, `messageId`                                               |
| page/screen  | `properties`, `name`, `category`, `messageId`                                           | same fields                                                         |
| group V2     | `properties.$group_key`, `properties.$group_type`, `properties.$group_set`, `messageId` | `groupId`, `traits.groupType`, `traits` (minus `groupType`)         |
| group legacy | `groupId`, `traits`, `messageId`                                                        | same fields                                                         |
| alias        | `properties.distinct_id`, `properties.alias`                                            | `userId`, `previousId`                                              |

### Common properties (`PHPropertiesConfig.json`)

| Destination                                                           | Source                                                                        |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `distinct_id`                                                         | `userId` / `anonymousId` (stringified)                                        |
| `$anon_distinct_id`                                                   | `anonymousId`                                                                 |
| `$current_url`, `$pathname`                                           | `context.page.url`, `context.page.path`                                       |
| `$host`                                                               | host parsed from `$current_url`                                               |
| `$os`, `$os_version`                                                  | `context.os.name`, `context.os.version` (web: `$os` from device model helper) |
| `$browser`, `$browser_version`                                        | parsed from `context.userAgent` (web only)                                    |
| `$screen_height`, `$screen_width`, `$screen_density`                  | `context.screen.*`                                                            |
| `$viewport_height`, `$viewport_width`                                 | `properties.viewport_height/width`                                            |
| `$lib`, `$lib_version`                                                | `context.library.name/version`                                                |
| `$time`, `$timestamp`                                                 | `timestamp`                                                                   |
| `$device_id`, `$device_manufacturer`, `$device_model`, `$device_name` | `context.device.*`                                                            |
| `$ip`                                                                 | `context.ip` / `request_ip`                                                   |
| `$timezone`, `$locale`, `$useragent`                                  | `context.timezone`, `context.locale`, `context.userAgent`                     |
| `$app_name`, `$app_version`, `$app_namespace`, `$app_build`           | `context.app.*`                                                               |
| `$network_carrier`                                                    | `context.network.carrier`                                                     |
| `utm_source/medium/campaign/content/term`                             | `context.campaign.source/medium/name/content/term`                            |
| `$performance_page_loaded`                                            | `context.page.loaded`                                                         |
| `$screen_name`                                                        | `event` (screen only)                                                         |
| `$set`                                                                | `context.traits` (all types except identify)                                  |
| `$groups`                                                             | `{ [$group_type]: $group_key }` (group, when both set)                        |

## Example (track)

Input: `{ "type": "track", "event": "Signed Up", "userId": "u1", "messageId": "m1", "timestamp": "2024-01-01T00:00:00Z", "properties": { "plan": "pro" } }`

Output body (simplified):

```json
{
  "api_key": "<teamApiKey>",
  "batch": [
    {
      "distinct_id": "u1",
      "event": "Signed Up",
      "messageId": "m1",
      "timestamp": "2024-01-01T00:00:00Z",
      "type": "capture",
      "properties": {
        "distinct_id": "u1",
        "$time": "2024-01-01T00:00:00Z",
        "$timestamp": "2024-01-01T00:00:00Z",
        "plan": "pro"
      }
    }
  ]
}
```

## Error Handling

- Schema or mapping failures fail only that input; other inputs are still batched.
- Oversized events (> 900,000 bytes) fail with an instrumentation error explaining PostHog's 1 MB limit.
- Delivery responses are interpreted by the batching framework's default delivery spec (whole batch).

## Use Cases

- Product analytics: events, page/screen views, person properties and group analytics in PostHog Cloud or self-hosted.
