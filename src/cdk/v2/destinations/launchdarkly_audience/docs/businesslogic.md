# LaunchDarkly Segment Business Logic and Mappings

## Overview

Adds and removes context keys in a LaunchDarkly synced segment (cohort) from RudderStack `audiencelist` events.

## Flow (`procWorkflow.yaml`)

1. **validateInput**: checks config (`audienceId`, `audienceName`, `accessToken`, `clientSideId`), message type `audiencelist`, and `properties.listData`.
2. **batchIdentifiersList** (`utils.batchIdentifiersList`):
   - Builds `{ add: [{id}], remove: [{id}] }` from members' `identifier` field, dropping members without one.
   - Concatenates add then remove items and chunks them into groups of 1000; each chunk is regrouped into `{ add, remove }`.
3. **prepareBasePayload**: builds the common fields from config.
4. **buildResponseForProcessTransformation**: one `POST` per chunk.

## Field Mappings

| Source                                    | LaunchDarkly field     | Notes                 |
| ----------------------------------------- | ---------------------- | --------------------- |
| `Config.clientSideId`                     | `environmentId`        | Required              |
| `Config.audienceId`                       | `cohortId`             | Required              |
| `Config.audienceName`                     | `cohortName`           | Required              |
| `Config.audienceType`                     | `contextKind`          | Omitted if empty      |
| `properties.listData.add[].identifier`    | `listData.add[].id`    | Context key to add    |
| `properties.listData.remove[].identifier` | `listData.remove[].id` | Context key to remove |

Headers: `Authorization: <accessToken>`, `Content-Type: application/json`.

## Example

Input:

```json
{
  "type": "audiencelist",
  "properties": {
    "listData": {
      "add": [{ "identifier": "alice@example.com" }],
      "remove": [{ "identifier": "bob@example.com" }]
    }
  }
}
```

Output:

```json
{
  "method": "POST",
  "endpoint": "https://app.launchdarkly.com/api/v2/segment-targets/rudderstack",
  "headers": { "Authorization": "<accessToken>", "Content-Type": "application/json" },
  "body": {
    "JSON": {
      "environmentId": "<clientSideId>",
      "cohortId": "<audienceId>",
      "cohortName": "<audienceName>",
      "contextKind": "user",
      "listData": {
        "add": [{ "id": "alice@example.com" }],
        "remove": [{ "id": "bob@example.com" }]
      }
    }
  }
}
```

## Error Handling

- Missing config values → configuration errors ("Audience Id is not present. Aborting", etc.).
- Wrong message type, missing/empty `listData`, or unknown action keys → instrumentation errors.
- No proxy; delivery responses use rudder-server's generic HTTP handling.

## Use Cases

Sync warehouse audiences into LaunchDarkly synced segments for feature flag targeting.
