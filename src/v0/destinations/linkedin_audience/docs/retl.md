# LinkedIn Audience RETL Functionality

## Is RETL supported?

**Yes.** `supportedSourceTypes` is `["warehouse"]` only. Audience destination with mirror sync.

## Supported RETL Types

| Type        | Supported    | Evidence                                                                                                                            |
| ----------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| JSON Mapper | NEEDS REVIEW | `disableJsonMapper` is not set, but the transformer only accepts `record` events, so JSON Mapper output (identify/track) would fail |
| VDM V1      | No           | `supportsVisualMapper` is not set                                                                                                   |
| VDM V2      | Yes          | `supportsVisualMapperV2: true`, `supportedMessageTypes.cloud: ["record"]`, record handling in `transform.ts`                        |

## Connection Config

`connection.config.destination`:

| Key              | Type                | Required | Purpose                                                    |
| ---------------- | ------------------- | -------- | ---------------------------------------------------------- |
| `audienceId`     | string \| number    | Yes      | DMP segment ID                                             |
| `audienceType`   | `user` \| `company` | Yes      | Users or companies endpoint                                |
| `isHashRequired` | boolean             | Yes      | Hash emails in the transformer or expect pre-hashed values |

## Audience Management (rudder-integrations-info)

`src/routes/linkedin_audience/` handles the VDM audience setup:

- Lists ad accounts (`GET /rest/adAccounts?q=search`).
- Lists segments for an account (`GET /rest/dmpSegments?q=account&account=urn:li:sponsoredAccount:{id}&sourcePlatform=RUDDERSTACK`).
- Creates a segment (`POST /rest/dmpSegments`, `sourcePlatform: RUDDERSTACK`, `type` from the audience type).
- Reads segment details and matched size (`GET /rest/dmpSegments/{id}`).

It returns an empty field list; the webapp defines the mappable identifiers and fields.

## RETL Flow

The warehouse diff (mirror mode) produces `record` events with `insert`, `update` or `delete`. These map to `ADD`/`REMOVE` elements as described in [businesslogic.md](businesslogic.md).
