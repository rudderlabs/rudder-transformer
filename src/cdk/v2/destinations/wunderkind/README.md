# Wunderkind Destination

Implementation in **CDK v2** (`procWorkflow.yaml` + `rtWorkflow.yaml`)

## Overview

Wunderkind is a performance marketing platform that identifies anonymous visitors and sends personalized email and SMS. RudderStack forwards track events to Wunderkind by invoking a **Wunderkind-owned AWS Lambda function**, not an HTTP API. The transformer only builds the Lambda payload; rudder-server (`services/streammanager/wunderkind`) performs the invocation.

## Configuration

### Required Settings

All three are provided by the Wunderkind Technical Account Manager:

- **Account ID** (`accountID`)
- **Instance ID** (`instanceID`)
- **API Key** (`apiKey`)

### Optional Settings

- **Consent management** (`consentManagement`, `oneTrustCookieCategories`, `ketchConsentPurposes`).

### rudder-server environment (delivery)

- `WUNDERKIND_REGION`, `WUNDERKIND_IAM_ROLE_ARN`, `WUNDERKIND_EXTERNAL_ID`: role-based AWS auth for the Lambda client.
- `WUNDERKIND_LAMBDA`: Lambda function name to invoke.

## Integration Functionalities

> Cloud mode only.

### Supported Message Types

- **Track**: Yes. All other types fail with `message type <type> is not supported`.

From `db-config.json`:

```json
"supportedMessageTypes": { "cloud": ["track"] }
```

Supported source types: android, androidKotlin, ios, iosSwift, web, unity, amp, cloud, warehouse, reactnative, flutter, cordova, shopify.

### Config keys used in code

`accountID`, `instanceID`, `apiKey`.

### Batching Support

- **Supported**: No. The router workflow runs the processor workflow per event and returns `batched: false`. Each event is one Lambda invocation.

### Intermediate Calls

None.

### Proxy Delivery

- **Supported**: No. Delivery is an AWS Lambda `Invoke` from rudder-server (`InvocationType: RequestResponse`).

### User Deletion

- **Supported**: No.

### OAuth Support

- **Supported**: No. The account credentials are embedded in the Lambda payload; AWS access uses rudder-server's IAM role.

### Processor vs Router

- `transformAtV1: "router"`; `src/features.ts` has `routerTransform: true, cdkV2: true`.

### Additional Functionalities

- **Pass-through payload fields** from the `integrations.Wunderkind` object:
  - `lambdaRootLevelProperties`: spread into the root of the Lambda payload (for example `type`, `id`, `timestamp_ms`, `source_id`, `source_channel`, `user_identities`, `runtime_environment`).
  - `extraEventProperties`: spread into the single event object (for example `type`, `id`, `timestamp_ms`, `name`, `session_id`, `screen_name`, `custom_event_type`).
- The integration relies on the sender populating these objects in the Wunderkind schema; RudderStack does not map standard fields (event name, timestamp, user IDs) into them.

### Validations

- `message.type` must be present and must be `track`.
- `accountID`, `instanceID`, `apiKey` must be present.
- rudder-server rejects an empty `payload` with 400.

### Rate Limits

- No public Wunderkind or Lambda-side limits are documented for this integration. Lambda concurrency limits of the Wunderkind account apply. NEEDS REVIEW.

## General Queries

### Event Ordering

- **Track**: Events carry their own `timestamp_ms` (through `extraEventProperties` / `lambdaRootLevelProperties`), so strict ordering is not expected to be required. Wunderkind's processing semantics are not publicly documented. NEEDS REVIEW.

### Data Replay Feasibility

- **Missing data replay**: Likely feasible because events carry their own timestamps. NEEDS REVIEW with Wunderkind.
- **Already delivered data replay**: Events include an `id` supplied by the sender; whether Wunderkind deduplicates on it is not documented. NEEDS REVIEW.

### Multiplexing

- **No**. One track event produces one Lambda payload.

## Version Information

### Current Version

- Not versioned. Payload is the Wunderkind "event processing request" shape sent to an account-specific Lambda function.

### Version Deprecation

- Not applicable. No public API or deprecation schedule. NEEDS REVIEW with Wunderkind.

### Latest Available Version

- Not applicable.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## Documentation Links

- [Wunderkind](https://www.wunderkind.co)
- [AWS Lambda Invoke API](https://docs.aws.amazon.com/lambda/latest/api/API_Invoke.html)

### Changelog References

- NEEDS REVIEW: Wunderkind publishes no public developer changelog, release notes, deprecations page or feed for this Lambda integration. Changes are communicated through the Wunderkind Technical Account Manager.

## FAQ

_No entries yet._
