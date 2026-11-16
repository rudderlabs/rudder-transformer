# Optimizely Fullstack Business Logic

## Request Flow (every event)

1. Validate message type and config (see README).
2. `GET {dataFileUrl}` to load the datafile (intermediate call).
3. Build the common payload, attributes and the type-specific `visitors` array.
4. `POST https://logx.optimizely.com/v1/events` with `Content-Type: application/json`.

## Common Payload

| Field              | Source                                             |
| ------------------ | -------------------------------------------------- |
| `account_id`       | `Config.accountId`                                 |
| `project_id`       | `Config.projectId`                                 |
| `anonymize_ip`     | `Config.anonymizeIp` or `false`                    |
| `enrich_decisions` | always `true` (`Config.enrichDecisions \|\| true`) |
| `client_name`      | `RudderStack`                                      |
| `client_version`   | `1.0.0`                                            |

## Visitor

| Field          | Source                                                                                                                                                                               |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `visitor_id`   | `userId` if `trackKnownUsers`, else `anonymousId`                                                                                                                                    |
| `session_id`   | generic `sessionId` paths, stringified (omitted if absent)                                                                                                                           |
| `attributes`   | For each `attributeMapping` `from → to` where the trait exists and `to` matches a datafile attribute key: `{ entity_id: attr.id, key: attr.key, type: "custom", value: traitValue }` |
| `snapshots[0]` | `{ decisions, events }` (below)                                                                                                                                                      |

## Identify

- `decisions`: `[{ campaign_id, experiment_id, variation_id }]`. IDs from `integrations.optimizely_fullstack`, falling back to `Config.campaignId` / `Config.experimentId`. `variation_id` must come from the integrations object.
- `events`: `[{ entity_id: campaign_id, type: "campaign_activated", timestamp (ms), uuid: messageId }]`

## Track

1. `mappedEvent` = `eventMapping[event.toLowerCase()]` or the lowercased event name.
2. Find the datafile event whose `key` matches case-insensitively; error if not found.
3. `events`: `[{ entity_id: dfEvent.id, key: dfEvent.key, timestamp (ms), uuid: messageId, quantity: properties.quantity, revenue: floor(properties.revenue * 100), tags: properties minus revenue/quantity }]`
4. `decisions`: `[]`

## Page / Screen

1. Candidate keys: `pageMapping[category]` or `category` (if `trackCategorizedPages`), and `pageMapping[name]` or `name` (if `trackNamedPages`).
2. Look each up in the datafile; at least one must exist.
3. One event per match: `{ entity_id, key, timestamp (ms), uuid, tags: properties }`. The first uses `messageId` as `uuid`, the second a generated UUID.
4. `decisions`: `[]`

## Example (Track)

Input: `{ "type": "track", "event": "Purchase", "userId": "u1", "messageId": "m1", "timestamp": "2024-01-01T00:00:00.000Z", "properties": { "revenue": 12.5, "quantity": 2, "sku": "a" } }`, datafile event `{ "id": "111", "key": "purchase" }`, `trackKnownUsers: true`

```json
{
  "account_id": "<accountId>",
  "project_id": "<projectId>",
  "anonymize_ip": false,
  "enrich_decisions": true,
  "client_name": "RudderStack",
  "client_version": "1.0.0",
  "visitors": [
    {
      "visitor_id": "u1",
      "snapshots": [
        {
          "decisions": [],
          "events": [
            {
              "entity_id": "111",
              "key": "purchase",
              "timestamp": 1704067200000,
              "uuid": "m1",
              "quantity": 2,
              "revenue": 1250,
              "tags": { "sku": "a" }
            }
          ]
        }
      ]
    }
  ]
}
```

## Error Handling

- Validation errors and missing datafile events fail the event (400, not retried).
- Datafile fetch failure: `$.assertHttpResp` raises an error based on the datafile response status. NEEDS REVIEW: exact retryable vs abort mapping for 5xx datafile responses.
- Event API 500s are retried by rudder-server's default handling.

## Use Cases

- Send server-side decisions and conversions to Optimizely Feature Experimentation so experiment results include events tracked through RudderStack.
