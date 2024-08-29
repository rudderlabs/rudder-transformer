import { generateMetadata } from '../../../testUtils';
import {
  destType,
  destinations,
  traits,
  properties,
  RouterInstrumentationErrorStatTags,
} from '../common';

const routerRequest1 = {
  input: [
    {
      message: {
        type: 'identify',
        userId: 'userId1',
        traits,
      },
      metadata: generateMetadata(1),
      destination: destinations[3],
    },
    {
      message: {
        type: 'identify',
        userId: 'userId2',
        traits,
      },
      metadata: generateMetadata(2),
      destination: destinations[3],
    },
    {
      message: {
        type: 'identify',
        userId: 'userId1',
        traits,
      },
      metadata: generateMetadata(3),
      destination: destinations[3],
    },
  ],
  destType,
};

const routerRequest2 = {
  input: [
    {
      message: {
        type: 'identify',
        userId: 'userId1',
        traits,
      },
      metadata: generateMetadata(1, 'userId1'),
      destination: destinations[1],
    },
    {
      message: {
        type: 'identify',
        userId: 'userId2',
        traits: { ...traits, firstName: 'Alex', lastName: 'T', email: 'alex.t@example.com' },
      },
      metadata: generateMetadata(2, 'userId2'),
      destination: destinations[1],
    },
    {
      message: {
        type: 'identify',
        userId: 'userId1',
        traits: { ...traits, phone: '2234567890' },
      },
      metadata: generateMetadata(3, 'userId1'),
      destination: destinations[1],
    },
    {
      message: {
        type: 'identify',
        userId: 'userId1',
        traits: { ...traits, phone: '3234567890' },
      },
      metadata: generateMetadata(4, 'userId1'),
      destination: destinations[1],
    },
  ],
  destType,
};

const routerRequest3 = {
  input: [
    {
      message: {
        type: 'track',
        userId: 'userId1',
        event: 'Product Viewed',
        context: { traits },
      },
      metadata: generateMetadata(1, 'userId1'),
      destination: destinations[5],
    },
    {
      message: {
        type: 'track',
        userId: 'userId2',
        event: 'Order Completed',
        context: { traits },
        properties,
      },
      metadata: generateMetadata(2, 'userId2'),
      destination: destinations[5],
    },
    {
      message: {
        type: 'track',
        userId: 'userId3',
        event: 'Product Added',
        context: { traits },
        properties,
      },
      metadata: generateMetadata(3, 'userId3'),
      destination: destinations[5],
    },
  ],
  destType,
};

// TODO: add failure testcases
export const data = [
  {
    id: 'webhook_v2-router-test-1',
    name: destType,
    description: 'Batch multiple GET requests in a single batch with given batch size',
    scenario: 'Framework',
    successCriteria: 'All events should be transformed successfully and status code should be 200',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: routerRequest1,
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'GET',
                endpoint: 'http://abc.com/contacts/$.traits.userId/',
                headers: {
                  'x-api-key': 'test-api-key',
                },
                params: {},
                body: {
                  JSON: {},
                  JSON_ARRAY: { batch: '[]' },
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(1), generateMetadata(2), generateMetadata(3)],
              batched: true,
              statusCode: 200,
              destination: destinations[3],
            },
          ],
        },
      },
    },
  },
  {
    id: 'webhook_v2-router-test-2',
    name: destType,
    description:
      'Batch multiple GET requests in multiple batches when number of requests are greater then given batch size',
    scenario: 'Framework',
    successCriteria: 'All events should be transformed successfully and status code should be 200',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: routerRequest2,
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'GET',
                endpoint: 'http://abc.com/contact/$traits.userId',
                headers: {
                  Authorization: 'Basic dGVzdC11c2VyOg==',
                  'content-type': 'application/json',
                  h1: 'val1',
                  h2: 2,
                  h3: 'John',
                },
                params: {
                  q1: 'val1',
                  q2: 'john.doe@example.com',
                },
                body: {
                  JSON: {},
                  JSON_ARRAY: {
                    batch: '[]',
                  },
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(1, 'userId1'), generateMetadata(3, 'userId1')],
              batched: true,
              statusCode: 200,
              destination: destinations[1],
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'GET',
                endpoint: 'http://abc.com/contact/$traits.userId',
                headers: {
                  Authorization: 'Basic dGVzdC11c2VyOg==',
                  'content-type': 'application/json',
                  h1: 'val1',
                  h2: 2,
                  h3: 'John',
                },
                params: {
                  q1: 'val1',
                  q2: 'john.doe@example.com',
                },
                body: {
                  JSON: {},
                  JSON_ARRAY: {
                    batch: '[]',
                  },
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(4, 'userId1')],
              batched: true,
              statusCode: 200,
              destination: destinations[1],
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'GET',
                endpoint: 'http://abc.com/contact/$traits.userId',
                headers: {
                  Authorization: 'Basic dGVzdC11c2VyOg==',
                  'content-type': 'application/json',
                  h1: 'val1',
                  h2: 2,
                  h3: 'Alex',
                },
                params: {
                  q1: 'val1',
                  q2: 'alex.t@example.com',
                },
                body: {
                  JSON: {},
                  JSON_ARRAY: {
                    batch: '[]',
                  },
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(2, 'userId2')],
              batched: true,
              statusCode: 200,
              destination: destinations[1],
            },
          ],
        },
      },
    },
  },
  {
    id: 'webhook_v2-router-test-3',
    name: destType,
    description: 'Batch multiple POST requests with properties mappings',
    scenario: 'Framework',
    successCriteria: 'All events should be transformed successfully and status code should be 200',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: routerRequest3,
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'http://abc.com/events',
                params: {},
                headers: {
                  'content-type': 'application/json',
                },
                body: {
                  JSON: {},
                  JSON_ARRAY: {
                    batch:
                      '[{"event":"Product Viewed","userId":"userId1","properties":{"items":[]}},{"event":"Order Completed","currency":"USD","userId":"userId2","properties":{"items":[{"item_id":"622c6f5d5cf86a4c77358033","name":"Cones of Dunshire","price":40},{"item_id":"577c6f5d5cf86a4c7735ba03","name":"Five Crowns","price":5}]}},{"event":"Product Added","currency":"USD","userId":"userId3","properties":{"items":[{"item_id":"622c6f5d5cf86a4c77358033","name":"Cones of Dunshire","price":40},{"item_id":"577c6f5d5cf86a4c7735ba03","name":"Five Crowns","price":5}]}}]',
                  },
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                generateMetadata(1, 'userId1'),
                generateMetadata(2, 'userId2'),
                generateMetadata(3, 'userId3'),
              ],
              batched: true,
              statusCode: 200,
              destination: destinations[5],
            },
          ],
        },
      },
    },
  },
];
