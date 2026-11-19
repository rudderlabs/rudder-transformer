# Koddi Business Logic

## Endpoints

`{base}` = `Config.apiBaseUrl` with any trailing slash removed.

| `integrations.koddi.eventType` | Endpoint                   | Method | Payload      |
| ------------------------------ | -------------------------- | ------ | ------------ |
| `impressions`                  | `{base}?action=impression` | GET    | query params |
| `clicks`                       | `{base}?action=click`      | GET    | query params |
| `conversions`                  | `{base}/conversion`        | POST   | JSON body    |

Headers: `accept: application/json`; conversions also send `content-type: application/json`. Null and undefined values are removed.

## Impressions (`data/ImpressionsConfig.json`)

| Source                     | Destination    | Required |
| -------------------------- | -------------- | -------- |
| `properties.tracking_data` | `trackingData` | Yes      |
| `properties.rank`          | `rank`         | Yes      |
| `properties.beacon_issued` | `beaconIssued` | Yes      |
| generic `timestamp`        | `ts`           | No       |
| `Config.clientName`        | `clientName`   | —        |

## Clicks (`data/ClicksConfig.json`)

| Source                                         | Destination                                                         | Required |
| ---------------------------------------------- | ------------------------------------------------------------------- | -------- |
| `properties.tracking_data`                     | `trackingData`                                                      | Yes      |
| `properties.rank`                              | `rank`                                                              | Yes      |
| `properties.beacon_issued`                     | `beaconIssued`                                                      | Yes      |
| generic `userId` (falls back to `anonymousId`) | `userGuid`                                                          | Yes      |
| `properties.test_version_override`             | `testVersionOverride` (dropped unless `Config.testVersionOverride`) | No       |
| `properties.destination_url`                   | `destinationUrl`                                                    | No       |
| `properties.overrides`                         | `overrides` (dropped unless `Config.overrides`)                     | No       |
| `Config.clientName`                            | `clientName`                                                        | —        |

## Conversions (`data/ConversionsConfig.json`)

| Source                                               | Destination               | Required |
| ---------------------------------------------------- | ------------------------- | -------- |
| `context.page.referring_domain`                      | `domain`                  | No       |
| `context.locale`                                     | `culture`                 | Yes      |
| `properties.currency`                                | `currency`                | Yes      |
| `context.ip` or `request_ip`                         | `user_ip`                 | No       |
| `context.userAgent`                                  | `user_agent`              | No       |
| generic `userId`                                     | `user_guid`               | Yes      |
| `context.device.type`                                | `device_type`             | No       |
| `properties.order_id` or `properties.transaction_id` | `transaction_id`          | Yes      |
| `properties.conversion_source`                       | `conversion_source`       | No       |
| generic `timestamp`                                  | `unixtime` (Unix seconds) | No       |
| `properties.bidders`                                 | `bidders`                 | Yes      |
| `Config.clientName`                                  | `client_name`             | —        |

`bidders` validation: non-empty array; each item needs `bidder` or `alternate_bidder`, `count`, and `base_price` (a `0` count or price fails the truthiness check).

## Flow

1. `messageType` and `eventType` steps lowercase `message.type` and `integrations.koddi.eventType`.
2. `validateInput` asserts track, a known event type, and `apiBaseUrl`/`clientName`.
3. `preparePayload` builds the payload for the event type.
4. `buildResponse` sets endpoint, method and headers.
5. `rtWorkflow.yaml` returns each event as its own non-batched request; failures go through `handleRtTfSingleEventError`.

## Example

Input:

```json
{
  "type": "track",
  "event": "Ad Impression",
  "integrations": { "koddi": { "eventType": "impressions" } },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "properties": { "tracking_data": "abc", "rank": 1, "beacon_issued": "2024-01-01T00:00:00Z" }
}
```

Output: `GET https://{client}.koddi.io/event-collection/beacon?action=impression` with params

```json
{
  "trackingData": "abc",
  "rank": 1,
  "beaconIssued": "2024-01-01T00:00:00Z",
  "ts": "2024-01-01T00:00:00.000Z",
  "clientName": "<clientName>"
}
```

## Error Handling

- Workflow assertions and `InstrumentationError` for unsupported type/event type, missing required fields and invalid `bidders`; `ConfigurationError` for missing `apiBaseUrl`/`clientName`.
- No custom response handling. Koddi often returns `200` even when it drops an event, so delivery success does not confirm the event was recorded.
