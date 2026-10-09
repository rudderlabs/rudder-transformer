# HubSpot Audience

HubSpot Audience keeps a HubSpot contact list in sync with a RudderStack audience. Record events use `insert` and `update` as add, and `delete` as remove. Rows are resolved to a HubSpot contact id, then sent with `PUT /crm/v3/lists/{listId}/memberships/add-and-remove`.

Transform and delivery live in this directory and run on the native `DestinationIntegration` framework.

## Stable contact identity

rETL diffs rows by the warehouse primary key. The record event carries the current identifiers, not the contact that was on the list last time. Each warehouse key must keep resolving to the same HubSpot contact for the life of the activation.

If Alice's key stays `alice` but the mapped contact changes from `101` to `202`, the update adds `202` and does not remove `101`. Removing the previous membership has to happen while the old identifier is still available, or by hand in HubSpot. Disabling and enabling the activation does not do that cleanup.

## One source key per contact

Within a connection, one resolved HubSpot contact must belong to at most one warehouse primary key. Email-only sources need uniqueness after trim and lowercase. Id-only sources need unique normalized ids. A direct id and another row's email must not land on the same contact.

The source diff checks primary keys, not HubSpot identity. If keys A and B both resolve to contact `202` and only A leaves, that delete removes `202` and unchanged B does not add it back. Duplicate ids in one request are kept so each job can be judged, but duplicate contacts across different source keys are not a supported setup.

## Identifiers

`message.identifiers` is already keyed by the destination field. This transformer reads `hs_object_id` and `email` only. It does not apply `identifierMappings` again.

A nonempty HubSpot record id wins. Email is used only when the record id is empty (absent, null, `''`, or whitespace). A malformed record id fails the row with `Invalid HubSpot Record ID` and does not fall back to email. Empty on both sides is `No identifier mapped`.

Valid decimal strings drop leading zeros by string replace. Values longer than `Number.MAX_SAFE_INTEGER` stay strings. Numeric ids are accepted only when they are positive safe integers. List ids are not passed through that normalizer.

## Lookup miss and membership miss

An email that HubSpot's contact batch-read reports as `OBJECT_NOT_FOUND` is not yet a membership result.

- Add: `Contact not found in HubSpot`
- Remove: `Removal could not be confirmed: HubSpot identifier not found`

A delete whose membership response lists the id in `recordIdsMissing` is a successful no-op. The contact is already absent, which is what the remove asked for. An email-lookup miss on delete is different: HubSpot never confirmed which contact the old identifier was, so the row fails instead of being treated as already removed.

An id that is absent from `recordsIdsAdded` and also absent from `recordIdsMissing` is a successful add. HubSpot omits contacts that were already on the list. That is not a failure. Live HubSpot responses also omit empty arrays entirely (for example `{ "recordsIdsAdded": ["…"] }` with no `recordIdsMissing` / `recordIdsRemoved`); those absent fields are treated as `[]`.

## Authentication

Membership transform output has `Content-Type` only. `prepareRequest` reads `destinationConfig.accessToken` and sets `Authorization: Bearer <token>` on a clone immediately before the proxy call. A missing token fails before the request is sent.

Proxy delivery is mandatory. A direct router send would have no Authorization header. Lookup calls set the header inside the transformer and do not put it on the membership payload.

## Lists

Each row uses `connection.config.destination.audienceId` from that row. The integration is constructed with the first connection in the batch, and that value is not reused for other rows. A missing or blank id fails the row with `HubSpot list ID is required`. An unsafe id fails with `HubSpot list ID is invalid`. Unsafe means empty, `.`, `..`, or any character in `/[\u0000-\u001F\u007F/\\?#\s]/`. The id is `encodeURIComponent`'d only in the request path. `endpointPath` stays `/crm/v3/lists/:listId/memberships/add-and-remove` for metrics and the delivery throttle bucket.

Add and remove for the same list are separate requests (`internalGroupKey`). Each request is add-only or remove-only and holds at most 1,000 ids. Duplicate ids are preserved. One source job contributes one id.

## Ineligible lists

`HubSpot list is not eligible for contact membership sync` is returned only for HTTP 400 whose `category` is `VALIDATION_ERROR` and whose `subCategory` is exactly `ListError.INVALID_OBJECT_TYPE_FOR_LIST`. That subcategory may be a top-level string or any `errors[].subCategory` string. The response `message` is not consulted. Any other 400, including a body that mentions a DYNAMIC list without that subcategory, aborts with `HubSpot membership update was rejected`.

## Live membership test

`test/integrations/destinations/hs_audience/live.ts` exercises a real record-ID insert and delete through router transform and proxy delivery, with paginated membership read-back after each operation. It requires an existing sandbox contact and a dedicated MANUAL or SNAPSHOT contact list in the same portal. The contact must initially be outside the list; the test fails before modifying membership otherwise. Reserve this list/contact pair for this test and avoid concurrent runs against it.

Supply `LIVE_SECRET_HS_AUDIENCE` locally or through the live suite's Vault configuration:

```json
{
  "authType": "apiKey",
  "config": { "accessToken": "<sandbox Service Key>" },
  "resourceIds": { "listId": "<sandbox list ID>", "contactId": "<sandbox contact ID>" }
}
```

The key needs `crm.lists.read`, `crm.lists.write`, `crm.objects.contacts.read`, and `crm.objects.contacts.write`. HubSpot membership mutate returns 403 without contact write (`requires one of [contacts-write]`), even though the test does not create or delete contacts or lists. Cleanup removes the test membership even after a pipeline failure, once the initial absence check has succeeded, and verifies that it is absent. Cleanup failures are reported by the harness and require manual removal before another run.

Run `npm run test:live -- --destination=hs_audience` with that environment variable configured. Never commit the actual key.

## Manual acceptance still open

These were not verified against a live portal or a fleet config in this change:

- Missing-id behavior for adds and removes
- Duplicate id entries
- The 1,000 id cap
- Mixed or partial lookup error bodies
- Fleet proxy and `Router.HS_AUDIENCE` batch settings (`noOfJobsToBatchInAWorker`, `transformerProxy`). Operator and devops config is out of scope here
- Quota, retry, and replay behavior
- Equivalent outcomes for standalone rETL and Lookout

## Errors

| Situation                                               | Result                                                                             |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Missing token                                           | `HubSpot access token is required`                                                 |
| Invalid record id                                       | `Invalid HubSpot Record ID`                                                        |
| Invalid email                                           | `Invalid email identifier`                                                         |
| Lookup 401                                              | `HubSpot rejected the access token`                                                |
| Lookup 403                                              | `HubSpot token is missing the crm.objects.contacts.read scope`                     |
| Other lookup 4xx                                        | `HubSpot contact lookup was rejected`                                              |
| Membership 403                                          | `HubSpot token is missing the crm.lists.write or crm.objects.contacts.write scope` |
| Membership 404                                          | `HubSpot list was not found`                                                       |
| 429                                                     | `HubSpot rate limit exceeded`                                                      |
| Lookup or membership response that cannot be correlated | retry, static correlation message, no raw body                                     |

Reasons do not include identifier values, response bodies, headers, `message`, or `correlationId`.
