# Userpilot Business Logic and Mappings

## Overview

Each event maps to one `POST` request. Headers are the same for all types (see the README).
`removeUndefinedAndNullValues` is applied to `metadata` and to the final body.

## Identify

**Endpoint**: `POST {apiEndpoint}/v1/identify`

| Source                                                                | Destination | Notes                                       |
| --------------------------------------------------------------------- | ----------- | ------------------------------------------- |
| `userId`                                                              | `user_id`   | Required                                    |
| `context.traits` (fallback `traits`), with `createdAt` → `created_at` | `metadata`  | All traits, including `company`             |
| `traits.company` (from the same traits object)                        | `company`   | Only when `company.id` is set, else omitted |

Traits come from `context.traits` first. If `context.traits` exists, top-level `traits` is ignored.

```json
// input
{ "type": "identify", "userId": "u1",
  "context": { "traits": { "name": "Ann", "createdAt": "2024-01-01", "company": { "id": "c1", "name": "Acme" } } } }
// output body
{ "user_id": "u1",
  "company": { "id": "c1", "name": "Acme" },
  "metadata": { "name": "Ann", "created_at": "2024-01-01", "company": { "id": "c1", "name": "Acme" } } }
```

## Track

**Endpoint**: `POST {apiEndpoint}/v1/track`

| Source       | Destination  | Notes    |
| ------------ | ------------ | -------- |
| `userId`     | `user_id`    | Required |
| `event`      | `event_name` | Required |
| `properties` | `metadata`   | As is    |

## Group

**Endpoint**: `POST {apiEndpoint}/v1/companies/identify`

| Source                                    | Destination  | Notes    |
| ----------------------------------------- | ------------ | -------- |
| `groupId`                                 | `company_id` | Required |
| `traits`, with `createdAt` → `created_at` | `metadata`   |          |

`group` does not link the user to the company. Users are linked to companies through `company` on identify.

## Error Handling

All validation failures are instrumentation errors raised by `$.assert`. Partner HTTP errors are handled by
rudder-server (no proxy).

## Notes

- Userpilot documents that metadata values must be primitives. The code passes nested objects (for example
  `metadata.company` on identify, or nested `properties` on track) unchanged. **NEEDS REVIEW**: confirm
  how Userpilot treats nested metadata values.
- Identify reads traits from `context.traits` before `traits` and does not merge them.

## General Use Cases

- Keep Userpilot user and company profiles in sync for in-app flow targeting.
- Send product events for Userpilot analytics and flow triggers.
