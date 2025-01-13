import { Destination } from '../../../../../src/types';
import {
  generateMetadata,
  transformResultBuilder,
  generateSimplifiedTrackPayload,
} from '../../../testUtils';

const v1Config = {
  apiKey: 'intercomApiKey',
  apiVersion: 'v1',
  appId: '9e9cdea1-78fa-4829-a9b2-5d7f7e96d1a0',
  collectContext: false,
};

const v2Config = {
  apiKey: 'testApiKey',
  apiVersion: 'v2',
  apiServer: 'standard',
  sendAnonymousId: false,
};

const v1Headers = {
  'Content-Type': 'application/json',
  Authorization: 'Bearer intercomApiKey',
  Accept: 'application/json',
  'Intercom-Version': '1.4',
  'User-Agent': 'RudderStack',
};

const v2Headers = {
  Accept: 'application/json',
  Authorization: 'Bearer testApiKey',
  'Content-Type': 'application/json',
  'Intercom-Version': '2.10',
  'User-Agent': 'RudderStack',
};

const destination: Destination = {
  ID: '123',
  Name: 'intercom',
  DestinationDefinition: {
    ID: '123',
    Name: 'intercom',
    DisplayName: 'Intercom',
    Config: {
      cdkV2Enabled: true,
    },
  },
  Config: {},
  Enabled: true,
  WorkspaceID: '123',
  Transformations: [],
};

const v1Destination = { ...destination, Config: v1Config };
const v2Destination = { ...destination, Config: v2Config };

const userTraits = {
  age: 23,
  ownerId: '13',
  firstName: 'Test',
  lastName: 'Rudderlabs',
  phone: '+91 9999999999',
  address: 'california usa',
  email: 'test@rudderlabs.com',
  lastSeenAt: '2023-11-10T14:42:44.724Z',
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

const nestedProperties = {
  property1: 1,
  property2: 'test',
  property3: true,
  property4: '2020-10-05T09:09:03.731Z',
  property5: {
    property1: 1,
    property2: 'test',
    property3: {
      subProp1: {
        a: 'a',
        b: 'b',
      },
      subProp2: ['a', 'b'],
    },
  },
  properties6: null,
  revenue: {
    amount: 1232,
    currency: 'inr',
    test: 123,
  },
  price: {
    amount: 3000,
    currency: 'USD',
  },
  article: {
    url: 'https://example.org/ab1de.html',
    value: 'the dude abides',
  },
};

const expectedNestedProperties = {
  revenue: {
    amount: 1232,
    currency: 'inr',
    test: 123,
  },
  price: {
    amount: 3000,
    currency: 'USD',
  },
  article: {
    url: 'https://example.org/ab1de.html',
    value: 'the dude abides',
  },
  property1: 1,
  property2: 'test',
  property3: true,
  property4: '2020-10-05T09:09:03.731Z',
  'property5.property1': 1,
  'property5.property2': 'test',
  'property5.property3.subProp1.a': 'a',
  'property5.property3.subProp1.b': 'b',
  'property5.property3.subProp2[0]': 'a',
  'property5.property3.subProp2[1]': 'b',
  properties6: null,
};

const expectedOutput = {
  user_id: 'user@2',
  created: 1699627364,
  event_name: 'Test Event 2',
  email: 'test@rudderlabs.com',
};

const timestamp = '2023-11-22T10:12:44.757+05:30';
const originalTimestamp = '2023-11-10T14:42:44.724Z';

const endpoint = 'https://api.intercom.io/events';

export const trackTestData = [
  {
    id: 'intercom-track-test-1',
    name: 'intercom',
    description: 'V2 version : Successful track call',
    scenario: 'Business',
    successCriteria:
      "Response status code should be 200 and response should contain event name and it's properties",
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: v2Destination,
            message: generateSimplifiedTrackPayload({
              userId: 'user@2',
              event: 'Product Viewed',
              context: {
                traits: userTraits,
              },
              properties,
              timestamp,
              originalTimestamp,
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
              userId: '',
              endpoint,
              headers: v2Headers,
              JSON: {
                user_id: 'user@2',
                metadata: properties,
                created_at: 1699627364,
                event_name: 'Product Viewed',
                email: 'test@rudderlabs.com',
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
    id: 'intercom-track-test-2',
    name: 'intercom',
    description: 'V2 version : Track rEtl test',
    scenario: 'Business',
    successCriteria:
      "Response status code should be 200 and response should contain event name and it's properties",
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: v2Destination,
            message: {
              userId: 'user@2',
              event: 'Product Viewed',
              context: {
                mappedToDestination: 'true',
              },
              traits: {
                ...properties,
                user_id: 'user@1',
                event_name: 'Product Viewed',
              },
              type: 'track',
              timestamp,
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
              endpoint,
              headers: v2Headers,
              JSON: {
                ...properties,
                user_id: 'user@1',
                event_name: 'Product Viewed',
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
    id: 'intercom-track-test-3',
    name: 'intercom',
    description: 'V1 version : successful track call with nested properties',
    scenario: 'Business',
    successCriteria:
      "Response status code should be 200 and response should contain event name and it's properties",
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: v1Destination,
            message: generateSimplifiedTrackPayload({
              userId: 'user@2',
              event: 'Test Event 2',
              context: {
                traits: userTraits,
              },
              properties: nestedProperties,
              timestamp,
              originalTimestamp,
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
              userId: 'default-anonymousId',
              endpoint,
              headers: v1Headers,
              JSON: {
                ...expectedOutput,
                metadata: {
                  ...expectedNestedProperties,
                },
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
    id: 'intercom-track-test-4',
    name: 'intercom',
    description: 'V1 version : successful track call without properties',
    scenario: 'Business',
    successCriteria: 'Response status code should be 200 and response should contain event name',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: v1Destination,
            message: generateSimplifiedTrackPayload({
              userId: 'user@2',
              event: 'Test Event 2',
              context: {
                traits: userTraits,
              },
              timestamp,
              originalTimestamp,
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
              endpoint,
              headers: v1Headers,
              JSON: expectedOutput,
              userId: 'default-anonymousId',
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
];
