import { authHeader1, secret1, authHeader4, secret4 } from '../maskedSecrets';
import { Destination } from '../../../../../src/types';
import {
  generateMetadata,
  transformResultBuilder,
  generateSimplifiedIdentifyPayload,
} from '../../../testUtils';

const v1Config = {
  apiKey: secret4,
  apiVersion: 'v1',
  appId: '9e9cdea1-78fa-4829-a9b2-5d7f7e96d1a0',
  collectContext: false,
};

const v2Config = {
  apiKey: secret1,
  apiVersion: 'v2',
  apiServer: 'standard',
  sendAnonymousId: false,
};

const v2Headers = {
  Accept: 'application/json',
  Authorization: authHeader1,
  'Content-Type': 'application/json',
  'Intercom-Version': '2.10',
  'User-Agent': 'RudderStack',
};

const v1Headers = {
  'Content-Type': 'application/json',
  Authorization: authHeader4,
  Accept: 'application/json',
  'Intercom-Version': '1.4',
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

const user1Traits = {
  age: 23,
  ownerId: '13',
  firstName: 'Test',
  lastName: 'Rudderlabs',
  phone: '+91 9999999999',
  address: 'california usa',
  email: 'test@rudderlabs.com',
  lastSeenAt: '2023-11-10T14:42:44.724Z',
};

const user2Traits = {
  age: 32,
  ownerId: '14',
  firstName: 'Test',
  lastName: 'RudderStack',
  phone: '+91 9299999999',
  email: 'test+2@rudderlabs.com',
};

const user3Traits = {
  owner_id: 13,
  name: 'Test Rudderlabs',
  phone: '+91 9999999999',
  email: 'test@rudderlabs.com',
  custom_attributes: {
    ca1: 'value1',
    ca2: 'value2',
  },
};

const user4Traits = {
  key1: 'value1',
  name: 'Test Name',
  firstName: 'Test',
  lastName: 'Name',
  phone: '9876543210',
  userId: 'test_user_id_1',
  email: 'test_1@test.com',
  createdAt: '2020-09-30T19:11:00.337Z',
  anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
  address: {
    city: 'Kolkata',
    state: 'West Bengal',
  },
  originalArray: [
    {
      nested_field: 'nested value',
      tags: ['tag_1', 'tag_2', 'tag_3'],
    },
    {
      nested_field: 'nested value',
      tags: ['tag_1'],
    },
    {
      nested_field: 'nested value',
    },
  ],
};

const user5Traits = {
  firstName: 'Test',
  lastName: 'Name',
  key1: 'value1',
  phone: '9876543210',
  email: 'test_1@test.com',
  createdAt: '2020-09-30T19:11:00.337Z',
  anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
};

const user6Traits = {
  lastName: 'Name',
  key1: 'value1',
  phone: '9876543210',
  email: 'test_1@test.com',
  createdAt: '2020-09-30T19:11:00.337Z',
  anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
  company: {
    key1: 'value1',
    name: 'Test Comp',
    id: 'company_id',
    industry: 'test industry',
    key2: {
      a: 'a',
    },
    key3: [1, 2, 3],
  },
};

const expectedUser1Traits = {
  owner_id: 13,
  external_id: 'user@1',
  last_seen_at: 1699627364,
  name: 'Test Rudderlabs',
  phone: '+91 9999999999',
  email: 'test@rudderlabs.com',
  custom_attributes: {
    age: 23,
    address: 'california usa',
  },
};

const expectedUser2Traits = {
  owner_id: 14,
  external_id: 'user@2',
  name: 'Test RudderStack',
  phone: '+91 9299999999',
  email: 'test+2@rudderlabs.com',
  custom_attributes: {
    age: 32,
  },
};

const expectedUser3Traits = {
  owner_id: 13,
  user_id: 'user@1',
  name: 'Test Rudderlabs',
  phone: '+91 9999999999',
  email: 'test@rudderlabs.com',
  custom_attributes: {
    ca1: 'value1',
    ca2: 'value2',
  },
};

const expectedUser4Traits = {
  name: 'Test Name',
  phone: '9876543210',
  email: 'test_1@test.com',
  signed_up_at: 1601493060,
  user_id: 'test_user_id_1',
  last_seen_user_agent: 'unknown',
  custom_attributes: {
    key1: 'value1',
    'address.city': 'Kolkata',
    'address.state': 'West Bengal',
    'originalArray[0].nested_field': 'nested value',
    'originalArray[0].tags[0]': 'tag_1',
    'originalArray[0].tags[1]': 'tag_2',
    'originalArray[0].tags[2]': 'tag_3',
    'originalArray[1].nested_field': 'nested value',
    'originalArray[1].tags[0]': 'tag_1',
    'originalArray[2].nested_field': 'nested value',
    anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
  },
  update_last_request_at: true,
};

const expectedUser5Traits = {
  name: 'Test Name',
  phone: '9876543210',
  email: 'test_1@test.com',
  signed_up_at: 1601493060,
  update_last_request_at: true,
  last_seen_user_agent: 'unknown',
  custom_attributes: {
    key1: 'value1',
    anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
  },
};

const expectedUser6Traits = {
  name: 'Name',
  phone: '9876543210',
  email: 'test_1@test.com',
  signed_up_at: 1601493060,
  last_seen_user_agent: 'unknown',
  update_last_request_at: true,
  custom_attributes: {
    key1: 'value1',
    anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
  },
  companies: [
    {
      name: 'Test Comp',
      industry: 'test industry',
      company_id: 'company_id',
      custom_attributes: {
        key1: 'value1',
        key2: JSON.stringify({ a: 'a' }),
        key3: '[1,2,3]',
      },
    },
  ],
};

const expectedUser7Traits = {
  custom_attributes: {
    anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
    key1: 'value1',
  },
  email: 'test_1@test.com',
  name: 'Test Name',
  phone: '9876543210',
  signed_up_at: 1601493060,
};

const timestamp = '2023-11-22T10:12:44.757+05:30';
const originalTimestamp = '2023-11-10T14:42:44.724Z';

const v2Endpoint = 'https://api.intercom.io/contacts';
const v1Endpoint = 'https://api.intercom.io/users';

export const identifyTestData = [
  {
    id: 'intercom-identify-test-1',
    name: 'intercom',
    description: 'V2 version : Create customer with email as lookup field',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200 and response should contain create user payload with all traits',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: v2Destination,
            message: generateSimplifiedIdentifyPayload({
              userId: 'user@1',
              context: {
                traits: user1Traits,
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
              userId: '',
              endpoint: v2Endpoint,
              headers: v2Headers,
              JSON: expectedUser1Traits,
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'intercom-identify-test-2',
    name: 'intercom',
    description: 'V2 version : Update customer with email as lookup field',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200 and response should contain update user payload with all traits',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: v2Destination,
            message: generateSimplifiedIdentifyPayload({
              userId: 'user@2',
              context: {
                traits: user2Traits,
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
              userId: '',
              endpoint: `${v2Endpoint}/7070129940741e45d040`,
              headers: v2Headers,
              method: 'PUT',
              JSON: expectedUser2Traits,
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'intercom-identify-test-3',
    name: 'intercom',
    description: 'V2 version : Identify rEtl test',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200 and response should contain create user payload with all traits',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: v2Destination,
            message: {
              context: {
                externalId: [
                  {
                    id: 'user@1',
                    type: 'INTERCOM-customer',
                    identifierType: 'user_id',
                  },
                ],
                mappedToDestination: 'true',
              },
              traits: user3Traits,
              type: 'identify',
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
              endpoint: v2Endpoint,
              headers: v2Headers,
              method: 'POST',
              JSON: expectedUser3Traits,
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'intercom-identify-test-4',
    name: 'intercom',
    description: 'V1 version : successful identify call to create user',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200 and response should contain create user payload with all traits',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: v1Destination,
            message: {
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              context: {
                traits: user4Traits,
                userAgent: 'unknown',
              },
              type: 'identify',
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
              userId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              endpoint: v1Endpoint,
              headers: v1Headers,
              method: 'POST',
              JSON: expectedUser4Traits,
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'intercom-identify-test-5',
    name: 'intercom',
    description: 'V1 version : successful identify call to create user',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200 and response should contain create user payload with all traits',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: v1Destination,
            message: {
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              context: {
                traits: user5Traits,
                userAgent: 'unknown',
              },
              type: 'identify',
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
              userId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              endpoint: v1Endpoint,
              headers: v1Headers,
              method: 'POST',
              JSON: expectedUser5Traits,
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'intercom-identify-test-6',
    name: 'intercom',
    description: 'V1 version : successful identify call to update user',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200 and response should contain update user payload with all traits',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: v1Destination,
            message: {
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              context: {
                traits: { ...user5Traits, firstName: undefined },
                userAgent: 'unknown',
              },
              type: 'identify',
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
              userId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              endpoint: v1Endpoint,
              headers: v1Headers,
              method: 'POST',
              JSON: { ...expectedUser5Traits, name: 'Name' },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'intercom-identify-test-7',
    name: 'intercom',
    description: 'V1 version : successful identify call to update user',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200 and response should contain update user payload with all traits',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: v1Destination,
            message: {
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              context: {
                traits: { ...user5Traits, lastName: undefined },
                userAgent: 'unknown',
              },
              type: 'identify',
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
              userId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              endpoint: v1Endpoint,
              headers: v1Headers,
              method: 'POST',
              JSON: { ...expectedUser5Traits, name: 'Test' },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'intercom-identify-test-8',
    name: 'intercom',
    description: 'V1 version : successful identify call to create user',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200 and response should contain create user payload with all traits',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: v1Destination,
            message: {
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              context: {
                traits: user6Traits,
                userAgent: 'unknown',
              },
              type: 'identify',
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
              userId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              endpoint: v1Endpoint,
              headers: v1Headers,
              method: 'POST',
              JSON: expectedUser6Traits,
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'intercom-identify-test-9',
    name: 'intercom',
    description: 'V1 version : successful identify call to create user',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200 and response should contain create user payload with all traits',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: v1Destination,
            message: {
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              context: {
                traits: {
                  ...user6Traits,
                  company: {
                    name: 'Test Comp',
                    industry: 'test industry',
                    key1: 'value1',
                    key2: null,
                    key3: ['value1', 'value2'],
                    key4: {
                      foo: 'bar',
                    },
                  },
                },
                userAgent: 'unknown',
              },
              type: 'identify',
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
              userId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              endpoint: v1Endpoint,
              headers: v1Headers,
              method: 'POST',
              JSON: {
                ...expectedUser6Traits,
                companies: [
                  {
                    ...expectedUser6Traits.companies[0],
                    custom_attributes: {
                      key1: 'value1',
                      key3: JSON.stringify(['value1', 'value2']),
                      key4: JSON.stringify({ foo: 'bar' }),
                    },
                    company_id: 'c0277b5c814453e5135f515f943d085a',
                  },
                ],
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
    id: 'intercom-identify-test-10',
    name: 'intercom',
    description: 'V1 version : successful identify call to update user',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200 and response should contain update user payload with all traits',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: v1Destination,
            message: {
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              context: {
                traits: {
                  ...user5Traits,
                  firstName: undefined,
                  company: {
                    industry: 'test industry',
                    key1: 'value1',
                    key2: null,
                  },
                },
                userAgent: 'unknown',
              },
              type: 'identify',
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
              userId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              endpoint: v1Endpoint,
              headers: v1Headers,
              method: 'POST',
              JSON: { ...expectedUser5Traits, companies: [], name: 'Name' },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'intercom-identify-test-11',
    name: 'intercom',
    description:
      'No Version : Successful identify call to create user without giving apiVersion in configuration',
    scenario: 'Business',
    successCriteria:
      'Response should take v1 apiVersion by default and response status code should be 200 and response should contain create user payload with all traits',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: { ...v1Destination, apiVersion: undefined },
            message: {
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              context: {
                traits: user4Traits,
                userAgent: 'unknown',
              },
              type: 'identify',
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
              userId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              endpoint: v1Endpoint,
              headers: v1Headers,
              method: 'POST',
              JSON: expectedUser4Traits,
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'intercom-identify-test-12',
    name: 'intercom',
    description:
      'No Version : Successful identify call to create user without giving apiVersion in configuration',
    scenario: 'Business',
    successCriteria:
      'Response should take v1 apiVersion by default and response status code should be 200 and response should contain create user payload with all traits',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: { ...v1Destination, apiVersion: undefined },
            message: {
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              context: {
                traits: user5Traits,
                userAgent: 'unknown',
              },
              type: 'identify',
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
              userId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              endpoint: v1Endpoint,
              headers: v1Headers,
              method: 'POST',
              JSON: expectedUser5Traits,
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'intercom-identify-test-13',
    name: 'intercom',
    description:
      'No Version : Successful identify call to update user without giving apiVersion in configuration',
    scenario: 'Business',
    successCriteria:
      'Response should take v1 apiVersion by default and response status code should be 200 and response should contain update user payload with all traits',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: { ...v1Destination, apiVersion: undefined },
            message: {
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              context: {
                traits: { ...user5Traits, firstName: undefined },
                userAgent: 'unknown',
              },
              type: 'identify',
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
              userId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              endpoint: v1Endpoint,
              headers: v1Headers,
              method: 'POST',
              JSON: { ...expectedUser5Traits, name: 'Name' },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'intercom-identify-test-14',
    name: 'intercom',
    description:
      'V1 version : Successful identify call to update user with sendAnonymousId configuration set to true',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200 and response should contain update user payload with all traits and userId should be equal to anonymousId',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: v1Destination,
            message: {
              anonymousId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              context: {
                traits: user5Traits,
                userAgent: 'unknown',
              },
              type: 'identify',
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
              userId: '58b21c2d-f8d5-4410-a2d0-b268a26b7e33',
              endpoint: v1Endpoint,
              headers: v1Headers,
              method: 'POST',
              JSON: expectedUser5Traits,
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'intercom-identify-test-15',
    name: 'intercom',
    description: 'V1 version : Identify rEtl test',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200 and response should contain create user payload with all traits',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: v1Destination,
            message: {
              context: {
                externalId: [
                  {
                    id: '10156',
                    type: 'INTERCOM-customer',
                    identifierType: 'user_id',
                  },
                ],
                mappedToDestination: 'true',
                traits: user5Traits,
              },
              type: 'identify',
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
              endpoint: v1Endpoint,
              headers: v1Headers,
              method: 'POST',
              JSON: {
                ...user5Traits,
                user_id: '10156',
                name: 'Test Name',
                update_last_request_at: true,
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
    id: 'intercom-identify-test-16',
    name: 'intercom',
    description: 'V1 version : Identify test with different lookup field than email',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200 and response should contain update user payload with all traits',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: v2Destination,
            message: {
              context: {
                externalId: [
                  {
                    id: '10156',
                    type: 'INTERCOM-customer',
                    identifierType: 'user_id',
                  },
                ],
                traits: { ...user5Traits, external_id: '10156' },
              },
              type: 'identify',
              timestamp,
              originalTimestamp,
              integrations: {
                INTERCOM: {
                  lookup: 'external_id',
                },
              },
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
              endpoint: `${v2Endpoint}/7070129940741e45d040`,
              headers: v2Headers,
              method: 'PUT',
              JSON: expectedUser7Traits,
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
];
