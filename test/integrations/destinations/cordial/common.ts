import { authHeader1, secret1 } from './maskedSecrets';
import { Destination } from '../../../../src/types';

const destType = 'cordial';
const destTypeInUpperCase = 'CORDIAL';
const displayName = 'Cordial';
const destination: Destination = {
  Config: {
    apiBaseUrl: 'https://abc.example.com',
    apiKey: secret1,
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
  email: 'johndoe@example.com',
  first_name: 'John',
  last_name: 'Doe',
  phone: '1234567890',
  address: {
    city: 'New York',
    country: 'USA',
    pin_code: '123456',
  },
  subscribeStatus: 'subscribed',
};
const endpoint = 'https://abc.example.com/v2/contacts';
const updateContactEmailEndpoint = 'https://abc.example.com/v2/contacts/email:johndoe@example.com';
const updateContactIdEndpoint = 'https://abc.example.com/v2/contacts/6690fe3655e334d6270287b5';
const eventsEndpoint = 'https://abc.example.com/v2/contactactivities';
const context = {
  externalId: [
    {
      type: 'cordialContactId',
      id: '6690fe3655e334d6270287b5',
    },
  ],
};
const headers = {
  'Content-Type': 'application/json',
  Authorization: authHeader1,
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

export {
  destType,
  destination,
  traits,
  endpoint,
  updateContactEmailEndpoint,
  updateContactIdEndpoint,
  eventsEndpoint,
  context,
  headers,
  properties,
  processorInstrumentationErrorStatTags,
};
