## ADDED Requirements

### Requirement: Batch track events via FullStory batch import endpoint

The system SHALL batch multiple track events into a single HTTP request to FullStory's `POST /v2/events/batch` endpoint using the native batching framework's `ChunkBatchStrategy`.

#### Scenario: Multiple track events are batched together

- **WHEN** the router receives multiple track events for FullStory with batching enabled
- **THEN** the system SHALL group the track event payloads and send them as a single `POST /v2/events/batch` request with the body wrapped in `{ requests: [...] }` format

#### Scenario: Batch respects maximum item count

- **WHEN** the number of track events exceeds 50,000
- **THEN** the system SHALL split them into multiple batch requests, each containing at most 50,000 events

#### Scenario: Batch respects maximum payload size

- **WHEN** the combined payload size of track events exceeds 10 MB
- **THEN** the system SHALL split them into multiple batch requests, each not exceeding 10 MB

### Requirement: Identify events remain unbatched

The system SHALL continue sending identify events individually to `POST /v2/users`. Identify events MUST NOT be included in batch requests.

#### Scenario: Identify event is sent individually

- **WHEN** the router receives an identify event for FullStory with batching enabled
- **THEN** the system SHALL send it as an individual `POST /v2/users` request, not batched with other events

#### Scenario: Mixed track and identify events

- **WHEN** the router receives a mix of track and identify events
- **THEN** track events SHALL be batched to `/v2/events/batch` and identify events SHALL each be sent individually to `/v2/users`

### Requirement: Events marked dontBatch are sent individually

The system SHALL respect the `metadata.dontBatch` flag. Events with `dontBatch: true` MUST be sent as individual requests regardless of event type.

#### Scenario: Track event with dontBatch flag

- **WHEN** a track event has `metadata.dontBatch` set to `true`
- **THEN** the system SHALL send it as an individual request, not included in any batch

### Requirement: Existing event transformation is preserved

The system SHALL use the existing CDK v2 `procWorkflow.yaml` to transform individual events. The transformation output (payload structure, field mapping, validation) MUST remain identical to the current behavior.

#### Scenario: Track event transformation matches current behavior

- **WHEN** a track event is transformed for batching
- **THEN** the event payload (name, properties, timestamp, context fields) SHALL match the output of the existing `procWorkflow.yaml` transformation

#### Scenario: Invalid events are rejected

- **WHEN** an event fails input validation (e.g., missing event name for track, unsupported message type)
- **THEN** the system SHALL return an error response for that event without affecting other events in the batch

### Requirement: Gradual rollout support

The system SHALL support workspace-level enablement via the `FULLSTORY_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS` environment variable before GA rollout.

#### Scenario: Batching disabled by default

- **WHEN** the `FULLSTORY_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS` env var is not set
- **THEN** the system SHALL use the existing non-batched processor path for all workspaces

#### Scenario: Batching enabled for specific workspaces

- **WHEN** the env var is set to a comma-separated list of workspace IDs
- **THEN** the system SHALL use the batching path only for those workspaces

#### Scenario: Batching enabled for all workspaces

- **WHEN** the env var is set to `ALL`
- **THEN** the system SHALL use the batching path for all workspaces
