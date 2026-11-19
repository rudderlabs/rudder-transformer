# LinkedIn Audience Destination

Implementation in **TypeScript** (v0 native)

## Configuration

### Destination Config

- **Account** (`rudderAccountId`, required): LinkedIn OAuth account (`DESTINATION_LINKEDIN_AUDIENCE_OAUTH`). The access token arrives in `metadata.secret.accessToken`.

### Connection Config (`connection.config.destination`)

Set per warehouse-source connection through VDM v2:

- **audienceId** (string or number, required): LinkedIn DMP segment ID.
- **audienceType** (`user` | `company`, required): selects the users or companies endpoint.
- **isHashRequired** (boolean, required): when `true`, the transformer normalizes and hashes email identifiers; when `false`, they must already be hashed.

## Integration Functionalities

> Cloud mode, warehouse sources only. Audience destination (`isAudienceSupported: true`, `syncBehaviours: ["mirror"]`).

### Implementation

- **Implemented in**: TypeScript (v0), `src/v0/destinations/linkedin_audience/`
- **CDK v2 Enabled**: No in practice. `db-config.json` still has `cdkV2Enabled: true`, but the CDK workflow was removed (commit d8610809b, INT-6211) and `src/features.ts` has `LINKEDIN_AUDIENCE: { routerTransform: true }` without `cdkV2`. NEEDS REVIEW: the stale `cdkV2Enabled` flag in integrations-config.
- **Processor vs Router**: Router destination (`transformAtV1: "router"`). Only `processRouterDest` is exported.

### Supported Message Types

- **record** only (VDM v2), with `action` `insert`, `update` or `delete`.

### Batching Support

- **Supported**: Yes. Events are grouped by LinkedIn action (`ADD` for insert/update, `REMOVE` for delete) and chunked into requests of up to **5000** elements (`MAX_BATCH_SIZE`, overridable with env `LINKEDIN_AUDIENCE_MAX_BATCH_SIZE`). Sent with `X-RestLi-Method: BATCH_CREATE`.

### Intermediate Calls

- None.

### Proxy Delivery

- **Supported**: No (no `networkHandler`). `LINKEDIN_AUDIENCE` has no `transformerProxy` flag.

### User Deletion

- **Supported**: No.

### OAuth Support

- **Supported**: Yes (`auth.type: "OAuth"`, role `linkedin_audience`, account definition `DESTINATION_LINKEDIN_AUDIENCE_OAUTH`).
- rudder-auth scopes: `r_ads`, `rw_conversions`, `rw_dmp_segments`, `profile`, `email`, `openid`. Refresh via `https://www.linkedin.com/oauth/v2/accessToken`.

### Validations

Input is validated with Zod (`types.ts`):

- `message.type` = `record`; `action` in `insert` / `update` / `delete`.
- `identifiers` and `fields` are string (or null) maps.
- `metadata.secret.accessToken` and `metadata.workspaceId` are present.
- `connection.config.destination` has `audienceId`, `audienceType`, `isHashRequired`.

User audiences:

- Identifier keys must be `sha256Email`, `sha512Email` or `googleAid`.
- With `isHashRequired: true`, already-hashed emails are rejected; with `false`, unhashed emails are rejected.
- Invalid emails / empty Google AIDs are dropped (metric `linkedin_audience_invalid_field`); if no identifier remains, the record fails.

Company audiences:

- Identifier keys must be `companyName`, `organizationUrn`, `companyWebsiteDomain`, `companyEmailDomain` or `companyPageUrl`; at least one non-null.

### Rate Limits

From [DMP Segment Users](https://learn.microsoft.com/en-us/linkedin/marketing/matched-audiences/create-and-manage-segment-users): 600 requests per minute per member for `/users` (a 1-minute limit also applies to `/companies`), on top of daily app/member quotas. Up to 5000 users per batch request.

## General Queries

### Event Ordering

**Required.** Records add or remove members. An older `delete` processed after a newer `insert` (or the reverse) leaves the wrong membership. Within one router batch, ADD and REMOVE requests are sent as separate requests, so relative order between them is not preserved.

### Data Replay Feasibility

- **Missing data**: feasible if replayed in order.
- **Already delivered data**: LinkedIn returns `201` when adding an existing ID or removing a removed ID, so re-sending is idempotent.

### Multiplexing

**No.** Each record becomes one element. Several records are batched into one request.

## Version Information

### Current Version

- **Version:** `202603`
- **Where in code:** `config.ts` (`API_VERSION`, sent as the `LinkedIn-Version` header)

Endpoints `/rest/dmpSegments/{id}/users` and `/rest/dmpSegments/{id}/companies`. rudder-integrations-info (audience listing/creation) also uses `202603`.

### Version Deprecation

- **Status:** Supported
- **Sunset date:** 2027-03-16
- **Source:** [Migrations](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/migrations)

### Latest Available Version

- **Version:** `202610`
- **Released:** Unknown
- **Upgrade needed:** Yes
- **Source:** [Recent Marketing API Changes](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/recent-changes)

`202610` (October 2026) is marked Latest on the Recent Marketing API Changes page as of 2026-11-16.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## Documentation Links

- [DMP Segment Users](https://learn.microsoft.com/en-us/linkedin/marketing/matched-audiences/create-and-manage-segment-users)
- [DMP Segment Companies](https://learn.microsoft.com/en-us/linkedin/marketing/matched-audiences/create-and-manage-segment-companies)
- [LinkedIn Marketing API versioning](https://learn.microsoft.com/en-us/linkedin/marketing/versioning)
- [LinkedIn OAuth 2.0 authorization code flow](https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow)

### Changelog References

- **Changelog:** [Recent Marketing API Changes](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/recent-changes)
- **Deprecations:** [Migrations (version sunset dates)](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/migrations)
- **Versions:** [Migrations](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/migrations); [LinkedIn Marketing API versioning](https://learn.microsoft.com/en-us/linkedin/marketing/versioning)
- **Feed:** None found
- **Announcements:** None found
- **Last checked:** 2026-11-16

## FAQ

_To be populated._
