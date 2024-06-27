import { Destination } from '../../../../../src/types';
import { ProcessorTestData } from '../../../testTypes';
import {
  generateMetadata,
  generateSimplifiedIdentifyPayload,
  transformResultBuilder,
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

const expectedOutputUserTraits = {
  address: {
    city: 'ahmedabad',
    state: 'india',
  },
  age: '30',
  city: 'Banglore',
  email: 'test@user.com',
  firstName: 'test',
  lastName: 'user',
  phone: '9876543210',
  userCountry: 'india',
  userId: 'user@45',
  username: 'testUser',
};

const headers = {
  Authorization: 'Bearer dummyApiKey',
  'Content-Type': 'application/x-www-form-urlencoded',
};

const endpoint = 'https://api.refiner.io/v1/identify-user';

export const identifyTestData: ProcessorTestData[] = [
  {
    id: 'refiner-identify-test-1',
    name: 'refiner',
    description: 'Successful identify call to create user',
    scenario: 'Framework',
    successCriteria:
      'Response status code should be 200 and it should contain all user standard and custom traits',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateSimplifiedIdentifyPayload({
              userId: 'user@45',
              context: {
                traits: userTraits,
              },
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
              FORM: {
                ...expectedOutputUserTraits,
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
];
