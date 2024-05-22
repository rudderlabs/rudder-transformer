import { Destination } from '../../../../../src/types';
import { ProcessorTestData } from '../../../testTypes';
import {
  generateMetadata,
  transformResultBuilder,
  generateSimplifiedTrackPayload,
} from '../../../testUtils';

const destination: Destination = {
  ID: '123',
  Name: 'refiner',
  DestinationDefinition: {
    ID: '123',
    Name: 'refiner',
    DisplayName: 'Refiner',
    Config: {},
  },
  Config: {
    apiKey: 'dummyApiKey',
    blacklistedEvents: [{ eventName: '' }],
    eventDelivery: true,
    eventDeliveryTS: 1665474171943,
    eventFilteringOption: 'disable',
    userAttributesMapping: [{ from: 'address', to: 'userAddress' }],
    whitelistedEvents: [{ eventName: '' }],
  },
  Enabled: true,
  WorkspaceID: '123',
  Transformations: [],
};

const userTraits = {
  age: '30',
  city: 'Banglore',
  email: 'test@user.com',
  phone: '9876543210',
  address: { city: 'ahmedabad', state: 'india' },
  lastName: 'user',
  username: 'testUser',
  firstName: 'test',
  userCountry: 'india',
};

const properties = {
  order_id: '5241735',
  coupon: 'APPARELSALE',
  currency: 'IND',
  products: [
    { id: 'product-bacon-jam', category: 'Merch', brand: '' },
    { id: 'product-t-shirt', category: 'Merch', brand: 'Levis' },
    { id: 'offer-t-shirt', category: 'Merch', brand: 'Levis' },
  ],
};

const headers = {
  Authorization: 'Bearer dummyApiKey',
  'Content-Type': 'application/x-www-form-urlencoded',
};

const endpoint = 'https://api.refiner.io/v1/track';

export const trackTestData: ProcessorTestData[] = [
  {
    id: 'refiner-track-test-1',
    name: 'refiner',
    description: 'Track event call for Product Searched event',
    scenario: 'Framework',
    successCriteria: 'Response status code should be 200 and event name should be Product Searched',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateSimplifiedTrackPayload({
              userId: 'user@45',
              event: 'Product Searched',
              context: {
                traits: userTraits,
              },
              properties,
            }),
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              method: 'POST',
              userId: '',
              endpoint,
              headers,
              FORM: { id: 'user@45', email: 'test@user.com', event: 'Product Searched' },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
];
