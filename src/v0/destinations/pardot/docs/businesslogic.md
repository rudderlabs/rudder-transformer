# Pardot Business Logic

## Endpoint and Request

| Item              | Value                                                                               |
| ----------------- | ----------------------------------------------------------------------------------- |
| Base              | `https://pi.pardot.com/api/prospect/version/4/do/upsert`                            |
| URL by identifier | `/email/<email>`, `/id/<pardotId>`, `/fid/<crmfid>`                                 |
| Method            | `POST`                                                                              |
| Body              | Form-encoded (`body.FORM`); the proxy adds `format=json`                            |
| Headers           | `Authorization: Bearer <access_token>`, `Pardot-Business-Unit-Id: <businessUnitId>` |

## Identify Flow

1. Check `campaignId` and `businessUnitId` in config, and that the type is `identify`.
2. Read `access_token` from `metadata.secret`.
3. Take the first entry of `context.externalId`. It is "proper" when it has both `type` and `id`.
4. Read `email` (generic email mapping).
5. No proper externalId and no email: `InstrumentationError` "Without externalId, email is required".
6. Choose the URL:
   - proper externalId, type `pardotId` (case-insensitive) → `/id/<id>`
   - proper externalId, type `crmfid` → `/fid/<id>`
   - proper externalId, other type → `/email/<email>`
   - otherwise → `/email/<email>`
7. Build the form body from `data/PardotIdentify.json`. Set `campaign_id` from config when not mapped.

## Field Mappings (`data/PardotIdentify.json`)

Sources are checked in order; `traits` then `context.traits` unless noted.

| Pardot field          | Source keys                                                            |
| --------------------- | ---------------------------------------------------------------------- |
| `email`               | `email`, `context.traits.email` (generic map)                          |
| `salutation`          | `salutation`                                                           |
| `first_name`          | `first_name`, `firstName`                                              |
| `last_name`           | `last_name`, `lastName`                                                |
| `company`             | `company.name`, `company`                                              |
| `prospect_account_id` | root `prospect_account_id`, `prospect_account_id`, `prospectAccountId` |
| `website`             | `website`                                                              |
| `notes`               | `notes`                                                                |
| `job_title`           | `job_title`, `jobTitle`                                                |
| `department`          | `department`                                                           |
| `country`             | `address.country`, `country`                                           |
| `address_one`         | `address.street`                                                       |
| `address_two`         | `address_two`                                                          |
| `city`                | `address.city`                                                         |
| `state`               | `address.state`                                                        |
| `zip`                 | `address.zip`                                                          |
| `phone`               | `phone`                                                                |
| `fax`                 | `fax`                                                                  |
| `annual_revenue`      | `annual_revenue`, `annualRevenue`                                      |
| `employees`           | `employees`                                                            |
| `industry`            | `industry`                                                             |
| `years_in_business`   | `years_in_business`                                                    |
| `score`               | `score`                                                                |
| `comments`            | `comments`                                                             |
| `is_do_not_email`     | root, traits, context.traits `is_do_not_email`                         |
| `is_do_not_call`      | root, traits, context.traits `is_do_not_call`                          |
| `opted_out`           | `opted_out`                                                            |
| `is_reviewed`         | `is_reviewed`                                                          |
| `is_starred`          | `is_starred`                                                           |
| `territory`           | `territory`                                                            |
| `campaign_id`         | `campaignId`, `campaign_id`, else `Config.campaignId`                  |

Custom Pardot fields are not mapped.

## Example

Input:

```json
{
  "type": "identify",
  "context": {
    "traits": { "email": "jane@example.com", "firstName": "Jane", "company": "Acme" },
    "externalId": [{ "type": "crmfid", "id": "00Q5g00000ABCDE" }]
  }
}
```

Output:

- `POST https://pi.pardot.com/api/prospect/version/4/do/upsert/fid/00Q5g00000ABCDE`
- Form body: `email=jane@example.com&first_name=Jane&company=Acme&campaign_id=<Config.campaignId>` (plus `format=json` added by the proxy)

## Response Handling (`networkHandler.js`)

- Success: HTTP 2xx and `@attributes.stat` is not `fail`.
- Failure with `err_code` in `[85, 116, 120, 121, 183, 184, 214]`: status 500 (retry). Code `184` also sets `REFRESH_TOKEN`.
- Any other failure: status 400 (abort).
- No `@attributes` in the body: status 500 when HTTP is 2xx, else the HTTP status.

## Known Issues (NEEDS REVIEW)

- Error codes `66` (more than 5 concurrent requests) and `122` (daily API limit exceeded) are not retryable, so throttled events are aborted instead of retried.
- Email and externalId values are put into the URL path without URL encoding.
- The host is always `pi.pardot.com`; sandbox/developer business units (`pi.demo.pardot.com`) are not supported.
- On v4 with AMPSEA, upsert by email may match more than one prospect. Salesforce documents which record is updated; confirm the behaviour.

## Use Cases

Keeping Account Engagement prospects in sync with product sign-ups and profile updates, and assigning new prospects to a campaign.
