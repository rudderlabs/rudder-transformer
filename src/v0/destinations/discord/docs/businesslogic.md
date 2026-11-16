# Discord Business Logic

## Endpoint and Request

| Item     | Value                                                                                                        |
| -------- | ------------------------------------------------------------------------------------------------------------ |
| Endpoint | `POST {webhookUrl}` (from destination config)                                                                |
| Headers  | `Content-Type: application/json`                                                                             |
| Body     | `{ "content": "<text>", "embeds": [ { "title", "description" } ] }` (`embeds` only when `embedFlag` is true) |

## Identify

1. Template: `identifyTemplate` (trimmed) if set. Otherwise a default is built from `"Identified {{name}} with "` plus `key: {{"key"}}` for each whitelisted trait, or for every trait when no whitelist is set.
2. Template input:
   - `name`: from `getName` (traits `name`, then `firstName` + `lastName`, `username`, `properties.email`, traits `email`, `User <userId>`, then `Anonymous user <anonymousId>`).
   - Every trait spread at the top level.
   - `traits`: JSON string of whitelisted traits (all traits if no whitelist).
   - `traitsList`: the raw traits object.
3. Custom templates are rendered with `compileAndRenderUserTemplate`. The default template is rendered with `Handlebars.compile`.

## Track

1. `event` is required.
2. Template selection: each `eventTemplateSettings` row with a non-empty `eventName` and `eventTemplate` is checked.
   - `eventRegex: true`: `event.match(new RegExp(eventName, 'g'))`.
   - Otherwise exact, case-sensitive match.
   - The first matching template (in config order) is used.
3. Default template: `"{{name}} did {{event}} with {{propertiesList}}"`.
4. Template input: `name`, `event`, every property spread at the top level, `properties` (object), `propertiesList` (JSON string), `traits` (JSON string of whitelisted traits), `traitsList` (object).

## Embed

When `embedFlag` is true, one embed is added:

- `title`: rendered `embedTitleTemplate`, or `"Message from Rudderstack "` if empty.
- `description`: rendered `embedDescriptionTemplate`, or `"Identify call made"` / `"Track call made"`.

## Example

Config: `eventTemplateSettings: [{ eventName: "Order Completed", eventTemplate: "{{name}} ordered {{total}}" }]`

Input:

```json
{
  "type": "track",
  "event": "Order Completed",
  "userId": "u1",
  "context": { "traits": { "name": "Jane" } },
  "properties": { "total": 42 }
}
```

Output body:

```json
{ "content": "Jane ordered 42" }
```

## Error Handling

- Missing `type`: `InstrumentationError` "Event type is required".
- Unsupported type: `InstrumentationError`.
- Track without `event`: `InstrumentationError` "Event name is required".
- Template compile errors from `compileAndRenderUserTemplate` surface as errors for that event.
- Delivery errors use default rudder-server handling (no `networkHandler.js`).

## Known Issues

- `processTrack` calls `eventTemplateSettings.forEach` without a guard. If the setting is missing from the config, the code throws a `TypeError` instead of using the default template. NEEDS REVIEW.
- `eventRegex` builds a `RegExp` from user config. An invalid pattern throws, and a pathological pattern can be slow.
- `embedTitleTemplate` and `embedDescriptionTemplate` are in `ui-config.json` and `db-config.json` but not in `schema.json`.

## Use Cases

Posting notifications about sign-ups, purchases or other key events to a team Discord channel.
