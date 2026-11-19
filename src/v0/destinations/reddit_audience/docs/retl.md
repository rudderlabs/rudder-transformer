# Reddit Audience RETL Functionality

## Is RETL supported?

**Yes**, and only RETL: `supportedSourceTypes: ["warehouse"]`, connection mode `cloud`, `isAudienceSupported: true`, `syncBehaviours: ["mirror"]`.

## Support Types

- **JSON Mapper**: Not applicable in practice; the transformer accepts only `record` events. NEEDS REVIEW whether `disableJsonMapper` should be set.
- **VDM v1**: No (`supportsVisualMapper` not set).
- **VDM v2**: Yes (`supportsVisualMapperV2: true`, `record` in `supportedMessageTypes`, and `routerTransform.ts` handles `record`).

## Connection Config

`connection.config.destination`:

- `audienceId`: Reddit custom audience (`ca.` prefix), selected or created in the sync wizard through `rudder-integrations-info` (`src/routes/reddit_audience/`, Ads API v3: list businesses, ad accounts, custom audiences; create audience).
- `isHashRequired`: whether the transformer hashes.
- `identifierMappings`: warehouse column → `EMAIL_SHA256` / `MAID_SHA256`.

## RETL Flow

rudder-sources diffs the warehouse model and emits `record` events with `action` (`insert`/`update`/`delete`) and `identifiers` keyed by Reddit column name. The transformer turns `insert`/`update` into `ADD` and `delete` into `REMOVE`, batches up to 2500 rows per action/column set, and PATCHes the audience. See [businesslogic.md](businesslogic.md).
