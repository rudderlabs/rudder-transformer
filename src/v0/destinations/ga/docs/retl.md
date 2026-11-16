# Google Analytics (UA) / GA360 RETL Functionality

## Is RETL supported?

**Yes** for both GA and GA360: `warehouse` is in `supportedSourceTypes` with `cloud` connection mode. Note that UA no longer processes data (see the README), so RETL syncs to these destinations have no effect at Google.

## Support Types

| Type        | GA                                           | GA360                               |
| ----------- | -------------------------------------------- | ----------------------------------- |
| JSON Mapper | Yes (`disableJsonMapper` not set)            | Yes                                 |
| VDM v1      | Yes (`supportsVisualMapper: true`)           | No (`supportsVisualMapper` not set) |
| VDM v2      | No (`record` not in `supportedMessageTypes`) | No                                  |

## VDM v1 Objects

`rudder-integrations-info` (`src/destConfigs/config/GA.ts`, route `src/routes/ga/`) exposes a `user` object whose identifier/fields include `uid`, `cid`, `ds`, `uip`, `ua`, `cn`, `cs`, `ck`, `cc`, `ci`, `ul`, `aiid`, `av`, `an`, plus custom fields from the config backend.

## Connection Config

None specific to this destination.

## RETL Flow

VDM v1 events arrive as `identify` with `context.mappedToDestination: true`:

1. `processIdentify` calls `addExternalIdToTraits` so the mapped identifier lands in traits.
2. If `context.externalId[0].identifierType === 'uid'`, `adduserIdFromExternalId` sets `message.userId`.
3. Mapped traits such as `cid`, `uip`, `ds`, `ua`, `ul`, campaign and app fields override the context-derived values.
4. `enableServerSideIdentify` must still be `true`, or the event fails.
