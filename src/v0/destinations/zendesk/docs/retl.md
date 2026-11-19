# Zendesk RETL Functionality

## Is RETL supported at all?

Yes. `warehouse` is in `supportedSourceTypes` in `db-config.json`, with connection mode `cloud`.

## RETL Support Analysis

### Which type of RETL support does it have?

- **JSON Mapper**: Supported. `disableJsonMapper` is not set in `db-config.json`.
- **VDM v1**: Not supported. `supportsVisualMapper` is not set.
- **VDM v2**: Not supported. `record` is not in `supportedMessageTypes` and the code has no `record` handling.

No Zendesk VDM configuration was found in `rudder-integrations-info`.

### Connection config

None. The destination has no connection-level config for RETL.

## RETL Flow

The code has no `mappedToDestination` or RETL-specific branch. Warehouse rows reach the destination as regular `identify`, `group` or `track` events (built by the JSON mapper or the warehouse event-stream model) and follow the same flows as event-stream events. See [businesslogic.md](businesslogic.md).

Points to watch for RETL syncs:

- Identify requires `userId` and `traits.name`. Track requires `userId` and `traits.email`.
- Every identify/group row can trigger several Zendesk calls (field checks, upserts, lookups). Large syncs can hit the plan rate limit and the 5 requests per minute per user limit on `users/create_or_update`.
- Group replays fail with `User is already associated with organization` when the membership already exists.
- New columns become new Zendesk user/organization fields automatically.
