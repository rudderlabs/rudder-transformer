import { authHeader1, secret1, secret2 } from './maskedSecrets';
import { Destination } from '../../../../src/types';

const destType = 'bloomreach';
const destTypeInUpperCase = 'BLOOMREACH';
const displayName = 'bloomreach';
const channel = 'web';
const destination: Destination = {
  Config: {
    apiBaseUrl: 'https://demoapp-api.bloomreach.com',
    apiKey: secret1,
    apiSecret: secret2,
    projectToken: 'test-project-token',
    hardID: 'registered',
    softID: 'cookie',
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

const traits = {
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '1234567890',
  address: {
    city: 'New York',
    country: 'USA',
    pinCode: '123456',
  },
};

const properties = {
  product_id: '622c6f5d5cf86a4c77358033',
  sku: '8472-998-0112',
  category: 'Games',
  name: 'Cones of Dunshire',
  brand: 'Wyatt Games',
  variant: 'expansion pack',
  price: 49.99,
  quantity: 5,
  coupon: 'PREORDER15',
  currency: 'USD',
  position: 1,
  url: 'https://www.website.com/product/path',
  image_url: 'https://www.website.com/product/path.webp',
  key1: 'value1',
};
const endpoint = 'https://demoapp-api.bloomreach.com/track/v2/projects/test-project-token/batch';

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

export {
  destType,
  channel,
  destination,
  processorInstrumentationErrorStatTags,
  RouterInstrumentationErrorStatTags,
  traits,
  headers,
  properties,
  endpoint,
  proxyV1RetryableErrorStatTags,
};
