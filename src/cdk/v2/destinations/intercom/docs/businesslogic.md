# Business Logic for Intercom

### Overview

The transformer supports Identify, Track, and Group (company) events for Intercom with API version selection (`v1` or `v2`). It removes reserved attributes from `custom_attributes`, flattens nested attributes, and conditionally issues intermediary calls like search, attach, detach, and tag operations.

### Common Behaviors

- Headers include `Authorization: Bearer <apiKey>`, `Intercom-Version`, and `User-Agent` (default `RudderStack` or overridden by `INTERCOM_USER_AGENT_HEADER`).
- Endpoint base is selected by `apiServer`: US/EU/AU.
- Lookup field defaults to `email` but can be overridden via `integrations.INTERCOM.lookup`.
- `sendAnonymousId`: when enabled and `userId` absent, uses `anonymousId` as the identifier.
- Reserved metadata handling preserves "monetary amount" and "rich link" structures; other metadata is flattened.

### Identify

v2 Flow:

1. Optional: Search existing contact by lookup field
   - `POST /contacts/search` with `{ query: { operator: AND, value: [{ field: <lookup>, operator: '=', value: <value> }] } }`
2. Build contact payload
   - Fields: `external_id`, `email`, `phone`, `avatar`, `last_seen_at`, `role`, `signed_up_at`, `owner_id`, `unsubscribed_from_emails`, `name`, `custom_attributes`
   - `name` is derived from `traits.name` or composed from first/last name if available
   - `custom_attributes` are filtered and flattened (underscore separator in v2)
   - Requires: `external_id` or `email`
3. Upsert
   - If contact exists: `PUT /contacts/{id}`
   - Else: `POST /contacts`
4. Optional detach from a company when `traits.company.remove = true`
   - Resolve `company_id` by `GET /companies?company_id=...` or `?name=...`
   - `DELETE /contacts/{contact_id}/companies/{company_id}`

v1 Flow:

- Build `POST /users` payload with `user_id` or `email`, `phone`, `signed_up_at`, `last_seen_user_agent`, `name`, `custom_attributes`, and `update_last_request_at` (default true unless configured otherwise).
- Requires: `user_id` or `email`.
- `custom_attributes` filtered and flattened (dot separator in v1).
- Companies can be included on the user payload via `custom_attributes.company` and processed to an array of `companies` with `company_id`, `name`, and `custom_attributes` (non-reserved keys only).

Validations:

- v2 Identify requires one of `external_id` or `email`.
- v1 Identify requires one of `user_id` or `email`.

### Track

- Build event payload:
  - `event_name`: from `.event`
  - `user_id` or `email` (fallback to `anonymousId` if configured)
  - `metadata`: from `.properties`, processed via metadata handler to preserve reserved objects and flatten the rest
  - Timestamp: `created_at` (v2) or `created` (v1) from `.timestamp`
- Endpoint: `POST /events`
- Validations: `event_name` present; one of `user_id` or `email` present.

### Group (Companies)

v2 Flow:

1. Build company payload from `groupId` and traits: `company_id`, `name`, `website`, `plan`, `size` (number), `industry`, `monthly_spend` (number), `remote_created_at` (number) and `custom_attributes` (filtered & flattened for v2).
2. Create or update company: `POST /companies` (returns `id`).
3. If a matching contact exists from Identify search step, attach contact to the company:
   - `POST /contacts/{id}/companies` with `{ id: <company_id> }`.
4. Add tags to the company if `context.traits.tags` present:
   - `POST /tags` with `{ name: <tag>, companies: [{ id: <company_id> }] }` for each tag.
5. Router returns suppressed status for Group to avoid double delivery while side effects occur.

v1 Flow:

- `POST /companies` with filtered `custom_attributes` plus company fields listed above.
- Legacy attach flow uses a user payload built via `attachUserAndCompany` (posts to `/users`).
- Tag operations are executed as `POST /tags` per tag.

Validations:

- Requires `groupId`.
- Filters reserved company properties; flattens non-reserved attributes appropriately.

### Error Handling

- 400 and 404 map to instrumentation errors; 401 maps to configuration error; others surface as network errors with categorized tags.
- On non-2xx responses, errors from Intercom payload are bubbled up in error messages.

### Notes & Edge Cases

- Company `remove` under Identify triggers a detach flow in v2 only.
- `owner_id`, `unsubscribed_from_emails`, and `role` are processed when provided for v2 Identify.
- The `name` field is intelligently derived; when not present and only first/last names exist, they are combined.
- For v1, `update_last_request_at` defaults to true unless overridden in destination config.
