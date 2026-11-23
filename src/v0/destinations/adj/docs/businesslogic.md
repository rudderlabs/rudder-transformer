# Adjust Business Logic

## Request

| Item     | Value                                                                   |
| -------- | ----------------------------------------------------------------------- |
| Method   | `POST`                                                                  |
| Endpoint | `https://s2s.adjust.com/event`                                          |
| Headers  | `Accept: */*` (no auth header)                                          |
| Params   | All fields below, sent as query parameters (`response.params`); no body |
| userId   | `message.anonymousId`                                                   |

## Field Mappings (`data/ADJUSTTrackConfig.json` plus code)

| Source                                     | Adjust param           | Notes                                                     |
| ------------------------------------------ | ---------------------- | --------------------------------------------------------- |
| `properties` (minus `revenue`, `currency`) | `callback_params`      | Flattened, values stringified, JSON string; null if empty |
| `properties.revenue`                       | `revenue`              | `numberForRevenue`                                        |
| `properties.currency`                      | `currency`             | Only when `revenue` is set; defaults to `USD`             |
| `context.ip`, `request_ip`                 | `ip_address`           |                                                           |
| `context.device.id`                        | `android_id`           | Android only                                              |
| `context.device.id`                        | `idfv`                 | Apple family only                                         |
| `context.device.advertisingId`             | `gps_adid`             | Android only                                              |
| `context.device.advertisingId`             | `idfa`                 | Apple family only                                         |
| `context.device.attTrackingStatus`         | `att_status`           |                                                           |
| `context.device.adTrackingEnabled`         | `tracking_enabled`     |                                                           |
| `context.userAgent`                        | `user_agent`           |                                                           |
| `integrations.<adj names>.adid`            | `adid`                 |                                                           |
| `properties[<partnerParamsKeys.from>]`     | `partner_params[<to>]` | Stringified; null if none                                 |
| constant `1`                               | `s2s`                  |                                                           |
| `Config.appToken`                          | `app_token`            |                                                           |
| `customMappings[event]`                    | `event_token`          |                                                           |
| `Config.environment`                       | `environment`          | `production` if true, else `sandbox`                      |

Not sent: `created_at_unix` / `created_at`. Adjust uses receipt time as the event time.

## Flow

1. Reject non-track messages.
2. Build the payload from the mapping JSON.
3. Check `appToken`, `context.device.type` and `context.device.id`.
4. Remove the other platform's identifiers by `context.device.type`.
5. Add `adid`, `currency`, `partner_params`, `callback_params`.
6. Look up the event token in `customMappings`; fail if there is none.
7. Add `s2s`, `app_token`, `event_token`, `environment`; drop null values; return as query params.

## Example

Input:

```json
{
  "type": "track",
  "event": "purchase",
  "anonymousId": "a1",
  "context": {
    "device": { "type": "android", "id": "dev1", "advertisingId": "gaid1" },
    "ip": "1.2.3.4"
  },
  "properties": { "revenue": 9.99, "currency": "EUR", "sku": "s1" }
}
```

Config: `appToken: "app123"`, `customMappings: [{ "from": "purchase", "to": "ev1" }]`, `environment: false`.

Output params:

```json
{
  "callback_params": "{\"sku\":\"s1\"}",
  "revenue": 9.99,
  "currency": "EUR",
  "ip_address": "1.2.3.4",
  "android_id": "dev1",
  "gps_adid": "gaid1",
  "s2s": 1,
  "app_token": "app123",
  "event_token": "ev1",
  "environment": "sandbox"
}
```

## Error Handling

- `Message Type is not present. Aborting message.` / `Message type not supported`
- `App Token is not present. ...` (ConfigurationError)
- `Device type/id  not present` / `Device type not valid` (InstrumentationError)
- `No event token mapped for this event` (ConfigurationError)
- Delivery errors use rudder-server's default HTTP handling. With S2S Security enabled on the Adjust app, every request is rejected because no Bearer token is sent.
