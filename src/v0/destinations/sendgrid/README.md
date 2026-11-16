# SendGrid Destination

Implementation in **JavaScript** (v0, not CDK v2). Code: `src/v0/destinations/sendgrid/`.

## Overview

- `identify` upserts Marketing Campaigns contacts (optionally into lists), batched.
- `track` sends a transactional email with the v3 Mail Send API.
- User deletion deletes Marketing Campaigns contacts.

## Configuration

Config keys used in code (all from `db-config.json` `destConfig.defaultConfig`):

| Config key                                                                                | Used for                                                                                  |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `apiKey`                                                                                  | `Authorization: Bearer` header. Required (`Invalid Api Key` if missing). In `secretKeys`. |
| `listId`                                                                                  | Default contact list for identify.                                                        |
| `customFieldsMapping`                                                                     | Trait name to SendGrid custom field name (identify).                                      |
| `eventNamesSettings`                                                                      | Allowed track event names. Events not listed are rejected.                                |
| `mailFromTraits`                                                                          | Build `personalizations` from `traits.email` when the event has none.                     |
| `fromEmail`, `fromName`                                                                   | Default `from` if the event has none.                                                     |
| `templateId`, `subject`, `contents`, `attachments`                                        | Default template, subject, content, attachments.                                          |
| `replyToEmail`, `replyToName`                                                             | Default `reply_to`.                                                                       |
| `IPPoolName`                                                                              | `ip_pool_name` (2 to 64 chars).                                                           |
| `group`, `groupsToDisplay`                                                                | `asm.group_id`, `asm.groups_to_display` (unsubscribe groups).                             |
| `footer`, `footerText`, `footerHtml`, `sandboxMode`                                       | `mail_settings`.                                                                          |
| `clickTracking`, `clickTrackingEnableText`, `openTracking`, `openTrackingSubstitutionTag` | `tracking_settings`.                                                                      |
| `subscriptionTracking`, `text`, `html`, `substitutionTag`                                 | `tracking_settings.subscription_tracking`.                                                |
| `ganalytics`, `utmSource`, `utmMedium`, `utmTerm`, `utmContent`, `utmCampaign`            | `tracking_settings.ganalytics`.                                                           |

`schema.json` declares only consent fields; none of the above are schema-validated. NEEDS REVIEW.

## Integration Functionalities

### Supported Message Types

From `db-config.json`: `cloud: ["track", "identify"]`.

### Authentication

`Authorization: Bearer <apiKey>` on every call (mail send, contacts upsert, field definitions, contact deletion). SendGrid v3 API keys do not expire. No OAuth.

SendGrid retired username/password (Basic) auth for the v3 API years ago; Bearer API keys are the current method and no deprecation of them was found. Related platform changes:

- **EU data residency (April 2024):** EU regional subusers must call `https://api.eu.sendgrid.com`. The code only uses `https://api.sendgrid.com`, so EU subusers are not supported. ([announcement](https://www.twilio.com/en-us/changelog/introducing-regional-email-sending-eu-for-twilio-sendgrid), [FAQ](https://www.twilio.com/docs/sendgrid/data-residency/faq))
- **Free plan retirement (May 27, 2025):** Free Email API and Free Marketing Campaigns plans were retired with a 60-day window; affected accounts stop sending. Not an API change, but customers on free plans would see failures. ([changelog](https://www.twilio.com/en-us/changelog/sendgrid-free-plan))
- **TLS cipher update (deadline February 18, 2027)** for Twilio REST endpoints. Node's default TLS should be unaffected. NEEDS REVIEW. ([Twilio changelog](https://www.twilio.com/en-us/changelog))

### Validations

- `apiKey` required.
- **identify**: email required (generic `email` lookup: `traits.email`, `context.traits.email`, `properties.email`, `context.externalId.0.id`). The mapped `email` field itself uses `emailOnly`, which excludes the externalId fallback.
- **track**: `event` required and must be in `eventNamesSettings`. After merging config defaults: `template_id` or `content` required; `personalizations` required (or built from traits when `mailFromTraits` is on); `from.email` required.

### Rate Limits

SendGrid sets per-endpoint limits returned in `X-RateLimit-*` headers and responds 429 when exceeded; exact numbers are not published per endpoint. The contacts upsert accepts up to 30,000 contacts or 6 MB per request.

### Batching Support

- **identify**: Yes. Grouped by the sorted, comma-joined list IDs, chunked to 30,000 contacts (`MAX_BATCH_SIZE`). One `PUT /v3/marketing/contacts` per chunk. The 6 MB size limit is not enforced in code.
- **track**: No. One mail send per event.

### Intermediate Calls

- **identify**, when `customFieldsMapping` is set: `GET https://api.sendgrid.com/v3/marketing/field_definitions` to resolve custom field names to IDs. Cached per destination ID (`AUTH_CACHE_TTL`).

### Proxy Delivery

**No.** No `networkHandler.js`.

### User Deletion

**Yes.** `src/v0/destinations/sendgrid/deleteUsers.js` (`regulations: true` in `features.ts`).

- `DELETE https://api.sendgrid.com/v3/marketing/contacts?ids=<id1,id2,...>`, Bearer `apiKey`.
- Uses `userId` from each user attribute as the contact ID. Users without `userId` are skipped.
- IDs are chunked so the comma-joined list stays under 8,150 characters (to avoid HTTP 414).
- SendGrid contact IDs are SendGrid-generated, not the customer's `userId`. Deletion only works if they match. NEEDS REVIEW.

### OAuth Support

**No.**

### Processor vs Router

**Router** (`transformAtV1: "router"`).

## General Queries

### Event Ordering

- **identify**: Matters. Upserts overwrite contact fields. Batching groups contacts by list combination, so a user's events can land in different batches. SendGrid also processes contact upserts asynchronously (returns a `job_id`).
- **track**: Not required; each event sends an email.

### Data Replay Feasibility

- **identify**: Missing data can be replayed (upsert by email). Already-delivered data is idempotent except for overwriting newer values.
- **track**: Replay sends the email again. Not safe for already-delivered data.

### Multiplexing

**No.**

## Known Issues

NEEDS REVIEW for each.

1. **Deletion URL inconsistency** (`deleteUsers.js`): full chunks use `.replace('[IDS]', ids)` giving `?ids=a,b`, but the last chunk uses `.replace('IDS', ids)`, leaving brackets: `?ids=[a,b]`. SendGrid documents `ids` as a comma-separated list. The test fixtures in `test/integrations/destinations/sendgrid/network.ts` mock the bracketed URL, so tests pass either way.
2. **Router double-processing**: in `processRouterDest`, an event with `message.statusCode` is pushed to the success list but is not skipped, so it is also transformed again.
3. `traits.customFields` maps to `custom_fields`, but the value is then overwritten by the `customFieldsMapping` lookup, so `traits.customFields` has no effect.

## Version Information

### Current Version

SendGrid **Web API v3** (`https://api.sendgrid.com/v3`, from `config.js`).

### Version Deprecation

v3 has no announced end-of-life. The older v2 Mail Send API had its recipient limit cut to 1,000 per request from July 9, 2025; this integration does not use v2.

### Latest Available Version

v3 is the latest version.

## Documentation Links

- [Mail Send](https://www.twilio.com/docs/sendgrid/api-reference/mail-send/mail-send)
- [Add or update contacts](https://www.twilio.com/docs/sendgrid/api-reference/contacts/add-or-update-a-contact)
- [Delete contacts](https://www.twilio.com/docs/sendgrid/api-reference/contacts/delete-contacts)
- [Get field definitions](https://www.twilio.com/docs/sendgrid/api-reference/custom-fields/get-all-field-definitions)
- [Rate limits](https://www.twilio.com/docs/sendgrid/api-reference/how-to-use-the-sendgrid-v3-api/rate-limits)
- [EU data residency FAQ](https://www.twilio.com/docs/sendgrid/data-residency/faq)

### Changelog References

- [Twilio changelog, SendGrid filter](https://www.twilio.com/en-us/changelog?product=SendGrid)
- [Twilio changelog (all products)](https://www.twilio.com/en-us/changelog)
- No dedicated SendGrid deprecations page or RSS feed found. NEEDS REVIEW.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ
