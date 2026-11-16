# Amazon S3 Destination

## Overview

Amazon S3 is an object storage destination. The transformer's `process` is a pass-through: it returns `event.message` unchanged. In practice the transformer is not called, because `db-config.json` sets `transformAtV1: "none"` and rudder-server skips destination transformation for S3.

Delivery happens in rudder-server's batch router. It writes events to gzipped JSON files and uploads them to the customer's bucket with the `rudder-go-kit` file manager, which is built on `aws-sdk-go-v2`.

- **Transformer code**: `src/v0/destinations/s3/transform.js` (JavaScript)
- **Server code**: `router/batchrouter/` in rudder-server; S3 upload in `rudder-go-kit/filemanager/s3manager.go`

## Configuration

The transformer reads no config. rudder-server uses (from `schema.json`):

- **`bucketName`**: Target bucket.
- **`prefix`**: Optional folder prefix in the bucket.
- **`roleBasedAuth`**: Use IAM role assumption instead of access keys.
- **`enableSSE`**: Enable server-side encryption.

## Integration Functionalities

### Supported Message Types

All events are passed through; `db-config.json` has no `supportedMessageTypes` filter. Cloud mode only.

### Downstream delivery (rudder-server)

- S3 is in rudder-server's batch destinations list (`utils/misc/misc.go`).
- The batch router collects jobs, writes them as `.json.gz` files under `<prefix>/rudder-logs/...` (folder name set by `DESTINATION_BUCKET_FOLDER_NAME`, default `rudder-logs`), and uploads them.
- User deletion for S3 is handled by rudder-server's regulation worker (`regulation-worker/internal/delete/batch/batch.go`), not the transformer.

### Other Functionalities

- **Batching**: Yes, by the batch router into files.
- **Intermediate calls**: None in the transformer.
- **Proxy delivery**: No `networkHandler.js`.
- **User deletion**: No `deleteUsers.js` in the transformer; rudder-server handles it.
- **OAuth**: No.

## General Queries

### Event Ordering

Not required. Events land in files; ordering inside a file follows job order but consumers should not depend on it.

### Data Replay Feasibility

- **Missing data**: Feasible; replay creates new files.
- **Already delivered data**: Creates duplicate records in new files. Deduplicate downstream (for example by `messageId`).

### Multiplexing

No.

## Version Information

### Current Version

There is no partner HTTP API version. rudder-server uses `github.com/aws/aws-sdk-go-v2` **v1.47.4** and `github.com/aws/aws-sdk-go-v2/service/s3` **v1.114.5**, through `rudder-go-kit` v0.86.0 (rudder-server `go.mod`, checked November 2026).

### Version Deprecation

AWS SDK for Go v2 is the supported major version, with no announced end-of-support. AWS SDK for Go v1 reached end-of-support on July 31, 2025; rudder-server's S3 upload path already uses v2.

### Latest Available Version

- `aws-sdk-go-v2` core: **v1.48.0** (November 10, 2026)
- `service/s3`: **v1.114.10** (November 10, 2026)

AWS publishes `aws-sdk-go-v2` releases daily as `release-YYYY-MM-DD` tags.

## Documentation Links

- [AWS SDK for Go v2 repository](https://github.com/aws/aws-sdk-go-v2)
- [AWS SDK for Go](https://aws.amazon.com/sdk-for-go/)

### Changelog References

- Release notes: [https://github.com/aws/aws-sdk-go-v2/releases](https://github.com/aws/aws-sdk-go-v2/releases)
- S3 module changelog: [https://github.com/aws/aws-sdk-go-v2/blob/main/service/s3/CHANGELOG.md](https://github.com/aws/aws-sdk-go-v2/blob/main/service/s3/CHANGELOG.md)
- Deprecations: [AWS SDKs and Tools maintenance policy](https://docs.aws.amazon.com/sdkref/latest/guide/maint-policy.html)
- Versions and support status: [AWS SDKs and Tools version support matrix](https://docs.aws.amazon.com/sdkref/latest/guide/version-support-matrix.html), [pkg.go.dev versions for service/s3](https://pkg.go.dev/github.com/aws/aws-sdk-go-v2/service/s3?tab=versions)
- Atom feed: [https://github.com/aws/aws-sdk-go-v2/releases.atom](https://github.com/aws/aws-sdk-go-v2/releases.atom) (returned HTTP 502 when checked; NEEDS REVIEW)

## FAQ
