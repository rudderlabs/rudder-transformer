# ProfitWell Business Logic

## Endpoints

| Step                 | Method | Endpoint                                                                             |
| -------------------- | ------ | ------------------------------------------------------------------------------------ |
| Subscription history | GET    | `https://api.profitwell.com/v2/users/{userId or userAlias}/`                         |
| Create subscription  | POST   | `https://api.profitwell.com/v2/subscriptions/`                                       |
| Update subscription  | PUT    | `https://api.profitwell.com/v2/subscriptions/{subscriptionId or subscriptionAlias}/` |

Header: `Authorization: <privateApiKey>`.

## Identifiers

| Value               | Source                                                           |
| ------------------- | ---------------------------------------------------------------- |
| `userId`            | `context.externalId` with type `profitwellUserId`                |
| `userAlias`         | RudderStack `userId` (generic `userId` lookup)                   |
| `subscriptionId`    | `context.externalId` with type `profitwellSubscriptionId`        |
| `subscriptionAlias` | `traits.subscriptionAlias` or `context.traits.subscriptionAlias` |

## Flow (`identifyResponseBuilder`)

1. Validate identifiers (`validatePayloadAndRetunImpIds`).
2. GET subscription history for `userId || userAlias`.
3. If the GET succeeds, scan `response.data` for an entry for this user:
   - Matching `subscription_id` (or `subscription_alias` when no id) → **PUT update** (`createResponseForSubscribedUser`).
   - User found but no matching subscription → `createMissingSubscriptionResponse`: if a `profitwellSubscriptionId` was given, fail with `Profitwell subscription_id not found`; otherwise **POST create** with `user_id` and `user_alias`.
4. If the GET fails with a status other than 404 → `NetworkError` with that status.
5. If the GET returns 404:
   - `profitwellUserId` given → fail with `No user found for profitwell user_id`.
   - otherwise **POST create** with `user_alias`.

## Field Mappings

### Create (`data/CreateSubscription.json`)

| ProfitWell field        | Source (`traits` / `context.traits`)                 | Required |
| ----------------------- | ---------------------------------------------------- | -------- |
| `subscription_alias`    | `subscriptionAlias`                                  | No       |
| `email`                 | `email`                                              | Yes      |
| `plan_id`               | `planId`                                             | Yes      |
| `plan_interval`         | `planInterval` (`month`/`year`)                      | Yes      |
| `plan_currency`         | `planCurrency` (dropped if unknown)                  | No       |
| `status`                | `status` (`active`/`trialing`, else dropped)         | No       |
| `value`                 | `value`                                              | Yes      |
| `effective_date`        | `effectiveDate`, else event timestamp (Unix seconds) | No       |
| `user_id`, `user_alias` | identifiers above                                    | -        |

### Update (`data/UpdateSubscription.json`)

| ProfitWell field | Source          | Required |
| ---------------- | --------------- | -------- |
| `plan_id`        | `planId`        | Yes      |
| `plan_interval`  | `planInterval`  | Yes      |
| `value`          | `value`         | Yes      |
| `status`         | `status`        | No       |
| `effective_date` | `effectiveDate` | Yes      |

## Example

Input:

```json
{
  "type": "identify",
  "userId": "alias-1",
  "traits": {
    "email": "a@example.com",
    "subscriptionAlias": "sub-1",
    "planId": "pro",
    "planInterval": "month",
    "value": 2000
  },
  "originalTimestamp": "2026-01-01T00:00:00Z"
}
```

If the user does not exist (GET 404), output is:

```json
{
  "method": "POST",
  "endpoint": "https://api.profitwell.com/v2/subscriptions/",
  "headers": { "Content-Type": "application/json", "Authorization": "<privateApiKey>" },
  "body": {
    "JSON": {
      "subscription_alias": "sub-1",
      "email": "a@example.com",
      "plan_id": "pro",
      "plan_interval": "month",
      "value": 2000,
      "user_alias": "alias-1",
      "effective_date": 1767225600
    }
  }
}
```

## Error Handling

- Lookup errors other than 404 become `NetworkError` with ProfitWell's status (retryable for 5xx/429 via `getDynamicErrorType`).
- Validation failures are `InstrumentationError` (event aborted).

## Known Issues (NEEDS REVIEW)

- **Empty history**: if the GET succeeds but no entry matches the user (for example, `data: []`), neither return branch runs and the code reads `res.response.response.status`, which is undefined. This throws a `TypeError` instead of creating the subscription.
- **Update fallback timestamp**: `createResponseForSubscribedUser` passes the `unixTimestampOrError` function itself as the fallback timestamp. Because `effective_date` is required in the update mapping this path is not reached today, but it is wrong.
- **Units**: a user-supplied `effectiveDate` is passed through as a number (`new Date(Number(date)).getTime()`), while the fallback uses Unix seconds. A millisecond value would be sent as-is. ProfitWell expects Unix seconds.
