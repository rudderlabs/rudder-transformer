# Gladly Business Logic and Mappings

## Field Mappings (event stream)

| Source                                       | Gladly field         | Notes                                                                      |
| -------------------------------------------- | -------------------- | -------------------------------------------------------------------------- |
| `traits.name` → `context.traits.name`        | `name`               |                                                                            |
| `traits.avatar` → `context.traits.avatar`    | `image`              |                                                                            |
| `traits.address` → `context.traits.address`  | `address`            | Objects are `JSON.stringify`-ed                                            |
| `context.traits.email` (string or array)     | `emails[].original`  | Only `context.traits` is read                                              |
| `context.traits.phone` (string or array)     | `phones[].original`  | Only `context.traits` is read                                              |
| `context.traits` minus reserved keys         | `customAttributes`   | Reserved: email, phone, address, name, avatar, firstName, lastName, userId |
| `userId`                                     | `externalCustomerId` |                                                                            |
| `context.externalId` type `GladlyCustomerId` | `id`                 |                                                                            |

Null and undefined values are removed. RETL mappings are in [retl.md](retl.md).

## Request Flow

1. Validate type (`identify`) and config.
2. Build payload; require one of `emails`, `phones`, `id`, `externalCustomerId`.
3. If email, phone or `externalCustomerId` exists, `GET /api/v1/customer-profiles?<first of email|phoneNumber|externalCustomerId>`.
4. Not found (`400`, or `200` with `[]`), or no lookup possible → `POST https://{domain}/api/v1/customer-profiles` with the full payload.
5. Found → `PATCH https://{domain}/api/v1/customer-profiles/{id}` with the payload minus `id`.
6. Lookup errors other than `400` → the event fails with the lookup status.

## Example

```json
// input
{ "type": "identify", "userId": "u1",
  "context": { "traits": { "email": "a@b.com", "phone": "+15550001", "name": "Ann", "plan": "pro" } } }
// lookup: GET https://acme.gladly.com/api/v1/customer-profiles?email=a%40b.com → []
// output: POST https://acme.gladly.com/api/v1/customer-profiles
{ "name": "Ann", "emails": [{ "original": "a@b.com" }], "phones": [{ "original": "+15550001" }],
  "customAttributes": { "plan": "pro" }, "externalCustomerId": "u1" }
```

## Error Handling

- Missing config → configuration error.
- Missing identifiers → instrumentation error.
- Lookup failure → error with the lookup's HTTP status (retryable for 5xx).
- Router errors are wrapped per event with `handleRtTfSingleEventError`.

## Notes

- `name` is read from `traits` first, while email, phone and custom attributes come only from
  `context.traits`. An event with traits only at the top level sends `name` but no email or phone.
- `firstName` and `lastName` are dropped (reserved, but not combined into `name`).
- `getCustomAttributes` deletes reserved keys from `message.context.traits` in place (input mutation).

## General Use Cases

Keep Gladly customer profiles (contact details, external ID, custom attributes) in sync for support agents.
