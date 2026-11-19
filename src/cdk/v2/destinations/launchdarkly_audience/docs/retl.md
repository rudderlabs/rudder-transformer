# LaunchDarkly Segment RETL Functionality

## Is RETL supported?

**Yes.** `supportedSourceTypes` includes `warehouse`. This is an audience destination (`isAudienceSupported: true`, `syncBehaviours: ["mirror"]`).

## Supported RETL Types

| Type        | Supported | Evidence                                                               |
| ----------- | --------- | ---------------------------------------------------------------------- |
| JSON Mapper | No        | `disableJsonMapper: true`                                              |
| VDM V1      | Yes       | `supportsVisualMapper: true`; transformer handles `audiencelist`       |
| VDM V2      | No        | `record` is not in `supportedMessageTypes`; no record handling in code |

## VDM Configuration (rudder-integrations-info)

`src/destConfigs/config/LAUNCHDARKLY_AUDIENCE.ts` and `src/routes/launchdarkly_audience/` expose one object, `customer`, with one mappable field:

| Field        | Type   | Notes                                                               |
| ------------ | ------ | ------------------------------------------------------------------- |
| `identifier` | string | Unique, required for mapping. Becomes the LaunchDarkly context key. |

No custom fields are supported.

## Connection Config

None in transformer code. Segment details (`audienceId`, `audienceName`, `audienceType`, `clientSideId`) come from destination config.

## RETL Flow

rudder-server builds `audiencelist` events with `properties.listData.add` / `remove` from the warehouse diff (mirror mode). The transformer turns them into synced-segment requests as described in [businesslogic.md](businesslogic.md).
