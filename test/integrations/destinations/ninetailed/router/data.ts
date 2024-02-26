import {
  commonInput,
  destination,
  commonOutput,
  routerInstrumentationErrorStatTags,
} from '../commonConfig';
import { trackProperties, pageProperties, traits } from './basicProperties';
import { defaultMockFns } from '../mocks';

export const data = [
  {
    name: 'ninetailed',
    id: 'Test 0 - router',
    description: 'Batch calls with all three type of calls as success',
    scenario: 'Framework+Buisness',
    successCriteria: 'All events should be transformed successfully and status code should be 200',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                ...commonInput,
                type: 'track',
                event: 'product list viewed',
                properties: trackProperties,
              },
              metadata: { jobId: 1, userId: 'u1' },
              destination,
            },
            {
              message: {
                ...commonInput,
                type: 'page',
                properties: pageProperties,
              },
              metadata: { jobId: 2, userId: 'u1' },
              destination,
            },
            {
              message: {
                type: 'identify',
                ...commonInput,
                userId: 'testuserId1',
                traits,
                integrations: { All: true },
              },
              metadata: { jobId: 3, userId: 'u1' },
              destination,
            },
          ],
          destType: 'ninetailed',
        },
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
                endpoint:
                  'https://experience.ninetailed.co/v2/organizations/dummyOrganisationId/environments/main/events',
                params: {},
                body: {
                  FORM: {},
                  JSON: {
                    events: [
                      {
                        ...commonOutput,
                        type: 'track',
                        event: 'product list viewed',
                        properties: trackProperties,
                      },
                      {
                        ...commonOutput,
                        type: 'page',
                        properties: pageProperties,
                      },
                      {
                        type: 'identify',
                        ...commonOutput,
                        userId: 'testuserId1',
                        traits,
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                headers: {
                  'Content-Type': 'application/json',
                },
                files: {},
              },
              metadata: [
                { jobId: 1, userId: 'u1' },
                { jobId: 2, userId: 'u1' },
                { jobId: 3, userId: 'u1' },
              ],
              batched: true,
              statusCode: 200,
              destination,
            },
          ],
        },
      },
    },
  },
  {
    name: 'ninetailed',
    id: 'Test 1 - router',
    description: 'Batch calls with one fail invalid event and two valid events',
    scenario: 'Framework+Buisness',
    successCriteria:
      'Two events should be transformed successfully and one should fail and status code should be 200',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                ...commonInput,
                type: 'track',
                event: 'product list viewed',
                properties: trackProperties,
              },
              metadata: { jobId: 1, userId: 'u1' },
              destination,
            },
            {
              message: {
                ...commonInput,
                type: 'page',
                properties: {
                  title: 'Sample Page',
                  url: 'https://example.com/?utm_campaign=example_campaign&utm_content=example_content',
                  path: '/',
                  hash: '',
                  search: '?utm_campaign=example_campaign&utm_content=example_content',
                  width: '1920',
                  height: '1080',
                  query: {
                    utm_campaign: 'example_campaign',
                    utm_content: 'example_content',
                  },
                  referrer: '',
                },
              },
              metadata: { jobId: 2, userId: 'u1' },
              destination,
            },
            {
              message: {
                type: 'identify',
                ...commonInput,
                traits,
                integrations: { All: true },
              },
              metadata: { jobId: 3, userId: 'u1' },
              destination,
            },
          ],
          destType: 'ninetailed',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batched: false,
              destination,
              error: 'Missing required value from "userIdOnly"',
              metadata: [{ jobId: 3, userId: 'u1' }],
              statTags: routerInstrumentationErrorStatTags,
              statusCode: 400,
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint:
                  'https://experience.ninetailed.co/v2/organizations/dummyOrganisationId/environments/main/events',
                params: {},
                body: {
                  FORM: {},
                  JSON: {
                    events: [
                      {
                        ...commonOutput,
                        type: 'track',
                        event: 'product list viewed',
                        properties: trackProperties,
                      },
                      {
                        ...commonOutput,
                        type: 'page',
                        properties: pageProperties,
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                headers: {
                  'Content-Type': 'application/json',
                },
                files: {},
              },
              metadata: [
                { jobId: 1, userId: 'u1' },
                { jobId: 2, userId: 'u1' },
              ],
              batched: true,
              statusCode: 200,
              destination,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
  {
    name: 'ninetailed',
    id: 'Test 2 - router',
    description: 'Batch calls with 3 succesfull events and 1 failed event',
    scenario: 'Framework+Buisness',
    successCriteria:
      '3 successful events should be distributed in two and 1 failed in one hence total batches should be 3 and status code should be 200',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                ...commonInput,
                type: 'track',
                event: 'product list viewed',
                properties: trackProperties,
              },
              metadata: { jobId: 1, userId: 'u1' },
              destination,
            },
            {
              message: {
                ...commonInput,
                type: 'page',
                properties: pageProperties,
              },
              metadata: { jobId: 2, userId: 'u1' },
              destination,
            },
            {
              message: {
                type: 'identify',
                ...commonInput,
                userId: 'testuserId1',
                traits,
                integrations: { All: true },
              },
              metadata: { jobId: 3, userId: 'u1' },
              destination,
            },
            {
              message: {
                type: 'identify',
                ...commonInput,
                traits,
                integrations: { All: true },
              },
              metadata: { jobId: 4, userId: 'u1' },
              destination,
            },
          ],
          destType: 'ninetailed',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batched: false,
              destination,
              error: 'Missing required value from "userIdOnly"',
              metadata: [{ jobId: 4, userId: 'u1' }],
              statTags: routerInstrumentationErrorStatTags,
              statusCode: 400,
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint:
                  'https://experience.ninetailed.co/v2/organizations/dummyOrganisationId/environments/main/events',
                params: {},
                body: {
                  FORM: {},
                  JSON: {
                    events: [
                      {
                        ...commonOutput,
                        type: 'track',
                        event: 'product list viewed',
                        properties: trackProperties,
                      },
                      {
                        ...commonOutput,
                        type: 'page',
                        properties: pageProperties,
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                headers: {
                  'Content-Type': 'application/json',
                },
                files: {},
              },
              metadata: [
                { jobId: 1, userId: 'u1' },
                { jobId: 2, userId: 'u1' },
              ],
              batched: true,
              statusCode: 200,
              destination,
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint:
                  'https://experience.ninetailed.co/v2/organizations/dummyOrganisationId/environments/main/events',
                params: {},
                body: {
                  FORM: {},
                  JSON: {
                    events: [
                      {
                        type: 'identify',
                        ...commonOutput,
                        userId: 'testuserId1',
                        traits,
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                },
                headers: {
                  'Content-Type': 'application/json',
                },
                files: {},
              },
              metadata: [{ jobId: 3, userId: 'u1' }],
              batched: true,
              statusCode: 200,
              destination,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
];
