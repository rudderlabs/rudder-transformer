import { apiKey } from './maskedSecrets';
import { Connection, Destination } from '../../../../src/types';

const destType = 'iterable_audience';
const destTypeInUpperCase = 'ITERABLE_AUDIENCE';
const displayName = 'Iterable Audience';

const destination: Destination = {
  Config: {
    apiKey,
    dataCenter: 'US',
    projectType: 'email-based',
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
      audienceId: '12345',
      identifierMappings: [{ from: 'email', to: 'email' }],
    },
  },
};

const userIdDestination: Destination = {
  ...destination,
  Config: {
    apiKey,
    dataCenter: 'US',
    projectType: 'userId-based',
  },
};

const userIdConnection: Connection = {
  ...connection,
  config: {
    destination: {
      audienceId: '12345',
      identifierMappings: [{ from: 'user_id', to: 'userId' }],
    },
  },
};

const hybridDestination: Destination = {
  ...destination,
  Config: {
    apiKey,
    dataCenter: 'US',
    projectType: 'hybrid',
  },
};

const hybridConnection: Connection = {
  ...connection,
  config: {
    destination: {
      audienceId: '12345',
      identifierMappings: [
        { from: 'email', to: 'email' },
        { from: 'user_id', to: 'userId' },
      ],
    },
  },
};

const euDestination: Destination = {
  ...destination,
  Config: {
    apiKey,
    dataCenter: 'EU',
    projectType: 'email-based',
  },
};

const subscribeEndpoint = 'https://api.iterable.com/api/lists/subscribe';
const unsubscribeEndpoint = 'https://api.iterable.com/api/lists/unsubscribe';
const euSubscribeEndpoint = 'https://api.eu.iterable.com/api/lists/subscribe';
const euUnsubscribeEndpoint = 'https://api.eu.iterable.com/api/lists/unsubscribe';

const headers = {
  'Content-Type': 'application/json',
  'Api-Key': apiKey,
};

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

const RouterConfigurationErrorStatTags = {
  ...processorInstrumentationErrorStatTags,
  feature: 'router',
  errorType: 'configuration',
};

export {
  destType,
  destTypeInUpperCase,
  destination,
  connection,
  userIdDestination,
  userIdConnection,
  hybridDestination,
  hybridConnection,
  euDestination,
  subscribeEndpoint,
  unsubscribeEndpoint,
  euSubscribeEndpoint,
  euUnsubscribeEndpoint,
  headers,
  RouterInstrumentationErrorStatTags,
  RouterConfigurationErrorStatTags,
};
