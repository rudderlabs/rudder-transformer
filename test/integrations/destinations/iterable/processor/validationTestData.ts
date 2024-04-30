import { generateMetadata } from './../../../testUtils';
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
    mapToSingleEvent: false,
    trackAllPages: false,
    trackCategorisedPages: true,
    trackNamedPages: false,
  },
  Enabled: true,
};

const properties = {
  url: 'https://dominos.com',
  title: 'Pizza',
  referrer: 'https://google.com',
};

const sentAt = '2020-08-28T16:26:16.473Z';
const originalTimestamp = '2020-08-28T16:26:06.468Z';

const expectedStatTags = {
  destType: 'ITERABLE',
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
    id: 'iterable-validation-test-1',
    name: 'iterable',
    description: "[Error]: Page call without it's required configuration",
    scenario: 'Framework',
    successCriteria:
      'Response should contain status code 400 and it should throw configuration error with respective message type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              userId: 'sajal12',
              anonymousId: 'abcdeeeeeeeexxxx102',
              context: {
                traits: {
                  email: 'abc@example.com',
                },
              },
              properties,
              type: 'page',
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
            statusCode: 400,
            error: 'Invalid page call',
            statTags: { ...expectedStatTags, errorType: 'configuration' },
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'iterable-validation-test-2',
    name: 'iterable',
    description: '[Error]: Identify call without userId and email',
    scenario: 'Framework',
    successCriteria:
      'Response should contain status code 400 and it should throw instrumentation error with respective message type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              context: {},
              type: 'identify',
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
            statusCode: 400,
            error: 'userId or email is mandatory for this request',
            statTags: expectedStatTags,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'iterable-validation-test-3',
    name: 'iterable',
    description: '[Error]: Message type is not supported',
    scenario: 'Framework',
    successCriteria:
      'Response should contain status code 400 and it should throw instrumentation error with respective message type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              context: {},
              type: 'group',
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
            statusCode: 400,
            error: 'Message type group not supported',
            statTags: expectedStatTags,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'iterable-validation-test-4',
    name: 'iterable',
    description: '[Error]: Missing required value for alias call',
    scenario: 'Framework',
    successCriteria:
      'Response should contain status code 400 and it should throw instrumentation error with respective message type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              context: {},
              type: 'alias',
              properties,
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
            statusCode: 400,
            error: 'Missing required value from "previousId"',
            statTags: expectedStatTags,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'iterable-validation-test-5',
    name: 'iterable',
    description: '[Error]: Missing userId value for alias call',
    scenario: 'Framework',
    successCriteria:
      'Response should contain status code 400 and it should throw instrumentation error with respective message type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              context: {},
              type: 'alias',
              previousId: 'old@email.com',
              anonymousId: 'anonId',
              properties,
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
            statusCode: 400,
            error: 'Missing required value from "userId"',
            statTags: expectedStatTags,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
];
