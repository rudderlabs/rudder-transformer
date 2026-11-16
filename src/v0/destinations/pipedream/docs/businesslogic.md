# Pipedream Business Logic

Logic is shared with the Webhook destination (`src/v0/destinations/webhook/transform.js`, `processEvent`).

## Request Building

| `pipedreamMethod` | Body                     | Query params                                                          | Headers                          |
| ----------------- | ------------------------ | --------------------------------------------------------------------- | -------------------------------- |
| `POST` (default)  | Full RudderStack message | none                                                                  | `content-type: application/json` |
| `PUT`, `PATCH`    | Full RudderStack message | none                                                                  | `content-type: application/json` |
| `GET`, `DELETE`   | none                     | Flattened `traits` (identify) or flattened `properties` (other types) | none by default                  |

Then:

1. Add configured `headers` (`from` = name, `to` = value).
2. Merge `message.header` (string values only) and remove it from the body.
3. `endpoint` = `pipedreamUrl`, replaced by `fullPath` or extended with `appendPath` if present on the message or in `integrations.pipedream`.

No field mapping: the body is the message as received (after `context.ip` backfill).

## Example

Input:

```json
{ "type": "track", "event": "Signup", "anonymousId": "a1", "properties": { "plan": "pro" } }
```

Output (POST):

```json
{
  "method": "POST",
  "endpoint": "https://eoxxxx.m.pipedream.net",
  "headers": { "content-type": "application/json", "x-api-key": "<from headers config>" },
  "body": {
    "JSON": {
      "type": "track",
      "event": "Signup",
      "anonymousId": "a1",
      "properties": { "plan": "pro" }
    }
  }
}
```

## Error Handling

- Missing URL: `ConfigurationError`.
- Delivery errors (404 for disabled workflows, 413, 429, 5xx) use the server's default HTTP handling.

## Use Cases

- Run custom Pipedream workflows (notifications, enrichment, syncing to apps without a native RudderStack destination) on RudderStack events.
