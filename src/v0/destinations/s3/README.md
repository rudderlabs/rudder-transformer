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

- **API:** AWS SDK for Go v2 core (`github.com/aws/aws-sdk-go-v2`)
- **Version:** `v1.47.4`
- **Where in code:** rudder-server `go.mod`; S3 calls are made through `rudder-go-kit` v0.86.0 `filemanager/s3manager.go`
- **API:** S3 service client (`github.com/aws/aws-sdk-go-v2/service/s3`)
- **Version:** `v1.114.5`
- **Where in code:** rudder-server `go.mod`; `rudder-go-kit` `filemanager/s3manager.go` (`PutObject` through the `feature/s3/manager` uploader)

There is no partner API version to track; the S3 REST API itself is stable. The version that matters is the SDK in rudder-server.

### Version Deprecation

- **API:** AWS SDK for Go v2 core
- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [AWS SDKs and Tools version support matrix](https://docs.aws.amazon.com/sdkref/latest/guide/version-support-matrix.html)
- **API:** S3 service client
- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [AWS SDKs and Tools version support matrix](https://docs.aws.amazon.com/sdkref/latest/guide/version-support-matrix.html)

AWS SDK for Go v1 reached end-of-support on 2025-07-31 ([announcement](https://aws.amazon.com/blogs/developer/announcing-end-of-support-for-aws-sdk-for-go-v1-on-july-31-2025/)); rudder-server's S3 upload path already uses v2.

### Latest Available Version

- **API:** AWS SDK for Go v2 core
- **Version:** `v1.48.0`
- **Released:** 2026-11-10
- **Upgrade needed:** Yes
- **Source:** [aws-sdk-go-v2 releases](https://github.com/aws/aws-sdk-go-v2/releases)
- **API:** S3 service client
- **Version:** `v1.114.10`
- **Released:** 2026-11-10
- **Upgrade needed:** Yes
- **Source:** [service/s3 CHANGELOG](https://github.com/aws/aws-sdk-go-v2/blob/main/service/s3/CHANGELOG.md)

AWS publishes `aws-sdk-go-v2` releases almost daily as `release-YYYY-MM-DD` tags. The gap is routine minor/patch releases, not a breaking change.

## Documentation Links

- [AWS SDK for Go v2 repository](https://github.com/aws/aws-sdk-go-v2)
- [AWS SDK for Go](https://aws.amazon.com/sdk-for-go/)
- [AWS SDK for Go v2 developer guide](https://docs.aws.amazon.com/sdk-for-go/v2/developer-guide/welcome.html)
- [Configure the SDK (credentials and region)](https://docs.aws.amazon.com/sdk-for-go/v2/developer-guide/configure-gosdk.html)
- [Amazon S3 API reference](https://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html)
- [S3 PutObject](https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutObject.html)
- [S3 CreateMultipartUpload](https://docs.aws.amazon.com/AmazonS3/latest/API/API_CreateMultipartUpload.html)

### Changelog References

- **Changelog:** [aws-sdk-go-v2 releases](https://github.com/aws/aws-sdk-go-v2/releases); [service/s3 CHANGELOG](https://github.com/aws/aws-sdk-go-v2/blob/main/service/s3/CHANGELOG.md); [Amazon S3 document history](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WhatsNew.html)
- **Deprecations:** [AWS SDKs and Tools maintenance policy](https://docs.aws.amazon.com/sdkref/latest/guide/maint-policy.html)
- **Versions:** [AWS SDKs and Tools version support matrix](https://docs.aws.amazon.com/sdkref/latest/guide/version-support-matrix.html); [service/s3 versions (pkg.go.dev)](https://pkg.go.dev/github.com/aws/aws-sdk-go-v2/service/s3?tab=versions)
- **Feed:** [AWS Developer Tools blog feed](https://aws.amazon.com/blogs/developer/feed/); [AWS What's New feed](https://aws.amazon.com/about-aws/whats-new/recent/feed/)
- **Announcements:** [AWS SDK for Go v1 end-of-support on 2025-07-31](https://aws.amazon.com/blogs/developer/announcing-end-of-support-for-aws-sdk-for-go-v1-on-july-31-2025/)
- **Last checked:** 2026-11-16

The GitHub `releases.atom` feed for `aws-sdk-go-v2` returned HTTP 502 on 2026-11-16 (likely too many releases), so it is not listed.

## FAQ
