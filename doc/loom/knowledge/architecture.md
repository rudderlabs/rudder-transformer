# Architecture

> High-level component relationships, data flow, and module dependencies.
> This file is append-only - agents add discoveries, never delete.

(Add architecture diagrams and component relationships as you discover them)

## rudder-transformer Overview

Node.js/TypeScript monorepo that transforms RudderStack events into destination-specific formats. Two layers per destination:

- **v0 transform layer** (`src/v0/destinations/<dest>/`) — converts router events into batched HTTP requests
- **v1 delivery layer** (`src/v1/destinations/<dest>/`) — sends HTTP requests to the destination API and parses responses

## iterable_audience Architecture (M1)

New destination wired via the BatchDestination framework (v0) + strategy-based networkHandler (v1).

### Data Flow

```
rudder-server router
    → POST /routerTransform (BatchDestination path)
    → src/v0/destinations/iterable_audience/routerTransform.ts (IterableAudienceIntegration)
         → transformEvent (per record event)
         → getBatchStrategy (per endpoint group)
    → batched HTTP bodies returned to rudder-server

rudder-server proxy
    → POST /v1/destinations/iterable_audience/proxy
    → src/v1/destinations/iterable_audience/networkHandler.ts
         → AudienceListStrategy.handleSuccess / handleError
    → per-jobId statusCodes returned
```

### Key Design Decisions

- **v0 path locked**: `MiscService.getBatchDestinationHandler` hardcodes `src/v0/destinations/${dest}/routerTransform` — all batch destinations live in v0 regardless of implementation language.
- **BatchDestination framework**: `src/services/destination/nativeBatching/` — orchestrates transform → group → batch → serialize.
- **Registry entry required**: `src/constants/batchedDestinationsMap.ts` must have `ITERABLE_AUDIENCE: true` or the destination falls back to the legacy router pipeline.
- **Reuses iterable v1 primitives**: `BaseStrategy`, `createBatchErrorChecker`, types, and datacenter routing from `src/v1/destinations/iterable/`.
- **Zero framework changes**: only the destination's own files are new.

## Cross-Repo Summary (4 repos)

| Repo | Role |
|---|---|
| rudder-transformer | Transform + delivery layers (this repo) |
| rudder-integrations-config | db-config, schema, ui-config for destination + account |
| rudder-integrations-info | Control-plane endpoints (listAudiences, listFields, setup) |
| rudder-webapp | VDM v2 form (vdmFormRegistry) |

rudder-server, rudder-sources, rudder-control-plane — **no changes needed**.

## Endpoint Routing

- **Subscribe** (INSERT/UPDATE): `POST /api/lists/subscribe` — body `{ listId, subscribers }`
- **Unsubscribe** (DELETE): `POST /api/lists/unsubscribe` — body `{ listId, subscribers, channelUnsubscribe: false }`
- Endpoint is the natural group key — subscribe/unsubscribe land in separate BatchDestination groups automatically.
- `internalGroupKey` is NOT needed (different endpoints already discriminate groups).

## Datacenter Routing

Reuses `constructEndpoint(dataCenterKey, category)` from `src/v0/destinations/iterable/config.js`:
- Account config uses `US`/`EU` labels → translated to `USDC`/`EUDC` at call site.
- `BASE_URL = { USDC: 'https://api.iterable.com/api/', EUDC: 'https://api.eu.iterable.com/api/' }`

## Source Module Map

Key `src/` directory roles for the iterable_audience implementation:

- `src/adapters/` — HTTP client wrappers (`network.js`, `utils/networkUtils.js`); all v1 networkHandlers import from here
- `src/routes/` — Express route definitions; `destination.ts` wires POST /routerTransform and POST /v1/destinations/:dest/proxy
- `src/controllers/` — Controller functions; `destination.ts` implements `routerTransform` and `proxyRequest` handlers
- `src/middlewares/` — Express middleware; `errorHandler.ts` converts `TransformerProxyError` to HTTP responses
- `src/helpers/` — Handler loaders; `fetchHandlers.ts` loads destination handlers, `serviceSelector.ts` picks processing service
- `src/interfaces/` — Shared TypeScript request/response interfaces used across controllers and services
- `src/util/` — General utilities (fetch, featureFlags, dynamicConfigParser); audience-specific utils are in `src/v0/util/`
- `src/warehouse/` — Warehouse-specific transforms; NOT used by iterable_audience (receives standard record events)
- `src/cdk/` — CDK v2 destination framework; NOT used by iterable_audience (uses BatchDestination v0 path)
