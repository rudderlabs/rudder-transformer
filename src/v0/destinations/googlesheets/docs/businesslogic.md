# Google Sheets Business Logic

## Flow

1. `processRouterDest` receives a batch for one destination.
2. Each event goes through `processSingleMessage`:
   - Throws `ConfigurationError('No Spread Sheet set for this event')` if `Config.sheetName` is empty.
   - Builds a row with `processWithCustomMapping(message, Config.eventKeyMap)`.
3. Successful rows are wrapped in one response: `{ batch: [...], spreadSheetId, spreadSheet }`, with all metadata attached (`getSuccessRespEvents(..., batched = true)`). Failed events are returned separately.
4. `process` (processor path) returns the same shape with a single row. The destination runs at router, so this path is mainly used by tests.
5. rudder-server (`googlesheetsmanager.go`) writes the header row once, then calls `spreadsheets.values.append` on `<sheetName>!A1` with `ValueInputOption=RAW`.

## Row Mapping

The row is an object keyed by column position:

| Position | `attributeKey`          | `attributeValue`                                  |
| -------- | ----------------------- | ------------------------------------------------- |
| `0`      | `messageId`             | `message.messageId` or `''`                       |
| `1..n`   | `eventKeyMap[i - 1].to` | Value found for `eventKeyMap[i - 1].from` or `''` |

Lookup order for each `from`:

1. `getValueFromMessage(message, from)` (root path, for example `context.page.url` or `event`)
2. `properties[from]`, then `get(properties, from)`
3. `traits[from]`, then `get(traits, from)`
4. `context.traits[from]`, then `get(context.traits, from)`

Falsy values (`0`, `false`, `''`) are treated as missing and written as `''`.

## Example

Config: `eventKeyMap = [{ from: "event", to: "Event" }, { from: "Order Value", to: "Value" }]`

Input:

```json
{
  "type": "track",
  "messageId": "msg-1",
  "event": "Order Completed",
  "properties": { "Order Value": 42 }
}
```

Router output body:

```json
{
  "batch": [
    {
      "message": {
        "0": { "attributeKey": "messageId", "attributeValue": "msg-1" },
        "1": { "attributeKey": "Event", "attributeValue": "Order Completed" },
        "2": { "attributeKey": "Value", "attributeValue": 42 }
      }
    }
  ],
  "spreadSheetId": "<sheetId>",
  "spreadSheet": "Sheet1"
}
```

## Validations

- `sheetName` required (transformer). `sheetId` and `credentials` are checked only by rudder-server when it builds the client.

## Error Handling

- Transformer errors: `ConfigurationError` for missing sheet name.
- Delivery errors are handled in rudder-server (`handleServiceError`): the Google API status code is passed through as-is, timeouts become `504`, other errors `500`. rudder-server's usual rules then decide retry (5xx, 429) or abort (other 4xx).

## Use Cases

- Low-volume reporting: event logs, form submissions, or warehouse rows written to a shared sheet.
