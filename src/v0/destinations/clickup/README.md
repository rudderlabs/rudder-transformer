# ClickUp Destination

ClickUp is a work management tool. This destination creates a ClickUp task in a list for each RudderStack `track` event.

Implementation: `src/v0/destinations/clickup/` (JavaScript, v0).

## Configuration

### Required Settings

| Config key | UI label  | Description                                                           |
| ---------- | --------- | --------------------------------------------------------------------- |
| `apiToken` | API Token | ClickUp personal API token (`pk_...`). Secret.                        |
| `listId`   | List ID   | Default list in which tasks are created. Can be overridden per event. |

### Optional Settings

| Config key             | Description                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| `keyToCustomFieldName` | Array of `{ from, to }`: event property name → ClickUp custom field name in the list.      |
| `whitelistedEvents`    | Array of `{ eventName }`. If non-empty, only these events (case-insensitive) create tasks. |

## Integration Functionalities

### Implementation

- **Language**: JavaScript (`transform.js`, `util.js`, `config.js`, mapping in `data/ClickUpTrackConfig.json`).
- **Processor vs Router**: Router destination (`transformAtV1: "router"`, `CLICKUP: { routerTransform: true }` in `src/features.ts`).

### Supported Message Types

| Type    | Supported |
| ------- | --------- |
| `track` | Yes       |
| others  | No        |

Supported sources: android, androidKotlin, ios, iosSwift, web, unity, amp, cloud, reactnative, flutter, cordova, warehouse, shopify. Cloud mode only.

### Authentication

Headers built by the code (task create and custom field lookup):

```
Content-Type: application/json
Authorization: <Config.apiToken>
```

The raw token is sent with no prefix, which is the documented format for ClickUp personal tokens. ClickUp says personal tokens never expire and OAuth access tokens "currently" do not expire but this "is subject to change". No dated auth change or deprecation was found ([ClickUp authentication](https://developer.clickup.com/docs/authentication), last updated 2026-03-13).

### Batching Support

None. ClickUp has no bulk task create endpoint in v2.

### Intermediate Calls

| When                                                   | Call                                                     | Why                                                                           |
| ------------------------------------------------------ | -------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `keyToCustomFieldName` is set and event has properties | `GET https://api.clickup.com/api/v2/list/{listId}/field` | Resolve custom field names to field IDs, types and dropdown/label option IDs. |

The lookup runs for every such event; results are not cached.

### Proxy Delivery

Not supported (no `networkHandler.js`).

### User Deletion

Not supported.

### OAuth Support

No. Uses a personal API token.

### Additional Functionalities

- **Per-event list**: `context.externalId` of type `clickUpListId` overrides `Config.listId`.
- **Assignees**: every `context.externalId` of type `clickUpAssigneeId` is added to `assignees`.
- **Custom fields**: values are validated and converted by field type (dropdown, labels, location, date, phone, email, url, emoji rating).
- **Event allowlist** via `whitelistedEvents`.

### Validations

- `properties.priority`: integer 1 to 4.
- Custom field `phone`: must match `^\+(?:[\d{] ?){6,14}\d$`.
- Custom field `email`: valid email. `url`: `http(s)://` URL. `location`: lat in [-90, 90], lng in [-180, 180]. `emoji` (rating): 0 to the field's `count`.
- Task `name` is required (`properties.taskName` or `event`).

### Rate Limits

Per token, by Workspace plan ([ClickUp rate limits](https://developer.clickup.com/docs/rate-limits)):

| Plan                              | Requests per minute |
| --------------------------------- | ------------------- |
| Free Forever, Unlimited, Business | 100                 |
| Business Plus                     | 1,000               |
| Enterprise                        | 10,000              |

Each event with custom fields costs two requests.

## General Queries

### Event Ordering

Not required. Each event creates a new task; there are no updates.

### Data Replay Feasibility

- **Missing data**: Can be replayed; tasks are created with the replayed values.
- **Already-delivered data**: Not safe. Replays create duplicate tasks; there is no dedupe key.

### Rate Limits and Batch Sizes

See above. No batching.

### Multiplexing

No. One event creates one task.

## Version Information

### Current Version

- **Version:** `v2`
- **Where in code:** `src/v0/destinations/clickup/config.js` (`VERSION`, used by `createTaskEndPoint` and `getCustomFieldsEndPoint`)

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Get started with the ClickUp API](https://developer.clickup.com/docs/Getting%20Started)

ClickUp is moving endpoints to v3 gradually; most endpoints, including create task and get accessible custom fields, are still v2.

### Latest Available Version

- **Version:** `v3`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [ClickUp API v2 and v3 terminology](https://developer.clickup.com/docs/general-v2-v3-api)

v3 covers only a subset of endpoints. The v3 reference has no create task or list custom fields endpoint, so there is nothing to upgrade to yet. v2 "Team" is v3 "Workspace".

## Documentation Links

- [ClickUp API: Create Task](https://developer.clickup.com/reference/createtask)
- [ClickUp API: Get Accessible Custom Fields](https://developer.clickup.com/reference/getaccessiblecustomfields)
- [ClickUp authentication](https://developer.clickup.com/docs/authentication)
- [ClickUp rate limits](https://developer.clickup.com/docs/rate-limits)

### Changelog References

- **Changelog:** [ClickUp product changelog](https://feedback.clickup.com/changelog); [ClickUp release notes](https://clickup.com/release-notes)
- **Deprecations:** None found
- **Versions:** [ClickUp API v2 and v3 terminology](https://developer.clickup.com/docs/general-v2-v3-api)
- **Feed:** [ClickUp changelog RSS](https://feedback.clickup.com/api/changelog/feed.rss)
- **Announcements:** None found
- **Last checked:** 2026-11-16

ClickUp has no API-specific changelog; the changelog and release notes are product-wide. API issues are tracked on the [Public API feedback board](https://feedback.clickup.com/public-api).

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ

_No entries yet._
