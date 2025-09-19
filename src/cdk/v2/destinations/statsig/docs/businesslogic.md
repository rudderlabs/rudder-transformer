# Business Logic and Validations — Statsig

## Event Handling Flow

- The integration validates `message.type` and ensures it is one of: Identify, Track, Page, Screen, Group, Alias.
- On success, the original message is forwarded to `https://api.statsig.com/v1/webhooks/rudderstack` with the appropriate headers.
- No additional transformation or mapping is applied.

## Mappings

- Input message is passed through as JSON to Statsig. No field remapping.

## Validations

- Required: `message.type` must be present and supported; otherwise an error is raised.
- Authentication: `destination.Config.secretKey` must be configured; used as `STATSIG-API-KEY` header.

## Consent Handling

- Consent gating can be configured via destination settings (`consentManagement`, `oneTrustCookieCategories`, `ketchConsentPurposes`).
- Enforcement occurs in the RudderStack pipeline before delivery; payload semantics do not change in the Statsig transformer.

## Special Cases

- None identified. The endpoint accepts the message as-is. Any schema or rate-limit constraints are enforced by Statsig.

## Error Handling

- Standard network error propagation from the Router v1/CDK v2 pipeline applies.
- Partial failure behavior in batch mode is managed by the v1 proxy; Statsig-specific partial response formats are not documented. NEEDS REVIEW.

## Use-Cases of Ingested Data

- Statsig can use these events for analytics, experiment exposure tracking, and audit of feature interactions. Exact mapping of event semantics within Statsig is product-defined. NEEDS REVIEW for authoritative references.
