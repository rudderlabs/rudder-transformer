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

Email batch-read requests include `email` and `hs_additional_emails`. Results match requested addresses against the normalized primary email and semicolon-separated secondary emails. Multiple requested addresses may resolve to the same contact. The first usable contact match is retained; a not-found entry does not overwrite a found contact. Malformed entries and unusable secondary-email fields are ignored individually. Response status labels and error counts do not invalidate usable matches. An email with neither a usable match nor an explicit not-found answer retries only its own rows with `HubSpot contact lookup response could not be correlated`. Secondary-email resolution through this exact batch-read endpoint remains pending live verification.

## Lookup miss and membership miss

An email that HubSpot's contact batch-read reports as `OBJECT_NOT_FOUND` is not yet a membership result.

- Add: `Contact not found in HubSpot`
- Remove: `Removal could not be confirmed: HubSpot identifier not found`

A delete whose membership response lists the id in `recordIdsMissing` is a successful no-op. The contact is already absent, which is what the remove asked for. An email-lookup miss on delete is different: HubSpot never confirmed which contact the old identifier was, so the row fails instead of being treated as already removed.

For HTTP 200, an addition fails only when its id appears in `recordIdsMissing`. Delivery converts returned missing ids to strings for matching. It ignores added/removed arrays and unrelated response fields. If `recordIdsMissing` is absent or is not an array, it is treated as empty. Existing members and successful no-ops succeed.

The request id count must equal the job count so delivery can assign each verdict to the correct job. A count mismatch retries every job with `HubSpot membership response could not be correlated`. Other successful HTTP statuses use the framework success default.

## Authentication

Membership transform output contains `Content-Type` and `Authorization: Bearer <token>`. The framework groups each router call by source and destination connection. The integration reads and trims `this.destination.Config.accessToken` once during construction and builds shared headers for lookup and membership requests. Different connections run in separate calls.

Missing tokens and missing or invalid list configuration reject construction with `ConfigurationError` (non-retryable 400). Invalid record identifiers and actions remain instrumentation errors.

The framework handles membership delivery without a `prepareRequest` hook. Lookup calls authenticate inside the transformer. Membership requests carry their own Authorization header.

Authorization is part of the stored router output. Regenerate `src/secretPaths/secretPaths.json` after changing the transform or component fixtures. The generated `HS_AUDIENCE` entry must include `headers.Authorization` for consumers that mask Live Events.

## Lists

The integration reads and trims `this.connection.config.destination.audienceId` once during construction. Every row in the call uses that list. A missing or blank id rejects construction with `HubSpot list ID is required`. An unsafe id rejects construction with `HubSpot list ID is invalid`. Unsafe means empty, `.`, `..`, or any character in `/[\u0000-\u001F\u007F/\\?#\s]/`. The id is `encodeURIComponent`'d only in the request path. `endpointPath` stays `/crm/v3/lists/:listId/memberships/add-and-remove` for metrics and the delivery throttle bucket.

Add and remove for the same list are separate requests (`internalGroupKey`). Each request is add-only or remove-only and holds at most 1,000 ids. Duplicate ids are preserved. One source job contributes one id.

## Delivery failures

HTTP 400 uses the framework abort verdict. HubSpot's message explains rejected membership changes, including ineligible lists. Delivery does not detect list-specific subcategories or add an error prefix. Lookup and membership network failures use the shared adapter's status mapping: failures mapped to 500 retry, while failures mapped to 400 abort. For example, timeouts and connection resets retry; `ENOTFOUND`, `EPIPE`, and unknown network codes abort under the current shared mapping.

HTTP 477, HubSpot's portal-migration status, retries each job as 500. It uses HubSpot's message, category, and correlation ID when available, with the static unavailable reason as fallback.

## Live membership test

`test/integrations/destinations/hs_audience/live.ts` exercises a real record-ID insert, an update re-adding the existing member, a delete, and a repeated delete of the absent member through router transform and proxy delivery, with paginated membership read-back after each operation. Before each repeated pipeline operation, a direct sandbox probe captures the exact response text and HTTP status to a private temporary JSON file; the test prints only the artifact path. The probes use the same `/add-and-remove` endpoint and do not capture request headers. It requires an existing sandbox contact and a dedicated MANUAL or SNAPSHOT contact list in the same portal. The contact must initially be outside the list; the test fails before modifying membership otherwise. Reserve this list/contact pair for this test and avoid concurrent runs against it.

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
- No-op response shapes for `/add-and-remove`. A 200 `''` is already treated as success. A live capture can still confirm the body HubSpot sends; run the repeated-add/remove steps above and retain the raw response artifacts with membership read-back evidence
- Secondary-email batch-read resolution: request a prepared sandbox contact's secondary address with both email properties and confirm the returned primary/secondary values and resolved ID
- Stale/merged IDs: use a prepared sandbox merged-contact fixture with known old and surviving IDs plus a dedicated static list. Send the old ID in separate add-only and remove-only `/add-and-remove` requests, alongside an unrelated valid contact. Retain exact HTTP statuses, raw response bodies, sent IDs, and membership read-back for the survivor and unrelated contact. Determine whether HubSpot reports the old ID as missing or substitutes the surviving ID. Delivery ignores returned IDs that were not sent; do not create or merge contacts as part of this membership test
- Duplicate id entries
- The 1,000 id cap
- Mixed or partial lookup error bodies
- Fleet proxy and `Router.HS_AUDIENCE` batch settings (`noOfJobsToBatchInAWorker`, `transformerProxy`). Operator and devops config is out of scope here
- Quota, retry, and replay behavior
- Equivalent outcomes for standalone rETL and Lookout

## Errors

| Situation                                                      | Result                                                                                                                   |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Missing token                                                  | `HubSpot access token is required`                                                                                       |
| Invalid record id                                              | `Invalid HubSpot Record ID`                                                                                              |
| Invalid email                                                  | `Invalid email identifier`                                                                                               |
| Lookup 401                                                     | abort with HubSpot details. Fallback: `HubSpot rejected the access token`                                                |
| Lookup 403                                                     | abort with HubSpot details. Fallback: `HubSpot token is missing the crm.objects.contacts.read scope`                     |
| Lookup 477                                                     | retry with HubSpot details. Fallback: `HubSpot contact lookup is temporarily unavailable`                                |
| Membership 477                                                 | retry with HubSpot details. Fallback: `HubSpot membership update is temporarily unavailable`                             |
| Other lookup 4xx                                               | abort with HubSpot details. Fallback: `HubSpot contact lookup was rejected`                                              |
| Membership 401                                                 | abort with HubSpot details. Fallback: `HubSpot rejected the access token`                                                |
| Membership 403                                                 | abort with HubSpot details. Fallback: `HubSpot token is missing the crm.lists.write or crm.objects.contacts.write scope` |
| Membership 404                                                 | abort with HubSpot details. Fallback: `HubSpot list was not found`                                                       |
| Other membership 4xx                                           | abort with HubSpot details. Fallback: `HubSpot membership update was rejected`                                           |
| Lookup 429                                                     | throttle with HubSpot details. Fallback: `HubSpot rate limit exceeded`                                                   |
| Membership 429                                                 | throttle with HubSpot details. Fallback: `HubSpot rate limit exceeded`                                                   |
| Lookup 5xx                                                     | retry with HubSpot details. Fallback: `HubSpot contact lookup is temporarily unavailable`                                |
| Membership 5xx                                                 | framework retry with HubSpot details. Fallback: framework status-only reason                                             |
| Lookup correlation failure or membership id/job count mismatch | retry unmatched lookup rows or all membership jobs respectively, static correlation message, no raw body                 |

Lookup and membership failure reasons contain HubSpot's `message`, followed by labeled `category` and `correlationId` when available. Empty or malformed fields are ignored. Nested errors, context, and subcategories are not included in the formatted reason. If no usable message exists, each path uses its status fallback and appends any available category or correlation ID.

Only HTTP 200 and 477 have delivery overrides. HTTP 200 returns per-job verdicts for missing additions or an id/job count mismatch. A fully successful 200 uses the framework success verdict. HTTP 477 retries each job as 500 so portal migration remains retryable. All other statuses use the framework default.

These details can contain identifiers or list text echoed by HubSpot. The formatter does not serialize the entire response. Ordinary 4xx and 5xx failures use the framework response path, which attaches the raw HubSpot body to the thrown error's `destinationResponse`. Proxy v1 copies that body as JSON into each job's `error` and retains the HTTP status. The formatted reason appears in the top-level `message`. Lookup failures include the compact formatted reason without attaching the raw response body. Transport errors without a HubSpot envelope, unmatched-email correlation errors, and membership id/job count mismatches retain static reasons.

The router Authorization and lookup/membership error-detail policies deliberately differ from the companion HubSpot spec in `rudder-specs`. That spec remains outside this change.
