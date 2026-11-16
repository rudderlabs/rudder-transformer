# LinkedIn Audience Business Logic and Mappings

## Overview

VDM v2 `record` events from warehouse sources add or remove members of a LinkedIn DMP segment (matched audience). The audience type in the connection config decides between user and company matching.

## Flow (`transform.ts` → `processRouterDest`)

1. Validate each event with Zod (`LinkedinAudienceRouterRequestSchema`). Failures become per-event errors.
2. Build the element payload for `audienceType` `user` or `company` (any other value → `ConfigurationError`).
3. Group payloads by action (`ADD` / `REMOVE`). `audienceId`, `audienceType` and the access token for the group are taken from the first event in that group.
4. Chunk each group by 5000 and build one `POST` per chunk with body `{ elements: [...] }`.

NEEDS REVIEW: grouping is by action only, not by connection/audience. If one router batch carried records for two connections of the same destination with different `audienceId`s, they would be sent to the first event's audience.

## Endpoints and Headers

| Audience type | Endpoint                                                                |
| ------------- | ----------------------------------------------------------------------- |
| `user`        | `POST https://api.linkedin.com/rest/dmpSegments/{audienceId}/users`     |
| `company`     | `POST https://api.linkedin.com/rest/dmpSegments/{audienceId}/companies` |

Headers: `Authorization: Bearer <accessToken>`, `Content-Type: application/json`, `X-RestLi-Method: BATCH_CREATE`, `X-Restli-Protocol-Version: 2.0.0`, `LinkedIn-Version: 202603`.

## Field Mappings

### Action

| Record `action` | LinkedIn `action` |
| --------------- | ----------------- |
| `insert`        | `ADD`             |
| `update`        | `ADD`             |
| `delete`        | `REMOVE`          |

### User audiences

| Record identifier | LinkedIn `userIds[].idType` | Processing when `isHashRequired: true`                     |
| ----------------- | --------------------------- | ---------------------------------------------------------- |
| `sha256Email`     | `SHA256_EMAIL`              | Remove whitespace, lowercase, validate email, SHA-256 hash |
| `sha512Email`     | `SHA512_EMAIL`              | Remove whitespace, lowercase, validate email, SHA-512 hash |
| `googleAid`       | `GOOGLE_AID`                | Trim; never hashed                                         |

With `isHashRequired: false`, email values must look hashed (64/128 hex chars) and are passed through unchanged.

`fields` (non-null) are spread onto the element as-is, so VDM field names must match LinkedIn's element fields (`firstName`, `lastName`, `title`, `company`, `country`).

### Company audiences

Non-null `identifiers` (`companyName`, `organizationUrn`, `companyWebsiteDomain`, `companyEmailDomain`, `companyPageUrl`) and non-null `fields` are spread onto the element as-is.

## Example

Input record (user audience, `isHashRequired: true`):

```json
{
  "message": {
    "type": "record",
    "action": "insert",
    "identifiers": { "sha256Email": "Alice@Example.com " },
    "fields": { "firstName": "Alice", "lastName": "Doe" }
  },
  "connection": {
    "config": {
      "destination": { "audienceId": "32589526", "audienceType": "user", "isHashRequired": true }
    }
  }
}
```

Output body:

```json
{
  "elements": [
    {
      "action": "ADD",
      "userIds": [{ "idType": "SHA256_EMAIL", "idValue": "<sha256(alice@example.com)>" }],
      "firstName": "Alice",
      "lastName": "Doe"
    }
  ]
}
```

## Error Handling

- Schema validation failures, invalid identifier keys, hashing inconsistencies, and records with no usable identifier → `InstrumentationError` for that record.
- Unsupported `audienceType` → `ConfigurationError`.
- No proxy: LinkedIn responses are handled by rudder-server's generic HTTP handling, so a batch fails or succeeds as a whole. LinkedIn may return per-element statuses in the response body; they are not mapped back to jobs.

## Use Cases

Sync customer or account lists from the warehouse into LinkedIn matched audiences for ad targeting and exclusion.
