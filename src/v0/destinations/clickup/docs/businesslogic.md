# ClickUp Business Logic

## Endpoints

| Step          | Method | Endpoint                                             |
| ------------- | ------ | ---------------------------------------------------- |
| Custom fields | GET    | `https://api.clickup.com/api/v2/list/{listId}/field` |
| Create task   | POST   | `https://api.clickup.com/api/v2/list/{listId}/task`  |

`listId` = `context.externalId[type=clickUpListId]` or `Config.listId`.

## Flow

1. `message.type` is required.
2. `checkEventIfUIMapped`: if `whitelistedEvents` is non-empty and the event name is not in it (case-insensitive), the event fails.
3. Only `track` continues.
4. Assignees are collected from `context.externalId` entries of type `clickUpAssigneeId`.
5. If both `keyToCustomFieldName` and `properties` exist, fetch the list's custom fields, then for each mapping `from → to` with a truthy `properties[from]`:
   - find the custom field by name `to`,
   - validate by type,
   - convert by type,
   - add `{ id, value }` if the field exists and the value is truthy.
6. Build the task payload from the mapping below, add `assignees` and `custom_fields`, validate `priority`, and remove empty values.

## Field Mapping (`data/ClickUpTrackConfig.json`)

| ClickUp field     | Source                               | Notes                       |
| ----------------- | ------------------------------------ | --------------------------- |
| `name`            | `properties.taskName`, else `event`  | Required                    |
| `description`     | `properties.description`             |                             |
| `priority`        | `properties.priority`                | Integer 1–4                 |
| `tags`            | `properties.tags`                    |                             |
| `time_estimate`   | `properties.timeEstimate`            |                             |
| `status`          | `properties.status`                  |                             |
| `due_date`        | `properties.dueDate`                 | Converted to timestamp (ms) |
| `due_date_time`   | `properties.includeDueDateTime`      |                             |
| `start_date`      | `properties.startDate`               | Converted to timestamp (ms) |
| `start_date_time` | `properties.includeStartDateTime`    |                             |
| `notify_all`      | `properties.notifyAll`               |                             |
| `assignees`       | externalId `clickUpAssigneeId` (all) | Array                       |
| `custom_fields`   | `keyToCustomFieldName`               | Array of `{id,value}`       |

## Custom Field Conversion

| ClickUp type | Conversion                                                                                      |
| ------------ | ----------------------------------------------------------------------------------------------- |
| `drop_down`  | Option name (case-insensitive) → option `id`                                                    |
| `labels`     | Array of label names → array of label `id`s                                                     |
| `location`   | `{lat, lng, formattedAddress}` → `{location:{lat,lng}, formatted_address}` (all three required) |
| `date`       | `formatTimeStamp(value)`                                                                        |
| others       | Sent as-is                                                                                      |

## Example

Input:

```json
{
  "type": "track",
  "event": "New Lead",
  "properties": { "description": "From web form", "priority": 2, "url": "https://example.com" },
  "context": { "externalId": [{ "type": "clickUpAssigneeId", "id": 61205104 }] }
}
```

With `keyToCustomFieldName: [{ "from": "url", "to": "Url" }]`, output body:

```json
{
  "name": "New Lead",
  "description": "From web form",
  "priority": 2,
  "assignees": [61205104],
  "custom_fields": [{ "id": "<Url field id>", "value": "https://example.com" }]
}
```

## Error Handling

- Custom field lookup non-200 → `NetworkError` with ClickUp's status (retryable for 5xx/429).
- Validation failures → `InstrumentationError`.

## Known Issues (NEEDS REVIEW)

- `checkEventIfUIMapped` calls `event.toLowerCase()`; a `track` with no `event` and a non-empty allowlist throws a `TypeError` instead of a clean error.
- `getDropDown` / `getLabels` call `.toLowerCase()` on values without type checks; a non-string dropdown value or a non-array labels value throws a `TypeError`.
- Custom field names that do not exist in the list are silently skipped.
