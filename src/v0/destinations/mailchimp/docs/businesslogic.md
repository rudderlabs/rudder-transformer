# Mailchimp Business Logic and Mappings

## Overview

Identify events add or update audience members; track events record member events. All requests use `Authorization: Basic base64("apiKey:<apiKey>")` and `https://<datacenterId>.api.mailchimp.com/3.0/lists/{listId}`. The member path uses `md5(email)` as the subscriber hash.

The list ID comes from `integrations.MailChimp.listId`, then `context.MailChimp.listId` (legacy), then `Config.audienceId`.

## Identify

### Event stream flow

1. Read email (generic `email` lookup); fail if missing.
2. Map merge fields (`mailchimpMergeFieldConfig.json`) and address (`mailchimpMergeAddressConfig.json`); validate address.
3. Build `{ email_address }`. If `enableMergeFields` is `true`, add `merge_fields` (mapped fields plus remaining traits as merge tags).
4. `GET .../members/{md5(email)}` to check existence and status.
5. Status:
   - New member: `GET /lists/{listId}`; `double_optin: true` → `pending`, else `subscribed`.
   - Existing member: `integrations.MailChimp.subscriptionStatus` if set (validated), else the current status (default `subscribed`).
6. Single-event output: `PUT .../members/{md5(email)}`.

### Router batching

Identify outputs are grouped by list ID and chunked by 500 into:

```
POST https://<dc>.api.mailchimp.com/3.0/lists/{listId}?skip_merge_validation=<enableMergeFields>&skip_duplicate_check=false
{ "members": [ ...member bodies... ], "update_existing": true }
```

`skip_merge_validation` defaults to `false` when `enableMergeFields` is unset.

### Merge field mappings

| RudderStack                                                                                            | Mailchimp                                                               |
| ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| email (generic: `traits.email`, `context.traits.email`, `properties.email`, `context.externalId.0.id`) | `email_address`                                                         |
| `firstName` (generic)                                                                                  | `merge_fields.FNAME`                                                    |
| `lastName` (generic)                                                                                   | `merge_fields.LNAME`                                                    |
| `phone` (generic)                                                                                      | `merge_fields.PHONE`                                                    |
| `traits.birthday` / `context.traits.birthday`                                                          | `merge_fields.BIRTHDAY`                                                 |
| `addressLine1` / `address.addressLine1` / `merge_fields.ADDRESS.addr1`                                 | `merge_fields.ADDRESS.addr1`                                            |
| `addressLine2` / `address.addressLine2` / `merge_fields.ADDRESS.addr2`                                 | `merge_fields.ADDRESS.addr2`                                            |
| `city` / `address.city` / `merge_fields.ADDRESS.city`                                                  | `merge_fields.ADDRESS.city`                                             |
| `state` / `address.state` / `merge_fields.ADDRESS.state`                                               | `merge_fields.ADDRESS.state`                                            |
| `zip` / `address.zip` / `merge_fields.ADDRESS.zip`                                                     | `merge_fields.ADDRESS.zip`                                              |
| `country` / `address.country` / `merge_fields.ADDRESS.country`                                         | `merge_fields.ADDRESS.country`                                          |
| any other trait (when `enableMergeFields`)                                                             | `merge_fields.<TAG>` (non-word chars removed, uppercased, max 10 chars) |

Address paths are read from both `traits.*` and `context.traits.*`. Traits excluded from the extra merge tags: `email`, `firstName`/`lastName` variants, `addr1`, `city`, `state`, `zip`, `phone`, `address`, `addressLine1`, `addressLine2`, `birthday`.

NEEDS REVIEW: the email is hashed with `md5(email)` without lowercasing. Mailchimp's subscriber hash is the MD5 of the lowercase email, so mixed-case emails may target a different member hash.

### rETL identify

See [retl.md](retl.md). Traits are forwarded as the member body with no lookups.

## Track

`POST https://<dc>.api.mailchimp.com/3.0/lists/{listId}/members/{md5(email)}/events`

| RudderStack                       | Mailchimp     | Notes                                                       |
| --------------------------------- | ------------- | ----------------------------------------------------------- |
| `event`                           | `name`        | Required, 2–30 characters, whitespace replaced with `_`     |
| `properties`                      | `properties`  | Non-string values are JSON-stringified; `isSyncing` removed |
| `properties.isSyncing`            | `is_syncing`  |                                                             |
| `timestamp` / `originalTimestamp` | `occurred_at` | Formatted `YYYY-MM-DDTHH:mm:ssZ`                            |

## Example

Identify input:

```json
{
  "type": "identify",
  "traits": { "email": "alice@example.com", "firstName": "Alice", "plan": "pro" },
  "integrations": { "MailChimp": { "subscriptionStatus": "subscribed" } }
}
```

Member body (with `enableMergeFields: true`, existing member):

```json
{
  "email_address": "alice@example.com",
  "merge_fields": { "FNAME": "Alice", "PLAN": "pro" },
  "status": "subscribed"
}
```

## Error Handling

- Missing config → `ConfigurationError`.
- Missing email, invalid status, invalid address, invalid event name → `InstrumentationError`.
- Failed double opt-in lookup → `NetworkError` with Mailchimp's status.
- A failed member lookup is treated as "member does not exist".
- No proxy: batch responses (including per-member `errors` in the batch subscribe response) are not mapped back to individual jobs. NEEDS REVIEW.

## Use Cases

Keep Mailchimp audiences in sync with user profiles and subscription status; record behavioural events for automations and segmentation.
