# Redis Destination

## Overview

Redis is a key-value destination. The transformer only shapes `identify` events into a key and a set of fields. It makes no network calls. Delivery to Redis happens in rudder-server, which connects to the customer's Redis instance using `go-redis` v9.

- **Transformer code**: `src/v0/destinations/redis/transform.js` (JavaScript)
- **Server code**: `services/kvstoremanager/redis/redis.go` and `router/customdestinationmanager/customdestinationmanager.go` in rudder-server

## Configuration

Config keys read by the transformer (`destination.Config`):

- **`prefix`** (optional): Prepended to the key as `<prefix>:`.
- **`useJSONModule`** (optional): Store the user as a RedisJSON document instead of a hash.

Config keys read only by rudder-server when it creates the Redis client:

- **`address`**: Redis host and port.
- **`password`**: Redis password (secret).
- **`database`**: Database index (non-cluster mode).
- **`clusterMode`**: Use a cluster client. Defaults to `true` in rudder-server when missing.
- **`secure`**, **`skipVerify`**, **`caCertificate`**: TLS settings.

## Integration Functionalities

### Supported Message Types

- **Identify** only. Every other type fails with `Only Identify calls are supported`.
- `db-config.json`: `transformAtV1: "processor"`, `supportedMessageTypes.cloud: ["identify"]`. Cloud mode only.
- Supported source types include `warehouse`, so Reverse ETL and Profiles syncs can send to Redis.

### What the transformer produces

| Case                                                                                           | Output `message`                                                                                                                                                    | Server operation |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| Default                                                                                        | `{ key: "<prefix>:user:<userId>", fields }`: `context.traits` and `traits` flattened with `.`; nulls and empty objects dropped; values stringified (arrays as JSON) | `HMSET`          |
| `useJSONModule: true`                                                                          | `{ key: "<prefix>:user:<userId>", value: traits }`                                                                                                                  | `JSON.SET`       |
| Profiles event (`context.sources` has `profiles_entity`, `profiles_id_type`, `profiles_model`) | `{ hash: "<workspaceId>:<destinationId>:<entity>:<idType>:<userId>", key: <profiles_model>, value: JSON.stringify(traits) }`                                        | `HSET`           |
| Profiles event with `useJSONModule: true`                                                      | `{ key: "<workspaceId>:<destinationId>:<entity>:<idType>:<userId>", path: <profiles_model>, value: traits }`                                                        | `JSON.SET`       |

### Validations

- `userId` is required (`Blank userId passed in identify event`).
- In the default hash mode, at least one non-empty trait is required (`context or context.traits or traits is empty`).

### Downstream delivery (rudder-server)

- The router's custom destination manager treats Redis as a KV destination and picks the operation: `JSON.SET` when `useJSONModule` is set, `HSET` when the payload has `hash`/`key`/`value`, otherwise `HMSET`.
- Errors containing `connection refused` or `invalid password` are aborted; other errors are retried.

### Other Functionalities

- **Batching**: No.
- **Intermediate calls**: None in the transformer.
- **Proxy delivery**: No `networkHandler.js`; delivery is in rudder-server.
- **User deletion**: No `deleteUsers.js`.
- **OAuth**: No.

## General Queries

### Event Ordering

Writes overwrite fields of the same key, so an older identify delivered after a newer one replaces newer values. Ordering matters.

### Data Replay Feasibility

- **Missing data**: Safe to replay; `HMSET`/`HSET`/`JSON.SET` are idempotent per key.
- **Already delivered data**: Safe for the same payload, but replaying older events can overwrite newer values.

### Multiplexing

No. One identify produces one Redis write.

## Version Information

### Current Version

There is no partner HTTP API. rudder-server uses the Go client `github.com/redis/go-redis/v9` at **v9.23.0** (rudder-server `go.mod`, checked November 2026).

### Version Deprecation

go-redis does not publish end-of-life dates. The project supports the last two Go versions and the last three Redis releases (Redis 8.x at the time of writing). No v10 module has been released.

### Latest Available Version

**v9.23.0** (released October 5, 2026), the version rudder-server already uses.

## Documentation Links

- [go-redis repository](https://github.com/redis/go-redis)
- [go-redis guide (redis.io)](https://redis.io/docs/latest/develop/clients/go/)

### Changelog References

- Release notes: [https://github.com/redis/go-redis/releases](https://github.com/redis/go-redis/releases)
- Release notes file: [https://github.com/redis/go-redis/blob/master/RELEASE-NOTES.md](https://github.com/redis/go-redis/blob/master/RELEASE-NOTES.md)
- Versions: [https://pkg.go.dev/github.com/redis/go-redis/v9?tab=versions](https://pkg.go.dev/github.com/redis/go-redis/v9?tab=versions)
- Deprecations / sunset dates: none published; support policy is in the [README](https://github.com/redis/go-redis/blob/master/README.md). NEEDS REVIEW
- Atom feed: [https://github.com/redis/go-redis/releases.atom](https://github.com/redis/go-redis/releases.atom)

## FAQ
