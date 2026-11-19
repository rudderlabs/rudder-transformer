# Mailjet Business Logic and Mappings

## Identify (per event)

Mapping: `data/MailJetIdentifyConfig.json`

| Mailjet field             | Source                                                                                                               |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `email`                   | generic `emailOnly` (required)                                                                                       |
| `Name`                    | generic `name`                                                                                                       |
| `IsExcludedFromCampaigns` | `context.traits.IsExcludedFromCampaigns` / `traits.IsExcludedFromCampaigns`                                          |
| `properties`              | `contactPropertiesMapping`: for each `from`, `traits[from]` → `properties[to]` (`context.traits` wins over `traits`) |

`listId` (externalId `listId`, else `Config.listId`) and `action` (`integrations.mailjet.Action`, default
`addnoforce`) are kept on the response for grouping and are not in the contact body.

## Router Batching

1. Group events by `listId&&action`.
2. Chunk each group into 5,000.
3. Per chunk:

```json
POST https://api.mailjet.com/v3/REST/contactslist/<listId>/managemanycontacts
Authorization: Basic base64(apiKey:apiSecret)
{
  "Action": "addnoforce",
  "Contacts": [
    { "email": "a@b.com", "Name": "Ann", "properties": { "country": "US" } }
  ]
}
```

| Action       | Effect                                                          |
| ------------ | --------------------------------------------------------------- |
| `addforce`   | Add and subscribe; resubscribes contacts that had unsubscribed  |
| `addnoforce` | Add and subscribe; keeps existing subscription status (default) |
| `remove`     | Remove from the list                                            |
| `unsub`      | Unsubscribe from the list                                       |

## Error Handling

- Missing type, unsupported type, missing email → instrumentation error per event.
- Partner errors are handled by rudder-server (no proxy).

## Notes and Possible Bugs

- `getProperties` only copies truthy values, so `0`, `false` and empty strings are never sent as contact
  properties.
- Mailjet tracks `managemanycontacts` as a job (`GET .../managemanycontacts/{job_ID}` returns its status).
  The destination never checks the job, so per-contact failures are not surfaced. **NEEDS REVIEW**.
- The 5,000 batch size is not a documented Mailjet limit. **NEEDS REVIEW**.

## General Use Cases

Keep Mailjet contact lists and subscription states in sync for campaigns.
