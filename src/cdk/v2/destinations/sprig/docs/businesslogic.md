# Business Logic for Sprig

## Overview

Sprig is implemented as a CDK v2 processor workflow for event-stream Identify and Track messages. The workflow validates the message, constructs a Sprig Data Import API payload, removes undefined and null values, and returns one REST request to `POST https://api.sprig.com/v2/users`.

Regulation/user deletion is implemented separately in `src/v0/destinations/sprig/deleteUsers.js` and calls Sprig's purge API.

## Common Request Behavior

### Event ingestion endpoint

All supported event-stream messages use the same endpoint:

```http
POST https://api.sprig.com/v2/users
accept: application/json
content-type: application/json
authorization: API-Key <apiKey>
```

The request body is built in `src/cdk/v2/destinations/sprig/procWorkflow.yaml` and placed in `response.body.JSON`.

Sprig acknowledges this endpoint with `202 Accepted` and processes the payload asynchronously, so a successful delivery means the payload was queued rather than already applied. Sprig-side constraints on the body:

- `attributes` is limited to 100 values total per user.
- `events[].event` must name an event already tracked (and approved) in Sprig.
- `events[].timestamp` must be a Unix timestamp in milliseconds.
- `emailAddress`, when present, must be a valid email address.
- Users must be upserted individually; there is no bulk-user endpoint.

### Request flow

1. Read `message.type` and lower-case it.
2. Validate that the message type is present and is either `identify` or `track`.
3. Validate that `destination.Config.apiKey` is present.
4. Run message-type-specific validations.
5. Build the Sprig payload for Identify or Track.
6. Remove undefined and null fields with `removeUndefinedAndNullValues`.
7. Return a default REST request targeting `https://api.sprig.com/v2/users` with API key authorization.

## Identify Mapping

### Validations

- `destination.Config.apiKey` is required.
- `message.type` must be `identify`.
- A user identifier must be present through the generic `userIdOnly` paths.

Generic `userIdOnly` paths are checked in this order:

1. `message.userId`
2. `message.traits.userId`
3. `message.traits.id`
4. `message.context.traits.userId`
5. `message.context.traits.id`

`anonymousId` is not part of the `userIdOnly` lookup, so an anonymous-only Identify call fails validation.

### Field mappings

| RudderStack field                                                                                                         | Sprig field    | Notes                                                    |
| ------------------------------------------------------------------------------------------------------------------------- | -------------- | -------------------------------------------------------- |
| `message.userId` or another generic `userIdOnly` field                                                                    | `userId`       | Required.                                                |
| `message.traits.email`, `message.context.traits.email`, `message.properties.email`, or `message.context.externalId[0].id` | `emailAddress` | Optional. The generic email lookup is used.              |
| `message.context.traits`                                                                                                  | `attributes`   | Optional. The full `context.traits` object is forwarded. |

Undefined and null values are removed after the payload is constructed.

### Example Identify input

```json
{
  "type": "identify",
  "channel": "web",
  "userId": "user@1",
  "context": {
    "traits": {
      "email": "test@gmail.com",
      "firstName": "Test",
      "lastName": "Rudderlabs"
    }
  },
  "timestamp": "2023-11-22T10:12:44.75705:30"
}
```

### Example Sprig Identify request

```json
{
  "method": "POST",
  "endpoint": "https://api.sprig.com/v2/users",
  "headers": {
    "accept": "application/json",
    "content-type": "application/json",
    "authorization": "API-Key <apiKey>"
  },
  "body": {
    "userId": "user@1",
    "emailAddress": "test@gmail.com",
    "attributes": {
      "email": "test@gmail.com",
      "firstName": "Test",
      "lastName": "Rudderlabs"
    }
  }
}
```

## Track Mapping

### Validations

- `destination.Config.apiKey` is required.
- `message.type` must be `track`.
- A user identifier must be present through the generic `userIdOnly` paths.
- `message.event` is required and must be non-empty.

### Field mappings

| RudderStack field                                                                                                         | Sprig field           | Notes                                            |
| ------------------------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------------------ |
| `message.userId` or another generic `userIdOnly` field                                                                    | `userId`              | Required.                                        |
| `message.traits.email`, `message.context.traits.email`, `message.properties.email`, or `message.context.externalId[0].id` | `emailAddress`        | Optional. The generic email lookup is used.      |
| `message.event`                                                                                                           | `events[0].event`     | Required.                                        |
| `message.timestamp` or `message.originalTimestamp`                                                                        | `events[0].timestamp` | Converted to milliseconds with `toMilliseconds`. |

The current workflow does not map Track `properties` into the Sprig payload. Undefined and null values are removed after the payload is constructed.

### Example Track input

```json
{
  "type": "track",
  "channel": "web",
  "userId": "user@1",
  "event": "signup",
  "properties": {},
  "context": {
    "traits": {
      "email": "test@gmail.com",
      "firstName": "Test",
      "lastName": "Rudderlabs"
    }
  },
  "timestamp": "2023-11-29T19:11:00.337Z"
}
```

### Example Sprig Track request

```json
{
  "method": "POST",
  "endpoint": "https://api.sprig.com/v2/users",
  "headers": {
    "accept": "application/json",
    "content-type": "application/json",
    "authorization": "API-Key <apiKey>"
  },
  "body": {
    "userId": "user@1",
    "emailAddress": "test@gmail.com",
    "events": [
      {
        "event": "signup",
        "timestamp": 1701285060337
      }
    ]
  }
}
```

## User Deletion Flow

User deletion is handled by `src/v0/destinations/sprig/deleteUsers.js` through the regulation API path.

### Endpoint and authentication

```http
POST https://api.sprig.com/v2/purge/visitors
Accept: application/json
Content-Type: application/json
Authorization: API-Key <apiKey>
```

### Request flow

1. Read `userAttributes` and destination `config` from the delete-users request.
2. Run common regulation API validations with `executeCommonValidations(userAttributes)`.
3. Validate `config.apiKey`; missing API key raises `ConfigurationError('Api Key is required for user deletion')`.
4. Split `userAttributes` into batches of 100 user IDs via `getUserIdBatches(userAttributes, 100)`. Sprig limits this endpoint to 100 visitor deletions per request, so 100 is the API-enforced maximum rather than a tuning choice.
5. For each batch, send `POST https://api.sprig.com/v2/purge/visitors` with `{ "userIds": [...] }`.
6. Treat any 2xx response as success.
7. Treat HTTP 400 as non-fatal because Sprig can return 400 when the requested users are not present for deletion.
8. Throw `NetworkError('User deletion request failed')` for other non-2xx statuses.

### Example deletion request body

```json
{
  "userIds": ["1", "2", "3"]
}
```

Sprig's purge endpoint also accepts `emails` and `visitorIds` identifier arrays and an optional `delaySeconds` field, and requires at least one identifier array to be non-empty. RudderStack sends only `userIds` and omits `delaySeconds`, so Sprig's default 10-day purge delay applies.

### Example successful deletion response from Sprig

```json
{
  "requestId": "request_1"
}
```

RudderStack returns the regulation response:

```json
{
  "statusCode": 200,
  "status": "successful"
}
```

### Example non-fatal missing-user deletion response

Sprig may return HTTP 400 when no matching users are present for the requested IDs. The handler treats this response as successful from RudderStack's regulation flow perspective:

```json
{
  "statusCode": 200,
  "status": "successful"
}
```

### Example deletion failures

| Scenario          | Sprig status | RudderStack behavior                                                                                                      |
| ----------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------- |
| Missing API key   | Not sent     | Returns configuration error `Api Key is required for user deletion`.                                                      |
| Invalid API key   | 403          | Throws `NetworkError('User deletion request failed')`.                                                                    |
| Too many requests | 429          | Throws `NetworkError('User deletion request failed')`; normal retry behavior can apply based on the error classification. |

## Error Handling

### Processor validation errors

Input validation failures return per-event processor responses with `statusCode: 400` and stat tags identifying `errorCategory: dataValidation`.

Common validation messages:

| Error                                   | Cause                                                            |
| --------------------------------------- | ---------------------------------------------------------------- |
| `message Type is not present. Aborting` | `message.type` is missing.                                       |
| `message type <type> is not supported`  | Message type is not `identify` or `track`.                       |
| `API Key is not present. Aborting`      | `destination.Config.apiKey` is missing.                          |
| `userId is required`                    | Identify or Track does not contain a generic `userIdOnly` value. |
| `event name is required`                | Track event name is missing or empty.                            |

### Delivery errors

Sprig does not define a custom proxy `networkHandler` in this repository. Non-2xx delivery responses for event-stream requests are handled by the default RudderStack delivery behavior.

Documented statuses for `POST /v2/users`:

| Status | Meaning                                                   |
| ------ | --------------------------------------------------------- |
| `202`  | Accepted; processed asynchronously.                       |
| `400`  | Bad Request. Response body carries a JSON `error` string. |
| `422`  | Unprocessable Entity.                                     |
| `429`  | Rate limited against the account-level QPS ceiling.       |
| `500`  | Sprig-side server error.                                  |

### Deletion errors

- Missing deletion API key raises a configuration error.
- HTTP 400 from Sprig's purge endpoint is non-fatal for deletion.
- Other non-2xx purge responses raise a network error with dynamic error-type tags based on status code.

## Use Cases

- **Profile enrichment and updates:** Send Identify calls to create or update Sprig visitor/user attributes for survey targeting and segmentation.
- **Event tracking:** Send Track calls to record named user actions in Sprig with millisecond timestamps.
- **Survey targeting:** Use Identify attributes and Track events in Sprig to target surveys based on who a user is and what actions they performed.
- **Privacy and regulation deletion:** Use the user deletion flow to request purging visitors by user ID from Sprig.

## References

- Event workflow: `src/cdk/v2/destinations/sprig/procWorkflow.yaml`
- Deletion handler: `src/v0/destinations/sprig/deleteUsers.js`
- Processor test data: `test/integrations/destinations/sprig/processor/data.ts`
- Deletion test data: `test/integrations/destinations/sprig/deleteUsers/data.ts`
- Deletion network mocks: `test/integrations/destinations/sprig/network.ts`
- Sprig API overview: [https://docs.sprig.com/reference/sprig-api/overview](https://docs.sprig.com/reference/sprig-api/overview)
