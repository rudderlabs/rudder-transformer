import { RouterTestData } from '../../../testTypes';
import { connection, deleteEvent, destType, destination, insertEvent } from '../common';

export const data: RouterTestData[] = [
  {
    id: 'iterable-audience-router-basic',
    name: destType,
    description: 'Batches subscribe/unsubscribe for record events',
    scenario: 'Business',
    successCriteria: 'Delete batches are emitted before subscribe batches',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [insertEvent, deleteEvent],
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
              batched: true,
              destination,
              statusCode: 200,
              metadata: [deleteEvent.metadata],
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.iterable.com/api/lists/unsubscribe',
                headers: {
                  'Content-Type': 'application/json',
                  'Api-Key': 'test-api-key',
                },
                params: {},
                files: {},
                body: {
                  JSON: {
                    listId: connection.config.destination.audienceId,
                    subscribers: [{ email: 'user2@example.com' }],
                    campaignId: null,
                    channelUnsubscribe: false,
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
              },
            },
            {
              batched: true,
              destination,
              statusCode: 200,
              metadata: [insertEvent.metadata],
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.iterable.com/api/lists/subscribe',
                headers: {
                  'Content-Type': 'application/json',
                  'Api-Key': 'test-api-key',
                },
                params: {},
                files: {},
                body: {
                  JSON: {
                    listId: connection.config.destination.audienceId,
                    subscribers: [{ email: 'user@example.com' }],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
              },
            },
          ],
        },
      },
    },
  },
];
