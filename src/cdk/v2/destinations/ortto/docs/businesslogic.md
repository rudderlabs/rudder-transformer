# Ortto Business Logic

## Endpoints

| Event      | Method | Endpoint (by `instanceRegion`)                                                                                                                          |
| ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `identify` | POST   | `au`: `https://api.au.ap3api.com/v1/person/merge`, `eu`: `https://api.eu.ap3api.com/v1/person/merge`, `other`: `https://api.ap3api.com/v1/person/merge` |
| `track`    | POST   | Same hosts, path `/v1/activities/create`                                                                                                                |

Headers: `X-Api-Key: <privateApiKey>`, `Content-Type: application/json`.

## Common Person Fields (both event types)

| Ortto field     | Source (generic paths: `traits`, `context.traits`, and so on)                  |
| --------------- | ------------------------------------------------------------------------------ |
| `str::first`    | firstName                                                                      |
| `str::last`     | lastName                                                                       |
| `str::email`    | email                                                                          |
| `geo::city`     | `{ name: city }`                                                               |
| `geo::country`  | `{ name: country }`                                                            |
| `geo::region`   | `{ name: region }`                                                             |
| `str::postal`   | zipcode                                                                        |
| `dtz::b`        | birthday `YYYY-MM-DD` → `{ year, month, day }`                                 |
| `str::ei`       | userId                                                                         |
| `str::language` | `context.traits.language` or `context.locale`                                  |
| `phn::phone`    | `{ n: phone }`                                                                 |
| `bol::gdpr`     | `context.traits.gdpr`                                                          |
| `bol::p`        | `context.traits.emailConsent`                                                  |
| `bol::sp`       | `context.traits.smsConsent`                                                    |
| custom          | `orttoPersonAttributes`: `context.traits[rudderTraits]` → `<prefix>:cm:<name>` |

`location.source_ip` = `context.ip`.

## identify

```json
{
  "people": [{ "fields": { "...": "..." }, "tags": ["..."], "unset_tags": ["..."] }],
  "merge_by": ["str::ei", "str::email"]
}
```

`tags` / `unset_tags` come from `context.traits` or `traits`.

## track

1. Find `orttoEventsMapping` entry where `rsEventName === event`; build `activity_id = "act:cm:" + normalised(orttoEventName)`.
2. Build `attributes` from `eventProperties`: `properties[rudderProperty]` → `<prefix>:cm:<normalised orttoProperty>`.

```json
{
  "activities": [
    {
      "fields": { "...": "..." },
      "activity_id": "act:cm:ortto-event",
      "attributes": { "str:cm:orttoprop": "USD" },
      "location": { "source_ip": "1.2.3.4" }
    }
  ],
  "merge_by": ["str::ei", "str::email"]
}
```

## Router

`rtWorkflow.yaml` runs the processor workflow per event, then `batchEvents` (`utils.js`) groups successful outputs into person and activity lists and chunks them by `maxBatchSize = 1`. Person batches are emitted before activity batches. Failed events are returned unbatched.

## Error Handling

Validation failures are instrumentation/configuration errors. Delivery errors use the server's default handling (no proxy).

## Known Issues (NEEDS REVIEW)

- **Attributes from all mappings**: `getAttributes` loops over `eventProperties` of every `orttoEventsMapping` entry, not only the matched event. If two mapped events share a property name, attributes meant for another activity are added.
- **Decimal and currency**: `decimalNumber` and `currency` map to `int` without scaling. Ortto treats decimal values as integers multiplied by 1,000, so `12.5` is not converted to `12500`.
- **Custom person attributes ignore `traits`**: `orttoPersonAttributes` and the consent fields read only `context.traits`, so server-side identify calls that put traits in `message.traits` lose them.
- **No batching**: `maxBatchSize = 1` although Ortto accepts up to 100 people per merge.
- **Identify/track reordering** within a router batch (person batches first).
