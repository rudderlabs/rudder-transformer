# Cordial Business Logic and Mappings

## Overview

The processor workflow (`procWorkflow.yaml`) validates the config and message, resolves the contact identifier, builds the payload for identify or track, and returns one request. The router workflow (`rtWorkflow.yaml`) runs it per event and returns unbatched responses.

All requests use:

- Header `Authorization: Basic base64(apiKey + ":")`
- Header `Content-Type: application/json`
- A JSON body with `null`, `undefined` and empty values removed

## Contact Identification

| Identifier         | Source                                                       | Used for                                       |
| ------------------ | ------------------------------------------------------------ | ---------------------------------------------- |
| Cordial contact ID | `context.externalId[]` entry with `type: "cordialContactId"` | Preferred identifier for lookup, update, `cID` |
| Email              | `traits.email`, `context.traits.email`, `properties.email`   | Fallback identifier                            |

At least one of the two is required, otherwise the event fails with `Either one of cordial contact id or email is required. Aborting`.

## Identify

### Flow

1. Look up the contact (intermediate call, `utils.js#checkIfContactExists`):
   - With contact ID: `GET {apiBaseUrl}/v2/contacts/{cordialContactId}`
   - Otherwise: `GET {apiBaseUrl}/v2/contacts/email:{email}`
   - The contact exists when the response is HTTP 200 with an `_id`.
2. Build the payload (see mapping).
3. Send:
   - Contact not found: `POST {apiBaseUrl}/v2/contacts`
   - Contact found: `PUT {apiBaseUrl}/v2/contacts/{cordialContactId}` or `PUT {apiBaseUrl}/v2/contacts/email:{email}`

### Mapping (`data/CordialIdentifyConfig.json` + traits)

| RudderStack field                                                | Cordial field                           |
| ---------------------------------------------------------------- | --------------------------------------- |
| `traits.email` / `context.traits.email` / `properties.email`     | `channels.email.address`                |
| `traits.subscribeStatus` / `context.traits.subscribeStatus`      | `channels.email.subscribeStatus`        |
| All other `traits` (or `context.traits` when `traits` is absent) | Top-level contact attributes (same key) |

The top-level `email` and `subscribeStatus` keys copied from traits are removed, so they appear only under `channels.email`.

### Example

Input:

```json
{
  "type": "identify",
  "userId": "user-1",
  "context": {
    "traits": { "email": "jane@example.com", "first_name": "Jane", "subscribeStatus": "subscribed" }
  }
}
```

Output (contact not found):

```json
{
  "method": "POST",
  "endpoint": "https://usw2.admin.cordial.io/v2/contacts",
  "body": {
    "JSON": {
      "channels": { "email": { "address": "jane@example.com", "subscribeStatus": "subscribed" } },
      "first_name": "Jane"
    }
  }
}
```

## Track

### Flow

No intermediate call. Always `POST {apiBaseUrl}/v2/contactactivities`.

### Mapping (`data/CordialTrackConfig.json`)

| RudderStack field                                            | Cordial field | Notes                     |
| ------------------------------------------------------------ | ------------- | ------------------------- |
| `event`                                                      | `a`           | Required (action name)    |
| `properties`                                                 | `properties`  | Sent as is                |
| `timestamp` / `originalTimestamp`                            | `ats`         | Activity timestamp        |
| `traits.email` / `context.traits.email` / `properties.email` | `email`       | Removed when `cID` is set |
| `cordialContactId` external ID                               | `cID`         | Removed when not set      |

### Example output

```json
{
  "method": "POST",
  "endpoint": "https://usw2.admin.cordial.io/v2/contactactivities",
  "body": {
    "JSON": {
      "cID": "6690fe3655e334d6270287b5",
      "a": "Product Viewed",
      "properties": { "sku": "SKU-1" },
      "ats": "2024-07-12T08:00:00.000Z"
    }
  }
}
```

## Validations

| Check                        | Error                                                             |
| ---------------------------- | ----------------------------------------------------------------- |
| `apiKey` missing             | `API Key is not present. Aborting` (configuration error)          |
| `apiBaseUrl` missing         | `API Base URl is not present. Aborting` (configuration error)     |
| `type` missing               | `message Type is not present. Aborting`                           |
| `type` not identify or track | `message type <type> is not supported`                            |
| No contact ID and no email   | `Either one of cordial contact id or email is required. Aborting` |
| Track without `event`        | Required-field error from the track mapping                       |

## Error Handling

- Processor and router errors are returned per event through `handleRtTfSingleEventError`.
- No proxy delivery: delivery errors are handled by rudder-server from the Cordial HTTP status.
- The contact lookup uses `handleHttpRequest`; any non-200 response, including errors, is treated as "contact not found", which leads to a create (`POST`) request.

## Notes

- `utils.js` imports `destType` from `config.js`, but `config.js` does not export it, so the stats tag for the lookup call has an undefined destination type. NEEDS REVIEW.

## General Use Cases

- Keep Cordial contact profiles and email subscription status in sync with RudderStack identities.
- Send product and lifecycle events as Cordial contact activities to trigger automations and segment contacts.
