import { RouterTestData } from '../../../testTypes';
import { generateMetadata, generateRecordPayload } from '../../../testUtils';
import {
  destType,
  destination,
  emailProjectDestination,
  euDestination,
  euSubscribeEndpoint,
  headers,
  routerConfigurationErrorStatTags,
  routerInstrumentationErrorStatTags,
  subscribeEndpoint,
  unsubscribeEndpoint,
} from '../common';

const metadataForJob = (jobId: number) => generateMetadata(jobId);

const largeInsertInputs = Array.from({ length: 1001 }, (_, index) => ({
  message: generateRecordPayload({
    action: 'insert',
    identifiers: {
      email: `user${index + 1}@example.com`,
    },
  }),
  metadata: metadataForJob(index + 1),
  destination: emailProjectDestination,
}));

const firstChunkSubscribers = Array.from({ length: 1000 }, (_, index) => ({
  email: `user${index + 1}@example.com`,
}));
const secondChunkSubscribers = [{ email: 'user1001@example.com' }];

export const data: RouterTestData[] = [
  {
    id: 'iterable-audience-router-basic-action-mapping',
    name: destType,
    description: 'Routes insert/update to subscribe and delete to unsubscribe',
    scenario: 'Default router scenario',
    successCriteria:
      'Insert and update are batched to subscribe endpoint, delete is batched to unsubscribe endpoint with channelUnsubscribe=false',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: generateRecordPayload({
                action: 'insert',
                identifiers: {
                  email: 'insert-user@example.com',
                  userId: 'insert-user-id',
                },
              }),
              metadata: metadataForJob(1),
              destination,
            },
            {
              message: generateRecordPayload({
                action: 'update',
                identifiers: {
                  userId: 'update-user-id',
                },
              }),
              metadata: metadataForJob(2),
              destination,
            },
            {
              message: generateRecordPayload({
                action: 'delete',
                identifiers: {
                  email: 'delete-user@example.com',
                },
              }),
              metadata: metadataForJob(3),
              destination,
            },
          ],
          destType,
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
                endpoint: subscribeEndpoint,
                endpointPath: '/api/lists/subscribe',
                headers,
                params: {},
                body: {
                  JSON: {
                    listId: 12345,
                    subscribers: [
                      { email: 'insert-user@example.com' },
                      { userId: 'update-user-id' },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [metadataForJob(1), metadataForJob(2)],
              batched: true,
              statusCode: 200,
              destination,
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: unsubscribeEndpoint,
                endpointPath: '/api/lists/unsubscribe',
                headers,
                params: {},
                body: {
                  JSON: {
                    listId: 12345,
                    subscribers: [{ email: 'delete-user@example.com' }],
                    campaignId: null,
                    channelUnsubscribe: false,
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [metadataForJob(3)],
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
    id: 'iterable-audience-router-batching-1000',
    name: destType,
    description: 'Batches subscribe requests with hard max of 1000 subscribers',
    scenario: 'Router batching boundary',
    successCriteria: '1001 inputs produce exactly two subscribe batched requests of 1000 and 1',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: largeInsertInputs,
          destType,
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
                endpoint: subscribeEndpoint,
                endpointPath: '/api/lists/subscribe',
                headers,
                params: {},
                body: {
                  JSON: {
                    listId: 12345,
                    subscribers: firstChunkSubscribers,
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: Array.from({ length: 1000 }, (_, i) => metadataForJob(i + 1)),
              batched: true,
              statusCode: 200,
              destination: emailProjectDestination,
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: subscribeEndpoint,
                endpointPath: '/api/lists/subscribe',
                headers,
                params: {},
                body: {
                  JSON: {
                    listId: 12345,
                    subscribers: secondChunkSubscribers,
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [metadataForJob(1001)],
              batched: true,
              statusCode: 200,
              destination: emailProjectDestination,
            },
          ],
        },
      },
    },
  },
  {
    id: 'iterable-audience-router-eu-userid',
    name: destType,
    description: 'Uses EU base URL and userId identifier for userId_based project type',
    scenario: 'EU routing and userId extraction',
    successCriteria:
      'Record event routes to EU subscribe endpoint with subscriber payload based on userId',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: generateRecordPayload({
                action: 'insert',
                identifiers: {
                  userId: 'eu-user-id-1',
                  email: 'ignored@example.com',
                },
              }),
              metadata: metadataForJob(1),
              destination: euDestination,
            },
          ],
          destType,
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
                endpoint: euSubscribeEndpoint,
                endpointPath: '/api/lists/subscribe',
                headers,
                params: {},
                body: {
                  JSON: {
                    listId: 12345,
                    subscribers: [{ userId: 'eu-user-id-1' }],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [metadataForJob(1)],
              batched: true,
              statusCode: 200,
              destination: euDestination,
            },
          ],
        },
      },
    },
  },
  {
    id: 'iterable-audience-router-invalid-missing-identifier',
    name: destType,
    description: 'Returns instrumentation error when required identifier is missing',
    scenario: 'Validation failure for email_based project',
    successCriteria: 'Missing email for email_based destination returns a failed router response',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: generateRecordPayload({
                action: 'insert',
                identifiers: {
                  userId: 'missing-email-user',
                },
              }),
              metadata: metadataForJob(1),
              destination: emailProjectDestination,
            },
          ],
          destType,
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
              metadata: [metadataForJob(1)],
              statusCode: 400,
              destination: emailProjectDestination,
              batched: false,
              error: 'email identifier is required for projectType email_based',
              statTags: routerInstrumentationErrorStatTags,
            },
          ],
        },
      },
    },
  },
  {
    id: 'iterable-audience-router-invalid-config',
    name: destType,
    description: 'Returns configuration error for invalid destination project type',
    scenario: 'Destination config validation failure',
    successCriteria: 'Unsupported projectType returns a failed router response',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: generateRecordPayload({
                action: 'insert',
                identifiers: {
                  email: 'config-failure@example.com',
                },
              }),
              metadata: metadataForJob(1),
              destination: {
                ...destination,
                Config: {
                  ...destination.Config,
                  projectType: 'unsupported_project_type',
                },
              },
            },
          ],
          destType,
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
              metadata: [metadataForJob(1)],
              statusCode: 400,
              destination: {
                ...destination,
                Config: {
                  ...destination.Config,
                  projectType: 'unsupported_project_type',
                },
              },
              batched: false,
              error:
                "projectType: Invalid enum value. Expected 'email_based' | 'hybrid' | 'userId_based', received 'unsupported_project_type'",
              statTags: routerConfigurationErrorStatTags,
            },
          ],
        },
      },
    },
  },
];
