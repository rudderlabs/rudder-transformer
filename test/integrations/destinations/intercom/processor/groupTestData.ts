import { authHeader1, secret1, authHeader3, secret3 } from '../maskedSecrets';
import { Destination } from '../../../../../src/types';
import {
  generateMetadata,
  transformResultBuilder,
  generateSimplifiedGroupPayload,
} from '../../../testUtils';

const v1Config = {
  apiKey: secret3,
  appId: 'asdasdasd',
  apiVersion: 'v1',
  collectContext: false,
};

const v2Config = {
  apiKey: secret1,
  apiVersion: 'v2',
  apiServer: 'standard',
  sendAnonymousId: false,
};

const v1Headers = {
  'Content-Type': 'application/json',
  Authorization: authHeader3,
  Accept: 'application/json',
  'Intercom-Version': '1.4',
  'User-Agent': 'RudderStack',
};

const v2Headers = {
  Accept: 'application/json',
  Authorization: authHeader1,
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
  ownerId: '17',
  firstName: 'John',
  lastName: 'Snow',
  phone: '+91 9599999999',
  email: 'test+5@rudderlabs.com',
};

const group1Traits = {
  size: 500,
  industry: 'CDP',
  plan: 'enterprise',
  name: 'RudderStack',
  website: 'www.rudderstack.com',
};

const group2Traits = {
  size: '50',
  key1: 'val1',
  plan: 'basic',
  industry: 'IT',
  employees: 450,
  monthlySpend: '2131231',
  userId: 'sdfrsdfsdfsf',
  email: 'test@test.com',
  name: 'rudderUpdate',
  remoteCreatedAt: '1683017572',
};

const timestamp = '2023-11-22T10:12:44.757+05:30';
const originalTimestamp = '2023-11-10T14:42:44.724Z';

const endpoint = 'https://api.intercom.io/companies';

export const groupTestData = [
  {
    id: 'intercom-group-test-1',
    name: 'intercom',
    description: 'V2 version : Successful group call to create or update company',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200 and response should contain create or update company payload',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: v2Destination,
            message: generateSimplifiedGroupPayload({
              userId: 'user@4',
              groupId: 'rudderlabs',
              context: {
                traits: { email: 'test+4@rudderlabs.com' },
              },
              traits: group1Traits,
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
              JSON: { company_id: 'rudderlabs', ...group1Traits },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'intercom-group-test-2',
    name: 'intercom',
    description: 'V2 version : Successful group call to add user to company',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200 and response should contain add user to company payload',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {   hasDynamicConfig: false, ...v2Destination, Config: { ...v2Destination.Config, apiServer: 'eu' } },
            message: generateSimplifiedGroupPayload({
              userId: 'user@5',
              groupId: 'rudderlabs',
              context: {
                traits: userTraits,
              },
              traits: group1Traits,
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
              endpoint: 'https://api.eu.intercom.io/contacts/70701240741e45d040/companies',
              headers: v2Headers,
              JSON: { id: '657264e9018c0a647s45' },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'intercom-group-test-3',
    name: 'intercom',
    description:
      'V1 version : successful group call to create company and add user to company based on userId',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200 and response should contain create company and add user to company payload',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: v1Destination,
            message: generateSimplifiedGroupPayload({
              userId: 'sdfrsdfsdfsf',
              anonymousId: 'sdfrsdfsdfsf',
              groupId: 'test_company_id_wdasda',
              context: {
                traits: {},
              },
              traits: group2Traits,
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
              userId: 'sdfrsdfsdfsf',
              endpoint,
              headers: v1Headers,
              JSON: {
                company_id: 'test_company_id_wdasda',
                custom_attributes: {
                  email: 'test@test.com',
                  employees: 450,
                  key1: 'val1',
                },
                industry: 'IT',
                monthly_spend: 2131231,
                name: 'rudderUpdate',
                plan: 'basic',
                remote_created_at: 1683017572,
                size: 50,
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
          {
            output: transformResultBuilder({
              userId: 'sdfrsdfsdfsf',
              endpoint: 'https://api.intercom.io/users',
              headers: v1Headers,
              JSON: {
                companies: [
                  {
                    name: 'rudderUpdate',
                    company_id: 'test_company_id_wdasda',
                  },
                ],
                user_id: 'sdfrsdfsdfsf',
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
    id: 'intercom-group-test-4',
    name: 'intercom',
    description:
      'V1 version : successful group call to create company and add user to company based on userId',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200 and response should contain create company and add user to company payload',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: v1Destination,
            message: generateSimplifiedGroupPayload({
              userId: 'sdfrsdfsdfsf',
              anonymousId: 'sdfrsdfsdfsf',
              groupId: 'test_company_id_wdasda',
              context: {
                traits: {
                  email: 'testUser@test.com',
                },
              },
              traits: { ...group2Traits, website: 'url' },
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
              userId: 'sdfrsdfsdfsf',
              endpoint,
              headers: v1Headers,
              JSON: {
                company_id: 'test_company_id_wdasda',
                custom_attributes: {
                  email: 'test@test.com',
                  employees: 450,
                  key1: 'val1',
                },
                industry: 'IT',
                monthly_spend: 2131231,
                name: 'rudderUpdate',
                plan: 'basic',
                remote_created_at: 1683017572,
                size: 50,
                website: 'url',
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
          {
            output: transformResultBuilder({
              userId: 'sdfrsdfsdfsf',
              endpoint: 'https://api.intercom.io/users',
              headers: v1Headers,
              JSON: {
                companies: [
                  {
                    name: 'rudderUpdate',
                    company_id: 'test_company_id_wdasda',
                  },
                ],
                email: 'testUser@test.com',
                user_id: 'sdfrsdfsdfsf',
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
    id: 'intercom-group-test-5',
    name: 'intercom',
    description:
      'V1 version : successful group call without userId (anonId will be considered as userId)',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200 and response should contain create company and add user to company payload',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {   hasDynamicConfig: false, ...v1Destination, Config: v1Destination.Config, sendAnonymousId: true },
            message: {
              anonymousId: 'anonId',
              groupId: 'test_company_id_wdasda',
              context: {
                traits: {
                  email: 'testUser@test.com',
                },
              },
              traits: {
                ...group2Traits,
                website: 'url',
                key1: 'val1',
                key2: {
                  a: 'a',
                  b: 'b',
                },
                key3: [1, 2, 3],
                key4: null,
              },
              type: 'group',
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
              userId: 'anonId',
              endpoint,
              headers: v1Headers,
              JSON: {
                company_id: 'test_company_id_wdasda',
                custom_attributes: {
                  email: 'test@test.com',
                  employees: 450,
                  key1: 'val1',
                  'key2.a': 'a',
                  'key2.b': 'b',
                  'key3[0]': 1,
                  'key3[1]': 2,
                  'key3[2]': 3,
                  key4: null,
                },
                industry: 'IT',
                monthly_spend: 2131231,
                name: 'rudderUpdate',
                plan: 'basic',
                remote_created_at: 1683017572,
                size: 50,
                website: 'url',
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
          {
            output: transformResultBuilder({
              userId: 'anonId',
              endpoint: 'https://api.intercom.io/users',
              headers: v1Headers,
              JSON: {
                companies: [
                  {
                    name: 'rudderUpdate',
                    company_id: 'test_company_id_wdasda',
                  },
                ],
                email: 'testUser@test.com',
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
    id: 'intercom-group-test-6',
    name: 'intercom',
    description: 'V1 version : successful group call with email as custom attribute',
    scenario: 'Business',
    successCriteria:
      'Response status code should be 200 and response should contain create company payload with email as custom attribute',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: v1Destination,
            message: {
              anonymousId: '12312312',
              groupId: 'test_company_id',
              context: {
                traits: {},
              },
              traits: { ...group1Traits, monthlySpend: '2131231', email: 'comanyemail@abc.com' },
              type: 'group',
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
              userId: '12312312',
              endpoint,
              headers: v1Headers,
              JSON: {
                ...group1Traits,
                custom_attributes: {
                  email: 'comanyemail@abc.com',
                },
                monthly_spend: 2131231,
                company_id: 'test_company_id',
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
