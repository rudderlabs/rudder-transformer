# Zendesk Business Logic and Mappings

## Overview

Each event is transformed by `processSingleMessage` (`transform.ts`). It builds the Basic auth header from `email` and `apiToken`, sets the base URL to `https://{domain}.zendesk.com/api/v2/` and routes by event type. Most Zendesk writes happen as intermediate calls during transformation. The returned response is the last call of the flow.

Headers on delivered responses:

| Header                                  | Value                                      |
| --------------------------------------- | ------------------------------------------ |
| `Authorization`                         | `Basic base64("{email}/token:{apiToken}")` |
| `Content-Type`                          | `application/json`                         |
| `X-Zendesk-Marketplace-Name`            | `RudderStack`                              |
| `X-Zendesk-Marketplace-Organization-Id` | `3339`                                     |
| `X-Zendesk-Marketplace-App-Id`          | `263241`                                   |

Intermediate calls send only `Authorization` and `Content-Type`.

## Field Mappings

### Identify: user (`data/ZDIdentifyConfig.json`)

Traits are read with `getFieldValueFromMessage(message, 'traits')` (`traits`, falling back to `context.traits`).

| RudderStack                              | Zendesk                  | Required |
| ---------------------------------------- | ------------------------ | -------- |
| `traits.email`                           | `user.email`             | No       |
| `traits.name`                            | `user.name`              | Yes      |
| `traits.organizationId`                  | `user.organization_id`   | No       |
| `traits.timezone`                        | `user.time_zone`         | No       |
| `traits.phone`                           | `user.phone`             | No       |
| `traits.userId` → `traits.id` → `userId` | `user.external_id`       | -        |
| same external ID                         | `user.user_fields.id`    | -        |
| any other non-object trait `<key>`       | `user.user_fields.<key>` | -        |
| `createUsersAsVerified: true`            | `user.verified: true`    | -        |

Object-valued traits (for example `company`) are not sent as user fields.

### Group: organization (`data/ZDGroupConfig.json`)

Read from the root of the message (`traits`, `groupId`).

| RudderStack                        | Zendesk                                  |
| ---------------------------------- | ---------------------------------------- |
| `traits.name`                      | `organization.name`                      |
| `traits.domainNames`               | `organization.domain_names`              |
| `traits.tags`                      | `organization.tags`                      |
| `groupId`                          | `organization.external_id`               |
| `traits.url`                       | `organization.url`                       |
| `traits.deleted`                   | `organization.deleted`                   |
| `groupId`                          | `organization.organization_fields.id`    |
| any other non-object trait `<key>` | `organization.organization_fields.<key>` |

The user for the membership is resolved from `context.traits.email` (or `context.traits.primaryEmail`). A user created during group uses `context.traits.name`, `context.traits.email` and `userId` as `external_id`.

### Track: event

| RudderStack                                   | Zendesk                                             |
| --------------------------------------------- | --------------------------------------------------- |
| `event`                                       | `event.type`, `event.description`, `profile.type`   |
| `properties`                                  | `event.properties`                                  |
| `sourceName` config (default `Rudder`)        | `event.source`, `profile.source`                    |
| user email (from traits, or the created user) | `profile.identifiers[0] = { type: 'email', value }` |

`timestamp`, `context` and other fields are not mapped.

## API Endpoints and Request Flow

All paths are relative to `https://{domain}.zendesk.com/api/v2/`.

### Identify

1. `validateUserId`: `userId` is required.
2. `checkAndCreateUserFields`: `GET user_fields.json`, then `POST user_fields.json` for each new non-object trait not in the default list (`email`, `name`, `organizationId`, `timezone`, `phone`, `userId`, `id`). Failures are logged and ignored. If Zendesk returns `user_fields` as a string, field creation is skipped.
3. Build the payload (above). Missing `name` throws `Missing required value from "name"`. Fields from step 2 may already have been created.
4. `POST users/create_or_update.json`: upserts the user and returns the Zendesk user ID. Non-2xx throws `NetworkError` (`[Zendesk]: unable to create or update user`).
5. Primary email update (`searchByExternalId` and `traits.email` set):
   - `GET users/{id}/identities`. On error the step is skipped.
   - If a non-primary email identity equals the new email: `DELETE users/{id}/identities/{identityId}`.
   - If the primary email identity differs from the new email: `PUT users/{id}/identities/{identityId}` with `{ identity: { type: 'email', value, verified: createUsersAsVerified } }`.
6. Organization removal (`removeUsersFromOrganization`, `traits.company.remove`, `traits.company.id`):
   - `GET users/search.json?query={email}` to find the user.
   - `GET users/{id}/organization_memberships.json`.
   - If the first membership's `organization_id` equals `traits.company.id`: `DELETE users/{id}/organization_memberships/{membershipId}.json`. Errors are logged and ignored.
7. Return the list of responses (steps 5 to 6 plus a final `POST users/create_or_update.json` with the same payload). The router returns them with status **299**, so rudder-server marks the job succeeded and does not send them again.

### Group

1. `checkAndCreateUserFields` on `message.traits` against `organization_fields.json`. Missing `traits` throws `Organisation Traits are missing. Aborting.`
2. **Without user** (`sendGroupCallsWithoutUserId` and no `userId`): the delivered request is `POST organizations/create_or_update.json` with the organization payload.
3. **With user**:
   - `userId` is required.
   - `POST organizations/create_or_update.json` to get the organization ID. Failure leads to `Couldn't create user membership for user having external id ... as Organization ... wasn't created`.
   - Find the user by `GET users/search.json?query={context.traits.email}`. If not found and `context.traits.name` and `context.traits.email` exist, create it with `POST users/create_or_update.json`. Otherwise `User not found`.
   - `GET users/{id}/organization_memberships.json`. If the first membership is this organization: `User is already associated with organization`.
   - Delivered request: `POST organization_memberships.json` with `{ organization_membership: { user_id, organization_id } }`.

Memberships are added, not replaced. A user can belong to several organizations.

### Track

1. `userId` and `traits.email` (or `context.traits.email`) are required.
2. `GET users/search.json?query={email}`. Non-2xx throws `NetworkError`.
3. If no user is returned, `POST users/create_or_update.json` with `name`, `email`, `external_id: userId` (and `verified` if configured).
4. `getSourceName` validates `sourceName`.
5. Delivered request: `POST users/{zendeskUserId}/events`.

## Example Payloads

### Track

Input:

```json
{
  "type": "track",
  "userId": "user-1",
  "event": "Order Completed",
  "properties": { "orderId": "o-1", "revenue": 20 },
  "context": { "traits": { "email": "jane@example.com", "name": "Jane" } }
}
```

Delivered request (`POST https://{domain}.zendesk.com/api/v2/users/{zendeskUserId}/events`):

```json
{
  "event": {
    "description": "Order Completed",
    "type": "Order Completed",
    "source": "Rudder",
    "properties": { "orderId": "o-1", "revenue": 20 }
  },
  "profile": {
    "type": "Order Completed",
    "source": "Rudder",
    "identifiers": [{ "type": "email", "value": "jane@example.com" }]
  }
}
```

### Identify

Input traits `{ "name": "Jane", "email": "jane@example.com", "plan": "pro" }`, `userId: "user-1"`, `createUsersAsVerified: true`.

`POST users/create_or_update.json` body:

```json
{
  "user": {
    "email": "jane@example.com",
    "name": "Jane",
    "external_id": "user-1",
    "user_fields": { "id": "user-1", "plan": "pro" },
    "verified": true
  }
}
```

### Group (with user)

Input `groupId: "org-1"`, `traits: { "name": "Acme", "tier": "gold" }`, `context.traits.email: "jane@example.com"`.

`POST organizations/create_or_update.json` (intermediate) body:

```json
{
  "organization": {
    "name": "Acme",
    "external_id": "org-1",
    "organization_fields": { "id": "org-1", "tier": "gold" }
  }
}
```

Delivered `POST organization_memberships.json` body:

```json
{ "organization_membership": { "user_id": 12345, "organization_id": 67890 } }
```

## Error Handling

| Situation                                                     | Result                                                                                       |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Validation failures                                           | `InstrumentationError` / `ConfigurationError` (aborted)                                      |
| `create_or_update` user fails (identify)                      | `NetworkError` with status from Zendesk; type from `getDynamicErrorType` (5xx/429 retryable) |
| User search fails (track)                                     | `NetworkError` with Zendesk status                                                           |
| User creation fails (track, group)                            | `NetworkInstrumentationError`, which track re-wraps as `NetworkError`                        |
| Organization create fails (group with user)                   | `NetworkInstrumentationError`                                                                |
| Identity update/delete fails (identify)                       | `NetworkError` from `util.js`                                                                |
| Identity lookup, field fetch/create, membership removal fails | Logged only, flow continues                                                                  |
| Delivered request fails (group, track)                        | Normal rudder-server retry/abort by status code                                              |

## Validations

- `userId`: required for identify, track and group (unless `sendGroupCallsWithoutUserId`).
- `traits.name`: required for identify, even though `create_or_update` on an existing user would not need it.
- Email: required for track; used to find the user for group membership and organization removal.
- `sourceName`: must not be `zendesk` (case-insensitive, trimmed).
- Object-valued traits are never sent as custom fields.

## General Use Cases

- Keep Zendesk Support user profiles (name, email, phone, timezone, custom user fields) in sync with product data so agents see context on tickets.
- Mirror accounts/companies as Zendesk organizations and maintain user memberships.
- Send product events (for example `Order Completed`) to the user's Zendesk event timeline for agent context.
