import { authHeader1, secret1, secret2 } from './maskedSecrets';
import { Destination } from '../../../../src/types';

const destType = 'bloomreach_catalog';
const destTypeInUpperCase = 'BLOOMREACH_CATALOG';
const displayName = 'bloomreach catalog';
const channel = 'web';
const destination: Destination = {
  Config: {
    apiBaseUrl: 'https://demoapp-api.bloomreach.com',
    apiKey: secret1,
    apiSecret: secret2,
    projectToken: 'test-project-token',
    catalogID: 'test-catalog-id',
  },
  DestinationDefinition: {
    DisplayName: displayName,
    ID: '123',
    Name: destTypeInUpperCase,
    Config: { cdkV2Enabled: true },
  },
  Enabled: true,
  ID: '123',
  Name: destTypeInUpperCase,
  Transformations: [],
  WorkspaceID: 'test-workspace-id',
};

const insertEndpoint =
  'https://demoapp-api.bloomreach.com/data/v2/projects/test-project-token/catalogs/test-catalog-id/items';
const updateEndpoint =
  'https://demoapp-api.bloomreach.com/data/v2/projects/test-project-token/catalogs/test-catalog-id/items/partial-update';
const deleteEndpoint =
  'https://demoapp-api.bloomreach.com/data/v2/projects/test-project-token/catalogs/test-catalog-id/items/bulk-delete';

const processorInstrumentationErrorStatTags = {
  destType: destTypeInUpperCase,
  errorCategory: 'dataValidation',
  errorType: 'instrumentation',
  feature: 'processor',
  implementation: 'cdkV2',
  module: 'destination',
  destinationId: 'default-destinationId',
  workspaceId: 'default-workspaceId',
};

const RouterInstrumentationErrorStatTags = {
  ...processorInstrumentationErrorStatTags,
  feature: 'router',
};

const proxyV1RetryableErrorStatTags = {
  ...RouterInstrumentationErrorStatTags,
  errorCategory: 'network',
  errorType: 'retryable',
  feature: 'dataDelivery',
  implementation: 'native',
};

const headers = {
  'Content-Type': 'application/json',
  Authorization: authHeader1,
};

const sampleContext = {
  destinationFields: 'item_id, title, status, unprinted',
  mappedToDestination: 'true',
};

export {
  destType,
  channel,
  destination,
  processorInstrumentationErrorStatTags,
  RouterInstrumentationErrorStatTags,
  headers,
  proxyV1RetryableErrorStatTags,
  insertEndpoint,
  updateEndpoint,
  deleteEndpoint,
  sampleContext,
};
