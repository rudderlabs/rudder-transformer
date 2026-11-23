# SendGrid Business Logic

## Identify (contacts upsert)

**Endpoint:** `PUT https://api.sendgrid.com/v3/marketing/contacts` (batched in the router)

Flow:

1. Require an email.
2. Build contact details from `data/SendgridIdentify.json`. Flatten `address_line_1` if it is an object.
3. Collect list IDs: `Config.listId` plus `context.externalId` of type `listIds` (string or array). Sort and comma-join them.
4. If `customFieldsMapping` is set, fetch `/v3/marketing/field_definitions` (cached) and set `custom_fields` as `{ <field_id>: <trait value> }` for mapped traits whose target field exists.
5. The router groups contacts by list-ID string and sends `{ list_ids: [...], contacts: [...] }` (or `{ contacts }` when there are no lists), up to 30,000 contacts per request.

### Mapping (`SendgridIdentify.json`)

| SendGrid field                                            | Source (generic map unless noted)           |
| --------------------------------------------------------- | ------------------------------------------- |
| `email`                                                   | `emailOnly` (required)                      |
| `phone_number`                                            | `phone`                                     |
| `first_name`, `last_name`                                 | `firstName`, `lastName`                     |
| `unique_name`                                             | `name`                                      |
| `city`, `state_province_region`, `country`, `postal_code` | `city`, `region`, `country`, `zipcode`      |
| `address_line_1`                                          | `address` (flattened)                       |
| `whatsapp`                                                | `traits.whatsappNumber`                     |
| `facebook`                                                | `traits.facebookUrl`                        |
| `custom_fields`                                           | Overwritten by `customFieldsMapping` lookup |

### Example output

```json
{
  "method": "PUT",
  "endpoint": "https://api.sendgrid.com/v3/marketing/contacts",
  "headers": { "Content-Type": "application/json", "Authorization": "Bearer <apiKey>" },
  "body": {
    "JSON": {
      "list_ids": ["list-1"],
      "contacts": [
        { "email": "a@example.com", "first_name": "A", "custom_fields": { "e1_T": "pro" } }
      ]
    }
  }
}
```

## Track (mail send)

**Endpoint:** `POST https://api.sendgrid.com/v3/mail/send`

Flow:

1. Require `event`, and it must be in `eventNamesSettings`.
2. Map properties with `data/SendgridTrack.json`.
3. If no `personalizations` and `mailFromTraits` is on, build `[{ to: [{ email: traits.email }] }]`; else throw.
4. Fill missing `from`, `template_id`, `attachments`, `content`, `subject`, `reply_to` from config.
5. Validate: `template_id` or `content`; `personalizations`; `from.email`.
6. Add `asm` (group / groups to display), `ip_pool_name`, `mail_settings`, `tracking_settings` from config. `properties.mailSettings` can override mail settings.
7. If `custom_args` is not set, use the remaining properties (excluding mail fields) as `custom_args`.
8. `payloadValidator` cleans and validates personalizations and other fields.

### Mapping (`SendgridTrack.json`)

| SendGrid field     | Source                        |
| ------------------ | ----------------------------- |
| `personalizations` | `properties.personalizations` |
| `from`             | `properties.from`             |
| `reply_to`         | `properties.replyTo`          |
| `reply_to_list`    | `properties.replyToList`      |
| `subject`          | `properties.subject`          |
| `content`          | `properties.content`          |
| `attachments`      | `properties.attachments`      |
| `template_id`      | `properties.templateId`       |
| `headers`          | `properties.headers`          |
| `categories`       | `properties.categories`       |
| `custom_args`      | `properties.customArgs`       |
| `send_at`          | `properties.sendAt`           |
| `batch_id`         | `properties.batchId`          |

## User Deletion

See README. `DELETE /v3/marketing/contacts?ids=<comma-separated userIds>`, chunked by URL length (8,150 chars). Any non-2xx throws `NetworkError`. SendGrid processes deletion asynchronously (202 with `job_id`).

## Error Handling

- Missing `apiKey`: `ConfigurationError`.
- Event not in `eventNamesSettings`: `ConfigurationError` ("Event not configured on dashboard").
- Missing fields: `InstrumentationError`.
- Field definitions fetch failure: `NetworkError` with SendGrid's first error message and status.
- Delivery: server default HTTP handling (no proxy).

## Use Cases

- Keep SendGrid Marketing Campaigns contacts and lists in sync.
- Send transactional emails (with templates) triggered by product events.
