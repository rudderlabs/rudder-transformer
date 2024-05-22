import { Destination } from '../../../../../src/types';
import { ProcessorTestData } from '../../../testTypes';
import { generateMetadata } from '../../../testUtils';

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

const expectedStatTags = {
  destType: 'REFINER',
  errorCategory: 'dataValidation',
  errorType: 'instrumentation',
  feature: 'processor',
  implementation: 'native',
  module: 'destination',
  destinationId: 'default-destinationId',
  workspaceId: 'default-workspaceId',
};

export const validationTestData: ProcessorTestData[] = [
  {
    id: 'refiner-validation-test-1',
    name: 'refiner',
    description: '[Error]: Check for no message type',
    scenario: 'Framework',
    successCriteria: 'Response status code should be 400 with respective error message',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              userId: 'user@45',
              context: {
                traits: userTraits,
              },
              timestamp: '2020-01-21T00:21:34.208Z',
            },
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
            error: 'Event type is required',
            statTags: expectedStatTags,
            statusCode: 400,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'refiner-validation-test-2',
    name: 'refiner',
    description: 'Error]: Check for unsupported message type',
    scenario: 'Framework',
    successCriteria:
      'Response should contain error message and status code should be 400, as we are sending a message type which is not supported by Klaviyo destination and the error message should be Event type alias is not supported',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              userId: 'user@45',
              type: 'alias',
              context: {
                traits: userTraits,
              },
              timestamp: '2020-01-21T00:21:34.208Z',
            },
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
            error: 'Event type "alias" is not supported',
            statTags: expectedStatTags,
            statusCode: 400,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'refiner-validation-test-3',
    name: 'refiner',
    description: 'Error]: userId and email is not present in payload',
    scenario: 'Framework',
    successCriteria:
      'Response status code should be 400, it should throw instrumetation error with respective message',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'identify',
              context: {
                traits: {},
              },
              timestamp: '2020-01-21T00:21:34.208Z',
            },
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
            error: 'At least one of `userId` or `email` is required',
            statTags: expectedStatTags,
            statusCode: 400,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'refiner-validation-test-4',
    name: 'refiner',
    description: 'Error]: event name is not present in payload',
    scenario: 'Framework',
    successCriteria:
      'Response status code should be 400, it should throw instrumetation error with respective message',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'track',
              context: {
                traits: userTraits,
              },
              properties,
              timestamp: '2020-01-21T00:21:34.208Z',
            },
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
            error: 'Event name is required',
            statTags: expectedStatTags,
            statusCode: 400,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
];
