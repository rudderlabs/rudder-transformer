# TikTok Audience RETL Functionality

## Is RETL supported?

**Yes**. `supportedSourceTypes` is `["warehouse"]` only, and `isAudienceSupported: true`.

## Types of RETL support

- **JSON Mapper**: Not supported (`disableJsonMapper: true`).
- **VDM V1**: `supportsVisualMapper` is not set, but the code still handles the legacy `audiencelist` message type. **NEEDS REVIEW**: confirm whether any connections still use it.
- **VDM V2**: Supported (`supportsVisualMapperV2: true`, `record` in `supportedMessageTypes`, handled in `recordTransform.ts`).

## Connection config

From `connection.config.destination`:

| Key              | Purpose                                          |
| ---------------- | ------------------------------------------------ |
| `audienceId`     | TikTok segment ID; sent in every `audience_ids`  |
| `isHashRequired` | Whether RudderStack normalizes and hashes values |

The audience list, audience creation (`/open_api/v1.3/segment/audience/`) and identifier field list (the six `*_SHA256` / `*_MD5` traits) come from `rudder-integrations-info` (`src/routes/tiktok_audience/`).

## Sync behaviour

- `syncBehaviours: ["mirror"]`: inserts and updates add users; deletes remove users.

## RETL flow

See [businesslogic.md](businesslogic.md) for the record flow, grouping and hashing.
