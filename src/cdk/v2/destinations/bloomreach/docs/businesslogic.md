# Bloomreach Business Logic and Mappings

## Overview

All events go to `POST {apiBaseUrl}/track/v2/projects/{projectToken}/batch` with headers:

```text
Content-Type: application/json
Authorization: Basic base64(<apiKey>:<apiSecret>)
```

The router sends `{ "commands": [ ... ] }` with up to 50 commands. Each event becomes one command.

## Customer IDs (`utils.ts` `prepareCustomerIDs`)

| Source                                  | `customer_ids` key | Notes                                         |
| --------------------------------------- | ------------------ | --------------------------------------------- |
| `userId`                                | `<Config.hardID>`  |                                               |
| `anonymousId`                           | `<Config.softID>`  |                                               |
| `integrations.bloomreach.hardID.<name>` | `<name>`           | Added; overrides a config ID of the same name |
| `integrations.bloomreach.softID.<name>` | `<name>`           | Added; overrides a config ID of the same name |

## Identify → `customers` command

### Mappings (`data/BloomreachCustomerPropertiesConfig.json`)

| RudderStack field (traits / context.traits) | Bloomreach property |
| ------------------------------------------- | ------------------- |
| `firstName`                                 | `first_name`        |
| `lastName`                                  | `last_name`         |
| `email`                                     | `email`             |
| `phone`                                     | `phone`             |
| `city`                                      | `city`              |
| `address.country`                           | `country`           |
| `birthday`                                  | `birthday`          |
| other traits                                | same key            |

Excluded from custom traits: `email`, `firstName`, `lastName` (all casings), `name`, `phone`, `city`, `birthday`, `country`.

`update_timestamp` is the event timestamp as a Unix timestamp.

```json
{
  "name": "customers",
  "data": {
    "customer_ids": { "registered": "user-1", "cookie": "anon-1" },
    "update_timestamp": 1709564813,
    "properties": {
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "plan": "pro"
    }
  }
}
```

## Track, Page, Screen → `customers/events` command

| Message type | `event_type`                                                                                                |
| ------------ | ----------------------------------------------------------------------------------------------------------- |
| Track        | `event` (required)                                                                                          |
| Page         | `Viewed` + `category` (or `properties.category`) + `name` (or `properties.name`) + `Page`, joined by spaces |
| Screen       | Same as page, ending in `Screen`                                                                            |

| RudderStack field | Bloomreach field | Notes                         |
| ----------------- | ---------------- | ----------------------------- |
| `properties`      | `properties`     | Sent as is                    |
| `timestamp`       | `timestamp`      | Converted to a Unix timestamp |

```json
{
  "name": "customers/events",
  "data": {
    "customer_ids": { "registered": "user-1", "cookie": "anon-1" },
    "timestamp": 1709564813,
    "properties": { "product_id": "622c6f5d5cf86a4c77358033", "price": 49.99 },
    "event_type": "Product Added"
  }
}
```

A page event with `category: "Docs"` and `name: "Intro"` gets `event_type: "Viewed Docs Intro Page"`. Without category or name it is `Viewed Page`.

## Error Handling

- Transform: validation failures fail the event with status 400.
- Delivery (`src/v1/destinations/bloomreach/networkHandler.js`):
  - 2xx: each `results[i]` maps to event `i`. `success: false` → status 400 with the joined `errors`.
  - Non-2xx: `TransformerProxyError` for the whole batch, with a dynamic error type.

Example partial response:

```json
{
  "results": [
    { "success": true },
    { "success": false, "errors": ["At least one id should be specified."] }
  ],
  "start_time": 1710750816.85,
  "end_time": 1710750816.85,
  "success": true
}
```

## Validation Messages

| Condition                          | Message                                                     |
| ---------------------------------- | ----------------------------------------------------------- |
| Unsupported type                   | `message type <type> is not supported`                      |
| Missing config field               | `<Field> is not present. Aborting`                          |
| No `timestamp`/`originalTimestamp` | `Timestamp is not present. Aborting`                        |
| No `userId` and no `anonymousId`   | `Either one of userId or anonymousId is required. Aborting` |
| Track without `event`              | `Event name is required. Aborting`                          |

## Use Cases

- Keep Bloomreach customer profiles in sync with user traits.
- Track product, page and app events for segmentation, scenarios and analytics.
