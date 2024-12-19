import {
  generateMetadata,
  overrideDestination,
  transformResultBuilder,
} from './../../../testUtils';
import { Destination } from '../../../../../src/types';
import { ProcessorTestData } from '../../../testTypes';

const destination: Destination = {
  ID: '123',
  Name: 'iterable',
  DestinationDefinition: {
    ID: '123',
    Name: 'iterable',
    DisplayName: 'Iterable',
    Config: {},
  },
  WorkspaceID: '123',
  Transformations: [],
  Config: {
    apiKey: 'testApiKey',
    dataCenter: 'USDC',
    preferUserId: false,
    trackAllPages: true,
    trackNamedPages: false,
    mapToSingleEvent: false,
    trackCategorisedPages: false,
  },
  Enabled: true,
};

const headers = {
  api_key: 'testApiKey',
  'Content-Type': 'application/json',
};

const properties = {
  path: '/abc',
  referrer: '',
  search: '',
  title: '',
  url: '',
  category: 'test-category',
};

const sentAt = '2020-08-28T16:26:16.473Z';
const originalTimestamp = '2020-08-28T16:26:06.468Z';

export const aliasTestData: ProcessorTestData[] = [
  {
    id: 'iterable-alias-test-1',
    name: 'iterable',
    description: 'Alias call with userId and previousId',
    scenario: 'Business',
    successCriteria:
      'Response should contain status code 200 and it should contain update email payload',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              anonymousId: 'anonId',
              userId: 'new@email.com',
              previousId: 'old@email.com',
              name: 'ApplicationLoaded',
              context: {},
              properties,
              type: 'alias',
              sentAt,
              originalTimestamp,
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
            output: transformResultBuilder({
              userId: '',
              headers,
              endpoint: 'https://api.iterable.com/api/users/updateEmail',
              JSON: {
                currentEmail: 'old@email.com',
                newEmail: 'new@email.com',
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'iterable-alias-test-1',
    name: 'iterable',
    description: 'Alias call with dataCenter as EUDC',
    scenario: 'Business',
    successCriteria:
      'Response should contain status code 200 and it should contain update email payload',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(destination, { dataCenter: 'EUDC' }),
            message: {
              anonymousId: 'anonId',
              userId: 'new@email.com',
              previousId: 'old@email.com',
              name: 'ApplicationLoaded',
              context: {},
              properties,
              type: 'alias',
              sentAt,
              originalTimestamp,
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
            output: transformResultBuilder({
              userId: '',
              headers,
              endpoint: 'https://api.eu.iterable.com/api/users/updateEmail',
              JSON: {
                currentEmail: 'old@email.com',
                newEmail: 'new@email.com',
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
