# WebEngage Business Logic and Mappings

## Identify

**Endpoint**: `POST https://{host}/v1/accounts/{licenseCode}/users`
Mapping: `data/WEBENGAGEIdentifyConfig.json`

| WebEngage field                                       | Source                                                                                     |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `userId`                                              | `userId` (generic `userIdOnly`)                                                            |
| `anonymousId`                                         | `anonymousId`                                                                              |
| `firstName`, `lastName`                               | generic `firstName`, `lastName`                                                            |
| `birthDate`                                           | generic `birthday`, formatted `yyyy-MM-DDTHH:mm:ssZZ`                                      |
| `gender`                                              | `traits.gender` / `context.traits.gender`, normalised to `male`/`female`/`other`           |
| `email`, `phone`                                      | generic `emailOnly`, `phone`                                                               |
| `emailOptIn`, `smsOptIn`, `whatsappOptIn`             | same-named traits                                                                          |
| `company`                                             | `traits.company.name`                                                                      |
| `hashedEmail`, `hashedPhone`                          | same-named traits                                                                          |
| `postalCode`, `country`, `city`, `locality`, `region` | traits or `traits.address.*`                                                               |
| `attributes`                                          | all other keys of `context.traits` and `traits` (excluding `WEBENGAGE_IDENTIFY_EXCLUSION`) |

## Track

**Endpoint**: `POST https://{host}/v1/accounts/{licenseCode}/events`
Mapping: `data/WEBENGAGETrackConfig.json`

| WebEngage field | Source                                                 |
| --------------- | ------------------------------------------------------ |
| `userId`        | `userId`                                               |
| `anonymousId`   | `anonymousId`                                          |
| `eventName`     | `event` (required)                                     |
| `eventTime`     | generic `timestamp`, formatted `yyyy-MM-DDTHH:mm:ssZZ` |
| `eventData`     | `properties`                                           |

## Page / Screen

Sent to the events endpoint with the track mapping. `event` is set to:

| Has `name` | Has `properties.category` | Event name                        |
| ---------- | ------------------------- | --------------------------------- |
| Yes        | Yes                       | `Viewed {category} {name} {type}` |
| Yes        | No                        | `Viewed {name}`                   |
| No         | Yes                       | `Viewed {category} {type}`        |
| No         | No                        | `Viewed a {type}`                 |

`name` is `message.name`, falling back to `properties.name`. `{type}` is `page` or `screen`.

## Example

```json
// input
{ "type": "track", "userId": "u1", "event": "Order Completed",
  "properties": { "total": 10 }, "timestamp": "2024-01-01T10:00:00.000Z" }
// output: POST https://api.webengage.com/v1/accounts/<licenseCode>/events
{ "userId": "u1", "eventName": "Order Completed",
  "eventTime": "2024-01-01T10:00:00+0000", "eventData": { "total": 10 } }
```

## Error Handling

- No `userId` and no `anonymousId` → instrumentation error.
- Invalid birthday or timestamp → instrumentation error.
- Unsupported type → instrumentation error.

## General Use Cases

User profile sync and behavioural events for WebEngage journeys and segments.
