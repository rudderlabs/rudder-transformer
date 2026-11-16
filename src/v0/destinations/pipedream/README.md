# Pipedream Destination

Implementation in **JavaScript** (v0, not CDK v2). Code: `src/v0/destinations/pipedream/transform.js`.

The transform is a thin wrapper around the Webhook destination: it calls `processEvent` from `src/v0/destinations/webhook/transform.js` with `DESTINATION = 'pipedream'`. All request-building logic lives in the webhook code.

## Overview

Sends each RudderStack event, unchanged, to a Pipedream HTTP trigger URL (a workflow or source endpoint, usually `https://<id>.m.pipedream.net`).

## Configuration

| Config key        | UI label      | Used for                                                                                 |
| ----------------- | ------------- | ---------------------------------------------------------------------------------------- |
| `pipedreamUrl`    | Pipedream URL | Request URL. Required in `schema.json` (`http(s)` URL, or template/env pattern).         |
| `pipedreamMethod` | URL Method    | `POST` (default), `PUT`, `PATCH`, `GET`, `DELETE`.                                       |
| `headers`         | Headers       | Static `from`/`to` header pairs added to every request. `headers.to` is in `secretKeys`. |

## Integration Functionalities

### Supported Message Types

`db-config.json` has no `supportedMessageTypes`, so all types are accepted. The code does not branch on type except for GET/DELETE query params (identify uses traits, others use properties).

### Authentication

None built in. The URL alone identifies the endpoint. Customers can add an auth header through the `headers` config.

Pipedream HTTP triggers are public by default. They can be locked down with a static custom token (sent as `Authorization: Bearer <token>`) or with OAuth (Pipedream OAuth client, bearer access token). A static custom token works with the `headers` config. **OAuth access tokens expire, and this destination has no token refresh, so OAuth-protected triggers will start failing once the token expires.** ([Triggers docs](https://pipedream.com/docs/workflows/building-workflows/triggers))

No Pipedream announcement changing HTTP trigger auth was found.

### Validations

- `pipedreamUrl` must be set, else `ConfigurationError("Invalid URL in destination config")`.

### Rate Limits

From [Pipedream limits](https://pipedream.com/docs/workflows/limits):

- About 10 requests/second average per HTTP trigger (short bursts allowed; paid plans can request more). Excess returns 429.
- Request body up to 512 KB; larger returns 413.

### Batching Support

**No.** One request per event.

### Intermediate Calls

None.

### Proxy Delivery

**No.** No `networkHandler.js`.

### User Deletion

**No.**

### OAuth Support

**No.**

### Processor vs Router

**Processor** (`transformAtV1: "processor"`). A `processRouterDest` exists but Pipedream is not in `features.ts`, so the router path is not used.

### Additional Functionalities (from the webhook code)

- Sets `context.ip` from `request_ip` if missing.
- Dynamic headers: a `header` object on the message (set by a user transformation) is merged into request headers and removed from the body.
- Dynamic URL: `fullPath` (message or `integrations.pipedream.fullPath`) replaces the URL; `appendPath` is appended to it.

## General Queries

### Event Ordering

Depends on the customer's workflow. Pipedream runs workflow executions concurrently by default, so it does not preserve order itself.

### Data Replay Feasibility

- **Missing data**: Feasible; the workflow receives events with their original timestamps in the body.
- **Already delivered**: Each request triggers a new workflow run. Deduplication must be done in the workflow (for example on `messageId`).

### Multiplexing

**No.**

## Version Information

### Current Version

- **Version:** `Unversioned`
- **Where in code:** `src/v0/destinations/webhook/transform.js` (`processEvent`, `destination.Config.pipedreamUrl`), called from `src/v0/destinations/pipedream/transform.js`

Pipedream HTTP triggers are customer-specific URLs with no API version.

### Version Deprecation

- **Status:** Deprecated
- **Sunset date:** 2027-03-31
- **Source:** [Workflows and String are shutting down on March 31, 2027](https://pipedream.com/docs/workflows)

Pipedream Workflows (which own the HTTP triggers this destination posts to) is in maintenance mode: sign-ups and new subscriptions are closed, existing workflows run until 2027-03-31, and all Workflows data is deleted by 2027-04-30. Pipedream Connect is not affected. After the shutdown, events sent to workflow HTTP trigger URLs are expected to fail. NEEDS REVIEW: confirm what the trigger URLs return after 2027-03-31 and plan the destination's deprecation.

### Latest Available Version

- **Version:** `Unversioned`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [Pipedream triggers (HTTP)](https://pipedream.com/docs/workflows/building-workflows/triggers)

## Documentation Links

- [Pipedream triggers (HTTP)](https://pipedream.com/docs/workflows/building-workflows/triggers)
- [Pipedream limits](https://pipedream.com/docs/workflows/limits)

### Changelog References

- **Changelog:** [Pipedream changelog](https://pipedream.com/docs/changelog)
- **Deprecations:** None found
- **Versions:** Not versioned
- **Feed:** [Pipedream changelog RSS](https://pipedream.com/docs/changelog/rss.xml)
- **Announcements:** [Workflows and String are shutting down on March 31, 2027](https://pipedream.com/docs/workflows)
- **Last checked:** 2026-11-16

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ
