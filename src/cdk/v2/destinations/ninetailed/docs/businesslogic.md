# Ninetailed Business Logic

## Request

```
POST https://experience.ninetailed.co/v2/organizations/{organisationId}/environments/{environment}/events
Content-Type: application/json

{ "events": [ <event>, ... ] }
```

## Mappings

`utils.js` `constructFullPayload` merges three mappings.

General (`generalPayloadMapping.json`):

| Ninetailed key      | Source              | Notes            |
| ------------------- | ------------------- | ---------------- |
| `anonymousId`       | `anonymousId`       | Required         |
| `messageId`         | `messageId`         | Required         |
| `channel`           | `channel`           | Default `server` |
| `type`              | `type`              |                  |
| `originalTimestamp` | `originalTimestamp` |                  |

Context (`contextMapping.json`, applied to `message.context`): `app.name`, `app.version`, `campaign`, `library.name` (default `Rudderstack Ninetailed Destination`), `library.version` (default `1`), `locale`, `page`, `userAgent`, `location` (default `{}`).

Track (`trackMapping.json`): `event` (required), `properties` (default `{}`).

Identify (`identifyMapping.json`): `traits` (default `{}`), `userId` from `userIdOnly`, set to `''` when missing.

## Flow

1. `procWorkflow.yaml`: validate type and config, build the payload, drop null/undefined, wrap as `{ events: [payload] }`.
2. `rtWorkflow.yaml`: run the processor workflow per event, collect successes, and chunk them with `BatchUtils.chunkArrayBySizeAndLength({ maxItems: 200 })`. Each chunk becomes one request whose `metadata` lists every input job. Failures are returned individually through `handleRtTfSingleEventError`.
3. The endpoint of a batch comes from the first event's destination config.

## Example

Input:

```json
{
  "type": "track",
  "event": "Product Purchased",
  "anonymousId": "anon-1",
  "messageId": "m-1",
  "channel": "web",
  "originalTimestamp": "2024-01-01T00:00:00.000Z",
  "properties": { "price": 10 },
  "context": { "locale": "en-US" }
}
```

Output event:

```json
{
  "anonymousId": "anon-1",
  "messageId": "m-1",
  "channel": "web",
  "type": "track",
  "originalTimestamp": "2024-01-01T00:00:00.000Z",
  "context": {
    "library": { "name": "Rudderstack Ninetailed Destination", "version": "1" },
    "locale": "en-US",
    "location": {}
  },
  "event": "Product Purchased",
  "properties": { "price": 10 }
}
```

## Errors

- Unsupported type, missing `organisationId` / `environment`, or missing required mapped fields → per-event error.
- No custom response handler; Ninetailed HTTP errors are handled generically by rudder-server.

## Code Observations (NEEDS REVIEW)

- `procWorkflow.yaml` computes `.message.type.toLowerCase()` before the "type is present" assertion, so a missing type throws a TypeError instead of the intended message.
- Only the 200-event limit is enforced; the documented limits of 50 identify events and 50 unique profiles per request are not.
