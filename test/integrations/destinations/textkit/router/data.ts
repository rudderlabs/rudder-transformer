import { RouterTestData } from '../../../testTypes';
import { destination, metadata, requestBody } from '../common';
import { authHeader1 } from '../maskedSecrets';

const messageId = '8bc79b03-2a5c-4615-b2da-54c0aaaaaae8';

export const data = [
  {
    id: 'textkit-router-100',
    name: 'textkit',
    description: 'A valid event is sent and an invalid one fails on its own',
    scenario: 'Router request with one valid and one invalid event',
    successCriteria: 'Each event gets its own result',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: { type: 'track', event: 'Trial Started', userId: 'user-1', messageId },
              metadata,
              destination: destination(),
            },
            {
              message: { type: 'track', event: 'Trial Started' },
              metadata: { ...metadata, jobId: 2 },
              destination: destination(),
            },
          ],
          destType: 'textkit',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              metadata: [{ ...metadata, jobId: 2 }],
              destination: destination(),
              batched: false,
              statusCode: 400,
              error: 'userId or phone is required for track call',
              statTags: {
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                destType: 'TEXTKIT',
                module: 'destination',
                implementation: 'cdkV2',
                destinationId: 'default-destination',
                workspaceId: 'default-workspace',
                feature: 'router',
              },
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.jointextkit.com/v1/track',
                headers: {
                  Authorization: authHeader1,
                  'Content-Type': 'application/json',
                  'Idempotency-Key': messageId,
                },
                params: {},
                body: requestBody({ event: 'Trial_Started', user_id: 'user-1' }),
                files: {},
              },
              metadata: [metadata],
              destination: destination(),
              batched: false,
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
] as unknown as RouterTestData[];
