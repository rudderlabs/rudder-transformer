# Mailchimp RETL Functionality

## Is RETL supported?

**Yes.** `supportedSourceTypes` includes `warehouse`; `isAudienceSupported: true`.

## Supported RETL Types

| Type        | Supported | Evidence                                                                               |
| ----------- | --------- | -------------------------------------------------------------------------------------- |
| JSON Mapper | Yes       | `disableJsonMapper` is not set                                                         |
| VDM V1      | Yes       | `supportsVisualMapper: true`; `mappedToDestination` handling in `utils.processPayload` |
| VDM V2      | No        | `record` not in `supportedMessageTypes`; no record handling                            |

## VDM Configuration (rudder-integrations-info)

`src/routes/mailchimp/`:

- **Objects**: audiences, from `GET /3.0/lists?count=1000`.
- **Fields**: default member fields (`email_address` unique, `status` required for mapping, `email_type`, `interests`, `language`, `vip`, ...) plus the audience's merge fields from `GET /3.0/lists/{listId}/merge-fields`.
- **Custom fields**: created with `POST /3.0/lists/{listId}/merge-fields`.

## Connection Config

None used by the transformer.

## RETL Flow (`mappedToDestination: true`)

1. `addExternalIdToTraits` copies the `externalId` identifier (for example `identifierType: "email_address"`) into traits.
2. Traits are used as the member body as-is. Merge fields must already be in Mailchimp format (`merge_fields.<TAG>`), and `status` should be mapped.
3. If `merge_fields.ADDRESS` is present, it is validated (`addr1`, `city`, `state`, `zip` required).
4. No member or double opt-in lookups.
5. `status` must be a valid Mailchimp status.
6. Router batching to the batch subscribe endpoint is the same as event stream identify.

Example traits from VDM:

```json
{ "merge_fields": { "FIRSTNAME": "Bob" }, "status": "subscribed" }
```

with `context.externalId: [{ "type": "audience", "identifierType": "email_address", "id": "bob.dole@initech.com" }]` produces:

```json
{
  "merge_fields": { "FIRSTNAME": "Bob" },
  "status": "subscribed",
  "email_address": "bob.dole@initech.com"
}
```
