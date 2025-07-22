import { ProcessorTestData } from '../../../testTypes';
import { destination, metadata, mockFns, headers, statTags } from '../commonConfig';

export const identifyTestData: ProcessorTestData[] = [
  {
    id: 'attentive-tag-identify-processor-test-0',
    name: 'attentive_tag',
    description: 'Successful identify event with email, phone, and custom identifiers',
    scenario: 'User identification with complete contact information and custom identifiers',
    successCriteria:
      'Should successfully create subscription with user data and custom identifiers',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              anonymousId: '4eb021e9-a2af-4926-ae82-fe996d12f3c5',
              channel: 'web',
              context: {
                locale: 'en-GB',
                traits: {
                  email: 'a@gmail.com',
                  phone: '+16405273911',
                  customIdentifiers: [
                    {
                      name: 'string',
                      value: 'string',
                    },
                  ],
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.80 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              messageId: 'e108eb05-f6cd-4624-ba8c-568f2e2b3f92',
              receivedAt: '2023-10-14T09:03:17.562Z',
              type: 'identify',
            },
            metadata,
            destination,
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint: 'https://api.attentivemobile.com/v1/subscriptions',
              headers: headers,
              params: {},
              body: {
                JSON: {
                  user: {
                    phone: '+16405273911',
                    email: 'a@gmail.com',
                  },
                  signUpSourceId: '241654',
                  externalIdentifiers: {
                    customIdentifiers: [
                      {
                        name: 'string',
                        value: 'string',
                      },
                    ],
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'attentive-tag-identify-processor-test-1',
    name: 'attentive_tag',
    description: 'Identify event with unsubscribe operation',
    scenario: 'User unsubscription request with phone number',
    successCriteria: 'Should successfully call unsubscribe endpoint with user phone',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              anonymousId: '4eb021e9-a2af-4926-ae82-fe996d12f3c5',
              channel: 'web',
              context: {
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                traits: {
                  company: {
                    id: 'abc123',
                  },
                  createdAt: 'Thu Mar 24 2016 17:46:45 GMT+0000 (UTC)',
                  phone: '+16465453911',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.80 Safari/537.36',
              },
              integrations: {
                All: true,
                attentive_tag: {
                  signUpSourceId: '241654',
                  identifyOperation: 'unsubscribe',
                },
              },
              messageId: 'e108eb05-f6cd-4624-ba8c-568f2e2b3f92',
              receivedAt: '2020-10-16T13:56:14.945+05:30',
              type: 'identify',
            },
            metadata,
            destination,
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint: 'https://api.attentivemobile.com/v1/subscriptions/unsubscribe',
              headers: headers,
              params: {},
              body: {
                JSON: {
                  user: {
                    phone: '+16465453911',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'attentive-tag-identify-processor-test-2',
    name: 'attentive_tag',
    description: 'Identify event with explicit subscribe operation',
    scenario: 'User subscription request with email and phone',
    successCriteria: 'Should successfully create subscription with user contact information',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              anonymousId: '4eb021e9-a2af-4926-ae82-fe996d12f3c5',
              channel: 'web',
              context: {
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                traits: {
                  company: {
                    id: 'abc123',
                  },
                  createdAt: 'Thu Mar 24 2016 17:46:45 GMT+0000 (UTC)',
                  email: 'test0@gmail.com',
                  phone: '+16465453911',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.80 Safari/537.36',
              },
              integrations: {
                All: true,
                attentive_tag: {
                  signUpSourceId: '241654',
                  identifyOperation: 'subscribe',
                },
              },
              messageId: 'e108eb05-f6cd-4624-ba8c-568f2e2b3f92',
              receivedAt: '2023-10-14T13:56:14.945+05:30',
              type: 'identify',
            },
            metadata,
            destination,
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint: 'https://api.attentivemobile.com/v1/subscriptions',
              headers: headers,
              params: {},
              body: {
                JSON: {
                  user: {
                    phone: '+16465453911',
                    email: 'test0@gmail.com',
                  },
                  signUpSourceId: '241654',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'attentive-tag-identify-processor-test-3',
    name: 'attentive_tag',
    description: 'Identify event with default operation',
    scenario: 'User identification without explicit operation (defaults to subscribe)',
    successCriteria: 'Should successfully create subscription with user contact information',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              anonymousId: '4eb021e9-a2af-4926-ae82-fe996d12f3c5',
              channel: 'web',
              context: {
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                traits: {
                  company: {
                    id: 'abc123',
                  },
                  createdAt: 'Thu Mar 24 2016 17:46:45 GMT+0000 (UTC)',
                  email: 'test0@gmail.com',
                  phone: '+16465453911',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.80 Safari/537.36',
              },
              integrations: {
                All: true,
                attentive_tag: {
                  signUpSourceId: '241654',
                },
              },
              messageId: 'e108eb05-f6cd-4624-ba8c-568f2e2b3f92',
              receivedAt: '2023-10-14T13:56:14.945+05:30',
              type: 'identify',
            },
            metadata,
            destination,
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint: 'https://api.attentivemobile.com/v1/subscriptions',
              headers: headers,
              params: {},
              body: {
                JSON: {
                  user: {
                    phone: '+16465453911',
                    email: 'test0@gmail.com',
                  },
                  signUpSourceId: '241654',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'attentive-tag-identify-processor-test-4',
    name: 'attentive_tag',
    description: 'Identify event with enableNewIdentifyFlow enabled',
    scenario: "User identification using Attentive's Identity and User Attribute APIs",
    successCriteria:
      'Should successfully create user profile using new identify flow with Identity and User Attribute APIs',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              anonymousId: '4eb021e9-a2af-4926-ae82-fe996d12f3c5',
              channel: 'web',
              context: {
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                externalId: [
                  {
                    type: 'clientUserId',
                    id: '144',
                  },
                  {
                    type: 'shopifyId',
                    id: '224',
                  },
                  {
                    type: 'klaviyoId',
                    id: '132',
                  },
                ],
                traits: {
                  email: 'test@gmail.com',
                  phone: '+10000000000',
                  firstName: 'John',
                  lastName: 'Doe',
                  city: 'New York City',
                  country: 'USA',
                  customIdentifiers: [
                    {
                      name: 'customIdentifier-1',
                      value: 'customValue-1',
                    },
                  ],
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.80 Safari/537.36',
              },
              integrations: {
                All: true,
                attentive_tag: {
                  signUpSourceId: '241654',
                },
              },
              messageId: 'e108eb05-f6cd-4624-ba8c-568f2e2b3f92',
              receivedAt: '2023-10-14T13:56:14.945+05:30',
              type: 'identify',
            },
            metadata,
            destination: {
              ...destination,
              Config: {
                ...destination.Config,
                enableNewIdentifyFlow: true,
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint: 'https://api.attentivemobile.com/v1/identity-resolution/user-identifiers',
              headers: headers,
              params: {},
              body: {
                JSON: {
                  phone: '+10000000000',
                  email: 'test@gmail.com',
                  shopifyId: '224',
                  klaviyoId: '132',
                  clientUserId: '144',
                  customIdentifiers: [
                    {
                      name: 'customIdentifier-1',
                      value: 'customValue-1',
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            metadata,
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint: 'https://api.attentivemobile.com/v1/attributes/custom',
              headers: headers,
              params: {},
              body: {
                JSON: {
                  user: {
                    phone: '+10000000000',
                    email: 'test@gmail.com',
                    externalIdentifiers: {
                      clientUserId: '144',
                      customIdentifiers: [
                        {
                          name: 'customIdentifier-1',
                          value: 'customValue-1',
                        },
                      ],
                    },
                  },
                  properties: {
                    firstName: 'John',
                    lastName: 'Doe',
                    city: 'New York City',
                    country: 'USA',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'attentive-tag-identify-processor-test-5',
    name: 'attentive_tag',
    description: 'Identify event with enableNewIdentifyFlow enabled - minimal data',
    scenario:
      "User identification with only email/phone using Attentive's Identity and User Attribute APIs",
    successCriteria:
      'Should successfully create user profile using new identify flow without user attributes',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              anonymousId: '4eb021e9-a2af-4926-ae82-fe996d12f3c5',
              channel: 'web',
              context: {
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                externalId: [
                  {
                    type: 'clientUserId',
                    id: '144',
                  },
                  {
                    type: 'shopifyId',
                    id: '224',
                  },
                  {
                    type: 'klaviyoId',
                    id: '132',
                  },
                ],
                traits: {
                  email: 'test@gmail.com',
                  phone: '+10000000000',
                  customIdentifiers: [
                    {
                      name: 'customIdentifier-1',
                      value: 'customValue-1',
                    },
                  ],
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.80 Safari/537.36',
              },
              integrations: {
                All: true,
                attentive_tag: {
                  signUpSourceId: '241654',
                },
              },
              messageId: 'e108eb05-f6cd-4624-ba8c-568f2e2b3f92',
              receivedAt: '2023-10-14T13:56:14.945+05:30',
              type: 'identify',
            },
            metadata,
            destination: {
              ...destination,
              Config: {
                ...destination.Config,
                enableNewIdentifyFlow: true,
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint: 'https://api.attentivemobile.com/v1/identity-resolution/user-identifiers',
              headers: headers,
              params: {},
              body: {
                JSON: {
                  phone: '+10000000000',
                  email: 'test@gmail.com',
                  clientUserId: '144',
                  shopifyId: '224',
                  klaviyoId: '132',
                  customIdentifiers: [
                    {
                      name: 'customIdentifier-1',
                      value: 'customValue-1',
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'attentive-tag-identify-processor-test-6',
    name: 'attentive_tag',
    description: 'Identify event with enableNewIdentifyFlow enabled - no email/phone',
    scenario:
      "User identification with only clientUserId and traits using Attentive's User Attribute API",
    successCriteria:
      'Should successfully add user attributes to existing user profile with clientUserId only',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              anonymousId: '4eb021e9-a2af-4926-ae82-fe996d12f3c5',
              channel: 'web',
              context: {
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                externalId: [
                  {
                    type: 'clientUserId',
                    id: 'user123',
                  },
                ],
                traits: {
                  firstName: 'Jane',
                  lastName: 'Smith',
                  city: 'Los Angeles',
                  country: 'USA',
                  age: 28,
                  gender: 'female',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.80 Safari/537.36',
              },
              integrations: {
                All: true,
                attentive_tag: {
                  signUpSourceId: '241654',
                },
              },
              messageId: 'e108eb05-f6cd-4624-ba8c-568f2e2b3f92',
              receivedAt: '2023-10-14T13:56:14.945+05:30',
              type: 'identify',
            },
            metadata,
            destination: {
              ...destination,
              Config: {
                ...destination.Config,
                enableNewIdentifyFlow: true,
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint: 'https://api.attentivemobile.com/v1/attributes/custom',
              headers: headers,
              params: {},
              body: {
                JSON: {
                  user: {
                    externalIdentifiers: {
                      clientUserId: 'user123',
                    },
                  },
                  properties: {
                    firstName: 'Jane',
                    lastName: 'Smith',
                    city: 'Los Angeles',
                    country: 'USA',
                    age: 28,
                    gender: 'female',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'attentive-tag-identify-processor-test-insufficient-identity',
    name: 'attentive_tag',
    description: 'Identify event with only clientUserId - insufficient for identity resolution',
    scenario: 'User identification with only clientUserId, no other identifiers',
    successCriteria: 'Should NOT make identity resolution API call due to insufficient identifiers',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              anonymousId: '4eb021e9-a2af-4926-ae82-fe996d12f3c5',
              channel: 'web',
              context: {
                locale: 'en-GB',
                externalId: [
                  {
                    type: 'clientUserId',
                    id: 'user123',
                  },
                ],
                traits: {
                  firstName: 'John',
                  lastName: 'Doe',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.80 Safari/537.36',
              },
              integrations: {
                All: true,
                attentive_tag: {
                  signUpSourceId: '241654',
                },
              },
              messageId: 'e108eb05-f6cd-4624-ba8c-568f2e2b3f92',
              receivedAt: '2023-10-14T13:56:14.945+05:30',
              type: 'identify',
            },
            metadata,
            destination: {
              ...destination,
              Config: {
                ...destination.Config,
                enableNewIdentifyFlow: true,
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint: 'https://api.attentivemobile.com/v1/attributes/custom',
              headers: headers,
              params: {},
              body: {
                JSON: {
                  user: {
                    externalIdentifiers: {
                      clientUserId: 'user123',
                    },
                  },
                  properties: {
                    firstName: 'John',
                    lastName: 'Doe',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
  {
    id: 'attentive-tag-identify-processor-test-client-user-custom-identifiers',
    name: 'attentive_tag',
    description:
      'Identify event with clientUserId and customIdentifiers - sufficient for identity resolution',
    scenario: 'User identification with both clientUserId and customIdentifiers',
    successCriteria: 'Should make identity resolution API call with both identifiers',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              anonymousId: '4eb021e9-a2af-4926-ae82-fe996d12f3c5',
              channel: 'web',
              context: {
                locale: 'en-GB',
                externalId: [
                  {
                    type: 'clientUserId',
                    id: 'user456',
                  },
                ],
                traits: {
                  firstName: 'Alice',
                  lastName: 'Johnson',
                  customIdentifiers: [
                    {
                      name: 'loyaltyId',
                      value: 'LOYALTY123',
                    },
                    {
                      name: 'memberId',
                      value: 'MEMBER789',
                    },
                  ],
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.80 Safari/537.36',
              },
              integrations: {
                All: true,
                attentive_tag: {
                  signUpSourceId: '241654',
                },
              },
              messageId: 'e108eb05-f6cd-4624-ba8c-568f2e2b3f92',
              receivedAt: '2023-10-14T13:56:14.945+05:30',
              type: 'identify',
            },
            metadata,
            destination: {
              ...destination,
              Config: {
                ...destination.Config,
                enableNewIdentifyFlow: true,
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint: 'https://api.attentivemobile.com/v1/identity-resolution/user-identifiers',
              headers: headers,
              params: {},
              body: {
                JSON: {
                  clientUserId: 'user456',
                  customIdentifiers: [
                    {
                      name: 'loyaltyId',
                      value: 'LOYALTY123',
                    },
                    {
                      name: 'memberId',
                      value: 'MEMBER789',
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            metadata,
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint: 'https://api.attentivemobile.com/v1/attributes/custom',
              headers: headers,
              params: {},
              body: {
                JSON: {
                  user: {
                    externalIdentifiers: {
                      clientUserId: 'user456',
                      customIdentifiers: [
                        {
                          name: 'loyaltyId',
                          value: 'LOYALTY123',
                        },
                        {
                          name: 'memberId',
                          value: 'MEMBER789',
                        },
                      ],
                    },
                  },
                  properties: {
                    firstName: 'Alice',
                    lastName: 'Johnson',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
            },
            metadata,
            statusCode: 200,
          },
        ],
      },
    },
    mockFns,
  },
];
