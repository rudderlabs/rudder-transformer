import { Connection, Destination } from '../../../../src/types';
import { VDM_V2_SCHEMA_VERSION } from '../../../../src/v0/util/constant';

const destType = 'customerio_audience';
const destTypeInUpperCase = 'CUSTOMERIO_AUDIENCE';
const displayName = 'Customer.io Audience';
const channel = 'web';
const destination: Destination = {
  Config: {
    apiKey: 'test-api-key',
    appApiKey: 'test-app-api-key',
    connectionMode: 'cloud',
    siteId: 'test-site-id',
  },
  DestinationDefinition: {
    DisplayName: displayName,
    ID: '123',
    Name: destTypeInUpperCase,
    Config: {},
  },
  Enabled: true,
  ID: '123',
  Name: destTypeInUpperCase,
  Transformations: [],
  WorkspaceID: 'test-workspace-id',
};
const connection: Connection = {
  sourceId: 'dummy-source-id',
  destinationId: 'dummy-destination-id',
  enabled: true,
  config: {
    destination: {
      schemaVersion: VDM_V2_SCHEMA_VERSION,
      audienceId: 'test-segment-id',
      identifierMappings: [
        {
          from: 'some-key',
          to: 'id',
        },
      ],
    },
  },
};

const inValidConnection: Connection = {
  ...connection,
  config: {
    ...connection.config,
    destination: {
      audienceId: '',
    },
  },
};

const insertOrUpdateEndpoint =
  'https://track.customer.io/api/v1/segments/test-segment-id/add_customers';

const deleteEndpoint = 'https://track.customer.io/api/v1/segments/test-segment-id/remove_customers';

const processorInstrumentationErrorStatTags = {
  destType: destTypeInUpperCase,
  errorCategory: 'dataValidation',
  errorType: 'instrumentation',
  feature: 'processor',
  implementation: 'native',
  module: 'destination',
  destinationId: 'default-destinationId',
  workspaceId: 'default-workspaceId',
};

const RouterInstrumentationErrorStatTags = {
  ...processorInstrumentationErrorStatTags,
  feature: 'router',
};

const headers = {
  'Content-Type': 'application/json',
  Authorization: 'Basic dGVzdC1zaXRlLWlkOnRlc3QtYXBpLWtleQ==',
};

const params = {
  id_type: 'id',
};

export {
  destType,
  channel,
  destination,
  connection,
  inValidConnection,
  processorInstrumentationErrorStatTags,
  RouterInstrumentationErrorStatTags,
  headers,
  params,
  insertOrUpdateEndpoint,
  deleteEndpoint,
};
