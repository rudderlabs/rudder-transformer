# Vitally Business Logic

## Endpoint

| Message type           | Endpoint                             | Method |
| ---------------------- | ------------------------------------ | ------ |
| Identify, Track, Group | `https://api.vitally.io/rudderstack` | POST   |

Headers: `authorization: Basic {apiKeyVitally}`, `content-type: application/json`.

## Flow (`procWorkflow.yaml`)

1. `validateInput`: assert `message.type` exists and is one of `identify`, `track`, `group`.
2. `buildResponse`: `body.JSON = message` (the full RudderStack message, unchanged).

There is no field mapping in the transformer. Vitally maps:

- `identify` → Vitally user
- `group` → Vitally account (group trait `name` becomes the account name)
- `track` → product event

## Example

Input:

```json
{ "type": "track", "userId": "u1", "event": "Report Viewed", "properties": { "id": 1 } }
```

Output: the same JSON object is posted to `https://api.vitally.io/rudderstack`.

## Error Handling

- Workflow assertion errors for missing or unsupported type.
- No custom response handling. Without a valid key Vitally returns `401`.
