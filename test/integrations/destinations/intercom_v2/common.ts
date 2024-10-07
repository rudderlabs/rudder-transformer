import { Destination } from '../../../../src/types';

const destTypeInUpperCase = 'INTERCOM_V2';
const channel = 'web';
const originalTimestamp = '2023-11-10T14:42:44.724Z';
const timestamp = '2023-11-22T10:12:44.757+05:30';
const anonymousId = 'test-anonymous-id';

const destination: Destination = {
  ID: '123',
  Name: destTypeInUpperCase,
  DestinationDefinition: {
    ID: '123',
    Name: destTypeInUpperCase,
    DisplayName: 'Intercom V2',
    Config: {},
  },
  Config: {
    apiServer: 'US',
    sendAnonymousId: false,
  },
  Enabled: true,
  WorkspaceID: '123',
  Transformations: [],
};

const destinationApiServerEU: Destination = {
  ID: '123',
  Name: destTypeInUpperCase,
  DestinationDefinition: {
    ID: '123',
    Name: destTypeInUpperCase,
    DisplayName: 'Intercom V2',
    Config: {},
  },
  Config: {
    apiServer: 'Europe',
    sendAnonymousId: true,
  },
  Enabled: true,
  WorkspaceID: '123',
  Transformations: [],
};

const destinationApiServerAU: Destination = {
  ID: '123',
  Name: destTypeInUpperCase,
  DestinationDefinition: {
    ID: '123',
    Name: destTypeInUpperCase,
    DisplayName: 'Intercom V2',
    Config: {},
  },
  Config: {
    apiServer: 'Australia',
    sendAnonymousId: true,
  },
  Enabled: true,
  WorkspaceID: '123',
  Transformations: [],
};

const userTraits = {
  age: 23,
  email: 'test@rudderlabs.com',
  phone: '+91 9999999999',
  firstName: 'John',
  lastName: 'Snow',
  address: 'california usa',
  ownerId: '13',
};

const detachUserCompanyUserTraits = {
  age: 23,
  email: 'detach-user-company@rudderlabs.com',
  phone: '+91 9999999999',
  firstName: 'John',
  lastName: 'Snow',
  address: 'california usa',
  ownerId: '13',
};

const companyTraits = {
  email: 'known-email@rudderlabs.com',
  name: 'RudderStack',
  size: 500,
  website: 'www.rudderstack.com',
  industry: 'CDP',
  plan: 'enterprise',
  remoteCreatedAt: '2024-09-12T14:40:33.996+05:30',
};

const properties = {
  revenue: {
    amount: 1232,
    currency: 'inr',
    test: 123,
  },
  price: {
    amount: 3000,
    currency: 'USD',
  },
};

const headers = {
  Authorization: 'Bearer default-accessToken',
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'Intercom-Version': '2.10',
};

const headersWithRevokedAccessToken = {
  ...headers,
  Authorization: 'Bearer revoked-accessToken',
};

const RouterInstrumentationErrorStatTags = {
  destType: destTypeInUpperCase,
  errorCategory: 'dataValidation',
  errorType: 'instrumentation',
  implementation: 'native',
  module: 'destination',
  destinationId: 'default-destinationId',
  workspaceId: 'default-workspaceId',
  feature: 'router',
};

const RouterNetworkErrorStatTags = {
  ...RouterInstrumentationErrorStatTags,
  errorCategory: 'network',
  errorType: 'aborted',
};

export {
  channel,
  destination,
  originalTimestamp,
  timestamp,
  destinationApiServerEU,
  destinationApiServerAU,
  userTraits,
  companyTraits,
  properties,
  detachUserCompanyUserTraits,
  anonymousId,
  headers,
  headersWithRevokedAccessToken,
  RouterInstrumentationErrorStatTags,
  RouterNetworkErrorStatTags,
};
