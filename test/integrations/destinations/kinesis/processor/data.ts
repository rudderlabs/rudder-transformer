/**
 * Auto-migrated and optimized test cases
 * Generated on: 2025-06-27T06:58:23.676Z
 */

import { ProcessorStreamTestData } from '../../../testTypes';
import { Destination } from '../../../../../src/types';

const baseDestination: Destination = {
  ID: '1aAAvbZ2FMoxM0LuxXdqimZ9HEp',
  Name: 'Kinesis',
  DestinationDefinition: {
    ID: '1aA9lTsbB5ZZs4Lj2uIqCSYxYn4',
    Name: 'KINESIS',
    DisplayName: 'Amazon Kinesis',
    Config: {
      excludeKeys: [],
      includeKeys: [],
    },
  },
  Config: {},
  Enabled: true,
  WorkspaceID: 'default-workspace',
  Transformations: [],
  RevisionID: 'default-revision',
  IsProcessorEnabled: true,
  IsConnectionEnabled: true,
};

export const data: ProcessorStreamTestData[] = [
  {
    id: 'processor-1751007503674',
    name: 'kinesis',
    description: 'Test 0',
    scenario: 'Default processor scenario',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              anonymousId: 'c063778b-8477-4c28-a07d-cae9ab3f8e7b',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.1-rc.2',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.1-rc.2',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                page: {
                  path: '/tests/html/index4.html',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'http://localhost/tests/html/index4.html',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  age: 23,
                  email: 'testmp@rudderstack.com',
                  firstname: 'Test Kafka',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36',
              },
              event: 'Purchase',
              integrations: {
                All: true,
              },
              messageId: '09a85770-e2ab-47ae-8fd7-5770080fd4ab',
              originalTimestamp: '2020-04-15T08:31:42.174Z',
              properties: {
                currency: 'USD',
                revenue: 100,
              },
              receivedAt: '2020-04-15T14:01:42.198+05:30',
              request_ip: '[::1]:58872',
              sentAt: '2020-04-15T08:31:42.174Z',
              timestamp: '2020-04-15T14:01:42.198+05:30',
              type: 'track',
              userId: 'user12345',
            },
            metadata: {
              anonymousId: 'c063778b-8477-4c28-a07d-cae9ab3f8e7b',
              destinationId: '1aAAvbZ2FMoxM0LuxXdqimZ9HEp',
              destinationType: 'KINESIS',
              jobId: 1,
              messageId: '09a85770-e2ab-47ae-8fd7-5770080fd4ab',
              sourceId: '1WjrlZIy1d41MCceOrFbDVPnOPY',
            },
            destination: baseDestination,
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
              message: {
                anonymousId: 'c063778b-8477-4c28-a07d-cae9ab3f8e7b',
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.1.1-rc.2',
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.1.1-rc.2',
                  },
                  locale: 'en-GB',
                  os: {
                    name: '',
                    version: '',
                  },
                  page: {
                    path: '/tests/html/index4.html',
                    referrer: '',
                    search: '',
                    title: '',
                    url: 'http://localhost/tests/html/index4.html',
                  },
                  screen: {
                    density: 2,
                  },
                  traits: {
                    age: 23,
                    email: 'testmp@rudderstack.com',
                    firstname: 'Test Kafka',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36',
                },
                event: 'Purchase',
                integrations: {
                  All: true,
                },
                messageId: '09a85770-e2ab-47ae-8fd7-5770080fd4ab',
                originalTimestamp: '2020-04-15T08:31:42.174Z',
                properties: {
                  currency: 'USD',
                  revenue: 100,
                },
                receivedAt: '2020-04-15T14:01:42.198+05:30',
                request_ip: '[::1]:58872',
                sentAt: '2020-04-15T08:31:42.174Z',
                timestamp: '2020-04-15T14:01:42.198+05:30',
                type: 'track',
                userId: 'user12345',
              },
              userId: 'user12345',
            },
            metadata: {
              anonymousId: 'c063778b-8477-4c28-a07d-cae9ab3f8e7b',
              destinationId: '1aAAvbZ2FMoxM0LuxXdqimZ9HEp',
              destinationType: 'KINESIS',
              jobId: 1,
              messageId: '09a85770-e2ab-47ae-8fd7-5770080fd4ab',
              sourceId: '1WjrlZIy1d41MCceOrFbDVPnOPY',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'processor-1751007503674',
    name: 'kinesis',
    description: 'Test 1',
    scenario: 'Default processor scenario',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              anonymousId: 'c063778b-8477-4c28-a07d-cae9ab3f8e7b',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.1-rc.2',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.1-rc.2',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                page: {
                  path: '/tests/html/index4.html',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'http://localhost/tests/html/index4.html',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  age: 23,
                  email: 'testmp@rudderstack.com',
                  firstname: 'Test Kafka',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              messageId: '9e4aad09-7611-4162-9f5b-1150e53e0267',
              name: 'home',
              originalTimestamp: '2020-04-15T08:31:42.166Z',
              properties: {
                path: '/tests/html/index4.html',
                referrer: '',
                search: '',
                title: '',
                url: 'http://localhost/tests/html/index4.html',
              },
              receivedAt: '2020-04-15T14:01:42.199+05:30',
              request_ip: '[::1]:58873',
              sentAt: '2020-04-15T08:31:42.167Z',
              timestamp: '2020-04-15T14:01:42.198+05:30',
              type: 'page',
              userId: 'user12345',
            },
            metadata: {
              anonymousId: 'c063778b-8477-4c28-a07d-cae9ab3f8e7b',
              destinationId: '1aAAvbZ2FMoxM0LuxXdqimZ9HEp',
              destinationType: 'KINESIS',
              jobId: 2,
              messageId: '9e4aad09-7611-4162-9f5b-1150e53e0267',
              sourceId: '1WjrlZIy1d41MCceOrFbDVPnOPY',
            },
            destination: baseDestination,
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
              message: {
                anonymousId: 'c063778b-8477-4c28-a07d-cae9ab3f8e7b',
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.1.1-rc.2',
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.1.1-rc.2',
                  },
                  locale: 'en-GB',
                  os: {
                    name: '',
                    version: '',
                  },
                  page: {
                    path: '/tests/html/index4.html',
                    referrer: '',
                    search: '',
                    title: '',
                    url: 'http://localhost/tests/html/index4.html',
                  },
                  screen: {
                    density: 2,
                  },
                  traits: {
                    age: 23,
                    email: 'testmp@rudderstack.com',
                    firstname: 'Test Kafka',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36',
                },
                integrations: {
                  All: true,
                },
                messageId: '9e4aad09-7611-4162-9f5b-1150e53e0267',
                name: 'home',
                originalTimestamp: '2020-04-15T08:31:42.166Z',
                properties: {
                  path: '/tests/html/index4.html',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'http://localhost/tests/html/index4.html',
                },
                receivedAt: '2020-04-15T14:01:42.199+05:30',
                request_ip: '[::1]:58873',
                sentAt: '2020-04-15T08:31:42.167Z',
                timestamp: '2020-04-15T14:01:42.198+05:30',
                type: 'page',
                userId: 'user12345',
              },
              userId: 'user12345',
            },
            metadata: {
              anonymousId: 'c063778b-8477-4c28-a07d-cae9ab3f8e7b',
              destinationId: '1aAAvbZ2FMoxM0LuxXdqimZ9HEp',
              destinationType: 'KINESIS',
              jobId: 2,
              messageId: '9e4aad09-7611-4162-9f5b-1150e53e0267',
              sourceId: '1WjrlZIy1d41MCceOrFbDVPnOPY',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'processor-1751007503674',
    name: 'kinesis',
    description: 'Test 2',
    scenario: 'Default processor scenario',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              anonymousId: 'c063778b-8477-4c28-a07d-cae9ab3f8e7b',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.1-rc.2',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.1-rc.2',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                page: {
                  path: '/tests/html/index4.html',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'http://localhost/tests/html/index4.html',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  age: 23,
                  email: 'testmp@rudderstack.com',
                  firstname: 'Test Kafka',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              messageId: '89031a1e-29a9-40fd-82b5-37dab7190699',
              originalTimestamp: '2020-04-15T08:31:42.169Z',
              receivedAt: '2020-04-15T14:01:42.199+05:30',
              request_ip: '[::1]:58874',
              sentAt: '2020-04-15T08:31:42.169Z',
              timestamp: '2020-04-15T14:01:42.199+05:30',
              type: 'identify',
              userId: 'user12345',
            },
            metadata: {
              anonymousId: 'c063778b-8477-4c28-a07d-cae9ab3f8e7b',
              destinationId: '1aAAvbZ2FMoxM0LuxXdqimZ9HEp',
              destinationType: 'KINESIS',
              jobId: 3,
              messageId: '89031a1e-29a9-40fd-82b5-37dab7190699',
              sourceId: '1WjrlZIy1d41MCceOrFbDVPnOPY',
            },
            destination: baseDestination,
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
              message: {
                anonymousId: 'c063778b-8477-4c28-a07d-cae9ab3f8e7b',
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.1.1-rc.2',
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.1.1-rc.2',
                  },
                  locale: 'en-GB',
                  os: {
                    name: '',
                    version: '',
                  },
                  page: {
                    path: '/tests/html/index4.html',
                    referrer: '',
                    search: '',
                    title: '',
                    url: 'http://localhost/tests/html/index4.html',
                  },
                  screen: {
                    density: 2,
                  },
                  traits: {
                    age: 23,
                    email: 'testmp@rudderstack.com',
                    firstname: 'Test Kafka',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36',
                },
                integrations: {
                  All: true,
                },
                messageId: '89031a1e-29a9-40fd-82b5-37dab7190699',
                originalTimestamp: '2020-04-15T08:31:42.169Z',
                receivedAt: '2020-04-15T14:01:42.199+05:30',
                request_ip: '[::1]:58874',
                sentAt: '2020-04-15T08:31:42.169Z',
                timestamp: '2020-04-15T14:01:42.199+05:30',
                type: 'identify',
                userId: 'user12345',
              },
              userId: 'user12345',
            },
            metadata: {
              anonymousId: 'c063778b-8477-4c28-a07d-cae9ab3f8e7b',
              destinationId: '1aAAvbZ2FMoxM0LuxXdqimZ9HEp',
              destinationType: 'KINESIS',
              jobId: 3,
              messageId: '89031a1e-29a9-40fd-82b5-37dab7190699',
              sourceId: '1WjrlZIy1d41MCceOrFbDVPnOPY',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'processor-1751007503674',
    name: 'kinesis',
    description: 'Test 3',
    scenario: 'Default processor scenario',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              anonymousId: 'c063778b-8477-4c28-a07d-cae9ab3f8e7b',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.1-rc.2',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.1-rc.2',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                page: {
                  path: '/tests/html/index4.html',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'http://localhost/tests/html/index4.html',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  age: 23,
                  email: 'testmp@rudderstack.com',
                  firstname: 'Test Kafka',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36',
              },
              event: 'test track without property',
              integrations: {
                All: true,
              },
              messageId: '2d165402-c301-4c4f-8f17-c3c2f5a83725',
              originalTimestamp: '2020-04-15T08:31:42.17Z',
              properties: {},
              receivedAt: '2020-04-15T14:01:42.199+05:30',
              request_ip: '[::1]:58875',
              sentAt: '2020-04-15T08:31:42.171Z',
              timestamp: '2020-04-15T14:01:42.198+05:30',
              type: 'track',
              userId: 'user12345',
            },
            metadata: {
              anonymousId: 'c063778b-8477-4c28-a07d-cae9ab3f8e7b',
              destinationId: '1aAAvbZ2FMoxM0LuxXdqimZ9HEp',
              destinationType: 'KINESIS',
              jobId: 4,
              messageId: '2d165402-c301-4c4f-8f17-c3c2f5a83725',
              sourceId: '1WjrlZIy1d41MCceOrFbDVPnOPY',
            },
            destination: baseDestination,
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
              message: {
                anonymousId: 'c063778b-8477-4c28-a07d-cae9ab3f8e7b',
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.1.1-rc.2',
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.1.1-rc.2',
                  },
                  locale: 'en-GB',
                  os: {
                    name: '',
                    version: '',
                  },
                  page: {
                    path: '/tests/html/index4.html',
                    referrer: '',
                    search: '',
                    title: '',
                    url: 'http://localhost/tests/html/index4.html',
                  },
                  screen: {
                    density: 2,
                  },
                  traits: {
                    age: 23,
                    email: 'testmp@rudderstack.com',
                    firstname: 'Test Kafka',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36',
                },
                event: 'test track without property',
                integrations: {
                  All: true,
                },
                messageId: '2d165402-c301-4c4f-8f17-c3c2f5a83725',
                originalTimestamp: '2020-04-15T08:31:42.17Z',
                properties: {},
                receivedAt: '2020-04-15T14:01:42.199+05:30',
                request_ip: '[::1]:58875',
                sentAt: '2020-04-15T08:31:42.171Z',
                timestamp: '2020-04-15T14:01:42.198+05:30',
                type: 'track',
                userId: 'user12345',
              },
              userId: 'user12345',
            },
            metadata: {
              anonymousId: 'c063778b-8477-4c28-a07d-cae9ab3f8e7b',
              destinationId: '1aAAvbZ2FMoxM0LuxXdqimZ9HEp',
              destinationType: 'KINESIS',
              jobId: 4,
              messageId: '2d165402-c301-4c4f-8f17-c3c2f5a83725',
              sourceId: '1WjrlZIy1d41MCceOrFbDVPnOPY',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'processor-1751007503674',
    name: 'kinesis',
    description: 'Test 4',
    scenario: 'Default processor scenario',
    successCriteria: 'Processor test should pass successfully',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            message: {
              anonymousId: 'c063778b-8477-4c28-a07d-cae9ab3f8e7b',
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.1-rc.2',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.1-rc.2',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                page: {
                  path: '/tests/html/index4.html',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'http://localhost/tests/html/index4.html',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  age: 23,
                  email: 'testmp@rudderstack.com',
                  firstname: 'Test Kafka',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36',
              },
              event: 'test track with property',
              integrations: {
                All: true,
              },
              messageId: 'c122dbd5-43cc-4636-9baf-b724be86ad10',
              originalTimestamp: '2020-04-15T08:31:42.172Z',
              properties: {
                test_prop_1: 'test prop',
                test_prop_2: 1232,
              },
              receivedAt: '2020-04-15T14:01:42.199+05:30',
              request_ip: '[::1]:58876',
              sentAt: '2020-04-15T08:31:42.172Z',
              timestamp: '2020-04-15T14:01:42.199+05:30',
              type: 'track',
              userId: 'user12345',
            },
            metadata: {
              anonymousId: 'c063778b-8477-4c28-a07d-cae9ab3f8e7b',
              destinationId: '1aAAvbZ2FMoxM0LuxXdqimZ9HEp',
              destinationType: 'KINESIS',
              jobId: 5,
              messageId: 'c122dbd5-43cc-4636-9baf-b724be86ad10',
              sourceId: '1WjrlZIy1d41MCceOrFbDVPnOPY',
            },
            destination: baseDestination,
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
              message: {
                anonymousId: 'c063778b-8477-4c28-a07d-cae9ab3f8e7b',
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.1.1-rc.2',
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.1.1-rc.2',
                  },
                  locale: 'en-GB',
                  os: {
                    name: '',
                    version: '',
                  },
                  page: {
                    path: '/tests/html/index4.html',
                    referrer: '',
                    search: '',
                    title: '',
                    url: 'http://localhost/tests/html/index4.html',
                  },
                  screen: {
                    density: 2,
                  },
                  traits: {
                    age: 23,
                    email: 'testmp@rudderstack.com',
                    firstname: 'Test Kafka',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36',
                },
                event: 'test track with property',
                integrations: {
                  All: true,
                },
                messageId: 'c122dbd5-43cc-4636-9baf-b724be86ad10',
                originalTimestamp: '2020-04-15T08:31:42.172Z',
                properties: {
                  test_prop_1: 'test prop',
                  test_prop_2: 1232,
                },
                receivedAt: '2020-04-15T14:01:42.199+05:30',
                request_ip: '[::1]:58876',
                sentAt: '2020-04-15T08:31:42.172Z',
                timestamp: '2020-04-15T14:01:42.199+05:30',
                type: 'track',
                userId: 'user12345',
              },
              userId: 'user12345',
            },
            metadata: {
              anonymousId: 'c063778b-8477-4c28-a07d-cae9ab3f8e7b',
              destinationId: '1aAAvbZ2FMoxM0LuxXdqimZ9HEp',
              destinationType: 'KINESIS',
              jobId: 5,
              messageId: 'c122dbd5-43cc-4636-9baf-b724be86ad10',
              sourceId: '1WjrlZIy1d41MCceOrFbDVPnOPY',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
