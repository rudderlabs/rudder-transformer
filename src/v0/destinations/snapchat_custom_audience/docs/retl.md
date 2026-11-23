# Snapchat Custom Audience RETL Functionality

## Is RETL supported?

Yes. `supportedSourceTypes` includes `warehouse` (also `cloud`, `shopify`). It is an audience destination (`isAudienceSupported: true`, `syncBehaviours: ["mirror"]`).

## RETL Support Types

| Type        | Supported | Evidence                                                                  |
| ----------- | --------- | ------------------------------------------------------------------------- |
| JSON Mapper | No        | `disableJsonMapper: true`.                                                |
| VDM V1      | Yes       | `supportsVisualMapper: true`.                                             |
| VDM V2      | No        | No `record` in `supportedMessageTypes`; code only handles `audiencelist`. |

## VDM Fields

From rudder-integrations-info (`src/destConfigs/config/SNAPCHAT_CUSTOM_AUDIENCE.ts`): one object, `customer`, with fields `email`, `mobileAdId`, `phone` (no custom fields). The configured `schema` decides which one is sent; Snap accepts one identifier type per request.

## Connection Config

None beyond destination config (`segmentId`, `schema`, `disableHashing`).

## RETL Flow

The warehouse sync sends `audiencelist` events with `properties.listData.add` / `remove` arrays of mapped rows (mirror mode: added and removed rows). The transformer handles them as described in [businesslogic.md](businesslogic.md). There is no `mappedToDestination` handling.
