import { authHeader1, secret1 } from '../maskedSecrets';
export const data = [
  {
    name: 'splitio',
    description: 'Test 0',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                traits: {
                  martin: 21.565,
                  trafficTypeName: 'user',
                  vertical: 'restaurant',
                  eventTypeId: 'page_load end to end',
                  timestamp: 1513357833000,
                  GMV: false,
                },
                userId: 'user123',
                messageId: 'c73198a8-41d8-4426-9fd9-de167194d5f3',
                rudderId: 'bda76e3e-87eb-4153-9d1e-e9c2ed48b7a5',
                context: {
                  ip: '14.5.67.21',
                  traits: { abc: 'new-val', key: 'key_user_0', value: '0.93' },
                  library: { name: 'http' },
                },
                type: 'group',
                groupId: 'group1',
                timestamp: '2020-01-21T00:21:34.208Z',
                writeKey: '1pe7u01A7rYOrvacE6WSgI6ESXh',
                receivedAt: '2021-04-19T14:53:18.215+05:30',
                requestIP: '[::1]',
              },
              metadata: { jobId: 1, userId: 'u1' },
              destination: {
                Config: { apiKey: secret1, environment: 'staging', trafficType: 'user' },
              },
            },
          ],
          destType: 'splitio',
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
                endpoint: 'https://events.split.io/api/events',
                endpointPath: 'events',
                headers: { 'Content-Type': 'application/json', Authorization: authHeader1 },
                params: {},
                body: {
                  JSON: {
                    eventTypeId: 'group',
                    key: 'user123',
                    timestamp: 1579566094208,
                    environmentName: 'staging',
                    trafficTypeName: 'user',
                    properties: { martin: 21.565, vertical: 'restaurant', GMV: false },
                  },
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ jobId: 1, userId: 'u1' }],
              batched: false,
              statusCode: 200,
              destination: {
                Config: { apiKey: secret1, environment: 'staging', trafficType: 'user' },
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'splitio',
    description: 'Test 1',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                traits: {
                  martin: 21.565,
                  trafficTypeName: 'user',
                  eventTypeId: 'page_load end to end',
                  timestamp: 1513357833000,
                },
                userId: 'user123',
                messageId: 'c73198a8-41d8-4426-9fd9-de167194d5f3',
                rudderId: 'bda76e3e-87eb-4153-9d1e-e9c2ed48b7a5',
                context: {
                  ip: '14.5.67.21',
                  traits: { abc: 'new-val', key: 'key_user_0' },
                  library: { name: 'http' },
                },
                type: 'identify',
                timestamp: '2020-01-21T00:21:34.208Z',
                writeKey: '1pe7u01A7rYOrvacE6WSgI6ESXh',
                receivedAt: '2021-04-19T14:53:18.215+05:30',
                requestIP: '[::1]',
              },
              metadata: { jobId: 2, userId: 'u1' },
              destination: {
                Config: { apiKey: secret1, environment: 'staging', trafficType: 'user' },
              },
            },
          ],
          destType: 'splitio',
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
                endpoint: 'https://events.split.io/api/events',
                endpointPath: 'events',
                headers: { 'Content-Type': 'application/json', Authorization: authHeader1 },
                params: {},
                body: {
                  JSON: {
                    eventTypeId: 'identify',
                    key: 'user123',
                    timestamp: 1579566094208,
                    environmentName: 'staging',
                    trafficTypeName: 'user',
                    properties: { martin: 21.565 },
                  },
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ jobId: 2, userId: 'u1' }],
              batched: false,
              statusCode: 200,
              destination: {
                Config: { apiKey: secret1, environment: 'staging', trafficType: 'user' },
              },
            },
          ],
        },
      },
    },
  },
];
