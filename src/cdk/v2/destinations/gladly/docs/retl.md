# Gladly RETL Functionality

## Is RETL supported at all?

Yes. `warehouse` is in `supportedSourceTypes` in `db-config.json`.

## RETL Support Analysis

- **JSON Mapper**: Supported (no `disableJsonMapper`).
- **VDM v1**: `supportsVisualMapper` is not set in `db-config.json`. `rudder-integrations-info` still has a
  Gladly object (`customer`) and field list (`src/destConfigs/config/GLADLY.ts`,
  `src/routes/gladly/config.ts`). **NEEDS REVIEW**: whether VDM is exposed for Gladly.
- **VDM v2**: Not supported (`record` is not a supported message type).
- **Connection config**: None.

## RETL Flow (`context.mappedToDestination` set)

Identify only. Lookup, create and update work as in event stream; field resolution differs:

| Gladly field         | Source                                                                                                   |
| -------------------- | -------------------------------------------------------------------------------------------------------- |
| `emails`             | `context.externalId[0].id` if its `identifierType` is `email`, else `traits.emails`                      |
| `phones`             | `context.externalId[0].id` if its `identifierType` is `phone`, else `traits.phones`                      |
| `externalCustomerId` | `context.externalId[0].id` if `identifierType` is `externalCustomerId`, else `traits.externalCustomerId` |
| `id`                 | `context.externalId[0].id` if `identifierType` is `id`, else `traits.id`                                 |
| `customAttributes`   | `traits.customAttributes` (object, non-empty)                                                            |
| `name`, `address`    | `traits.name`, `traits.address`                                                                          |
| `image`              | `traits.avatar`                                                                                          |

The integrations-info field list names the avatar field `image`, while the code reads `traits.avatar`. A
VDM mapping to `image` would be dropped. **NEEDS REVIEW**.
