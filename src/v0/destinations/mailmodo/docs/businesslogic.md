# Mailmodo Business Logic and Mappings

## Identify

Mapping: `data/identifyConfig.json`. Each contact becomes one entry in `values`.

| Mailmodo field                                                          | Source                                                                  |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `email`                                                                 | `traits.email` → `context.traits.email` → `properties.email` (required) |
| `data.first_name`, `data.last_name`, `data.name`                        | generic `firstName`, `lastName`, `name`                                 |
| `data.gender`, `data.age`                                               | `traits.gender`, `traits.age`                                           |
| `data.birthday`                                                         | generic `birthday`                                                      |
| `data.phone`                                                            | generic `phone`                                                         |
| `data.city`, `data.state`, `data.country`                               | traits or `traits.address.*`                                            |
| `data.postal_code`                                                      | generic `zipcode`                                                       |
| `data.designation`, `data.company`, `data.industry`, `data.description` | same-named traits                                                       |
| `data.anniversary_date`                                                 | `traits.anniversaryDate` / `traits.anniversary_date`                    |
| `data.address1`, `data.address2`                                        | generic `address` (see below)                                           |
| `data.*`                                                                | all other `traits` and `context.traits` (custom properties)             |

**Address**: if `address` has both `addressLine1` and `addressLine2`, those are used. Otherwise the object
values are joined with spaces (or the string is used), `address1` takes characters 0–149 and `address2` from
151 onward.

**Router batching**: identify responses are chunked into groups of 100 and sent as:

```json
POST https://api.mailmodo.com/api/v1/addToList/batch
{ "listName": "<listName of the first event>", "values": [ { "email": "a@b.com", "data": { "first_name": "Ann" } } ] }
```

## Track

Mapping: `data/trackConfig.json`. `POST https://api.mailmodo.com/api/v1/addEvent`

| Mailmodo field     | Source                                                                  |
| ------------------ | ----------------------------------------------------------------------- |
| `event_name`       | `event` (required)                                                      |
| `email`            | `traits.email` → `context.traits.email` → `properties.email` (required) |
| `event_properties` | `properties`                                                            |

## Error Handling

- Missing `apiKey` → configuration error.
- Missing email or event → instrumentation error.
- Router errors are returned per event via `handleRtTfSingleEventError`.

## Notes and Possible Bugs

- **Off-by-one in address split**: `address2 = substring(151)` skips the character at index 150.
- **Crash when only address is present**: when there are no custom traits and no mapped `data.*` fields,
  `payload.data` is undefined and `payload.data.address1 = ...` throws a `TypeError`.
- **`listName` absent from config**: if `listName` is `undefined` (not an empty string), the batch body sends
  the literal string `"undefined"` as `listName`. Only an empty string falls back to `Rudderstack`.

## General Use Cases

Sync contacts into a Mailmodo list for campaigns and segments, and send custom events for journey triggers.
