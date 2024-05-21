import { generalProperties, userProperties } from './basicProperties';
import { context, destination, destinationWithoutHeaders } from '../commonConfig';

export const data = [
  {
    name: 'webhook',
    id: 'Test 0 - router',
    description: 'Two Track calls with one having headers from config',
    scenario: 'Framework',
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
                anonymousId: 'anon_1',
                context,
                event: 'spin_result',
                integrations: { All: true },
                message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                properties: generalProperties,
                timestamp: '2019-09-01T15:46:51.693229+05:30',
                type: 'track',
                user_properties: userProperties,
              },
              metadata: { jobId: 2, userId: 'u1' },
              destination,
            },
            {
              message: {
                anonymousId: 'anon_2',
                context: context,
                event: 'spin_result',
                integrations: { All: true },
                message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                properties: generalProperties,
                timestamp: '2019-09-01T15:46:51.693229+05:30',
                type: 'track',
                user_properties: userProperties,
              },
              metadata: { jobId: 3, userId: 'u1' },
              destination: destinationWithoutHeaders,
            },
          ],
          destType: 'webhook',
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
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  JSON: {
                    timestamp: '2019-09-01T15:46:51.693229+05:30',
                    user_properties: userProperties,
                    integrations: { All: true },
                    event: 'spin_result',
                    message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                    anonymousId: 'anon_1',
                    context,
                    type: 'track',
                    properties: generalProperties,
                  },
                  FORM: {},
                },
                files: {},
                endpoint: 'http://6b0e6a60.ngrok.io',
                userId: 'anon_1',
                headers: { 'content-type': 'application/json', test2: 'value2' },
                version: '1',
                params: {},
                type: 'REST',
                method: 'POST',
              },
              metadata: [{ jobId: 2, userId: 'u1' }],
              batched: false,
              statusCode: 200,
              destination,
            },
            {
              batchedRequest: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  JSON: {
                    timestamp: '2019-09-01T15:46:51.693229+05:30',
                    user_properties: userProperties,
                    integrations: { All: true },
                    event: 'spin_result',
                    message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                    anonymousId: 'anon_2',
                    context,
                    type: 'track',
                    properties: generalProperties,
                  },
                  FORM: {},
                },
                files: {},
                endpoint: 'http://6b0e6a60.ngrok.io',
                userId: 'anon_2',
                headers: { 'content-type': 'application/json' },
                version: '1',
                params: {},
                type: 'REST',
                method: 'POST',
              },
              metadata: [{ jobId: 3, userId: 'u1' }],
              batched: false,
              statusCode: 200,
              destination: destinationWithoutHeaders,
            },
          ],
        },
      },
    },
  },
  {
    name: 'webhook',
    id: 'Test 1 - router',
    description: 'Identify payload with 3 events in 1 batch with one payload with no context',
    scenario: 'Framework',
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
                anonymousId: 'anon_1',
                channel: 'mobile',
                context,
                integrations: {
                  All: true,
                },
                messageId: '1590431830865-3be680d6-7dcd-4b05-8460-f3acc30046d9',
                originalTimestamp: '2020-05-25T18:37:10.865Z',
                sentAt: '2020-05-25T18:37:10.917Z',
                type: 'identify',
                userId: 'sample_user_id',
              },
              metadata: { jobId: 2, userId: 'u1' },
              destination: destination,
            },
            {
              message: {
                anonymousId: 'anon_2',
                channel: 'mobile',
                context,
                integrations: {
                  All: true,
                },
                messageId: '23432324-3be680d6-7dcd-4b05-8460-f3acc30046d9',
                type: 'identify',
                userId: 'sample_user_id',
              },
              metadata: { jobId: 3, userId: 'u1' },
              destination: destinationWithoutHeaders,
            },
            {
              message: {
                anonymousId: 'anon_3',
                channel: 'mobile',
                integrations: {
                  All: true,
                },
                messageId: '23432324-3be680d6-7dcd-4b05-8460-f3acc30046d9',
                type: 'identify',
                userId: 'sample_user_id',
              },
              metadata: { jobId: 4, userId: 'u1' },
              destination: destinationWithoutHeaders,
            },
          ],
          destType: 'webhook',
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
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  JSON: {
                    anonymousId: 'anon_1',
                    channel: 'mobile',
                    context,
                    integrations: {
                      All: true,
                    },
                    messageId: '1590431830865-3be680d6-7dcd-4b05-8460-f3acc30046d9',
                    originalTimestamp: '2020-05-25T18:37:10.865Z',
                    sentAt: '2020-05-25T18:37:10.917Z',
                    type: 'identify',
                    userId: 'sample_user_id',
                  },
                  FORM: {},
                },
                files: {},
                endpoint: 'http://6b0e6a60.ngrok.io',
                userId: 'anon_1',
                headers: { 'content-type': 'application/json', test2: 'value2' },
                version: '1',
                params: {},
                type: 'REST',
                method: 'POST',
              },
              metadata: [{ jobId: 2, userId: 'u1' }],
              batched: false,
              statusCode: 200,
              destination,
            },
            {
              batchedRequest: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  JSON: {
                    anonymousId: 'anon_2',
                    channel: 'mobile',
                    context,
                    integrations: {
                      All: true,
                    },
                    messageId: '23432324-3be680d6-7dcd-4b05-8460-f3acc30046d9',
                    type: 'identify',
                    userId: 'sample_user_id',
                  },
                  FORM: {},
                },
                files: {},
                endpoint: 'http://6b0e6a60.ngrok.io',
                userId: 'anon_2',
                headers: { 'content-type': 'application/json' },
                version: '1',
                params: {},
                type: 'REST',
                method: 'POST',
              },
              metadata: [{ jobId: 3, userId: 'u1' }],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  webhookUrl: 'http://6b0e6a60.ngrok.io',
                },
                DestinationDefinition: { Config: { cdkV2Enabled: true } },
              },
            },
            {
              batchedRequest: {
                body: {
                  XML: {},
                  JSON_ARRAY: {},
                  JSON: {
                    anonymousId: 'anon_3',
                    channel: 'mobile',
                    integrations: {
                      All: true,
                    },
                    messageId: '23432324-3be680d6-7dcd-4b05-8460-f3acc30046d9',
                    type: 'identify',
                    userId: 'sample_user_id',
                  },
                  FORM: {},
                },
                files: {},
                endpoint: 'http://6b0e6a60.ngrok.io',
                userId: 'anon_3',
                headers: { 'content-type': 'application/json' },
                version: '1',
                params: {},
                type: 'REST',
                method: 'POST',
              },
              metadata: [{ jobId: 4, userId: 'u1' }],
              batched: false,
              statusCode: 200,
              destination: destinationWithoutHeaders,
            },
          ],
        },
      },
    },
  },
];
