# Intercom Destination

Implementation in **CDK v2 (Router)**

### Configuration

- **Authentication**: Access Token (Bearer)
- **API Server (Region)**: `us` (default), `eu`, `au`
- **API Version**: `v2` (default, Intercom-Version: 2.10) or `v1` (Intercom-Version: 1.4)
- **Send AnonymousId**: If enabled and no `userId`, uses `anonymousId` as `external_id` (v2) or `user_id` (v1)
- **Update Last Request At (v1 only)**: Defaults to true if not explicitly configured

Config keys are sourced from `rudder-integrations-config` `db-config.json` under `destConfig.defaultConfig` (e.g., `apiKey`, `apiServer`, `apiVersion`, `sendAnonymousId`, `updateLastRequestAt`).

### Integration Functionalities

- **Implementation**: CDK v2 workflows in `procWorkflow.yaml` and `rtWorkflow.yaml`
- **Processor vs Router**: Router (`transformAtV1 = "router"`)
- **Auth Type**: Access Token (OAuth not used)
- **API Versioning**:
  - v2: uses `contacts`, `companies`, `events`, `tags` endpoints and `Intercom-Version: 2.10`
  - v1: uses `users`, `companies`, `tags` endpoints and `Intercom-Version: 1.4`
- **Regional Endpoints**:
  - US: `https://api.intercom.io`
  - EU: `https://api.eu.intercom.io`
  - AU: `https://api.au.intercom.io`

### Supported Message Types

- Cloud mode: Identify, Track, Group
- Device mode (via SDK): Web: Identify, Track, Page; Android/iOS: Identify, Track (per `db-config.json`)

### Batching Support

- Cloud router flow returns `batched: false` in `rtWorkflow.yaml`. No request batching is implemented in the transformer.

### Intermediate Calls and Flows

- Lookup behavior: default lookup field is `email`, can be overridden via `integrations.INTERCOM.lookup`
- Reserved attributes are filtered from `custom_attributes` and nested attributes are flattened (v2 uses `_` separator)
- Metadata handling for Track: preserves reserved structures (monetary amounts, rich links), flattens the rest

Event-specific:
- Identify (v2)
  - Search contact by lookup field: `POST /contacts/search`
  - Create or update contact:
    - If found: `PUT /contacts/{id}`
    - If not found: `POST /contacts`
  - Optional detach from a company when `traits.company.remove = true`:
    - `DELETE /contacts/{contact_id}/companies/{company_id}`
  - Required: at least one of `external_id` or `email`
- Identify (v1)
  - `POST /users` with `user_id` or `email`, `custom_attributes`, and `update_last_request_at`
- Track
  - `POST /events` with `event_name`, `user_id` or `email`, `metadata` and timestamp field (`created_at` v2, `created` v1)
  - Metadata merged with reserved handling described above
- Group (Company)
  - v2 path:
    1) Create/update company: `POST /companies` (returns `id`)
    2) If a matching contact exists (from search), attach contact to company: `POST /contacts/{id}/companies`
    3) Add tags to company, if `context.traits.tags` present: `POST /tags` with `companies: [{ id }]`
  - v1 path:
    - `POST /companies`, then legacy attach flow using `POST /users` payload (see utils `attachUserAndCompany`)
  - Group requests are marked with suppress status in router (`SUPPRESS_EVENTS`) after side-effect calls.

### Proxy Delivery

- Not applicable. This destination uses CDK v2 Router; no custom proxy `networkHandler.js` is present.

### User Deletion

- Not implemented in transformer code for Intercom. NEEDS REVIEW if supported elsewhere.

### Validations and Requirements

- Identify v2: requires `external_id` or `email`; v1: `user_id` or `email`
- Track: requires `event_name` and either `user_id` or `email`
- Group: requires `groupId` (mapped to Intercom `company_id`)
- Lookup override: `integrations.INTERCOM.lookup` selects lookup field (e.g., `email`, `external_id`)
- Custom attributes: reserved attributes removed; nested attributes flattened (v1: dot; v2: underscore)
- Company custom attribute reserved keys filtered based on API version

### Rate Limits

- Intercom commonly enforces app-level limits & workspace-level limits distributed across 10s windows. Exact limits can vary by account and endpoint.
- Every 10 seconds, the amount of permitted requests resets. For example, a default rate limit of 10000 per minute means that you can send a maximum of 1666 operations per 10 second period (10000/6).
- Responses include standard rate limit headers to guide client backoff.
- References:
  https://developers.intercom.com/docs/references/rest-api/errors/rate-limiting#what-is-the-default-amount-of-requests
- Private apps have a default rate limit of 10,000 API calls per minute per app and 25,000 API calls per minute per workspace. This means that if a workspace has multiple private apps installed, every one contributes towards total number of requests.
- Public apps have a default rate limit of 10,000 API calls per minute for each app and 25,000 API calls per minute per workspace. This means that if a workspace has multiple public apps installed, each one has its own separate request limit without contributing to the others.


### Multiplexing

- Identify v2: may trigger additional delete-attachment call when `company.remove = true` (detach contact from company)
- Group v2: multiple API calls per event: create/update company, attach contact to company (if contact found), and add tags
- Track: single API call

### Version Information

- Current supported API versions in transformer: 1.4 and 2.10 (via `Intercom-Version` header)
- Intercom maintains versioned APIs with changelogs
- Docs:
  - Intercom API Changelog index — `https://developers.intercom.com/docs/build-an-integration/learn-more/rest-apis/api-changelog`
  - 2.10 reference (release 2023-09-14) — `https://developers.intercom.com/docs/references/2.10/introduction` (confirm availability)
  - 1.4 reference — `https://developers.intercom.com/docs/references/1.4/introduction`

### Documentation Links (API Endpoints Used)

- Contacts Search: `POST /contacts/search`
- Contacts CRUD (v2): `POST /contacts`, `PUT /contacts/{id}`
- Users (v1): `POST /users`
- Companies: `POST /companies`, `GET /companies?company_id=...|name=...`
- Attach Contact to Company: `POST /contacts/{id}/companies` (v2)
- Detach Contact from Company: `DELETE /contacts/{contact_id}/companies/{company_id}` (v2)
- Events: `POST /events`
- Tags: `POST /tags`

Authoritative docs live under Intercom Developer Hub. Use the version switcher to match your `Intercom-Version`.

## General Queries

### Event Ordering

- Identify and Group update profile/company state; order matters to avoid stale overwrites
- Track events include timestamps (`created_at`/`created`) but attribute updates performed via Identify should be ordered relative to those changes to avoid inconsistencies

### Data Replay Feasibility

- Profile updates (Identify/Group): Not recommended due to ordering/stale data risks
- Track events: replaying will create duplicate events; consider downstream implications

### RETL and Business Logic

- See `docs/retl.md` and `docs/businesslogic.md` 