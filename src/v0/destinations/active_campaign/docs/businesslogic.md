# ActiveCampaign Business Logic and Mappings

## Overview

All v3 calls go to `${Config.apiUrl}/api/3/...` with headers `Api-Token: <apiKey>` and `Content-Type: application/json`. Track and screen events go to `https://trackcmp.net/event` as `application/x-www-form-urlencoded`.

## Field Mappings

### Identify (`data/ACIdentify.json`)

| RudderStack field                               | ActiveCampaign field  | Notes    |
| ----------------------------------------------- | --------------------- | -------- |
| `traits.email` / `context.traits.email`         | `contact.email`       | Required |
| `phone` (traits / context.traits)               | `contact.phone`       |          |
| `firstName` (traits / context.traits)           | `contact.firstName`   |          |
| `lastName` (traits / context.traits)            | `contact.lastName`    |          |
| `traits.tags` / `context.traits.tags` (array)   | contact tags          | See flow |
| `traits.lists` / `context.traits.lists`         | list status           | See flow |
| `traits.fieldInfo` / `context.traits.fieldInfo` | `contact.fieldValues` | See flow |

### Page (`data/ACPage.json`)

| RudderStack field                                                                                                             | ActiveCampaign field      | Notes                         |
| ----------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ----------------------------- |
| `properties.domain` → `properties.url` → `context.page.url` → `properties.referring_domain` → `context.page.referring_domain` | `siteTrackingDomain.name` | Required, first match is used |

### Track and Screen (`data/ACTrack.json`, `data/ACScreen.json`)

| RudderStack field           | ActiveCampaign field | Notes                                             |
| --------------------------- | -------------------- | ------------------------------------------------- |
| `event` → `properties.name` | `event`              | Required                                          |
| `properties.name`           | `eventdata`          | Overridden by `properties.eventData` when present |
| `Config.actid`              | `actid`              |                                                   |
| `Config.eventKey`           | `key`                |                                                   |
| `context.traits.email`      | `visit`              | Sent as the string `{"email":"<email>"}`          |

## Request Flow per Event Type

### Identify

1. Build the contact (`email`, `phone`, `firstName`, `lastName`) and `POST /api/3/contact/sync`. The returned `contact.id` is used in the next steps. A failure raises a `NetworkError`.
2. **Tags** (only if `tags` is an array):
   - `GET /api/3/tags?limit=100`, then more pages with `offset` when `meta.total > 100`.
   - `POST /api/3/tags` (`tagType: "contact"`) for each tag that does not exist.
   - `POST /api/3/contactTags` with `{ contact, tag }` for every tag.
3. **Lists** (`lists` is an object or an array of `{ id, status }`): for each entry whose `status` is `subscribe` or `unsubscribe`, `POST /api/3/contactLists` with `status` `1` (subscribe) or `2` (unsubscribe). Other statuses are ignored.
4. **Custom fields** (`fieldInfo` is an object of `{ <field title>: <value> }`):
   - `GET /api/3/fields?limit=100`, then more pages with `offset`.
   - Keys whose title matches an existing field become `{ field: <id>, value }`. Array values are joined as `||a||b||`. Keys that do not match are dropped.
5. Return the final request `POST /api/3/contact/sync` with `{ contact: { ...contact, fieldValues } }`. The contact is synced twice: once during transformation (step 1) and once at delivery.

```json
{
  "contact": {
    "email": "jamesDoe@gmail.com",
    "phone": "92374162212",
    "firstName": "James",
    "lastName": "Doe",
    "fieldValues": [
      { "field": "0", "value": "foo" },
      { "field": "1", "value": "||bar||baz||" }
    ]
  }
}
```

### Page

Build `{ siteTrackingDomain: { name } }` and return `POST /api/3/siteTrackingDomains`. No intermediate calls.

```json
{ "siteTrackingDomain": { "name": "https://www.rudderlabs.com" } }
```

### Track and Screen

1. `GET /api/3/eventTrackingEvents` to list registered event names.
2. If `message.event` is not in the list, `POST /api/3/eventTrackingEvents` with `{ eventTrackingEvent: { name } }`. A non-201 response raises a `NetworkError`.
3. Return the final form-encoded request to `https://trackcmp.net/event`:

```text
event=Product Viewed&eventdata=Shirt&actid=<actid>&key=<eventKey>&visit={"email":"jamesDoe@gmail.com"}
```

NEEDS REVIEW: step 1 calls `eventTrackingEvents` without `limit` or `offset`, so only the first page of event names (ActiveCampaign's default page size) is compared. An event that already exists outside that page is created again, and the create call may fail.

## Error Handling

- Intermediate call failures go through `errorHandler` (`util.js`), which throws a `NetworkError` with the response status and a dynamic error type (retryable for 5xx, throttled for 429, aborted for other 4xx).
- A 2xx status on an error path (unexpected body, such as an HTML login page) becomes a 500 so the event is retried, not dropped.
- Unsupported message types throw `InstrumentationError: Message type not supported`.
- Missing `message.type` throws `InstrumentationError: Message Type is not present. Aborting message.`

## Validations

| Check                             | Error                                             |
| --------------------------------- | ------------------------------------------------- |
| `message.type` missing            | `Message Type is not present. Aborting message.`  |
| Identify without email            | Missing required value (mapping `required: true`) |
| Page without a domain/url field   | Missing required value (mapping `required: true`) |
| Track/Screen without `event`      | Missing required value (mapping `required: true`) |
| Contact sync returns no `contact` | `Failed to create new contact`                    |

## Use Cases

- Keep ActiveCampaign contacts in sync with user traits, tags, list subscriptions and custom fields.
- Register website domains for site tracking.
- Record product events to trigger ActiveCampaign automations.
