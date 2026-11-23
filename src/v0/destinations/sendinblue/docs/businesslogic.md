# Sendinblue (Brevo) Business Logic and Mappings

## Overview

Every event is transformed independently (no batching). Identify events go to the Brevo v3 contacts API with the `api-key` header. Track and page events go to the v2 tracker (`in-automate.sendinblue.com`) with the `ma-key` header (`clientKey`). Payloads are cleaned with `removeUndefinedAndNullValues(removeEmptyKey(...))`.

## API Endpoints and Request Flow

### Identify Events

```
identify
├── doi = false
│   ├── sendinblueUnlinkListIds present → POST /v3/contacts/lists/{listId}/contacts/remove (one per list)
│   └── otherwise                       → POST /v3/contacts            (create or update)
└── doi = true
    ├── GET /v3/contacts/{email|contactId}
    ├── 200 → PUT  /v3/contacts/{email|contactId}                    (update)
    └── 404 → POST /v3/contacts/doubleOptinConfirmation              (DOI create)
```

#### Create or update contact (`POST /v3/contacts`)

Mapping: `data/SendinblueCreateOrUpdateContactConfig.json`

| RudderStack field                              | Brevo field            | Notes                                          |
| ---------------------------------------------- | ---------------------- | ---------------------------------------------- |
| email (generic `emailOnly`)                    | `email`                |                                                |
| traits (all, except name/phone/email/newEmail) | `attributes.*`         | Renamed via `contactAttributeMapping`          |
| `traits.newEmail` / `context.traits.newEmail`  | `attributes.EMAIL`     | Changes the contact's email                    |
| phone                                          | `attributes.SMS`       |                                                |
| firstName                                      | `attributes.FIRSTNAME` |                                                |
| lastName                                       | `attributes.LASTNAME`  |                                                |
| `sendinblueIncludeListIds` external ID (array) | `listIds`              |                                                |
| `integrations.sendinblue.emailBlacklisted`     | `emailBlacklisted`     |                                                |
| `integrations.sendinblue.smsBlacklisted`       | `smsBlacklisted`       |                                                |
| (constant)                                     | `updateEnabled: true`  | Brevo updates the contact if it already exists |

Validations: email or phone required; email and `newEmail` must be valid emails; phone must include a country code.

#### Unlink contact from lists

- Identifier priority: email, then phone (converted to `<digits>@mailin-sms.com`) sent as `emails: [...]`; otherwise `sendinblueContactId` sent as `ids: [...]`.
- One request per list ID in `sendinblueUnlinkListIds`.

#### DOI create (`POST /v3/contacts/doubleOptinConfirmation`)

Mapping: `data/SendinblueCreateDOIContactConfig.json` (email required, attributes as above, no `newEmail`).

- `templateId`: `sendinblueDOITemplateId` external ID, else `Config.templateId`; parsed as integer.
- `redirectionUrl`: `Config.redirectionUrl`.
- `includeListIds`: `sendinblueIncludeListIds` (required).
- `contactAttributeMapping` is applied to `attributes`.

#### DOI update (`PUT /v3/contacts/{identifier}`)

Mapping: `data/SendinblueUpdateDOIContactConfig.json`.

- Identifier is the URL-encoded email, else `sendinblueContactId`.
- `listIds` from `sendinblueIncludeListIds`, `unlinkListIds` from `sendinblueUnlinkListIds`.
- `emailBlacklisted` / `smsBlacklisted` from the integrations object.
- `contactAttributeMapping` is NOT applied on this path (attributes are sent with their trait names).

### Track Events

#### `trackLink` (event name `trackLink`, case-insensitive) → `POST /api/v2/trackLink`

| RudderStack field                | Brevo field  |
| -------------------------------- | ------------ |
| email (`emailOnly`)              | `email`      |
| `properties.link` (required)     | `link`       |
| `properties` (minus email, link) | `properties` |

If email is missing, it is built from phone (`<digits>@mailin-sms.com`).

#### Other events → `POST /api/v2/trackEvent`

| RudderStack field                                    | Brevo field                                        |
| ---------------------------------------------------- | -------------------------------------------------- |
| email (`emailOnly`)                                  | `email` (else built from phone)                    |
| `event` (required)                                   | `event`                                            |
| `context.traits`, firstName, lastName, phone, traits | `properties` (`FIRSTNAME`, `LASTNAME`, `SMS`, ...) |
| `properties`                                         | `eventdata.data`                                   |
| `properties[propertiesIdKey]` or `messageId`         | `eventdata.id`                                     |

- `properties` (contact traits) is only sent when `sendTraitsInTrack` is enabled, after applying `contactAttributeMapping`.
- `eventdata` is empty (`{}`, then removed) when the event has no properties.

### Page Events → `POST /api/v2/trackPage`

| RudderStack field                                                          | Brevo field               |
| -------------------------------------------------------------------------- | ------------------------- |
| email (`emailOnly`)                                                        | `email` (else from phone) |
| `properties.url` / `context.page.url` (required)                           | `page`                    |
| `properties.ma_title` / `properties.title` / `context.page.title`          | `properties.ma_title`     |
| `properties.ma_path` / `properties.path` / `context.page.path`             | `properties.ma_path`      |
| `properties.ma_referrer` / `properties.referrer` / `context.page.referrer` | `properties.ma_referrer`  |
| `name` / `properties.name` (default `Page View`)                           | `properties.sib_name`     |
| remaining `properties` (minus title, url, path, referrer, name, email)     | `properties.*`            |

## Example Payload

Input (identify, `doi: false`):

```json
{
  "type": "identify",
  "traits": {
    "email": "jane@example.com",
    "phone": "+14155550100",
    "firstName": "Jane",
    "area_code": "415"
  },
  "context": { "externalId": [{ "type": "sendinblueIncludeListIds", "id": [1, 2] }] }
}
```

Output (with `contactAttributeMapping: [{ "from": "area_code", "to": "AREA" }]`):

```json
{
  "endpoint": "https://api.sendinblue.com/v3/contacts",
  "method": "POST",
  "headers": { "Content-Type": "application/json", "api-key": "<apiKey>" },
  "body": {
    "JSON": {
      "email": "jane@example.com",
      "attributes": { "SMS": "+14155550100", "FIRSTNAME": "Jane", "AREA": "415" },
      "updateEnabled": true,
      "listIds": [1, 2]
    }
  }
}
```

## Error Handling

- Missing/invalid input (type, email, phone, template ID, list IDs, event name, page URL) → `InstrumentationError` (400, aborted).
- DOI contact lookup returning anything other than 200 or 404 → `NetworkError` with the status-based error type (5xx/429 retried, other 4xx aborted).
- Delivery errors are handled by rudder-server's default status-code handling (no proxy).

## General Use Cases

- Keep Brevo contacts and list membership in sync with product sign-ups and profile changes.
- Collect double opt-in consent before adding contacts to marketing lists.
- Trigger Brevo automations from product events, link clicks and page views.
