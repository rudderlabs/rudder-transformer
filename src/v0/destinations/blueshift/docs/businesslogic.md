# Blueshift Business Logic and Mappings

## Endpoints

Base URL: `https://api.getblueshift.com`, or `https://api.eu.getblueshift.com` when `dataCenter` is `eu`.

| Message type | Endpoint            | Method | Key           |
| ------------ | ------------------- | ------ | ------------- |
| identify     | `/api/v1/customers` | POST   | `usersApiKey` |
| track        | `/api/v1/event`     | POST   | `eventApiKey` |
| group        | `/api/v1/event`     | POST   | `eventApiKey` |

## Identify (`blueshiftIdentifyConfig.json`)

| RudderStack field                         | Blueshift field |
| ----------------------------------------- | --------------- |
| generic `emailOnly`                       | `email`         |
| generic `userId` (includes `anonymousId`) | `customer_id`   |
| `event`                                   | `event`         |
| generic `phone`                           | `phone_number`  |
| generic `firstName`                       | `firstname`     |
| generic `lastName`                        | `lastname`      |
| `traits.gender` / `context.traits.gender` | `gender`        |

All other keys in `traits` and `context.traits` are copied as top-level fields, except `email`, `event`, phone and name variants and `gender`.

## Track (`blueshiftTrackConfig.json`)

| RudderStack field                                          | Blueshift field       |
| ---------------------------------------------------------- | --------------------- |
| generic `userId`                                           | `customer_id`         |
| generic `emailOnly`                                        | `email`               |
| `event`                                                    | `event`               |
| `context.device.type`                                      | `device_type`         |
| `context.device.token`                                     | `device_token`        |
| `context.device.id`                                        | `device_id`           |
| `context.idfa` / `context.device.advertisingId`            | `device_idfa`         |
| `context.idfv` / `context.device.id`                       | `device_idfv`         |
| `context.device.manufacturer`                              | `device_manufacturer` |
| `context.os.name`                                          | `os_name`             |
| `context.network.carrier`                                  | `network_carrier`     |
| `context.ip` / `request_ip`                                | `ip`                  |
| `context.address.latitude` / `context.location.latitude`   | `latitude`            |
| `context.address.longitude` / `context.location.longitude` | `longitude`           |
| `messageId`                                                | `event_uuid`          |

All `properties` are then copied as top-level fields.

Event name mapping (`EVENT_NAME_MAPPING`, exact match after trim):

| RudderStack event    | Blueshift event        |
| -------------------- | ---------------------- |
| Product Viewed       | `view`                 |
| Product Added        | `add_to_cart`          |
| Order Completed      | `purchase`             |
| Products Searched    | `search`               |
| Checkout Step Viewed | `checkout`             |
| Product Removed      | `remove_from_cart`     |
| Subscribe Interest   | `subscribe_interest`   |
| Unsubscribe Interest | `unsubscribe_interest` |
| Identify             | `identify`             |

Whitespace in the final name is replaced with `_`. Names with `.`, digits or more than 64 characters are rejected.

## Group (`blueshiftGroupConfig.json`)

Same device/location fields as track, plus `group_id` (generic `groupId`, required) and `customer_id` (generic `userId`, required). `event` is fixed to `identify`, and `traits` keys are copied as top-level fields.

## Notes and Possible Issues

- The digit check (`/\d/`) rejects any event name containing a number (for example `Step 2 Completed`). `NEEDS REVIEW`: confirm this matches Blueshift's actual event-name rules.
- Basic auth omits the `:` after the key (see README).

## Example (track)

```json
{
  "method": "POST",
  "endpoint": "https://api.getblueshift.com/api/v1/event",
  "headers": {
    "Authorization": "Basic <base64(eventApiKey)>",
    "Content-Type": "application/json"
  },
  "body": {
    "JSON": {
      "customer_id": "user-1",
      "email": "jane@example.com",
      "event": "purchase",
      "event_uuid": "msg-123",
      "revenue": 20
    }
  }
}
```
