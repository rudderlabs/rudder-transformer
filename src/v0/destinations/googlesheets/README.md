# Google Sheets Destination

Implementation in **JavaScript** (v0). The transformer only shapes rows; **delivery to Google happens in rudder-server** (`services/streammanager/googlesheets/googlesheetsmanager.go`), which calls the Google Sheets API v4.

## Configuration

### Required Settings

- **Credentials** (`credentials`, secret): the full JSON key of a Google Cloud **service account**. The spreadsheet must be shared with the service account's email.
- **Sheet Id** (`sheetId`): spreadsheet ID from the sheet URL.
- **Sheet Name** (`sheetName`): tab name, for example `Sheet1`. The transformer rejects events when it is empty.
- **Map Event to Google-Sheets** (`eventKeyMap`): ordered list of `{ from, to }` pairs. `from` is a RudderStack field path or property name; `to` is the column header.

### Optional Settings

- Consent management (`consentManagement`, `oneTrustCookieCategories`, `ketchConsentPurposes`).

## Integration Functionalities

> Google Sheets supports **Cloud mode** only.

### Supported Message Types

- `supportedMessageTypes` is not set in `db-config.json`, so every message type is accepted. The transformer does not check `message.type`: identify, track, page, screen, group and alias all become rows.

### Implementation

- **Implemented in**: JavaScript, `src/v0/destinations/googlesheets/transform.js`
- **CDK v2 Enabled**: No
- **Processor vs Router**: Router (`transformAtV1: "router"`, `GOOGLESHEETS: { routerTransform: true }` in `src/features.ts`)
- `config.js` loads `data/GSMapping.json`, which does not exist. `transform.js` never requires `config.js`, so this is dead code that would throw if anything imported it.

### Config keys used in code

| Key           | Used by     | Purpose                                           |
| ------------- | ----------- | ------------------------------------------------- |
| `sheetName`   | transformer | Required check; copied to `spreadSheet` in output |
| `sheetId`     | transformer | Copied to `spreadSheetId` in output               |
| `eventKeyMap` | transformer | Column mapping                                    |
| `credentials` | server only | Service account JSON for Google auth              |

### Validations

- `sheetName` must be set, otherwise `ConfigurationError: No Spread Sheet set for this event`.
- No field-level validation. Missing values become empty strings.

### Batching Support

- **Supported**: Yes. A router call returns **one** response containing every successful event of that call: `{ batch: [...], spreadSheetId, spreadSheet }`. rudder-server appends all rows in one `spreadsheets.values.append` request.
- No size cap in the transformer; the batch size is the router batch size configured in rudder-server.

### Authentication (rudder-server)

- `google.JWTConfigFromJSON(credentials, sheets.SpreadsheetsScope)` builds an OAuth 2.0 JWT client from the service account key, scope `https://www.googleapis.com/auth/spreadsheets`. Tokens are minted and refreshed by the Google client library.
- No RudderStack OAuth flow (`auth` is not set in `db-config.json`); nothing in rudder-auth.
- **Auth change to watch**: Google Cloud organizations created on or after **May 3, 2024** enforce `iam.managed.disableServiceAccountKeyCreation` and `iam.managed.disableServiceAccountKeyUpload` by default ([secure-by-default organizations](https://docs.cloud.google.com/resource-manager/docs/secure-by-default-organizations)). Customers in such organizations cannot create the JSON key this destination needs unless an admin overrides the policy. There is no keyless option (Workload Identity Federation or user OAuth) in this destination.

### Rate Limits

- Sheets API: 300 read and 300 write requests per minute per project, 60 per minute per user per project. Exceeding returns `429` ([Usage limits](https://developers.google.com/workspace/sheets/api/limits)).
- Each router batch is one write request (plus a one-time header write per producer).

### Intermediate Calls

- None in the transformer.
- rudder-server writes the header row once per producer instance: `values.update` on `<sheetName>!A1` with `messageId` followed by every `to` value in `eventKeyMap`. This overwrites row 1.

### Proxy Delivery

- **Supported**: No. No `networkHandler.js`; delivery is a rudder-server stream manager.

### User Deletion

- **Supported**: No (`deleteUsers.js` absent).

### OAuth Support

- No RudderStack-managed OAuth. Uses service-account key auth (see above).

### Additional Functionalities

- Column 0 is always `messageId`; mapped columns follow in `eventKeyMap` order.
- Field lookup order per mapping: root path (`getValueFromMessage(message, from)`), then `properties`, `traits`, `context.traits`, each checked by exact key (so keys with spaces work) and then by dot path.

## General Queries

### Event Ordering

- Not required by the API. Rows are appended in the order rudder-server sends them; within a batch the order of `Promise.all` pushes matches input order because the work is synchronous.

### Data Replay Feasibility

- **Missing data**: Replay is possible; rows are appended, so late data appears at the bottom.
- **Already delivered data**: Replaying duplicates rows. `values.append` has no upsert; the `messageId` column can be used to dedupe manually.

### Multiplexing

- No. One event becomes one row.

## Version Information

### Current Version

- **Version:** `v4`
- **Where in code:** rudder-server `services/streammanager/googlesheets/googlesheetsmanager.go` (imports `google.golang.org/api/sheets/v4`; `google.golang.org/api` v0.307.0 in rudder-server `go.mod`). The transformer only builds the payload.

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Google Sheets API release notes](https://developers.google.com/workspace/sheets/release-notes)

Auth-related: service-account key creation is blocked by default in new Google Cloud organizations since 2024-05-03 (see Authentication and [Secure-by-default organizations](https://docs.cloud.google.com/resource-manager/docs/secure-by-default-organizations)).

### Latest Available Version

- **Version:** `v4`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [Sheets API v4 reference](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/append)

The Go client module `google.golang.org/api` is at v0.315.0 (2026-11-13); rudder-server uses v0.307.0. Both expose the same Sheets API v4.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## Documentation Links

- [Sheets API: spreadsheets.values.append](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/append)
- [Sheets API usage limits](https://developers.google.com/workspace/sheets/api/limits)
- [Sheets API: authorize requests](https://developers.google.com/workspace/sheets/api/guides/authorizing)
- [Create access credentials (service accounts)](https://developers.google.com/workspace/guides/create-credentials)
- [Secure-by-default organizations (service account key policy)](https://docs.cloud.google.com/resource-manager/docs/secure-by-default-organizations)
- [Go client package `sheets/v4`](https://pkg.go.dev/google.golang.org/api/sheets/v4)

### Changelog References

- **Changelog:** [Google Sheets API release notes](https://developers.google.com/workspace/sheets/release-notes); [Google Workspace developer release notes](https://developers.google.com/workspace/release-notes)
- **Deprecations:** None found
- **Versions:** None found
- **Feed:** [Google Workspace Updates blog feed](https://workspaceupdates.googleblog.com/feeds/posts/default); [google-api-go-client releases (Atom)](https://github.com/googleapis/google-api-go-client/releases.atom)
- **Announcements:** [Secure-by-default organizations: service account key creation blocked from 2024-05-03](https://docs.cloud.google.com/resource-manager/docs/secure-by-default-organizations)
- **Last checked:** 2026-11-16

## FAQ
