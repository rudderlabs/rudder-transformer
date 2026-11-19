# Mailmodo Destination

Implementation in **JavaScript** (`src/v0/destinations/mailmodo/`)

## Overview

Adds contacts to a Mailmodo list (`identify`, batched) and sends custom events (`track`).

## Configuration

Config keys from `schema.json` that the transformer reads (`destination.Config`):

| Key        | Required | Used for                                                                        |
| ---------- | -------- | ------------------------------------------------------------------------------- |
| `apiKey`   | Yes      | Sent as the `mmApiKey` header. In `secretKeys`.                                 |
| `listName` | No       | Contact list for identify. An empty or whitespace string becomes `Rudderstack`. |

### Authentication

```
mmApiKey: <apiKey>
Content-Type: application/json
```

The key is generated in Mailmodo under Settings → API Keys
([API reference guide](https://support.mailmodo.com/articles/238356-api-reference-guide)). No auth change or
deprecation has been announced. **NEEDS REVIEW**: Mailmodo's developer reference is a client-rendered site
that could not be read automatically, so the `mmApiKey` header was confirmed only through secondary sources.

## Integration Functionalities

### Supported Message Types

`identify`, `track` (cloud mode).

### Implementation

- **Implemented in**: JavaScript (v0)
- **Processor vs Router**: Router destination (`transformAtV1: "router"`, `MAILMODO: { routerTransform: true }`)

### Validations

- `apiKey` must be set (configuration error).
- Identify: `email` required (`traits.email`, `context.traits.email` or `properties.email`).
- Track: `event` and `email` required.

### Rate Limits

Not published. **NEEDS REVIEW**.

### Batching Support

Identify only, up to **100** contacts per `POST /api/v1/addToList/batch` request
(`IDENTIFY_MAX_BATCH_SIZE`). Track events are sent one per request (Mailmodo's `addEvent` takes one event
per call).

Mailmodo notes that contacts added through the batch endpoint cannot be enrolled into a journey, unlike the
single `addToList` endpoint ([Adding contacts via API](https://support.mailmodo.com/articles/204907-adding-contacts-via-api)).

### Intermediate Calls

None.

### Proxy Delivery

No `networkHandler.js`. Not supported.

### User Deletion

No `deleteUsers.js`. Not supported.

### OAuth Support

No.

## General Queries

### Event Ordering

- **Identify**: Updates contact properties, so ordering matters. Within one router batch, contacts are sent
  in input order.
- **Track**: No timestamp is sent, so Mailmodo records receive time. Ordering affects the event timeline.

### Data Replay Feasibility

- **Missing data**: Identify can be replayed in order. Replayed track events get the replay time.
- **Already delivered data**: Identify replays are idempotent. Track replays create duplicates.

### Multiplexing

No.

## Version Information

### Current Version

- **Version:** `v1`
- **Where in code:** `config.js` (`BASE_URL`: `https://api.mailmodo.com/api/v1`)

Endpoints used:

- `POST /addToList/batch` (identify)
- `POST /addEvent` (track)

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [API reference guide](https://support.mailmodo.com/articles/238356-api-reference-guide)

### Latest Available Version

- **Version:** `v1`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [Mailmodo API getting started](https://www.mailmodo.com/developers/8e957152b6128-getting-started-with-mailmodo-api/)

`v1` is the only documented version.

## Documentation Links

### API Documentation

- [Mailmodo API getting started](https://www.mailmodo.com/developers/8e957152b6128-getting-started-with-mailmodo-api/)
- [API reference guide](https://support.mailmodo.com/articles/238356-api-reference-guide)
- [Getting the API key](https://support.mailmodo.com/articles/276056-how-to-get-the-mmapi-key-template-id-and-campaign-id)
- [Adding contacts via API](https://support.mailmodo.com/articles/204907-adding-contacts-via-api)
- [Custom events and how to send them](https://support.mailmodo.com/articles/427952-what-are-custom-events-and-how-to-send-them-to-mailmodo)

### Changelog References

- **Changelog:** [Mailmodo "What's New" (monthly product release notes)](https://support.mailmodo.com/categories/452014-what-s-new)
- **Deprecations:** None found
- **Versions:** None found
- **Feed:** None found
- **Announcements:** None found
- **Last checked:** 2026-11-16

Mailmodo publishes no API changelog or deprecations page.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ

_No entries yet._
