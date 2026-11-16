# Marketo Static List Business Logic

## Request Shape

Lead IDs go in the query string; there is no body.

| Operation | Method   | Endpoint                                                                       |
| --------- | -------- | ------------------------------------------------------------------------------ |
| Add       | `POST`   | `https://{accountId}.mktorest.com/rest/v1/lists/{listId}/leads.json?id=1&id=2` |
| Remove    | `DELETE` | same                                                                           |

Headers: `Authorization: Bearer {token}`, `Content-Type: application/json`. Up to 300 IDs per request.

`listId` = `context.externalId[type=marketoStaticListId].id`, else `Config.staticListId`.

## `audiencelist` Flow (`transform.js`)

Input:

```json
{
  "type": "audiencelist",
  "properties": {
    "listData": {
      "add": [{ "id": 1001 }, { "id": 1002 }],
      "remove": [{ "id": 1003 }]
    }
  }
}
```

Output: one `DELETE ...?id=1003` and one `POST ...?id=1001&id=1002`. Removes are built first. Each list is chunked by 300.

## `record` Flow (`transformV2.js`)

1. Router groups `record` events by list ID.
2. Per group: `action: "insert"` with `fields.id` goes to the insert set, `action: "delete"` to the delete set, anything else fails individually.
3. Delete IDs and insert IDs are each chunked by 300 into batched responses (`batched: true`), delete first.

Input:

```json
{ "type": "record", "action": "insert", "fields": { "id": 1001 } }
```

## Error Handling

Proxy delivery uses `marketoResponseHandler` (shared with Marketo):

- HTTP non-2xx: `NetworkError`.
- `601`/`602`: cached token evicted, retryable.
- Throttled: `502, 606, 607, 608, 615`. Retryable: `601, 602, 604, 611`. Aborted: `600, 603, 605, 609, 610, 612, 1001, 1003, 1004, 1006, 1013`.
- Any `result[]` item not `added`/`removed`/`created`/`updated` (for example `skipped` with `1004 Lead not found`) fails the request; `1015` alone is ignored.

## Validations

See [README Validations](../README.md#validations).

## General Use Cases

- Sync warehouse audiences (VDM v2 `record`) into a Marketo static list.
- Mirror audience membership from RudderStack Audiences (`audiencelist`).
