# Wunderkind Business Logic and Mappings

## Overview

`procWorkflow.yaml` builds one Lambda payload per track event and returns `{ payload: "<JSON string>" }`. `rtWorkflow.yaml` runs it per event and wraps successes as non-batched router responses. rudder-server invokes the Lambda function named by `WUNDERKIND_LAMBDA` with that payload.

## Flow

1. `checkIfProcessed`: events that already have a `statusCode` are returned as-is.
2. `validateInput`: type must be `track`; `accountID`, `instanceID`, `apiKey` required.
3. `buildAccountPayload` and `buildPayload` (below).
4. Output: `{ payload: JSON.stringify(payload) }`.

## Field Mappings

| Source                                                      | Lambda payload field                   |
| ----------------------------------------------------------- | -------------------------------------- |
| `Config.accountID`                                          | `account.account_id`                   |
| `Config.instanceID`                                         | `account.account_settings.instance_id` |
| `Config.apiKey`                                             | `account.account_settings.key`         |
| `integrations.Wunderkind.lambdaRootLevelProperties`         | spread into the payload root           |
| traits (generic `traits` paths: `traits`, `context.traits`) | `user_attributes`                      |
| `integrations.Wunderkind.extraEventProperties`              | spread into `events[0]`                |
| `properties`                                                | `events[0].attributes`                 |

## Example Payload

Input:

```json
{
  "type": "track",
  "event": "srp-screen-view",
  "context": { "traits": { "firstName": "john" } },
  "properties": { "make": "Toyota" },
  "integrations": {
    "Wunderkind": {
      "lambdaRootLevelProperties": {
        "type": "event_processing_request",
        "id": "req-1",
        "timestamp_ms": 1718893923387
      },
      "extraEventProperties": {
        "type": "custom_event",
        "id": "evt-1",
        "name": "srp-screen-view",
        "timestamp_ms": 1703685306737
      }
    }
  }
}
```

Output `payload` (parsed):

```json
{
  "account": {
    "account_id": "<accountID>",
    "account_settings": { "instance_id": "<instanceID>", "key": "<apiKey>" }
  },
  "type": "event_processing_request",
  "id": "req-1",
  "timestamp_ms": 1718893923387,
  "user_attributes": { "firstName": "john" },
  "events": [
    {
      "type": "custom_event",
      "id": "evt-1",
      "name": "srp-screen-view",
      "timestamp_ms": 1703685306737,
      "attributes": { "make": "Toyota" }
    }
  ]
}
```

## Error Handling

- Transformer: missing/unsupported type or missing config → assertion errors (400, aborted).
- rudder-server delivery (`services/streammanager/wunderkind`):
  - Empty `payload` or unparseable job → 400.
  - AWS invoke errors → status parsed from the AWS error (`common.ParseAWSError`).
  - Lambda returns `FunctionError` → 400 with the Lambda response as the message.
  - Otherwise 200.

## General Use Cases

- Feeding Wunderkind with on-site and in-app behaviour (screen views, product views, custom events) to drive triggered email and SMS.
