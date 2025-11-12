# RETL for Intercom

### Support

- Supported: Yes (JSON Mapper) — `supportedSourceTypes` includes `warehouse`; `supportsVisualMapper: true` in `db-config.json`.
- VDM v1: Supported (Visual Mapper enabled)
- VDM v2: Not Supported (no explicit `record` handling logic in transformer code)

### Connection Config

- Uses the same destination configuration as event stream for authentication: `apiKey`, `apiServer`, `apiVersion`.

### RETL Flow in Transformer

- CDK v2 router honors events with `context.mappedToDestination === true`.
- For such events, the transformer uses `traits` (Identify) or direct payload (Track/Group) as final payload without rebuilding standard mappings.

Where used in workflows:

- Identify v2: `rEtlPayload = getFieldValueFromMessage(message, "traits")` and then forwarded to the contact payload with additional filtering and validation.
- Identify v1: `rEtlPayload` similarly used, merged with v1-specific fields.
- Track: When `mappedToDestination`, the payload is taken from input and metadata normalization applied (`addMetadataToPayload`).
- Group: When `mappedToDestination`, the company creation/update uses the provided payload, then follows attach/tag steps as applicable.

### Requirements and Validations (apply to RETL too)

- Identify v2: must include at least one of `external_id` or `email`.
- Identify v1: must include at least one of `user_id` or `email`.
- Track: must include `event_name` and `user_id` or `email`.
- Group: must include `company_id` (from `groupId`).
- Custom attributes are filtered to remove reserved attributes and flattened as per API version.

### Notes

- Ensure RETL mappings set correct top-level fields for the given API version to satisfy validations.
- Company-related RETL should provide necessary properties to avoid creating empty companies.
- No batching is performed by transformer in RETL path; events are processed individually.
