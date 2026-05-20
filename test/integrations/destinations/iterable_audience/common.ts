import { Destination } from '../../../../src/types';

const destType = 'iterable_audience';
const destTypeInUpperCase = 'ITERABLE_AUDIENCE';

const destination: Destination = {
  Config: {
    apiKey: 'iterable-api-key',
    dataCenter: 'USDC',
    listId: 12345,
    projectType: 'hybrid',
  },
  DestinationDefinition: {
    DisplayName: 'Iterable Audience',
    ID: 'iterable-audience-def-id',
    Name: destTypeInUpperCase,
    Config: {},
  },
  Enabled: true,
  ID: 'iterable-audience-destination-id',
  Name: 'Iterable Audience',
  Transformations: [],
  WorkspaceID: 'iterable-audience-workspace-id',
};

const euDestination: Destination = {
  ...destination,
  Config: {
    ...destination.Config,
    dataCenter: 'EUDC',
    projectType: 'userId_based',
  },
};

const emailProjectDestination: Destination = {
  ...destination,
  Config: {
    ...destination.Config,
    projectType: 'email_based',
  },
};

const subscribeEndpoint = 'https://api.iterable.com/api/lists/subscribe';
const unsubscribeEndpoint = 'https://api.iterable.com/api/lists/unsubscribe';
const euSubscribeEndpoint = 'https://api.eu.iterable.com/api/lists/subscribe';

const headers = {
  'Content-Type': 'application/json',
  'Api-Key': 'iterable-api-key',
};

const routerInstrumentationErrorStatTags = {
  destType: destTypeInUpperCase,
  errorCategory: 'dataValidation',
  errorType: 'instrumentation',
  feature: 'router',
  implementation: 'native',
  module: 'destination',
  destinationId: 'default-destinationId',
  workspaceId: 'default-workspaceId',
};

const routerConfigurationErrorStatTags = {
  ...routerInstrumentationErrorStatTags,
  errorType: 'configuration',
};

export {
  destType,
  destination,
  euDestination,
  emailProjectDestination,
  headers,
  subscribeEndpoint,
  unsubscribeEndpoint,
  euSubscribeEndpoint,
  routerInstrumentationErrorStatTags,
  routerConfigurationErrorStatTags,
};
