# Zapier Business Logic

## Flow (`procWorkflow.yaml`)

1. `validateInput`: type present and one of `track`, `page`, `screen`.
2. `prepareContext`: endpoint list = `[Config.zapUrl]`.
3. `trackEndpoint` (track): build a case-insensitive map from `trackEventsToZap` (`getHashFromArrayWithDuplicate`, value is a Set of URLs). If `message.event` (lowercased) is mapped, the endpoint list becomes those URLs.
4. `endpointForOthers` (page/screen): same with `pageScreenEventsToZap` and `message.name`.
5. `buildResponse`: one `POST` per URL with the unmodified message as JSON body and header `content-type: application/json`. In batch mode the message is returned as-is.

## Example

Config: `zapUrl = A`, `trackEventsToZap = [{ from: "Order Completed", to: B }, { from: "order completed", to: C }]`.

| Event                     | Requests sent to |
| ------------------------- | ---------------- |
| `track` "Order Completed" | B and C          |
| `track` "Signed Up"       | A                |
| `page` "Home" (unmapped)  | A                |

## Error Handling

Only workflow validation errors. Delivery errors (429, 404 for a disabled Zap) are handled by rudder-server defaults.

## Known Issues (NEEDS REVIEW)

- `.message.event.toLowerCase()` and `.message.name.toLowerCase()` run without a guard. A `track` without `event` or a `page`/`screen` without `name` may throw a runtime error instead of falling back to `zapUrl`.

## General Use Cases

Trigger no-code automations (Slack alerts, CRM updates, spreadsheets) from product events.
