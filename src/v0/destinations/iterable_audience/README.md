# Iterable Audience

## Overview

Iterable Audience is a VDM Next (record-event) destination that keeps an Iterable
[list](https://support.iterable.com/hc/en-us/articles/204780579-API-Overview-and-Sample-Payloads)
in sync with a RudderStack audience. Records emitted by rudder-sources are mapped
to Iterable list **subscribe** / **unsubscribe** calls and delivered in batches.

Implementation spans two layers:

- **v0 transform** (`src/v0/destinations/iterable_audience/`) — turns record events into batched HTTP requests via the native `BatchDestination` framework.
- **v1 delivery** (`src/v1/destinations/iterable_audience/`) — proxies the requests and classifies the per-subscriber outcomes from Iterable's bulk response.

## Features

- Add users to an Iterable list (`insert` / `update` → subscribe)
- Remove users from an Iterable list (`delete` → unsubscribe)
- Email-based, userId-based, and hybrid project support
- Automatic batching with chunking (up to 1000 subscribers per request)
- US / EU data center routing
- GDPR-aware response handling (forgotten users are not retried)

## Configuration

### Account-level settings (`Destination.Config`)

- **apiKey**: Iterable REST API key, sent as the `Api-Key` request header.
- **dataCenter**: `US` or `EU` — selects the Iterable data center.
- **projectType**: `email-based`, `userId-based`, or `hybrid` — determines which identifier is sent for each record.

### Connection-level settings (`connection.config.destination`)

- **audienceId**: The Iterable list ID the audience syncs to (string or number; coerced to a numeric `listId`).
- **updateExistingUsersOnly** _(optional)_: Forwarded into the subscribe body. Omitted when unset (Iterable defaults it to `false`). Only meaningful for userId-based / hybrid projects.
- **identifierMappings** _(optional)_: Control-plane metadata (`{ from, to }` pairs). Not used by the transformer — see Identifier Handling below.

## Event Types

| Record action | Iterable operation | Endpoint                 |
| ------------- | ------------------ | ------------------------ |
| `insert`      | Subscribe          | `/api/lists/subscribe`   |
| `update`      | Subscribe          | `/api/lists/subscribe`   |
| `delete`      | Unsubscribe        | `/api/lists/unsubscribe` |

Subscribe and unsubscribe land on different endpoints, so they batch into
separate groups automatically.

## Identifier Handling

rudder-sources resolves the warehouse column to the Iterable field (`email` /
`userId`) before emitting the record, so `message.identifiers` already arrives
keyed by the destination field. The transformer reads `email` / `userId`
**directly** from `message.identifiers` — `identifierMappings` is carried on the
connection config as metadata only and is not consulted here.

The identifier sent per row is chosen by `projectType`:

- **email-based**: sends `email`. Rows without a usable email fail as a per-record `400`.
- **userId-based**: sends `userId`. Rows without a usable userId fail as a per-record `400`.
- **hybrid**: sends **both** `email` and `userId` when a row has both; otherwise sends whichever one is present.

Normalization:

- **email** is trimmed and lowercased on both ingress and the outgoing subscriber object, and validated as an email address.
- **userId** is preserved exactly; values with leading/trailing whitespace are rejected (Iterable treats padded userIds as distinct identifiers).

## API Details

### Endpoints

| Data center | Base URL                           |
| ----------- | ---------------------------------- |
| US          | `https://api.iterable.com/api/`    |
| EU          | `https://api.eu.iterable.com/api/` |

- **Subscribe**: `POST /api/lists/subscribe` — body `{ listId, subscribers, updateExistingUsersOnly? }`
- **Unsubscribe**: `POST /api/lists/unsubscribe` — body `{ listId, subscribers, channelUnsubscribe: false }`

`channelUnsubscribe` is forced to `false` so removal from the audience list does
**not** unsubscribe the user from every messaging channel.

### Authentication

- **Method**: API key in the `Api-Key` header (not OAuth, and never passed as a query string — Iterable rate-limits query-string auth more aggressively).

### Batching

- **Max subscribers per request**: 1000 (`MAX_BATCH_SIZE`).

## Error Handling

The v1 network handler classifies each subscriber in the bulk response individually:

- **Forgotten users** (`failedUpdates.forgottenEmails` / `forgottenUserIds`): returned as `200` with an `iterable_forgotten_user_violations` metric (tagged by `identifierType` only — never the identifier value). They are GDPR-deleted and can never be retried successfully.
- **Not-found on unsubscribe** (`failedUpdates.notFoundEmails` / `notFoundUserIds`): returned as `200` (no-op success — the user was already off the list).
- **Other `failedUpdates` matches**: returned as `400` (aborted).

Transport-level failures are fanned out across every job in the batch:

| HTTP | Behavior                                                      |
| ---- | ------------------------------------------------------------- |
| 401  | `TransformerProxyError` (no AuthErrorCategory — API-key auth) |
| 404  | `TransformerProxyError`                                       |
| 429  | `TransformerProxyError` — framework retry engages             |
| 5xx  | `TransformerProxyError` — framework retry engages             |

## Testing

- **Unit tests**: co-located `*.test.ts` files. Run with `npm test -- --testPathPattern="iterable_audience" --no-coverage`.
- **Integration tests**: `test/integrations/destinations/iterable_audience`. Run with `npm run test:ts -- component --destination=iterable_audience`.

## References

- [Iterable List Subscribe API](https://api.iterable.com/api/docs#lists_subscribeToList)
- [Iterable List Unsubscribe API](https://api.iterable.com/api/docs#lists_unsubscribeFromList)
- [Iterable API Keys](https://support.iterable.com/hc/en-us/articles/360043464871-API-Keys)
