// ⚠️ DEV-ONLY TEST FIXTURE — NOT A REAL DESTINATION (INT-6492).
// Fixtures for the dev-only `test_destination` that validates definition-versioning dispatch.
import { Destination } from '../../../../src/types';

export const destType = 'test_destination';
export const destTypeInUpperCase = 'TEST_DESTINATION';
export const displayName = 'Test Destination (dev-only fixture)';

const destinationDefinition = {
  DisplayName: displayName,
  ID: 'test-destination-def-id',
  Name: destTypeInUpperCase,
  Config: {},
};

// v1 destination (integration major 1): config { restApiKey (secret), dataCenter }.
export const destinationV1: Destination = {
  ID: 'test-destination-v1',
  Name: destTypeInUpperCase,
  DestinationDefinition: destinationDefinition,
  Config: { restApiKey: 'v1-secret-key', dataCenter: 'eu' },
  Enabled: true,
  WorkspaceID: 'test-workspace-id',
  Transformations: [],
  version: 1,
};

// No version stamped — must dispatch identically to v1 (getDestinationVersion normalizes undefined to major 1).
export const destinationNoVersion: Destination = {
  ...destinationV1,
  ID: 'test-destination-no-version',
  version: undefined,
};

// v2 destination — only v1 is implemented, so dispatch must reject this until v2 ships.
export const destinationV2: Destination = {
  ...destinationV1,
  ID: 'test-destination-v2',
  Config: { apiKey: 'v2-secret-key', region: 'eu', accountId: 'acct-123' },
  version: 2,
};

export const baseMessage = {
  type: 'track' as const,
  event: 'Test Event',
  userId: 'user-1',
  properties: { plan: 'pro' },
  originalTimestamp: '2023-01-01T00:00:00.000Z',
  sentAt: '2023-01-01T00:00:00.000Z',
  timestamp: '2023-01-01T00:00:00.000Z',
  messageId: 'msg-1',
};

export const v1Endpoint = 'https://eu.test-destination.invalid/v1/events';

// Shared v1 REST request shape produced by processV1 — dataCenter-scoped endpoint + restApiKey
// header. Single source for the processor/router fixtures so the wire shape lives in one place.
export const v1RequestShape = {
  version: '1',
  type: 'REST',
  method: 'POST',
  endpoint: v1Endpoint,
  headers: { 'Content-Type': 'application/json', 'X-Api-Key': 'v1-secret-key' },
  params: {},
  body: { JSON: baseMessage, JSON_ARRAY: {}, XML: {}, FORM: {} },
  files: {},
};

// statTags emitted when a v2 event hits the not-yet-implemented ConfigurationError, by feature.
export const v2StatTags = (feature: string) => ({
  destType: destTypeInUpperCase,
  destinationId: 'default-destinationId',
  errorCategory: 'dataValidation',
  errorType: 'configuration',
  feature,
  implementation: 'native',
  module: 'destination',
  workspaceId: 'default-workspaceId',
});
